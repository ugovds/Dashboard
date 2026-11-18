import './clock.css';

export class ClockStation {
  constructor(container) {
    this.container = container;
    this.timer = null;
    this.init();
  }

  init() {
    this.render();
    this.update();
    this.timer = setInterval(() => this.update(), 1000);
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getSolarPhase(hours, minutes) {
    const timeVal = hours + minutes / 60;
    if (timeVal >= 6 && timeVal < 8.5) {
      return { icon: '🌅', label: 'Aube & Lever', sub: 'Cycle matinal' };
    }
    if (timeVal >= 8.5 && timeVal < 12) {
      return { icon: '🌤️', label: 'Matinée Active', sub: 'Ascendance solaire' };
    }
    if (timeVal >= 12 && timeVal < 14) {
      return { icon: '☀️', label: 'Zénith Solaire', sub: 'Pic d\'irradiation' };
    }
    if (timeVal >= 14 && timeVal < 18) {
      return { icon: '🌞', label: 'Après-Midi', sub: 'Descente solaire' };
    }
    if (timeVal >= 18 && timeVal < 21) {
      return { icon: '🌇', label: 'Crépuscule Doré', sub: 'Transition nocturne' };
    }
    if (timeVal >= 21 || timeVal < 4) {
      return { icon: '🌌', label: 'Nuit Étoilée', sub: 'Repos & Veille' };
    }
    return { icon: '🌙', label: 'Aube Silencieuse', sub: 'Prélude du jour' };
  }

  render() {
    this.container.innerHTML = `
      <section class="clock-station" id="clock-station-widget">
        <!-- Heure Centrale Grand Format -->
        <div class="clock-display-wrap">
          <div class="clock-digits-main">
            <span id="clock-hours">--</span>
            <span class="clock-colon">:</span>
            <span id="clock-minutes">--</span>
          </div>
          <span class="clock-seconds" id="clock-seconds">--</span>
        </div>

        <!-- Date Complète en Français -->
        <div class="clock-date-line" id="clock-date-line">
          Chargement de la date...
        </div>

        <!-- Barre de Progression Journalière -->
        <div class="day-progress-container">
          <div class="day-progress-header">
            <span class="day-progress-label">
              <span>⏱️ Progression journalière</span>
            </span>
            <span class="day-progress-pct" id="clock-day-pct">0.0%</span>
          </div>
          <div class="day-progress-track">
            <div class="day-progress-fill" id="clock-progress-fill" style="width: 0%;"></div>
          </div>
        </div>

        <!-- Télémétrie Solaire -->
        <div class="solar-telemetry-row">
          <div class="solar-phase-badge">
            <span class="solar-icon" id="solar-icon">☀️</span>
            <span id="solar-phase-label">Zénith Solaire</span>
          </div>
          <div class="solar-divider"></div>
          <span id="solar-sub-label">Cycle solaire actif</span>
        </div>
      </section>
    `;

    this.hoursEl = this.container.querySelector('#clock-hours');
    this.minutesEl = this.container.querySelector('#clock-minutes');
    this.secondsEl = this.container.querySelector('#clock-seconds');
    this.dateEl = this.container.querySelector('#clock-date-line');
    this.dayPctEl = this.container.querySelector('#clock-day-pct');
    this.progressFillEl = this.container.querySelector('#clock-progress-fill');
    this.solarIconEl = this.container.querySelector('#solar-icon');
    this.solarPhaseEl = this.container.querySelector('#solar-phase-label');
    this.solarSubEl = this.container.querySelector('#solar-sub-label');
  }

  update() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
    if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
    if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');

    // Date en français (ex: "Mercredi 18 novembre 2026")
    if (this.dateEl) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const dateFormatted = now.toLocaleDateString('fr-FR', options);
      this.dateEl.textContent = dateFormatted;
    }

    // Progression journalière %
    const totalSecondsInDay = 86400;
    const currentSeconds = hours * 3600 + minutes * 60 + seconds;
    const pct = ((currentSeconds / totalSecondsInDay) * 100).toFixed(1);

    if (this.dayPctEl) this.dayPctEl.textContent = `${pct}%`;
    if (this.progressFillEl) this.progressFillEl.style.width = `${pct}%`;

    // Télémétrie Solaire
    const solar = this.getSolarPhase(hours, minutes);
    if (this.solarIconEl) this.solarIconEl.textContent = solar.icon;
    if (this.solarPhaseEl) this.solarPhaseEl.textContent = solar.label;
    if (this.solarSubEl) this.solarSubEl.textContent = solar.sub;
  }
}
