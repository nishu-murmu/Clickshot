use crate::{capture, windows};
use std::env;
use tauri::{Manager};
use xcap::Monitor;

/// Function handler which opens up the initial window for taking screenshot.
pub fn open_overlay(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("overlay") {
        window.close().ok();
    }
    windows::open_overlay_window(&app);
    capture::capture_screenshot(&app);
}

/// Gets user's name.
pub fn get_user_name() -> Option<String> {
    env::var("USER").or_else(|_| env::var("USERNAME")).ok()
}

pub fn get_full_screenshot_in_background(app: &tauri::AppHandle) -> String {
    let monitors = Monitor::all().unwrap();
    if let Some(primary) = monitors.first() {
        let image = primary.capture_image().unwrap();
        let base_64_str = capture::image_to_base64(image);
        capture::base64_to_image(base_64_str, app);
    }
    String::from("Something went wrong")
}
