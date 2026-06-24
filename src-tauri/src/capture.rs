use crate::utils;
use std::fs;
use std::{env::consts::OS, path::PathBuf};
use tauri::{AppHandle, Manager};
use xcap::Monitor;

fn get_file_path(username: String, name: String, app: &AppHandle) -> String {
    match OS {
        "linux" => format!("/home/{username}/Pictures/Screenshots/{name}.png"),
        "windows" => {
            if let Ok(_) = app.path().picture_dir() {
                let path = format!(r"C:/Users/{username}/Pictures/Screenshots/");
                fs::create_dir_all(path).unwrap();
                let path = format!(r"C:/Users/{username}/Pictures/Screenshots/{name}.png");
                String::from(path)
            } else {
                let mut path = PathBuf::from(r"C:Users\");
                path.push(username);
                path.push("Pictures");
                path.push("Screenshots");
                if let Ok(val) = fs::create_dir_all(path) {
                    println!("ok {:?}", val);
                }
                let path = r"C:/Users/{username}/Pictures/Screenshots/{name}.png";
                String::from(path)
            }
        }
        _ => panic!("Couldn't get the system arch!"),
    }
}

pub fn capture_fullscreen_shot(name: String, app: &AppHandle) -> Option<String> {
    let monitors = Monitor::all().unwrap();
    if let Some(username) = utils::get_user_name() {
        if let Some(primary) = monitors.first() {
            let path = get_file_path(username, name, app);
            primary.capture_image().unwrap().save(&path).unwrap();
            return Some(path);
        }
    }
    None
}

pub fn capture_region_shot(
    name: String,
    app: &AppHandle,
    x: u32,
    y: u32,
    width: u32,
    height: u32,
) -> Option<String> {
    let monitors = Monitor::all().unwrap();
    if let Some(username) = utils::get_user_name() {
        if let Some(primary) = monitors.first() {
            let path = get_file_path(username, name, app);
            primary
                .capture_region(x, y, width, height)
                .unwrap()
                .save(&path)
                .unwrap();
            return Some(path);
        }
    }
    None
}
