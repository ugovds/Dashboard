/**
 * js/desktop-bridge.js
 * Passerelle native entre le frontend Violet Startpage et le backend Electron.
 * Fournit l'intégration système complète : liens externes, notifications, cours boursiers, télémétrie.
 */

(function () {
  'use strict';

  const isElectron = typeof window !== 'undefined' && Boolean(window.desktopAPI);

  const DesktopCockpit = {
    isDesktop: isElectron,

    // Ouvre une URL dans le navigateur par défaut de l'OS (Chrome, Firefox, Brave...)
    openExternal(url) {
      if (!url || typeof url !== 'string') return;
      if (isElectron && typeof window.desktopAPI.openExternal === 'function') {
        window.desktopAPI.openExternal(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },

    // Émet une notification native de bureau de l'OS
    sendNotification(title, body = '') {
      if (isElectron && typeof window.desktopAPI.showNotification === 'function') {
        window.desktopAPI.showNotification({
          title: title || 'Violet Cockpit',
          body: body || '',
          icon: 'assets/icons/icon.png',
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: 'images/glass.svg' });
      }
    },

    // Récupère les cotations réelles (Yahoo Finance + CoinGecko) via le processus Node.js
    async getMarketQuotes(force = false) {
      if (isElectron && typeof window.desktopAPI.getMarketQuotes === 'function') {
        try {
          return await window.desktopAPI.getMarketQuotes(force);
        } catch (err) {
          console.error('[Desktop Bridge] Erreur getMarketQuotes:', err);
        }
      }
      return null;
    },

    // Récupère l'historique 24h d'un actif pour le tracé graphique interactif
    async getMarketChart(assetId, range = '1d', interval = '5m') {
      if (isElectron && typeof window.desktopAPI.getMarketChart === 'function') {
        try {
          const res = await window.desktopAPI.getMarketChart(assetId, range, interval);
          return res && res.data ? res.data : res;
        } catch (err) {
          console.error('[Desktop Bridge] Erreur getMarketChart:', err);
        }
      }
      return null;
    },

    // Récupère les prévisions météo haute précision via le backend natif
    async getWeather(city, force = false) {
      if (isElectron && typeof window.desktopAPI.getWeather === 'function') {
        try {
          return await window.desktopAPI.getWeather(city, force);
        } catch (err) {
          console.error('[Desktop Bridge] Erreur getWeather:', err);
        }
      }
      return null;
    },

    // Recherche de villes pour autocomplétion
    async searchWeatherCities(query) {
      if (isElectron && typeof window.desktopAPI.searchWeatherCities === 'function') {
        try {
          return await window.desktopAPI.searchWeatherCities(query);
        } catch (err) {
          console.error('[Desktop Bridge] Erreur searchWeatherCities:', err);
        }
      }
      return [];
    },

    // Télémétrie système (CPU, RAM réelle)
    async getSystemMetrics() {
      if (isElectron && typeof window.desktopAPI.getSystemInfo === 'function') {
        try {
          const info = await window.desktopAPI.getSystemInfo();
          if (info) {
            const usedMemMB = info.totalMemMB - info.freeMemMB;
            const memPct = info.totalMemMB > 0 ? (usedMemMB / info.totalMemMB) * 100 : 0;
            return {
              cpu_usage: 0,
              memory_used_mb: usedMemMB,
              memory_total_mb: info.totalMemMB,
              memory_pct: Math.round(memPct),
              uptime_secs: info.uptimeSeconds,
            };
          }
        } catch (err) {
          console.error('[Desktop Bridge] Erreur getSystemMetrics:', err);
        }
      }
      return null;
    },

    // Sauvegarde l'état local dans le fichier JSON sécurisé de l'utilisateur
    async saveLocalBackup(stateObj) {
      if (isElectron && typeof window.desktopAPI.setAllStore === 'function') {
        try {
          const data = typeof stateObj === 'string' ? JSON.parse(stateObj) : stateObj;
          await window.desktopAPI.setAllStore(data);
          console.log('[Desktop Bridge] Données sauvegardées dans le store local.');
        } catch (err) {
          console.warn('[Desktop Bridge] Erreur sauvegarde store:', err);
        }
      }
    },

    // Charge la configuration stockée
    async loadLocalBackup() {
      if (isElectron && typeof window.desktopAPI.getAllStore === 'function') {
        try {
          return await window.desktopAPI.getAllStore();
        } catch (err) {
          console.warn('[Desktop Bridge] Erreur lecture store:', err);
        }
      }
      return null;
    },
  };

  // Exposition globale
  window.DesktopCockpit = DesktopCockpit;

  // Interception universelle des clics sur les liens externes
  document.addEventListener(
    'click',
    function (e) {
      if (!DesktopCockpit.isDesktop) return;

      const link = e.target.closest('a');
      if (!link || !link.href) return;

      // Si le lien mène vers l'extérieur (http/https) et n'est pas un hash ou ancre locale
      if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
        if (link.target === '_blank' || !link.href.startsWith(window.location.origin)) {
          e.preventDefault();
          e.stopPropagation();
          DesktopCockpit.openExternal(link.href);
        }
      }
    },
    true
  );

  // Surveillance télémétrique dans la Topbar HUD
  function initHardwareTelemetryHUD() {
    if (!DesktopCockpit.isDesktop) return;

    const topbarRight = document.querySelector('.topbar-telemetry') || document.querySelector('.topbar-right');
    if (!topbarRight) return;

    let sysBadge = document.getElementById('hud-sys-telemetry');
    if (!sysBadge) {
      sysBadge = document.createElement('div');
      sysBadge.id = 'hud-sys-telemetry';
      sysBadge.className = 'telemetry-badge hud-sys-badge';
      sysBadge.title = 'Télémétrie Système (Electron Native)';
      sysBadge.innerHTML = `
        <i class="fa-solid fa-memory"></i>
        <span class="sys-ram-label">RAM: --%</span>
      `;
      topbarRight.prepend(sysBadge);
    }

    const ramEl = sysBadge.querySelector('.sys-ram-label');

    async function updateTelemetry() {
      if (document.hidden) return;
      const data = await DesktopCockpit.getSystemMetrics();
      if (!data) return;
      if (ramEl) {
        ramEl.textContent = `RAM: ${data.memory_pct}% (${(data.memory_used_mb / 1024).toFixed(1)}G)`;
      }
    }

    updateTelemetry();
    setInterval(updateTelemetry, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHardwareTelemetryHUD);
  } else {
    initHardwareTelemetryHUD();
  }
})();
