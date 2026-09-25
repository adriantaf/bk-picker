use tauri::{App, AppHandle, Manager};

pub fn configure_main_window(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(window) = app.get_webview_window("main") {
        // Solid elevated surface fallback: no acrylic/mica in Phase 1
        // (those APIs are unstable across Windows builds with WebView2).
        window.set_shadow(true)?;
        let _ = window;
    }
    Ok(())
}

pub fn set_always_on_top(app: &AppHandle, enabled: bool) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "Main window not found".to_string())?;
    window
        .set_always_on_top(enabled)
        .map_err(|error| format!("set_always_on_top failed: {error}"))
}
