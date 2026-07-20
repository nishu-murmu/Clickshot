use crate::utils;
use base64::{engine::general_purpose, Engine};
use image::{load_from_memory, ImageFormat, RgbaImage};
use std::fs;
use std::io::Cursor;
use std::time::SystemTime;
use std::{env::consts::OS, path::PathBuf};
use tauri::{AppHandle, Emitter, Manager};
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
                path.push(&username);
                path.push("Pictures");
                path.push("Screenshots");
                if let Ok(val) = fs::create_dir_all(path) {
                    println!("ok {:?}", val);
                }
                let path = format!(r"C:/Users/{username}/Pictures/Screenshots/{name}.png");
                String::from(path)
            }
        }
        _ => panic!("Couldn't get the system arch!"),
    }
}

fn image_to_base64(image: RgbaImage) -> String {
    let mut buffer = Cursor::new(Vec::new());
    image.write_to(&mut buffer, ImageFormat::Png).unwrap();
    general_purpose::STANDARD.encode(buffer.get_ref())
}

pub fn base64_to_image(base_64_str: String, app: &AppHandle) -> String {
    if let Ok(current_time) = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
        let filename = String::from(current_time.as_secs().to_string());
        if let Some(username) = utils::get_user_name() {
            let path = get_file_path(username, filename, app);
            let bytes = match general_purpose::STANDARD.decode(base_64_str) {
                Ok(res) => res,
                Err(err) => {
                    eprintln!("Failed to decode base64: {:?}", err);
                    return String::from("Failed to parse base64!");
                }
            };
            let image = match load_from_memory(&bytes) {
                Ok(res) => res,
                Err(err) => {
                    eprintln!("Failed to load image from memory {:?}", err);
                    return String::from("Failed to load image from memory")
                }
            };
            match image.to_rgb8().save(&path) {
                Ok(res) => {
                    dbg!(&res);
                    res
                },
                Err(err) => {
                    eprintln!("Failed to parse in rgb8! {:?}", err);
                    return String::from("Failed to parse in rgb8!");
                }
            };

            return path;
        } else {
            return String::from("Failed to save image!");
        }
    } else {
        return String::from("Failed to save image!");
    }
}

pub fn capture_screenshot(app: &AppHandle) -> Option<String> {
    let monitors = Monitor::all().unwrap();
    if let Some(primary) = monitors.first() {
        let image = primary.capture_image().unwrap();
        let base_64_str = image_to_base64(image);
        app.emit_to("main", "screenshot-ready", base_64_str)
            .unwrap();
    }
    None
}
