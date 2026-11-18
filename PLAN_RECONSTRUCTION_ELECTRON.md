# 🗺️ Master Plan : Reconstruction Propre de Violet Cockpit (Electron)

Ce document constitue le **plan directeur complet** pour reconstruire **Violet Cockpit** de zéro sur une base saine, modulaire et moderne sous **Electron**, sans traîner la dette technique du passé.

Le projet est découpé en **7 sessions indépendantes**. Chaque session a un périmètre strict, ses livrables et un **prompt prêt à l'emploi** à copier-coller dans une nouvelle conversation.

---

## 🧭 Vue d'Ensemble & Architecture Cible

```text
violet-cockpit/
├── package.json
├── vite.config.js
├── electron/
│   ├── main.js             # Processus principal : Fenêtre, Tray, passerelle APIs
│   ├── preload.js          # Pont sécurisé (contextBridge)
│   └── store.js            # Persistance données locales (JSON)
├── src/
│   ├── index.html          # Point d'entrée épuré (< 100 lignes)
│   ├── main.js             # Initialisation de l'application
│   ├── styles/
│   │   ├── base.css        # Reset, typographie, utilitaires
│   │   └── themes/         # Les 5 thèmes (Liquid Glass, Cyberdeck, Sakura...)
│   ├── components/
│   │   ├── Layout/         # Sidebar, Topbar HUD, Viewport
│   │   ├── Clock/          # Station horloge, télémétrie solaire
│   │   ├── Omnibox/        # Recherche, raccourcis bangs (!g, !yt...)
│   │   ├── Bookmarks/      # Grille des signets par catégories
│   │   ├── Markets/        # Suivi boursier (US, PEA, ETF, Crypto) & graphiques
│   │   ├── Agenda/         # Calendrier mensuel & To-Do list
│   │   ├── Weather/        # Météo en direct & prévisions
│   │   ├── Pomodoro/       # Minuteur focus, carillon zen, alertes OS
│   │   └── Notes/          # Bloc-notes Markdown
│   └── services/           # Logique métier pure (Yahoo, CoinGecko, Storage)
└── assets/                 # Icônes, sons zen, polices
```

---

## 📋 Découpage des 7 Sessions de Travail

---

### 🔹 Session 1 : Socle Fondateur & Environnement Electron + Vite
**Objectif** : Mettre en place un projet Electron + Vite flambant neuf, rapide au démarrage (< 0,8s), avec rechargement à chaud (HMR) et une fenêtre native fluide.

* **Ce qui est fait** :
  - Initialisation de `package.json` et de l'environnement de build Vite + Electron.
  - Création de `electron/main.js` (fenêtre native, gestion de la fermeture sans crash, configuration GPU Chromium).
  - Création de `electron/preload.js` (pont IPC sécurisé `window.desktopAPI`).
  - Intégration du **System Tray** (icône en barre des tâches, clic pour afficher/masquer, menu contextuel Quitter).
* **Définition de fin (DoD)** : Une commande unique `npm run dev` ouvre instantanément une fenêtre noire stylisée sans aucun bug de port `localhost`, et `npm run build` produit le paquet local.

> [!TIP]
> **Prompt pour la Session 1** :
> ```text
> Nous démarrons la Session 1 du projet Violet Cockpit (application de bureau Electron moderne).
> Consulte le plan directeur dans l'artifact `master_rebuild_roadmap.md` si besoin.
> Objectif de cette session : Initialiser un projet Electron + Vite vierge, ultra-rapide et propre.
> Contraintes : Zéro framework lourd (Vanilla JS + Vite), chargement direct sécurisé via preload.js, configuration de la fenêtre native standard, gestion du System Tray (minimisation dans la barre des tâches) et commande de démarrage unique `npm run dev`.
> ```

---

### 🔹 Session 2 : Design System, Les 5 Thèmes & Navigation Cockpit
**Objectif** : Poser l'identité visuelle légendaire du projet (thèmes cyberpunk et verre dépoli), la Sidebar rétractable et la Topbar HUD.

* **Ce qui est fait** :
  - Extraction et nettoyage des variables CSS des **5 thèmes originaux** :
    1. *Liquid Glass* (VisionOS, verre dépoli ultra-fluide accéléré par GPU).
    2. *Cyberdeck* (Violet & néon).
    3. *Sakura* (Rose néo-pastel).
    4. *Kanagawa* (Cyan & menthe).
    5. *Retro Wave* (Monochrome 8-bit).
  - Composant `Sidebar` : slim, déployable au survol, raccourcis clavier (<kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>1-5</kbd>).
  - Composant `Topbar HUD` : titre dynamique, télémétrie, bouton Paramètres.
* **Définition de fin (DoD)** : On peut naviguer entre les vues vides et changer de thème instantanément à 60 FPS.

> [!TIP]
> **Prompt pour la Session 2** :
> ```text
> Nous entamons la Session 2 de Violet Cockpit.
> Objectif : Mettre en place le Design System complet, les 5 thèmes originaux (Liquid Glass, Cyberdeck, Sakura, Kanagawa, Retro Wave), la Sidebar rétractable animée et la Topbar HUD.
> Récupère les palettes exactes de l'ancienne codebase dans `css/themes/` et `css/sidebar.css`, mais réécris un CSS épuré et moderne utilisant les variables CSS natives sans surcharge inutile.
> ```

---

### 🔹 Session 3 : Cœur Startpage (Station Horloge, Omnibox & Signets)
**Objectif** : Rendre l'application immédiatement utilisable comme lanceur de navigation web principal.

* **Ce qui est fait** :
  - `ClockStation` : Horloge centrale grand format, date complète en français, barre de progression de la journée (%), cycle solaire.
  - `Omnibox` : Barre de recherche centrale avec support complet des **bangs** (`!g`, `!yt`, `!w`, `!d`, `!github`), suggestions rapides.
  - `BookmarksGrid` : Grille ergonomique de signets rangés par catégories (Dev, Finance, Médias, Outils).
  - **Gestion native des liens** : Tout clic sur un signet ou validation de recherche s'ouvre dans le navigateur par défaut de l'OS via `shell.openExternal`.
* **Définition de fin (DoD)** : La vue "Accueil" est 100% opérationnelle comme rampe de lancement web.

> [!TIP]
> **Prompt pour la Session 3** :
> ```text
> Nous entamons la Session 3 de Violet Cockpit.
> Objectif : Construire les composants Accueil : Station Horloge (date, progression journalière %), Omnibox intelligente avec raccourcis bangs, et Grille de Signets par catégories.
> Tout lien web et recherche externe doit impérativement s'ouvrir dans le navigateur par défaut de l'OS via Electron (shell.openExternal). Réutilise la liste de favoris et les moteurs de recherche de l'ancien `js/search.js` et `js/bookmarks.js`.
> ```

---

### 🔹 Session 4 : Passerelle Financière & Marchés (Bourse, ETF, Crypto)
**Objectif** : Recréer le suivi de portefeuille et de marchés en temps réel, sans aucun serveur Python local.

* **Ce qui est fait** :
  - Dans `electron/main.js` : mise en place d'un gestionnaire IPC pour interroger Yahoo Finance et CoinGecko en direct (Node.js n'a aucune restriction CORS).
  - Cache intelligent en mémoire (TTL 3 minutes) pour préserver les quotas réseau.
  - Frontend `MarketsView` :
    - Ticker défilant ou cartes des actifs majeurs (NVDA, TSLA, 10AP, CW8, CAC40, S&P500, Or, BTC, ETH).
    - Bento Hero Spotlight avec tracé de courbe 24h interactif (SVG/Canvas fluide).
    - Suivi de valorisation de portefeuille personnel.
* **Définition de fin (DoD)** : Les cotations réelles se mettent à jour automatiquement sans avoir à lancer de terminal ou de script Python externe.

> [!TIP]
> **Prompt pour la Session 4** :
> ```text
> Nous entamons la Session 4 de Violet Cockpit.
> Objectif : Intégrer le module Marchés & Portefeuille boursier (Actions US, ETF PEA, Indices, Devises, Crypto).
> Implémente la passerelle de requêtes financières directement dans le Main Process d'Electron pour contourner le CORS sans aucun serveur Python. Rapatrie le mapping d'actifs Yahoo Finance de `runner.py` et recrée le composant Hero Bento avec graphique 24h interactif.
> ```

---

### 🔹 Session 5 : Organisation & Santé (Agenda, Tâches, Météo & Pomodoro)
**Objectif** : Intégrer les outils de productivité quotidienne avec notifications natives du bureau.

* **Ce qui est fait** :
  - `AgendaView` : Mini-calendrier mensuel interactif à gauche et gestionnaire de tâches (To-Do List avec filtres, tags et persistance) à droite.
  - `WeatherView` : Météo actuelle, courbe de température 24h et prévisions sur 3 jours (API Open-Meteo ouverte sans clé).
  - `PomodoroWidget` : Minuteur focus avec presets (25m / 5m), carillon zen synthétisé via Web Audio API, et **vraies notifications système de bureau** lors de la fin de session.
* **Définition de fin (DoD)** : Les tâches se cochent/sauvegardent instantanément et le minuteur émet une alerte système même si l'application est réduite en arrière-plan.

> [!TIP]
> **Prompt pour la Session 5** :
> ```text
> Nous entamons la Session 5 de Violet Cockpit.
> Objectif : Construire les modules Agenda & To-Do List, Météo en direct (Open-Meteo), et Minuteur Focus Pomodoro.
> Le Pomodoro doit inclure le carillon Zen Web Audio et émettre une notification native de bureau de l'OS via Electron quand la session se termine.
> ```

---

### 🔹 Session 6 : Outils Studio (Bloc-Notes Markdown & Flux d'Actualités)
**Objectif** : Offrir l'espace d'écriture et de veille informationnelle.

* **Ce qui est fait** :
  - `NotesStudio` : Éditeur de notes Markdown épuré avec rendu en direct, coloration syntaxique discrète et bouton d'export de fichier `.md` sur le bureau.
  - `FeedsView` : Lecteur de flux RSS (Tech, Sport/F1, personnalisés) avec cartes d'articles modernes.
  - `AmbientAudio` : Module audio Lo-Fi procédural (pluie, café, fréquences zen) avec visualiseur canvas léger.
* **Définition de fin (DoD)** : On peut prendre des notes, exporter son travail et consulter les flux d'actualités.

> [!TIP]
> **Prompt pour la Session 6** :
> ```text
> Nous entamons la Session 6 de Violet Cockpit.
> Objectif : Intégrer le Bloc-Notes Markdown Studio (avec prévisualisation en direct et export de fichiers .md locaux), le lecteur de flux d'actualités RSS et le lecteur d'ambiance audio Lo-Fi.
> ```

---

### 🔹 Session 7 : Persistance Centrale, Paramètres & Packaging Multi-OS
**Objectif** : Finaliser le produit grand public prêt à être distribué et installé par n'importe qui.

* **Ce qui est fait** :
  - `Store Manager` : Stockage JSON sécurisé dans le dossier standard de l'OS de l'utilisateur (`~/.config/violet-cockpit/` sous Linux, `%APPDATA%` sous Windows).
  - Centre de Paramètres : Choix du thème actif, personnalisation de l'horloge, bouton d'Export et d'Import de configuration JSON.
  - Configuration **Electron Builder** :
    - Génération du paquet Linux : `.AppImage` (universel sans installation) et `.deb` (Ubuntu/Debian).
    - Configuration prête pour Windows (`.exe` installateur NSIS) et macOS (`.dmg`).
* **Définition de fin (DoD)** : L'application est autonome, distribuable sous forme de fichier exécutable unique, et s'installe en 1 clic chez n'importe quel utilisateur.

> [!TIP]
> **Prompt pour la Session 7** :
> ```text
> Nous finalisons Violet Cockpit avec la Session 7.
> Objectif : Mettre en place la persistance de configuration centralisée (export/import JSON), le panneau de paramètres, et configurer Electron Builder pour générer les paquets installables de production (.deb, .AppImage pour Linux, et config Windows/Mac).
> ```

---

## 🚀 Prêt pour le Démarrage

Ce plan vous garantit :
1. **Zéro perte de contexte** : Chaque session est focalisée sur un bloc précis.
2. **Une codebase 4 fois plus légère** : Pas de code mort, pas de hacks.
3. **Un produit universel** : 100% fonctionnel, fluide à 60 FPS, sans dépendance exotique.

Pour démarrer la **Session 1**, il vous suffit d'ouvrir une nouvelle conversation et d'y coller le premier prompt !
