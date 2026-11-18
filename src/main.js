import './styles/base.css';
import { Sidebar, Topbar, Viewport } from './components/Layout/index.js';

console.log('[Violet Cockpit] Initialisation Session 2 : Design System & Navigation...');

document.addEventListener('DOMContentLoaded', async () => {
  const desktopAPI = window.desktopAPI;

  let topbarInstance = null;
  let viewportInstance = null;
  let sidebarInstance = null;

  let activeTheme = 'liquid-glass';
  let currentTheme = null;

  try {
    const savedTheme = await desktopAPI?.getStore('activeTheme');
    if (savedTheme) {
      activeTheme = savedTheme;
    } else {
      const localTheme = localStorage.getItem('violet_theme');
      if (localTheme) activeTheme = localTheme;
    }
  } catch (err) {
    console.warn('[Theme] Erreur lors de la lecture du thème persistant:', err);
  }

  function applyTheme(themeId) {
    if (currentTheme === themeId) return;
    currentTheme = themeId;
    document.documentElement.setAttribute('data-theme', themeId);
    document.body.setAttribute('data-theme', themeId);
    try {
      localStorage.setItem('violet_theme', themeId);
      desktopAPI?.setStore('activeTheme', themeId)?.catch?.(() => {});
    } catch (_) {}
    topbarInstance?.setTheme(themeId);
    viewportInstance?.setTheme(themeId);
  }

  applyTheme(activeTheme);

  // 2. Montage des composants du Layout
  const sidebarSlot = document.getElementById('sidebar-slot');
  const topbarSlot = document.getElementById('topbar-slot');
  const viewportSlot = document.getElementById('viewport-slot');

  viewportInstance = new Viewport(viewportSlot, {
    onThemeChange: applyTheme,
  });

  topbarInstance = new Topbar(topbarSlot, {
    onThemeChange: (themeId) => {
      applyTheme(themeId);
    },
  });
  topbarInstance.setTheme(activeTheme);

  sidebarInstance = new Sidebar(sidebarSlot, {
    onNavigate: (itemInfo) => {
      viewportInstance.showView(itemInfo.id);
      topbarInstance.updateViewInfo(itemInfo);
    },
    onThemeCycle: () => {
      topbarInstance.cycleTheme();
    },
  });

  // Raccourci clavier 'T' (en dehors de toute saisie) pour cycler les 5 thèmes
  window.addEventListener('keydown', (e) => {
    const tag = e.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) {
      return;
    }
    if (e.key === 't' || e.key === 'T') {
      topbarInstance.cycleTheme();
    }
  });

  console.log('✔ [Violet Cockpit] Design System, 5 Thèmes et Navigation 60 FPS initialisés.');
});
