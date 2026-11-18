pub mod markets;
pub mod storage;
pub mod system;

use markets::MarketsState;
use system::SystemState;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{Manager, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let markets_state = MarketsState::new();
    let system_state = SystemState::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .manage(markets_state)
        .manage(system_state)
        .setup(|app| {
            let show_hide_item = MenuItem::with_id(app, "toggle", "Afficher / Masquer Cockpit", true, None::<&str>)?;
            let reload_item = MenuItem::with_id(app, "reload", "Recharger", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quitter l'application", true, None::<&str>)?;
            let tray_menu = Menu::with_items(app, &[&show_hide_item, &reload_item, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("Violet Cockpit")
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "toggle" => {
                        if let Some(win) = app.get_webview_window("main") {
                            if let Ok(is_visible) = win.is_visible() {
                                if is_visible {
                                    let _ = win.hide();
                                } else {
                                    let _ = win.show();
                                    let _ = win.set_focus();
                                }
                            }
                        }
                    }
                    "reload" => {
                        if let Some(win) = app.get_webview_window("main") {
                            let _ = win.eval("window.location.reload()");
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(win) = app.get_webview_window("main") {
                            if let Ok(is_visible) = win.is_visible() {
                                if is_visible {
                                    let _ = win.hide();
                                } else {
                                    let _ = win.show();
                                    let _ = win.set_focus();
                                }
                            }
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                // Au lieu de fermer et tuer le processus, on cache dans le system tray
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![
            markets::get_market_status,
            markets::get_market_quotes,
            markets::get_market_chart,
            system::get_system_telemetry,
            storage::save_app_state,
            storage::load_app_state
        ])
        .run(tauri::generate_context!())
        .expect("Erreur lors de l'exécution de l'application Violet Cockpit");
}
