// Service Passerelle Financière Native pour Violet Cockpit
// Remplace intégralement le serveur Python runner.py sans aucun problème CORS

export const YAHOO_MAPPING = {
  // 1. Actions Internationales
  nvda: { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', unit: '$', exchange: 'NASDAQ' },
  tsla: { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', unit: '$', exchange: 'NASDAQ' },
  aapl: { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', unit: '$', exchange: 'NASDAQ' },
  msft: { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', unit: '$', exchange: 'NASDAQ' },
  googl: { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', unit: '$', exchange: 'NASDAQ' },
  meta: { symbol: 'META', name: 'Meta Platforms', type: 'stock', unit: '$', exchange: 'NASDAQ' },
  mstr: { symbol: 'MSTR', name: 'MicroStrategy Inc.', type: 'stock', unit: '$', exchange: 'NASDAQ' },
  mc: { symbol: 'MC.PA', name: 'LVMH Moët Hennessy', type: 'stock', unit: '€', exchange: 'Euronext Paris' },

  // 2. ETF & Fonds Indiciels (PEA & Europe)
  '10ap': { symbol: '500.PA', name: 'Amundi PEA S&P 500', type: 'etf', unit: '€', exchange: 'Euronext Paris' },
  cw8: { symbol: 'CW8.PA', name: 'Amundi MSCI World PEA', type: 'etf', unit: '€', exchange: 'Euronext Paris' },
  lyp6: { symbol: 'LYP6.DE', name: 'Amundi Stoxx Europe 600', type: 'etf', unit: '€', exchange: 'XETRA' },
  xmme: { symbol: 'XMME.DE', name: 'Xtrackers MSCI Emerging', type: 'etf', unit: '€', exchange: 'XETRA' },
  vwce: { symbol: 'VWCE.DE', name: 'Vanguard All-World', type: 'etf', unit: '€', exchange: 'XETRA' },

  // 3. Grands Indices Boursiers
  sp500: { symbol: '^GSPC', name: 'S&P 500', type: 'index', unit: 'pts', exchange: 'S&P' },
  nasdaq100: { symbol: '^NDX', name: 'Nasdaq 100', type: 'index', unit: 'pts', exchange: 'NASDAQ' },
  cac40: { symbol: '^FCHI', name: 'CAC 40', type: 'index', unit: 'pts', exchange: 'Euronext Paris' },
  dax40: { symbol: '^GDAXI', name: 'DAX 40', type: 'index', unit: 'pts', exchange: 'Deutsche Börse' },

  // 4. Matières Premières & Devises
  gold: { symbol: 'GC=F', name: 'Or (Gold Spot)', type: 'commodity', unit: '$', exchange: 'COMEX' },
  silver: { symbol: 'SI=F', name: 'Argent (Silver)', type: 'commodity', unit: '$', exchange: 'COMEX' },
  eurusd: { symbol: 'EURUSD=X', name: 'Euro / US Dollar', type: 'forex', unit: '$', exchange: 'Forex' },

  // 5. Cryptomonnaies
  btc: { symbol: 'BTC-USD', cgId: 'bitcoin', name: 'Bitcoin', type: 'crypto', unit: '$', exchange: 'Crypto' },
  eth: { symbol: 'ETH-USD', cgId: 'ethereum', name: 'Ethereum', type: 'crypto', unit: '$', exchange: 'Crypto' },
  sol: { symbol: 'SOL-USD', cgId: 'solana', name: 'Solana', type: 'crypto', unit: '$', exchange: 'Crypto' },
};

const CACHE_TTL_MS = 180 * 1000; // 3 minutes

class FinanceService {
  constructor(store = null) {
    this.store = store;
    this.quotesCache = {
      timestamp: 0,
      data: {},
    };
    this.chartsCache = new Map();
    this.initDefaultPortfolio();
  }

  initDefaultPortfolio() {
    this.defaultPortfolio = [
      {
        id: '10ap',
        name: 'Amundi PEA S&P 500 (10AP)',
        shortName: 'Amundi S&P 500',
        symbol: '500.PA',
        type: 'etf',
        shares: 4.1942,
        buyPrice: 133.56,
        currency: 'EUR',
      },
      {
        id: 'lyp6',
        name: 'Amundi Stoxx Europe 600 (LYP6)',
        shortName: 'Amundi Stoxx 600',
        symbol: 'LYP6.DE',
        type: 'etf',
        shares: 1.3584,
        buyPrice: 323.90,
        currency: 'EUR',
      },
      {
        id: 'xmme',
        name: 'Xtrackers MSCI Emerging Markets (XMME)',
        shortName: 'MSCI Emerging Mkts',
        symbol: 'XMME.DE',
        type: 'etf',
        shares: 4.0341,
        buyPrice: 79.32,
        currency: 'EUR',
      },
      {
        id: 'nvda',
        name: 'NVIDIA Corporation (NVDA)',
        shortName: 'NVIDIA Corporation',
        symbol: 'NVDA',
        type: 'stock',
        shares: 1.0,
        buyPrice: 194.90,
        currency: 'EUR',
      },
      {
        id: 'btc',
        name: 'Bitcoin (BTC)',
        shortName: 'Bitcoin',
        symbol: 'BTC-USD',
        type: 'crypto',
        shares: 0.005,
        buyPrice: 55000.0,
        currency: 'EUR',
      },
    ];
  }

  async fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ...(options.headers || {}),
        },
      });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async fetchSingleQuote(assetId, info) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(info.symbol)}?range=1d&interval=15m`;
    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) return null;
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) return null;

      const meta = result.meta;
      const price = meta.regularMarketPrice;
      if (price === undefined || price === null) return null;

      const prev = meta.chartPreviousClose || meta.previousClose || price;
      const change = prev > 0 ? Number((((price - prev) / prev) * 100).toFixed(2)) : 0.0;
      const dayLow = meta.regularMarketDayLow || price;
      const dayHigh = meta.regularMarketDayHigh || price;

      return {
        id: assetId,
        symbol: info.symbol,
        name: info.name,
        type: info.type,
        unit: info.unit,
        price: Number(price < 2 ? price.toFixed(4) : price.toFixed(2)),
        change,
        dayLow: Number(dayLow < 2 ? dayLow.toFixed(4) : dayLow.toFixed(2)),
        dayHigh: Number(dayHigh < 2 ? dayHigh.toFixed(4) : dayHigh.toFixed(2)),
        currency: meta.currency || (info.unit === '€' ? 'EUR' : 'USD'),
        marketTime: meta.regularMarketTime,
      };
    } catch (_) {
      return null;
    }
  }

  async getMarketQuotes(force = false) {
    const now = Date.now();
    const hasData = Object.keys(this.quotesCache.data).length > 0;
    if (!force && hasData && now - this.quotesCache.timestamp < CACHE_TTL_MS) {
      return {
        status: 'ok',
        cached: true,
        timestamp: this.quotesCache.timestamp,
        quotes: this.quotesCache.data,
      };
    }

    const entries = Object.entries(YAHOO_MAPPING);
    const promises = entries.map(async ([id, info]) => {
      const quote = await this.fetchSingleQuote(id, info);
      return { id, quote };
    });

    const results = await Promise.allSettled(promises);
    const updated = { ...this.quotesCache.data };

    for (const res of results) {
      if (res.status === 'fulfilled' && res.value?.quote) {
        updated[res.value.id] = res.value.quote;
      }
    }

    // Récupérer également les cotations en EUR pour BTC / ETH via CoinGecko pour affiner
    try {
      const cgRes = await this.fetchWithTimeout(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd,eur&include_24hr_change=true',
        {},
        3500
      );
      if (cgRes.ok) {
        const cg = await cgRes.json();
        if (cg.bitcoin && updated.btc) {
          updated.btc.priceEur = cg.bitcoin.eur;
          updated.btc.change24h = Number((cg.bitcoin.eur_24h_change || 0).toFixed(2));
        }
        if (cg.ethereum && updated.eth) {
          updated.eth.priceEur = cg.ethereum.eur;
          updated.eth.change24h = Number((cg.ethereum.eur_24h_change || 0).toFixed(2));
        }
      }
    } catch (_) {}

    if (Object.keys(updated).length > 0) {
      this.quotesCache.data = updated;
      this.quotesCache.timestamp = now;
    }

    return {
      status: 'ok',
      cached: false,
      timestamp: this.quotesCache.timestamp,
      quotes: this.quotesCache.data,
    };
  }

  async getMarketChart(assetId = 'nvda', range = '1d', interval = '5m') {
    const info = YAHOO_MAPPING[assetId] || { symbol: assetId, name: assetId, unit: '$' };
    const cacheKey = `${info.symbol}_${range}_${interval}`;
    const now = Date.now();

    const cached = this.chartsCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return { status: 'ok', cached: true, data: cached.data };
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(info.symbol)}?range=${range}&interval=${interval}`;
    try {
      const res = await this.fetchWithTimeout(url);
      if (!res.ok) throw new Error(`Yahoo Finance status ${res.status}`);
      const json = await res.json();
      const result = json.chart?.result?.[0];
      if (!result) throw new Error('Aucun résultat chart');

      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];

      const rawPoints = [];
      for (let i = 0; i < timestamps.length; i++) {
        const p = closes[i];
        const t = timestamps[i];
        if (p !== null && p !== undefined && !isNaN(p)) {
          const d = new Date(t * 1000);
          const timeLabel = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          rawPoints.push({
            timestamp: t,
            price: Number(p < 2 ? p.toFixed(4) : p.toFixed(2)),
            timeLabel,
          });
        }
      }

      if (rawPoints.length === 0) throw new Error('Aucun point valide');

      // Échantillonnage fluide pour rendu SVG optimal (~25 points)
      let sampledPoints = rawPoints;
      if (rawPoints.length > 30) {
        const step = Math.max(1, Math.floor(rawPoints.length / 24));
        sampledPoints = [];
        for (let i = 0; i < rawPoints.length; i += step) {
          sampledPoints.push(rawPoints[i]);
        }
        if (sampledPoints[sampledPoints.length - 1] !== rawPoints[rawPoints.length - 1]) {
          sampledPoints.push(rawPoints[rawPoints.length - 1]);
        }
      }

      const prices = sampledPoints.map((p) => p.price);
      const startPrice = sampledPoints[0].price;
      const endPrice = sampledPoints[sampledPoints.length - 1].price;
      const changePct = startPrice > 0 ? Number((((endPrice - startPrice) / startPrice) * 100).toFixed(2)) : 0.0;

      const chartData = {
        assetId,
        symbol: info.symbol,
        name: info.name,
        unit: info.unit,
        points: sampledPoints,
        startPrice,
        endPrice,
        changePct,
        high: Number(Math.max(...prices).toFixed(2)),
        low: Number(Math.min(...prices).toFixed(2)),
        axisLabels: {
          start: sampledPoints[0].timeLabel,
          mid: sampledPoints[Math.floor(sampledPoints.length / 2)].timeLabel,
          end: 'Direct (Maintenant)',
        },
      };

      this.chartsCache.set(cacheKey, { timestamp: now, data: chartData });
      return { status: 'ok', cached: false, data: chartData };
    } catch (err) {
      // Fallback de secours synthétique si Yahoo Finance est inaccessible
      const fallback = this.generateFallbackChart(assetId, info);
      return { status: 'ok', cached: false, fallback: true, data: fallback };
    }
  }

  generateFallbackChart(assetId, info) {
    const base = assetId === 'nvda' ? 155.0 : assetId === '10ap' ? 142.5 : assetId === 'btc' ? 58000 : 100;
    const points = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const d = new Date(now - i * 3600 * 1000);
      const variation = Math.sin(i / 3) * (base * 0.02) + (Math.random() - 0.48) * (base * 0.01);
      const p = Number((base + variation).toFixed(2));
      points.push({
        timestamp: Math.floor(d.getTime() / 1000),
        price: p,
        timeLabel: `${String(d.getHours()).padStart(2, '0')}:00`,
      });
    }

    const prices = points.map((p) => p.price);
    return {
      assetId,
      symbol: info.symbol,
      name: info.name,
      unit: info.unit,
      points,
      startPrice: points[0].price,
      endPrice: points[points.length - 1].price,
      changePct: Number((((points[points.length - 1].price - points[0].price) / points[0].price) * 100).toFixed(2)),
      high: Math.max(...prices),
      low: Math.min(...prices),
      axisLabels: {
        start: points[0].timeLabel,
        mid: points[12].timeLabel,
        end: 'Maintenant',
      },
    };
  }

  async getPortfolio() {
    let holdings = this.defaultPortfolio;
    if (this.store) {
      const stored = this.store.get('portfolio_holdings');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        holdings = stored;
      }
    }

    // Récupérer les cotations fraîches pour valoriser
    const quotesResult = await this.getMarketQuotes(false);
    const quotes = quotesResult.quotes || {};

    let totalVal = 0.0;
    let totalInvested = 0.0;

    const enrichedHoldings = holdings.map((pos) => {
      const quote = quotes[pos.id];
      // Pour les actifs US convertis ou EUR
      let curPrice = pos.buyPrice;
      if (quote && quote.price) {
        curPrice = quote.priceEur || quote.price;
      }

      const lineVal = pos.shares * curPrice;
      const lineCost = pos.shares * pos.buyPrice;
      const lineGain = lineVal - lineCost;
      const lineGainPct = lineCost > 0 ? (lineGain / lineCost) * 100 : 0.0;

      totalVal += lineVal;
      totalInvested += lineCost;

      return {
        ...pos,
        currentPrice: Number(curPrice.toFixed(2)),
        currentValue: Number(lineVal.toFixed(2)),
        invested: Number(lineCost.toFixed(2)),
        gain: Number(lineGain.toFixed(2)),
        gainPct: Number(lineGainPct.toFixed(2)),
        dailyChange: quote ? quote.change : 0.0,
      };
    });

    const totalGain = totalVal - totalInvested;
    const totalGainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0.0;

    return {
      status: 'ok',
      totalValue: Number(totalVal.toFixed(2)),
      totalInvested: Number(totalInvested.toFixed(2)),
      totalGain: Number(totalGain.toFixed(2)),
      totalGainPct: Number(totalGainPct.toFixed(2)),
      holdings: enrichedHoldings,
      timestamp: Date.now(),
    };
  }

  async savePortfolioHoldings(holdings) {
    if (this.store && Array.isArray(holdings)) {
      this.store.set('portfolio_holdings', holdings);
      return true;
    }
    return false;
  }
}

export default FinanceService;
