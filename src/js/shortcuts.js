/**
 * shortcuts.js - Raccourcis clavier globaux & Navigation rapide
 * - Flèches (Droite / Bas / Gauche / Haut) : Bascule entre les onglets du cockpit dès le démarrage
 * - Saisie au clavier (lettres, chiffres...) : Cible automatiquement la recherche Google quand on commence à taper
 * - Alt+1 à Alt+9 : Bascule directe vers un onglet spécifique
 * - Ctrl+K : Ouvre la palette de commande et recherche de signets
 * - Ctrl+Shift+D : Bascule le mode Nuit / Atténuation HUD
 * - / : Cible manuellement la barre de recherche globale
 * - Échap : Vide et quitte le champ de recherche ou ferme les modales
 */

function isAnyModalOpen() {
  const visibleModals = document.querySelectorAll(
    '.modal-backdrop:not([hidden]), #edit-modal:not([hidden]), #category-modal:not([hidden]), #command-palette-modal:not([hidden]), #market-chart-modal:not([hidden]):not(.is-hidden), #portfolio-manage-modal:not([hidden]):not(.is-hidden)'
  );
  return Array.from(visibleModals).some(
    (el) => el.style.display !== 'none' && !el.classList.contains('is-hidden')
  );
}

function switchDeckTab(direction) {
  // Liste ordonnée de tous les onglets visibles dans la barre latérale
  const sidebarBtns = Array.from(
    document.querySelectorAll('.sidebar-nav .deck-nav-btn, .sidebar-nav-item')
  ).filter((b, idx, self) => self.indexOf(b) === idx)
   .filter((b) => !b.classList.contains('tab-hidden') && b.style.display !== 'none' && b.offsetParent !== null);

  if (!sidebarBtns.length) return;

  const activeBtn = document.querySelector('.sidebar-nav .deck-nav-btn.active') ||
                    document.querySelector('.deck-nav-btn.active');
  const activeIdx = activeBtn ? sidebarBtns.indexOf(activeBtn) : -1;

  let targetIdx;
  if (direction > 0) {
    targetIdx = (activeIdx < 0 || activeIdx >= sidebarBtns.length - 1) ? 0 : activeIdx + 1;
  } else {
    targetIdx = (activeIdx <= 0) ? sidebarBtns.length - 1 : activeIdx - 1;
  }

  const targetBtn = sidebarBtns[targetIdx];
  if (targetBtn) {
    targetBtn.click();
    // Évite qu'un contour de focus reste bloqué sur le bouton cliqué
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }
}

function initShortcuts() {
  const DECK_VIEWS_ORDER = [
    'dashboard',
    'bookmarks',
    'agenda',
    'weather',
    'feeds',
    'system',
    'pomodoro',
    'notes',
    'quotes',
    'customize'
  ];

  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const searchInput = document.getElementById('search-input');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');

    const editModal = document.getElementById('edit-modal');
    const categoryModal = document.getElementById('category-modal');
    const commandPaletteModal = document.getElementById('command-palette-modal');

    const isEditModalOpen = editModal && !editModal.hidden;
    const isCategoryModalOpen = categoryModal && !categoryModal.hidden;
    const isPaletteOpen = commandPaletteModal && !commandPaletteModal.hidden;

    // 1. Fermeture des modales avec Échap
    if (e.key === 'Escape') {
      if (isPaletteOpen && typeof closeCommandPalette === 'function') {
        closeCommandPalette();
        return;
      }
      if (isEditModalOpen && typeof closeEditModal === 'function') {
        closeEditModal();
        return;
      }
      if (isCategoryModalOpen && typeof closeCategoryModal === 'function') {
        closeCategoryModal();
        return;
      }
      if (active === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        const suggestionsBox = document.getElementById('suggestions-box');
        if (suggestionsBox) suggestionsBox.hidden = true;
        return;
      }
      if (active && active !== document.body) {
        active.blur();
        return;
      }
    }

    // 2. Toggle Palette de Commande via Ctrl+K / Cmd+K
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      if (isPaletteOpen) {
        if (typeof closeCommandPalette === 'function') closeCommandPalette();
      } else {
        if (typeof openCommandPalette === 'function') openCommandPalette();
      }
      return;
    }

    // 3. Toggle Dim Mode (Mode Nuit / Atténuation HUD) via Ctrl+Shift+D
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      if (typeof toggleDimMode === 'function') toggleDimMode();
      return;
    }

    // 4. Navigation directe dans le deck via Alt+1 à Alt+9 et Alt+0
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      let num = null;
      if (e.code.startsWith('Digit')) {
        num = parseInt(e.code.replace('Digit', ''), 10);
      } else if (e.code.startsWith('Numpad')) {
        num = parseInt(e.code.replace('Numpad', ''), 10);
      } else if (e.key >= '0' && e.key <= '9') {
        num = parseInt(e.key, 10);
      }

      if (num !== null) {
        const targetIdx = num === 0 ? 9 : num - 1;
        if (targetIdx >= 0 && targetIdx < DECK_VIEWS_ORDER.length) {
          e.preventDefault();
          const targetViewKey = DECK_VIEWS_ORDER[targetIdx];
          const navBtn = document.querySelector(`.deck-nav-btn[data-deck-view="${targetViewKey}"]`);
          if (navBtn && !navBtn.classList.contains('tab-hidden') && navBtn.style.display !== 'none') {
            navBtn.click();
            if (typeof showToast === 'function') {
              const label = navBtn.querySelector('.nav-label')?.textContent || navBtn.querySelector('span')?.textContent || targetViewKey;
              showToast(`Vue : ${label} (Alt+${num})`, 'info');
            }
          }
          return;
        }
      }
    }

    // Si une modale est ouverte, on laisse la modale gérer ses événements clavier
    if (isAnyModalOpen()) return;

    // Détection si l'utilisateur est en train d'écrire dans un champ de texte
    const isInputOrEditor = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.tagName === 'SELECT' ||
      active.isContentEditable
    );

    // 5. Gestion spécifique du champ de recherche Google
    if (active === searchInput) {
      const isSearchEmpty = searchInput.value.trim() === '';
      const isArrowKey = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key);

      // Si le champ est vide et qu'on appuie sur une flèche -> change d'onglet immédiatement
      if (isSearchEmpty && isArrowKey) {
        e.preventDefault();
        searchInput.blur();
        switchDeckTab(e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1);
        return;
      }

      // Si le champ contient du texte, on laisse la navigation standard des suggestions / curseur
      return;
    }

    // Si l'utilisateur tape dans un autre champ (ex: tâche, note, url de favori), on ne le perturbe pas
    if (isInputOrEditor) return;

    // 6. Navigation par FLÈCHES pour changer d'onglet (fonctionne dès le démarrage !)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      switchDeckTab(1); // Onglet suivant
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      switchDeckTab(-1); // Onglet précédent
      return;
    }

    // 7. Annuler la suppression (Ctrl+Z / Cmd+Z)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (typeof undoDeleteTask === 'function' && undoDeleteTask()) {
        e.preventDefault();
        return;
      }
      if (typeof undoDeleteBookmark === 'function' && undoDeleteBookmark()) {
        e.preventDefault();
        return;
      }
    }

    // 8. Raccourci '/' : Cible la barre de recherche manuellement
    if (e.key === '/' && searchInput) {
      e.preventDefault();
      const dashBtn = document.querySelector('.deck-nav-btn[data-deck-view="dashboard"]');
      if (dashBtn && !dashBtn.classList.contains('active')) {
        dashBtn.click();
      }
      searchInput.focus();
      return;
    }

    // Touches du pavé numérique pour les thèmes (Numpad1 à Numpad5)
    if (['Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5'].includes(e.code)) {
      const num = e.code.replace('Numpad', '');
      if (typeof themesConfig !== 'undefined' && themesConfig[num] && typeof applyTheme === 'function') {
        e.preventDefault();
        applyTheme(num);
        return;
      }
    }

    // 9. FOCUS SUR LA RECHERCHE GOOGLE SEULEMENT QUAND ON COMMENCE À TAPER
    // Dès qu'on appuie sur une touche imprimable (lettre, chiffre, symbole) hors combinaisons Ctrl/Alt/Meta :
    const isControlKey = [
      'Escape', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'Meta',
      'CapsLock', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Delete', 'Backspace',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ].includes(e.key);

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && !isControlKey) {
      // Si on n'est pas sur la vue d'accueil (dashboard où se trouve la recherche Google), on y bascule
      const dashBtn = document.querySelector('.deck-nav-btn[data-deck-view="dashboard"]');
      if (dashBtn && !dashBtn.classList.contains('active')) {
        dashBtn.click();
      }

      if (searchInput) {
        searchInput.focus();
        // Le caractère sera directement saisi dans le champ par le navigateur
      }
    }
  });
}
