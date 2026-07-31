// use crate::menus;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

pub fn open_background_window(app: &tauri::AppHandle) {
    if let Some(_) = app.get_webview_window("background") {
        return;
    }
    WebviewWindowBuilder::new(
        app,
        "background",
        WebviewUrl::App("html/background.html".into()),
    )
    .title("ClickShot Background")
    .visible(false)
    .skip_taskbar(true)
    .decorations(false)
    .build()
    .unwrap();
}

pub fn close_background_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("background") {
        window.close().ok();
    }
}

pub fn open_overlay_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("overlay") {
        window.close().ok();
    }
    WebviewWindowBuilder::new(app, "overlay", WebviewUrl::App("html/overlay.html".into()))
        .title("ClickShot")
        .transparent(true)
        .fullscreen(true)
        .focused(true)
        .build()
        .unwrap();
}

pub fn open_edit_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("edit") {
        window.close().ok();
    }
    WebviewWindowBuilder::new(app, "edit", WebviewUrl::App("html/edit.html".into()))
        .title("ClickShot Edit")
        .transparent(true)
        .focused(true)
        .closable(true)
        .skip_taskbar(false)
        // .menu(menus::init(&app))
        .build()
        .unwrap();
}
