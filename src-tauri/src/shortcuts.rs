use crate::utils;

pub fn init(app: &tauri::App) {
    use tauri_plugin_global_shortcut::{
        Code, GlobalShortcutExt, Shortcut, ShortcutState,
    };

    let print_shortcut = Shortcut::new(None, Code::PrintScreen);

    app.handle()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |app, shortcut, event| {
                    if shortcut == &print_shortcut {
                        match event.state() {
                            ShortcutState::Pressed => {
                                utils::open_overlay(app);
                            }
                            ShortcutState::Released => {
                                println!("Ctrl+S released!");
                            }
                        }
                    }
                })
                .build(),
        )
        .unwrap();

    app.global_shortcut().register(print_shortcut).unwrap();
}
