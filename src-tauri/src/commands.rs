use crate::capture_and_format;
use serde::Serialize;
use std::sync::atomic::AtomicBool;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CapturedColor {
    pub hex: String,
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub copied_text: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ShortcutStatus {
    pub registered: bool,
    pub shortcut: String,
    pub error: Option<String>,
}

pub struct AppState {
    pub shortcut: Mutex<ShortcutStatus>,
    pub pick_mode: AtomicBool,
}

#[tauri::command]
pub fn capture_pixel_under_cursor(app: AppHandle) -> Result<CapturedColor, String> {
    let _ = crate::pick::stop_pick_mode(app.clone());
    let captured = capture_and_format()?;
    copy_text(&app, &captured.copied_text)?;
    Ok(captured)
}

#[tauri::command]
pub fn get_shortcut_status(state: State<'_, AppState>) -> Result<ShortcutStatus, String> {
    state
        .shortcut
        .lock()
        .map(|status| status.clone())
        .map_err(|_| "Failed to read shortcut status".to_string())
}

#[tauri::command]
pub fn set_always_on_top(app: AppHandle, enabled: bool) -> Result<(), String> {
    crate::window::set_always_on_top(&app, enabled)
}

#[tauri::command]
pub fn start_pick_mode(app: AppHandle) -> Result<(), String> {
    crate::pick::start_pick_mode(app)
}

#[tauri::command]
pub fn stop_pick_mode(app: AppHandle) -> Result<(), String> {
    crate::pick::stop_pick_mode(app)
}

#[tauri::command]
pub fn is_pick_mode(app: AppHandle) -> bool {
    crate::pick::is_pick_mode(app)
}

#[tauri::command]
pub fn set_global_shortcut(app: AppHandle, shortcut: String) -> Result<ShortcutStatus, String> {
    crate::shortcuts::register_shortcut(&app, &shortcut).map_err(|error| error.to_string())?;
    app.state::<AppState>()
        .shortcut
        .lock()
        .map(|status| status.clone())
        .map_err(|_| "Failed to read shortcut status".to_string())
}

pub fn copy_text(app: &AppHandle, text: &str) -> Result<(), String> {
    use tauri_plugin_clipboard_manager::ClipboardExt;
    app.clipboard()
        .write_text(text.to_string())
        .map_err(|error| format!("Clipboard write failed: {error}"))
}

pub fn update_shortcut_status(app: &AppHandle, status: ShortcutStatus) {
    if let Some(state) = app.try_state::<AppState>() {
        if let Ok(mut guard) = state.shortcut.lock() {
            *guard = status;
        }
    }
}
