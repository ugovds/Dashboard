/**
 * app.js - Point d'entrée principal de l'application & utilitaires globaux
 * Violet Startpage - Cockpit Haute Performance
 */

// Système global de notifications Toast
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Animation d'apparition
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Disparition automatique après 3.2s
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

/**
 * ========================================================
 * PageSkeletonManager - GESTIONNAIRE UNIVERSEL DE PRÉCHARGEMENT
 * ========================================================
 * Élimine TOUT décalage ou élément tardif (pop-in à 400ms).
 * Chaque page s'affiche en squelette puis se révèle d'un seul bloc.
 */
const PageSkeletonManager = {
  activeTransitions: new Map(),
  revealedViews: new Set(),

  // Réaffiche le squelette et masque le contenu réel pendant la préparation
  showSkeleton(viewKey) {
    const skeleton = document.getElementById(`${viewKey}-skeleton-view`);
    const realView = document.getElementById(`${viewKey}-real-view`);
    if (!skeleton || !realView) return;

    if (this.activeTransitions.has(viewKey)) {
      clearTimeout(this.activeTransitions.get(viewKey));
      this.activeTransitions.delete(viewKey);
    }

    skeleton.classList.remove('is-hidden', 'is-fading-out');
    skeleton.removeAttribute('hidden');
    realView.classList.remove('is-loaded');
    realView.classList.add('is-loading');
  },

  // Révèle une vue depuis son squelette de manière instantanée et fluide
  revealView(viewKey, callback) {
    const skeleton = document.getElementById(`${viewKey}-skeleton-view`);
    const realView = document.getElementById(`${viewKey}-real-view`);
    if (!skeleton || !realView) {
      if (typeof callback === 'function') callback();
      return;
    }

    if (this.activeTransitions.has(viewKey)) {
      clearTimeout(this.activeTransitions.get(viewKey));
      this.activeTransitions.delete(viewKey);
    }

    requestAnimationFrame(() => {
      skeleton.classList.add('is-fading-out');
      realView.classList.remove('is-loading');
      realView.classList.add('is-loaded');
      this.revealedViews.add(viewKey);

      const timeoutId = setTimeout(() => {
        skeleton.classList.add('is-hidden');
        skeleton.setAttribute('hidden', '');
        if (typeof callback === 'function') callback();
      }, 120);

      this.activeTransitions.set(viewKey, timeoutId);
    });
  },

  // Prépare le rendu sous le squelette puis révèle la vue complète d'un coup
  prepareAndRevealView(viewKey, onRender, minDelayMs = 0) {
    const skeleton = document.getElementById(`${viewKey}-skeleton-view`);
    const realView = document.getElementById(`${viewKey}-real-view`);

    if (!skeleton || !realView) {
      if (typeof onRender === 'function') {
        try { onRender(); } catch (err) { console.warn(`Render error on ${viewKey}:`, err); }
      }
      return;
    }

    // Rendu immédiat
    if (typeof onRender === 'function') {
      try {
        onRender();
      } catch (err) {
        console.warn(`Render error on ${viewKey}:`, err);
      }
    }

    if (minDelayMs > 0) {
      const timerId = setTimeout(() => {
        this.revealView(viewKey);
      }, minDelayMs);
      this.activeTransitions.set(viewKey, timerId);
    } else {
      this.revealView(viewKey);
    }
  }
};

window.PageSkeletonManager = PageSkeletonManager;

// Rétrocompatibilité avec les scripts appelant revealDashboardFromSkeleton()
function revealDashboardFromSkeleton() {
  PageSkeletonManager.revealView('dashboard');
}
window.revealDashboardFromSkeleton = revealDashboardFromSkeleton;

document.addEventListener('DOMContentLoaded', () => {
  const loadStart = performance.now();

  const safeInit = (fn, name) => {
    if (typeof fn === 'function') {
      try {
        fn();
      } catch (err) {
        console.error(`[Startpage] Error during ${name}:`, err);
      }
    }
  };

  // === PHASE 1 : CRITIQUE & SYNCHRONE (Hydratation complète des données locales) ===
  safeInit(initThemes, 'initThemes');
  safeInit(initAppearance, 'initAppearance');
  safeInit(initBookmarks, 'initBookmarks');
  safeInit(initTasks, 'initTasks');
  safeInit(initCalendar, 'initCalendar');
  safeInit(initSearch, 'initSearch');
  safeInit(loadWidgetSettings, 'loadWidgetSettings');
  safeInit(applyWidgetVisibility, 'applyWidgetVisibility');
  safeInit(initCustomHub, 'initCustomHub');
  safeInit(initShortcuts, 'initShortcuts');
  safeInit(initWidgets, 'initWidgets');

  // Pré-initialisation synchrone des Marchés et de la Météo locale AVANT la révélation
  // afin que TOUS les éléments du Cockpit soient déjà calculés et affichés ensemble
  safeInit(initMarkets, 'initMarkets');
  safeInit(initWeather, 'initWeather');
  safeInit(initOverviewDashboard, 'initOverviewDashboard');

  // Révélation immédiate de la vue initiale sans attente artificielle
  const activeBtn = document.querySelector('.deck-nav-btn.active');
  const initialViewKey = activeBtn?.dataset?.deckView || 'dashboard';
  requestAnimationFrame(() => {
    PageSkeletonManager.revealView(initialViewKey);
    // Assure qu'aucun champ n'a le focus au démarrage pour que les flèches changent d'onglet immédiatement
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  });

  // === PHASE 2 : DIFFÉRÉE (Tâches réseau d'arrière-plan sans impact sur le layout) ===
  const deferNonCritical = () => {
    safeInit(initWeatherFx, 'initWeatherFx');
    safeInit(initFeeds, 'initFeeds');
    safeInit(initCommandPalette, 'initCommandPalette');

    // Enregistrement du Service Worker pour le mode hors-ligne PWA
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(deferNonCritical, { timeout: 800 });
  } else {
    setTimeout(deferNonCritical, 80);
  }
});
