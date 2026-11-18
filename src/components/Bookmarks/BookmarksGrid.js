import './bookmarks.css';

export const DEFAULT_BOOKMARK_CATEGORIES = [
  {
    id: 'dev',
    title: 'Développement & Cloud',
    icon: '💻',
    links: [
      { name: 'GitHub', url: 'https://github.com/', domain: 'github.com' },
      { name: 'Vercel', url: 'https://vercel.com/', domain: 'vercel.com' },
      { name: 'Supabase', url: 'https://supabase.com/', domain: 'supabase.com' },
      { name: 'Cloudflare', url: 'https://dash.cloudflare.com/', domain: 'cloudflare.com' },
      { name: 'StackOverflow', url: 'https://stackoverflow.com/', domain: 'stackoverflow.com' },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', domain: 'developer.mozilla.org' },
    ],
  },
  {
    id: 'finance',
    title: 'Finance & Bourse',
    icon: '📈',
    links: [
      { name: 'TradingView', url: 'https://fr.tradingview.com/', domain: 'tradingview.com' },
      { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/', domain: 'finance.yahoo.com' },
      { name: 'CoinMarketCap', url: 'https://coinmarketcap.com/', domain: 'coinmarketcap.com' },
      { name: 'Boursorama', url: 'https://www.boursorama.com/', domain: 'boursorama.com' },
      { name: 'Investing.com', url: 'https://fr.investing.com/', domain: 'investing.com' },
    ],
  },
  {
    id: 'social',
    title: 'Social & Médias',
    icon: '🌐',
    links: [
      { name: 'YouTube', url: 'https://www.youtube.com/', domain: 'youtube.com' },
      { name: 'Twitch', url: 'https://www.twitch.tv/', domain: 'twitch.tv' },
      { name: 'Twitter / X', url: 'https://x.com/', domain: 'x.com' },
      { name: 'Reddit', url: 'https://www.reddit.com/', domain: 'reddit.com' },
      { name: 'Spotify Web', url: 'https://open.spotify.com/', domain: 'spotify.com' },
    ],
  },
  {
    id: 'productivity',
    title: 'Productivité & IA',
    icon: '⚡',
    links: [
      { name: 'Gemini', url: 'https://gemini.google.com/app?hl=fr', domain: 'gemini.google.com' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/', domain: 'chatgpt.com' },
      { name: 'Claude AI', url: 'https://claude.ai/new', domain: 'claude.ai' },
      { name: 'Gmail', url: 'https://mail.google.com/', domain: 'mail.google.com' },
      { name: 'DeepL', url: 'https://www.deepl.com/translator', domain: 'deepl.com' },
      { name: 'Google Docs', url: 'https://docs.google.com/document/', domain: 'docs.google.com' },
    ],
  },
];

export class BookmarksGrid {
  constructor(container, { onOpenExternal, limitCategories = null } = {}) {
    this.container = container;
    this.onOpenExternal = onOpenExternal || ((url) => window.desktopAPI?.openExternal(url));
    this.limitCategories = limitCategories;
    this.categories = DEFAULT_BOOKMARK_CATEGORIES;
    this.filterQuery = '';
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.loadBookmarksAsync();
  }

  async loadBookmarksAsync() {
    try {
      const saved = await window.desktopAPI?.getStore('bookmarks_categories');
      if (saved && Array.isArray(saved) && saved.length > 0) {
        this.categories = saved;
        this.render();
        this.bindEvents();
        return;
      }
      const local = localStorage.getItem('violet_bookmarks');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.categories = parsed;
          this.render();
          this.bindEvents();
        }
      }
    } catch (_) {}
  }

  getTotalLinksCount() {
    return this.categories.reduce((acc, cat) => acc + (cat.links?.length || 0), 0);
  }

  getFaviconUrl(domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  }

  render() {
    const totalCount = this.getTotalLinksCount();
    const categoriesToDisplay = this.limitCategories
      ? this.categories.filter((cat) => this.limitCategories.includes(cat.id))
      : this.categories;

    this.container.innerHTML = `
      <section class="bookmarks-section" id="bookmarks-section">
        <!-- Header de la section -->
        <div class="bookmarks-header">
          <div class="bookmarks-title-row">
            <h2 class="bookmarks-section-title">SIGNETS & RACCOURCIS WEB</h2>
            <span class="bookmarks-badge-count" id="bkm-total-count">${totalCount} favoris</span>
          </div>

          <!-- Barre de filtre rapide -->
          <div class="bookmarks-filter-wrap">
            <span class="bookmarks-filter-icon">🔍</span>
            <input
              type="text"
              class="bookmarks-filter-input"
              id="bkm-filter-input"
              placeholder="Filtrer les favoris..."
              value="${this.filterQuery}"
            />
          </div>
        </div>

        <!-- Grille des catégories -->
        <div class="bookmarks-categories-grid" id="bkm-grid">
          ${this.renderCategoriesHtml(categoriesToDisplay)}
        </div>
      </section>
    `;

    this.gridEl = this.container.querySelector('#bkm-grid');
    this.filterInput = this.container.querySelector('#bkm-filter-input');
  }

  renderCategoriesHtml(categoriesList) {
    const query = this.filterQuery.toLowerCase().trim();

    return categoriesList
      .map((category) => {
        const filteredLinks = query
          ? category.links.filter(
              (l) => l.name.toLowerCase().includes(query) || l.domain.toLowerCase().includes(query)
            )
          : category.links;

        if (query && filteredLinks.length === 0) return '';

        return `
          <div class="category-bento-card" data-category-id="${category.id}">
            <div class="category-header">
              <div class="category-title-group">
                <span class="category-icon">${category.icon}</span>
                <span class="category-title">${category.title}</span>
              </div>
              <span class="category-link-count">${filteredLinks.length} lien${filteredLinks.length > 1 ? 's' : ''}</span>
            </div>

            <div class="category-links-list">
              ${filteredLinks
                .map(
                  (link) => `
                <a
                  href="${link.url}"
                  class="bookmark-tile"
                  data-url="${link.url}"
                  title="Ouvrir ${link.name} (${link.domain})"
                >
                  <div class="bookmark-tile-left">
                    <div class="bookmark-favicon-wrap">
                      <img
                        class="bookmark-favicon"
                        src="${this.getFaviconUrl(link.domain)}"
                        alt=""
                        loading="lazy"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                      />
                      <span class="fallback-letter" style="display: none; font-size: 10px; font-weight: bold; color: var(--accent-primary);">
                        ${link.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div class="bookmark-info">
                      <span class="bookmark-name">${link.name}</span>
                      <span class="bookmark-domain">${link.domain}</span>
                    </div>
                  </div>
                  <span class="bookmark-arrow">↗</span>
                </a>
              `
                )
                .join('')}
            </div>
          </div>
        `;
      })
      .join('');
  }

  bindEvents() {
    // Filtrage dynamique
    this.filterInput?.addEventListener('input', (e) => {
      this.filterQuery = e.target.value;
      const categoriesToDisplay = this.limitCategories
        ? this.categories.filter((cat) => this.limitCategories.includes(cat.id))
        : this.categories;
      this.gridEl.innerHTML = this.renderCategoriesHtml(categoriesToDisplay);
      this.bindTileClicks();
    });

    this.bindTileClicks();
  }

  bindTileClicks() {
    this.container.querySelectorAll('.bookmark-tile').forEach((tile) => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        const url = tile.getAttribute('data-url');
        if (url) {
          if (this.onOpenExternal) {
            this.onOpenExternal(url);
          } else {
            window.open(url, '_blank');
          }
        }
      });
    });
  }
}
