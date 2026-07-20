use crate::utils;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
};

pub fn init(app: &tauri::App) {
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>).unwrap();
    let full_screenshot_i = MenuItem::with_id(
        app,
        "full_screenshot",
        "Full Screenshot",
        true,
        None::<&str>,
    )
    .unwrap();
    let region_screenshot_i = MenuItem::with_id(
        app,
        "region_screenshot",
        "Region Screenshot",
        true,
        None::<&str>,
    )
    .unwrap();
    let menu = Menu::with_items(app, &[&quit_i, &full_screenshot_i, &region_screenshot_i]).unwrap();
    let tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .build(app)
        .unwrap();
    tray.on_menu_event(|app, event| match event.id.as_ref() {
        "quit" => {
            app.exit(0);
            println!("App exited!");
        }
        "full_screenshot" => {
            println!("Full Screenshot taken!");
        }
        "region_screenshot" => {
            utils::open_overlay(app);
            println!("Region Screenshot taken!");
        }
        _ => {
            println!("Something went wrong!");
        }
    })
}
