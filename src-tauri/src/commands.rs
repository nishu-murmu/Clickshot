use tauri::{Manager};
use crate::{capture, windows};

#[tauri::command]
pub fn close_overlay_command(app: tauri::AppHandle) {
    if let Some(has_overlay) = app.get_webview_window("overlay") {
        has_overlay.close().ok();
    }
}

#[tauri::command(rename_all = "snake_case")]
pub fn region_screenshot_command(app: tauri::AppHandle, cropped_base_64_image: String) {
    capture::base64_to_image(cropped_base_64_image, &app);
}

#[tauri::command(rename_all = "snake_case")]
pub fn full_screenshot_command(app: tauri::AppHandle, base_64_image: String) {
    capture::base64_to_image(base_64_image, &app);
}

#[tauri::command(rename_all = "snake_case")]
pub fn open_edit_window_command(app: tauri::AppHandle) {
    windows::open_edit_window(&app);
}
