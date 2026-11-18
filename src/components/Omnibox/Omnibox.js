import './omnibox.css';

export const SEARCH_ENGINES = {
  '!g': { name: 'Google', icon: '🔍', desc: 'Recherche Google par défaut', url: 'https://www.google.com/search?q=' },
  '!yt': { name: 'YouTube', icon: '▶️', desc: 'Vidéos & Musique sur YouTube', url: 'https://www.youtube.com/results?search_query=' },
  '!w': { name: 'Wikipédia', icon: '📖', desc: 'Articles sur Wikipédia FR', url: 'https://fr.wikipedia.org/wiki/Special:Search?search=' },
  '!d': { name: 'DuckDuckGo', icon: '🦆', desc: 'Recherche privée DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  '!gh': { name: 'GitHub', icon: '🐙', desc: 'Dépôts & Code sur GitHub', url: 'https://github.com/search?q=' },
  '!github': { name: 'GitHub', icon: '🐙', desc: 'Dépôts & Code sur GitHub', url: 'https://github.com/search?q=' },
  '!tr': { name: 'DeepL', icon: '🌐', desc: 'Traduction automatique DeepL', url: 'https://www.deepl.com/translator#auto/fr/' },
  '!maps': { name: 'Maps', icon: '🗺️', desc: 'Adresses & Itinéraires Google Maps', url: 'https://www.google.com/maps/search/' },
  '!img': { name: 'Images', icon: '🖼️', desc: 'Recherche d\'images Google', url: 'https://www.google.com/search?tbm=isch&q=' },
  '!so': { name: 'StackOverflow', icon: '💻', desc: 'Solutions Dev StackOverflow', url: 'https://stackoverflow.com/search?q=' },
  '!r': { name: 'Reddit', icon: '👽', desc: 'Communautés & discussions Reddit', url: 'https://www.reddit.com/search/?q=' },
};

function tryEvaluateMath(expr) {
  const clean = expr.trim().replace(/\s+/g, '');
  if (!/^[0-9+\-*/().%^]+$/.test(clean) || !/[+\-*/%^]/.test(clean)) return null;

  try {
    // Calcul sécurisé via Function sans accès aux variables globales
    const sanitized = clean.replace(/\^/g, '**');
    const fn = new Function(`'use strict'; return (${sanitized});`);
    const val = fn();
    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      return Number.isInteger(val) ? val : Number(val.toFixed(4));
    }
  } catch (_) {}
  return null;
}

export class Omnibox {
  constructor(container, { onOpenExternal } = {}) {
    this.container = container;
    this.onOpenExternal = onOpenExternal || ((url) => window.desktopAPI?.openExternal(url));
    this.suggestions = [];
    this.selectedIndex = -1;
    this.currentBang = null;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="omnibox-container" id="omnibox-root">
        <!-- Barre de recherche -->
        <div class="omnibox-search-bar" id="omnibox-bar">
          <!-- Badge moteur actif -->
          <div class="omnibox-engine-badge" id="omnibox-badge">
            <span id="badge-icon">🔍</span>
            <span id="badge-name">Google</span>
          </div>

          <div class="omnibox-search-icon" id="search-icon">🔍</div>

          <input
            type="text"
            class="omnibox-input"
            id="omnibox-input"
            placeholder="Rechercher sur le Web ou taper '!' pour les bangs..."
            autocomplete="off"
            spellcheck="false"
          />

          <div class="omnibox-shortcut-hint">
            <kbd title="Focus rapide">/</kbd>
          </div>

          <button type="button" class="omnibox-submit-btn" id="omnibox-submit" title="Lancer la recherche (Entrée)">
            ➔
          </button>
        </div>

        <!-- Menu déroulant des suggestions & Bangs -->
        <div class="omnibox-dropdown" id="omnibox-dropdown"></div>
      </div>
    `;

    this.input = this.container.querySelector('#omnibox-input');
    this.dropdown = this.container.querySelector('#omnibox-dropdown');
    this.badge = this.container.querySelector('#omnibox-badge');
    this.badgeIcon = this.container.querySelector('#badge-icon');
    this.badgeName = this.container.querySelector('#badge-name');
    this.submitBtn = this.container.querySelector('#omnibox-submit');
  }

  bindEvents() {
    // Saisie en direct dans l'input
    this.input.addEventListener('input', () => {
      this.handleInput();
    });

    // Clic en dehors pour masquer le dropdown
    window.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.hideDropdown();
      }
    });

    // Focus / Blur
    this.input.addEventListener('focus', () => {
      if (this.input.value.trim().length > 0) {
        this.handleInput();
      }
    });

    // Bouton de soumission
    this.submitBtn.addEventListener('click', () => {
      this.submit();
    });

    // Navigation clavier
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateSuggestions(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateSuggestions(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.submit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.hideDropdown();
        this.input.blur();
      }
    });

    // Raccourci clavier global '/' ou 'Ctrl+K' pour donner le focus
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;

      if ((e.key === '/' && !isInput) || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))) {
        e.preventDefault();
        this.input.focus();
        this.input.select();
      }
    });
  }

  handleInput() {
    const rawVal = this.input.value;
    const trimmed = rawVal.trim();

    // Détection de bang
    const match = trimmed.match(/^(![a-z]+)(\s*.*)$/i);
    if (match) {
      const prefix = match[1].toLowerCase();
      const engine = SEARCH_ENGINES[prefix];
      if (engine) {
        this.currentBang = prefix;
        this.badge.classList.add('visible');
        this.badgeIcon.textContent = engine.icon;
        this.badgeName.textContent = engine.name;
      } else {
        this.clearBang();
      }
    } else {
      this.clearBang();
    }

    // Afficher les suggestions
    if (trimmed.startsWith('!')) {
      this.showBangsMenu(trimmed);
      return;
    }

    // Tester s'il s'agit d'un calcul mathématique
    const mathResult = tryEvaluateMath(trimmed);
    if (mathResult !== null) {
      this.showMathSuggestion(trimmed, mathResult);
      return;
    }

    if (trimmed.length > 0) {
      this.showQuickSearchSuggestions(trimmed);
    } else {
      this.hideDropdown();
    }
  }

  clearBang() {
    this.currentBang = null;
    this.badge?.classList.remove('visible');
  }

  showBangsMenu(filter) {
    const list = Object.entries(SEARCH_ENGINES).filter(([prefix]) =>
      prefix.startsWith(filter.toLowerCase())
    );

    if (list.length === 0) {
      this.hideDropdown();
      return;
    }

    this.suggestions = list.map(([prefix, eng]) => ({
      type: 'bang',
      value: prefix + ' ',
      title: `${prefix} — ${eng.desc}`,
      badge: eng.name,
      icon: eng.icon,
    }));

    this.renderSuggestionsList('COMMANDES & BANGS DISPONIBLES');
  }

  showMathSuggestion(expr, result) {
    this.suggestions = [
      {
        type: 'math',
        value: String(result),
        title: `${expr} = <strong>${result}</strong>`,
        badge: 'CALC',
        icon: '🧮',
      },
      {
        type: 'search',
        value: expr,
        title: `Rechercher "${expr}"`,
        badge: 'SEARCH',
        icon: '🔍',
      },
    ];

    this.renderSuggestionsList('RÉSULTAT DU CALCUL');
  }

  showQuickSearchSuggestions(query) {
    this.suggestions = [
      {
        type: 'search',
        value: query,
        title: `Rechercher "<strong>${escapeHtml(query)}</strong>"`,
        badge: this.currentBang ? SEARCH_ENGINES[this.currentBang]?.name : 'GOOGLE',
        icon: this.currentBang ? SEARCH_ENGINES[this.currentBang]?.icon : '🔍',
      },
      {
        type: 'bang-hint',
        value: '!yt ' + query,
        title: `Rechercher sur YouTube : "<strong>${escapeHtml(query)}</strong>"`,
        badge: 'YOUTUBE',
        icon: '▶️',
      },
      {
        type: 'bang-hint',
        value: '!gh ' + query,
        title: `Rechercher sur GitHub : "<strong>${escapeHtml(query)}</strong>"`,
        badge: 'GITHUB',
        icon: '🐙',
      },
    ];

    this.renderSuggestionsList('SUGGESTIONS DE RECHERCHE');
  }

  renderSuggestionsList(headerTitle) {
    this.selectedIndex = -1;
    this.dropdown.innerHTML = `
      <div class="omnibox-dropdown-header">${headerTitle}</div>
      ${this.suggestions
        .map(
          (sug, idx) => `
        <div class="omnibox-sug-item" data-index="${idx}">
          <div class="sug-left">
            <span class="sug-icon">${sug.icon || '🔍'}</span>
            <div class="sug-text-wrap">
              <span class="sug-title">${sug.title}</span>
            </div>
          </div>
          <span class="sug-badge ${sug.type === 'math' ? 'math' : ''}">${sug.badge}</span>
        </div>
      `
        )
        .join('')}
    `;

    this.dropdown.querySelectorAll('.omnibox-sug-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        if (this.suggestions[idx]) {
          const picked = this.suggestions[idx];
          if (picked.type === 'bang') {
            this.input.value = picked.value;
            this.input.focus();
            this.handleInput();
          } else {
            this.input.value = picked.value;
            this.submit();
          }
        }
      });
    });

    this.dropdown.classList.add('visible');
  }

  navigateSuggestions(delta) {
    if (!this.suggestions.length) return;
    this.selectedIndex += delta;
    if (this.selectedIndex < 0) this.selectedIndex = this.suggestions.length - 1;
    if (this.selectedIndex >= this.suggestions.length) this.selectedIndex = 0;

    const items = this.dropdown.querySelectorAll('.omnibox-sug-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === this.selectedIndex);
      if (idx === this.selectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  hideDropdown() {
    this.dropdown?.classList.remove('visible');
    this.selectedIndex = -1;
    this.suggestions = [];
  }

  submit() {
    let raw = this.input.value.trim();
    if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
      raw = this.suggestions[this.selectedIndex].value;
    }

    if (!raw) return;

    this.hideDropdown();
    this.openDestination(raw);
  }

  openDestination(query) {
    let targetUrl = '';

    // 1. Détection de bang (ex: !yt lofi, !gh electron)
    const bangMatch = query.match(/^(![a-z]+)\s*(.*)$/i);
    if (bangMatch) {
      const prefix = bangMatch[1].toLowerCase();
      const rest = bangMatch[2].trim();
      const engine = SEARCH_ENGINES[prefix];
      if (engine) {
        targetUrl = rest ? engine.url + encodeURIComponent(rest) : engine.url.replace(/\?.*=$/, '');
      }
    }

    // 2. Détection d'URL directe (ex: github.com, http://localhost:3000)
    if (!targetUrl) {
      if (/^https?:\/\//i.test(query)) {
        targetUrl = query;
      } else if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(query) || /^localhost(:[0-9]+)?(\/.*)?$/.test(query)) {
        targetUrl = `https://${query}`;
      }
    }

    // 3. Fallback recherche par défaut (Google)
    if (!targetUrl) {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }

    console.log('[Omnibox] Ouverture dans le navigateur par défaut:', targetUrl);

    // Ouvre impérativement via shell.openExternal de l'OS
    if (this.onOpenExternal) {
      this.onOpenExternal(targetUrl);
    } else {
      window.open(targetUrl, '_blank');
    }

    this.input.value = '';
    this.clearBang();
    this.input.blur();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
