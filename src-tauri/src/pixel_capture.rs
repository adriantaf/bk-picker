pub const LOUPE_RADIUS: i32 = 6;
pub const LOUPE_SIZE: u32 = (LOUPE_RADIUS * 2 + 1) as u32;

pub struct LoupeRaw {
    pub x: i32,
    pub y: i32,
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub size: u32,
    pub pixels: Vec<u8>,
}

#[cfg(windows)]
mod windows_impl {
    use super::{LoupeRaw, LOUPE_RADIUS, LOUPE_SIZE};
    use windows::Win32::Foundation::{COLORREF, POINT};
    use windows::Win32::Graphics::Gdi::{
        BitBlt, CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, GetDC, GetPixel,
        ReleaseDC, SelectObject, BITMAPINFO, BITMAPINFOHEADER, DIB_RGB_COLORS, HGDIOBJ, SRCCOPY,
    };
    use windows::Win32::UI::WindowsAndMessaging::GetCursorPos;

    pub fn cursor_position() -> Result<(i32, i32), String> {
        unsafe {
            let mut point = POINT::default();
            GetCursorPos(&mut point)
                .map_err(|error| format!("GetCursorPos failed: {error}"))?;
            Ok((point.x, point.y))
        }
    }

    fn colorref_to_rgb(color: COLORREF) -> Option<(u8, u8, u8)> {
        if color.0 == u32::MAX {
            return None;
        }
        Some((
            (color.0 & 0xFF) as u8,
            ((color.0 >> 8) & 0xFF) as u8,
            ((color.0 >> 16) & 0xFF) as u8,
        ))
    }

    pub fn capture_color_under_cursor() -> Result<(u8, u8, u8), String> {
        let (x, y) = cursor_position()?;
        if let Ok(sample) = capture_region(x, y, 1) {
            if sample.len() >= 3 {
                return Ok((sample[0], sample[1], sample[2]));
            }
        }

        unsafe {
            let hdc = GetDC(None);
            if hdc.is_invalid() {
                return Err("GetDC failed for the screen device context".to_string());
            }
            let color: COLORREF = GetPixel(hdc, x, y);
            let _ = ReleaseDC(None, hdc);
            colorref_to_rgb(color).ok_or_else(|| {
                "GetPixel could not read this pixel (layered or protected surface)".to_string()
            })
        }
    }

    /// Fast screen grab via BitBlt + top-down 32bpp DIB (BGRA → RGB).
    fn capture_region(cx: i32, cy: i32, size: i32) -> Result<Vec<u8>, String> {
        unsafe {
            let screen_dc = GetDC(None);
            if screen_dc.is_invalid() {
                return Err("GetDC failed".into());
            }

            let mem_dc = CreateCompatibleDC(Some(screen_dc));
            if mem_dc.is_invalid() {
                let _ = ReleaseDC(None, screen_dc);
                return Err("CreateCompatibleDC failed".into());
            }

            let bmi = BITMAPINFO {
                bmiHeader: BITMAPINFOHEADER {
                    biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                    biWidth: size,
                    biHeight: -size,
                    biPlanes: 1,
                    biBitCount: 32,
                    biCompression: 0, // BI_RGB
                    biSizeImage: 0,
                    biXPelsPerMeter: 0,
                    biYPelsPerMeter: 0,
                    biClrUsed: 0,
                    biClrImportant: 0,
                },
                bmiColors: [Default::default(); 1],
            };

            let mut bits: *mut std::ffi::c_void = std::ptr::null_mut();
            let bitmap = match CreateDIBSection(
                Some(mem_dc),
                &bmi,
                DIB_RGB_COLORS,
                &mut bits,
                None,
                0,
            ) {
                Ok(value) => value,
                Err(error) => {
                    let _ = DeleteDC(mem_dc);
                    let _ = ReleaseDC(None, screen_dc);
                    return Err(format!("CreateDIBSection failed: {error}"));
                }
            };

            if bitmap.is_invalid() || bits.is_null() {
                let _ = DeleteDC(mem_dc);
                let _ = ReleaseDC(None, screen_dc);
                return Err("CreateDIBSection returned null".into());
            }

            let old = SelectObject(mem_dc, HGDIOBJ(bitmap.0));
            let src_x = cx - size / 2;
            let src_y = cy - size / 2;

            let blit_ok =
                BitBlt(mem_dc, 0, 0, size, size, Some(screen_dc), src_x, src_y, SRCCOPY).is_ok();

            let mut pixels = Vec::with_capacity((size * size * 3) as usize);
            if blit_ok {
                let stride = size as usize * 4;
                let slice =
                    std::slice::from_raw_parts(bits as *const u8, stride * size as usize);
                for row in 0..size as usize {
                    let row_start = row * stride;
                    for col in 0..size as usize {
                        let i = row_start + col * 4;
                        pixels.push(slice[i + 2]); // R
                        pixels.push(slice[i + 1]); // G
                        pixels.push(slice[i]); // B
                    }
                }
            }

            let _ = SelectObject(mem_dc, old);
            let _ = DeleteObject(HGDIOBJ(bitmap.0));
            let _ = DeleteDC(mem_dc);
            let _ = ReleaseDC(None, screen_dc);

            if !blit_ok || pixels.is_empty() {
                return Err("BitBlt screen capture failed".into());
            }

            Ok(pixels)
        }
    }

    pub fn capture_loupe_sample() -> Result<LoupeRaw, String> {
        let (cx, cy) = cursor_position()?;
        let size = LOUPE_SIZE as i32;
        let pixels = capture_region(cx, cy, size).or_else(|_| unsafe {
            let hdc = GetDC(None);
            if hdc.is_invalid() {
                return Err::<Vec<u8>, String>("GetDC failed".to_string());
            }
            let mut fallback = Vec::with_capacity((size * size * 3) as usize);
            for dy in -LOUPE_RADIUS..=LOUPE_RADIUS {
                for dx in -LOUPE_RADIUS..=LOUPE_RADIUS {
                    let color: COLORREF = GetPixel(hdc, cx + dx, cy + dy);
                    let (r, g, b) = colorref_to_rgb(color).unwrap_or((0, 0, 0));
                    fallback.push(r);
                    fallback.push(g);
                    fallback.push(b);
                }
            }
            let _ = ReleaseDC(None, hdc);
            Ok(fallback)
        })?;

        let mid =
            (LOUPE_SIZE as usize / 2) * (LOUPE_SIZE as usize) + (LOUPE_SIZE as usize / 2);
        let i = mid * 3;
        let r = *pixels.get(i).unwrap_or(&0);
        let g = *pixels.get(i + 1).unwrap_or(&0);
        let b = *pixels.get(i + 2).unwrap_or(&0);

        Ok(LoupeRaw {
            x: cx,
            y: cy,
            r,
            g,
            b,
            size: LOUPE_SIZE,
            pixels,
        })
    }
}

#[cfg(windows)]
pub use windows_impl::{
    capture_color_under_cursor, capture_loupe_sample, cursor_position,
};

#[cfg(not(windows))]
pub fn capture_color_under_cursor() -> Result<(u8, u8, u8), String> {
    Err("Pixel capture is only implemented for Windows".to_string())
}

#[cfg(not(windows))]
pub fn capture_loupe_sample() -> Result<LoupeRaw, String> {
    Err("Loupe capture is only implemented for Windows".to_string())
}

#[cfg(not(windows))]
pub fn cursor_position() -> Result<(i32, i32), String> {
    Err("Cursor position is only implemented for Windows".to_string())
}
