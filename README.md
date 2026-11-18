# 🌌 Violet Cockpit — Dashboard de Bureau & Startpage Ultime

<p align="center">
  <img src="assets/icons/icon.png" alt="Violet Cockpit Logo" width="128" style="border-radius: 24px; box-shadow: 0 10px 35px rgba(0,0,0,0.4);" />
</p>

<p align="center">
  <b>Application de bureau native moderne pour Linux, Windows et macOS.</b><br>
  <i>Un tableau de bord cockpit ultra-rapide, modulaire et fluide à 60 FPS — Zéro framework lourd, zéro serveur Python externe.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-45.3.4-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/Vite-6.4.6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-Vanilla_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS" />
  <img src="https://img.shields.io/badge/CSS3-Variables_Natives-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Plateforme-Linux_%7C_Windows_%7C_macOS-22c55e?style=for-the-badge" alt="Multi-OS" />
</p>

---

## 🚀 Téléchargement Direct (Version Publique Prête à l'Emploi)

> Cliquez directement sur le bouton correspondant à votre système pour lancer le téléchargement immédiat :

<div align="center">

<a href="https://github.com/ugovds/Dashboard/releases/download/v5.2.0/Violet-Cockpit-Setup-5.2.0.exe">
  <img src="https://img.shields.io/badge/Windows-Télécharger%20.exe%20(Assistant)-0078D6?style=for-the-badge&logo=windows&logoColor=white" height="42" alt="Télécharger Windows .exe" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/ugovds/Dashboard/releases/download/v5.2.0/Violet-Cockpit-5.2.0.AppImage">
  <img src="https://img.shields.io/badge/Linux-Télécharger%20.AppImage-FCC624?style=for-the-badge&logo=linux&logoColor=black" height="42" alt="Télécharger Linux .AppImage" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/ugovds/Dashboard/releases/download/v5.2.0/violet-cockpit_5.2.0_amd64.deb">
  <img src="https://img.shields.io/badge/Ubuntu%20%2F%20Debian-Télécharger%20.deb-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" height="42" alt="Télécharger Debian / Ubuntu .deb" />
</a>
&nbsp;&nbsp;
<a href="https://github.com/ugovds/Dashboard/releases/download/v5.2.0/Violet-Cockpit-5.2.0.dmg">
  <img src="https://img.shields.io/badge/macOS-Télécharger%20.dmg-000000?style=for-the-badge&logo=apple&logoColor=white" height="42" alt="Télécharger macOS .dmg" />
</a>

</div>

<br>

| Système | Installateur | Procédure d'installation simplifiée |
|---|---|---|
| **🪟 Windows (10 / 11)** | [`Violet-Cockpit-Setup-5.2.0.exe`](https://github.com/ugovds/Dashboard/releases/download/v5.2.0/Violet-Cockpit-Setup-5.2.0.exe) | **Double-cliquez** sur le `.exe`. L'assistant d'installation officiel s'ouvre, installe l'application, crée le raccourci sur le Bureau et dans le menu Démarrer. |
| **🐧 Linux (Toutes distributions)** | [`Violet-Cockpit-5.2.0.AppImage`](https://github.com/ugovds/Dashboard/releases/download/v5.2.0/Violet-Cockpit-5.2.0.AppImage) | **Double-cliquez pour lancer**. *(Si besoin : Clic droit > Propriétés > Autoriser l'exécution)*. |
| **🐧 Linux (Debian / Ubuntu / Mint)** | [`violet-cockpit_5.2.0_amd64.deb`](https://github.com/ugovds/Dashboard/releases/download/v5.2.0/violet-cockpit_5.2.0_amd64.deb) | **Double-cliquez** pour ouvrir la logithèque Ubuntu et cliquez sur **Installer**. |
| **🍏 macOS (Apple Silicon & Intel)** | [`Violet-Cockpit-5.2.0.dmg`](https://github.com/ugovds/Dashboard/releases/download/v5.2.0/Violet-Cockpit-5.2.0.dmg) | Ouvrez le `.dmg` et glissez simplement l'icône dans le dossier **Applications**. |

👉 *Retrouvez également toutes les versions et notes de version sur la [page officielle des Releases](https://github.com/ugovds/Dashboard/releases).*

---

## ⚡ En Bref : Pourquoi Violet Cockpit ?

**Violet Cockpit** est une refonte intégrale de votre environnement de démarrage et de productivité sous forme d'**application de bureau Electron native**. Conçu pour un démarrage instantané (< 200 ms) et une empreinte mémoire minimale (< 90 Mo de RAM), il réunit tout votre univers de travail au même endroit :

- 🚀 **100% Autonome** : Plus besoin de serveur Python en arrière-plan (`runner.py`) ; toutes les requêtes (marchés financiers, flux RSS, météo, persistance JSON) s'exécutent de façon native et sécurisée dans le **Processus Principal d'Electron** sans aucune restriction CORS.
- 🎨 **5 Thèmes Haute Définition** : Verre dépoli *Liquid Glass* (style Apple VisionOS), *Cyberdeck* (Violet/Néon), *Sakura* (Néo-pastel), *Kanagawa* (Cyan & Menthe) et *Retro Wave* (Monochrome 8-bit).
- ⚡ **Performance Périphérique Pure** : Zéro framework lourd (React, Angular, Vue). Que du **Vanilla JavaScript moderne** et du **CSS3 natif**, garantissant une fluidité constante à 60 FPS.
- 🛡️ **Intégration OS Sécurisée** : Minimisation dans la barre des tâches (System Tray), raccourcis clavier globaux, notifications système natives de bureau et ouverture des liens web externes dans votre navigateur par défaut via `shell.openExternal`.

---

## 🧭 Fonctionnalités & Modules Embarqués

### 1. 🏠 Station d'Accueil & Lanceur Web
- **Station Horloge Orbitron** : Heure grand format, date complète en français, barre de progression dynamique de la journée (%) et cycle solaire.
- **Omnibox Universelle de Recherche** :
  - Support de **10 raccourcis Bangs rapides** : `!g` (Google), `!yt` (YouTube), `!w` (Wikipédia), `!d` (DuckDuckGo), `!gh` (GitHub), `!tr` (Traduction), `!maps` (Google Maps), `!img` (Images), `!so` (Stack Overflow), `!r` (Reddit).
  - Évaluateur mathématique direct (`120 * 45 = 5 400`).
  - Raccourci focus instantané : <kbd>/</kbd> ou <kbd>Ctrl+K</kbd>.
- **Grille de Signets par Catégories** : Liens rapides organisés en 4 univers (Développement, Finance & Crypto, Social & Médias, Outils & Utilitaires) ouvrant directement dans votre navigateur système.

### 2. 📈 Marchés Financiers & Portefeuille Boursier (Sans Python)
- **Passerelle Directe Yahoo Finance & CoinGecko** intégrée dans Electron : contournement automatique du CORS avec cache mémoire intelligent (TTL 3 minutes).
- **9 Actifs Majeurs Surveillés** : Actions US (NVDA, TSLA, AAPL, MSFT), ETF PEA & Europe (10AP, CW8, LYP6, XMME), Indices (S&P 500, Nasdaq, CAC 40), Or, Bitcoin et Ethereum.
- **Hero Bento Spotlight** : Tracé vectoriel SVG lissé (`spline`) de la courbe des dernières 24h avec survol dynamique au curseur.
- **Gestionnaire de Portefeuille** : Calcul en direct de la valorisation globale (€), de la plus-value latente (€ et %) et tableau détaillé des lignes d'actifs.

### 3. 📅 Organisation & Santé (Agenda, Tâches, Météo & Focus)
- **Agenda & To-Do List** : Mini-calendrier mensuel avec puces d'échéances et gestionnaire de tâches (priorités 🔴 Urgent, 🟡 Normal, 🟢 Faible, filtres par statut et accomplissement dynamique).
- **Station Météo Open-Meteo** : 100% ouverte sans clé API, métriques en direct (ressenti, vent, humidité, pluie), courbe thermique 24h et prévisions sur 3 jours.
- **Studio Focus Pomodoro** : Minuteur circulaire SVG (presets 25m Focus / 5m Pause / 15m Longue), **carillon harmonique Zen synthétisé via la Web Audio API** (accord accordé sur 432 Hz) et **notifications système natives de l'OS** dès la fin d'un cycle.

### 4. 📝 Outils Studio (Bloc-Notes, RSS & Audio Lo-Fi)
- **Bloc-Notes Markdown Studio** : Éditeur multi-documents (`notes.md`, `scratchpad.md`), barre d'insertion rapide, prévisualisation formatée en direct, statistiques (mots, caractères, lignes) et **export direct en fichier `.md` local** via le sélecteur natif de l'OS.
- **Lecteur de Flux RSS Natif** : 5 canaux prédéfinis (Hacker News, Numerama, Le Soir, Le Monde, Formule 1), cartes d'articles modernes et redirection vers la source en un clic.
- **Ambiance Audio Lo-Fi Procédurale** : Générateurs sonores sans aucun fichier externe (Pluie apaisante, Bruit Brun de café d'automne, Vagues Zen 432 Hz) avec visualiseur spectral Canvas à 60 FPS.

### 5. ⚙️ Centre de Contrôle & Sauvegarde JSON
- **Personnalisation Complète** : Format de l'horloge (24h/12h, affichage des secondes), ville météo par défaut, moteur de recherche principal.
- **Persistance Centrale (Store JSON)** : Emplacement standardisé de l'OS (`~/.config/Electron/violet-store.json` sous Linux, `%APPDATA%` sous Windows).
- **Export & Import JSON** : Sauvegarde et restauration universelle de toute votre configuration en un clic.
- **Télémétrie Système** : Diagnostic en temps réel de votre configuration matérielle (OS, CPU, RAM, versions logicielles et uptime).

---

## ⌨️ Raccourcis Clavier du Cockpit

| Raccourci | Action |
|---|---|
| <kbd>1</kbd> | Accueil Cockpit (Horloge, Omnibox & Signets) |
| <kbd>2</kbd> | Signets & Web plein format |
| <kbd>3</kbd> | Agenda & Gestionnaire de Tâches |
| <kbd>4</kbd> | Station Météo & Prévisions |
| <kbd>5</kbd> | Marchés Boursiers & Portefeuille |
| <kbd>6</kbd> | Studio Focus Pomodoro |
| <kbd>7</kbd> | Bloc-Notes Markdown Studio |
| <kbd>8</kbd> | Flux d'Actualités RSS & Audio Lo-Fi |
| <kbd>0</kbd> | Centre de Contrôle & Paramètres |
| <kbd>T</kbd> | Cycler instantanément entre les 5 thèmes visuels |
| <kbd>/</kbd> ou <kbd>Ctrl+K</kbd> | Activer et placer le focus sur l'Omnibox |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Naviguer entre les vues dans l'ordre de la Sidebar |

---

## 🛠️ Installation & Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (version 18.x ou supérieure recommandée)
- `npm` (inclus avec Node.js)

### 1. Cloner le Répertoire
```bash
git clone https://github.com/ugovds/Dashboard.git
cd Dashboard
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Lancer en Mode Développement
```bash
npm run dev
```
> Le script démarre Vite, capture dynamiquement le port disponible et lance la fenêtre Electron native avec rechargement instantané (HMR).

---

## 📦 Compilation & Packaging pour la Distribution

Violet Cockpit utilise **Electron Builder** pour compiler et empaqueter l'application en un fichier installable ou exécutable autonome :

### Compiler le frontend pour la production
```bash
npm run build
```
*(Génère un bundle ultra-léger dans `dist/` : ~113 kB de JavaScript et ~67 kB de CSS).*

### Tester l'exécutable local sans packaging lourd
```bash
npm run pack
```
*(Produit le binaire autonome dans le dossier `release/linux-unpacked/violet-cockpit`).*

### Générer les installateurs de production

#### 🐧 Linux (AppImage & deb)
```bash
npm run dist:linux
```
Génère une image portable universelle `.AppImage` (lançable sans installation sur toutes les distributions) et un paquet `.deb` pour Debian / Ubuntu.

#### 🪟 Windows (NSIS & Portable)
```bash
npm run dist:win
```
Génère un installateur moderne `.exe` (NSIS avec raccourci bureau) et une version portable exécutable directement.

#### 🍏 macOS (DMG & Zip)
```bash
npm run dist:mac
```
Génère une image disque standard `.dmg` et une archive `.zip`.

---

## 📂 Structure du Codebase

```text
Dashboard/
├── assets/
│   └── icons/                 # Icônes de l'application (PNG standard & Tray)
├── electron/
│   ├── main.js                # Processus principal : Fenêtre, Tray, IPC natifs
│   ├── dev.js                 # Orchestrateur de démarrage (Vite + Electron)
│   ├── preload.cjs            # Pont sécurisé contextBridge (CommonJS)
│   ├── preload.js             # Copie miroir
│   ├── store.js               # Gestionnaire de persistance JSON local
│   └── services/
│       ├── finance.js         # Passerelle Yahoo Finance & CoinGecko (0 CORS)
│       └── rss.js             # Agrégateur et parseur de flux RSS natif
├── src/
│   ├── index.html             # Point d'entrée ultra-épuré (< 50 lignes)
│   ├── main.js                # Initialisation de l'application côté client
│   ├── styles/
│   │   ├── base.css           # Reset moderne, typographies et utilitaires
│   │   └── themes/            # Les 5 palettes de couleurs CSS natives
│   └── components/
│       ├── Layout/            # Sidebar rétractable, Topbar HUD, Viewport
│       ├── Clock/             # Station Horloge Orbitron & cycle solaire
│       ├── Omnibox/           # Barre de recherche intelligente avec bangs
│       ├── Bookmarks/         # Grille de signets par catégories
│       ├── Markets/           # Tickers, Hero Bento 24h & Portefeuille
│       ├── Agenda/            # Mini-calendrier & To-Do List
│       ├── Weather/           # Météo Open-Meteo & prévisions
│       ├── Pomodoro/          # Minuteur Focus, carillon Zen & notifications OS
│       ├── Notes/             # Studio d'écriture Markdown & export .md
│       ├── Feeds/             # Lecteur RSS & Ambiance audio Lo-Fi
│       └── Settings/          # Centre de Contrôle, sauvegarde & télémétrie
├── package.json               # Scripts de build et configuration electron-builder
└── vite.config.js             # Configuration du bundler Vite 6
```

---

## 📄 Licence & Crédits

- Conçu avec passion par **ugovds**.
- Typographies : *Orbitron* & *Inter*.
- Icônes & graphismes vectoriels originaux.
