import './markets.css';

export const MAJOR_TICKER_IDS = ['nvda', 'tsla', '10ap', 'cw8', 'cac40', 'sp500', 'gold', 'btc', 'eth'];

export class MarketsView {
  constructor(container) {
    this.container = container;
    this.selectedAssetId = 'nvda';
    this.quotes = {};
    this.currentChart = null;
    this.portfolio = null;
    this.refreshTimer = null;
    this.init();
  }

  async init() {
    this.render();
    this.bindEvents();
    await this.loadInitialData();
    // Rafraîchissement automatique discret toutes les 2 minutes
    this.refreshTimer = setInterval(() => this.refreshData(false), 120000);
  }

  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async loadInitialData() {
    await Promise.all([
      this.refreshQuotes(false),
      this.refreshChart(this.selectedAssetId),
      this.refreshPortfolio(),
    ]);
  }

  async refreshData(force = true) {
    const btn = this.container.querySelector('#markets-refresh-btn');
    btn?.classList.add('loading');
    try {
      await Promise.all([
        this.refreshQuotes(force),
        this.refreshChart(this.selectedAssetId),
        this.refreshPortfolio(),
      ]);
    } finally {
      btn?.classList.remove('loading');
    }
  }

  async refreshQuotes(force = false) {
    try {
      const res = await window.desktopAPI?.getMarketQuotes(force);
      if (res && res.quotes) {
        this.quotes = res.quotes;
        this.updateTickerDisplay();
      }
    } catch (err) {
      console.warn('[Markets] Erreur cotations:', err.message);
    }
  }

  async refreshChart(assetId) {
    this.selectedAssetId = assetId;
    this.updateTickerActiveState();
    try {
      const res = await window.desktopAPI?.getMarketChart(assetId, '1d', '5m');
      if (res && res.data) {
        this.currentChart = res.data;
        this.renderSpotlight();
      }
    } catch (err) {
      console.warn('[Markets] Erreur graphique:', err.message);
    }
  }

  async refreshPortfolio() {
    try {
      const res = await window.desktopAPI?.getPortfolio();
      if (res && res.status === 'ok') {
        this.portfolio = res;
        this.renderPortfolio();
      }
    } catch (err) {
      console.warn('[Markets] Erreur portefeuille:', err.message);
    }
  }

  render() {
    this.container.innerHTML = `
      <section class="markets-hub" id="markets-hub">
        <!-- Barre de titre & statut passerelle -->
        <div class="markets-top-row">
          <div class="markets-title-group">
            <h1 class="markets-main-title">MARCHÉS BOURSIERS & ETF</h1>
            <div class="markets-gateway-badge">
              <span class="gateway-pulse-dot"></span>
              <span>Passerelle Native Directe</span>
            </div>
          </div>

          <div class="markets-actions">
            <button type="button" class="markets-refresh-btn" id="markets-refresh-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        <!-- 1. Ticker des Actifs Majeurs -->
        <div class="assets-ticker-grid" id="assets-ticker-grid">
          ${MAJOR_TICKER_IDS.map(
            (id) => `
            <div class="asset-ticker-chip ${id === this.selectedAssetId ? 'active' : ''}" data-asset-id="${id}">
              <div class="ticker-chip-header">
                <span class="ticker-symbol">${id.toUpperCase()}</span>
                <span class="ticker-change" id="ticker-chg-${id}">--</span>
              </div>
              <span class="ticker-price" id="ticker-price-${id}">--</span>
            </div>
          `
          ).join('')}
        </div>

        <!-- 2. Hero Bento Spotlight avec Graphique 24h -->
        <div class="hero-spotlight-bento" id="hero-spotlight">
          <div class="spotlight-header">
            <div class="spotlight-identity">
              <div class="spotlight-title-row">
                <span class="spotlight-asset-name" id="spotlight-name">Chargement...</span>
                <span class="spotlight-asset-symbol" id="spotlight-symbol">--</span>
              </div>
              <span class="spotlight-exchange" id="spotlight-exchange">Place de cotation en direct</span>
            </div>

            <div class="spotlight-metrics">
              <span class="spotlight-live-price" id="spotlight-price">--</span>
              <span class="spotlight-change-pill" id="spotlight-change">--%</span>
              <div class="spotlight-day-range" id="spotlight-range">
                <span>Bas: <strong id="spotlight-low">--</strong></span>
                <span>•</span>
                <span>Haut: <strong id="spotlight-high">--</strong></span>
              </div>
            </div>
          </div>

          <!-- Tracé SVG & Tooltip -->
          <div class="spotlight-chart-wrap" id="spotlight-chart-wrap">
            <div class="chart-tooltip" id="chart-tooltip">
              <span id="tooltip-price">--</span>
              <span id="tooltip-time" style="color: var(--text-dim); font-size: 0.72rem;">--:--</span>
            </div>
            <svg class="spotlight-svg-chart" id="spotlight-svg" viewBox="0 0 800 240" preserveAspectRatio="none">
              <!-- Dégradé et Tracé injectés dynamiquement -->
            </svg>
          </div>

          <!-- Axe horizontal des heures -->
          <div class="spotlight-axis-row">
            <span id="axis-start">00:00</span>
            <span id="axis-mid">12:00</span>
            <span id="axis-end">Direct (Maintenant)</span>
          </div>
        </div>

        <!-- 3. Suivi du Portefeuille d'Investissement -->
        <div class="portfolio-bento-card" id="portfolio-card">
          <div class="portfolio-header-metrics">
            <div class="portfolio-metric-box">
              <span class="portfolio-metric-label">Valorisation Totale</span>
              <span class="portfolio-metric-val" id="port-total-val">--,-- €</span>
            </div>
            <div class="portfolio-metric-box">
              <span class="portfolio-metric-label">Plus-Value Globale</span>
              <div class="portfolio-gain-badge" id="port-gain-badge">--,-- € (--%)</div>
            </div>
            <div class="portfolio-metric-box">
              <span class="portfolio-metric-label">Capital Investi</span>
              <span class="portfolio-metric-val" style="font-size: 1.25rem; color: var(--text-muted);" id="port-invested-val">--,-- €</span>
            </div>
          </div>

          <!-- Tableau des positions -->
          <div style="overflow-x: auto;">
            <table class="portfolio-holdings-table">
              <thead>
                <tr>
                  <th>Actif / Position</th>
                  <th>Parts</th>
                  <th>PRU</th>
                  <th>Cours</th>
                  <th>Valeur</th>
                  <th>Plus-Value</th>
                </tr>
              </thead>
              <tbody id="portfolio-tbody">
                <tr>
                  <td colspan="6" style="text-align: center; color: var(--text-dim); padding: 20px;">
                    Chargement des positions du portefeuille...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;

    this.chartWrap = this.container.querySelector('#spotlight-chart-wrap');
    this.chartSvg = this.container.querySelector('#spotlight-svg');
    this.chartTooltip = this.container.querySelector('#chart-tooltip');
  }

  bindEvents() {
    // Bouton de rafraîchissement
    const refreshBtn = this.container.querySelector('#markets-refresh-btn');
    refreshBtn?.addEventListener('click', () => {
      this.refreshData(true);
    });

    // Clic sur les chips du ticker
    this.container.querySelectorAll('.asset-ticker-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-asset-id');
        if (id && id !== this.selectedAssetId) {
          this.refreshChart(id);
        }
      });
    });

    // Interaction souris sur le graphique 24h
    this.chartWrap?.addEventListener('mousemove', (e) => {
      this.handleChartMouseMove(e);
    });

    this.chartWrap?.addEventListener('mouseleave', () => {
      this.chartTooltip?.classList.remove('visible');
    });
  }

  updateTickerActiveState() {
    this.container.querySelectorAll('.asset-ticker-chip').forEach((chip) => {
      const match = chip.getAttribute('data-asset-id') === this.selectedAssetId;
      chip.classList.toggle('active', match);
    });
  }

  updateTickerDisplay() {
    MAJOR_TICKER_IDS.forEach((id) => {
      const q = this.quotes[id];
      const priceEl = this.container.querySelector(`#ticker-price-${id}`);
      const chgEl = this.container.querySelector(`#ticker-chg-${id}`);
      if (!q || !priceEl || !chgEl) return;

      const unit = q.unit || '$';
      priceEl.textContent = `${q.price} ${unit}`;

      const isUp = q.change >= 0;
      chgEl.className = `ticker-change ${isUp ? 'up' : 'down'}`;
      chgEl.textContent = `${isUp ? '+' : ''}${q.change}%`;
    });
  }

  renderSpotlight() {
    if (!this.currentChart) return;
    const c = this.currentChart;

    const nameEl = this.container.querySelector('#spotlight-name');
    const symbolEl = this.container.querySelector('#spotlight-symbol');
    const priceEl = this.container.querySelector('#spotlight-price');
    const changeEl = this.container.querySelector('#spotlight-change');
    const lowEl = this.container.querySelector('#spotlight-low');
    const highEl = this.container.querySelector('#spotlight-high');
    const axisStart = this.container.querySelector('#axis-start');
    const axisMid = this.container.querySelector('#axis-mid');

    if (nameEl) nameEl.textContent = c.name;
    if (symbolEl) symbolEl.textContent = c.symbol;
    if (priceEl) priceEl.textContent = `${c.endPrice} ${c.unit}`;

    const isUp = c.changePct >= 0;
    if (changeEl) {
      changeEl.className = `spotlight-change-pill ${isUp ? 'up' : 'down'}`;
      changeEl.textContent = `${isUp ? '+' : ''}${c.changePct}% (24h)`;
    }

    if (lowEl) lowEl.textContent = `${c.low} ${c.unit}`;
    if (highEl) highEl.textContent = `${c.high} ${c.unit}`;

    if (axisStart && c.axisLabels?.start) axisStart.textContent = c.axisLabels.start;
    if (axisMid && c.axisLabels?.mid) axisMid.textContent = c.axisLabels.mid;

    // Tracé de la courbe SVG
    this.drawChartSvg(c);
  }

  drawChartSvg(chartData) {
    const points = chartData.points;
    if (!points || points.length < 2) return;

    const width = 800;
    const height = 240;
    const paddingY = 24;

    const prices = points.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const rangePrice = maxPrice - minPrice || 1;

    // Projection des points sur le viewBox
    const coords = points.map((pt, index) => {
      const x = (index / (points.length - 1)) * width;
      const normalizedPrice = (pt.price - minPrice) / rangePrice;
      const y = height - paddingY - normalizedPrice * (height - paddingY * 2);
      return { x, y, pt };
    });

    this.renderedCoords = coords;

    // Construction du chemin spline
    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Chemin d'aire fermée
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    const isUp = chartData.changePct >= 0;
    const strokeColor = isUp ? '#34d399' : '#fb7185';
    const gradientId = `chart-grad-${isUp ? 'up' : 'down'}`;

    this.chartSvg.innerHTML = `
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.32" />
          <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#${gradientId})" />
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }

  handleChartMouseMove(e) {
    if (!this.renderedCoords || this.renderedCoords.length === 0) return;
    const rect = this.chartWrap.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * 800;

    // Trouver le point le plus proche
    let closest = this.renderedCoords[0];
    let minDiff = Math.abs(this.renderedCoords[0].x - relativeX);

    for (let i = 1; i < this.renderedCoords.length; i++) {
      const diff = Math.abs(this.renderedCoords[i].x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = this.renderedCoords[i];
      }
    }

    if (closest) {
      const priceText = `${closest.pt.price} ${this.currentChart.unit}`;
      const timeText = closest.pt.timeLabel || '';

      const tipPrice = this.container.querySelector('#tooltip-price');
      const tipTime = this.container.querySelector('#tooltip-time');
      if (tipPrice) tipPrice.textContent = priceText;
      if (tipTime) tipTime.textContent = timeText;

      const pxX = (closest.x / 800) * rect.width;
      this.chartTooltip.style.left = `${pxX}px`;
      this.chartTooltip.classList.add('visible');
    }
  }

  renderPortfolio() {
    if (!this.portfolio) return;
    const p = this.portfolio;

    const totalValEl = this.container.querySelector('#port-total-val');
    const gainBadgeEl = this.container.querySelector('#port-gain-badge');
    const investedEl = this.container.querySelector('#port-invested-val');
    const tbody = this.container.querySelector('#portfolio-tbody');

    if (totalValEl) totalValEl.textContent = `${p.totalValue.toFixed(2)} €`;
    if (investedEl) investedEl.textContent = `${p.totalInvested.toFixed(2)} €`;

    const isUp = p.totalGain >= 0;
    if (gainBadgeEl) {
      gainBadgeEl.className = `portfolio-gain-badge ${isUp ? 'up' : 'down'}`;
      gainBadgeEl.textContent = `${isUp ? '+' : ''}${p.totalGain.toFixed(2)} € (${isUp ? '+' : ''}${p.totalGainPct.toFixed(2)}%)`;
    }

    if (tbody && Array.isArray(p.holdings)) {
      tbody.innerHTML = p.holdings
        .map((h) => {
          const lineUp = h.gain >= 0;
          return `
            <tr>
              <td>
                <div class="holding-name-cell">
                  <span class="holding-name">${h.name}</span>
                  <span class="holding-shares">${h.shares} part${h.shares > 1 ? 's' : ''} • ${h.symbol}</span>
                </div>
              </td>
              <td class="holding-num">${h.shares}</td>
              <td class="holding-num">${h.buyPrice.toFixed(2)} €</td>
              <td class="holding-num" style="color: var(--accent-primary);">${h.currentPrice.toFixed(2)} €</td>
              <td class="holding-num">${h.currentValue.toFixed(2)} €</td>
              <td>
                <span class="holding-num ${lineUp ? 'ticker-change up' : 'ticker-change down'}">
                  ${lineUp ? '+' : ''}${h.gain.toFixed(2)} € (${lineUp ? '+' : ''}${h.gainPct.toFixed(2)}%)
                </span>
              </td>
            </tr>
          `;
        })
        .join('');
    }
  }
}
