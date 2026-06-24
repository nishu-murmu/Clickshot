use crate::capture;
use std::env;
use std::time::SystemTime;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_opener::OpenerExt;

pub fn open_overlay(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        window.close().ok();
    }
    WebviewWindowBuilder::new(app, "main", WebviewUrl::App("main.html".into()))
        .transparent(true)
        .fullscreen(true)
        .focused(true)
        .build()
        .unwrap();
}

pub fn full_screenshot_handler(app: &tauri::AppHandle) {
    if let Ok(current_time) = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
        let filename = String::from(current_time.as_secs().to_string());
        if let Some(path) = capture::capture_fullscreen_shot(filename, app) {
            if let Ok(val) = app.opener().open_path(path, None::<&str>) {
                println!("screenshot captured! {:?}", val);
            } else {
                println!("Something went wrong!");
            }
        }
    }
}

pub fn region_screenshot_handler(app: &tauri::AppHandle, x: u32, y: u32, width: u32, height: u32) {
    if let Ok(current_time) = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
        let filename = String::from(current_time.as_secs().to_string());
        if let Some(path) = capture::capture_region_shot(filename, app, x, y, width, height) {
            if let Ok(val) = app.opener().open_path(path, None::<&str>) {
                println!("screenshot captured! {:?}", val);
            } else {
                println!("Something went wrong!");
            }
        }
    }
}

pub fn get_user_name() -> Option<String> {
    env::var("USER").or_else(|_| env::var("USERNAME")).ok()
}
