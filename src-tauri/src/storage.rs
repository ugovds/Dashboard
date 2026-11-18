use std::fs;
use std::path::PathBuf;

fn get_storage_path() -> Result<PathBuf, String> {
    let mut path = dirs::config_dir().ok_or_else(|| "Impossible de trouver le dossier config".to_string())?;
    path.push("violet-startpage");
    if !path.exists() {
        fs::create_dir_all(&path).map_err(|e| format!("Erreur création dossier config: {}", e))?;
    }
    path.push("data.json");
    Ok(path)
}

#[tauri::command]
pub async fn save_app_state(content: String) -> Result<(), String> {
    let path = get_storage_path()?;
    fs::write(&path, content).map_err(|e| format!("Erreur sauvegarde état: {}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn load_app_state() -> Result<Option<String>, String> {
    let path = get_storage_path()?;
    if !path.exists() {
        return Ok(None);
    }
    let content = fs::read_to_string(&path).map_err(|e| format!("Erreur lecture état: {}", e))?;
    Ok(Some(content))
}
