use serde::{Deserialize, Serialize};
use std::sync::Arc;
use sysinfo::System;
use tokio::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemTelemetry {
    pub cpu_usage: f32,
    pub memory_used_mb: u64,
    pub memory_total_mb: u64,
    pub memory_pct: f32,
    pub uptime_secs: u64,
}

pub struct SystemState {
    sys: Arc<Mutex<System>>,
}

impl SystemState {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self {
            sys: Arc::new(Mutex::new(sys)),
        }
    }
}

#[tauri::command]
pub async fn get_system_telemetry(
    state: tauri::State<'_, SystemState>,
) -> Result<SystemTelemetry, String> {
    let mut sys = state.sys.lock().await;
    sys.refresh_cpu_all();
    sys.refresh_memory();

    let cpu = sys.global_cpu_usage();
    let used_bytes = sys.used_memory();
    let total_bytes = sys.total_memory();

    let used_mb = used_bytes / (1024 * 1024);
    let total_mb = total_bytes / (1024 * 1024);
    let memory_pct = if total_bytes > 0 {
        ((used_bytes as f64 / total_bytes as f64) * 100.0) as f32
    } else {
        0.0
    };

    let uptime = System::uptime();

    Ok(SystemTelemetry {
        cpu_usage: (cpu * 10.0).round() / 10.0,
        memory_used_mb: used_mb,
        memory_total_mb: total_mb,
        memory_pct: (memory_pct * 10.0).round() / 10.0,
        uptime_secs: uptime,
    })
}
