use crate::capture_and_format;
use crate::commands::{copy_text, AppState};
use crate::pixel_capture::{capture_loupe_sample, LoupeRaw};
use serde::Serialize;
use std::sync::atomic::Ordering;
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager, PhysicalPosition};

const LOUPE_LABEL: &str = "loupe";

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoupeUpdate {
    pub x: i32,
    pub y: i32,
    pub hex: String,
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub size: u32,
    pub pixels: Vec<u8>,
}

impl From<LoupeRaw> for LoupeUpdate {
    fn from(raw: LoupeRaw) -> Self {
        Self {
            x: raw.x,
            y: raw.y,
            hex: format!("#{:02X}{:02X}{:02X}", raw.r, raw.g, raw.b),
            r: raw.r,
            g: raw.g,
            b: raw.b,
            size: raw.size,
            pixels: raw.pixels,
        }
    }
}

fn loupe_window(app: &AppHandle) -> Result<tauri::WebviewWindow, String> {
    app.get_webview_window(LOUPE_LABEL)
        .ok_or_else(|| "Loupe window missing from tauri.conf".to_string())
}

fn position_loupe(app: &AppHandle, cursor_x: i32, cursor_y: i32) {
    if let Ok(window) = loupe_window(app) {
        // Offset so the loupe never covers the sampled pixel.
        let _ = window.set_position(PhysicalPosition::new(cursor_x + 36, cursor_y + 36));
    }
}

#[cfg(windows)]
fn is_key_down(vk: i32) -> bool {
    use windows::Win32::UI::Input::KeyboardAndMouse::GetAsyncKeyState;
    unsafe { GetAsyncKeyState(vk) as u16 & 0x8000 != 0 }
}

#[cfg(not(windows))]
fn is_key_down(_vk: i32) -> bool {
    false
}

/// Ensure the loupe webview is ready (called once at startup).
pub fn prepare_loupe_window(app: &AppHandle) -> Result<(), String> {
    let loupe = loupe_window(app)?;
    let _ = loupe.set_always_on_top(true);
    let _ = loupe.hide();
    Ok(())
}

pub fn start_pick_mode(app: AppHandle) -> Result<(), String> {
    let state = app.state::<AppState>();
    if state.pick_mode.swap(true, Ordering::SeqCst) {
        // Already picking — keep loupe visible.
        if let Ok(loupe) = loupe_window(&app) {
            let _ = loupe.show();
            let _ = loupe.set_always_on_top(true);
        }
        return Ok(());
    }

    let loupe = loupe_window(&app)?;
    loupe
        .set_always_on_top(true)
        .map_err(|error| format!("loupe always_on_top failed: {error}"))?;

    // Show immediately so the loupe is visible for the whole picking session.
    loupe
        .show()
        .map_err(|error| format!("loupe show failed: {error}"))?;

    if let Ok((x, y)) = crate::pixel_capture::cursor_position() {
        position_loupe(&app, x, y);
    }

    // Push a first frame ASAP so the canvas is not empty.
    if let Ok(raw) = capture_loupe_sample() {
        let update = LoupeUpdate::from(raw);
        position_loupe(&app, update.x, update.y);
        let _ = app.emit("loupe-update", &update);
    }

    let _ = app.emit("pick-started", ());

    let app_handle = app.clone();
    thread::spawn(move || {
        let mut armed = false;
        let mut frames_waited = 0_u32;
        let mut was_down = true;
        let mut last_x = i32::MIN;
        let mut last_y = i32::MIN;
        let mut last_hex = String::new();

        while app_handle
            .state::<AppState>()
            .pick_mode
            .load(Ordering::SeqCst)
        {
            // Keep the loupe visible for the entire picking session.
            if let Ok(window) = loupe_window(&app_handle) {
                let _ = window.show();
            }

            frames_waited = frames_waited.saturating_add(1);
            if frames_waited > 6 {
                armed = true;
            }

            match capture_loupe_sample() {
                Ok(raw) => {
                    let moved = raw.x != last_x || raw.y != last_y;
                    let update = LoupeUpdate::from(raw);
                    let color_changed = update.hex != last_hex;

                    if moved {
                        position_loupe(&app_handle, update.x, update.y);
                        last_x = update.x;
                        last_y = update.y;
                    }

                    // Emit when cursor moves or color under cursor changes.
                    if moved || color_changed {
                        last_hex = update.hex.clone();
                        let _ = app_handle.emit("loupe-update", &update);
                    }
                }
                Err(error) => {
                    let _ = app_handle.emit("shortcut-error", error);
                }
            }

            let left_down = is_key_down(0x01);
            if armed {
                if was_down && !left_down {
                    match capture_and_format() {
                        Ok(captured) => {
                            if let Err(error) = copy_text(&app_handle, &captured.copied_text) {
                                let _ = app_handle.emit("shortcut-error", error);
                            } else {
                                let _ = app_handle.emit("color-captured", captured);
                            }
                        }
                        Err(error) => {
                            let _ = app_handle.emit("shortcut-error", error);
                        }
                    }
                    let _ = stop_pick_mode(app_handle.clone());
                    break;
                }

                if is_key_down(0x1B) {
                    let _ = app_handle.emit("pick-cancelled", ());
                    let _ = stop_pick_mode(app_handle.clone());
                    break;
                }
            }
            was_down = left_down;

            // ~60 FPS target; BitBlt keeps this affordable vs GetPixel loops.
            thread::sleep(Duration::from_millis(16));
        }
    });

    Ok(())
}

pub fn stop_pick_mode(app: AppHandle) -> Result<(), String> {
    let state = app.state::<AppState>();
    state.pick_mode.store(false, Ordering::SeqCst);

    if let Ok(loupe) = loupe_window(&app) {
        let _ = loupe.hide();
    }

    let _ = app.emit("pick-stopped", ());
    Ok(())
}

pub fn is_pick_mode(app: AppHandle) -> bool {
    app.state::<AppState>().pick_mode.load(Ordering::SeqCst)
}
