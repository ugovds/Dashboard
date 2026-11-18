import './settings.css';
import { THEMES } from '../../styles/themes/themes.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class SettingsView {
  constructor(container, { onThemeChange } = {}) {
    this.container = container;
    this.onThemeChange = onThemeChange;
    this.currentTheme = 'liquid-glass';
    this.systemInfo = null;
    this.storePath = '';
    this.preferences = {
      clockFormat: '24h',
      showSeconds: true,
      zenChime: true,
      systemNotifications: true,
      defaultWeatherCity: 'lln',
      defaultSearchEngine: 'google',
    };
    this.init();
  }

  async init() {
    await this.loadPreferences();
    await this.loadSystemInfo();
    this.render();
    this.bindEvents();
  }

  async loadPreferences() {
    try {
      this.currentTheme =
        document.documentElement.getAttribute('data-theme') ||
        (await window.desktopAPI?.getStore('activeTheme')) ||
        localStorage.getItem('violet_theme') ||
        'liquid-glass';

      const savedPrefs = await window.desktopAPI?.getStore('user_preferences');
      if (savedPrefs && typeof savedPrefs === 'object') {
        this.preferences = { ...this.preferences, ...savedPrefs };
      } else {
        const local = localStorage.getItem('violet_user_prefs');
        if (local) {
          this.preferences = { ...this.preferences, ...JSON.parse(local) };
        }
      }
    } catch (err) {
      console.warn('[Settings] Erreur chargement préférences:', err);
    }
  }

  async loadSystemInfo() {
    try {
      if (window.desktopAPI?.getSystemInfo) {
        this.systemInfo = await window.desktopAPI.getSystemInfo();
        this.storePath = this.systemInfo.storePath || '';
      } else if (window.desktopAPI?.getStorePath) {
        const pathData = await window.desktopAPI.getStorePath();
        this.storePath = pathData?.filePath || '';
      }
    } catch (err) {
      console.warn('[Settings] Erreur chargement télémétrie:', err);
    }
  }

  async savePreferences() {
    try {
      localStorage.setItem('violet_user_prefs', JSON.stringify(this.preferences));
      await window.desktopAPI?.setStore('user_preferences', this.preferences);
      this.showToast('Préférences enregistrées avec succès !', 'success');
    } catch (err) {
      console.error('[Settings] Erreur sauvegarde préférences:', err);
      this.showToast('Erreur lors de la sauvegarde.', 'error');
    }
  }

  setTheme(themeId, notifyParent = true) {
    this.currentTheme = themeId;
    if (notifyParent && this.onThemeChange) {
      this.onThemeChange(themeId);
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
      document.body.setAttribute('data-theme', themeId);
      localStorage.setItem('violet_theme', themeId);
      window.desktopAPI?.setStore('activeTheme', themeId)?.catch?.(() => {});
    }
    this.updateThemeCards();
  }

  updateThemeCards() {
    const cards = this.container.querySelectorAll('.theme-card-choice');
    cards.forEach((card) => {
      const id = card.getAttribute('data-theme-id');
      const isActive = id === this.currentTheme;
      card.classList.toggle('active', isActive);
      const tag = card.querySelector('.theme-active-tag');
      if (tag) tag.style.display = isActive ? 'inline-block' : 'none';
    });
  }

  showToast(message, type = 'success') {
    const toast = this.container.querySelector('#settings-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `settings-toast ${type}`;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.className = 'settings-toast';
    }, 4000);
  }

  render() {
    const sys = this.systemInfo || {
      platform: 'linux',
      arch: 'x64',
      electronVersion: '45.3.4',
      nodeVersion: '22.x',
      chromeVersion: '134.x',
      appVersion: '5.2.0',
      totalMemMB: 16384,
      rssMB: 85,
      uptimeSeconds: 120,
    };

    const uptimeStr = `${Math.floor(sys.uptimeSeconds / 60)} min ${sys.uptimeSeconds % 60} s`;

    this.container.innerHTML = `
      <section class="settings-hub" id="settings-hub">
        <!-- En-tête Hero Bento -->
        <div class="settings-hero">
          <div class="settings-badge">SESSION 7 • CENTRE DE CONTRÔLE</div>
          <h1 class="settings-headline">PARAMÈTRES DU COCKPIT</h1>
          <p class="settings-desc">
            Personnalisez votre espace de travail, configurez vos modules, gérez la persistance centralisée de vos données et consultez la télémétrie native de votre machine.
          </p>
        </div>

        <div id="settings-toast" class="settings-toast"></div>

        <!-- SECTION 1 : Thèmes Visuels -->
        <div class="settings-section-card">
          <div class="settings-card-header">
            <div class="settings-header-left">
              <span class="settings-header-icon">🎨</span>
              <div>
                <div class="settings-header-title">Thèmes & Esthétique Visuelle</div>
                <div class="settings-header-subtitle">5 palettes graphiques haute fidélité accélérées à 60 FPS</div>
              </div>
            </div>
          </div>

          <div class="themes-grid-cards">
            ${THEMES.map(
              (theme) => `
              <div
                class="theme-card-choice ${theme.id === this.currentTheme ? 'active' : ''}"
                data-theme-id="${theme.id}"
                title="Activer le thème ${theme.name}"
              >
                <div class="theme-choice-header">
                  <div class="theme-choice-swatches">
                    <span class="theme-swatch-dot" style="background: ${theme.color};"></span>
                    <span class="theme-swatch-dot" style="background: ${theme.secondary};"></span>
                  </div>
                  <span class="theme-active-tag" style="display: ${theme.id === this.currentTheme ? 'inline-block' : 'none'};">Actif</span>
                </div>
                <h4 class="theme-choice-name">${theme.name}</h4>
                <p class="theme-choice-desc">${theme.desc}</p>
              </div>
            `
            ).join('')}
          </div>
        </div>

        <!-- SECTION 2 : Préférences Modules & Interface -->
        <div class="settings-section-card">
          <div class="settings-card-header">
            <div class="settings-header-left">
              <span class="settings-header-icon">⚙️</span>
              <div>
                <div class="settings-header-title">Préférences de l'Interface & Modules</div>
                <div class="settings-header-subtitle">Comportement de l'horloge, météo, minuteur et alertes</div>
              </div>
            </div>
          </div>

          <div class="settings-options-list">
            <!-- Format Horloge -->
            <div class="settings-option-row">
              <div class="option-text">
                <span class="option-label">Format de l'Horloge Station</span>
                <span class="option-desc">Affichage standard 24 heures ou format anglo-saxon 12 heures (AM/PM)</span>
              </div>
              <select class="settings-select" id="pref-clock-format">
                <option value="24h" ${this.preferences.clockFormat === '24h' ? 'selected' : ''}>24 Heures (14:30)</option>
                <option value="12h" ${this.preferences.clockFormat === '12h' ? 'selected' : ''}>12 Heures (02:30 PM)</option>
              </select>
            </div>

            <!-- Afficher les secondes -->
            <div class="settings-option-row">
              <div class="option-text">
                <span class="option-label">Affichage des Secondes</span>
                <span class="option-desc">Afficher les secondes en direct sur la station d'accueil et le HUD</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="pref-show-seconds" ${this.preferences.showSeconds ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Carillon Zen Pomodoro -->
            <div class="settings-option-row">
              <div class="option-text">
                <span class="option-label">Carillon Harmonique Zen (Pomodoro)</span>
                <span class="option-desc">Synthétiseur Web Audio 432Hz lors de la fin d'une session de focus</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="pref-zen-chime" ${this.preferences.zenChime ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Notifications OS -->
            <div class="settings-option-row">
              <div class="option-text">
                <span class="option-label">Notifications Système Natives (OS)</span>
                <span class="option-desc">Émettre des notifications système même lorsque l'application est réduite</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="pref-system-notifs" ${this.preferences.systemNotifications ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Ville Météo par défaut -->
            <div class="settings-option-row">
              <div class="option-text">
                <span class="option-label">Ville Météo par Défaut</span>
                <span class="option-desc">Positionnement géographique initial de la station Open-Meteo</span>
              </div>
              <select class="settings-select" id="pref-weather-city">
                <option value="lln" ${this.preferences.defaultWeatherCity === 'lln' ? 'selected' : ''}>Louvain-la-Neuve (Belgique)</option>
                <option value="bruxelles" ${this.preferences.defaultWeatherCity === 'bruxelles' ? 'selected' : ''}>Bruxelles (Belgique)</option>
                <option value="paris" ${this.preferences.defaultWeatherCity === 'paris' ? 'selected' : ''}>Paris (France)</option>
                <option value="lyon" ${this.preferences.defaultWeatherCity === 'lyon' ? 'selected' : ''}>Lyon (France)</option>
                <option value="montreal" ${this.preferences.defaultWeatherCity === 'montreal' ? 'selected' : ''}>Montréal (Canada)</option>
                <option value="tokyo" ${this.preferences.defaultWeatherCity === 'tokyo' ? 'selected' : ''}>Tokyo (Japon)</option>
              </select>
            </div>

            <!-- Moteur de recherche par défaut -->
            <div class="settings-option-row">
              <div class="option-text">
                <span class="option-label">Moteur de Recherche Omnibox</span>
                <span class="option-desc">Moteur utilisé par défaut lorsqu'aucun bang (!g, !yt) n'est spécifié</span>
              </div>
              <select class="settings-select" id="pref-search-engine">
                <option value="google" ${this.preferences.defaultSearchEngine === 'google' ? 'selected' : ''}>Google (!g)</option>
                <option value="duckduckgo" ${this.preferences.defaultSearchEngine === 'duckduckgo' ? 'selected' : ''}>DuckDuckGo (!d)</option>
                <option value="youtube" ${this.preferences.defaultSearchEngine === 'youtube' ? 'selected' : ''}>YouTube (!yt)</option>
                <option value="github" ${this.preferences.defaultSearchEngine === 'github' ? 'selected' : ''}>GitHub (!gh)</option>
                <option value="wikipedia" ${this.preferences.defaultSearchEngine === 'wikipedia' ? 'selected' : ''}>Wikipédia (!w)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SECTION 3 : Sauvegarde & Restauration JSON -->
        <div class="settings-section-card">
          <div class="settings-card-header">
            <div class="settings-header-left">
              <span class="settings-header-icon">💾</span>
              <div>
                <div class="settings-header-title">Persistance & Sauvegarde Centralisée</div>
                <div class="settings-header-subtitle">Gestion locale du fichier de données (Store JSON) et export universel</div>
              </div>
            </div>
          </div>

          <div class="storage-path-box">
            <span>Fichier de persistance local :</span>
            <span class="storage-path-value">${escapeHtml(this.storePath || '~/.config/violet-cockpit/violet-store.json')}</span>
          </div>

          <div class="settings-actions-row">
            <button type="button" class="btn-settings-action btn-settings-primary" id="btn-export-config">
              <span>💾 Exporter la configuration JSON</span>
            </button>
            <button type="button" class="btn-settings-action btn-settings-secondary" id="btn-import-config">
              <span>📥 Restaurer depuis un fichier JSON</span>
            </button>
            <button type="button" class="btn-settings-action btn-settings-danger" id="btn-reset-config">
              <span>⚠️ Réinitialiser aux valeurs d'usine</span>
            </button>
          </div>
        </div>

        <!-- SECTION 4 : Télémétrie Système & Diagnostic -->
        <div class="settings-section-card">
          <div class="settings-card-header">
            <div class="settings-header-left">
              <span class="settings-header-icon">📊</span>
              <div>
                <div class="settings-header-title">Télémétrie & Informations Système</div>
                <div class="settings-header-subtitle">Diagnostic matériel et runtime Electron natif</div>
              </div>
            </div>
          </div>

          <div class="system-metrics-grid">
            <div class="metric-tile">
              <span class="metric-label">Système d'Exploitation</span>
              <span class="metric-val">${escapeHtml(sys.platform.toUpperCase())} (${escapeHtml(sys.arch)})</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Version Application</span>
              <span class="metric-val">v${escapeHtml(sys.appVersion)}</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Moteur Electron</span>
              <span class="metric-val">v${escapeHtml(sys.electronVersion)}</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Chromium Runtime</span>
              <span class="metric-val">v${escapeHtml(sys.chromeVersion)}</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Node.js Runtime</span>
              <span class="metric-val">v${escapeHtml(sys.nodeVersion)}</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Mémoire Vive Utilisée</span>
              <span class="metric-val">${sys.rssMB || 90} Mo (RSS)</span>
            </div>
            <div class="metric-tile">
              <span class="metric-label">Temps d'Activité</span>
              <span class="metric-val">${uptimeStr}</span>
            </div>
          </div>
        </div>

        <!-- SECTION 5 : Raccourcis Clavier du Cockpit -->
        <div class="settings-section-card">
          <div class="settings-card-header">
            <div class="settings-header-left">
              <span class="settings-header-icon">⌨️</span>
              <div>
                <div class="settings-header-title">Raccourcis Clavier Universels</div>
                <div class="settings-header-subtitle">Navigation à vitesse grand V sans toucher à la souris</div>
              </div>
            </div>
          </div>

          <table class="shortcuts-table">
            <tbody>
              <tr>
                <td class="shortcut-kbd-cell"><kbd class="sidebar-kbd">1</kbd> à <kbd class="sidebar-kbd">8</kbd></td>
                <td class="shortcut-desc-cell">Naviguer immédiatement entre les 8 vues du Cockpit (Accueil, Signets, Agenda, Météo, Marchés, Pomodoro, Notes, RSS)</td>
              </tr>
              <tr>
                <td class="shortcut-kbd-cell"><kbd class="sidebar-kbd">0</kbd></td>
                <td class="shortcut-desc-cell">Ouvrir le Centre de Contrôle & Paramètres</td>
              </tr>
              <tr>
                <td class="shortcut-kbd-cell"><kbd class="sidebar-kbd">T</kbd></td>
                <td class="shortcut-desc-cell">Cycler instantanément entre les 5 thèmes graphiques (Liquid Glass, Cyberdeck, Sakura, Kanagawa, Retro Wave)</td>
              </tr>
              <tr>
                <td class="shortcut-kbd-cell"><kbd class="sidebar-kbd">/</kbd> ou <kbd class="sidebar-kbd">Ctrl+K</kbd></td>
                <td class="shortcut-desc-cell">Activer et placer le curseur dans l'Omnibox Universelle de recherche</td>
              </tr>
              <tr>
                <td class="shortcut-kbd-cell"><kbd class="sidebar-kbd">↑</kbd> / <kbd class="sidebar-kbd">↓</kbd></td>
                <td class="shortcut-desc-cell">Parcourir les vues dans l'ordre de la Sidebar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  bindEvents() {
    // 1. Clic sur les thèmes
    this.container.querySelectorAll('.theme-card-choice').forEach((card) => {
      card.addEventListener('click', () => {
        const themeId = card.getAttribute('data-theme-id');
        if (themeId) {
          this.setTheme(themeId);
          this.showToast(`Thème activé : ${themeId}`, 'success');
        }
      });
    });

    // 2. Préférences des champs de sélection
    const clockFormatSelect = this.container.querySelector('#pref-clock-format');
    clockFormatSelect?.addEventListener('change', (e) => {
      this.preferences.clockFormat = e.target.value;
      this.savePreferences();
    });

    const weatherCitySelect = this.container.querySelector('#pref-weather-city');
    weatherCitySelect?.addEventListener('change', (e) => {
      this.preferences.defaultWeatherCity = e.target.value;
      this.savePreferences();
    });

    const searchEngineSelect = this.container.querySelector('#pref-search-engine');
    searchEngineSelect?.addEventListener('change', (e) => {
      this.preferences.defaultSearchEngine = e.target.value;
      this.savePreferences();
    });

    // Toggles
    const showSecondsToggle = this.container.querySelector('#pref-show-seconds');
    showSecondsToggle?.addEventListener('change', (e) => {
      this.preferences.showSeconds = e.target.checked;
      this.savePreferences();
    });

    const zenChimeToggle = this.container.querySelector('#pref-zen-chime');
    zenChimeToggle?.addEventListener('change', (e) => {
      this.preferences.zenChime = e.target.checked;
      this.savePreferences();
    });

    const notifsToggle = this.container.querySelector('#pref-system-notifs');
    notifsToggle?.addEventListener('change', (e) => {
      this.preferences.systemNotifications = e.target.checked;
      this.savePreferences();
    });

    // 3. Export JSON
    const exportBtn = this.container.querySelector('#btn-export-config');
    exportBtn?.addEventListener('click', async () => {
      try {
        if (window.desktopAPI?.exportConfig) {
          const result = await window.desktopAPI.exportConfig();
          if (result && result.success) {
            this.showToast(`Configuration exportée avec succès : ${result.filePath}`, 'success');
          } else if (!result?.canceled) {
            this.showToast(result?.error || 'Échec de l\'export de configuration', 'error');
          }
        } else {
          // Fallback browser download
          const blob = new Blob([JSON.stringify(this.preferences, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'violet-cockpit-config.json';
          a.click();
          URL.revokeObjectURL(url);
          this.showToast('Configuration téléchargée !', 'success');
        }
      } catch (err) {
        this.showToast(`Erreur export : ${err.message}`, 'error');
      }
    });

    // 4. Import JSON
    const importBtn = this.container.querySelector('#btn-import-config');
    importBtn?.addEventListener('click', async () => {
      try {
        if (window.desktopAPI?.importConfig) {
          const result = await window.desktopAPI.importConfig();
          if (result && result.success) {
            this.showToast('Configuration restaurée avec succès ! Rechargement...', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          } else if (!result?.canceled) {
            this.showToast(result?.error || 'Fichier JSON invalide', 'error');
          }
        } else {
          this.showToast('Import disponible uniquement en environnement Electron bureau.', 'error');
        }
      } catch (err) {
        this.showToast(`Erreur import : ${err.message}`, 'error');
      }
    });

    // 5. Réinitialiser
    const resetBtn = this.container.querySelector('#btn-reset-config');
    resetBtn?.addEventListener('click', async () => {
      const confirmed = window.confirm(
        'Êtes-vous sûr de vouloir réinitialiser Violet Cockpit aux valeurs d\'usine ? Toutes vos notes et tâches seront réinitialisées.'
      );
      if (!confirmed) return;

      try {
        if (window.desktopAPI?.resetStore) {
          await window.desktopAPI.resetStore();
        }
        localStorage.clear();
        this.showToast('Réinitialisation terminée ! Redémarrage...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        this.showToast(`Erreur réinitialisation : ${err.message}`, 'error');
      }
    });
  }
}
