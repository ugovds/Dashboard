use chrono::{DateTime, Local};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tokio::sync::RwLock;

const USER_AGENT: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const CACHE_TTL_SECS: u64 = 180;

pub fn get_yahoo_mapping() -> &'static [(&'static str, &'static str)] {
    &[
        // 1. Actions Internationales & Mega-Caps
        ("nvda", "NVDA"),
        ("tsla", "TSLA"),
        ("aapl", "AAPL"),
        ("msft", "MSFT"),
        ("googl", "GOOGL"),
        ("amzn", "AMZN"),
        ("meta", "META"),
        ("mstr", "MSTR"),
        ("mc", "MC.PA"),
        ("asml", "ASML.AS"),
        ("tte", "TTE.PA"),
        // 2. ETF & Fonds Indiciels Majeurs
        ("10ap", "500.PA"),
        ("lyp6", "LYP6.DE"),
        ("xmme", "XMME.DE"),
        ("cw8", "CW8.PA"),
        ("vwce", "VWCE.DE"),
        ("eqqq", "EQQQ.DE"),
        ("inrg", "IQQH.DE"),
        ("psp5", "PSP5.PA"),
        // 3. Grands Indices Boursiers
        ("sp500", "^GSPC"),
        ("nasdaq100", "^NDX"),
        ("cac40", "^FCHI"),
        ("dax40", "^GDAXI"),
        ("dji", "^DJI"),
        ("stoxx50", "^STOXX50E"),
        ("nikkei", "^N225"),
        ("ftse100", "^FTSE"),
        // 4. Matières Premières & Énergie
        ("gold", "GC=F"),
        ("silver", "SI=F"),
        ("brent", "BZ=F"),
        // 5. Forex & Devises
        ("eurusd", "EURUSD=X"),
        ("eurgbp", "EURGBP=X"),
        ("eurchf", "EURCHF=X"),
        ("eurjpy", "EURJPY=X"),
    ]
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuoteItem {
    pub price: f64,
    pub change: f64,
    #[serde(rename = "dayLow")]
    pub day_low: f64,
    #[serde(rename = "dayHigh")]
    pub day_high: f64,
    pub currency: String,
    pub symbol: String,
    #[serde(rename = "marketTime")]
    pub market_time: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketQuotesPayload {
    pub status: String,
    pub cached: bool,
    pub source: String,
    pub timestamp: u64,
    pub quotes: HashMap<String, QuoteItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChartPoint {
    pub timestamp: i64,
    pub price: f64,
    #[serde(rename = "timeLabel")]
    pub time_label: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChartAxisLabels {
    pub start: String,
    pub mid: String,
    pub end: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChartResult {
    pub asset: String,
    pub symbol: String,
    pub points: Vec<ChartPoint>,
    #[serde(rename = "startPrice")]
    pub start_price: f64,
    #[serde(rename = "endPrice")]
    pub end_price: f64,
    #[serde(rename = "changePct")]
    pub change_pct: f64,
    pub high: f64,
    pub low: f64,
    #[serde(rename = "axisLabels")]
    pub axis_labels: ChartAxisLabels,
}

struct QuotesCache {
    timestamp: u64,
    data: HashMap<String, QuoteItem>,
}

struct ChartCacheEntry {
    timestamp: u64,
    data: ChartResult,
}

#[derive(Clone)]
pub struct MarketsState {
    client: Client,
    quotes_cache: Arc<RwLock<QuotesCache>>,
    charts_cache: Arc<RwLock<HashMap<String, ChartCacheEntry>>>,
}

impl MarketsState {
    pub fn new() -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(6))
            .user_agent(USER_AGENT)
            .build()
            .unwrap_or_else(|_| Client::new());

        Self {
            client,
            quotes_cache: Arc::new(RwLock::new(QuotesCache {
                timestamp: 0,
                data: HashMap::new(),
            })),
            charts_cache: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

fn now_epoch_secs() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

fn round_to(val: f64, dec: u32) -> f64 {
    let factor = 10f64.powi(dec as i32);
    (val * factor).round() / factor
}

async fn fetch_single_quote(client: &Client, asset_id: &str, symbol: &str) -> Option<(String, QuoteItem)> {
    let url = format!(
        "https://query1.finance.yahoo.com/v8/finance/chart/{}?range=1d&interval=15m",
        symbol
    );
    let resp = client.get(&url).send().await.ok()?;
    let json: Value = resp.json().await.ok()?;
    let meta = json.get("chart")?.get("result")?.get(0)?.get("meta")?;

    let price = meta.get("regularMarketPrice")?.as_f64()?;
    let prev = meta
        .get("chartPreviousClose")
        .and_then(|v| v.as_f64())
        .or_else(|| meta.get("previousClose").and_then(|v| v.as_f64()));

    let chg = if let Some(p) = prev {
        if p > 0.0 {
            round_to(((price - p) / p) * 100.0, 2)
        } else {
            0.0
        }
    } else {
        0.0
    };

    let day_low = meta
        .get("regularMarketDayLow")
        .and_then(|v| v.as_f64())
        .unwrap_or(price);
    let day_high = meta
        .get("regularMarketDayHigh")
        .and_then(|v| v.as_f64())
        .unwrap_or(price);

    let currency = meta
        .get("currency")
        .and_then(|v| v.as_str())
        .unwrap_or("EUR")
        .to_string();
    let market_time = meta.get("regularMarketTime").and_then(|v| v.as_i64());

    let decimals = if price < 2.0 { 4 } else { 2 };

    Some((
        asset_id.to_string(),
        QuoteItem {
            price: round_to(price, decimals),
            change: chg,
            day_low: round_to(day_low, decimals),
            day_high: round_to(day_high, decimals),
            currency,
            symbol: symbol.to_string(),
            market_time,
        },
    ))
}

#[tauri::command]
pub async fn get_market_status() -> Result<Value, String> {
    Ok(serde_json::json!({
        "status": "ok",
        "engine": "local-native-rust",
        "service": "Violet Desktop Rust Gateway",
        "message": "Passerelle Marchés Rust active (Tauri v2)"
    }))
}

#[tauri::command]
pub async fn get_market_quotes(
    state: tauri::State<'_, MarketsState>,
    force: Option<bool>,
) -> Result<MarketQuotesPayload, String> {
    let now = now_epoch_secs();
    let force_fetch = force.unwrap_or(false);

    {
        let cache = state.quotes_cache.read().await;
        if !force_fetch && !cache.data.is_empty() && (now - cache.timestamp < CACHE_TTL_SECS) {
            return Ok(MarketQuotesPayload {
                status: "ok".to_string(),
                cached: true,
                source: "live".to_string(),
                timestamp: cache.timestamp,
                quotes: cache.data.clone(),
            });
        }
    }

    let mapping = get_yahoo_mapping();
    let mut tasks = Vec::with_capacity(mapping.len());

    for &(asset_id, symbol) in mapping {
        let client = state.client.clone();
        tasks.push(tokio::spawn(async move {
            fetch_single_quote(&client, asset_id, symbol).await
        }));
    }

    let mut new_quotes = HashMap::new();
    for task in tasks {
        if let Ok(Some((id, item))) = task.await {
            new_quotes.insert(id, item);
        }
    }

    let mut cache = state.quotes_cache.write().await;
    if !new_quotes.is_empty() {
        for (k, v) in new_quotes {
            cache.data.insert(k, v);
        }
        cache.timestamp = now;
    }

    Ok(MarketQuotesPayload {
        status: "ok".to_string(),
        cached: false,
        source: "live".to_string(),
        timestamp: cache.timestamp,
        quotes: cache.data.clone(),
    })
}

#[tauri::command]
pub async fn get_market_chart(
    state: tauri::State<'_, MarketsState>,
    asset: Option<String>,
    range: Option<String>,
    interval: Option<String>,
) -> Result<ChartResult, String> {
    let asset_id = asset.unwrap_or_else(|| "nvda".to_string());
    let range_param = range.unwrap_or_else(|| "1d".to_string());
    let interval_param = interval.unwrap_or_else(|| "5m".to_string());

    let symbol = get_yahoo_mapping()
        .iter()
        .find(|(id, _)| *id == asset_id)
        .map(|(_, sym)| sym.to_string())
        .unwrap_or_else(|| asset_id.clone());

    let cache_key = format!("{}_{}_{}", symbol, range_param, interval_param);
    let now = now_epoch_secs();

    {
        let cache = state.charts_cache.read().await;
        if let Some(entry) = cache.get(&cache_key) {
            if now - entry.timestamp < CACHE_TTL_SECS {
                return Ok(entry.data.clone());
            }
        }
    }

    let url = format!(
        "https://query1.finance.yahoo.com/v8/finance/chart/{}?range={}&interval={}",
        symbol, range_param, interval_param
    );

    let resp = state
        .client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Erreur réseau chart: {}", e))?;

    let json: Value = resp
        .json()
        .await
        .map_err(|e| format!("Erreur JSON chart: {}", e))?;

    let result_obj = json
        .get("chart")
        .and_then(|c| c.get("result"))
        .and_then(|r| r.get(0))
        .ok_or_else(|| "Structure de données Yahoo chart invalide".to_string())?;

    let timestamps = result_obj
        .get("timestamp")
        .and_then(|t| t.as_array())
        .cloned()
        .unwrap_or_default();

    let closes = result_obj
        .get("indicators")
        .and_then(|i| i.get("quote"))
        .and_then(|q| q.get(0))
        .and_then(|q0| q0.get("close"))
        .and_then(|c| c.as_array())
        .cloned()
        .unwrap_or_default();

    let mut points: Vec<ChartPoint> = Vec::new();
    for (t_val, p_val) in timestamps.iter().zip(closes.iter()) {
        if let (Some(t), Some(p)) = (t_val.as_i64(), p_val.as_f64()) {
            let dt = DateTime::from_timestamp(t, 0)
                .map(|d| d.with_timezone(&Local))
                .unwrap_or_else(Local::now);
            let time_label = dt.format("%H:%M").to_string();
            let decimals = if p < 2.0 { 4 } else { 2 };
            points.push(ChartPoint {
                timestamp: t,
                price: round_to(p, decimals),
                time_label,
            });
        }
    }

    if points.is_empty() {
        return Err("Aucun point de données disponible".to_string());
    }

    // Échantillonnage comme dans runner.py pour la performance d'affichage
    if points.len() > 28 {
        let step = (points.len() / 20).max(1);
        let mut sampled = Vec::new();
        for i in (0..points.len()).step_by(step) {
            sampled.push(points[i].clone());
        }
        if let (Some(last_sampled), Some(last_orig)) = (sampled.last(), points.last()) {
            if last_sampled.timestamp != last_orig.timestamp {
                sampled.push(last_orig.clone());
            }
        }
        points = sampled;
    }

    let start_p = points[0].price;
    let end_p = points.last().unwrap().price;
    let chg_pct = if start_p > 0.0 {
        round_to(((end_p - start_p) / start_p) * 100.0, 2)
    } else {
        0.0
    };

    let mut prices: Vec<f64> = points.iter().map(|p| p.price).collect();
    prices.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let low = *prices.first().unwrap_or(&start_p);
    let high = *prices.last().unwrap_or(&end_p);

    let start_label = points[0].time_label.clone();
    let mid_label = points[points.len() / 2].time_label.clone();

    let chart_result = ChartResult {
        asset: asset_id,
        symbol: symbol.to_string(),
        points,
        start_price: start_p,
        end_price: end_p,
        change_pct: chg_pct,
        high: round_to(high, 2),
        low: round_to(low, 2),
        axis_labels: ChartAxisLabels {
            start: start_label,
            mid: mid_label,
            end: "Direct".to_string(),
        },
    };

    let mut cache = state.charts_cache.write().await;
    cache.insert(
        cache_key,
        ChartCacheEntry {
            timestamp: now,
            data: chart_result.clone(),
        },
    );

    Ok(chart_result)
}
