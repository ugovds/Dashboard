import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell, Notification, dialog } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import JSONStore from './store.js';
import FinanceService from './services/finance.js';
import RSSService from './services/rss.js';

// Configuration Chromium GPU & Performance
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-features', 'Vulkan');
app.commandLine.appendSwitch('no-sandbox');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow = null;
let tray = null;
let isQuitting = false;
let store = null;

// Empêcher les doublons d'instances (Single Instance Lock)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

function createMainWindow() {
  const iconPath = path.join(__dirname, '../assets/icons/icon.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#07070b',
    title: 'Violet Cockpit',
    show: false,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Gestion du cycle de vie de la fenêtre : minimisation dans le Tray plutôt que fermeture brutale
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // Signaler au renderer les changements d'état (maximize / unmaximize)
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:state-changed', { isMaximized: true });
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:state-changed', { isMaximized: false });
  });

  // Affichage fluide dès que la fenêtre est prête pour éviter tout flash blanc
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Intercepter les ouvertures de nouvelles fenêtres pour les rediriger vers le navigateur système par défaut
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Chargement en mode dev (URL Vite dynamique) ou en mode production (fichier dist/index.html)
  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl).catch((err) => {
      console.error('[Main] Échec du chargement de l\'URL Vite:', err);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function createTray() {
  const trayIconPath = path.join(__dirname, '../assets/icons/tray.png');
  let trayImage;

  try {
    trayImage = nativeImage.createFromPath(trayIconPath);
    if (trayImage.isEmpty()) {
      trayImage = nativeImage.createFromPath(path.join(__dirname, '../assets/icons/icon.png'));
    }
  } catch (err) {
    console.warn('[Tray] Erreur de chargement d\'icône:', err.message);
  }

  tray = new Tray(trayImage || trayIconPath);
  tray.setToolTip('Violet Cockpit');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Afficher Violet Cockpit',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: 'Masquer dans la barre des tâches',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quitter',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Clic simple sur l'icône Tray pour basculer la visibilité
  tray.on('click', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      if (mainWindow.isFocused()) {
        mainWindow.hide();
      } else {
        mainWindow.focus();
      }
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function registerIpcHandlers() {
  store = new JSONStore();

  // Contrôles fenêtre
  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window:toggle-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window:hide', () => {
    mainWindow?.hide();
  });

  ipcMain.on('window:close', () => {
    if (!isQuitting) {
      mainWindow?.hide();
    } else {
      mainWindow?.close();
    }
  });

  ipcMain.handle('window:is-maximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  // Liens externes
  ipcMain.on('shell:open-external', (_event, url) => {
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'))) {
      shell.openExternal(url);
    }
  });

  // Statut & diagnostic
  ipcMain.handle('app:ping', () => {
    return {
      status: 'ok',
      timestamp: Date.now(),
      platform: process.platform,
    };
  });

  ipcMain.handle('app:uptime', () => {
    return process.uptime();
  });

  // Persistance Store JSON
  ipcMain.handle('store:get', (_event, key, defaultValue) => {
    return store.get(key, defaultValue);
  });

  ipcMain.handle('store:set', (_event, key, value) => {
    return store.set(key, value);
  });

  // Passerelle Financière & Marchés (Bourse, ETF, Crypto)
  const financeService = new FinanceService(store);

  ipcMain.handle('finance:get-quotes', async (_event, force) => {
    return financeService.getMarketQuotes(force);
  });

  ipcMain.handle('finance:get-chart', async (_event, assetId, range, interval) => {
    return financeService.getMarketChart(assetId, range, interval);
  });

  ipcMain.handle('finance:get-portfolio', async () => {
    return financeService.getPortfolio();
  });

  ipcMain.handle('finance:save-portfolio', async (_event, holdings) => {
    return financeService.savePortfolioHoldings(holdings);
  });

  // Export de fichiers Markdown sur le bureau ou répertoire choisi
  ipcMain.handle('notes:export', async (_event, { filename, content } = {}) => {
    try {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Exporter la note Markdown',
        defaultPath: filename || 'note.md',
        filters: [
          { name: 'Fichiers Markdown (*.md)', extensions: ['md'] },
          { name: 'Texte (*.txt)', extensions: ['txt'] },
          { name: 'Tous les fichiers', extensions: ['*'] },
        ],
      });

      if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, content || '', 'utf-8');
        return { success: true, filePath: result.filePath };
      }
      return { success: false, canceled: true };
    } catch (err) {
      console.error('[Main] Erreur export note:', err);
      return { success: false, error: err.message };
    }
  });

  // Agrégateur de flux d'actualités RSS natif
  const rssService = new RSSService();
  ipcMain.handle('rss:fetch', async (_event, feedKey) => {
    return rssService.fetchFeed(feedKey);
  });

  // Notifications natives du système de bureau (OS)
  ipcMain.on('notification:show', (_event, { title, body } = {}) => {
    try {
      if (Notification.isSupported()) {
        const notif = new Notification({
          title: title || 'Violet Cockpit',
          body: body || '',
          icon: path.join(__dirname, '../assets/icons/icon.png'),
        });
        notif.show();
        notif.on('click', () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
          }
        });
      }
    } catch (err) {
      console.warn('[Notification] Erreur notification système:', err.message);
    }
  });

  // Persistance Store JSON avancée & Gestion centralisée (Session 7)
  ipcMain.handle('store:get-all', () => {
    return store.all();
  });

  ipcMain.handle('store:set-all', (_event, data) => {
    return store.setAll(data);
  });

  ipcMain.handle('store:reset', () => {
    store.clear();
    return { success: true };
  });

  ipcMain.handle('store:get-path', () => {
    return {
      userDataPath: store.userDataPath,
      filePath: store.filePath,
    };
  });

  // Export de configuration JSON
  ipcMain.handle('config:export', async () => {
    try {
      const nowStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Exporter la configuration de Violet Cockpit',
        defaultPath: `violet-cockpit-backup-${nowStr}.json`,
        filters: [
          { name: 'Fichiers JSON (*.json)', extensions: ['json'] },
          { name: 'Tous les fichiers', extensions: ['*'] },
        ],
      });

      if (!result.canceled && result.filePath) {
        const payload = {
          app: 'Violet Cockpit',
          version: app.getVersion(),
          exportDate: new Date().toISOString(),
          settings: store.all(),
        };
        fs.writeFileSync(result.filePath, JSON.stringify(payload, null, 2), 'utf-8');
        return { success: true, filePath: result.filePath };
      }
      return { success: false, canceled: true };
    } catch (err) {
      console.error('[Main] Erreur export configuration:', err);
      return { success: false, error: err.message };
    }
  });

  // Import de configuration JSON
  ipcMain.handle('config:import', async () => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Importer une sauvegarde de configuration',
        properties: ['openFile'],
        filters: [
          { name: 'Fichiers JSON (*.json)', extensions: ['json'] },
          { name: 'Tous les fichiers', extensions: ['*'] },
        ],
      });

      if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
        const targetPath = result.filePaths[0];
        const rawContent = fs.readFileSync(targetPath, 'utf-8');
        const parsed = JSON.parse(rawContent);

        const dataToRestore = parsed.settings ? parsed.settings : parsed;
        if (typeof dataToRestore === 'object' && dataToRestore !== null) {
          store.setAll(dataToRestore);
          return { success: true, data: dataToRestore, filePath: targetPath };
        }
        throw new Error('Format de fichier de configuration invalide');
      }
      return { success: false, canceled: true };
    } catch (err) {
      console.error('[Main] Erreur import configuration:', err);
      return { success: false, error: err.message };
    }
  });

  // Télémétrie système & diagnostic complet
  ipcMain.handle('system:info', () => {
    const memUsage = process.memoryUsage();
    return {
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      v8Version: process.versions.v8,
      platform: process.platform,
      arch: process.arch,
      osType: os.type(),
      osRelease: os.release(),
      totalMemMB: Math.round(os.totalmem() / (1024 * 1024)),
      freeMemMB: Math.round(os.freemem() / (1024 * 1024)),
      cpuModel: os.cpus()?.[0]?.model || 'Standard CPU',
      cpuCount: os.cpus()?.length || 1,
      heapUsedMB: Math.round(memUsage.heapUsed / (1024 * 1024)),
      rssMB: Math.round(memUsage.rss / (1024 * 1024)),
      uptimeSeconds: Math.floor(process.uptime()),
      storePath: store.filePath,
    };
  });
}

// Initialisation globale de l'application
app.whenReady().then(() => {
  registerIpcHandlers();
  createMainWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  // Sur les systèmes de bureau (Linux/Windows), rester actif dans le Tray sauf si explicite
  if (process.platform === 'darwin') {
    // macOS behavior
  }
});
