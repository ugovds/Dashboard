import './weather.css';

export const CITIES = [
  { name: 'Louvain-la-Neuve', lat: 50.668, lon: 4.614 },
  { name: 'Bruxelles', lat: 50.850, lon: 4.351 },
  { name: 'Paris', lat: 48.856, lon: 2.352 },
  { name: 'Lyon', lat: 45.764, lon: 4.835 },
  { name: 'Montréal', lat: 45.501, lon: -73.567 },
];

export const WMO_MAP = {
  0: { desc: 'Ciel dégagé', icon: '☀️' },
  1: { desc: 'Principalement dégagé', icon: '🌤️' },
  2: { desc: 'Éclaircies', icon: '⛅' },
  3: { desc: 'Couvert', icon: '☁️' },
  45: { desc: 'Brouillard', icon: '🌫️' },
  48: { desc: 'Brouillard givrant', icon: '🌫️' },
  51: { desc: 'Bruine légère', icon: '🌦️' },
  53: { desc: 'Bruine modérée', icon: '🌦️' },
  55: { desc: 'Bruine dense', icon: '🌧️' },
  61: { desc: 'Pluie faible', icon: '🌧️' },
  63: { desc: 'Pluie modérée', icon: '🌧️' },
  65: { desc: 'Forte pluie', icon: '🌧️' },
  71: { desc: 'Neige faible', icon: '❄️' },
  73: { desc: 'Neige modérée', icon: '❄️' },
  75: { desc: 'Forte neige', icon: '❄️' },
  80: { desc: 'Averses légères', icon: '🌦️' },
  81: { desc: 'Averses modérées', icon: '🌧️' },
  82: { desc: 'Averses violentes', icon: '⛈️' },
  95: { desc: 'Orage', icon: '⛈️' },
};

export class WeatherView {
  constructor(container) {
    this.container = container;
    this.selectedCity = CITIES[0];
    this.weatherData = null;
    this.init();
  }

  async init() {
    this.render();
    this.bindEvents();
    await this.fetchWeatherData();
  }

  async fetchWeatherData() {
    const { lat, lon } = this.selectedCity;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Météo inaccessible');
      const data = await res.json();
      this.weatherData = data;
      this.updateUI();
    } catch (err) {
      console.warn('[Weather] Erreur Open-Meteo:', err.message);
      this.useFallbackData();
    }
  }

  useFallbackData() {
    this.weatherData = {
      current: {
        temperature_2m: 13.5,
        apparent_temperature: 11.8,
        relative_humidity_2m: 74,
        wind_speed_10m: 16.2,
        precipitation: 0.0,
        weather_code: 2,
      },
      hourly: {
        temperature_2m: [12, 12.5, 13, 14, 14.5, 14, 13, 12, 11, 10, 10, 9],
      },
      daily: {
        weather_code: [2, 3, 61, 1],
        temperature_2m_max: [14.5, 13.0, 11.5, 15.0],
        temperature_2m_min: [8.0, 7.5, 6.0, 8.2],
      },
    };
    this.updateUI();
  }

  render() {
    this.container.innerHTML = `
      <section class="weather-hub" id="weather-hub">
        <!-- En-tête -->
        <div class="weather-top-row">
          <div class="weather-title-group">
            <h1 class="weather-main-title">STATION MÉTÉO</h1>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">
              Open-Meteo • 0 clé requise
            </span>
          </div>

          <select class="weather-city-select" id="weather-city-select">
            ${CITIES.map((c) => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
        </div>

        <!-- 1. Hero Card Météo en Direct -->
        <div class="weather-hero-card" id="weather-hero">
          <div class="weather-hero-left">
            <div class="weather-condition-icon-giant" id="weather-icon">🌤️</div>
            <div class="weather-temp-info">
              <span class="weather-temp-giant" id="weather-temp">--°C</span>
              <span class="weather-desc-text" id="weather-desc">Chargement des données météo...</span>
              <span class="weather-feels-like" id="weather-feels">Ressenti --°C</span>
            </div>
          </div>

          <div class="weather-metrics-grid">
            <div class="weather-metric-item">
              <span class="weather-metric-label">Vent</span>
              <span class="weather-metric-val" id="weather-wind">-- km/h</span>
            </div>
            <div class="weather-metric-item">
              <span class="weather-metric-label">Humidité</span>
              <span class="weather-metric-val" id="weather-humidity">-- %</span>
            </div>
            <div class="weather-metric-item">
              <span class="weather-metric-label">Pluie</span>
              <span class="weather-metric-val" id="weather-rain">-- mm</span>
            </div>
          </div>
        </div>

        <!-- 2. Courbe 24h des Températures -->
        <div class="weather-chart-card">
          <span class="weather-chart-title">Évolution Thermique sur 24H</span>
          <div class="weather-svg-container" id="weather-svg-wrap">
            <svg class="weather-svg" id="weather-svg" viewBox="0 0 800 160" preserveAspectRatio="none"></svg>
          </div>
          <div class="weather-axis-hours">
            <span>Maintenant</span>
            <span>+6h</span>
            <span>+12h</span>
            <span>+18h</span>
            <span>+24h</span>
          </div>
        </div>

        <!-- 3. Prévisions à 3 Jours -->
        <div class="forecast-cards-grid" id="forecast-grid"></div>
      </section>
    `;
  }

  updateUI() {
    if (!this.weatherData) return;
    const cur = this.weatherData.current;
    const wmo = WMO_MAP[cur.weather_code] || { desc: 'Conditions variables', icon: '🌤️' };

    const tempEl = this.container.querySelector('#weather-temp');
    const descEl = this.container.querySelector('#weather-desc');
    const feelsEl = this.container.querySelector('#weather-feels');
    const iconEl = this.container.querySelector('#weather-icon');
    const windEl = this.container.querySelector('#weather-wind');
    const humEl = this.container.querySelector('#weather-humidity');
    const rainEl = this.container.querySelector('#weather-rain');

    if (tempEl) tempEl.textContent = `${Math.round(cur.temperature_2m)}°C`;
    if (descEl) descEl.textContent = wmo.desc;
    if (feelsEl) feelsEl.textContent = `Ressenti ${Math.round(cur.apparent_temperature)}°C`;
    if (iconEl) iconEl.textContent = wmo.icon;
    if (windEl) windEl.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
    if (humEl) humEl.textContent = `${Math.round(cur.relative_humidity_2m)} %`;
    if (rainEl) rainEl.textContent = `${cur.precipitation || 0} mm`;

    // 2. Courbe 24h
    this.render24hCurve();

    // 3. Prévisions
    this.renderForecastCards();
  }

  render24hCurve() {
    const hourly = this.weatherData.hourly?.temperature_2m?.slice(0, 24);
    const svg = this.container.querySelector('#weather-svg');
    if (!hourly || !svg || hourly.length < 2) return;

    const width = 800;
    const height = 160;
    const padding = 20;

    const min = Math.min(...hourly);
    const max = Math.max(...hourly);
    const range = max - min || 1;

    const coords = hourly.map((temp, idx) => {
      const x = (idx / (hourly.length - 1)) * width;
      const y = height - padding - ((temp - min) / range) * (height - padding * 2);
      return { x, y, temp };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    svg.innerHTML = `
      <defs>
        <linearGradient id="weather-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#weather-grad)" />
      <path d="${pathD}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" stroke-linecap="round" />
    `;
  }

  renderForecastCards() {
    const daily = this.weatherData.daily;
    const grid = this.container.querySelector('#forecast-grid');
    if (!daily || !grid) return;

    const daysLabels = ['Aujourd\'hui', 'Demain', 'J+2', 'J+3'];

    grid.innerHTML = daysLabels
      .map((dayLabel, idx) => {
        const code = daily.weather_code[idx] || 0;
        const wmo = WMO_MAP[code] || { desc: 'Ensoleillé', icon: '☀️' };
        const max = Math.round(daily.temperature_2m_max[idx] || 15);
        const min = Math.round(daily.temperature_2m_min[idx] || 8);

        return `
          <div class="forecast-card">
            <div class="forecast-day-info">
              <span class="forecast-day-name">${dayLabel}</span>
              <span class="forecast-desc">${wmo.desc}</span>
            </div>
            <span class="forecast-icon">${wmo.icon}</span>
            <div class="forecast-temps">
              <span class="forecast-max">${max}°</span>
              <span class="forecast-min">${min}°</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  bindEvents() {
    const select = this.container.querySelector('#weather-city-select');
    select?.addEventListener('change', (e) => {
      const city = CITIES.find((c) => c.name === e.target.value);
      if (city) {
        this.selectedCity = city;
        this.fetchWeatherData();
      }
    });
  }
}
