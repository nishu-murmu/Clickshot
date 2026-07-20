use tauri::{Manager};

use crate::capture;

#[tauri::command]
pub fn close_overlay_command(app: tauri::AppHandle) {
    if let Some(has_overlay) = app.get_webview_window("main") {
        has_overlay.close().ok();
    }
}

#[tauri::command]
pub fn region_screenshot_command(app: tauri::AppHandle, cropped_base_64_image: String) {
    capture::base64_to_image(cropped_base_64_image, &app);
}
