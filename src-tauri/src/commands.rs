use tauri::{Manager};
use crate::{capture, windows};

#[tauri::command]
pub fn close_overlay_window_command(app: tauri::AppHandle) {
    if let Some(has_overlay) = app.get_webview_window("overlay") {
        has_overlay.close().ok();
    }
}

#[tauri::command]
pub fn close_edit_window_command(app: tauri::AppHandle) {
    if let Some(has_overlay) = app.get_webview_window("edit") {
        has_overlay.close().ok();
    }
}

#[tauri::command]
pub fn close_settings_window_command(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("settings") {
        window.close().ok();
    }
}

#[tauri::command]
pub fn close_about_window_command(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("about") {
        window.close().ok();
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

#[tauri::command(rename_all = "snake_case")]
pub fn open_settings_window_command(app: tauri::AppHandle) {
    windows::open_settings_window(&app);
}

#[tauri::command(rename_all = "snake_case")]
pub fn open_about_window_command(app: tauri::AppHandle) {
    windows::open_about_window(&app);
}