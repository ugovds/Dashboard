const { contextBridge, ipcRenderer } = require('electron');

// Exposition sécurisée via contextBridge de l'API desktopAPI
contextBridge.exposeInMainWorld('desktopAPI', {
  // Métadonnées système
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },

  // Gestion des fenêtres natives
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  toggleMaximize: () => ipcRenderer.send('window:toggle-maximize'),
  hide: () => ipcRenderer.send('window:hide'),
  close: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),

  // Navigation & OS
  openExternal: (url) => ipcRenderer.send('shell:open-external', url),

  // Communication & télémétrie
  ping: () => ipcRenderer.invoke('app:ping'),
  uptime: () => ipcRenderer.invoke('app:uptime'),

  // Persistance Store local
  getStore: (key, defaultValue) => ipcRenderer.invoke('store:get', key, defaultValue),
  setStore: (key, value) => ipcRenderer.invoke('store:set', key, value),

  // Passerelle Marchés Boursiers & Portefeuille
  getMarketQuotes: (force) => ipcRenderer.invoke('finance:get-quotes', force),
  getMarketChart: (assetId, range, interval) => ipcRenderer.invoke('finance:get-chart', assetId, range, interval),
  getPortfolio: () => ipcRenderer.invoke('finance:get-portfolio'),
  savePortfolio: (holdings) => ipcRenderer.invoke('finance:save-portfolio', holdings),

  // Service Météo Haute Précision (Belgique & Europe)
  getWeather: (city, force) => ipcRenderer.invoke('weather:get-data', { city, force }),
  searchWeatherCities: (query) => ipcRenderer.invoke('weather:search-cities', query),

  // Notifications Natives OS
  showNotification: (payload) => ipcRenderer.send('notification:show', payload),

  // Studio Markdown & Actualités RSS
  exportNote: (filename, content) => ipcRenderer.invoke('notes:export', { filename, content }),
  fetchRssFeed: (feedKey) => ipcRenderer.invoke('rss:fetch', feedKey),

  // Paramètres & Persistance Centrale (Session 7)
  getAllStore: () => ipcRenderer.invoke('store:get-all'),
  setAllStore: (data) => ipcRenderer.invoke('store:set-all', data),
  resetStore: () => ipcRenderer.invoke('store:reset'),
  getStorePath: () => ipcRenderer.invoke('store:get-path'),
  exportConfig: () => ipcRenderer.invoke('config:export'),
  importConfig: () => ipcRenderer.invoke('config:import'),
  getSystemInfo: () => ipcRenderer.invoke('system:info'),

  // Abonnements aux événements (avec fonction de nettoyage)
  onWindowStateChange: (callback) => {
    const subscription = (_event, state) => callback(state);
    ipcRenderer.on('window:state-changed', subscription);
    return () => ipcRenderer.removeListener('window:state-changed', subscription);
  },
});
