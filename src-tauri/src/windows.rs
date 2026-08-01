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
    .title("Background")
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
        .background_color(tauri::utils::config::Color(22, 22, 24, 255))
        .focused(true)
        .closable(true)
        .skip_taskbar(true)
        .build()
        .unwrap();
}

pub fn open_settings_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("settings") {
        window.close().ok();
    }
    WebviewWindowBuilder::new(
        app,
        "settings",
        WebviewUrl::App("html/settings.html".into()),
    )
    .decorations(false)
    .transparent(true)
    .inner_size(800.0, 560.0)
    .resizable(false)
    .center()
    .focused(true)
    .build()
    .unwrap();
}

pub fn open_about_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("about") {
        window.close().ok();
    }
    WebviewWindowBuilder::new(app, "about", WebviewUrl::App("html/about.html".into()))
        .decorations(false)
        .transparent(true)
        .inner_size(480.0, 380.0)
        .resizable(false)
        .center()
        .focused(true)
        .closable(true)
        .build()
        .unwrap();
}
