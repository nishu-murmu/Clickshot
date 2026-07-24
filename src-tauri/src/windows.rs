use tauri::{WebviewUrl, WebviewWindowBuilder};

pub fn open_overlay_window(app: &tauri::AppHandle) {
    WebviewWindowBuilder::new(app, "overlay", WebviewUrl::App("html/overlay.html".into()))
        .title("ClickX")
        .transparent(true)
        .fullscreen(true)
        .focused(true)
        .build()
        .unwrap();
}

pub fn open_settings_window(app: &tauri::AppHandle) {
    WebviewWindowBuilder::new(app, "settings", WebviewUrl::App("html/settings.html".into()))
        .title("ClickX-Settings")
        .transparent(true)
        .focused(true)
        .build()
        .unwrap();
}
