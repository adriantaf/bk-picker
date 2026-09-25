mod commands;
mod pick;
mod pixel_capture;
mod shortcuts;
mod window;

use commands::{AppState, CapturedColor, ShortcutStatus};
use shortcuts::{register_default_shortcut, DEFAULT_SHORTCUT};
use std::sync::atomic::AtomicBool;
use std::sync::Mutex;
use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            shortcut: Mutex::new(ShortcutStatus {
                registered: false,
                shortcut: DEFAULT_SHORTCUT.to_string(),
                error: None,
            }),
            pick_mode: AtomicBool::new(false),
        })
        .invoke_handler(tauri::generate_handler![
            commands::capture_pixel_under_cursor,
            commands::get_shortcut_status,
            commands::set_always_on_top,
            commands::start_pick_mode,
            commands::stop_pick_mode,
            commands::is_pick_mode,
            commands::set_global_shortcut,
        ]);

    #[cfg(desktop)]
    {
        builder = builder.plugin(shortcuts::build_plugin());
    }

    builder
        .setup(|app| {
            window::configure_main_window(app)?;
            let _ = crate::pick::prepare_loupe_window(app.handle());

            #[cfg(desktop)]
            {
                if let Err(error) = register_default_shortcut(app.handle()) {
                    let message = error.to_string();
                    if let Some(state) = app.try_state::<AppState>() {
                        if let Ok(mut status) = state.shortcut.lock() {
                            status.registered = false;
                            status.error = Some(message.clone());
                        }
                    }
                    let _ = app.emit("shortcut-error", message);
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running BK Picker");
}

/// Shared helper used by the shortcut handler and the IPC command.
pub(crate) fn capture_and_format() -> Result<CapturedColor, String> {
    let (r, g, b) = pixel_capture::capture_color_under_cursor()?;
    let hex = format!("#{r:02X}{g:02X}{b:02X}");
    Ok(CapturedColor {
        hex: hex.clone(),
        r,
        g,
        b,
        copied_text: hex,
    })
}
