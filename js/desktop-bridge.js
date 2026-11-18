/**
 * js/desktop-bridge.js
 * Passerelle native entre le frontend Violet Startpage et le backend Tauri v2 (Rust).
 * Fournit l'intégration OS (liens externes, notifications, télémétrie matérielle, marchés).
 */

(function () {
  'use strict';

  const isTauri = typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

  async function invokeCommand(cmd, args = {}) {
    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
      return await window.__TAURI__.core.invoke(cmd, args);
    }
    if (window.__TAURI_INTERNALS__ && typeof window.__TAURI_INTERNALS__.invoke === 'function') {
      return await window.__TAURI_INTERNALS__.invoke(cmd, args);
    }
    throw new Error('Tauri IPC non disponible');
  }

  const DesktopCockpit = {
    isDesktop: isTauri,

    // Ouvre une URL dans le navigateur par défaut de l'OS (Chrome, Firefox, Brave...)
    async openExternal(url) {
      if (!url || typeof url !== 'string') return;
      if (!isTauri) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      try {
        await invokeCommand('plugin:opener|open_url', { url });
      } catch (err) {
        console.warn('[Desktop Bridge] Fallback opener:', err);
        window.open(url, '_blank');
      }
    },

    // Émet une notification système native de bureau
    async sendNotification(title, body = '') {
      if (!isTauri) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body, icon: 'images/glass.svg' });
        }
        return;
      }

      try {
        await invokeCommand('plugin:notification|notify', {
          options: {
            title: title || 'Violet Cockpit',
            body: body || '',
          },
        });
      } catch (err) {
        console.warn('[Desktop Bridge] Notification native non disponible:', err);
      }
    },

    // Récupère les cotations boursières via la passerelle Rust
    async getMarketQuotes(force = false) {
      if (!isTauri) return null;
      try {
        return await invokeCommand('get_market_quotes', { force });
      } catch (err) {
        console.error('[Desktop Bridge] Erreur get_market_quotes:', err);
        return null;
      }
    },

    // Récupère les données graphiques 24h via la passerelle Rust
    async getMarketChart(asset, range = '1d', interval = '5m') {
      if (!isTauri) return null;
      try {
        return await invokeCommand('get_market_chart', { asset, range, interval });
      } catch (err) {
        console.error('[Desktop Bridge] Erreur get_market_chart:', err);
        return null;
      }
    },

    // Récupère la télémétrie matérielle Linux (CPU %, RAM MB et %)
    async getSystemMetrics() {
      if (!isTauri) return null;
      try {
        return await invokeCommand('get_system_telemetry');
      } catch (err) {
        console.error('[Desktop Bridge] Erreur get_system_telemetry:', err);
        return null;
      }
    },

    // Sauvegarde l'état dans ~/.config/violet-startpage/data.json
    async saveLocalBackup(stateObj) {
      if (!isTauri) return;
      try {
        const jsonStr = typeof stateObj === 'string' ? stateObj : JSON.stringify(stateObj, null, 2);
        await invokeCommand('save_app_state', { content: jsonStr });
        console.log('[Desktop Bridge] Sauvegarde locale disque effectuée.');
      } catch (err) {
        console.warn('[Desktop Bridge] Erreur sauvegarde disque:', err);
      }
    },

    // Charge la sauvegarde ~/.config/violet-startpage/data.json
    async loadLocalBackup() {
      if (!isTauri) return null;
      try {
        const raw = await invokeCommand('load_app_state');
        if (raw) return JSON.parse(raw);
      } catch (err) {
        console.warn('[Desktop Bridge] Erreur lecture sauvegarde disque:', err);
      }
      return null;
    },
  };

  // Expose globalement
  window.DesktopCockpit = DesktopCockpit;

  // Interception universelle des clics sur les liens externes
  document.addEventListener('click', function (e) {
    if (!DesktopCockpit.isDesktop) return;

    const link = e.target.closest('a');
    if (!link || !link.href) return;

    // Si le lien mène vers l'extérieur (http/https) et n'est pas un hash local
    if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
      // Si la cible est _blank ou lien externe
      if (link.target === '_blank' || !link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        e.stopPropagation();
        DesktopCockpit.openExternal(link.href);
      }
    }
  }, true);

  // Initialisation de la surveillance télémétrique matérielle dans la Topbar
  function initHardwareTelemetryHUD() {
    if (!DesktopCockpit.isDesktop) return;

    // Cherche ou crée la puce télémétrique dans la topbar
    const topbarRight = document.querySelector('.topbar-telemetry') || document.querySelector('.topbar-right');
    if (!topbarRight) return;

    let sysBadge = document.getElementById('hud-sys-telemetry');
    if (!sysBadge) {
      sysBadge = document.createElement('div');
      sysBadge.id = 'hud-sys-telemetry';
      sysBadge.className = 'telemetry-badge hud-sys-badge';
      sysBadge.title = 'Télémétrie Matérielle Linux (Rust sysinfo)';
      sysBadge.innerHTML = `
        <i class="fa-solid fa-microchip"></i>
        <span class="sys-cpu-label">CPU: --%</span>
        <span class="sys-separator">|</span>
        <i class="fa-solid fa-memory"></i>
        <span class="sys-ram-label">RAM: --%</span>
      `;
      topbarRight.prepend(sysBadge);
    }

    const cpuEl = sysBadge.querySelector('.sys-cpu-label');
    const ramEl = sysBadge.querySelector('.sys-ram-label');

    async function updateTelemetry() {
      const data = await DesktopCockpit.getSystemMetrics();
      if (!data) return;
      if (cpuEl) cpuEl.textContent = `CPU: ${data.cpu_usage.toFixed(1)}%`;
      if (ramEl) {
        ramEl.textContent = `RAM: ${data.memory_pct.toFixed(0)}% (${(data.memory_used_mb / 1024).toFixed(1)}G)`;
      }
    }

    // Mise à jour toutes les 2.5 secondes
    updateTelemetry();
    setInterval(updateTelemetry, 2500);
  }

  // Lancement après le chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHardwareTelemetryHUD);
  } else {
    initHardwareTelemetryHUD();
  }
})();
