mod capture;
mod commands;
mod shortcuts;
mod system_tray;
mod utils;
mod windows;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            system_tray::init(app);
            #[cfg(desktop)]
            shortcuts::init(app);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::close_overlay_command,
            commands::region_screenshot_command,
            commands::full_screenshot_command,
            commands::open_edit_window_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
