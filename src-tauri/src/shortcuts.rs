use crate::capture_and_format;
use crate::commands::{copy_text, update_shortcut_status, ShortcutStatus};
use tauri::{AppHandle, Emitter, Wry};
use tauri_plugin_global_shortcut::{
    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
};
use thiserror::Error;

pub const DEFAULT_SHORTCUT: &str = "Alt+C";

#[derive(Debug, Error)]
pub enum ShortcutError {
    #[error("{0}")]
    Message(String),
}

fn parse_shortcut(raw: &str) -> Result<Shortcut, ShortcutError> {
    let normalized = raw.trim().to_lowercase().replace(' ', "");
    let parts: Vec<&str> = normalized.split('+').filter(|p| !p.is_empty()).collect();
    if parts.is_empty() {
        return Err(ShortcutError::Message("Empty shortcut".into()));
    }

    let mut modifiers = Modifiers::empty();
    let mut key: Option<Code> = None;

    for part in parts {
        match part {
            "ctrl" | "control" | "cmdorctrl" => modifiers |= Modifiers::CONTROL,
            "alt" | "option" => modifiers |= Modifiers::ALT,
            "shift" => modifiers |= Modifiers::SHIFT,
            "super" | "meta" | "cmd" | "win" => modifiers |= Modifiers::SUPER,
            "c" => key = Some(Code::KeyC),
            "d" => key = Some(Code::KeyD),
            "e" => key = Some(Code::KeyE),
            "p" => key = Some(Code::KeyP),
            "x" => key = Some(Code::KeyX),
            "z" => key = Some(Code::KeyZ),
            other => {
                return Err(ShortcutError::Message(format!(
                    "Unsupported shortcut key: {other}"
                )));
            }
        }
    }

    let code = key.ok_or_else(|| {
        ShortcutError::Message("Shortcut must include a letter key (e.g. C)".into())
    })?;

    if modifiers.is_empty() {
        return Err(ShortcutError::Message(
            "Shortcut must include a modifier (Alt/Ctrl/Shift)".into(),
        ));
    }

    Ok(Shortcut::new(Some(modifiers), code))
}

fn capture_handler(app_handle: &AppHandle) {
    let _ = crate::pick::stop_pick_mode(app_handle.clone());

    match capture_and_format() {
        Ok(captured) => {
            if let Err(error) = copy_text(app_handle, &captured.copied_text) {
                let _ = app_handle.emit("shortcut-error", error);
                return;
            }
            let _ = app_handle.emit("color-captured", captured);
        }
        Err(error) => {
            let _ = app_handle.emit("shortcut-error", error);
        }
    }
}

#[cfg(desktop)]
pub fn build_plugin() -> tauri::plugin::TauriPlugin<Wry> {
    tauri_plugin_global_shortcut::Builder::new()
        .with_handler(|app_handle, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                capture_handler(app_handle);
            }
        })
        .build()
}

#[cfg(desktop)]
pub fn register_shortcut(app: &AppHandle, shortcut_str: &str) -> Result<(), ShortcutError> {
    let shortcut = parse_shortcut(shortcut_str)?;

    // Clear previous registrations so the configurable shortcut can replace them.
    let _ = app.global_shortcut().unregister_all();

    match app.global_shortcut().register(shortcut) {
        Ok(()) => {
            update_shortcut_status(
                app,
                ShortcutStatus {
                    registered: true,
                    shortcut: shortcut_str.to_string(),
                    error: None,
                },
            );
            Ok(())
        }
        Err(error) => {
            let message = format!(
                "Could not register {shortcut_str}. Another app may own it. ({error})"
            );
            update_shortcut_status(
                app,
                ShortcutStatus {
                    registered: false,
                    shortcut: shortcut_str.to_string(),
                    error: Some(message.clone()),
                },
            );
            Err(ShortcutError::Message(message))
        }
    }
}

#[cfg(desktop)]
pub fn register_default_shortcut(app: &AppHandle) -> Result<(), ShortcutError> {
    register_shortcut(app, DEFAULT_SHORTCUT)
}

#[cfg(not(desktop))]
pub fn register_shortcut(_app: &AppHandle, _shortcut_str: &str) -> Result<(), ShortcutError> {
    Err(ShortcutError::Message(
        "Global shortcuts are unavailable on this platform".to_string(),
    ))
}

#[cfg(not(desktop))]
pub fn register_default_shortcut(_app: &AppHandle) -> Result<(), ShortcutError> {
    Err(ShortcutError::Message(
        "Global shortcuts are unavailable on this platform".to_string(),
    ))
}
