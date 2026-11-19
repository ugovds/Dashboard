// Service Météo Haute Précision pour Violet Cockpit (Belgique & Europe)
// Exploite l'API Open-Meteo avec modèles haute résolution (AROME / ECMWF) sans clé d'API

export const WMO_CODES = {
  0: { desc: 'Ciel dégagé', icon: 'fa-solid fa-sun' },
  1: { desc: 'Principalement dégagé', icon: 'fa-solid fa-sun' },
  2: { desc: 'Éclaircies', icon: 'fa-solid fa-cloud-sun' },
  3: { desc: 'Couvert', icon: 'fa-solid fa-cloud' },
  45: { desc: 'Brouillard', icon: 'fa-solid fa-smog' },
  48: { desc: 'Brouillard givrant', icon: 'fa-solid fa-smog' },
  51: { desc: 'Bruine légère', icon: 'fa-solid fa-cloud-rain' },
  53: { desc: 'Bruine modérée', icon: 'fa-solid fa-cloud-rain' },
  55: { desc: 'Bruine dense', icon: 'fa-solid fa-cloud-showers-heavy' },
  56: { desc: 'Bruine verglaçante', icon: 'fa-solid fa-snowflake' },
  57: { desc: 'Forte bruine verglaçante', icon: 'fa-solid fa-snowflake' },
  61: { desc: 'Pluie faible', icon: 'fa-solid fa-cloud-rain' },
  63: { desc: 'Pluie modérée', icon: 'fa-solid fa-cloud-rain' },
  65: { desc: 'Forte pluie', icon: 'fa-solid fa-cloud-showers-heavy' },
  66: { desc: 'Pluie verglaçante', icon: 'fa-solid fa-snowflake' },
  67: { desc: 'Forte pluie verglaçante', icon: 'fa-solid fa-snowflake' },
  71: { desc: 'Neige légère', icon: 'fa-solid fa-snowflake' },
  73: { desc: 'Neige modérée', icon: 'fa-solid fa-snowflake' },
  75: { desc: 'Forte neige', icon: 'fa-solid fa-snowflake' },
  77: { desc: 'Grains de neige', icon: 'fa-solid fa-snowflake' },
  80: { desc: 'Averses légères', icon: 'fa-solid fa-cloud-rain' },
  81: { desc: 'Averses modérées', icon: 'fa-solid fa-cloud-rain' },
  82: { desc: 'Violentes averses', icon: 'fa-solid fa-cloud-showers-heavy' },
  85: { desc: 'Averses de neige', icon: 'fa-solid fa-snowflake' },
  86: { desc: 'Fortes averses de neige', icon: 'fa-solid fa-snowflake' },
  95: { desc: 'Orage', icon: 'fa-solid fa-cloud-bolt' },
  96: { desc: 'Orage et grêle', icon: 'fa-solid fa-cloud-bolt' },
  99: { desc: 'Violent orage de grêle', icon: 'fa-solid fa-cloud-bolt' },
};

export function getWmoInfo(code) {
  return WMO_CODES[code] || { desc: 'Partiellement nuageux', icon: 'fa-solid fa-cloud' };
}

export function degreesToCompass(deg) {
  if (deg === undefined || deg === null) return 'N';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}

const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

class WeatherService {
  constructor(store = null) {
    this.store = store;
    this.memoryCache = new Map(); // cityKey -> { timestamp, data }
    this.geoCache = new Map(); // cityName -> locInfo
    this.autoRefreshTimer = null;
    this.defaultCity = 'Bruxelles';
    this.initPreload();
  }

  initPreload() {
    // Coordonnées de base pour Bruxelles pré-enregistrées
    this.geoCache.set('bruxelles', {
      name: 'Bruxelles',
      country: 'Belgique',
      latitude: 50.85045,
      longitude: 4.34878,
    });
    this.geoCache.set('brussels', {
      name: 'Bruxelles',
      country: 'Belgique',
      latitude: 50.85045,
      longitude: 4.34878,
    });
  }

  async fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 VioletCockpit/5.2',
          ...(options.headers || {}),
        },
      });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async geocodeCity(city) {
    const cleanCity = (city || '').trim();
    if (!cleanCity) {
      return this.geoCache.get('bruxelles');
    }
    const key = cleanCity.toLowerCase();
    if (this.geoCache.has(key)) {
      return this.geoCache.get(key);
    }

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=fr&format=json`;
      const res = await this.fetchWithTimeout(url, {}, 4000);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const first = data.results[0];
          const locInfo = {
            name: first.name,
            country: first.country || 'Belgique',
            latitude: first.latitude,
            longitude: first.longitude,
            admin1: first.admin1 || '',
          };
          this.geoCache.set(key, locInfo);
          return locInfo;
        }
      }
    } catch (err) {
      console.warn(`[WeatherService] Échec du géocodage pour "${cleanCity}":`, err.message);
    }

    // Fallback par défaut si non trouvé
    return this.geoCache.get('bruxelles');
  }

  async searchCities(query) {
    const clean = (query || '').trim();
    if (clean.length < 2) return [];

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=5&language=fr&format=json`;
      const res = await this.fetchWithTimeout(url, {}, 3500);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []).map((r) => ({
        id: r.id,
        name: r.name,
        country: r.country || '',
        admin1: r.admin1 || '',
        latitude: r.latitude,
        longitude: r.longitude,
        displayName: `${r.name}${r.admin1 ? ' (' + r.admin1 + ')' : ''}, ${r.country || ''}`,
      }));
    } catch {
      return [];
    }
  }

  async getWeatherData(cityName, force = false) {
    const targetCity = (cityName || this.store?.get('weather_city') || this.defaultCity).trim();
    const cacheKey = targetCity.toLowerCase();
    const now = Date.now();

    // 1. Vérifier le cache mémoire (invalider si ancien format avec moins de 16 créneaux)
    const cached = this.memoryCache.get(cacheKey);
    const cachedPoints = cached?.data?.weather?.[0]?.hourly?.length || 0;
    if (!force && cached && cachedPoints >= 16 && now - cached.timestamp < WEATHER_CACHE_TTL) {
      return { status: 'ok', cached: true, timestamp: cached.timestamp, data: cached.data };
    }

    // 2. Géocodage
    const locInfo = await this.geocodeCity(targetCity);

    // 3. Récupération météo Open-Meteo avec 7 jours + créneaux horaires
    // Modèle haute résolution ECMWF / AROME
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${locInfo.latitude}&longitude=${locInfo.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,precipitation,weathercode&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=7`;

    try {
      const res = await this.fetchWithTimeout(forecastUrl, {}, 5000);
      if (!res.ok) throw new Error(`Open-Meteo statut ${res.status}`);
      const omData = await res.json();

      const current = omData.current || {};
      const daily = omData.daily || {};
      const hourly = omData.hourly || {};
      const wmo = getWmoInfo(current.weather_code);

      // Échantillonnage précis heure par heure sur les prochaines 24 heures (24 créneaux)
      const nowD = new Date();
      const localHourIso = `${nowD.getFullYear()}-${String(nowD.getMonth() + 1).padStart(2, '0')}-${String(nowD.getDate()).padStart(2, '0')}T${String(nowD.getHours()).padStart(2, '0')}`;
      let startIdx = 0;
      if (hourly.time && hourly.time.length) {
        const foundIdx = hourly.time.findIndex((t) => t.startsWith(localHourIso));
        if (foundIdx !== -1) {
          startIdx = foundIdx;
        } else {
          startIdx = Math.min(hourly.time.length - 1, Math.max(0, nowD.getHours()));
        }
      }

      const sampleHourly = [];
      const totalHours = Math.min(24, (hourly.time?.length || 0) - startIdx);
      for (let i = 0; i < totalHours; i++) {
        const idx = startIdx + i;
        const rawTime = hourly.time[idx] || '';
        const code = hourly.weathercode?.[idx] ?? 0;
        const hourWmo = getWmoInfo(code);
        sampleHourly.push({
          time: rawTime,
          tempC: Math.round(hourly.temperature_2m?.[idx] ?? current.temperature_2m ?? 0).toString(),
          chanceofrain: Math.round(hourly.precipitation_probability?.[idx] ?? 0).toString(),
          precipMM: (hourly.precipitation?.[idx] ?? 0).toString(),
          weatherDesc: [{ value: hourWmo.desc }],
          weatherIcon: hourWmo.icon,
        });
      }

      // Prévisions 7 jours avec 24h complètes pour chaque jour
      const daysList = [];
      const numDays = (daily.time || []).length;
      for (let d = 0; d < numDays; d++) {
        const dateStr = daily.time[d];
        const code = daily.weathercode?.[d] ?? 0;
        const dayWmo = getWmoInfo(code);
        const maxT = Math.round(daily.temperature_2m_max?.[d] ?? 0).toString();
        const minT = Math.round(daily.temperature_2m_min?.[d] ?? 0).toString();
        const rainProb = Math.round(daily.precipitation_probability_max?.[d] ?? 0).toString();

        const sunriseIso = daily.sunrise?.[d] || '';
        const sunsetIso = daily.sunset?.[d] || '';
        const sunriseStr = sunriseIso.includes('T') ? sunriseIso.split('T')[1].slice(0, 5) : sunriseIso;
        const sunsetStr = sunsetIso.includes('T') ? sunsetIso.split('T')[1].slice(0, 5) : sunsetIso;

        const dayStartIdx = d * 24;
        const dayHourly = [];
        for (let h = 0; h < 24; h++) {
          const hIdx = dayStartIdx + h;
          if (hIdx < (hourly.time || []).length) {
            const rawTime = hourly.time[hIdx] || '';
            const hCode = hourly.weathercode?.[hIdx] ?? 0;
            const hWmo = getWmoInfo(hCode);
            dayHourly.push({
              time: rawTime,
              tempC: Math.round(hourly.temperature_2m?.[hIdx] ?? 0).toString(),
              chanceofrain: Math.round(hourly.precipitation_probability?.[hIdx] ?? 0).toString(),
              precipMM: (hourly.precipitation?.[hIdx] ?? 0).toString(),
              weatherDesc: [{ value: hWmo.desc }],
              weatherIcon: hWmo.icon,
            });
          }
        }

        daysList.push({
          date: dateStr,
          maxtempC: maxT,
          mintempC: minT,
          uvIndex: Math.round(daily.uv_index_max?.[d] ?? 0).toString(),
          precipSumMM: (daily.precipitation_sum?.[d] ?? 0).toString(),
          precipProbMax: rainProb,
          windSpeedMax: Math.round(daily.wind_speed_10m_max?.[d] ?? 0).toString(),
          astronomy: [
            {
              sunrise: sunriseStr || '07:00',
              sunset: sunsetStr || '19:00',
            },
          ],
          hourly: dayHourly,
        });
      }

      if (daysList[0]) {
        daysList[0].rollingHourly = sampleHourly;
        daysList[0].hourly = sampleHourly;
      }

      const formatted = {
        source: 'open-meteo',
        current_condition: [
          {
            temp_C: Math.round(current.temperature_2m ?? 0).toString(),
            FeelsLikeC: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0).toString(),
            humidity: Math.round(current.relative_humidity_2m ?? 50).toString(),
            windspeedKmph: Math.round(current.wind_speed_10m ?? 0).toString(),
            winddir16Point: degreesToCompass(current.wind_direction_10m),
            uvIndex: Math.round(daily.uv_index_max?.[0] ?? 0).toString(),
            pressure: Math.round(current.surface_pressure ?? 1013).toString(),
            visibility: '10',
            weatherDesc: [{ value: wmo.desc }],
            weatherIcon: wmo.icon,
            precipMM: (current.precipitation ?? 0).toString(),
          },
        ],
        nearest_area: [
          {
            areaName: [{ value: locInfo.name || 'Bruxelles' }],
            country: [{ value: locInfo.country || 'Belgique' }],
            latitude: String(locInfo.latitude || '50.8504'),
            longitude: String(locInfo.longitude || '4.3487'),
          },
        ],
        weather: daysList,
      };

      this.memoryCache.set(cacheKey, { timestamp: now, data: formatted });
      if (this.store) {
        this.store.set('weather_cache', { timestamp: now, city: targetCity, data: formatted });
      }

      return { status: 'ok', cached: false, timestamp: now, data: formatted };
    } catch (err) {
      console.error('[WeatherService] Erreur forecast:', err.message);
      if (cached) {
        return { status: 'ok', cached: true, stale: true, timestamp: cached.timestamp, data: cached.data };
      }
      throw err;
    }
  }

  startAutoRefresh(intervalMs = 20 * 60 * 1000) {
    if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer);
    this.autoRefreshTimer = setInterval(async () => {
      try {
        const city = this.store?.get('weather_city') || this.defaultCity;
        await this.getWeatherData(city, true);
      } catch (_) {}
    }, intervalMs);
  }
}

export default WeatherService;
