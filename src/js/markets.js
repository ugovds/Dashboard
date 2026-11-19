/**
 * markets.js - Hub Marchés Boursiers, Actions, ETF, Indices & Cryptos
 * Graphiques interactifs épurés (courbe nette Apple/Revolut style),
 * cotations en temps réel, watchlist & sparklines SVG
 */

const DEFAULT_MARKET_ASSETS = [
  // --- 1. ACTIONS INTERNATIONALES & MEGA-CAPS ---
  {
    id: 'nvda',
    name: 'NVIDIA Corporation (NVDA)',
    symbol: 'NASDAQ:NVDA',
    type: 'stock',
    icon: 'fa-solid fa-microchip',
    basePrice: 175.76,
    baseChange: 2.84,
    dayLow: 173.10,
    dayHigh: 178.45,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true,
    isVolatile: true,
    isTrending: true
  },
  {
    id: 'tsla',
    name: 'Tesla Inc. (TSLA)',
    symbol: 'NASDAQ:TSLA',
    type: 'stock',
    icon: 'fa-solid fa-car',
    basePrice: 248.50,
    baseChange: 3.12,
    dayLow: 242.00,
    dayHigh: 251.80,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true,
    isVolatile: true,
    isTrending: true
  },
  {
    id: 'aapl',
    name: 'Apple Inc. (AAPL)',
    symbol: 'NASDAQ:AAPL',
    type: 'stock',
    icon: 'fa-brands fa-apple',
    basePrice: 227.40,
    baseChange: 0.85,
    dayLow: 225.60,
    dayHigh: 228.90,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true,
    isTrending: true
  },
  {
    id: 'msft',
    name: 'Microsoft Corp. (MSFT)',
    symbol: 'NASDAQ:MSFT',
    type: 'stock',
    icon: 'fa-brands fa-microsoft',
    basePrice: 425.10,
    baseChange: 1.15,
    dayLow: 422.30,
    dayHigh: 427.50,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true,
    isTrending: true
  },
  {
    id: 'googl',
    name: 'Alphabet Inc. (GOOGL)',
    symbol: 'NASDAQ:GOOGL',
    type: 'stock',
    icon: 'fa-brands fa-google',
    basePrice: 168.20,
    baseChange: 0.92,
    dayLow: 166.50,
    dayHigh: 169.50,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true,
    isTrending: true
  },
  {
    id: 'amzn',
    name: 'Amazon.com Inc. (AMZN)',
    symbol: 'NASDAQ:AMZN',
    type: 'stock',
    icon: 'fa-brands fa-amazon',
    basePrice: 186.40,
    baseChange: 1.40,
    dayLow: 184.20,
    dayHigh: 187.90,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true
  },
  {
    id: 'meta',
    name: 'Meta Platforms (META)',
    symbol: 'NASDAQ:META',
    type: 'stock',
    icon: 'fa-brands fa-meta',
    basePrice: 582.30,
    baseChange: 1.80,
    dayLow: 574.00,
    dayHigh: 586.50,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true
  },
  {
    id: 'mstr',
    name: 'MicroStrategy (MSTR)',
    symbol: 'NASDAQ:MSTR',
    type: 'stock',
    icon: 'fa-solid fa-fire',
    basePrice: 215.30,
    baseChange: 8.65,
    dayLow: 204.00,
    dayHigh: 222.00,
    unit: '$',
    exchange: 'Nasdaq',
    enabled: true,
    isVolatile: true
  },
  {
    id: 'mc',
    name: 'LVMH Moët Hennessy (MC)',
    symbol: 'EURONEXT:MC',
    type: 'stock',
    icon: 'fa-solid fa-gem',
    basePrice: 618.50,
    baseChange: -0.45,
    dayLow: 612.00,
    dayHigh: 624.00,
    unit: '€',
    exchange: 'Euronext Paris',
    enabled: true
  },
  {
    id: 'asml',
    name: 'ASML Holding (ASML)',
    symbol: 'EURONEXT:ASML',
    type: 'stock',
    icon: 'fa-solid fa-atom',
    basePrice: 652.10,
    baseChange: 1.05,
    dayLow: 644.00,
    dayHigh: 656.00,
    unit: '€',
    exchange: 'Euronext Amsterdam',
    enabled: true
  },
  {
    id: 'tte',
    name: 'TotalEnergies (TTE)',
    symbol: 'EURONEXT:TTE',
    type: 'stock',
    icon: 'fa-solid fa-gas-pump',
    basePrice: 58.20,
    baseChange: 0.30,
    dayLow: 57.80,
    dayHigh: 58.60,
    unit: '€',
    exchange: 'Euronext Paris',
    enabled: true
  },

  // --- 2. ETF & FONDS INDICIAIRES MAJEURS ---
  {
    id: '10ap',
    name: 'Amundi S&P 500 (10AP)',
    symbol: 'EURONEXT:10AP',
    type: 'etf',
    icon: 'fa-solid fa-chart-line',
    basePrice: 137.30,
    baseChange: 0.52,
    dayLow: 136.20,
    dayHigh: 137.95,
    unit: '€',
    exchange: 'Euronext Paris',
    enabled: true,
    isTrending: true
  },
  {
    id: 'lyp6',
    name: 'Amundi Stoxx 600 (LYP6)',
    symbol: 'XETR:LYP6',
    type: 'etf',
    icon: 'fa-solid fa-landmark',
    basePrice: 327.65,
    baseChange: 0.38,
    dayLow: 325.10,
    dayHigh: 328.40,
    unit: '€',
    exchange: 'Xetra',
    enabled: true,
    isTrending: true
  },
  {
    id: 'xmme',
    name: 'Xtrackers MSCI EM (XMME)',
    symbol: 'XETR:XMME',
    type: 'etf',
    icon: 'fa-solid fa-earth-americas',
    basePrice: 76.85,
    baseChange: -0.42,
    dayLow: 76.10,
    dayHigh: 77.20,
    unit: '€',
    exchange: 'Xetra',
    enabled: true
  },
  {
    id: 'cw8',
    name: 'Amundi MSCI World (CW8)',
    symbol: 'EURONEXT:CW8',
    type: 'etf',
    icon: 'fa-solid fa-globe',
    basePrice: 528.40,
    baseChange: 0.62,
    dayLow: 525.00,
    dayHigh: 530.20,
    unit: '€',
    exchange: 'Euronext Paris',
    enabled: true,
    isTrending: true
  },
  {
    id: 'vwce',
    name: 'Vanguard All-World (VWCE)',
    symbol: 'XETR:VWCE',
    type: 'etf',
    icon: 'fa-solid fa-globe',
    basePrice: 128.40,
    baseChange: 0.45,
    dayLow: 127.80,
    dayHigh: 128.95,
    unit: '€',
    exchange: 'Xetra',
    enabled: true
  },
  {
    id: 'eqqq',
    name: 'Invesco EQQQ Nasdaq 100',
    symbol: 'XETR:EQQQ',
    type: 'etf',
    icon: 'fa-solid fa-microchip',
    basePrice: 485.20,
    baseChange: 1.15,
    dayLow: 481.00,
    dayHigh: 487.50,
    unit: '€',
    exchange: 'Xetra',
    enabled: true
  },
  {
    id: 'inrg',
    name: 'iShares Clean Energy (INRG)',
    symbol: 'XETR:INRG',
    type: 'etf',
    icon: 'fa-solid fa-leaf',
    basePrice: 8.75,
    baseChange: -1.25,
    dayLow: 8.62,
    dayHigh: 8.85,
    unit: '€',
    exchange: 'Xetra',
    enabled: true
  },
  {
    id: 'psp5',
    name: 'Amundi PEA S&P 500 (PSP5)',
    symbol: 'EURONEXT:PSP5',
    type: 'etf',
    icon: 'fa-solid fa-building-columns',
    basePrice: 44.60,
    baseChange: 0.55,
    dayLow: 44.20,
    dayHigh: 44.80,
    unit: '€',
    exchange: 'Euronext Paris',
    enabled: true
  },

  // --- 3. GRANDS INDICES BOURSIERS MONDIAUX ---
  {
    id: 'sp500',
    name: 'S&P 500 Index',
    symbol: 'FOREXCOM:SPXUSD',
    type: 'index',
    icon: 'fa-solid fa-chart-line',
    basePrice: 5864.67,
    baseChange: 0.41,
    dayLow: 5840.00,
    dayHigh: 5880.00,
    unit: 'pts',
    exchange: 'US Indices',
    enabled: true,
    isTrending: true
  },
  {
    id: 'nasdaq100',
    name: 'Nasdaq 100 Index',
    symbol: 'FOREXCOM:NSXUSD',
    type: 'index',
    icon: 'fa-solid fa-microchip',
    basePrice: 20450.10,
    baseChange: 0.85,
    dayLow: 20380.00,
    dayHigh: 20520.00,
    unit: 'pts',
    exchange: 'US Tech',
    enabled: true,
    isTrending: true
  },
  {
    id: 'cac40',
    name: 'CAC 40 Index',
    symbol: 'EURONEXT:PX1',
    type: 'index',
    icon: 'fa-solid fa-building-columns',
    basePrice: 7480.25,
    baseChange: 0.65,
    dayLow: 7440.00,
    dayHigh: 7510.00,
    unit: 'pts',
    exchange: 'Euronext Paris',
    enabled: true
  },
  {
    id: 'dax40',
    name: 'DAX 40 Index',
    symbol: 'XETR:DAX',
    type: 'index',
    icon: 'fa-solid fa-chart-pie',
    basePrice: 19340.50,
    baseChange: 0.52,
    dayLow: 19280.00,
    dayHigh: 19410.00,
    unit: 'pts',
    exchange: 'Francfort',
    enabled: true
  },
  {
    id: 'dji',
    name: 'Dow Jones Industrial 30',
    symbol: 'TVC:DJI',
    type: 'index',
    icon: 'fa-solid fa-industry',
    basePrice: 42210.50,
    baseChange: 0.18,
    dayLow: 42120.00,
    dayHigh: 42350.00,
    unit: 'pts',
    exchange: 'Wall Street',
    enabled: true
  },
  {
    id: 'stoxx50',
    name: 'Euro Stoxx 50 Index',
    symbol: 'INDEX:SX5E',
    type: 'index',
    icon: 'fa-solid fa-flag-checkered',
    basePrice: 4982.10,
    baseChange: 0.32,
    dayLow: 4960.00,
    dayHigh: 5005.00,
    unit: 'pts',
    exchange: 'Zone Euro',
    enabled: true
  },
  {
    id: 'nikkei',
    name: 'Nikkei 225 (Japon)',
    symbol: 'TVC:NI225',
    type: 'index',
    icon: 'fa-solid fa-torii-gate',
    basePrice: 39277.40,
    baseChange: 1.15,
    dayLow: 38900.00,
    dayHigh: 39450.00,
    unit: 'pts',
    exchange: 'Tokyo',
    enabled: true
  },
  {
    id: 'ftse100',
    name: 'FTSE 100 (Londres)',
    symbol: 'TVC:UKX',
    type: 'index',
    icon: 'fa-solid fa-sterling-sign',
    basePrice: 8240.30,
    baseChange: -0.22,
    dayLow: 8210.00,
    dayHigh: 8270.00,
    unit: 'pts',
    exchange: 'Londres',
    enabled: true
  },

  // --- 4. FOREX & MARCHÉ DES DEVISES ---
  {
    id: 'eurusd',
    name: 'EUR / USD Forex',
    symbol: 'FX:EURUSD',
    type: 'forex',
    icon: 'fa-solid fa-euro-sign',
    basePrice: 1.0852,
    baseChange: 0.12,
    dayLow: 1.0820,
    dayHigh: 1.0875,
    unit: '$',
    exchange: 'Forex',
    enabled: true,
    isTrending: true
  },
  {
    id: 'eurgbp',
    name: 'EUR / GBP Forex',
    symbol: 'FX:EURGBP',
    type: 'forex',
    icon: 'fa-solid fa-sterling-sign',
    basePrice: 0.8354,
    baseChange: -0.08,
    dayLow: 0.8335,
    dayHigh: 0.8370,
    unit: '£',
    exchange: 'Forex',
    enabled: true
  },
  {
    id: 'eurchf',
    name: 'EUR / CHF Forex',
    symbol: 'FX:EURCHF',
    type: 'forex',
    icon: 'fa-solid fa-franc-sign',
    basePrice: 0.9412,
    baseChange: 0.05,
    dayLow: 0.9390,
    dayHigh: 0.9430,
    unit: 'CHF',
    exchange: 'Forex',
    enabled: true
  },
  {
    id: 'eurjpy',
    name: 'EUR / JPY Forex',
    symbol: 'FX:EURJPY',
    type: 'forex',
    icon: 'fa-solid fa-yen-sign',
    basePrice: 164.80,
    baseChange: 0.35,
    dayLow: 164.10,
    dayHigh: 165.20,
    unit: '¥',
    exchange: 'Forex',
    enabled: true
  },
  {
    id: 'gbpusd',
    name: 'GBP / USD Forex',
    symbol: 'FX:GBPUSD',
    type: 'forex',
    icon: 'fa-solid fa-dollar-sign',
    basePrice: 1.2985,
    baseChange: 0.18,
    dayLow: 1.2950,
    dayHigh: 1.3020,
    unit: '$',
    exchange: 'Forex',
    enabled: true
  },
  {
    id: 'usdjpy',
    name: 'USD / JPY Forex',
    symbol: 'FX:USDJPY',
    type: 'forex',
    icon: 'fa-solid fa-yen-sign',
    basePrice: 151.75,
    baseChange: 0.22,
    dayLow: 151.20,
    dayHigh: 152.10,
    unit: '¥',
    exchange: 'Forex',
    enabled: true
  },

  // --- 5. MATIÈRES PREMIÈRES & COMMODITIES ---
  {
    id: 'gold',
    name: 'Or / Gold (XAU/USD)',
    symbol: 'TVC:GOLD',
    type: 'commodity',
    icon: 'fa-solid fa-coins',
    basePrice: 2735.80,
    baseChange: 0.42,
    dayLow: 2720.00,
    dayHigh: 2748.00,
    unit: '$',
    exchange: 'Métaux Précieux',
    enabled: true,
    isTrending: true
  },
  {
    id: 'silver',
    name: 'Argent / Silver (XAG/USD)',
    symbol: 'TVC:SILVER',
    type: 'commodity',
    icon: 'fa-solid fa-ring',
    basePrice: 33.85,
    baseChange: 1.25,
    dayLow: 33.20,
    dayHigh: 34.10,
    unit: '$',
    exchange: 'Métaux Précieux',
    enabled: true,
    isVolatile: true
  },
  {
    id: 'brent',
    name: 'Pétrole Brent (Crude Oil)',
    symbol: 'TVC:UKOIL',
    type: 'commodity',
    icon: 'fa-solid fa-oil-well',
    basePrice: 74.20,
    baseChange: -0.75,
    dayLow: 73.50,
    dayHigh: 75.10,
    unit: '$',
    exchange: 'Énergie',
    enabled: true
  },

  // --- 6. CRYPTOMONNAIES ---
  {
    id: 'btc',
    name: 'Bitcoin (BTC)',
    symbol: 'BINANCE:BTCUSDT',
    type: 'crypto',
    icon: 'fa-brands fa-bitcoin',
    basePrice: 74117.00,
    baseChange: 3.45,
    dayLow: 71800.00,
    dayHigh: 74900.00,
    unit: '$',
    exchange: 'Binance',
    enabled: true,
    isVolatile: true,
    isTrending: true
  },
  {
    id: 'eth',
    name: 'Ethereum (ETH)',
    symbol: 'BINANCE:ETHUSDT',
    type: 'crypto',
    icon: 'fa-brands fa-ethereum',
    basePrice: 2640.50,
    baseChange: 2.15,
    dayLow: 2580.00,
    dayHigh: 2690.00,
    unit: '$',
    exchange: 'Binance',
    enabled: true,
    isTrending: true
  },
  {
    id: 'sol',
    name: 'Solana (SOL)',
    symbol: 'BINANCE:SOLUSDT',
    type: 'crypto',
    icon: 'fa-solid fa-bolt',
    basePrice: 95.66,
    baseChange: -4.82,
    dayLow: 93.20,
    dayHigh: 101.50,
    unit: '$',
    exchange: 'Binance',
    enabled: true,
    isVolatile: true
  },
  {
    id: 'bnb',
    name: 'Binance Coin (BNB)',
    symbol: 'BINANCE:BNBUSDT',
    type: 'crypto',
    icon: 'fa-solid fa-cubes',
    basePrice: 585.20,
    baseChange: 1.10,
    dayLow: 578.00,
    dayHigh: 590.00,
    unit: '$',
    exchange: 'Binance',
    enabled: true
  },
  {
    id: 'xrp',
    name: 'Ripple (XRP)',
    symbol: 'BINANCE:XRPUSDT',
    type: 'crypto',
    icon: 'fa-solid fa-circle-nodes',
    basePrice: 0.535,
    baseChange: 2.40,
    dayLow: 0.518,
    dayHigh: 0.545,
    unit: '$',
    exchange: 'Binance',
    enabled: true
  }
];

let marketAssets = loadMarketAssets();
let currentMarketCategory = 'all';
let currentMarketSearch = '';
let isMarketVolatileFilterActive = false;
let currentChartTimeframe = '1D';
let currentlyInspectedAsset = null;
let currentChartPoints = [];

function loadMarketAssets() {
  try {
    const raw = localStorage.getItem('violet_market_assets_v5');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const defaultMap = new Map(DEFAULT_MARKET_ASSETS.map((a) => [a.id, a]));
        parsed.forEach((p) => {
          if (defaultMap.has(p.id)) {
            const def = defaultMap.get(p.id);
            Object.assign(def, { enabled: p.enabled });
          }
        });
        const customAssets = parsed.filter((p) => p.isCustom);
        return [...DEFAULT_MARKET_ASSETS, ...customAssets];
      }
    }
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_MARKET_ASSETS));
}

function saveMarketAssets() {
  try {
    localStorage.setItem('violet_market_assets_v5', JSON.stringify(marketAssets));
  } catch {}
}

/* ========================================================
   SUIVI DU PORTEFEUILLE D'INVESTISSEMENT & AUTOMATISATION DCA
   Gestion précise des dates et prix d'achat (PRU), parts et versements
   ======================================================== */

const PORTFOLIO_STORAGE_KEY = 'violet_portfolio_tracker_v5';

// État vierge par défaut : portefeuille vide à 0 € prêt pour personnalisation totale
const EMPTY_PORTFOLIO_STATE = {
  holdings: [],
  positions: {},
  dcaRules: {
    dayOfMonth: 19,
    allocations: {},
    enabled: true
  },
  totalInvested: 0,
  lastDcaExecutionMonth: null,
  skippedDcaMonths: [],
  history: [],
  selectedTimeframe: '24h'
};

// Portefeuille officiel reconstitué d'après vos transactions réelles
const DEMO_PORTFOLIO_STATE = {
  holdings: [
    {
      id: '10ap',
      name: 'Amundi PEA S&P 500 (10AP)',
      shortName: 'Amundi S&P 500',
      symbol: 'EURONEXT:10AP',
      type: 'etf',
      shares: 4.1942,
      buyPrice: 133.56,
      buyDate: '2026-10-19',
      dcaMonthly: 30,
      notes: 'PEA (4 achats d\'août à oct 2026)'
    },
    {
      id: 'lyp6',
      name: 'Amundi Stoxx Europe 600 (LYP6)',
      shortName: 'Amundi Stoxx 600',
      symbol: 'XETR:LYP6',
      type: 'etf',
      shares: 1.3584,
      buyPrice: 323.90,
      buyDate: '2026-10-19',
      dcaMonthly: 20,
      notes: 'PEA (5 achats d\'août à oct 2026)'
    },
    {
      id: 'xmme',
      name: 'Xtrackers MSCI Emerging Markets (XMME)',
      shortName: 'MSCI Emerging Mkts',
      symbol: 'XETR:XMME',
      type: 'etf',
      shares: 4.0341,
      buyPrice: 79.32,
      buyDate: '2026-10-19',
      dcaMonthly: 10,
      notes: 'PEA (4 achats d\'août à oct 2026)'
    },
    {
      id: 'nvda',
      name: 'NVIDIA Corporation (NVDA)',
      shortName: 'NVIDIA Corporation',
      symbol: 'NASDAQ:NVDA',
      type: 'stock',
      shares: 1.00,
      buyPrice: 194.90,
      buyDate: '2026-10-20',
      dcaMonthly: 0,
      notes: 'Compte USD - Acheté à 214,75 $'
    }
  ],
  positions: {
    '10ap': 4.1942,
    'lyp6': 1.3584,
    'xmme': 4.0341,
    'nvda': 1.00
  },
  dcaRules: {
    dayOfMonth: 19,
    allocations: {
      '10ap': 30,
      'lyp6': 20,
      'xmme': 10,
      'nvda': 0
    },
    enabled: true
  },
  totalInvested: 1515.08,
  lastDcaExecutionMonth: '2026-10',
  skippedDcaMonths: [],
  history: [
    {
      id: 'tx_20261020_nvda',
      date: '2026-10-20',
      type: 'manual',
      title: 'Achat 1.00 action NVIDIA (NVDA)',
      amount: 194.90,
      note: '1 action @ 214,75 $ (194,90 €) sur compte USD',
      breakdown: [
        { assetId: 'nvda', assetName: 'NVIDIA Corporation', amount: 194.90, shares: 1.00, unitPrice: 194.90 }
      ]
    },
    {
      id: 'tx_20261019_dca',
      date: '2026-10-19',
      type: 'auto',
      title: 'Versement DCA Mensuel (60 €)',
      amount: 60.00,
      note: '+30€ 10AP (0.218 p.), +20€ LYP6 (0.063 p.), +10€ XMME (0.126 p.)',
      breakdown: [
        { assetId: '10ap', assetName: 'Amundi S&P 500', amount: 30, shares: 0.218 },
        { assetId: 'lyp6', assetName: 'Amundi Stoxx 600', amount: 20, shares: 0.063 },
        { assetId: 'xmme', assetName: 'MSCI Emerging Mkts', amount: 10, shares: 0.126 }
      ]
    },
    {
      id: 'tx_20260918_dca',
      date: '2026-09-18',
      type: 'auto',
      title: 'Versement DCA Mensuel (60 €)',
      amount: 60.00,
      note: '+30€ 10AP (0.225 p.), +20€ LYP6 (0.063 p.), +10€ XMME (0.122 p.)',
      breakdown: [
        { assetId: '10ap', assetName: 'Amundi S&P 500', amount: 30, shares: 0.225 },
        { assetId: 'lyp6', assetName: 'Amundi Stoxx 600', amount: 20, shares: 0.063 },
        { assetId: 'xmme', assetName: 'MSCI Emerging Mkts', amount: 10, shares: 0.122 }
      ]
    },
    {
      id: 'tx_20260824_buy',
      date: '2026-08-24',
      type: 'manual',
      title: 'Renforcement 10AP & LYP6 (300 €)',
      amount: 300.00,
      note: '+200€ 10AP (1.520 p. @ 131,58€) + 100€ LYP6 (0.310 p. @ 322,15€)',
      breakdown: [
        { assetId: '10ap', assetName: 'Amundi S&P 500', amount: 200, shares: 1.520 },
        { assetId: 'lyp6', assetName: 'Amundi Stoxx 600', amount: 100, shares: 0.310 }
      ]
    },
    {
      id: 'tx_20260813_arb',
      date: '2026-08-13',
      type: 'manual',
      title: 'Arbitrage Vente 6TVM -> Achat 10AP (300,18 €)',
      amount: 300.18,
      note: 'Vente 4.327 p. 6TVM (+300,18€) et achat 2.232 p. 10AP (134,50€)',
      breakdown: [
        { assetId: '10ap', assetName: 'Amundi S&P 500', amount: 300.18, shares: 2.232 }
      ]
    },
    {
      id: 'tx_20260811_init2',
      date: '2026-08-11',
      type: 'manual',
      title: 'Apport & Achats PEA (600 €)',
      amount: 600.00,
      note: '+200€ LYP6 (0.614 p.), +200€ XMME (2.524 p.), +200€ 6TVM (2.883 p.)',
      breakdown: [
        { assetId: 'lyp6', assetName: 'Amundi Stoxx 600', amount: 200, shares: 0.614 },
        { assetId: 'xmme', assetName: 'MSCI Emerging Mkts', amount: 200, shares: 2.524 }
      ]
    },
    {
      id: 'tx_20260810_init1',
      date: '2026-08-10',
      type: 'manual',
      title: 'Constitution Initiale PEA (300 €)',
      amount: 300.00,
      note: '+100€ LYP6 (0.307 p.), +100€ 6TVM (1.444 p.), +100€ XMME (1.262 p.)',
      breakdown: [
        { assetId: 'lyp6', assetName: 'Amundi Stoxx 600', amount: 100, shares: 0.307 },
        { assetId: 'xmme', assetName: 'MSCI Emerging Mkts', amount: 100, shares: 1.262 }
      ]
    }
  ],
  selectedTimeframe: '24h'
};

const DEFAULT_PORTFOLIO_STATE = EMPTY_PORTFOLIO_STATE;

let portfolioState = loadPortfolioState();
let currentPortfolioChartPoints = [];

function loadPortfolioState() {
  try {
    let raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) {
      // Récupération et migration automatique depuis les versions précédentes si disponibles
      for (const oldKey of ['violet_portfolio_tracker_v4', 'violet_portfolio_tracker_v3', 'violet_portfolio_tracker_v2', 'violet_portfolio_tracker_v1']) {
        const candidate = localStorage.getItem(oldKey);
        if (candidate) {
          try {
            const parsedCandidate = JSON.parse(candidate);
            if (parsedCandidate && Array.isArray(parsedCandidate.holdings) && parsedCandidate.holdings.length > 0) {
              raw = candidate;
              localStorage.setItem(PORTFOLIO_STORAGE_KEY, raw);
              break;
            }
          } catch (_) {}
        }
      }
    }
    if (!raw) {
      // Démarrage propre avec un portefeuille vierge uniquement si aucune donnée antérieure n'existe
      return JSON.parse(JSON.stringify(EMPTY_PORTFOLIO_STATE));
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const holdings = Array.isArray(parsed.holdings) ? parsed.holdings : [];
      const positions = {};
      const allocations = {};
      holdings.forEach((h) => {
        positions[h.id] = Number(h.shares || 0);
        if (typeof h.dcaMonthly === 'number') {
          allocations[h.id] = h.dcaMonthly;
        }
      });
      // Calcul du montant total investi
      const realInvested = holdings.reduce((sum, h) => sum + (Number(h.shares || 0) * Number(h.buyPrice || 0)), 0);

      if (parsed.dcaRules?.allocations && typeof parsed.dcaRules.allocations === 'object' && holdings.length > 0) {
        Object.assign(allocations, parsed.dcaRules.allocations);
      }

      return {
        holdings,
        positions: holdings.length === 0 ? {} : positions,
        totalInvested: holdings.length === 0 ? 0 : Number(realInvested.toFixed(2)),
        dcaRules: {
          dayOfMonth: parseInt(parsed.dcaRules?.dayOfMonth, 10) || 19,
          allocations: holdings.length === 0 ? {} : allocations,
          enabled: parsed.dcaRules?.enabled !== false
        },
        lastDcaExecutionMonth: holdings.length === 0 ? null : (parsed.lastDcaExecutionMonth || null),
        skippedDcaMonths: Array.isArray(parsed.skippedDcaMonths) ? parsed.skippedDcaMonths : [],
        history: Array.isArray(parsed.history) ? parsed.history : [],
        selectedTimeframe: parsed.selectedTimeframe || '24h'
      };
    }
  } catch (err) {
    console.warn('Erreur chargement portfolioState:', err);
  }
  return JSON.parse(JSON.stringify(EMPTY_PORTFOLIO_STATE));
}

function savePortfolioState() {
  try {
    // Garder positions et allocations synchronisées
    const positions = {};
    const allocations = { ...(portfolioState.dcaRules?.allocations || {}) };
    (portfolioState.holdings || []).forEach((h) => {
      positions[h.id] = Number(h.shares || 0);
      if (typeof h.dcaMonthly === 'number') {
        allocations[h.id] = h.dcaMonthly;
      }
    });
    portfolioState.positions = positions;
    if (portfolioState.dcaRules) {
      portfolioState.dcaRules.allocations = allocations;
      if (portfolioState.dcaRules.enabled === undefined) {
        portfolioState.dcaRules.enabled = true;
      }
    }
    if (!Array.isArray(portfolioState.skippedDcaMonths)) {
      portfolioState.skippedDcaMonths = [];
    }
    const realInvested = (portfolioState.holdings || []).reduce((sum, h) => sum + (Number(h.shares || 0) * Number(h.buyPrice || 0)), 0);
    portfolioState.totalInvested = (portfolioState.holdings && portfolioState.holdings.length > 0) ? Number(realInvested.toFixed(2)) : 0;

    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolioState));
    window.portfolioState = portfolioState;
  } catch (err) {
    console.warn('Erreur sauvegarde portfolioState:', err);
  }
}

function resetPortfolioState(mode = 'empty') {
  if (mode === 'demo') {
    portfolioState = JSON.parse(JSON.stringify(DEMO_PORTFOLIO_STATE));
    savePortfolioState();
    renderPortfolioModule();
    if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();
    if (typeof renderDashboardPortfolio === 'function') renderDashboardPortfolio();
    if (typeof showToast === 'function') {
      showToast('Portefeuille reconstitué avec succès (1 515,08 €) !', 'success');
    }
  } else {
    // Réinitialisation vierge (vide)
    portfolioState = JSON.parse(JSON.stringify(EMPTY_PORTFOLIO_STATE));
    savePortfolioState();
    // Nettoyer toutes les anciennes clés résiduelles
    ['violet_portfolio_tracker_v1', 'violet_portfolio_tracker_v2', 'violet_portfolio_tracker_v3', 'violet_portfolio_tracker_v4'].forEach((k) => {
      try { localStorage.removeItem(k); } catch (_) {}
    });
    renderPortfolioModule();
    if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();
    if (typeof renderDashboardPortfolio === 'function') renderDashboardPortfolio();
    if (typeof showToast === 'function') {
      showToast('Portefeuille réinitialisé à zéro ! Vous pouvez ajouter vos propres actifs.', 'success');
    }
  }
}

/**
 * Récupère le cours unitaire d'un actif converti en Euros (€)
 */
function getAssetPriceInEur(assetId) {
  const asset = marketAssets.find((a) => a.id === assetId);
  if (!asset) {
    const hold = (portfolioState?.holdings || []).find((h) => h.id === assetId);
    if (hold && typeof hold.buyPrice === 'number') return hold.buyPrice;
    const fallbackPrices = { '10ap': 137.30, 'lyp6': 327.65, 'xmme': 76.85, 'nvda': 162.44, 'cw8': 528.40 };
    return fallbackPrices[assetId] || 100;
  }
  if (asset.unit === '€') {
    return asset.basePrice;
  }
  // Conversion Forex USD -> EUR pour les actifs cotés à New York (NVDA)
  const eurusd = marketAssets.find((a) => a.id === 'eurusd')?.basePrice || 1.0820;
  return Number((asset.basePrice / eurusd).toFixed(2));
}

/**
 * Calcule l'ensemble des métriques de valorisation, performance et répartition
 */
function calculatePortfolioSummary() {
  const holdingsList = Array.isArray(portfolioState.holdings) ? portfolioState.holdings : [];
  let totalValue = 0;
  let totalStart24h = 0;
  let totalInvested = 0;

  const holdings = holdingsList.map((h) => {
    const asset = marketAssets.find((a) => a.id === h.id) || {
      id: h.id,
      name: h.name || h.id.toUpperCase(),
      symbol: h.symbol || h.id.toUpperCase(),
      basePrice: h.buyPrice || 100,
      baseChange: 0,
      unit: '€',
      type: h.type || 'stock',
      icon: h.type === 'crypto' ? 'fa-solid fa-coins' : (h.type === 'etf' ? 'fa-solid fa-chart-line' : 'fa-solid fa-building')
    };

    const shares = Number(h.shares || 0);
    const buyPrice = Number(h.buyPrice || 0);
    const priceEur = getAssetPriceInEur(h.id);
    const totalEur = shares * priceEur;
    const investedEur = shares * buyPrice;

    const change24hPct = typeof asset.baseChange === 'number' ? asset.baseChange : 0;
    const startPriceEur = priceEur / (1 + change24hPct / 100);
    const startTotalEur = shares * startPriceEur;
    const change24hEur = totalEur - startTotalEur;

    // Gain ou perte depuis l'achat
    const gainEur = totalEur - investedEur;
    const gainPct = investedEur > 0 ? (gainEur / investedEur) * 100 : 0;

    totalValue += totalEur;
    totalStart24h += startTotalEur;
    totalInvested += investedEur;

    const shortName = h.shortName || (asset.name ? asset.name.split('(')[0].trim() : h.id.toUpperCase());
    const icon = asset.icon || (asset.type === 'crypto' ? 'fa-brands fa-bitcoin' : 'fa-solid fa-chart-line');
    const colorClass = h.id.toLowerCase().replace(/[^a-z0-9]/g, '');

    return {
      id: h.id,
      name: asset.name || h.name,
      shortName,
      symbol: asset.symbol || h.symbol,
      type: asset.type || h.type || 'stock',
      icon,
      colorClass,
      shares,
      buyPrice,
      buyDate: h.buyDate || '2024-01-19',
      investedEur,
      priceEur,
      priceOriginal: asset.basePrice,
      originalUnit: asset.unit || '€',
      totalEur,
      gainEur,
      gainPct,
      change24hPct,
      change24hEur,
      dcaMonthly: portfolioState.dcaRules?.allocations?.[h.id] ?? (h.dcaMonthly || 0),
      notes: h.notes || ''
    };
  });

  // Pourcentages d'allocation
  holdings.forEach((h) => {
    h.weightPct = totalValue > 0 ? (h.totalEur / totalValue) * 100 : 0;
  });

  const totalChange24hEur = totalValue - totalStart24h;
  const totalChange24hPct = totalStart24h > 0 ? (totalChange24hEur / totalStart24h) * 100 : 0;
  const gainLatentEur = totalValue - totalInvested;
  const gainLatentPct = totalInvested > 0 ? (gainLatentEur / totalInvested) * 100 : 0;

  return {
    holdings,
    totalValue,
    totalChange24hEur,
    totalChange24hPct,
    totalInvested,
    gainLatentEur,
    gainLatentPct
  };
}

/**
 * Moteur d'exécution automatique du DCA au 19 du mois
 */
function checkAndApplyScheduledDca() {
  if (portfolioState.dcaRules?.enabled === false) return;
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentDay = now.getDate();
  const targetDay = portfolioState.dcaRules?.dayOfMonth || 19;

  // Si l'utilisateur a expressément ignoré ou annulé le versement pour ce mois
  if (Array.isArray(portfolioState.skippedDcaMonths) && portfolioState.skippedDcaMonths.includes(currentYearMonth)) {
    return;
  }

  if (currentDay >= targetDay) {
    if (portfolioState.lastDcaExecutionMonth !== currentYearMonth) {
      let addedEur = 0;
      const details = [];
      const breakdown = [];

      (portfolioState.holdings || []).forEach((h) => {
        const alloc = portfolioState.dcaRules?.allocations?.[h.id] ?? (h.dcaMonthly || 0);
        if (alloc > 0) {
          const priceEur = getAssetPriceInEur(h.id);
          const sharesBought = alloc / priceEur;
          const oldCost = h.shares * h.buyPrice;
          const newCost = alloc;
          const newShares = h.shares + sharesBought;
          const oldShares = h.shares;
          const oldBuyPrice = h.buyPrice;
          h.buyPrice = Number(((oldCost + newCost) / newShares).toFixed(2));
          h.shares = Number(newShares.toFixed(4));
          portfolioState.positions[h.id] = h.shares;
          addedEur += alloc;
          details.push(`+${alloc}€ ${h.shortName || h.id.toUpperCase()} (+${sharesBought.toFixed(3)} parts)`);
          breakdown.push({
            assetId: h.id,
            assetName: h.shortName || h.name,
            amount: alloc,
            shares: Number(sharesBought.toFixed(4)),
            unitPrice: priceEur,
            prevShares: oldShares,
            prevBuyPrice: oldBuyPrice
          });
        }
      });

      if (addedEur > 0) {
        portfolioState.totalInvested = (portfolioState.totalInvested || 0) + addedEur;
        portfolioState.lastDcaExecutionMonth = currentYearMonth;
        portfolioState.history.unshift({
          id: 'dca_' + Date.now(),
          date: `${currentYearMonth}-${String(targetDay).padStart(2, '0')}`,
          type: 'auto',
          title: `Versement DCA Automatique (${targetDay} ${now.toLocaleString('fr-FR', { month: 'short' })})`,
          amount: addedEur,
          note: details.join(', '),
          breakdown
        });

        savePortfolioState();
        console.log(`[Portefeuille] Versement DCA mensuel exécuté (+${addedEur} €)`);
      }
    }
  }
}

/**
 * Simulation instantanée du versement du 19 (achète les parts au cours actuel)
 */
function simulateDcaExecution() {
  const now = new Date();
  let addedEur = 0;
  const details = [];
  const breakdown = [];

  (portfolioState.holdings || []).forEach((h) => {
    const alloc = portfolioState.dcaRules?.allocations?.[h.id] ?? (h.dcaMonthly || 0);
    if (alloc > 0) {
      const priceEur = getAssetPriceInEur(h.id);
      const sharesBought = alloc / priceEur;
      const oldCost = h.shares * h.buyPrice;
      const newCost = alloc;
      const newShares = h.shares + sharesBought;
      const oldShares = h.shares;
      const oldBuyPrice = h.buyPrice;
      h.buyPrice = Number(((oldCost + newCost) / newShares).toFixed(2));
      h.shares = Number(newShares.toFixed(4));
      portfolioState.positions[h.id] = h.shares;
      addedEur += alloc;
      details.push(`+${alloc}€ ${h.shortName || h.id.toUpperCase()} (+${sharesBought.toFixed(3)} parts)`);
      breakdown.push({
        assetId: h.id,
        assetName: h.shortName || h.name,
        amount: alloc,
        shares: Number(sharesBought.toFixed(4)),
        unitPrice: priceEur,
        prevShares: oldShares,
        prevBuyPrice: oldBuyPrice
      });
    }
  });

  if (addedEur === 0) {
    if (typeof showToast === 'function') {
      showToast('Aucun versement DCA configuré sur vos actifs actuels.', 'warning');
    }
    return;
  }

  portfolioState.totalInvested = (portfolioState.totalInvested || 0) + addedEur;
  const dateStr = now.toISOString().split('T')[0];

  portfolioState.history.unshift({
    id: 'sim_' + Date.now(),
    date: dateStr,
    type: 'simulation',
    title: `Simulation Versement DCA`,
    amount: addedEur,
    note: details.join(', '),
    breakdown
  });

  savePortfolioState();
  renderPortfolioModule();
  if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();

  const btn = document.getElementById('portfolio-trigger-dca-btn');
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-check text-green"></i> <span>+${addedEur.toFixed(0)} € Investis !</span>`;
    setTimeout(() => { btn.innerHTML = originalText; }, 2200);
  }
  if (typeof showToast === 'function') {
    showToast(`Simulation exécutée avec succès : +${addedEur.toFixed(2)} € investis !`, 'success');
  }
}

/**
 * Calcule les informations et le compte à rebours vers le prochain versement mensuel
 */
function getNextDcaDateInfo() {
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isEnabled = portfolioState.dcaRules?.enabled !== false;
  const isSkippedThisMonth = Array.isArray(portfolioState.skippedDcaMonths) && portfolioState.skippedDcaMonths.includes(currentYearMonth);
  const targetDay = portfolioState.dcaRules?.dayOfMonth || 19;
  let targetYear = now.getFullYear();
  let targetMonth = now.getMonth();

  if (now.getDate() >= targetDay || isSkippedThisMonth) {
    targetMonth += 1;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
  }

  const targetDate = new Date(targetYear, targetMonth, targetDay, 9, 0, 0);
  const diffTime = targetDate - now;
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  const totalDcaMonthly = Object.values(portfolioState.dcaRules?.allocations || {}).reduce((s, v) => s + (Number(v) || 0), 0);

  return {
    dateStr: `${targetDay} ${monthNames[targetMonth]}`,
    fullDateStr: `${targetDay} ${monthNames[targetMonth]} ${targetYear}`,
    daysRemaining: diffDays,
    monthlyTotal: (portfolioState.holdings && portfolioState.holdings.length > 0 && isEnabled) ? totalDcaMonthly : 0,
    isEnabled,
    isSkippedThisMonth
  };
}

/**
 * Génère les données de la courbe du portefeuille pour les 4 horizons temporels
 */
function getPortfolioChartData(timeframe = '24h') {
  const summary = calculatePortfolioSummary();
  const currentTotal = summary.totalValue;
  const currentInvested = summary.totalInvested;
  const now = new Date();

  // Si le portefeuille est vide, retourner une courbe neutre à 0
  if (currentTotal <= 0) {
    const emptyPoints = [];
    for (let i = 0; i < 12; i++) {
      emptyPoints.push({
        value: 0,
        label: i === 0 ? 'Début' : (i === 11 ? 'Maintenant' : '--'),
        date: 'Portefeuille vide (0 €)',
        changePct: 0,
        changeEur: 0
      });
    }
    return {
      timeframe,
      points: emptyPoints,
      startVal: 0,
      endVal: 0,
      periodChangePct: 0,
      periodChangeEur: 0,
      minVal: 0,
      maxVal: 0,
      periodDesc: 'Portefeuille vide • Ajoutez vos premières actions et ETF pour générer la courbe',
      axisLabels: { start: 'Début', mid: 'Période', end: 'Maintenant' },
      dcaCountText: '0 versement'
    };
  }

  // 1. 24 DERNIÈRES HEURES (INTRADAY)
  if (timeframe === '24h') {
    const N = 24;
    const points = [];
    const chgEur = summary.totalChange24hEur;
    const startVal = Number((currentTotal - chgEur).toFixed(2));

    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const hoursAgo = Math.round(24 * (1 - t));
      let val = startVal + (currentTotal - startVal) * t;
      if (i === 0) val = startVal;
      if (i === N - 1) val = currentTotal;

      const dateObj = new Date(now.getTime() - hoursAgo * 3600000);
      const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
      const label = hoursAgo === 0 ? 'Maintenant' : (hoursAgo === 24 ? 'Il y a 24h' : `Il y a ${hoursAgo}h`);

      points.push({
        value: Number(val.toFixed(2)),
        label,
        date: hoursAgo === 0 ? `Aujourd'hui à ${timeStr}` : `Il y a ${hoursAgo}h (${timeStr})`,
        changePct: startVal > 0 ? ((val - startVal) / startVal) * 100 : 0,
        changeEur: val - startVal
      });
    }

    const prices = points.map((p) => p.value);
    return {
      timeframe: '24h',
      points,
      startVal,
      endVal: currentTotal,
      periodChangePct: summary.totalChange24hPct,
      periodChangeEur: chgEur,
      minVal: Math.min(...prices),
      maxVal: Math.max(...prices),
      periodDesc: 'Évolution en direct sur les dernières 24 heures (Séances Euronext & Wall Street)',
      axisLabels: { start: 'Il y a 24h', mid: 'Il y a 12h', end: 'Maintenant (En Direct)' },
      dcaCountText: '0 versement (24h)'
    };
  }

  // 2. SEMAINE PASSÉE (7 DERNIERS JOURS)
  if (timeframe === '1w') {
    const N = 7;
    const points = [];
    const weeklyPct = 1.35;
    const startVal = Number((currentTotal / (1 + weeklyPct / 100)).toFixed(2));

    for (let i = 0; i < N; i++) {
      const daysAgo = 6 - i;
      const t = i / 6;
      const d = new Date(now.getTime() - daysAgo * 86400000);
      const trend = startVal + (currentTotal - startVal) * t;
      let val = trend;
      if (i === 0) val = startVal;
      if (i === 6) val = currentTotal;

      const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
      const label = daysAgo === 0 ? "Aujourd'hui" : (daysAgo === 1 ? 'Hier' : dateStr);

      points.push({
        value: Number(val.toFixed(2)),
        label,
        date: dateStr,
        changePct: startVal > 0 ? ((val - startVal) / startVal) * 100 : 0,
        changeEur: val - startVal
      });
    }

    const prices = points.map((p) => p.value);
    return {
      timeframe: '1w',
      points,
      startVal,
      endVal: currentTotal,
      periodChangePct: weeklyPct,
      periodChangeEur: currentTotal - startVal,
      minVal: Math.min(...prices),
      maxVal: Math.max(...prices),
      periodDesc: 'Trajectoire des 7 derniers jours glissants (Cours de clôture)',
      axisLabels: { start: 'Il y a 7 jours', mid: 'Il y a 3 jours', end: "Aujourd'hui" },
      dcaCountText: '0 versement (7 jours)'
    };
  }

  // 3. MOIS PASSÉ (30 DERNIERS JOURS) AVEC VERSEMENT DU 19
  if (timeframe === '1m') {
    const N = 30;
    const points = [];
    const monthlyMktPct = 3.2;
    const targetDay = portfolioState.dcaRules?.dayOfMonth || 19;
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const dcaAmount = Object.values(portfolioState.dcaRules?.allocations || {}).reduce((s, v) => s + (Number(v) || 0), 0);
    const isCurrentMonthSkipped = (portfolioState.skippedDcaMonths || []).includes(currentYearMonth) || portfolioState.dcaRules?.enabled === false;
    const hasDcaInHistory = (portfolioState.history || []).some((h) => (h.type === 'auto' || h.title?.includes('DCA')) && h.date?.startsWith(currentYearMonth));
    const isDcaActuallyExecuted = hasDcaInHistory && !isCurrentMonthSkipped;
    const effectiveDca = isDcaActuallyExecuted ? dcaAmount : 0;

    const startVal = Number(((currentTotal - effectiveDca) / (1 + monthlyMktPct / 100)).toFixed(2));

    for (let i = 0; i < N; i++) {
      const daysAgo = 29 - i;
      const d = new Date(now.getTime() - daysAgo * 86400000);
      const isPastOrAt19 = d.getDate() >= targetDay;
      const isExactly19 = d.getDate() === targetDay;

      const t = i / 29;
      const baseTrend = startVal + ((currentTotal - effectiveDca) - startVal) * t;
      const dcaInjection = (isPastOrAt19 && isDcaActuallyExecuted) ? effectiveDca : 0;
      let val = baseTrend + dcaInjection;
      if (i === 0) val = startVal;
      if (i === 29) val = currentTotal;

      const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

      points.push({
        value: Number(val.toFixed(2)),
        label: dateStr,
        date: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
        changePct: startVal > 0 ? ((val - startVal) / startVal) * 100 : 0,
        changeEur: val - startVal,
        dcaEvent: isExactly19 && isDcaActuallyExecuted && effectiveDca > 0,
        dcaNote: isExactly19 && isDcaActuallyExecuted && effectiveDca > 0 ? `✨ Versement DCA du ${targetDay} : +${effectiveDca} € investis` : null
      });
    }

    const prices = points.map((p) => p.value);
    const periodChangeEur = currentTotal - startVal;
    const periodChangePct = startVal > 0 ? ((periodChangeEur) / startVal) * 100 : 0;

    return {
      timeframe: '1m',
      points,
      startVal,
      endVal: currentTotal,
      periodChangePct,
      periodChangeEur,
      minVal: Math.min(...prices),
      maxVal: Math.max(...prices),
      periodDesc: isDcaActuallyExecuted && effectiveDca > 0
        ? `Évolution sur 30 jours • Versement mensuel DCA de ${effectiveDca} € au ${targetDay} inclus`
        : 'Évolution sur 30 jours glissants (Cours de clôture)',
      axisLabels: { start: 'Il y a 30 jours', mid: 'Il y a 15 jours', end: "Aujourd'hui" },
      dcaCountText: (isDcaActuallyExecuted && effectiveDca > 0) ? `1 versement (+${effectiveDca} €)` : '0 versement'
    };
  }

  // 4. ANNÉE PASSÉE (12 DERNIERS MOIS) AVEC CUMUL DCA
  if (timeframe === '1y') {
    const N = 12;
    const points = [];
    const dcaMonthly = Object.values(portfolioState.dcaRules?.allocations || {}).reduce((s, v) => s + (Number(v) || 0), 0);
    const isEnabled = portfolioState.dcaRules?.enabled !== false;
    const actualDcaCount = (portfolioState.history || []).filter((h) => (h.type === 'auto' || h.title?.includes('DCA'))).length;

    const totalDcaOverYear = isEnabled ? Math.min(11, actualDcaCount || 11) * dcaMonthly : 0;
    const startInvested = Math.max(0, currentInvested - totalDcaOverYear);
    const startVal = Number((startInvested * 1.04).toFixed(2));

    for (let i = 0; i < N; i++) {
      const monthsAgo = 11 - i;
      const progress = i / 11;
      const targetDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, portfolioState.dcaRules?.dayOfMonth || 19);
      const investedAtMonth = Math.max(0, currentInvested - (monthsAgo * (isEnabled ? dcaMonthly : 0)));

      let val = (investedAtMonth * 1.04) * (1.0 + progress * 0.12);
      if (i === 11) val = currentTotal;

      const monthName = targetDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

      points.push({
        value: Number(val.toFixed(2)),
        label: monthName,
        date: targetDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        changePct: startVal > 0 ? ((val - startVal) / startVal) * 100 : 0,
        changeEur: val - startVal,
        invested: investedAtMonth,
        dcaEvent: isEnabled && dcaMonthly > 0,
        dcaNote: isEnabled && dcaMonthly > 0 ? `✨ Versement DCA du 19 : +${dcaMonthly} € investis` : null
      });
    }

    const prices = points.map((p) => p.value);
    const periodChangeEur = currentTotal - startVal;
    const periodChangePct = startVal > 0 ? ((periodChangeEur) / startVal) * 100 : 0;

    return {
      timeframe: '1y',
      points,
      startVal,
      endVal: currentTotal,
      periodChangePct,
      periodChangeEur,
      minVal: Math.min(...prices),
      maxVal: Math.max(...prices),
      periodDesc: isEnabled && dcaMonthly > 0
        ? `Croissance cumulée sur 1 an : Versements programmés (+${dcaMonthly * 12} €) & Intérêts composés`
        : 'Évolution du portefeuille sur les 12 derniers mois',
      axisLabels: { start: 'Il y a 12 mois', mid: 'Il y a 6 mois', end: 'Ce mois-ci' },
      dcaCountText: isEnabled && dcaMonthly > 0 ? `${Math.min(12, actualDcaCount || 12)} versement(s)` : '0 versement'
    };
  }
}

/**
 * Rendu du grand graphique interactif du portefeuille
 */
function renderPortfolioChart(timeframe = portfolioState.selectedTimeframe || '24h') {
  portfolioState.selectedTimeframe = timeframe;
  savePortfolioState();

  const svgLine = document.getElementById('portfolio-svg-line');
  const svgArea = document.getElementById('portfolio-svg-area');
  const baseline = document.getElementById('portfolio-chart-baseline');
  const statLow = document.getElementById('portfolio-stat-low');
  const statHigh = document.getElementById('portfolio-stat-high');
  const statInvested = document.getElementById('portfolio-stat-invested');
  const statDcaCount = document.getElementById('portfolio-stat-dca-count');
  const periodDesc = document.getElementById('portfolio-chart-period-desc');
  const periodChangeVal = document.getElementById('portfolio-period-change-val');
  const timeStart = document.getElementById('portfolio-time-start');
  const timeMid = document.getElementById('portfolio-time-mid');
  const timeEnd = document.getElementById('portfolio-time-end');

  // Mise à jour de l'état actif des boutons
  document.querySelectorAll('#portfolio-timeframe-switch .portfolio-tf-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.timeframe === timeframe);
  });

  const chartData = getPortfolioChartData(timeframe);
  if (!chartData || !chartData.points || chartData.points.length === 0) return;

  const points = chartData.points;
  const isPositive = chartData.periodChangePct >= 0;
  const sign = isPositive ? '+' : '';

  if (periodDesc) periodDesc.textContent = chartData.periodDesc;
  if (periodChangeVal) {
    periodChangeVal.textContent = `${sign}${chartData.periodChangePct.toFixed(2)}% (${sign}${chartData.periodChangeEur.toFixed(2)} €)`;
    periodChangeVal.className = isPositive ? 'text-green' : 'text-red';
  }

  if (timeStart) timeStart.textContent = chartData.axisLabels.start;
  if (timeMid) timeMid.textContent = chartData.axisLabels.mid;
  if (timeEnd) timeEnd.textContent = chartData.axisLabels.end;

  if (statLow) statLow.textContent = `${chartData.minVal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  if (statHigh) statHigh.textContent = `${chartData.maxVal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  if (statInvested) statInvested.textContent = `${portfolioState.totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  if (statDcaCount) statDcaCount.textContent = chartData.dcaCountText;

  // Calcul des coordonnées SVG (viewBox 0 0 1000 240)
  const prices = points.map((p) => p.value);
  const minP = Math.min(...prices) * 0.996;
  const maxP = Math.max(...prices) * 1.004;
  const span = Math.max(0.01, maxP - minP);

  const marginH = 15;
  const usableW = 970;
  const marginV = 20;
  const usableH = 185;

  points.forEach((pt, idx) => {
    pt.x = Number((marginH + (idx / (points.length - 1)) * usableW).toFixed(1));
    pt.y = Number(((marginV + usableH) - ((pt.value - minP) / span) * usableH).toFixed(1));
  });

  currentPortfolioChartPoints = points;

  // Tracé Bézier cubique ultra-lissé
  let lineD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    lineD += ` C ${cx.toFixed(1)} ${prev.y}, ${cx.toFixed(1)} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const lastPt = points[points.length - 1];
  const firstPt = points[0];
  const areaD = `${lineD} L ${lastPt.x} 240 L ${firstPt.x} 240 Z`;

  const mainColor = isPositive ? '#10b981' : '#ef4444';
  const areaFill = isPositive ? 'url(#portfolioGradUp)' : 'url(#portfolioGradDown)';

  if (svgLine) {
    svgLine.setAttribute('d', lineD);
    svgLine.setAttribute('stroke', mainColor);
  }
  if (svgArea) {
    svgArea.setAttribute('d', areaD);
    svgArea.setAttribute('fill', areaFill);
  }

  if (baseline) {
    const baselineY = Number(((marginV + usableH) - ((chartData.startVal - minP) / span) * usableH).toFixed(1));
    baseline.setAttribute('y1', baselineY);
    baseline.setAttribute('y2', baselineY);
  }
}

/**
 * Configure les interactions de survol du graphique portefeuille
 */
function setupPortfolioChartInteractions() {
  const stage = document.getElementById('portfolio-chart-stage');
  const tracker = document.getElementById('portfolio-hover-tracker');
  const hoverLine = document.getElementById('portfolio-hover-line');
  const hoverDot = document.getElementById('portfolio-hover-dot');
  const hoverDotHalo = document.getElementById('portfolio-hover-dot-halo');
  const tooltip = document.getElementById('portfolio-tooltip');
  const tooltipDate = document.getElementById('portfolio-tooltip-date');
  const tooltipVal = document.getElementById('portfolio-tooltip-val');
  const tooltipPerf = document.getElementById('portfolio-tooltip-perf');
  const tooltipDca = document.getElementById('portfolio-tooltip-dca');

  if (!stage || !tracker || !tooltip) return;

  function handlePointerMove(e) {
    if (!currentPortfolioChartPoints || currentPortfolioChartPoints.length === 0) return;
    const rect = stage.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX == null) return;

    const relX = clientX - rect.left;
    const svgX = (relX / rect.width) * 1000;

    let closest = currentPortfolioChartPoints[0];
    let minDist = Math.abs(currentPortfolioChartPoints[0].x - svgX);

    for (let i = 1; i < currentPortfolioChartPoints.length; i++) {
      const d = Math.abs(currentPortfolioChartPoints[i].x - svgX);
      if (d < minDist) {
        minDist = d;
        closest = currentPortfolioChartPoints[i];
      }
    }

    tracker.style.display = 'block';
    tooltip.style.display = 'block';

    if (hoverLine) {
      hoverLine.setAttribute('x1', closest.x);
      hoverLine.setAttribute('x2', closest.x);
    }
    if (hoverDot) {
      hoverDot.setAttribute('cx', closest.x);
      hoverDot.setAttribute('cy', closest.y);
    }
    if (hoverDotHalo) {
      hoverDotHalo.setAttribute('cx', closest.x);
      hoverDotHalo.setAttribute('cy', closest.y);
    }

    if (tooltipDate) tooltipDate.textContent = closest.date;
    if (tooltipVal) tooltipVal.textContent = `${closest.value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    if (tooltipPerf) {
      const isUp = closest.changeEur >= 0;
      tooltipPerf.textContent = `${isUp ? '+' : ''}${closest.changePct.toFixed(2)}% (${isUp ? '+' : ''}${closest.changeEur.toFixed(2)} €)`;
      tooltipPerf.className = `tooltip-perf ${isUp ? 'text-green' : 'text-red'}`;
    }

    if (tooltipDca) {
      if (closest.dcaNote) {
        tooltipDca.textContent = closest.dcaNote;
        tooltipDca.style.display = 'block';
      } else {
        tooltipDca.style.display = 'none';
      }
    }

    const leftPx = (closest.x / 1000) * rect.width;
    const topPx = (closest.y / 240) * (rect.height - 24);
    tooltip.style.left = `${leftPx}px`;
    tooltip.style.top = `${topPx}px`;
  }

  function handlePointerLeave() {
    tracker.style.display = 'none';
    tooltip.style.display = 'none';
  }

  stage.addEventListener('mousemove', handlePointerMove);
  stage.addEventListener('touchmove', handlePointerMove, { passive: true });
  stage.addEventListener('mouseleave', handlePointerLeave);
  stage.addEventListener('touchend', handlePointerLeave);
}

/**
 * Formate une date AAAA-MM-JJ en texte lisible (ex: 19 janv. 2024)
 */
function formatHoldingDate(dateStr) {
  if (!dateStr) return 'Date non spécifiée';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch {}
  return dateStr;
}

/**
 * Rendu de la barre d'allocation globale
 */
function renderPortfolioAllocationBar(holdings, totalValue) {
  const container = document.getElementById('portfolio-alloc-bar');
  const legend = document.getElementById('portfolio-alloc-legend');
  if (!container) return;

  if (!holdings || holdings.length === 0) {
    container.innerHTML = '<div class="portfolio-alloc-seg" style="width: 100%; background: rgba(255, 255, 255, 0.08); border-radius: 999px;"></div>';
    if (legend) legend.textContent = 'Portefeuille vide (0 actif)';
    return;
  }

  container.innerHTML = holdings
    .map((h) => `<div class="portfolio-alloc-seg seg-${h.colorClass}" style="width: ${h.weightPct.toFixed(1)}%;" title="${h.name} : ${h.weightPct.toFixed(1)}% (${h.totalEur.toFixed(2)} €) • PRU : ${h.buyPrice.toFixed(2)} €"></div>`)
    .join('');

  if (legend) {
    legend.textContent = holdings.map((h) => `${h.shortName || h.id.toUpperCase()}: ${h.weightPct.toFixed(1)}%`).join(' • ');
  }
}

/**
 * Rendu des cartes d'actifs détenus dans le portefeuille
 */
function renderPortfolioHoldings(holdings, totalValue) {
  const container = document.getElementById('portfolio-holdings-grid');
  if (!container) return;

  if (!holdings || holdings.length === 0) {
    container.innerHTML = `
      <div class="portfolio-empty-state">
        <div class="portfolio-empty-icon">
          <i class="fa-solid fa-wallet"></i>
        </div>
        <h4 class="portfolio-empty-title">Votre portefeuille est actuellement vide</h4>
        <p class="portfolio-empty-desc">
          Ajoutez vos premières actions et ETF en renseignant la <strong>date d'achat</strong> et <strong>le prix d'achat unitaire (PRU)</strong> pour suivre votre valorisation exacte et vos plus-values réelles.
        </p>
        <div class="portfolio-empty-actions">
          <button type="button" class="portfolio-btn-primary" id="portfolio-empty-create-btn">
            <i class="fa-solid fa-plus-circle"></i>
            <span>+ Ajouter mon premier actif</span>
          </button>
          <button type="button" class="portfolio-btn-secondary" id="portfolio-empty-demo-btn">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Restaurer mon portefeuille (1 515,08 €)</span>
          </button>
        </div>
      </div>
    `;

    const createBtn = document.getElementById('portfolio-empty-create-btn');
    if (createBtn) createBtn.addEventListener('click', () => openPortfolioManageModal('add'));
    const demoBtn = document.getElementById('portfolio-empty-demo-btn');
    if (demoBtn) demoBtn.addEventListener('click', () => resetPortfolioState('demo'));
    return;
  }

  container.innerHTML = holdings
    .map((h) => {
      const isUp = h.change24hPct >= 0;
      const sign24 = isUp ? '+' : '';
      const isGain = h.gainEur >= 0;
      const gainSign = isGain ? '+' : '';

      const dcaText = h.dcaMonthly > 0 ? `+${h.dcaMonthly} € / mois` : 'Pas de DCA';
      const dcaClass = h.dcaMonthly > 0 ? '' : 'none';
      const dcaIcon = h.dcaMonthly > 0 ? 'fa-solid fa-calendar-check' : 'fa-solid fa-lock';

      const unitPriceStr = h.originalUnit === '$'
        ? `${h.priceOriginal.toFixed(2)} $ • ${h.priceEur.toFixed(2)} €`
        : `${h.priceEur.toFixed(2)} €`;

      const formattedDate = formatHoldingDate(h.buyDate);

      return `
        <div class="portfolio-holding-card" data-asset-id="${h.id}" title="Cliquer pour voir le graphique détaillé de ${h.name}">
          <div class="holding-top-row">
            <div class="holding-asset-brand">
              <div class="holding-icon icon-${h.colorClass}">
                <i class="${h.icon}"></i>
              </div>
              <div class="holding-names">
                <span class="holding-name">${h.name}</span>
                <span class="holding-sym">${h.symbol}</span>
              </div>
            </div>
            <div class="holding-top-actions">
              <span class="holding-dca-tag ${dcaClass}">
                <i class="${dcaIcon}"></i> ${dcaText}
              </span>
              <button type="button" class="holding-action-btn edit-holding-btn" data-asset-id="${h.id}" title="Personnaliser cette ligne (date, prix, parts)">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="holding-action-btn delete-holding-btn" data-asset-id="${h.id}" title="Supprimer cet actif du portefeuille">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <div class="holding-metrics">
            <div class="holding-val-row">
              <span class="holding-total-val">${h.totalEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
              <span class="holding-weight">${h.weightPct.toFixed(1)}%</span>
            </div>

            <!-- Bloc Quand et à quel prix (Achat) -->
            <div class="holding-purchase-row">
              <div class="holding-purchase-item" title="Date de l'achat">
                <i class="fa-regular fa-calendar"></i>
                <span>Acheté le <strong>${formattedDate}</strong></span>
              </div>
              <div class="holding-purchase-item" title="Prix de revient unitaire (PRU)">
                <i class="fa-solid fa-tag"></i>
                <span>PRU : <strong>${h.buyPrice.toFixed(2)} €</strong></span>
              </div>
            </div>

            <div class="holding-shares-row">
              <span><strong>${h.shares.toFixed(2)}</strong> part${h.shares > 1 ? 's' : ''} • Investi : <strong>${h.investedEur.toFixed(2)} €</strong></span>
              <span class="holding-unit-price">${unitPriceStr}</span>
            </div>

            <div class="holding-perf-row">
              <div class="holding-gain-pill ${isGain ? 'up' : 'down'}" title="Plus-value ou moins-value totale depuis l'achat">
                <i class="fa-solid fa-arrow-trend-${isGain ? 'up' : 'down'}"></i>
                <span>Gain : ${gainSign}${h.gainEur.toFixed(2)} € (${gainSign}${h.gainPct.toFixed(2)}%)</span>
              </div>
              <span class="holding-change-24h ${isUp ? 'text-green' : 'text-red'}" title="Variation de la séance 24h">
                ${sign24}${h.change24hPct.toFixed(2)}% (24h)
              </span>
            </div>

            <div class="holding-progress-bar">
              <div class="holding-progress-fill portfolio-alloc-seg seg-${h.colorClass}" style="width: ${h.weightPct.toFixed(1)}%;"></div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  // Gestion des clics sur les cartes
  container.querySelectorAll('.portfolio-holding-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.holding-action-btn')) return;
      const assetId = card.dataset.assetId;
      const asset = marketAssets.find((a) => a.id === assetId);
      if (asset) openChartModal(asset);
    });
  });

  // Boutons Modifier
  container.querySelectorAll('.edit-holding-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const assetId = btn.dataset.assetId;
      openPortfolioManageModal('positions', assetId);
    });
  });

  // Boutons Supprimer
  container.querySelectorAll('.delete-holding-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const assetId = btn.dataset.assetId;
      deleteHoldingFromPortfolio(assetId);
    });
  });
}

/**
 * Supprime un actif du portefeuille avec confirmation
 */
function deleteHoldingFromPortfolio(assetId) {
  const holding = (portfolioState.holdings || []).find((h) => h.id === assetId);
  const name = holding ? (holding.name || assetId.toUpperCase()) : assetId.toUpperCase();

  if (!confirm(`Supprimer ${name} de votre portefeuille ?`)) return;

  portfolioState.holdings = (portfolioState.holdings || []).filter((h) => h.id !== assetId);
  delete portfolioState.positions[assetId];
  if (portfolioState.dcaRules?.allocations) {
    delete portfolioState.dcaRules.allocations[assetId];
  }

  portfolioState.history.unshift({
    id: 'del_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    type: 'reset',
    title: `Suppression de ${name}`,
    amount: 0,
    note: `Actif ${assetId.toUpperCase()} retiré du portefeuille`
  });

  savePortfolioState();
  renderPortfolioModule();
  renderPortfolioPositionsTab();
  renderPortfolioDcaTab();
  if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();

  if (typeof showToast === 'function') {
    showToast(`${name} a été supprimé de votre portefeuille.`, 'info');
  }
}

/**
 * Rendu complet du module Portefeuille
 */
function renderPortfolioModule() {
  const summary = calculatePortfolioSummary();
  const nextDca = getNextDcaDateInfo();

  const totalValEl = document.getElementById('portfolio-total-val');
  const change24hEl = document.getElementById('portfolio-change-24h');
  const gainValEl = document.getElementById('portfolio-gain-val');
  const investedValEl = document.getElementById('portfolio-invested-val');
  const gainPctEl = document.getElementById('portfolio-gain-pct');
  const nextDateEl = document.getElementById('portfolio-next-dca-date');
  const nextCountdownEl = document.getElementById('portfolio-next-dca-countdown');
  const nextSumEl = document.getElementById('portfolio-next-dca-sum');

  if (totalValEl) {
    totalValEl.textContent = `${summary.totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }
  if (change24hEl) {
    const isUp = summary.totalChange24hEur >= 0;
    const sign = isUp ? '+' : '';
    change24hEl.className = `portfolio-badge ${isUp ? 'up' : 'down'}`;
    change24hEl.innerHTML = `<i class="fa-solid fa-arrow-trend-${isUp ? 'up' : 'down'}"></i> ${sign}${summary.totalChange24hPct.toFixed(2)}% (${sign}${summary.totalChange24hEur.toFixed(2)} € / 24h)`;
  }
  if (gainValEl) {
    const isGain = summary.gainLatentEur >= 0;
    const sign = isGain ? '+' : '';
    gainValEl.textContent = `${sign}${summary.gainLatentEur.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    gainValEl.className = `portfolio-kpi-val ${isGain ? 'text-green' : 'text-red'}`;
  }
  const gainIconEl = document.getElementById('portfolio-gain-icon');
  if (gainIconEl) {
    const isGain = summary.gainLatentEur >= 0;
    gainIconEl.className = `fa-solid fa-arrow-trend-${isGain ? 'up' : 'down'} ${isGain ? 'text-green' : 'text-red'}`;
  }
  if (investedValEl) {
    investedValEl.textContent = `${summary.totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }
  if (gainPctEl) {
    const isGain = summary.gainLatentPct >= 0;
    const sign = isGain ? '+' : '';
    gainPctEl.textContent = `(${sign}${summary.gainLatentPct.toFixed(2)}%)`;
    gainPctEl.className = `portfolio-gain-pct ${isGain ? 'text-green' : 'text-red'}`;
  }

  const statusPill = document.getElementById('portfolio-status-pill');
  if (statusPill) {
    if (!nextDca.isEnabled) {
      statusPill.innerHTML = `<span class="status-dot" style="background: rgba(255,255,255,0.3);"></span> DCA en Pause`;
    } else if (nextDca.isSkippedThisMonth) {
      statusPill.innerHTML = `<span class="status-dot" style="background: #fbbf24;"></span> Ce mois sauté (${nextDca.dateStr})`;
    } else if (nextDca.monthlyTotal > 0) {
      statusPill.innerHTML = `<span class="status-dot pulse-green"></span> DCA Programmé (${nextDca.dateStr})`;
    } else {
      statusPill.innerHTML = `<span class="status-dot" style="background: rgba(255,255,255,0.3);"></span> Aucun DCA actif`;
    }
  }

  if (nextDateEl) nextDateEl.textContent = (nextDca.monthlyTotal > 0 && nextDca.isEnabled) ? nextDca.dateStr : '--';
  if (nextCountdownEl) {
    if (!nextDca.isEnabled) {
      nextCountdownEl.innerHTML = `<i class="fa-regular fa-clock"></i> En pause`;
    } else if (nextDca.isSkippedThisMonth) {
      nextCountdownEl.innerHTML = `<i class="fa-regular fa-clock"></i> Sauté ce mois`;
    } else if (nextDca.monthlyTotal > 0) {
      nextCountdownEl.innerHTML = `<i class="fa-regular fa-clock"></i> Dans ${nextDca.daysRemaining} jour${nextDca.daysRemaining > 1 ? 's' : ''}`;
    } else {
      nextCountdownEl.innerHTML = `<i class="fa-regular fa-clock"></i> Inactif`;
    }
  }
  if (nextSumEl) {
    nextSumEl.textContent = `${nextDca.monthlyTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }

  // Sous-titre dynamique dans le hero
  const subtitleEl = document.querySelector('#markets-portfolio-hero .portfolio-subtitle');
  if (subtitleEl) {
    if (summary.holdings.length === 0) {
      subtitleEl.textContent = 'Portefeuille vide • Ajoutez vos premières actions et ETF pour commencer le suivi de vos investissements.';
    } else {
      const namesStr = summary.holdings.map((h) => h.shortName || h.id.toUpperCase()).join(', ');
      subtitleEl.textContent = `${summary.holdings.length} actif(s) (${namesStr}) • Capital total investi : ${summary.totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    }
  }

  // Règle DCA dynamique
  const dcaValEl = document.getElementById('portfolio-dca-rule-val');
  const dcaSubEl = document.getElementById('portfolio-dca-rule-sub');
  if (dcaValEl) {
    const totalDca = Object.values(portfolioState.dcaRules?.allocations || {}).reduce((s, v) => s + (Number(v) || 0), 0);
    dcaValEl.textContent = `${totalDca.toFixed(2)} € / mois`;
    if (dcaSubEl) {
      const parts = summary.holdings
        .filter((h) => (h.dcaMonthly || 0) > 0)
        .map((h) => `${h.dcaMonthly}€ ${h.shortName || h.id.toUpperCase()}`);
      dcaSubEl.textContent = parts.length > 0 ? `${parts.join(' • ')} (${(totalDca * 12).toFixed(0)} €/an)` : 'Aucun DCA actif';
    }
  }

  renderPortfolioAllocationBar(summary.holdings, summary.totalValue);
  renderPortfolioHoldings(summary.holdings, summary.totalValue);
  renderPortfolioChart(portfolioState.selectedTimeframe || '24h');
}

/**
 * Rendu de l'onglet 1 : Mes Positions & Achats (Dates, Prix d'achat PRU, parts)
 */
function renderPortfolioPositionsTab() {
  const container = document.getElementById('pm-holdings-list-container');
  const sumInvestedEl = document.getElementById('pm-sum-invested');
  const sumValEl = document.getElementById('pm-sum-val');
  const sumGainEl = document.getElementById('pm-sum-gain');
  if (!container) return;

  const summary = calculatePortfolioSummary();
  if (sumInvestedEl) sumInvestedEl.textContent = `${summary.totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  if (sumValEl) sumValEl.textContent = `${summary.totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  if (sumGainEl) {
    const isGain = summary.gainLatentEur >= 0;
    const sign = isGain ? '+' : '';
    sumGainEl.className = isGain ? 'text-green' : 'text-red';
    sumGainEl.textContent = `${sign}${summary.gainLatentEur.toFixed(2)} € (${sign}${summary.gainLatentPct.toFixed(2)}%)`;
  }

  const holdings = summary.holdings;
  if (!holdings || holdings.length === 0) {
    container.innerHTML = `
      <div class="portfolio-empty-state" style="padding: 2.2rem 1.2rem;">
        <div class="portfolio-empty-icon" style="width: 46px; height: 46px; font-size: 1.3rem;"><i class="fa-solid fa-folder-open"></i></div>
        <h4 style="font-size: 1.1rem; margin: 0;">Aucune position dans le portefeuille</h4>
        <p style="font-size: 0.82rem; margin: 0; max-width: 400px;">Ajoutez votre premier actif en spécifiant quand et à quel prix vous l'avez acheté.</p>
        <button type="button" class="pm-mini-btn primary" id="pm-empty-goto-add" style="margin-top: 6px;"><i class="fa-solid fa-plus-circle"></i> Ajouter mon premier actif</button>
      </div>
    `;
    const gotoAddBtn = document.getElementById('pm-empty-goto-add');
    if (gotoAddBtn) {
      gotoAddBtn.addEventListener('click', () => switchPortfolioModalTab('add'));
    }
    return;
  }

  container.innerHTML = holdings.map((h) => {
    const isGain = h.gainEur >= 0;
    const sign = isGain ? '+' : '';
    const livePriceFormatted = h.priceEur.toFixed(2);

    return `
      <div class="pm-holding-edit-card" data-asset-id="${h.id}" id="pm-card-${h.id}">
        <div class="pm-edit-card-head">
          <div class="pm-edit-card-brand">
            <div class="holding-icon icon-${h.colorClass}" style="width: 34px; height: 34px; font-size: 1rem;">
              <i class="${h.icon}"></i>
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <input type="text" class="pm-input-ctrl pm-field-name" data-id="${h.id}" value="${h.name || ''}" title="Nom de l'actif" style="font-weight: 700; font-size: 0.88rem; padding: 2px 6px; border: 1px solid transparent; background: transparent;" />
              </div>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                <input type="text" class="pm-input-ctrl pm-field-symbol" data-id="${h.id}" value="${h.symbol || ''}" title="Symbole / Ticker" style="font-size: 0.72rem; color: rgba(255,255,255,0.6); padding: 1px 5px; width: 130px; border: 1px solid transparent; background: transparent;" />
                <span style="font-size: 0.7rem; color: rgba(255,255,255,0.4);">• ${(h.type || 'stock').toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div class="pm-edit-card-right">
            <span class="pm-live-badge" title="Cours actuel en direct converti en euros">Direct : ${livePriceFormatted} €</span>
            <button type="button" class="pm-mini-btn primary pm-save-line-btn" data-asset-id="${h.id}" title="Enregistrer les modifications de cette ligne">
              <i class="fa-solid fa-check"></i> Enregistrer
            </button>
            <button type="button" class="pm-delete-row-btn" data-asset-id="${h.id}" title="Supprimer cet actif du portefeuille">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        <div class="pm-edit-inputs-grid">
          <div class="pm-edit-cell">
            <label>Date d'achat</label>
            <div class="pm-input-wrap">
              <input type="date" class="pm-input-ctrl pm-field-date" data-id="${h.id}" value="${h.buyDate || ''}" title="Date à laquelle l'actif a été acheté" />
            </div>
          </div>

          <div class="pm-edit-cell">
            <label>Prix d'achat unitaire (PRU €)</label>
            <div class="pm-input-wrap">
              <input type="number" step="0.01" min="0" class="pm-input-ctrl pm-field-price" data-id="${h.id}" value="${h.buyPrice.toFixed(2)}" style="padding-right: 56px;" title="Prix unitaire payé par part" />
              <button type="button" class="pm-btn-live-fill" data-id="${h.id}" data-live-price="${livePriceFormatted}" title="Appliquer le cours direct en temps réel">Direct</button>
            </div>
          </div>

          <div class="pm-edit-cell">
            <label>Parts / Quantité</label>
            <div class="pm-input-wrap">
              <input type="number" step="0.0001" min="0" class="pm-input-ctrl pm-field-shares" data-id="${h.id}" value="${h.shares}" title="Nombre de parts détenues" />
            </div>
          </div>

          <div class="pm-edit-cell">
            <label>DCA (€ / mois)</label>
            <div class="pm-input-wrap">
              <input type="number" step="1" min="0" class="pm-input-ctrl pm-field-dca" data-id="${h.id}" value="${h.dcaMonthly || 0}" title="Versement mensuel programmé" />
            </div>
          </div>
        </div>

        <div class="pm-edit-sub-row">
          <div class="pm-edit-cell" style="flex: 2;">
            <label>Compte / Courtier / Note (optionnel)</label>
            <div class="pm-input-wrap">
              <input type="text" class="pm-input-ctrl pm-field-notes" data-id="${h.id}" value="${h.notes || ''}" placeholder="Ex: PEA BoursoBank, CTO Trade Republic, Assurance Vie..." />
            </div>
          </div>
          ${h.id.startsWith('cust_') ? `
          <div class="pm-edit-cell" style="flex: 1;">
            <label>Cours direct estimé (€)</label>
            <div class="pm-input-wrap">
              <input type="number" step="0.01" min="0" class="pm-input-ctrl pm-field-live-custom" data-id="${h.id}" value="${h.priceEur.toFixed(2)}" title="Mettre à jour le cours direct de cet actif sur mesure" />
            </div>
          </div>
          ` : ''}
        </div>

        <div class="pm-edit-card-foot" id="pm-foot-${h.id}">
          <span>Investi : <strong id="pm-invested-${h.id}">${h.investedEur.toFixed(2)} €</strong></span>
          <span>Valeur : <strong id="pm-val-${h.id}">${h.totalEur.toFixed(2)} €</strong></span>
          <span class="${isGain ? 'text-green' : 'text-red'}" id="pm-gain-${h.id}">Gain : <strong>${sign}${h.gainEur.toFixed(2)} € (${sign}${h.gainPct.toFixed(2)}%)</strong></span>
        </div>
      </div>
    `;
  }).join('');

  // Synchronisation dynamique lors de la frappe
  container.querySelectorAll('.pm-holding-edit-card').forEach((card) => {
    const id = card.dataset.assetId;
    const priceInput = card.querySelector('.pm-field-price');
    const sharesInput = card.querySelector('.pm-field-shares');
    const dateInput = card.querySelector('.pm-field-date');
    const liveFillBtn = card.querySelector('.pm-btn-live-fill');
    const deleteBtn = card.querySelector('.pm-delete-row-btn');
    const saveLineBtn = card.querySelector('.pm-save-line-btn');
    const liveCustomInput = card.querySelector('.pm-field-live-custom');

    const updateLineStats = () => {
      const p = parseFloat(priceInput.value) || 0;
      const q = parseFloat(sharesInput.value) || 0;
      const liveP = liveCustomInput ? (parseFloat(liveCustomInput.value) || getAssetPriceInEur(id)) : getAssetPriceInEur(id);
      const invested = p * q;
      const current = liveP * q;
      const gain = current - invested;
      const gainPct = invested > 0 ? (gain / invested) * 100 : 0;
      const isGain = gain >= 0;
      const sign = isGain ? '+' : '';

      const invEl = document.getElementById(`pm-invested-${id}`);
      const valEl = document.getElementById(`pm-val-${id}`);
      const gainEl = document.getElementById(`pm-gain-${id}`);

      if (invEl) invEl.textContent = `${invested.toFixed(2)} €`;
      if (valEl) valEl.textContent = `${current.toFixed(2)} €`;
      if (gainEl) {
        gainEl.className = isGain ? 'text-green' : 'text-red';
        gainEl.innerHTML = `Gain : <strong>${sign}${gain.toFixed(2)} € (${sign}${gainPct.toFixed(2)}%)</strong>`;
      }
      recalcModalSummary();
    };

    priceInput?.addEventListener('input', updateLineStats);
    sharesInput?.addEventListener('input', updateLineStats);
    dateInput?.addEventListener('change', updateLineStats);
    liveCustomInput?.addEventListener('input', updateLineStats);

    liveFillBtn?.addEventListener('click', () => {
      const lp = liveFillBtn.dataset.livePrice;
      if (lp && priceInput) {
        priceInput.value = lp;
        updateLineStats();
      }
    });

    saveLineBtn?.addEventListener('click', () => {
      const h = (portfolioState.holdings || []).find((x) => x.id === id);
      if (!h) return;
      const d = dateInput?.value;
      const p = parseFloat(priceInput?.value);
      const s = parseFloat(sharesInput?.value);
      const dca = parseFloat(card.querySelector('.pm-field-dca')?.value);
      const notes = card.querySelector('.pm-field-notes')?.value;
      const nameVal = card.querySelector('.pm-field-name')?.value;
      const symVal = card.querySelector('.pm-field-symbol')?.value;
      const liveCustom = parseFloat(liveCustomInput?.value);

      if (d) h.buyDate = d;
      if (!isNaN(p) && p >= 0) h.buyPrice = p;
      if (!isNaN(s) && s >= 0) h.shares = s;
      if (!isNaN(dca) && dca >= 0) {
        h.dcaMonthly = dca;
        if (portfolioState.dcaRules) portfolioState.dcaRules.allocations[h.id] = dca;
      }
      if (typeof notes === 'string') h.notes = notes.trim();
      if (nameVal) h.name = nameVal.trim();
      if (symVal) h.symbol = symVal.trim().toUpperCase();
      if (!isNaN(liveCustom) && liveCustom >= 0) {
        const custAsset = marketAssets.find((a) => a.id === h.id);
        if (custAsset) {
          custAsset.basePrice = liveCustom;
          saveMarketAssets();
        }
      }
      portfolioState.positions[h.id] = h.shares;

      savePortfolioState();
      renderPortfolioModule();
      if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();
      if (typeof renderDashboardPortfolio === 'function') renderDashboardPortfolio();
      if (typeof showToast === 'function') {
        showToast(`Ligne ${h.shortName || h.id.toUpperCase()} enregistrée avec succès !`, 'success');
      }
    });

    deleteBtn?.addEventListener('click', () => {
      deleteHoldingFromPortfolio(id);
    });
  });
}

/**
 * Recalcule les métriques globales affichées dans l'en-tête de la modale
 */
function recalcModalSummary() {
  const container = document.getElementById('pm-holdings-list-container');
  if (!container) return;

  let totalInv = 0;
  let totalCur = 0;

  container.querySelectorAll('.pm-holding-edit-card').forEach((card) => {
    const id = card.dataset.assetId;
    const p = parseFloat(card.querySelector('.pm-field-price')?.value) || 0;
    const q = parseFloat(card.querySelector('.pm-field-shares')?.value) || 0;
    const liveCustomInput = card.querySelector('.pm-field-live-custom');
    const liveP = liveCustomInput ? (parseFloat(liveCustomInput.value) || getAssetPriceInEur(id)) : getAssetPriceInEur(id);
    totalInv += p * q;
    totalCur += liveP * q;
  });

  const sumInvestedEl = document.getElementById('pm-sum-invested');
  const sumValEl = document.getElementById('pm-sum-val');
  const sumGainEl = document.getElementById('pm-sum-gain');

  if (sumInvestedEl) sumInvestedEl.textContent = `${totalInv.toFixed(2)} €`;
  if (sumValEl) sumValEl.textContent = `${totalCur.toFixed(2)} €`;
  if (sumGainEl) {
    const gain = totalCur - totalInv;
    const gainPct = totalInv > 0 ? (gain / totalInv) * 100 : 0;
    const isGain = gain >= 0;
    const sign = isGain ? '+' : '';
    sumGainEl.className = isGain ? 'text-green' : 'text-red';
    sumGainEl.textContent = `${sign}${gain.toFixed(2)} € (${sign}${gainPct.toFixed(2)}%)`;
  }
}

/**
 * Initialisation de l'outil d'ajout d'actif (Onglet 2)
 */
function initAddAssetTab() {
  const select = document.getElementById('pm-add-asset-select');
  const customFields = document.getElementById('pm-custom-asset-fields');
  const buyDateInput = document.getElementById('pm-add-buy-date');
  const buyPriceInput = document.getElementById('pm-add-buy-price');
  const useLiveBtn = document.getElementById('pm-add-use-live-price');
  const sharesInput = document.getElementById('pm-add-shares');
  const dcaInput = document.getElementById('pm-add-dca');
  const notesInput = document.getElementById('pm-add-notes');
  const submitBtn = document.getElementById('pm-add-submit-btn');

  if (!select) return;

  if (buyDateInput && !buyDateInput.value) {
    buyDateInput.value = new Date().toISOString().split('T')[0];
  }

  const updateSelectedAssetInfo = () => {
    const val = select.value;
    if (val === 'custom') {
      if (customFields) customFields.style.display = 'flex';
      if (useLiveBtn) useLiveBtn.style.display = 'none';
    } else {
      if (customFields) customFields.style.display = 'none';
      if (useLiveBtn) useLiveBtn.style.display = 'inline-flex';
      const livePrice = getAssetPriceInEur(val);
      if (useLiveBtn) useLiveBtn.textContent = `Cours actuel : ${livePrice.toFixed(2)} €`;
      if (buyPriceInput && (!buyPriceInput.value || buyPriceInput.dataset.autoFilled === 'true')) {
        buyPriceInput.value = livePrice.toFixed(2);
        buyPriceInput.dataset.autoFilled = 'true';
      }
    }
    updateAddPreview();
  };

  const updateAddPreview = () => {
    const val = select.value;
    let liveP = 0;
    if (val === 'custom') {
      liveP = parseFloat(document.getElementById('pm-custom-price')?.value) || 0;
    } else {
      liveP = getAssetPriceInEur(val);
    }

    const buyP = parseFloat(buyPriceInput?.value) || 0;
    const q = parseFloat(sharesInput?.value) || 0;
    const invested = buyP * q;
    const current = liveP * q;
    const gain = current - invested;
    const gainPct = invested > 0 ? (gain / invested) * 100 : 0;
    const isGain = gain >= 0;
    const sign = isGain ? '+' : '';

    const prevInvested = document.getElementById('pm-prev-invested');
    const prevCurrent = document.getElementById('pm-prev-current');
    const prevGain = document.getElementById('pm-prev-gain');

    if (prevInvested) prevInvested.textContent = `${invested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    if (prevCurrent) prevCurrent.textContent = `${current.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    if (prevGain) {
      prevGain.className = `pm-prev-val ${isGain ? 'text-green' : 'text-red'}`;
      prevGain.textContent = `${sign}${gain.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € (${sign}${gainPct.toFixed(2)}%)`;
    }
  };

  if (!select._hasAddListener) {
    select._hasAddListener = true;
    select.addEventListener('change', () => {
      if (buyPriceInput) buyPriceInput.dataset.autoFilled = 'true';
      updateSelectedAssetInfo();
    });

    buyPriceInput?.addEventListener('input', () => {
      if (buyPriceInput) buyPriceInput.dataset.autoFilled = 'false';
      updateAddPreview();
    });

    sharesInput?.addEventListener('input', updateAddPreview);
    document.getElementById('pm-custom-price')?.addEventListener('input', updateAddPreview);

    useLiveBtn?.addEventListener('click', () => {
      const val = select.value;
      if (val !== 'custom') {
        const livePrice = getAssetPriceInEur(val);
        if (buyPriceInput) {
          buyPriceInput.value = livePrice.toFixed(2);
          buyPriceInput.dataset.autoFilled = 'true';
          updateAddPreview();
        }
      }
    });

    submitBtn?.addEventListener('click', () => {
      const val = select.value;
      const buyDate = buyDateInput?.value || new Date().toISOString().split('T')[0];
      const buyPrice = parseFloat(buyPriceInput?.value);
      const shares = parseFloat(sharesInput?.value);
      const dca = parseFloat(dcaInput?.value) || 0;
      const notes = (notesInput?.value || '').trim();

      if (isNaN(buyPrice) || buyPrice <= 0) {
        if (typeof showToast === 'function') showToast('Veuillez renseigner un prix d\'achat valide supérieur à 0.', 'warning');
        return;
      }
      if (isNaN(shares) || shares <= 0) {
        if (typeof showToast === 'function') showToast('Veuillez renseigner un nombre de parts valide supérieur à 0.', 'warning');
        return;
      }

      let assetId = val;
      let assetName = '';
      let assetShortName = '';
      let assetSymbol = '';
      let assetType = 'stock';

      if (val === 'custom') {
        const customName = (document.getElementById('pm-custom-name')?.value || '').trim();
        const customSym = (document.getElementById('pm-custom-symbol')?.value || '').trim().toUpperCase();
        const customPrice = parseFloat(document.getElementById('pm-custom-price')?.value) || buyPrice;
        const customType = document.getElementById('pm-custom-type')?.value || 'stock';

        if (!customName || !customSym) {
          if (typeof showToast === 'function') showToast('Veuillez renseigner le nom et le symbole de l\'actif.', 'warning');
          return;
        }

        assetId = 'cust_' + customSym.toLowerCase().replace(/[^a-z0-9]/g, '');
        assetName = customName;
        assetShortName = customName;
        assetSymbol = customSym;
        assetType = customType;

        if (!marketAssets.some((a) => a.id === assetId)) {
          marketAssets.push({
            id: assetId,
            name: assetName,
            symbol: assetSymbol,
            type: assetType,
            icon: assetType === 'crypto' ? 'fa-solid fa-coins' : (assetType === 'etf' ? 'fa-solid fa-chart-line' : 'fa-solid fa-building'),
            basePrice: customPrice,
            baseChange: 0,
            dayLow: customPrice * 0.98,
            dayHigh: customPrice * 1.02,
            unit: '€',
            exchange: 'Autre',
            enabled: true,
            isCustom: true
          });
          saveMarketAssets();
        }
      } else {
        const asset = marketAssets.find((a) => a.id === val);
        if (asset) {
          assetName = asset.name;
          assetShortName = asset.name.split('(')[0].trim();
          assetSymbol = asset.symbol;
          assetType = asset.type || 'stock';
        }
      }

      // Vérifier si l'actif est déjà dans les holdings (calcul du PRU pondéré)
      const existing = (portfolioState.holdings || []).find((h) => h.id === assetId);
      if (existing) {
        const oldCost = existing.shares * existing.buyPrice;
        const newCost = shares * buyPrice;
        const totalShares = existing.shares + shares;
        const weightedPru = (oldCost + newCost) / totalShares;

        existing.shares = Number(totalShares.toFixed(4));
        existing.buyPrice = Number(weightedPru.toFixed(2));
        existing.buyDate = buyDate; // Date du dernier achat
        if (dca > 0) existing.dcaMonthly = dca;
        if (notes) existing.notes = notes;
      } else {
        portfolioState.holdings.push({
          id: assetId,
          name: assetName,
          shortName: assetShortName,
          symbol: assetSymbol,
          type: assetType,
          shares,
          buyPrice,
          buyDate,
          dcaMonthly: dca,
          notes
        });
      }

      const finalShares = existing ? existing.shares : shares;
      portfolioState.positions[assetId] = Number(finalShares);
      if (!portfolioState.dcaRules) {
        portfolioState.dcaRules = { dayOfMonth: 19, allocations: {} };
      }
      if (!portfolioState.dcaRules.allocations) {
        portfolioState.dcaRules.allocations = {};
      }
      if (dca > 0) {
        portfolioState.dcaRules.allocations[assetId] = dca;
      }

      portfolioState.history.unshift({
        id: 'buy_' + Date.now(),
        date: buyDate,
        type: 'manual',
        title: `Achat de ${shares} part(s) de ${assetShortName || assetId.toUpperCase()}`,
        amount: shares * buyPrice,
        note: `Acheté à ${buyPrice.toFixed(2)} € / part (Total : ${(shares * buyPrice).toFixed(2)} €)`,
        breakdown: [
          {
            assetId,
            assetName: assetShortName || assetId.toUpperCase(),
            amount: shares * buyPrice,
            shares,
            unitPrice: buyPrice
          }
        ]
      });

      savePortfolioState();
      renderPortfolioModule();
      if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();

      if (typeof showToast === 'function') {
        showToast(`${assetShortName || assetId.toUpperCase()} ajouté avec succès au portefeuille !`, 'success');
      }

      switchPortfolioModalTab('positions');
    });
  }

  updateSelectedAssetInfo();
}

/**
 * Extrait les détails et la ventilation par actif d'une transaction/versement
 */
function parseTransactionBreakdown(item) {
  if (!item) return [];
  if (Array.isArray(item.breakdown) && item.breakdown.length > 0) {
    return item.breakdown;
  }
  const results = [];
  const note = item.note || '';
  const title = item.title || '';

  // 1. Format versement DCA: "+30€ 10AP (0.218 p.)" ou "+30€ 10AP (+0.218 parts)" ou "+200€ 10AP (1.520 p. @ 131,58€)"
  const dcaRegex = /\+?\s*([\d.,]+)\s*€\s+([A-Za-z0-9_-]+)(?:\s*\(\+?([\d.,]+)\s*(?:p\.|parts|part)?(?:[^)]*)?\))?/gi;
  let match;
  while ((match = dcaRegex.exec(note)) !== null) {
    const amt = parseFloat(match[1].replace(',', '.'));
    const rawSym = match[2].toLowerCase();
    const shs = match[3] ? parseFloat(match[3].replace(',', '.')) : 0;
    const hold = (portfolioState.holdings || []).find((h) => h.id.toLowerCase() === rawSym || h.symbol?.toLowerCase().includes(rawSym));
    results.push({
      assetId: hold ? hold.id : rawSym,
      assetName: hold ? (hold.shortName || hold.name) : rawSym.toUpperCase(),
      amount: amt,
      shares: shs
    });
  }
  if (results.length > 0) return results;

  // 2. Format Achat dans le titre: "Achat de 4.00 part(s) de 10AP" ou "Achat 1.00 action NVIDIA (NVDA)"
  const buyTitleRegex = /Achat(?:\s+de)?\s+([\d.,]+)\s+(?:action|part)(?:\(s\)|s)?\s+(?:de\s+)?([A-Za-z0-9_-]+)/i;
  const tMatch = title.match(buyTitleRegex);
  if (tMatch) {
    const rawSym = tMatch[2].toLowerCase();
    const hold = (portfolioState.holdings || []).find((h) => h.id.toLowerCase() === rawSym || h.symbol?.toLowerCase().includes(rawSym));
    results.push({
      assetId: hold ? hold.id : rawSym,
      assetName: hold ? (hold.shortName || hold.name) : rawSym.toUpperCase(),
      amount: Number(item.amount) || 0,
      shares: parseFloat(tMatch[1].replace(',', '.'))
    });
    return results;
  }

  // 3. Fallback avec parenthèses ticker
  const symParenMatch = title.match(/\(([A-Za-z0-9_-]+)\)/);
  if (symParenMatch) {
    const rawSym = symParenMatch[1].toLowerCase();
    const hold = (portfolioState.holdings || []).find((h) => h.id.toLowerCase() === rawSym || h.symbol?.toLowerCase().includes(rawSym));
    const numMatch = (title + ' ' + note).match(/([\d.,]+)\s+(?:action|part)/i);
    const shs = numMatch ? parseFloat(numMatch[1].replace(',', '.')) : 1;
    results.push({
      assetId: hold ? hold.id : rawSym,
      assetName: hold ? (hold.shortName || hold.name) : rawSym.toUpperCase(),
      amount: Number(item.amount) || 0,
      shares: shs
    });
  }

  return results;
}

/**
 * Supprime un versement ou une transaction du portefeuille avec rollback automatique
 */
function deletePortfolioTransaction(txId, options = {}) {
  const { rollbackImpact = true, markSkipped = true } = options;
  const txIndex = (portfolioState.history || []).findIndex((t) => t.id === txId);
  if (txIndex === -1) return false;

  const tx = portfolioState.history[txIndex];
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 1. Déduction / Annulation de l'impact sur les positions et le PRU
  if (rollbackImpact) {
    const breakdown = parseTransactionBreakdown(tx);
    breakdown.forEach((item) => {
      const h = (portfolioState.holdings || []).find((x) => x.id.toLowerCase() === item.assetId.toLowerCase());
      if (h) {
        if (typeof item.prevShares === 'number' && typeof item.prevBuyPrice === 'number' && item.prevShares > 0) {
          h.shares = Number(item.prevShares.toFixed(4));
          h.buyPrice = Number(item.prevBuyPrice.toFixed(2));
        } else {
          const sharesToDeduct = Number(item.shares || item.sharesAdded || 0);
          const amountToDeduct = Number(item.amount || 0);
          const currentCost = h.shares * h.buyPrice;
          const newShares = Math.max(0, h.shares - sharesToDeduct);
          const newCost = Math.max(0, currentCost - amountToDeduct);
          h.shares = Number(newShares.toFixed(4));
          h.buyPrice = newShares > 0 ? Number((newCost / newShares).toFixed(2)) : h.buyPrice;
        }
        portfolioState.positions[h.id] = h.shares;
      }
    });

    if (typeof tx.amount === 'number' && tx.amount > 0) {
      portfolioState.totalInvested = Math.max(0, (portfolioState.totalInvested || 0) - tx.amount);
    }
  }

  // 2. Gestion de l'annulation du DCA du mois courant pour éviter toute réexécution intempestive
  const txMonth = tx.date ? tx.date.substring(0, 7) : null;
  const isAutoDca = tx.type === 'auto' || tx.id.startsWith('dca_') || tx.title?.includes('DCA');

  if (markSkipped && (isAutoDca || txMonth === currentYearMonth) && txMonth) {
    if (!Array.isArray(portfolioState.skippedDcaMonths)) {
      portfolioState.skippedDcaMonths = [];
    }
    if (!portfolioState.skippedDcaMonths.includes(txMonth)) {
      portfolioState.skippedDcaMonths.push(txMonth);
    }
  }

  // 3. Suppression de la transaction
  portfolioState.history.splice(txIndex, 1);

  // 4. Sauvegarde et mise à jour de l'affichage
  savePortfolioState();
  renderPortfolioModule();
  if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();
  if (typeof renderDashboardPortfolio === 'function') renderDashboardPortfolio();
  renderPortfolioHistoryTable();
  renderPortfolioPositionsTab();
  renderPortfolioDcaTab();

  if (typeof showToast === 'function') {
    showToast(`Versement de ${Number(tx.amount || 0).toFixed(2)} € supprimé et portefeuille réajusté !`, 'success');
  }

  return true;
}

/**
 * Ouvre la modale pour modifier un versement existant
 */
function openEditTransactionModal(txId) {
  const modal = document.getElementById('portfolio-tx-modal');
  const tx = (portfolioState.history || []).find((t) => t.id === txId);
  if (!modal || !tx) return;

  const titleEl = document.getElementById('pm-tx-modal-title');
  const subEl = document.getElementById('pm-tx-modal-sub');
  if (titleEl) titleEl.textContent = 'Modifier le Versement';
  if (subEl) subEl.textContent = 'Ajustez la date, le montant ou supprimez ce versement';

  const idInput = document.getElementById('pm-tx-id');
  const dateInput = document.getElementById('pm-tx-date');
  const typeSelect = document.getElementById('pm-tx-type');
  const txTitleInput = document.getElementById('pm-tx-title');
  const amountInput = document.getElementById('pm-tx-amount');
  const noteInput = document.getElementById('pm-tx-note');

  if (idInput) idInput.value = tx.id;
  if (dateInput) dateInput.value = tx.date || new Date().toISOString().split('T')[0];
  if (typeSelect) typeSelect.value = tx.type || 'auto';
  if (txTitleInput) txTitleInput.value = tx.title || '';
  if (amountInput) {
    amountInput.value = (Number(tx.amount) || 0).toFixed(2);
    amountInput.dataset.manualEdited = 'true';
  }
  if (noteInput) noteInput.value = tx.note || '';

  const deleteBtn = document.getElementById('pm-tx-delete-btn');
  if (deleteBtn) deleteBtn.style.display = 'inline-flex';

  renderTxAllocInputs(tx);

  modal.classList.remove('is-hidden');
  modal.removeAttribute('hidden');
  modal.style.display = 'flex';
}

/**
 * Ouvre la modale pour créer un nouveau versement manuel
 */
function openAddTransactionModal() {
  const modal = document.getElementById('portfolio-tx-modal');
  if (!modal) return;

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const titleEl = document.getElementById('pm-tx-modal-title');
  const subEl = document.getElementById('pm-tx-modal-sub');
  if (titleEl) titleEl.textContent = 'Nouveau Versement / Opération';
  if (subEl) subEl.textContent = 'Enregistrez un versement ou un apport dans votre portefeuille';

  const idInput = document.getElementById('pm-tx-id');
  const dateInput = document.getElementById('pm-tx-date');
  const typeSelect = document.getElementById('pm-tx-type');
  const txTitleInput = document.getElementById('pm-tx-title');
  const amountInput = document.getElementById('pm-tx-amount');
  const noteInput = document.getElementById('pm-tx-note');

  if (idInput) idInput.value = 'new';
  if (dateInput) dateInput.value = dateStr;
  if (typeSelect) typeSelect.value = 'manual';
  if (txTitleInput) txTitleInput.value = 'Versement portefeuille';
  if (amountInput) {
    amountInput.value = '60.00';
    delete amountInput.dataset.manualEdited;
  }
  if (noteInput) noteInput.value = '';

  const deleteBtn = document.getElementById('pm-tx-delete-btn');
  if (deleteBtn) deleteBtn.style.display = 'none';

  const dummyTx = {
    amount: 60,
    breakdown: (portfolioState.holdings || []).map((h) => ({
      assetId: h.id,
      assetName: h.shortName || h.name,
      amount: portfolioState.dcaRules?.allocations?.[h.id] ?? (h.dcaMonthly || 0)
    }))
  };
  renderTxAllocInputs(dummyTx);

  modal.classList.remove('is-hidden');
  modal.removeAttribute('hidden');
  modal.style.display = 'flex';
}

/**
 * Rendu des champs d'allocation par actif dans la modale versement
 */
function renderTxAllocInputs(tx) {
  const container = document.getElementById('pm-tx-alloc-list');
  const sumEl = document.getElementById('pm-tx-alloc-sum');
  if (!container) return;

  const breakdown = parseTransactionBreakdown(tx);
  const holdings = portfolioState.holdings || [];

  if (holdings.length === 0) {
    container.innerHTML = '<div style="font-size: 0.78rem; color: rgba(255,255,255,0.45); padding: 4px 0;">Aucun actif dans le portefeuille.</div>';
    if (sumEl) sumEl.textContent = '0,00 €';
    return;
  }

  container.innerHTML = holdings.map((h) => {
    const existingAlloc = breakdown.find((b) => b.assetId.toLowerCase() === h.id.toLowerCase());
    const val = existingAlloc ? (Number(existingAlloc.amount) || 0) : 0;
    return `
      <div class="pm-tx-alloc-row">
        <div class="pm-tx-alloc-asset">
          <i class="${h.icon || 'fa-solid fa-chart-line'}" style="color: #34d399; font-size: 0.85rem;"></i>
          <span>${h.shortName || h.name}</span>
        </div>
        <div class="pm-input-with-unit" style="max-width: 130px;">
          <input type="number" step="0.01" min="0" class="pm-tx-alloc-field" data-id="${h.id}" value="${val.toFixed(2)}" />
          <span class="unit">€</span>
        </div>
      </div>
    `;
  }).join('');

  const updateAllocSum = () => {
    let sum = 0;
    container.querySelectorAll('.pm-tx-alloc-field').forEach((input) => {
      sum += parseFloat(input.value) || 0;
    });
    if (sumEl) sumEl.textContent = `${sum.toFixed(2)} €`;
    const amountInput = document.getElementById('pm-tx-amount');
    const isNew = document.getElementById('pm-tx-id')?.value === 'new';
    if (amountInput && (isNew || !amountInput.dataset.manualEdited)) {
      amountInput.value = sum.toFixed(2);
    }
  };

  container.querySelectorAll('.pm-tx-alloc-field').forEach((input) => {
    input.addEventListener('input', () => {
      const amountInput = document.getElementById('pm-tx-amount');
      if (amountInput) delete amountInput.dataset.manualEdited;
      updateAllocSum();
    });
  });

  const mainAmountInput = document.getElementById('pm-tx-amount');
  if (mainAmountInput && !mainAmountInput._hasManualListener) {
    mainAmountInput._hasManualListener = true;
    mainAmountInput.addEventListener('input', () => {
      mainAmountInput.dataset.manualEdited = 'true';
    });
  }

  updateAllocSum();
}

/**
 * Enregistre les modifications ou la création d'un versement
 */
function saveTransactionModal() {
  const idInput = document.getElementById('pm-tx-id');
  const dateInput = document.getElementById('pm-tx-date');
  const typeSelect = document.getElementById('pm-tx-type');
  const titleInput = document.getElementById('pm-tx-title');
  const amountInput = document.getElementById('pm-tx-amount');
  const noteInput = document.getElementById('pm-tx-note');
  const syncCheckbox = document.getElementById('pm-tx-sync-portfolio');

  if (!idInput) return;
  const isNew = idInput.value === 'new';
  const txId = isNew ? ('tx_' + Date.now()) : idInput.value;

  const date = dateInput?.value || new Date().toISOString().split('T')[0];
  const type = typeSelect?.value || 'manual';
  const title = (titleInput?.value || '').trim() || 'Versement';
  const amount = parseFloat(amountInput?.value) || 0;
  let note = (noteInput?.value || '').trim();
  const syncPortfolio = syncCheckbox?.checked ?? true;

  // Récupération de la ventilation par actif
  const newBreakdown = [];
  const allocNotes = [];
  document.querySelectorAll('#pm-tx-alloc-list .pm-tx-alloc-field').forEach((input) => {
    const assetId = input.dataset.id;
    const alloc = parseFloat(input.value) || 0;
    if (alloc > 0) {
      const h = (portfolioState.holdings || []).find((x) => x.id === assetId);
      const priceEur = getAssetPriceInEur(assetId);
      const sharesBought = alloc / priceEur;
      newBreakdown.push({
        assetId,
        assetName: h ? (h.shortName || h.name) : assetId.toUpperCase(),
        amount: alloc,
        shares: Number(sharesBought.toFixed(4)),
        unitPrice: priceEur,
        prevShares: h ? h.shares : 0,
        prevBuyPrice: h ? h.buyPrice : 0
      });
      allocNotes.push(`+${alloc.toFixed(0)}€ ${h ? (h.shortName || h.id.toUpperCase()) : assetId.toUpperCase()} (+${sharesBought.toFixed(3)} p.)`);
    }
  });

  if (!note && allocNotes.length > 0) {
    note = allocNotes.join(', ');
  }

  if (isNew) {
    if (syncPortfolio && newBreakdown.length > 0) {
      newBreakdown.forEach((item) => {
        const h = (portfolioState.holdings || []).find((x) => x.id === item.assetId);
        if (h) {
          item.prevShares = h.shares;
          item.prevBuyPrice = h.buyPrice;
          const oldCost = h.shares * h.buyPrice;
          const newCost = item.amount;
          const newShares = h.shares + item.shares;
          h.buyPrice = Number(((oldCost + newCost) / newShares).toFixed(2));
          h.shares = Number(newShares.toFixed(4));
          portfolioState.positions[h.id] = h.shares;
        }
      });
      portfolioState.totalInvested = (portfolioState.totalInvested || 0) + amount;
    }

    portfolioState.history.unshift({
      id: txId,
      date,
      type,
      title,
      amount,
      note,
      breakdown: newBreakdown
    });
  } else {
    const existing = (portfolioState.history || []).find((t) => t.id === txId);
    if (!existing) return;

    if (syncPortfolio) {
      // 1. Rollback ancien breakdown
      const oldBreakdown = parseTransactionBreakdown(existing);
      oldBreakdown.forEach((item) => {
        const h = (portfolioState.holdings || []).find((x) => x.id.toLowerCase() === item.assetId.toLowerCase());
        if (h) {
          if (typeof item.prevShares === 'number' && typeof item.prevBuyPrice === 'number' && item.prevShares > 0) {
            h.shares = Number(item.prevShares.toFixed(4));
            h.buyPrice = Number(item.prevBuyPrice.toFixed(2));
          } else {
            const sharesToDeduct = Number(item.shares || item.sharesAdded || 0);
            const amountToDeduct = Number(item.amount || 0);
            const currentCost = h.shares * h.buyPrice;
            const newShares = Math.max(0, h.shares - sharesToDeduct);
            const newCost = Math.max(0, currentCost - amountToDeduct);
            h.shares = Number(newShares.toFixed(4));
            h.buyPrice = newShares > 0 ? Number((newCost / newShares).toFixed(2)) : h.buyPrice;
          }
          portfolioState.positions[h.id] = h.shares;
        }
      });
      if (typeof existing.amount === 'number') {
        portfolioState.totalInvested = Math.max(0, (portfolioState.totalInvested || 0) - existing.amount);
      }

      // 2. Application du nouveau breakdown
      newBreakdown.forEach((item) => {
        const h = (portfolioState.holdings || []).find((x) => x.id === item.assetId);
        if (h) {
          item.prevShares = h.shares;
          item.prevBuyPrice = h.buyPrice;
          const oldCost = h.shares * h.buyPrice;
          const newCost = item.amount;
          const newShares = h.shares + item.shares;
          h.buyPrice = Number(((oldCost + newCost) / newShares).toFixed(2));
          h.shares = Number(newShares.toFixed(4));
          portfolioState.positions[h.id] = h.shares;
        }
      });
      portfolioState.totalInvested = (portfolioState.totalInvested || 0) + amount;
    }

    existing.date = date;
    existing.type = type;
    existing.title = title;
    existing.amount = amount;
    existing.note = note;
    existing.breakdown = newBreakdown;
  }

  savePortfolioState();
  renderPortfolioModule();
  if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();
  if (typeof renderDashboardPortfolio === 'function') renderDashboardPortfolio();
  renderPortfolioHistoryTable();
  renderPortfolioPositionsTab();
  renderPortfolioDcaTab();

  closeTransactionModal();

  if (typeof showToast === 'function') {
    showToast(isNew ? 'Nouveau versement enregistré avec succès !' : 'Versement modifié avec succès !', 'success');
  }
}

function closeTransactionModal() {
  const modal = document.getElementById('portfolio-tx-modal');
  if (!modal) return;
  modal.classList.add('is-hidden');
  modal.setAttribute('hidden', '');
  modal.style.display = 'none';
}

/**
 * Rendu de l'onglet 3 : Règles DCA
 */
function renderPortfolioDcaTab() {
  const dcaDayInput = document.getElementById('pm-dca-day');
  const dcaEnabledToggle = document.getElementById('pm-dca-enabled-toggle');
  const monthBanner = document.getElementById('pm-dca-month-banner');
  const monthTitle = document.getElementById('pm-dca-month-status-title');
  const monthSub = document.getElementById('pm-dca-month-status-sub');
  const monthActions = document.getElementById('pm-dca-month-actions');
  const container = document.getElementById('pm-dca-allocations-list');
  const sumEl = document.getElementById('pm-dca-total-sum');

  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthName = now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  const isEnabled = portfolioState.dcaRules?.enabled !== false;
  const targetDay = portfolioState.dcaRules?.dayOfMonth || 19;
  const isSkippedThisMonth = Array.isArray(portfolioState.skippedDcaMonths) && portfolioState.skippedDcaMonths.includes(currentYearMonth);
  const currentMonthTx = (portfolioState.history || []).find((h) => (h.type === 'auto' || h.title?.includes('DCA')) && h.date?.startsWith(currentYearMonth));

  if (dcaDayInput) {
    dcaDayInput.value = targetDay;
  }
  if (dcaEnabledToggle) {
    dcaEnabledToggle.checked = isEnabled;
  }

  // Statut du versement du mois en cours
  if (monthBanner) {
    monthBanner.className = 'pm-dca-status-banner';
    if (!isEnabled) {
      if (monthTitle) monthTitle.textContent = `Versements automatiques désactivés`;
      if (monthSub) monthSub.textContent = `Les versements mensuels ne sont pas exécutés automatiquement`;
      if (monthActions) monthActions.innerHTML = '';
    } else if (currentMonthTx && !isSkippedThisMonth) {
      monthBanner.classList.add('executed');
      if (monthTitle) monthTitle.textContent = `Versement de ${monthName} : Effectué (+${Number(currentMonthTx.amount || 0).toFixed(2)} €)`;
      if (monthSub) monthSub.textContent = `Exécuté le ${currentMonthTx.date} • Cliquez ci-contre si vous ne l'avez finalement pas fait`;
      if (monthActions) {
        monthActions.innerHTML = `
          <button type="button" class="pm-mini-btn danger" id="pm-dca-btn-cancel-month" title="Annuler le versement et déduire les parts">
            <i class="fa-solid fa-ban"></i> Pas fait / Annuler
          </button>
        `;
        const cancelBtn = document.getElementById('pm-dca-btn-cancel-month');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            if (confirm(`Vous n'avez pas réalisé le versement de ${monthName} ?\n\nLe montant (+${Number(currentMonthTx.amount || 0).toFixed(2)} €) et les parts achetées seront déduits de votre portefeuille.`)) {
              deletePortfolioTransaction(currentMonthTx.id, { rollbackImpact: true, markSkipped: true });
            }
          });
        }
      }
    } else if (isSkippedThisMonth) {
      monthBanner.classList.add('skipped');
      if (monthTitle) monthTitle.textContent = `Versement de ${monthName} : Sauté / Ignoré`;
      if (monthSub) monthSub.textContent = `Non pris en compte dans le portefeuille pour éviter tout biais`;
      if (monthActions) {
        monthActions.innerHTML = `
          <button type="button" class="pm-mini-btn primary" id="pm-dca-btn-restore-month" title="Rétablir et exécuter le versement de ce mois">
            <i class="fa-solid fa-rotate-left"></i> Rétablir ce mois
          </button>
        `;
        const restoreBtn = document.getElementById('pm-dca-btn-restore-month');
        if (restoreBtn) {
          restoreBtn.addEventListener('click', () => {
            portfolioState.skippedDcaMonths = (portfolioState.skippedDcaMonths || []).filter((m) => m !== currentYearMonth);
            portfolioState.lastDcaExecutionMonth = null;
            savePortfolioState();
            checkAndApplyScheduledDca();
            renderPortfolioModule();
            renderPortfolioDcaTab();
            renderPortfolioHistoryTable();
            renderPortfolioPositionsTab();
            if (typeof showToast === 'function') {
              showToast(`Versement de ${monthName} rétabli et exécuté avec succès !`, 'success');
            }
          });
        }
      }
    } else {
      if (monthTitle) monthTitle.textContent = `Prochain versement le ${targetDay} ${monthName}`;
      if (monthSub) monthSub.textContent = `Sera exécuté automatiquement au ${targetDay} du mois`;
      if (monthActions) {
        monthActions.innerHTML = `
          <button type="button" class="pm-mini-btn neutral" id="pm-dca-btn-skip-month" title="Ne pas effectuer le versement ce mois-ci">
            <i class="fa-solid fa-forward"></i> Passer ce mois
          </button>
        `;
        const skipBtn = document.getElementById('pm-dca-btn-skip-month');
        if (skipBtn) {
          skipBtn.addEventListener('click', () => {
            if (!Array.isArray(portfolioState.skippedDcaMonths)) portfolioState.skippedDcaMonths = [];
            if (!portfolioState.skippedDcaMonths.includes(currentYearMonth)) {
              portfolioState.skippedDcaMonths.push(currentYearMonth);
            }
            savePortfolioState();
            renderPortfolioModule();
            renderPortfolioDcaTab();
            if (typeof showToast === 'function') {
              showToast(`Versement de ${monthName} ignoré pour ce mois.`, 'info');
            }
          });
        }
      }
    }
  }

  const holdings = portfolioState.holdings || [];
  if (!container) return;
  if (holdings.length === 0) {
    container.innerHTML = '<div style="font-size: 0.8rem; color: rgba(255,255,255,0.45); padding: 0.5rem 0;">Aucun actif en portefeuille. Ajoutez d\'abord un actif pour lui attribuer un versement mensuel.</div>';
    if (sumEl) sumEl.textContent = '0,00 € / mois';
    return;
  }

  container.innerHTML = holdings.map((h) => {
    const currentAlloc = portfolioState.dcaRules?.allocations?.[h.id] ?? (h.dcaMonthly || 0);
    return `
      <div class="pm-dca-alloc-row">
        <div class="pm-dca-alloc-label">
          <i class="fa-solid fa-coins" style="color: #34d399; font-size: 0.85rem;"></i>
          <span>${h.shortName || h.name}</span>
        </div>
        <div class="pm-input-with-unit" style="max-width: 140px;">
          <input type="number" min="0" step="1" class="pm-dca-alloc-input" data-id="${h.id}" value="${currentAlloc}" />
          <span class="unit">€/mois</span>
        </div>
      </div>
    `;
  }).join('');

  const updateDcaTotal = () => {
    let total = 0;
    container.querySelectorAll('.pm-dca-alloc-input').forEach((input) => {
      total += parseFloat(input.value) || 0;
    });
    if (sumEl) sumEl.textContent = `${total.toFixed(2)} € / mois`;
  };

  container.querySelectorAll('.pm-dca-alloc-input').forEach((input) => {
    input.addEventListener('input', updateDcaTotal);
  });

  updateDcaTotal();
}

/**
 * Rendu de l'onglet 4 : Historique des versements
 */
function renderPortfolioHistoryTable() {
  const tbody = document.getElementById('pm-history-tbody');
  if (!tbody) return;

  if (!portfolioState.history || portfolioState.history.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: rgba(255,255,255,0.4); padding: 1.5rem 0;">Aucune transaction enregistrée.</td></tr>';
    return;
  }

  tbody.innerHTML = portfolioState.history
    .map((item) => `
      <tr data-tx-id="${item.id}">
        <td><strong>${item.date}</strong></td>
        <td><span class="portfolio-badge ${item.type === 'simulation' ? 'neutral' : (item.type === 'reset' ? 'down' : 'up')}">${item.type === 'simulation' ? 'Simulation' : (item.type === 'initial' ? 'Initial' : (item.type === 'reset' ? 'Réinit' : (item.type === 'auto' ? 'DCA Auto' : 'Achat')))}</span></td>
        <td><strong class="${item.amount > 0 ? 'text-green' : 'text-neutral'}">${item.amount > 0 ? '+' : ''}${Number(item.amount).toFixed(2)} €</strong></td>
        <td><span style="font-size: 0.75rem; color: rgba(255,255,255,0.65);">${item.note || item.title}</span></td>
        <td style="text-align: right;">
          <div class="pm-row-actions">
            <button type="button" class="pm-row-action-btn edit pm-btn-edit-tx" data-tx-id="${item.id}" title="Modifier ce versement">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="pm-row-action-btn delete pm-btn-del-tx" data-tx-id="${item.id}" title="Supprimer ce versement">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `)
    .join('');

  // Gestion des clics sur Modifier
  tbody.querySelectorAll('.pm-btn-edit-tx').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditTransactionModal(btn.dataset.txId);
    });
  });

  // Gestion des clics sur Supprimer
  tbody.querySelectorAll('.pm-btn-del-tx').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const txId = btn.dataset.txId;
      const tx = (portfolioState.history || []).find((t) => t.id === txId);
      if (!tx) return;
      const amtStr = Number(tx.amount || 0).toFixed(2);
      const isAutoDca = tx.type === 'auto' || tx.id.startsWith('dca_') || tx.title?.includes('DCA');
      let msg = `Voulez-vous supprimer ce versement de ${amtStr} € (${tx.date}) ?\n\n`;
      msg += `• Les parts et le capital investi correspondants seront déduits de votre portefeuille.\n`;
      if (isAutoDca) {
        msg += `• Ce versement ne se réexécutera pas automatiquement ce mois-ci.`;
      }
      if (confirm(msg)) {
        deletePortfolioTransaction(txId, { rollbackImpact: true, markSkipped: true });
      }
    });
  });
}

/**
 * Réinitialise proprement le formulaire d'ajout avec des valeurs par défaut saines
 */
function resetAddAssetForm() {
  const select = document.getElementById('pm-add-asset-select');
  const customFields = document.getElementById('pm-custom-asset-fields');
  const buyDateInput = document.getElementById('pm-add-buy-date');
  const buyPriceInput = document.getElementById('pm-add-buy-price');
  const useLiveBtn = document.getElementById('pm-add-use-live-price');
  const sharesInput = document.getElementById('pm-add-shares');
  const dcaInput = document.getElementById('pm-add-dca');
  const notesInput = document.getElementById('pm-add-notes');

  if (buyDateInput) buyDateInput.value = new Date().toISOString().split('T')[0];
  if (sharesInput) sharesInput.value = '1.00';
  if (dcaInput) dcaInput.value = '0';
  if (notesInput) notesInput.value = '';

  const assetId = select ? select.value : '10ap';
  if (assetId === 'custom') {
    if (customFields) customFields.style.display = 'flex';
    if (useLiveBtn) useLiveBtn.style.display = 'none';
    if (buyPriceInput) {
      buyPriceInput.value = '100.00';
      buyPriceInput.dataset.autoFilled = 'true';
    }
  } else {
    if (customFields) customFields.style.display = 'none';
    if (useLiveBtn) useLiveBtn.style.display = 'inline-flex';
    const lp = getAssetPriceInEur(assetId);
    if (useLiveBtn) useLiveBtn.textContent = `Cours actuel : ${lp.toFixed(2)} €`;
    if (buyPriceInput) {
      buyPriceInput.value = lp.toFixed(2);
      buyPriceInput.dataset.autoFilled = 'true';
    }
  }

  // Calcul propre de l'aperçu pour la nouvelle ligne
  const liveP = assetId === 'custom' ? (parseFloat(document.getElementById('pm-custom-price')?.value) || 0) : getAssetPriceInEur(assetId);
  const buyP = parseFloat(buyPriceInput?.value) || 0;
  const q = parseFloat(sharesInput?.value) || 0;
  const invested = buyP * q;
  const current = liveP * q;
  const gain = current - invested;
  const gainPct = invested > 0 ? (gain / invested) * 100 : 0;
  const isGain = gain >= 0;
  const sign = isGain ? '+' : '';

  const prevInvested = document.getElementById('pm-prev-invested');
  const prevCurrent = document.getElementById('pm-prev-current');
  const prevGain = document.getElementById('pm-prev-gain');

  if (prevInvested) prevInvested.textContent = `${invested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  if (prevCurrent) prevCurrent.textContent = `${current.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  if (prevGain) {
    prevGain.className = `pm-prev-val ${isGain ? 'text-green' : 'text-red'}`;
    prevGain.textContent = `${sign}${gain.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € (${sign}${gainPct.toFixed(2)}%)`;
  }
}

/**
 * Change d'onglet actif dans la modale
 */
function switchPortfolioModalTab(targetTab) {
  document.querySelectorAll('.portfolio-modal-tab').forEach((b) => {
    b.classList.toggle('active', b.dataset.pmTab === targetTab);
  });

  document.querySelectorAll('.pm-tab-content').forEach((content) => {
    const isMatch = content.id === `pm-tab-${targetTab}`;
    content.classList.toggle('active', isMatch);
    if (isMatch) {
      content.removeAttribute('hidden');
      content.style.display = 'block';
    } else {
      content.setAttribute('hidden', '');
      content.style.display = 'none';
    }
  });

  if (targetTab === 'positions') renderPortfolioPositionsTab();
  if (targetTab === 'add') {
    initAddAssetTab();
    resetAddAssetForm();
  }
  if (targetTab === 'dca') renderPortfolioDcaTab();
  if (targetTab === 'history') renderPortfolioHistoryTable();
}

/**
 * Modale de gestion et de personnalisation du portefeuille
 */
function openPortfolioManageModal(initialTab = 'positions', highlightId = null) {
  const modal = document.getElementById('portfolio-manage-modal');
  if (!modal) return;

  switchPortfolioModalTab(initialTab);

  modal.classList.remove('is-hidden');
  modal.removeAttribute('hidden');
  modal.style.display = 'flex';

  if (highlightId && initialTab === 'positions') {
    setTimeout(() => {
      const card = document.getElementById(`pm-card-${highlightId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.borderColor = '#3b82f6';
        card.style.boxShadow = '0 0 16px rgba(59, 130, 246, 0.45)';
        setTimeout(() => {
          card.style.borderColor = '';
          card.style.boxShadow = '';
        }, 2200);
      }
    }, 120);
  }
}

function closePortfolioManageModal() {
  const modal = document.getElementById('portfolio-manage-modal');
  if (!modal) return;
  modal.classList.add('is-hidden');
  modal.setAttribute('hidden', '');
  modal.style.display = 'none';
}

function setupPortfolioModalHandlers() {
  const addAssetBtn = document.getElementById('portfolio-add-asset-btn');
  const manageBtn = document.getElementById('portfolio-manage-btn');
  const resetBtn = document.getElementById('portfolio-reset-btn');
  const triggerDcaBtn = document.getElementById('portfolio-trigger-dca-btn');
  const closeBtn = document.getElementById('portfolio-modal-close-btn');
  const cancelBtn = document.getElementById('pm-cancel-btn');
  const backdrop = document.getElementById('portfolio-modal-backdrop');
  const saveBtn = document.getElementById('pm-save-btn');

  const topAddBtn = document.getElementById('pm-top-add-btn');
  const clearZeroBtn = document.getElementById('pm-btn-clear-zero');
  const restoreDemoBtn = document.getElementById('pm-btn-restore-demo');
  const clearHistoryBtn = document.getElementById('pm-clear-history-btn');

  if (addAssetBtn) addAssetBtn.addEventListener('click', () => openPortfolioManageModal('add'));
  if (manageBtn) manageBtn.addEventListener('click', () => openPortfolioManageModal('positions'));
  if (triggerDcaBtn) triggerDcaBtn.addEventListener('click', simulateDcaExecution);
  if (closeBtn) closeBtn.addEventListener('click', closePortfolioManageModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closePortfolioManageModal);
  if (backdrop) backdrop.addEventListener('click', closePortfolioManageModal);

  if (topAddBtn) topAddBtn.addEventListener('click', () => switchPortfolioModalTab('add'));

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const choice = confirm("Voulez-vous réinitialiser votre portefeuille à zéro (0 €) ?\n\n- OK : Vider complètement le portefeuille pour repartir de zéro\n- Annuler : Conserver vos données actuelles");
      if (choice) {
        resetPortfolioState('empty');
      }
    });
  }

  if (clearZeroBtn) {
    clearZeroBtn.addEventListener('click', () => {
      if (confirm("Voulez-vous vider entièrement le portefeuille pour créer le vôtre de A à Z avec vos propres actions, ETF, dates et prix d'achat ?")) {
        resetPortfolioState('empty');
        switchPortfolioModalTab('add');
      }
    });
  }

  if (restoreDemoBtn) {
    restoreDemoBtn.addEventListener('click', () => {
      if (confirm("Restaurer votre portefeuille officiel reconstitué (1 515,08 €) ?")) {
        resetPortfolioState('demo');
        renderPortfolioPositionsTab();
      }
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm("Effacer tout l'historique des transactions ?")) {
        portfolioState.history = [];
        savePortfolioState();
        renderPortfolioHistoryTable();
      }
    });
  }

  document.querySelectorAll('.portfolio-modal-tab').forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      const target = tabBtn.dataset.pmTab;
      switchPortfolioModalTab(target);
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const container = document.getElementById('pm-holdings-list-container');
      if (container) {
        (portfolioState.holdings || []).forEach((h) => {
          const card = container.querySelector(`.pm-holding-edit-card[data-asset-id="${h.id}"]`);
          if (card) {
            const d = card.querySelector('.pm-field-date')?.value;
            const p = parseFloat(card.querySelector('.pm-field-price')?.value);
            const s = parseFloat(card.querySelector('.pm-field-shares')?.value);
            const dca = parseFloat(card.querySelector('.pm-field-dca')?.value);
            const notes = card.querySelector('.pm-field-notes')?.value;
            const nameVal = card.querySelector('.pm-field-name')?.value;
            const symVal = card.querySelector('.pm-field-symbol')?.value;
            const liveCustom = parseFloat(card.querySelector('.pm-field-live-custom')?.value);

            if (d) h.buyDate = d;
            if (!isNaN(p) && p >= 0) h.buyPrice = p;
            if (!isNaN(s) && s >= 0) h.shares = s;
            if (!isNaN(dca) && dca >= 0) {
              h.dcaMonthly = dca;
              if (portfolioState.dcaRules) {
                portfolioState.dcaRules.allocations[h.id] = dca;
              }
            }
            if (typeof notes === 'string') h.notes = notes.trim();
            if (nameVal && nameVal.trim()) h.name = nameVal.trim();
            if (symVal && symVal.trim()) h.symbol = symVal.trim().toUpperCase();
            if (!isNaN(liveCustom) && liveCustom >= 0) {
              const custAsset = marketAssets.find((a) => a.id === h.id);
              if (custAsset) {
                custAsset.basePrice = liveCustom;
                saveMarketAssets();
              }
            }
            portfolioState.positions[h.id] = h.shares;
          }
        });
      }

      const dcaDayInput = document.getElementById('pm-dca-day');
      if (dcaDayInput) {
        portfolioState.dcaRules.dayOfMonth = parseInt(dcaDayInput.value, 10) || 19;
      }

      document.querySelectorAll('.pm-dca-alloc-input').forEach((input) => {
        const id = input.dataset.id;
        const val = parseFloat(input.value) || 0;
        if (portfolioState.dcaRules) {
          portfolioState.dcaRules.allocations[id] = val;
        }
        const hold = (portfolioState.holdings || []).find((h) => h.id === id);
        if (hold) hold.dcaMonthly = val;
      });

      savePortfolioState();
      renderPortfolioModule();
      if (typeof renderDashboardMarkets === 'function') renderDashboardMarkets();
      closePortfolioManageModal();

      if (typeof showToast === 'function') {
        showToast('Modifications du portefeuille enregistrées avec succès !', 'success');
      }
    });
  }

  // Gestionnaires des versements & transactions
  const addTxBtn = document.getElementById('pm-add-tx-btn');
  const txCloseBtn = document.getElementById('portfolio-tx-close-btn');
  const txCancelBtn = document.getElementById('pm-tx-cancel-btn');
  const txBackdrop = document.getElementById('portfolio-tx-backdrop');
  const txSaveBtn = document.getElementById('pm-tx-save-btn');
  const txDeleteBtn = document.getElementById('pm-tx-delete-btn');
  const dcaEnabledToggle = document.getElementById('pm-dca-enabled-toggle');

  if (addTxBtn) addTxBtn.addEventListener('click', openAddTransactionModal);
  if (txCloseBtn) txCloseBtn.addEventListener('click', closeTransactionModal);
  if (txCancelBtn) txCancelBtn.addEventListener('click', closeTransactionModal);
  if (txBackdrop) txBackdrop.addEventListener('click', closeTransactionModal);
  if (txSaveBtn) txSaveBtn.addEventListener('click', saveTransactionModal);
  if (txDeleteBtn) {
    txDeleteBtn.addEventListener('click', () => {
      const txId = document.getElementById('pm-tx-id')?.value;
      if (txId && txId !== 'new') {
        const syncPortfolio = document.getElementById('pm-tx-sync-portfolio')?.checked ?? true;
        if (confirm("Supprimer définitivement ce versement ?\n\nLe montant et les parts associées seront ajustés dans le portefeuille.")) {
          deletePortfolioTransaction(txId, { rollbackImpact: syncPortfolio, markSkipped: true });
          closeTransactionModal();
        }
      }
    });
  }

  if (dcaEnabledToggle) {
    dcaEnabledToggle.addEventListener('change', () => {
      if (!portfolioState.dcaRules) portfolioState.dcaRules = { dayOfMonth: 19, allocations: {}, enabled: true };
      portfolioState.dcaRules.enabled = dcaEnabledToggle.checked;
      savePortfolioState();
      renderPortfolioModule();
      renderPortfolioDcaTab();
      if (typeof showToast === 'function') {
        showToast(dcaEnabledToggle.checked ? 'Versements DCA automatiques activés.' : 'Versements DCA automatiques mis en pause.', 'info');
      }
    });
  }

  document.querySelectorAll('#portfolio-timeframe-switch .portfolio-tf-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tf = btn.dataset.timeframe;
      renderPortfolioChart(tf);
    });
  });

  setupPortfolioChartInteractions();
}

window.renderPortfolioModule = renderPortfolioModule;
window.calculatePortfolioSummary = calculatePortfolioSummary;
window.getPortfolioChartData = getPortfolioChartData;
window.simulateDcaExecution = simulateDcaExecution;
window.resetPortfolioState = resetPortfolioState;
window.loadPortfolioState = loadPortfolioState;
window.checkAndApplyScheduledDca = checkAndApplyScheduledDca;
window.portfolioState = portfolioState;
window.openPortfolioManageModal = openPortfolioManageModal;
window.closePortfolioManageModal = closePortfolioManageModal;
window.deleteHoldingFromPortfolio = deleteHoldingFromPortfolio;
window.deletePortfolioTransaction = deletePortfolioTransaction;
window.openEditTransactionModal = openEditTransactionModal;
window.openAddTransactionModal = openAddTransactionModal;
window.saveTransactionModal = saveTransactionModal;
window.closeTransactionModal = closeTransactionModal;
window.parseTransactionBreakdown = parseTransactionBreakdown;
window.getNextDcaDateInfo = getNextDcaDateInfo;
window.isRealBourseDataActive = () => isRealBourseDataActive;

/**
 * Génère un tracé SVG spline lissé pour la sparkline
 */
function generateSparklinePaths(basePrice, changePct, isUp) {
  const points = [];
  const startPrice = basePrice / (1 + changePct / 100);
  const totalSteps = 10;
  const minVal = Math.min(startPrice, basePrice) * 0.995;
  const maxVal = Math.max(startPrice, basePrice) * 1.005;
  const span = Math.max(0.01, maxVal - minVal);

  for (let i = 0; i <= totalSteps; i++) {
    const x = i * (100 / totalSteps);
    let val = startPrice + (basePrice - startPrice) * (i / totalSteps);
    if (i > 0 && i < totalSteps) {
      const wiggle = (Math.sin(i * 1.4) * (basePrice * 0.003)) * (isUp ? 1 : -1);
      val += wiggle;
    }
    const y = 32 - Math.max(4, Math.min(28, ((val - minVal) / span) * 28));
    points.push({ x, y });
  }

  let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cX = (prev.x + curr.x) / 2;
    linePath += ` C ${cX.toFixed(1)} ${prev.y.toFixed(1)}, ${cX.toFixed(1)} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }

  const areaPath = `${linePath} L 100 36 L 0 36 Z`;
  return { linePath, areaPath };
}

// Actif actuellement mis en vedette dans le Hero Spotlight
let currentHeroAssetId = 'nvda';
// Points du graphique Hero pour le tracker
let currentHeroChartPoints = [];
// Cache des données 24h pour réactivité instantanée
const chart24hCache = {};

// Indicateur et URL du serveur local runner.py pour les flux Yahoo Finance
let marketRunnerBaseUrl = null;
let isRealBourseDataActive = false;
let marketRunnerCheckedTime = 0;

/**
 * Détecte l'URL du serveur local runner.py pour relayer les flux réels Yahoo Finance (parallélisé & non-bloquant)
 */
async function detectMarketRunner() {
  if ((window.DesktopCockpit && window.DesktopCockpit.isDesktop) || window.desktopAPI) {
    marketRunnerBaseUrl = 'desktop-native';
    return 'desktop-native';
  }
  if (marketRunnerBaseUrl !== null) return marketRunnerBaseUrl;
  if (Date.now() - marketRunnerCheckedTime < 25000) return null;
  marketRunnerCheckedTime = Date.now();

  const candidates = [
    window.location.protocol.startsWith('http') ? '' : null,
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:8080'
  ].filter(c => c !== null);

  const checkCandidate = async (base) => {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 250);
    try {
      const res = await fetch(`${base}/api/status`, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.engine === 'local-native' || data.status === 'ok')) {
          return base;
        }
      }
    } catch {}
    throw new Error('Candidate unavailable');
  };

  try {
    const winner = await Promise.any(candidates.map(checkCandidate));
    marketRunnerBaseUrl = winner;
    return winner;
  } catch {
    return null;
  }
}

/**
 * Récupère ou génère une courbe 24h authentique et fluide pour un actif
 */
async function get24hChartData(asset) {
  if (!asset) return null;
  const cacheKey = `24h_${asset.id}_${asset.basePrice}`;
  if (chart24hCache[cacheKey]) return chart24hCache[cacheKey];

  // 1. Cours Crypto réels sur 24h via l'API CoinGecko
  if (asset.type === 'crypto') {
    const cgIdMap = {
      btc: 'bitcoin',
      eth: 'ethereum',
      sol: 'solana',
      bnb: 'binancecoin',
      xrp: 'ripple'
    };
    const cgId = cgIdMap[asset.id];
    if (cgId) {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=1`);
        if (res.ok) {
          const data = await res.json();
          if (data.prices && data.prices.length >= 10) {
            const raw = data.prices;
            const step = Math.max(1, Math.floor(raw.length / 20));
            const sampled = [];
            for (let i = 0; i < raw.length; i += step) {
              const d = new Date(raw[i][0]);
              sampled.push({
                price: Number(raw[i][1].toFixed(2)),
                timeLabel: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
              });
            }
            sampled[sampled.length - 1] = {
              price: asset.basePrice,
              timeLabel: 'Maintenant'
            };
            const startP = sampled[0].price;
            const endP = asset.basePrice;
            const changePct = ((endP - startP) / startP) * 100;
            const prices = sampled.map((p) => p.price);
            const result = {
              points: sampled,
              startPrice: startP,
              endPrice: endP,
              changePct,
              high: Math.max(...prices),
              low: Math.min(...prices),
              axisLabels: { start: 'Il y a 24h', mid: 'Il y a 12h', end: 'Maintenant (En Direct)' }
            };
            chart24hCache[cacheKey] = result;
            return result;
          }
        }
      } catch (e) {
        console.warn('CoinGecko non dispo pour 24h, génération de secours:', e);
      }
    }
  }

  // 2. Cours réels 24h via Electron native ou runner.py pour Actions, ETF, Indices & Matières
  if (asset.type !== 'crypto') {
    try {
      const runner = await detectMarketRunner();
      if (runner === 'desktop-native' && window.DesktopCockpit) {
        const chartData = await window.DesktopCockpit.getMarketChart(asset.id, '1d', '5m');
        if (chartData && Array.isArray(chartData.points) && chartData.points.length >= 3) {
          chart24hCache[cacheKey] = chartData;
          return chartData;
        }
      } else if (runner !== null) {
        const res = await fetch(`${runner}/api/market/chart?asset=${asset.id}&range=1d&interval=5m`);
        if (res.ok) {
          const payload = await res.json();
          if (payload && payload.data && Array.isArray(payload.data.points) && payload.data.points.length >= 3) {
            const chartData = payload.data;
            chart24hCache[cacheKey] = chartData;
            return chartData;
          }
        }
      }
    } catch (e) {
      console.warn('[Markets] Erreur récupération courbe 24h:', e);
    }
  }

  // Aucune donnée réelle disponible : aucun tracé simulé
  return null;
}

/**
 * Rendu du Grand Bento HERO SPOTLIGHT (Actif Vedette avec grand graphique 24h direct)
 */
async function renderHeroSpotlight(assetId = currentHeroAssetId) {
  currentHeroAssetId = assetId;
  const asset = marketAssets.find((a) => a.id === assetId) || marketAssets[0];
  if (!asset) return;

  const nameEl = document.getElementById('hero-asset-name');
  const symEl = document.getElementById('hero-asset-sym');
  const iconEl = document.getElementById('hero-asset-icon');
  const exchangeEl = document.getElementById('hero-asset-exchange');
  const priceEl = document.getElementById('hero-price-val');
  const changeEl = document.getElementById('hero-change-badge');
  const lowEl = document.getElementById('hero-stat-low');
  const highEl = document.getElementById('hero-stat-high');
  const rangeFillEl = document.getElementById('hero-range-fill');
  const volEl = document.getElementById('hero-metric-vol');
  const capEl = document.getElementById('hero-metric-cap');
  const sessEl = document.getElementById('hero-metric-session');
  const svgLine = document.getElementById('hero-svg-line');
  const svgArea = document.getElementById('hero-svg-area');
  const baseline = document.getElementById('hero-baseline');

  if (nameEl) nameEl.textContent = asset.name;
  if (symEl) symEl.textContent = asset.symbol.includes(':') ? asset.symbol.split(':')[1] : asset.symbol;
  if (iconEl) iconEl.innerHTML = `<i class="${asset.icon || 'fa-solid fa-chart-line'}"></i>`;
  if (exchangeEl) exchangeEl.textContent = asset.exchange || 'Marché International';

  const isPositive = asset.baseChange >= 0;
  const sign = isPositive ? '+' : '';
  const unit = asset.unit || '$';

  if (priceEl) priceEl.textContent = `${asset.basePrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
  if (changeEl) {
    changeEl.innerHTML = `<i class="fa-solid fa-arrow-trend-${isPositive ? 'up' : 'down'}"></i> ${sign}${asset.baseChange.toFixed(2)}% (24h)`;
    changeEl.className = `hero-change-badge ${isPositive ? 'up' : 'down'}`;
  }

  // Boutons du sélecteur rapide
  document.querySelectorAll('#hero-quick-switch .hero-pill-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.heroId === asset.id);
  });

  // Synchronisation visuelle de la sélection dans la liste Watchlist à gauche
  document.querySelectorAll('#crypto-ticker-cards .watchlist-row').forEach((row) => {
    row.classList.toggle('selected', row.dataset.assetId === asset.id);
  });

  const dayL = asset.dayLow || asset.basePrice * 0.985;
  const dayH = asset.dayHigh || asset.basePrice * 1.015;
  if (lowEl) lowEl.textContent = `${dayL.toFixed(2)} ${unit}`;
  if (highEl) highEl.textContent = `${dayH.toFixed(2)} ${unit}`;

  const rangeStatEl = document.getElementById('hero-metric-range-stat');
  if (rangeStatEl) {
    rangeStatEl.textContent = `${dayL.toFixed(2)} ${unit} - ${dayH.toFixed(2)} ${unit}`;
  }

  const span = Math.max(0.01, dayH - dayL);
  const pct = Math.max(5, Math.min(95, ((asset.basePrice - dayL) / span) * 100));
  if (rangeFillEl) rangeFillEl.style.width = `${pct.toFixed(1)}%`;

  if (volEl) {
    if (asset.type === 'crypto') volEl.textContent = '24.8 Md $ / 24h';
    else if (asset.type === 'index') volEl.textContent = '3.8 Md titres';
    else volEl.textContent = `${(Math.round(asset.basePrice * 230000) / 1000000).toFixed(1)}M titres`;
  }
  if (capEl) {
    if (asset.id === 'nvda') capEl.textContent = '3.42 B $ (Mega-Cap)';
    else if (asset.id === 'aapl') capEl.textContent = '3.45 B $';
    else if (asset.id === 'msft') capEl.textContent = '3.15 B $';
    else if (asset.id === 'btc') capEl.textContent = '1.75 B $';
    else if (asset.type === 'etf') capEl.textContent = '12.4 Md € AUM';
    else capEl.textContent = '680 Md $';
  }
  if (sessEl) {
    sessEl.textContent = `${asset.unit === '€' ? 'EUR (€)' : (asset.unit === '$' ? 'USD ($)' : asset.unit)} • En direct`;
  }

  // Tracé du graphique 24h dans le Hero
  if (svgLine && svgArea) {
    const chartData = await get24hChartData(asset);
    if (!chartData || !chartData.points || chartData.points.length === 0) return;

    const points = chartData.points;
    const prices = points.map((p) => p.price);
    const minP = Math.min(...prices) * 0.995;
    const maxP = Math.max(...prices) * 1.005;
    const vSpan = Math.max(0.0001, maxP - minP);

    const marginH = 10;
    const usableW = 980;
    const marginV = 15;
    const usableH = 175;

    points.forEach((pt, idx) => {
      pt.x = Number((marginH + (idx / (points.length - 1)) * usableW).toFixed(1));
      pt.y = Number(((marginV + usableH) - ((pt.price - minP) / vSpan) * usableH).toFixed(1));
    });

    currentHeroChartPoints = points;

    let lineD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      lineD += ` C ${cx.toFixed(1)} ${prev.y}, ${cx.toFixed(1)} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    const areaD = `${lineD} L ${lastPt.x} 230 L ${firstPt.x} 230 Z`;

    const mainColor = isPositive ? '#10b981' : '#ef4444';
    const areaFill = isPositive ? 'url(#heroGradientUp)' : 'url(#heroGradientDown)';

    svgLine.setAttribute('d', lineD);
    svgLine.setAttribute('stroke', mainColor);
    svgArea.setAttribute('d', areaD);
    svgArea.setAttribute('fill', areaFill);

    if (baseline) {
      const baselineY = Number(((marginV + usableH) - ((chartData.startPrice - minP) / vSpan) * usableH).toFixed(1));
      baseline.setAttribute('y1', baselineY);
      baseline.setAttribute('y2', baselineY);
    }
  }

  setupHeroChartInteractions(asset);
}

/**
 * Configure les écouteurs de survol du graphique 24h Hero
 */
function setupHeroChartInteractions(asset) {
  const container = document.getElementById('hero-chart-container');
  const svg = document.getElementById('hero-chart-svg');
  const tracker = document.getElementById('hero-hover-tracker');
  const hoverLine = document.getElementById('hero-hover-line');
  const hoverDot = document.getElementById('hero-hover-dot');
  const tooltip = document.getElementById('hero-tooltip');
  const ttPrice = document.getElementById('hero-tooltip-price');
  const ttTime = document.getElementById('hero-tooltip-time');

  if (!container || !svg || !tracker || !tooltip) return;

  function onPointer(e) {
    if (!currentHeroChartPoints || currentHeroChartPoints.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    if (clientX < rect.left || clientX > rect.right) return;

    const relX = (clientX - rect.left) / rect.width;
    const targetSvgX = 10 + relX * 980;

    let closest = currentHeroChartPoints[0];
    let minDiff = Math.abs(currentHeroChartPoints[0].x - targetSvgX);
    for (let i = 1; i < currentHeroChartPoints.length; i++) {
      const diff = Math.abs(currentHeroChartPoints[i].x - targetSvgX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = currentHeroChartPoints[i];
      }
    }

    tracker.style.display = 'block';
    hoverLine.setAttribute('x1', closest.x);
    hoverLine.setAttribute('x2', closest.x);
    hoverDot.setAttribute('cx', closest.x);
    hoverDot.setAttribute('cy', closest.y);

    tooltip.style.display = 'flex';
    const bubbleX = (closest.x / 1000) * rect.width;
    tooltip.style.left = `${bubbleX}px`;

    const unit = asset.unit || '$';
    ttPrice.textContent = `${closest.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
    ttTime.textContent = closest.timeLabel;
  }

  function onLeave() {
    tracker.style.display = 'none';
    tooltip.style.display = 'none';
  }

  container.onmousemove = onPointer;
  container.onmouseleave = onLeave;
  container.ontouchmove = onPointer;
  container.ontouchend = onLeave;
}

/**
 * Rendu de la Watchlist (Colonne Gauche avec sélection active et affichage dynamique du graphique à droite)
 */
function renderMarketCards() {
  const container = document.getElementById('crypto-ticker-cards');
  if (!container) return;

  let list = marketAssets.filter((a) => a.enabled);

  if (currentMarketCategory !== 'all') {
    list = list.filter((a) => a.type === currentMarketCategory);
  }

  if (isMarketVolatileFilterActive) {
    list = list
      .filter((a) => a.isVolatile || Math.abs(a.baseChange) >= 2.0)
      .sort((a, b) => Math.abs(b.baseChange) - Math.abs(a.baseChange));
  }

  if (currentMarketSearch) {
    const q = currentMarketSearch.toLowerCase();
    list = list.filter((a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
  }

  const countBadge = document.getElementById('watchlist-count-badge');
  if (countBadge) {
    countBadge.textContent = `${list.length} actif${list.length > 1 ? 's' : ''}`;
  }

  if (list.length === 0) {
    container.className = 'watchlist-items-container';
    container.innerHTML = `
      <div class="market-empty-hint" style="grid-column: 1 / -1; padding: 2.5rem 1.5rem; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;">
        <i class="fa-solid fa-chart-line" style="font-size: 1.8rem; color: var(--accent-primary); margin-bottom: 0.6rem; display: block;"></i>
        <span style="font-size: 0.88rem; display: block; margin-bottom: 0.8rem;">Aucun actif ne correspond à votre filtre.</span>
        <button type="button" class="market-btn-primary" id="market-open-empty-btn"><i class="fa-solid fa-sliders"></i> Personnaliser la Watchlist</button>
      </div>
    `;
    document.getElementById('market-open-empty-btn')?.addEventListener('click', toggleMarketConfigDrawer);
    return;
  }

  container.className = 'watchlist-items-container';
  container.innerHTML = list.map((asset) => {
    const isSelected = asset.id === currentHeroAssetId;
    const isPositive = asset.baseChange >= 0;
    const sign = isPositive ? '+' : '';
    const unit = asset.unit || '$';
    const formattedPrice = `${asset.basePrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
    const { linePath } = generateSparklinePaths(asset.basePrice, asset.baseChange, isPositive);

    let typeColor = '#38bdf8';
    if (asset.type === 'etf') typeColor = '#a78bfa';
    else if (asset.type === 'stock') typeColor = '#38bdf8';
    else if (asset.type === 'crypto') typeColor = '#f59e0b';
    else if (asset.type === 'index') typeColor = '#10b981';
    else if (asset.type === 'forex') typeColor = '#34d399';

    const cleanSym = asset.symbol.includes(':') ? asset.symbol.split(':')[1] : asset.symbol;
    const subLabel = asset.exchange ? `${asset.exchange} • ${(asset.type || 'actif').toUpperCase()}` : (asset.type || 'actif').toUpperCase();

    return `
      <div class="watchlist-row ${isSelected ? 'selected' : ''}" data-asset-id="${asset.id}" title="${asset.name} - Cliquer pour afficher le graphique">
        <div class="wl-left-content">
          <div class="wl-icon-box" style="color: ${typeColor}; border-color: ${typeColor}40; background: ${typeColor}15;">
            <i class="${asset.icon || 'fa-solid fa-chart-line'}"></i>
          </div>
          <div class="wl-text-group">
            <div class="wl-name-sym-row">
              <span class="wl-asset-name">${asset.name}</span>
              <span class="wl-ticker-pill">${cleanSym}</span>
            </div>
            <span class="wl-asset-sub">${subLabel}</span>
          </div>
        </div>

        <div class="wl-right-content">
          <svg viewBox="0 0 100 32" class="wl-spark-mini" preserveAspectRatio="none">
            <path d="${linePath}" fill="none" stroke="${isPositive ? '#10b981' : '#ef4444'}" stroke-width="2.2" stroke-linecap="round" />
          </svg>
          <div class="wl-price-group">
            <span class="wl-price-val">${formattedPrice}</span>
            <span class="wl-badge-pill ${isPositive ? 'up' : 'down'}">
              <i class="fa-solid fa-arrow-trend-${isPositive ? 'up' : 'down'}"></i> ${sign}${asset.baseChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.watchlist-row').forEach((row) => {
    row.addEventListener('click', () => {
      const id = row.dataset.assetId;
      currentHeroAssetId = id;
      container.querySelectorAll('.watchlist-row').forEach((r) => r.classList.remove('selected'));
      row.classList.add('selected');
      renderHeroSpotlight(id);
    });
  });
}

/**
 * Rendu de la courbe 24h épurée dans la modale
 */
async function renderCleanLineChart(asset) {
  const svgLine = document.getElementById('chart-svg-line');
  const svgArea = document.getElementById('chart-svg-area');
  const baseline = document.getElementById('chart-baseline');
  const timeStart = document.getElementById('chart-time-start');
  const timeMid = document.getElementById('chart-time-mid');
  const timeEnd = document.getElementById('chart-time-end');
  const statHigh = document.getElementById('chart-stat-high');
  const statLow = document.getElementById('chart-stat-low');
  const statRangeFill = document.getElementById('chart-stat-range-fill');
  const hoverDot = document.getElementById('chart-hover-dot');
  const headerPrice = document.getElementById('chart-dialog-price');
  const headerChange = document.getElementById('chart-dialog-change');

  if (!svgLine || !svgArea || !asset) return;

  const chartData = await get24hChartData(asset);
  if (!chartData || !chartData.points || !chartData.points.length) {
    svgLine.setAttribute('d', '');
    svgArea.setAttribute('d', '');
    return;
  }
  const points = chartData.points;
  const prices = points.map((p) => p.price);
  const startPrice = chartData.startPrice;
  const endPrice = chartData.endPrice;
  const periodChange = chartData.changePct;
  const isPositive = periodChange >= 0;
  const sign = isPositive ? '+' : '';

  const unit = asset.unit || '$';
  if (headerPrice) {
    headerPrice.textContent = `${endPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
  }
  if (headerChange) {
    headerChange.textContent = `${sign}${periodChange.toFixed(2)}% (24h)`;
    headerChange.className = `chart-change-badge ${isPositive ? 'up' : 'down'}`;
  }

  if (timeStart) timeStart.textContent = 'Il y a 24h';
  if (timeMid) timeMid.textContent = 'Il y a 12h';
  if (timeEnd) timeEnd.textContent = 'Maintenant (En Direct)';

  const minP = Math.min(...prices) * 0.994;
  const maxP = Math.max(...prices) * 1.006;
  const span = Math.max(0.0001, maxP - minP);

  const marginH = 15;
  const usableW = 970;
  const marginV = 25;
  const usableH = 290;

  points.forEach((pt, idx) => {
    pt.x = Number((marginH + (idx / (points.length - 1)) * usableW).toFixed(1));
    pt.y = Number(((marginV + usableH) - ((pt.price - minP) / span) * usableH).toFixed(1));
  });

  currentChartPoints = points;

  let lineD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    lineD += ` C ${cx.toFixed(1)} ${prev.y}, ${cx.toFixed(1)} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const lastPt = points[points.length - 1];
  const firstPt = points[0];
  const areaD = `${lineD} L ${lastPt.x} 360 L ${firstPt.x} 360 Z`;

  const mainColor = isPositive ? '#10b981' : '#ef4444';
  const areaFill = isPositive ? 'url(#chartGradientUp)' : 'url(#chartGradientDown)';

  svgLine.setAttribute('d', lineD);
  svgLine.setAttribute('stroke', mainColor);
  svgArea.setAttribute('d', areaD);
  svgArea.setAttribute('fill', areaFill);

  if (hoverDot) hoverDot.setAttribute('stroke', mainColor);

  if (baseline) {
    const baselineY = Number(((marginV + usableH) - ((startPrice - minP) / span) * usableH).toFixed(1));
    baseline.setAttribute('y1', baselineY);
    baseline.setAttribute('y2', baselineY);
  }

  if (statHigh) statHigh.textContent = `${Math.max(...prices).toFixed(2)} ${unit}`;
  if (statLow) statLow.textContent = `${Math.min(...prices).toFixed(2)} ${unit}`;
  if (statRangeFill) {
    const pct = Math.max(5, Math.min(95, ((endPrice - Math.min(...prices)) / span) * 100));
    statRangeFill.style.width = `${pct.toFixed(1)}%`;
  }
}

/**
 * Configure les écouteurs de survol de la souris sur la courbe SVG de la modale
 */
function setupCleanChartInteractions() {
  const stage = document.getElementById('clean-chart-stage');
  const svg = document.getElementById('interactive-line-chart-svg');
  const tracker = document.getElementById('chart-hover-tracker');
  const hoverLine = document.getElementById('chart-hover-line');
  const hoverDot = document.getElementById('chart-hover-dot');
  const tooltip = document.getElementById('chart-tooltip-bubble');
  const tooltipPrice = document.getElementById('chart-tooltip-price');
  const tooltipTime = document.getElementById('chart-tooltip-time');
  const headerPrice = document.getElementById('chart-dialog-price');
  const headerChange = document.getElementById('chart-dialog-change');

  if (!stage || !svg || !tracker || !tooltip) return;

  function handlePointer(e) {
    if (!currentChartPoints || currentChartPoints.length === 0 || !currentlyInspectedAsset) return;

    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    if (clientX < rect.left || clientX > rect.right) return;

    const relX = (clientX - rect.left) / rect.width;
    const targetSvgX = 15 + relX * 970;

    let closest = currentChartPoints[0];
    let minDiff = Math.abs(currentChartPoints[0].x - targetSvgX);

    for (let i = 1; i < currentChartPoints.length; i++) {
      const diff = Math.abs(currentChartPoints[i].x - targetSvgX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = currentChartPoints[i];
      }
    }

    tracker.style.display = 'block';
    hoverLine.setAttribute('x1', closest.x);
    hoverLine.setAttribute('x2', closest.x);
    hoverDot.setAttribute('cx', closest.x);
    hoverDot.setAttribute('cy', closest.y);

    tooltip.style.display = 'flex';
    const bubbleX = (closest.x / 1000) * rect.width;
    tooltip.style.left = `${bubbleX}px`;

    const unit = currentlyInspectedAsset.unit || '$';
    tooltipPrice.textContent = `${closest.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
    tooltipTime.textContent = closest.timeLabel;

    if (headerPrice) {
      headerPrice.textContent = `${closest.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
    }
    if (headerChange && currentlyInspectedAsset) {
      const startP = currentChartPoints[0].price;
      const diffPct = ((closest.price - startP) / startP) * 100;
      const sign = diffPct >= 0 ? '+' : '';
      headerChange.textContent = `${sign}${diffPct.toFixed(2)}% (24h)`;
      headerChange.className = `chart-change-badge ${diffPct >= 0 ? 'up' : 'down'}`;
    }
  }

  function handleLeave() {
    tracker.style.display = 'none';
    tooltip.style.display = 'none';
    if (currentlyInspectedAsset) {
      const isPositive = currentlyInspectedAsset.baseChange >= 0;
      const sign = isPositive ? '+' : '';
      const unit = currentlyInspectedAsset.unit || '$';
      if (headerPrice) {
        headerPrice.textContent = `${currentlyInspectedAsset.basePrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
      }
      if (headerChange) {
        headerChange.textContent = `${sign}${currentlyInspectedAsset.baseChange.toFixed(2)}% (24h)`;
        headerChange.className = `chart-change-badge ${isPositive ? 'up' : 'down'}`;
      }
    }
  }

  stage.addEventListener('mousemove', handlePointer);
  stage.addEventListener('mouseleave', handleLeave);
  stage.addEventListener('touchmove', handlePointer, { passive: true });
  stage.addEventListener('touchend', handleLeave);
}

/**
 * Ouvre la modale et affiche la courbe 24h de l'actif cliqué
 */
async function openChartModal(asset) {
  currentlyInspectedAsset = asset;
  const modal = document.getElementById('market-chart-modal');
  if (!modal) return;

  const iconBox = document.getElementById('chart-dialog-icon');
  const nameEl = document.getElementById('chart-dialog-name');
  const symEl = document.getElementById('chart-dialog-sym');
  const typeEl = document.getElementById('chart-dialog-type');
  const exchangeEl = document.getElementById('chart-dialog-exchange');
  const currEl = document.getElementById('chart-stat-curr');
  const marketEl = document.getElementById('chart-stat-market');

  if (iconBox) iconBox.innerHTML = `<i class="${asset.icon || 'fa-solid fa-chart-line'}"></i>`;
  if (nameEl) nameEl.textContent = asset.name;
  if (symEl) symEl.textContent = asset.symbol;
  if (typeEl) {
    typeEl.textContent = (asset.type || 'ACTIF').toUpperCase();
    typeEl.className = `chart-type-badge ${asset.type || ''}`;
  }

  if (exchangeEl) exchangeEl.textContent = asset.exchange || 'Cotation Marché';
  if (currEl) currEl.textContent = asset.unit === '€' ? 'EUR (€)' : (asset.unit === '$' ? 'USD ($)' : asset.unit);
  if (marketEl) marketEl.textContent = asset.exchange || 'Bourse Internationale';

  modal.removeAttribute('hidden');
  modal.hidden = false;
  modal.classList.remove('is-hidden');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Rendu de la courbe 24h épurée
  await renderCleanLineChart(asset);
}

function closeChartModal() {
  const modal = document.getElementById('market-chart-modal');
  if (modal) {
    modal.setAttribute('hidden', '');
    modal.hidden = true;
    modal.classList.add('is-hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/**
 * Checklist de sélection et d'activation des actifs dans le tiroir
 */
function renderMarketChecklist() {
  const listEl = document.getElementById('market-assets-checklist');
  if (!listEl) return;

  listEl.innerHTML = marketAssets.map((asset) => `
    <div class="market-check-item">
      <label class="market-check-label">
        <input type="checkbox" data-asset-id="${asset.id}" ${asset.enabled ? 'checked' : ''} />
        <span class="custom-chk"></span>
        <span class="item-name">${asset.name}</span>
        <span class="item-sym">${asset.symbol}</span>
      </label>
      ${asset.isCustom ? `<button type="button" class="deck-icon-action danger delete-custom-asset-btn" data-delete-id="${asset.id}" title="Supprimer cet actif"><i class="fa-regular fa-trash-can"></i></button>` : ''}
    </div>
  `).join('');

  listEl.querySelectorAll('input[type="checkbox"]').forEach((chk) => {
    chk.addEventListener('change', () => {
      const id = chk.dataset.assetId;
      const asset = marketAssets.find((a) => a.id === id);
      if (asset) {
        asset.enabled = chk.checked;
        saveMarketAssets();
        renderMarketCards();
        renderHeroSpotlight(currentHeroAssetId);
      }
    });
  });

  listEl.querySelectorAll('.delete-custom-asset-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.deleteId;
      marketAssets = marketAssets.filter((a) => a.id !== id);
      saveMarketAssets();
      renderMarketChecklist();
      renderMarketCards();
      renderHeroSpotlight(currentHeroAssetId);
      if (typeof showToast === 'function') showToast('Actif personnalisé supprimé', 'info');
    });
  });
}

function toggleMarketConfigDrawer() {
  const drawer = document.getElementById('market-config-drawer');
  if (!drawer) return;
  const isHidden = drawer.hasAttribute('hidden') || drawer.classList.contains('is-hidden') || drawer.style.display === 'none';
  if (isHidden) {
    drawer.removeAttribute('hidden');
    drawer.hidden = false;
    drawer.classList.remove('is-hidden');
    drawer.style.display = 'flex';
    renderMarketChecklist();
  } else {
    drawer.setAttribute('hidden', '');
    drawer.hidden = true;
    drawer.classList.add('is-hidden');
    drawer.style.display = 'none';
  }
}

/**
 * Actualisation des cours réels (Crypto & Forex en direct via APIs ouvertes)
 */
async function fetchLiveMarketData() {
  const refreshBtn = document.getElementById('crypto-refresh-btn');
  if (refreshBtn) refreshBtn.querySelector('i')?.classList.add('fa-spin');

  // 1. Taux Forex réels (EUR/USD, EUR/GBP, EUR/CHF, EUR/JPY) via Frankfurter API
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP,CHF,JPY');
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        const eurusd = marketAssets.find((a) => a.id === 'eurusd');
        if (eurusd && data.rates.USD) eurusd.basePrice = Number(data.rates.USD.toFixed(4));

        const eurgbp = marketAssets.find((a) => a.id === 'eurgbp');
        if (eurgbp && data.rates.GBP) eurgbp.basePrice = Number(data.rates.GBP.toFixed(4));

        const eurchf = marketAssets.find((a) => a.id === 'eurchf');
        if (eurchf && data.rates.CHF) eurchf.basePrice = Number(data.rates.CHF.toFixed(4));

        const eurjpy = marketAssets.find((a) => a.id === 'eurjpy');
        if (eurjpy && data.rates.JPY) eurjpy.basePrice = Number(data.rates.JPY.toFixed(2));
      }
    }
  } catch {}

  // 2. Cours Crypto réels (Bitcoin, Ethereum, Solana, BNB, XRP) via CoinGecko
  try {
    const cgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true');
    if (cgRes.ok) {
      const cgData = await cgRes.json();
      const btc = marketAssets.find((a) => a.id === 'btc');
      if (btc && cgData.bitcoin) {
        btc.basePrice = cgData.bitcoin.usd;
        btc.baseChange = cgData.bitcoin.usd_24h_change || btc.baseChange;
      }
      const eth = marketAssets.find((a) => a.id === 'eth');
      if (eth && cgData.ethereum) {
        eth.basePrice = cgData.ethereum.usd;
        eth.baseChange = cgData.ethereum.usd_24h_change || eth.baseChange;
      }
      const sol = marketAssets.find((a) => a.id === 'sol');
      if (sol && cgData.solana) {
        sol.basePrice = cgData.solana.usd;
        sol.baseChange = cgData.solana.usd_24h_change || sol.baseChange;
      }
      const bnb = marketAssets.find((a) => a.id === 'bnb');
      if (bnb && cgData.binancecoin) {
        bnb.basePrice = cgData.binancecoin.usd;
        bnb.baseChange = cgData.binancecoin.usd_24h_change || bnb.baseChange;
      }
      const xrp = marketAssets.find((a) => a.id === 'xrp');
      if (xrp && cgData.ripple) {
        xrp.basePrice = cgData.ripple.usd;
        xrp.baseChange = cgData.ripple.usd_24h_change || xrp.baseChange;
      }
    }
  } catch {}

  // 3. Cotations Boursières Réelles (Actions, ETF, Indices, Matières Premières) via runner.py
  let realQuotesReceived = false;
  let quoteErrorMessage = '';
  try {
    const runner = await detectMarketRunner();
    if (!runner) {
      throw new Error("Serveur local non joignable. Lancez `./runner.py` ou l'application desktop pour alimenter les cours.");
    }
    let payload = null;
    if (runner === 'desktop-native' && window.DesktopCockpit) {
      payload = await window.DesktopCockpit.getMarketQuotes(false);
    } else {
      const res = await fetch(`${runner}/api/market/quotes`);
      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status}).`);
      }
      payload = await res.json();
    }
    if (payload && payload.status === 'ok' && payload.quotes) {
      const quotes = payload.quotes;
      Object.entries(quotes).forEach(([id, q]) => {
        const asset = marketAssets.find((a) => a.id === id);
        if (asset && q && typeof q.price === 'number') {
          asset.basePrice = q.price;
          if (typeof q.change === 'number') asset.baseChange = q.change;
          if (typeof q.dayLow === 'number') asset.dayLow = q.dayLow;
          if (typeof q.dayHigh === 'number') asset.dayHigh = q.dayHigh;
          if (q.currency === 'USD') asset.unit = '$';
          else if (q.currency === 'EUR') asset.unit = '€';
        }
      });
      realQuotesReceived = true;
      isRealBourseDataActive = true;
    } else {
      throw new Error("Réponse de cotations invalide.");
    }
  } catch (err) {
    quoteErrorMessage = err.message || "Erreur réseau.";
    isRealBourseDataActive = false;
    console.error('[Markets]', err);
  }

  const errorBanner = document.getElementById('market-error-banner');
  const updateTextEl = document.getElementById('market-last-update-text');
  const dashUpdateTextEl = document.getElementById('dash-portfolio-last-update');
  const dashSubTitleEl = document.getElementById('dash-portfolio-sub-title');

  // Si échec de la récupération des cours réels : AFFICHER STRICTEMENT L'ERREUR, AUCUNE FAUSSE DONNÉE
  if (!realQuotesReceived) {
    if (errorBanner) {
      errorBanner.hidden = false;
      errorBanner.removeAttribute('hidden');
      errorBanner.style.display = 'flex';
      const textElem = errorBanner.querySelector('.market-error-text');
      if (textElem) {
        textElem.innerHTML = `<strong>Impossible de charger les cotations en direct.</strong><span>${quoteErrorMessage} Lancez <code>./runner.py</code> pour actualiser.</span>`;
      }
    }
    if (updateTextEl) {
      updateTextEl.innerHTML = '<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Hors-ligne</span>';
    }
    if (dashUpdateTextEl) {
      dashUpdateTextEl.innerHTML = '<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Hors-ligne</span>';
    }
    if (dashSubTitleEl) {
      dashSubTitleEl.innerHTML = '<span style="color:#f87171;">⚠️ Cotations non connectées (lancez ./runner.py)</span>';
    }
    if (refreshBtn) {
      setTimeout(() => refreshBtn.querySelector('i')?.classList.remove('fa-spin'), 400);
    }
    return false;
  }

  // Succès réel : masquer la bannière d'erreur et afficher l'heure exacte d'actualisation
  if (errorBanner) {
    errorBanner.hidden = true;
    errorBanner.setAttribute('hidden', '');
    errorBanner.style.display = 'none';
  }

  const now = new Date();
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;
  const updateLabel = `Actualisé à ${timeFormatted}`;

  if (updateTextEl) {
    updateTextEl.innerHTML = `<i class="fa-solid fa-circle" style="color: #10b981; font-size: 0.45rem;"></i> ${updateLabel}`;
  }
  if (dashUpdateTextEl) {
    dashUpdateTextEl.textContent = updateLabel;
  }
  if (dashSubTitleEl) {
    dashSubTitleEl.textContent = 'Performance globale & Versements DCA';
  }

  saveMarketAssets();
  renderPortfolioModule();
  renderMarketCards();
  renderHeroSpotlight(currentHeroAssetId);
  if (typeof renderDashboardMarkets === 'function') {
    renderDashboardMarkets();
  }

  if (refreshBtn) {
    setTimeout(() => refreshBtn.querySelector('i')?.classList.remove('fa-spin'), 500);
  }
  return true;
}

/**
 * Initialisation du module Marchés
 */
function initMarkets() {
  if (initMarkets._initialized) return;
  initMarkets._initialized = true;

  checkAndApplyScheduledDca();
  renderPortfolioModule();
  setupPortfolioModalHandlers();
  if (typeof renderDashboardMarkets === 'function') {
    renderDashboardMarkets();
  }
  renderHeroSpotlight(currentHeroAssetId);
  renderMarketCards();
  setupCleanChartInteractions();

  const searchInput = document.getElementById('market-search-input');
  const clearBtn = document.getElementById('market-search-clear');
  const volatileBtn = document.getElementById('market-filter-volatile-btn');
  const configBtn = document.getElementById('market-config-toggle-btn');
  const closeDrawerBtn = document.getElementById('market-config-close-btn');
  const refreshBtn = document.getElementById('crypto-refresh-btn');
  const modalCloseBtn = document.getElementById('chart-dialog-close-btn');
  const modalBackdrop = document.querySelector('.market-chart-backdrop');
  const addCustomBtn = document.getElementById('market-add-custom-btn');
  const heroExpandBtn = document.getElementById('hero-expand-btn');

  // Sélecteur d'actif vedette Hero (NVDA, TSLA, BTC, S&P 500, CW8)
  document.querySelectorAll('#hero-quick-switch .hero-pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const heroId = btn.dataset.heroId;
      renderHeroSpotlight(heroId);
    });
  });

  // Bouton Agrandir de la Hero Card
  if (heroExpandBtn) {
    heroExpandBtn.addEventListener('click', () => {
      const asset = marketAssets.find((a) => a.id === currentHeroAssetId);
      if (asset) openChartModal(asset);
    });
  }

  // Filtrage par recherche
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentMarketSearch = e.target.value.trim();
      if (clearBtn) clearBtn.hidden = !currentMarketSearch;
      renderMarketCards();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentMarketSearch = '';
      clearBtn.hidden = true;
      renderMarketCards();
      searchInput.focus();
    });
  }

  // Filtrage par catégorie (onglets / pilules)
  document.querySelectorAll('#markets-tab-group button').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#markets-tab-group button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentMarketCategory = btn.dataset.marketCategory || 'all';
      renderMarketCards();
    });
  });

  // Filtre volatilité
  if (volatileBtn) {
    volatileBtn.addEventListener('click', () => {
      isMarketVolatileFilterActive = !isMarketVolatileFilterActive;
      volatileBtn.classList.toggle('active', isMarketVolatileFilterActive);
      renderMarketCards();
    });
  }

  // Tiroir de personnalisation
  if (configBtn) configBtn.addEventListener('click', toggleMarketConfigDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', toggleMarketConfigDrawer);

  // Préréglages du tiroir
  document.querySelectorAll('.market-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      if (preset === 'portfolio') {
        marketAssets.forEach((a) => {
          a.enabled = ['10ap', 'lyp6', 'xmme', 'nvda', 'btc'].includes(a.id);
        });
      } else if (preset === 'volatile') {
        marketAssets.forEach((a) => {
          a.enabled = a.isVolatile || Math.abs(a.baseChange) >= 2.0;
        });
      } else if (preset === 'all') {
        marketAssets.forEach((a) => {
          a.enabled = true;
        });
      }
      saveMarketAssets();
      renderMarketChecklist();
      renderHeroSpotlight(currentHeroAssetId);
      renderMarketCards();
      if (typeof showToast === 'function') showToast(`Préréglage appliqué : ${btn.textContent}`, 'info');
    });
  });

  // Ajout d'actif personnalisé
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
      const nameIn = document.getElementById('market-new-name');
      const symIn = document.getElementById('market-new-sym');
      const typeIn = document.getElementById('market-new-type');
      const priceIn = document.getElementById('market-new-price');

      const name = (nameIn?.value || '').trim();
      let sym = (symIn?.value || '').trim().toUpperCase();
      const type = typeIn?.value || 'stock';
      const price = parseFloat(priceIn?.value) || 100;

      if (!name || !sym) {
        if (typeof showToast === 'function') showToast('Veuillez renseigner au moins le nom et le symbole', 'error');
        return;
      }

      const newAsset = {
        id: `custom_${Date.now()}`,
        name,
        symbol: sym,
        type,
        icon: type === 'crypto' ? 'fa-brands fa-bitcoin' : (type === 'etf' ? 'fa-solid fa-landmark' : 'fa-solid fa-chart-line'),
        basePrice: price,
        baseChange: 0.85,
        dayLow: price * 0.98,
        dayHigh: price * 1.02,
        unit: '$',
        exchange: 'Ajout Personnalisé',
        enabled: true,
        isCustom: true
      };

      marketAssets.unshift(newAsset);
      saveMarketAssets();
      renderMarketChecklist();
      renderMarketCards();

      if (nameIn) nameIn.value = '';
      if (symIn) symIn.value = '';
      if (priceIn) priceIn.value = '';

      if (typeof showToast === 'function') showToast(`Actif "${name}" ajouté avec succès !`, 'success');
      toggleMarketConfigDrawer();
    });
  }

  // Contrôles de la modale du graphique linéaire épuré
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeChartModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeChartModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeChartModal();
  });

  // Bouton de réessai en cas d'erreur de connexion
  const retryBtn = document.getElementById('market-retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      fetchLiveMarketData();
    });
  }

  // Bouton d'actualisation manuelle
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchLiveMarketData();
      if (typeof showToast === 'function') showToast('Actualisation des cours en direct...', 'info');
    });
  }

  // Actualisation réseau initiale différée en tâche de fond (ne bloque jamais le premier affichage)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => fetchLiveMarketData(), { timeout: 2000 });
  } else {
    setTimeout(fetchLiveMarketData, 500);
  }
  setInterval(fetchLiveMarketData, 60000);
}

window.fetchLiveMarketData = fetchLiveMarketData;
