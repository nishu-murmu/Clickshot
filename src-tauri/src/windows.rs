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

pub fn open_edit_window(app: &tauri::AppHandle) {
    WebviewWindowBuilder::new(app, "edit", WebviewUrl::App("html/edit.html".into()))
        .title("ClickX-Edit")
        .transparent(true)
        .focused(true)
        .build()
        .unwrap();
}
