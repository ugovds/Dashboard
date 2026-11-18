import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

class JSONStore {
  constructor(filename = 'violet-store.json') {
    this.userDataPath = app.getPath('userData');
    this.filePath = path.join(this.userDataPath, filename);
    this.data = {};
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(this.userDataPath)) {
        fs.mkdirSync(this.userDataPath, { recursive: true });
      }
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('[Store] Impossible de lire le fichier de persistance, réinitialisation:', err.message);
      this.data = {};
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Erreur lors de l\'écriture du fichier de persistance:', err);
    }
  }

  get(key, defaultValue = null) {
    return this.data[key] !== undefined ? this.data[key] : defaultValue;
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
    return value;
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  delete(key) {
    if (this.has(key)) {
      delete this.data[key];
      this.save();
      return true;
    }
    return false;
  }

  clear() {
    this.data = {};
    this.save();
  }

  setAll(data) {
    this.data = typeof data === 'object' && data !== null ? { ...data } : {};
    this.save();
    return this.all();
  }

  all() {
    return { ...this.data };
  }
}

export default JSONStore;
