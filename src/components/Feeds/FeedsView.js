import './feeds.css';
import { AmbientAudio } from './AmbientAudio.js';

export const RSS_PRESETS = [
  { id: 'tech', name: 'Hacker News', icon: '⚡', category: 'Tech' },
  { id: 'numerama', name: 'Numerama', icon: '🚀', category: 'Tech' },
  { id: 'lesoir', name: 'Le Soir', icon: '📰', category: 'Actu' },
  { id: 'lemonde', name: 'Le Monde', icon: '🌍', category: 'Actu' },
  { id: 'f1', name: 'Formule 1', icon: '🏎️', category: 'Sport' },
];

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class FeedsView {
  constructor(container) {
    this.container = container;
    this.ambientAudio = null;
    this.currentFeedKey = 'tech';
    this.items = [];
    this.isLoading = false;
    this.error = null;
    this.lastUpdated = null;
    this.init();
  }

  init() {
    this.render();
    this.mountAmbientAudio();
    this.bindEvents();
    this.loadFeed(this.currentFeedKey);
  }

  destroy() {
    if (this.ambientAudio) {
      this.ambientAudio.destroy();
      this.ambientAudio = null;
    }
  }

  mountAmbientAudio() {
    const ambientSlot = this.container.querySelector('#feeds-ambient-slot');
    if (ambientSlot) {
      this.ambientAudio = new AmbientAudio(ambientSlot);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="feeds-view-container" id="feeds-view-container">
        <!-- 1. Barre Ambiance Lo-Fi Procédurale -->
        <div id="feeds-ambient-slot"></div>

        <!-- 2. Barre d'outils et sélection de flux -->
        <div class="feeds-toolbar">
          <div class="feeds-categories" id="feeds-categories">
            ${RSS_PRESETS.map(
              (p) => `
              <button
                type="button"
                class="feed-chip-btn ${p.id === this.currentFeedKey ? 'active' : ''}"
                data-feed-id="${p.id}"
              >
                <span class="feed-chip-icon">${p.icon}</span>
                <span>${escapeHtml(p.name)}</span>
              </button>
            `
            ).join('')}
          </div>

          <div class="feeds-actions">
            <span class="feed-status-meta" id="feed-status-meta">Chargement...</span>
            <button type="button" class="feed-refresh-btn" id="feed-refresh-btn" title="Actualiser le flux">
              <span class="feed-refresh-icon" id="feed-refresh-icon">🔄</span>
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        <!-- 3. Grille des articles RSS -->
        <div class="rss-articles-grid" id="rss-articles-grid">
          <div class="rss-loading-state">
            <div class="rss-loading-spinner"></div>
            <div class="rss-loading-text">Récupération des actualités en direct...</div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Boutons de sélection de flux
    const catContainer = this.container.querySelector('#feeds-categories');
    catContainer?.addEventListener('click', (e) => {
      const btn = e.target.closest('.feed-chip-btn');
      if (!btn) return;
      const feedId = btn.getAttribute('data-feed-id');
      if (feedId && feedId !== this.currentFeedKey) {
        this.currentFeedKey = feedId;
        this.container.querySelectorAll('.feed-chip-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadFeed(feedId);
      }
    });

    // Bouton actualiser
    const refreshBtn = this.container.querySelector('#feed-refresh-btn');
    refreshBtn?.addEventListener('click', () => {
      this.loadFeed(this.currentFeedKey, true);
    });

    // Délégation de clics sur les cartes d'articles pour ouvrir dans le navigateur externe
    const grid = this.container.querySelector('#rss-articles-grid');
    grid?.addEventListener('click', (e) => {
      const card = e.target.closest('.rss-article-card');
      if (!card) return;
      const link = card.getAttribute('data-link');
      if (link) {
        this.openExternal(link);
      }
    });
  }

  async loadFeed(feedKey) {
    this.isLoading = true;
    this.error = null;
    this.updateStatusText();

    const refreshIcon = this.container.querySelector('#feed-refresh-icon');
    refreshIcon?.classList.add('rotating');

    const grid = this.container.querySelector('#rss-articles-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="rss-loading-state">
          <div class="rss-loading-spinner"></div>
          <div class="rss-loading-text">Récupération du flux en direct...</div>
        </div>
      `;
    }

    try {
      let result = null;
      if (window.desktopAPI?.fetchRssFeed) {
        result = await window.desktopAPI.fetchRssFeed(feedKey);
      } else {
        // Fallback Web mock si l'IPC n'est pas encore dispo
        result = {
          status: 'ok',
          items: [
            {
              title: 'Violet Cockpit 5.2 : Architecture Electron & Vite',
              link: 'https://github.com',
              source: 'Violet Cockpit',
              date: 'Aujourd\'hui',
              description: 'Navigation rapide et intégration de l\'API native pour un dashboard complet sans serveur Python.',
            },
          ],
        };
      }

      if (result && result.items && result.items.length > 0) {
        this.items = result.items;
        this.lastUpdated = new Date();
        this.renderArticles();
      } else {
        throw new Error(result?.message || 'Aucun article trouvé');
      }
    } catch (err) {
      this.error = err.message;
      this.renderError();
    } finally {
      this.isLoading = false;
      refreshIcon?.classList.remove('rotating');
      this.updateStatusText();
    }
  }

  renderArticles() {
    const grid = this.container.querySelector('#rss-articles-grid');
    if (!grid) return;

    if (this.items.length === 0) {
      grid.innerHTML = `
        <div class="rss-error-state">
          <div class="rss-error-icon">📭</div>
          <div class="rss-error-text">Aucun article disponible pour ce flux.</div>
          <button type="button" class="rss-error-retry-btn" id="rss-retry-btn">Réessayer</button>
        </div>
      `;
      this.container.querySelector('#rss-retry-btn')?.addEventListener('click', () => {
        this.loadFeed(this.currentFeedKey);
      });
      return;
    }

    grid.innerHTML = this.items
      .map(
        (item) => `
        <article class="rss-article-card" data-link="${escapeHtml(item.link)}" title="Ouvrir l'article dans le navigateur">
          <div class="rss-card-header">
            <span class="rss-card-source">${escapeHtml(item.source || 'Actualité')}</span>
            <span class="rss-card-date">${escapeHtml(item.date || '')}</span>
          </div>
          <div class="rss-card-body">
            <h3 class="rss-card-title">${escapeHtml(item.title)}</h3>
            <p class="rss-card-desc">${escapeHtml(item.description)}</p>
          </div>
          <div class="rss-card-footer">
            <button type="button" class="rss-open-btn">
              <span>Lire l'article</span>
              <span>↗</span>
            </button>
          </div>
        </article>
      `
      )
      .join('');
  }

  renderError() {
    const grid = this.container.querySelector('#rss-articles-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="rss-error-state">
        <div class="rss-error-icon">⚠️</div>
        <div class="rss-error-text">Impossible de charger le flux RSS (${escapeHtml(this.error)})</div>
        <button type="button" class="rss-error-retry-btn" id="rss-retry-btn">Réessayer</button>
      </div>
    `;

    this.container.querySelector('#rss-retry-btn')?.addEventListener('click', () => {
      this.loadFeed(this.currentFeedKey);
    });
  }

  updateStatusText() {
    const statusMeta = this.container.querySelector('#feed-status-meta');
    if (!statusMeta) return;

    if (this.isLoading) {
      statusMeta.textContent = 'Actualisation...';
    } else if (this.lastUpdated) {
      const timeStr = this.lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      statusMeta.textContent = `${this.items.length} articles • Mis à jour à ${timeStr}`;
    } else {
      statusMeta.textContent = '';
    }
  }

  openExternal(url) {
    if (!url) return;
    if (window.desktopAPI?.openExternal) {
      window.desktopAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }
}
