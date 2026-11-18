import { ICONS } from './icons.js';
import { THEMES } from '../../styles/themes/themes.js';

export { THEMES };

export class Topbar {
  constructor(container, { onThemeChange } = {}) {
    this.container = container;
    this.onThemeChange = onThemeChange;
    this.currentTheme = 'liquid-glass';
    this.init();
  }

  init() {
    this.render();
    this.startClock();
    this.bindEvents();
  }

  render() {
    const activeThemeObj = THEMES.find((t) => t.id === this.currentTheme) || THEMES[0];

    this.container.innerHTML = `
      <header class="cockpit-topbar" id="cockpit-topbar">
        <!-- Gauche : Titre et vue active -->
        <div class="topbar-left">
          <div class="topbar-view-icon" id="topbar-view-icon">
            ${ICONS.dashboard}
          </div>
          <div class="topbar-titles">
            <span class="topbar-title" id="topbar-title">Accueil</span>
            <span class="topbar-subtitle" id="topbar-subtitle">Cockpit & Vue d'ensemble</span>
          </div>
        </div>

        <!-- Droite : Télémétrie, Thèmes, Fenêtre -->
        <div class="topbar-right">
          <!-- Horloge HUD -->
          <div class="topbar-clock" id="topbar-clock">--:--:--</div>

          <!-- Sélecteur de Thème -->
          <div class="theme-selector-wrap">
            <button type="button" class="theme-pill-btn" id="theme-pill-btn" title="Changer de thème visuel">
              <span class="theme-pill-dot" id="theme-pill-dot"></span>
              <span id="theme-current-name">${activeThemeObj.name}</span>
            </button>

            <!-- Dropdown Thèmes -->
            <div class="theme-dropdown" id="theme-dropdown">
              ${THEMES.map((theme) => `
                <button
                  type="button"
                  class="theme-opt-item ${theme.id === this.currentTheme ? 'active' : ''}"
                  data-theme-id="${theme.id}"
                >
                  <span>${theme.name}</span>
                  <div class="theme-opt-color-preview">
                    <span class="color-dot" style="background: ${theme.color};"></span>
                    <span class="color-dot" style="background: ${theme.secondary};"></span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Boutons de contrôle natifs -->
          <div class="topbar-window-ctrls">
            <button class="topbar-ctrl-btn" id="topbar-btn-min" title="Minimiser">_</button>
            <button class="topbar-ctrl-btn" id="topbar-btn-max" title="Agrandir / Restaurer">□</button>
            <button class="topbar-ctrl-btn close" id="topbar-btn-hide" title="Masquer dans la barre des tâches (Tray)">✕</button>
          </div>
        </div>
      </header>
    `;
  }

  bindEvents() {
    // Horloge
    this.clockElement = this.container.querySelector('#topbar-clock');

    // Sélecteur de thème
    const pillBtn = this.container.querySelector('#theme-pill-btn');
    const dropdown = this.container.querySelector('#theme-dropdown');

    pillBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('open');
    });

    // Fermer le dropdown si on clique ailleurs
    window.addEventListener('click', () => {
      dropdown?.classList.remove('open');
    });

    // Choix du thème
    this.container.querySelectorAll('.theme-opt-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = item.getAttribute('data-theme-id');
        if (themeId) {
          this.setTheme(themeId);
          dropdown?.classList.remove('open');
        }
      });
    });

    // Contrôles de fenêtre
    const desktopAPI = window.desktopAPI;
    const btnMin = this.container.querySelector('#topbar-btn-min');
    const btnMax = this.container.querySelector('#topbar-btn-max');
    const btnHide = this.container.querySelector('#topbar-btn-hide');

    btnMin?.addEventListener('click', () => desktopAPI?.minimize());
    btnMax?.addEventListener('click', () => desktopAPI?.toggleMaximize());
    btnHide?.addEventListener('click', () => desktopAPI?.hide());

    desktopAPI?.onWindowStateChange?.(({ isMaximized }) => {
      if (btnMax) {
        btnMax.textContent = isMaximized ? '❐' : '□';
      }
    });
  }

  startClock() {
    const update = () => {
      if (!this.clockElement) return;
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    };
    update();
    setInterval(update, 1000);
  }

  updateViewInfo({ id, label, subtitle, icon }) {
    const titleEl = this.container.querySelector('#topbar-title');
    const subtitleEl = this.container.querySelector('#topbar-subtitle');
    const iconEl = this.container.querySelector('#topbar-view-icon');

    if (titleEl) titleEl.textContent = label;
    if (subtitleEl) subtitleEl.textContent = subtitle || '';
    if (iconEl && icon && ICONS[icon]) {
      iconEl.innerHTML = ICONS[icon];
    }
  }

  setTheme(themeId) {
    this.currentTheme = themeId;
    const themeObj = THEMES.find((t) => t.id === themeId) || THEMES[0];

    // Mise à jour de l'UI Topbar
    const nameEl = this.container.querySelector('#theme-current-name');
    const dotEl = this.container.querySelector('#theme-pill-dot');
    if (nameEl) nameEl.textContent = themeObj.name;
    if (dotEl) dotEl.style.background = themeObj.color;

    // Mise à jour de la classe active dans le menu
    this.container.querySelectorAll('.theme-opt-item').forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-theme-id') === themeId);
    });

    if (this.onThemeChange) {
      this.onThemeChange(themeId);
    }
  }

  cycleTheme() {
    const currentIndex = THEMES.findIndex((t) => t.id === this.currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    this.setTheme(THEMES[nextIndex].id);
  }
}
