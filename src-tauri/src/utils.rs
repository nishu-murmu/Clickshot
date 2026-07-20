use crate::capture;
use std::env;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

/// Function handler which opens up the initial window for taking screenshot.
pub fn open_overlay(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        window.close().ok();
    }
    WebviewWindowBuilder::new(app, "main", WebviewUrl::App("main.html".into()))
        .title("ClickX")
        .transparent(true)
        .fullscreen(true)
        .focused(true)
        .build()
        .unwrap();
    capture::capture_screenshot(&app);
}

/// Gets user's name.
pub fn get_user_name() -> Option<String> {
    env::var("USER").or_else(|_| env::var("USERNAME")).ok()
}
