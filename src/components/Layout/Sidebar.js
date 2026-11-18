import { ICONS } from './icons.js';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Accueil', kbd: '1', icon: 'dashboard', subtitle: 'Cockpit & Vue d\'ensemble' },
  { id: 'bookmarks', label: 'Signets & Web', kbd: '2', icon: 'bookmarks', subtitle: 'Lancement rapide & Catégories' },
  { id: 'agenda', label: 'Agenda & Tâches', kbd: '3', icon: 'agenda', subtitle: 'Calendrier mensuel & To-Do List' },
  { id: 'weather', label: 'Météo & Radar', kbd: '4', icon: 'weather', subtitle: 'Prévisions & Températures en direct' },
  { id: 'markets', label: 'Marchés & ETF', kbd: '5', icon: 'markets', subtitle: 'Bourse, Crypto & Valorisation' },
  { id: 'pomodoro', label: 'Focus & Lo-Fi', kbd: '6', icon: 'pomodoro', subtitle: 'Minuteur Pomodoro & Sons Zen' },
  { id: 'notes', label: 'Bloc-Notes', kbd: '7', icon: 'notes', subtitle: 'Studio d\'écriture Markdown' },
  { id: 'feeds', label: 'Actualités RSS', kbd: '8', icon: 'feeds', subtitle: 'Veille Tech, Éco & Alertes' },
];

export class Sidebar {
  constructor(container, { onNavigate, onThemeCycle } = {}) {
    this.container = container;
    this.onNavigate = onNavigate;
    this.onThemeCycle = onThemeCycle;
    this.currentView = 'dashboard';
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    // Positionner l'indicateur après un micro-délai pour laisser le DOM se peindre
    requestAnimationFrame(() => {
      this.updateIndicator();
    });
  }

  render() {
    this.container.innerHTML = `
      <aside class="cockpit-sidebar" id="cockpit-sidebar">
        <!-- En-tête Sidebar -->
        <div class="sidebar-header">
          <div class="sidebar-avatar" id="sidebar-avatar-theme" title="Changer de thème (Clic)">
            ${ICONS.logo}
          </div>
          <div class="sidebar-brand-text">
            <span class="brand-title">VIOLET</span>
            <span class="brand-subtitle">COCKPIT 5.2</span>
          </div>
        </div>

        <!-- Navigation principale -->
        <nav class="sidebar-nav" id="sidebar-nav">
          <div class="sidebar-indicator" id="sidebar-indicator"></div>
          ${NAV_ITEMS.map((item) => `
            <button
              type="button"
              class="sidebar-item ${item.id === this.currentView ? 'active' : ''}"
              data-view="${item.id}"
              title="${item.label} (Alt+${item.kbd})"
            >
              <div class="sidebar-icon-wrap">
                ${ICONS[item.icon] || ''}
              </div>
              <span class="sidebar-label">${item.label}</span>
              <kbd class="sidebar-kbd">${item.kbd}</kbd>
              <div class="sidebar-tooltip">${item.label} <kbd>${item.kbd}</kbd></div>
            </button>
          `).join('')}
        </nav>

        <!-- Footer Sidebar -->
        <div class="sidebar-footer">
          <button
            type="button"
            class="sidebar-item"
            id="sidebar-settings-btn"
            title="Paramètres Cockpit"
          >
            <div class="sidebar-icon-wrap">${ICONS.settings}</div>
            <span class="sidebar-label">Paramètres</span>
            <kbd class="sidebar-kbd">0</kbd>
            <div class="sidebar-tooltip">Paramètres <kbd>0</kbd></div>
          </button>
        </div>
      </aside>
    `;

    this.navElement = this.container.querySelector('#sidebar-nav');
    this.indicator = this.container.querySelector('#sidebar-indicator');
  }

  bindEvents() {
    // Clic sur les boutons de navigation
    this.container.querySelectorAll('.sidebar-item[data-view]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const viewId = btn.getAttribute('data-view');
        if (viewId) {
          this.setActive(viewId);
        }
      });
    });

    // Clic sur l'avatar pour cycler de thème
    const avatar = this.container.querySelector('#sidebar-avatar-theme');
    avatar?.addEventListener('click', () => {
      if (this.onThemeCycle) {
        this.onThemeCycle();
      }
    });

    // Paramètres
    const settingsBtn = this.container.querySelector('#sidebar-settings-btn');
    settingsBtn?.addEventListener('click', () => {
      this.setActive('settings');
    });

    // Raccourcis clavier (Alt+1 à 8, 1 à 8 si pas de champ de saisie actif, Flèches Haut / Bas)
    window.addEventListener('keydown', (e) => {
      // Ignorer si l'utilisateur est en train d'écrire dans un input ou textarea
      const targetTag = e.target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable) {
        return;
      }

      // Raccourci 1 à 8 ou Alt+1 à 8
      if (/^[1-8]$/.test(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (NAV_ITEMS[index]) {
          e.preventDefault();
          this.setActive(NAV_ITEMS[index].id);
        }
      } else if (e.key === '0' || (e.altKey && e.key === '0')) {
        e.preventDefault();
        this.setActive('settings');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateDelta(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateDelta(1);
      }
    });

    // Recalculer l'indicateur au redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      this.updateIndicator();
    });
  }

  navigateDelta(delta) {
    const currentIndex = NAV_ITEMS.findIndex((item) => item.id === this.currentView);
    if (currentIndex === -1) return;
    let nextIndex = currentIndex + delta;
    if (nextIndex < 0) nextIndex = NAV_ITEMS.length - 1;
    if (nextIndex >= NAV_ITEMS.length) nextIndex = 0;
    this.setActive(NAV_ITEMS[nextIndex].id);
  }

  setActive(viewId) {
    if (this.currentView === viewId && viewId !== 'settings') return;
    this.currentView = viewId;

    this.container.querySelectorAll('.sidebar-item').forEach((btn) => {
      const match = btn.getAttribute('data-view') === viewId;
      btn.classList.toggle('active', match);
    });

    this.updateIndicator();

    if (this.onNavigate) {
      const itemInfo = NAV_ITEMS.find((item) => item.id === viewId) || {
        id: viewId,
        label: viewId === 'settings' ? 'Paramètres' : viewId,
        subtitle: 'Configuration du Cockpit'
      };
      this.onNavigate(itemInfo);
    }
  }

  updateIndicator() {
    if (!this.indicator || !this.navElement) return;
    const activeBtn = this.container.querySelector(`.sidebar-item[data-view="${this.currentView}"]`);
    if (!activeBtn) {
      this.indicator.style.opacity = '0';
      return;
    }

    const navRect = this.navElement.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const top = btnRect.top - navRect.top;
    const height = btnRect.height;

    this.indicator.style.transform = `translate3d(0, ${top}px, 0)`;
    this.indicator.style.height = `${height}px`;
    this.indicator.style.opacity = '1';
  }
}
