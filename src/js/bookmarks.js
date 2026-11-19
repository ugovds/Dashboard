/**
 * bookmarks.js - Gestion des catégories de signets, ajustement adaptatif de la taille,
 * ajout/suppression de liens et catégories, glisser-déposer et sauvegarde/restauration JSON complète
 */
const defaultCategories = [
  {
    id: 'social',
    title: 'Social',
    icon: 'fa-solid fa-share-nodes',
    links: [
      { name: 'YouTube', url: 'https://www.youtube.com/', icon: 'fa-brands fa-youtube' },
      { name: 'Twitch', url: 'https://www.twitch.tv/', icon: 'fa-brands fa-twitch' },
      { name: 'Gmail', url: 'https://mail.google.com/', icon: 'fa-solid fa-envelope-open-text' },
      { name: 'Twitter / X', url: 'https://x.com/', icon: 'fa-brands fa-x-twitter' },
      { name: 'Google Docs', url: 'https://docs.google.com/document/', icon: 'fa-solid fa-file-lines' },
      { name: 'Google Slides', url: 'https://docs.google.com/presentation/', icon: 'fa-solid fa-display' }
    ]
  },
  {
    id: 'jeux',
    title: 'Jeux',
    icon: 'fa-solid fa-gamepad',
    links: [
      { name: 'Chess', url: 'https://www.chess.com/home', icon: 'fa-solid fa-chess-knight' },
      { name: 'Monkeytype', url: 'https://monkeytype.com/', icon: 'fa-solid fa-keyboard' },
      { name: 'Cémantix', url: 'https://cemantix.certitudes.org/', icon: 'fa-solid fa-fire-flame-curved' },
      { name: 'Worldle', url: 'https://worldle.teuteuf.fr/', icon: 'fa-solid fa-earth-europe' },
      { name: 'Framed', url: 'https://framed.wtf/', icon: 'fa-solid fa-film' },
      { name: 'Chronophoto', url: 'https://www.chronophoto.app/', icon: 'fa-solid fa-camera-retro' }
    ]
  },
  {
    id: 'ia',
    title: 'IA',
    icon: 'fa-solid fa-microchip',
    links: [
      { name: 'Gemini', url: 'https://gemini.google.com/app?hl=fr', icon: 'fa-solid fa-wand-magic-sparkles' },
      { name: 'ChatGPT', url: 'https://chatgpt.com/', icon: 'fa-solid fa-bolt' },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com/', icon: 'fa-solid fa-book-open-reader' },
      { name: 'Claude', url: 'https://claude.ai/new', icon: 'fa-solid fa-brain' },
      { name: 'Perplexity', url: 'https://www.perplexity.ai/', icon: 'fa-solid fa-magnifying-glass-chart' },
      { name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: 'fa-solid fa-terminal' }
    ]
  },
  {
    id: 'unif',
    title: 'Unif',
    icon: 'fa-solid fa-graduation-cap',
    links: [
      { name: 'Moodle', url: 'https://moodle.uclouvain.be/my/', icon: 'fa-solid fa-book-bookmark' },
      { name: 'INGInious', url: 'https://inginious.info.ucl.ac.be/mycourses', icon: 'fa-solid fa-code' },
      { name: 'MonHoraire', url: 'https://monhoraire.uclouvain.be/', icon: 'fa-regular fa-calendar-days' },
      { name: 'Outlook', url: 'https://outlook.office.com/mail/', icon: 'fa-solid fa-envelope' },
      { name: 'Overleaf', url: 'https://overleaf.info.ucl.ac.be/project', icon: 'fa-solid fa-feather-pointed' },
      { name: 'MyUCL', url: 'https://uclouvain.be/fr/myuclouvain', icon: 'fa-solid fa-building-columns' }
    ]
  }
];

let categories = [];
let quickShortcuts = [];
let isEditMode = false;
let currentEditingTarget = { catIdx: null, linkIdx: null }; // linkIdx === null signifie ajout d'un nouveau lien
let currentEditingCategoryIdx = null; // null = ajout de catégorie

function getCleanDomain(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || '';
  }
}

// Variables pour le Glisser-Déposer
let draggedData = null; // { catIdx, linkIdx }
let didDragOccur = false;

function getQuickShortcuts() {
  return quickShortcuts;
}

/**
 * Calcule automatiquement la classe de densité pour que la carte reste belle
 * peu importe le nombre de liens (> 6 liens supportés sans déformation).
 */
function getCategoryDensityClass(count) {
  if (count <= 6) return 'density-normal';
  if (count <= 8) return 'density-compact';
  if (count <= 12) return 'density-dense';
  return 'density-scroll';
}

/* ========================================================
   SYSTÈME DE COULEURS ET HALOS NÉONS DYNAMIQUES
   Harmonisé sur tous les 5 thèmes (Kanagawa, Sakura, Cyberdeck, Retro Wave, Liquid Glass)
   ======================================================== */
const BRAND_COLORS = {
  // Vidéo & Streaming
  youtube: '#ff334b',
  twitch: '#a855f7',
  vimeo: '#00adef',
  dailymotion: '#0066dc',
  tiktok: '#00f2fe',
  instagram: '#ec4899',
  facebook: '#1877f2',
  twitter: '#38bdf8',
  x: '#38bdf8',
  reddit: '#ff4500',
  discord: '#6366f1',
  telegram: '#26a5e4',
  whatsapp: '#25d366',
  linkedin: '#0a66c2',
  pinterest: '#e60023',
  snapchat: '#fffc00',
  threads: '#e2ebf5',
  mastodon: '#6364ff',
  bluesky: '#1185fe',

  // Google Suite
  gmail: '#ea4335',
  google: '#4285f4',
  gemini: '#38bdf8',
  'google docs': '#4285f4',
  'google doc': '#4285f4',
  'docs.google': '#4285f4',
  'google slides': '#f59e0b',
  'google slide': '#f59e0b',
  'slides.google': '#f59e0b',
  'google sheets': '#10b981',
  'google sheet': '#10b981',
  'sheets.google': '#10b981',
  'google drive': '#34a853',
  drive: '#34a853',
  maps: '#34a853',
  photos: '#ea4335',
  calendar: '#4285f4',
  keep: '#f59e0b',
  meet: '#00ac47',
  translate: '#4285f4',
  notebooklm: '#8b5cf6',

  // IA & Dev
  chatgpt: '#10b981',
  openai: '#10b981',
  claude: '#f97316',
  anthropic: '#f97316',
  perplexity: '#06b6d4',
  deepseek: '#3b82f6',
  mistral: '#ff7000',
  copilot: '#0078d4',
  huggingface: '#f59e0b',
  github: '#a78bfa',
  gitlab: '#fc6d26',
  bitbucket: '#0052cc',
  stackoverflow: '#f48024',
  npm: '#cb3837',
  docker: '#2496ed',
  vercel: '#eef2f6',
  netlify: '#00c7b7',
  archlinux: '#1793d1',
  debian: '#d70a53',
  ubuntu: '#e95420',

  // Productivité & Design
  notion: '#a78bfa',
  obsidian: '#a855f7',
  figma: '#a855f7',
  canva: '#00c4cc',
  trello: '#0079bf',
  linear: '#5e6ad2',
  slack: '#4a154b',
  zoom: '#2d8cff',

  // Université & Éducation (UCLouvain, Moodle...)
  moodle: '#f59e0b',
  uclouvain: '#0284c7',
  inginious: '#10b981',
  monhoraire: '#38bdf8',
  outlook: '#0ea5e9',
  office: '#d83b01',
  microsoft: '#00a4ef',
  teams: '#6264a7',
  overleaf: '#22c55e',
  myucl: '#0284c7',
  wikipedia: '#38bdf8',
  coursera: '#0056d2',

  // Jeux & Mini-jeux
  chess: '#eab308',
  lichess: '#edebe9',
  monkeytype: '#e2b714',
  cemantix: '#f97316',
  worldle: '#10b981',
  framed: '#f43f5e',
  chronophoto: '#06b6d4',
  steam: '#1b2838',

  // Finance & Marchés
  tradingview: '#22c55e',
  coinmarketcap: '#3861fb',
  binance: '#f3ba2f',
  boursorama: '#ec008c',
  yahoo: '#6001d2',

  // Médias / Musique
  spotify: '#1db954',
  deezer: '#ef5466',
  netflix: '#e50914'
};

const VIBRANT_ACCENT_PALETTE = [
  '#38bdf8', // Cyan ciel (style Gemini)
  '#ef4444', // Rouge vif (style YouTube)
  '#f59e0b', // Ambre doré (style Moodle)
  '#10b981', // Émeraude (style ChatGPT)
  '#a855f7', // Violet électrique (style GitHub)
  '#22c55e', // Vert lime néon (style TradingView)
  '#06b6d4', // Cyan profond
  '#f43f5e', // Rose pourpre
  '#f97316', // Orange corail
  '#6366f1', // Indigo néon
  '#eab308', // Or éclatant
  '#14b8a6'  // Menthe turquoise
];

function hexToRgba(hex, alpha) {
  let c = (hex || '').replace('#', '').trim();
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  if (c.length !== 6) return `rgba(49, 225, 247, ${alpha})`;
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildTileStyle(accentHex) {
  return {
    accent: accentHex,
    bg: `linear-gradient(135deg, ${hexToRgba(accentHex, 0.22)}, ${hexToRgba(accentHex, 0.07)})`,
    border: hexToRgba(accentHex, 0.38),
    glow: hexToRgba(accentHex, 0.38)
  };
}

function hashStringToColor(str) {
  if (!str) return VIBRANT_ACCENT_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % VIBRANT_ACCENT_PALETTE.length;
  return VIBRANT_ACCENT_PALETTE[idx];
}

function getLinkVisualTheme(link) {
  if (link && link.color && link.color.startsWith('#')) {
    return buildTileStyle(link.color);
  }

  const rawUrl = (link?.url || '').toLowerCase();
  const rawName = (link?.name || '').toLowerCase();
  let domain = '';
  try {
    domain = new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    domain = rawUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }

  // Correspondance exacte ou partielle dans les marques reconnues
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (domain.includes(key) || rawName.includes(key) || rawUrl.includes(key)) {
      return buildTileStyle(color);
    }
  }

  // Attribution algorithmique déterministe
  const fallbackColor = hashStringToColor(domain || rawName || 'web');
  return buildTileStyle(fallbackColor);
}

function updateColorPickerUI(color) {
  const dots = document.querySelectorAll('.color-dot-btn');
  const customColorInput = document.getElementById('edit-custom-color');
  const hiddenValInput = document.getElementById('edit-color-val');
  if (hiddenValInput) hiddenValInput.value = color || '';

  const normColor = (color || '').trim().toLowerCase();
  let matched = false;

  dots.forEach((btn) => {
    const btnColor = (btn.dataset.color || '').trim().toLowerCase();
    const isAuto = btnColor === 'auto';
    const isActive = isAuto ? (!normColor || normColor === 'auto') : (btnColor === normColor);
    btn.classList.toggle('active', isActive);
    if (isActive) matched = true;
  });

  if (customColorInput && normColor && normColor.startsWith('#')) {
    customColorInput.value = normColor;
  }
}

function renderCategories() {
  const categoriesContainer = document.getElementById('categories-container');
  if (!categoriesContainer) return;

  // Ajustement automatique des colonnes du conteneur si > 4 catégories
  if (categories.length > 4) {
    categoriesContainer.classList.add('multi-categories');
  } else {
    categoriesContainer.classList.remove('multi-categories');
  }

  categoriesContainer.innerHTML = categories
    .map((cat, catIdx) => {
      const densityClass = getCategoryDensityClass(cat.links.length);
      return `
      <div class="category-card ${densityClass}" data-cat="${catIdx}">
        <div class="category-header">
          <div class="category-title-wrap">
            <i class="${cat.icon}"></i>
            <h3>${cat.title}</h3>
          </div>

          ${
            isEditMode
              ? `
            <div class="category-tools-group">
              <button type="button" class="cat-tool-btn cat-add-link-btn" data-cat="${catIdx}" title="Ajouter un lien à cette catégorie">
                <i class="fa-solid fa-plus"></i>
              </button>
              <button type="button" class="cat-tool-btn cat-edit-btn" data-cat="${catIdx}" title="Modifier le nom ou l'icône de la catégorie">
                <i class="fa-solid fa-pen"></i>
              </button>
              ${
                categories.length > 1
                  ? `
                <button type="button" class="cat-tool-btn danger cat-del-btn" data-cat="${catIdx}" title="Supprimer cette catégorie">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              `
                  : ''
              }
            </div>
          `
              : ''
          }
        </div>

        <div class="link-list ${densityClass}" data-cat="${catIdx}">
          ${cat.links
            .map(
              (link, linkIdx) => {
                const visualTheme = getLinkVisualTheme(link);
                return `
            <a
              href="${link.url}"
              class="link-item"
              data-cat="${catIdx}"
              data-link="${linkIdx}"
              data-name="${link.name}"
              title="${link.name}"
              style="--tile-accent: ${visualTheme.accent}; --tile-bg: ${visualTheme.bg}; --tile-border: ${visualTheme.border}; --tile-glow: ${visualTheme.glow};"
              ${isEditMode ? 'draggable="true"' : ''}
            >
              ${
                isEditMode
                  ? `<span class="link-drag-handle" title="Glisser pour réorganiser"><i class="fa-solid fa-grip-vertical"></i></span>`
                  : ''
              }
              <div class="link-icon-box">
                <i class="${link.icon || 'fa-solid fa-bookmark'}"></i>
              </div>
              <div class="link-meta">
                <span class="link-name-text">${link.name}</span>
              </div>
              ${
                isEditMode
                  ? `
                <div class="link-edit-actions">
                  <span class="link-edit-badge" title="Modifier ce raccourci"><i class="fa-solid fa-pen"></i></span>
                  <span class="link-delete-badge" data-del-link="${linkIdx}" data-del-cat="${catIdx}" title="Supprimer ce raccourci"><i class="fa-solid fa-xmark"></i></span>
                </div>
              `
                  : ''
              }
            </a>
          `;
              }
            )
            .join('')}

          ${
            isEditMode
              ? `
            <button type="button" class="link-item-add-quick" data-cat="${catIdx}" title="Ajouter un raccourci">
              <i class="fa-solid fa-plus"></i>
              <span>+ Nouveau lien</span>
            </button>
          `
              : ''
          }
        </div>
      </div>
    `;
    })
    .join('');

  // Reconstituer la liste plate pour la recherche Omnibox
  quickShortcuts = [];
  categories.forEach((cat) => {
    cat.links.forEach((l) => {
      quickShortcuts.push({
        title: l.name,
        url: l.url,
        icon: l.icon
      });
    });
  });

  if (isEditMode) {
    attachDragAndDropEvents();
    attachCategoryActionEvents();
  }
}

function setEditMode(active) {
  isEditMode = Boolean(active);
  document.body.classList.toggle('edit-mode-active', isEditMode);
  renderCategories();
}

// ----------------------------------------------------
// Événements d'édition sur les catégories et raccourcis
// ----------------------------------------------------
function attachCategoryActionEvents() {
  // Bouton Ajouter un lien dans le header ou à la fin de la liste
  document.querySelectorAll('.cat-add-link-btn, .link-item-add-quick').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catIdx = Number(btn.dataset.cat);
      openEditModal(catIdx, null); // null = nouveau lien
    });
  });

  // Bouton Éditer la catégorie
  document.querySelectorAll('.cat-edit-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catIdx = Number(btn.dataset.cat);
      openCategoryModal(catIdx);
    });
  });

  // Bouton Supprimer la catégorie
  document.querySelectorAll('.cat-del-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const catIdx = Number(btn.dataset.cat);
      const catName = categories[catIdx]?.title || 'cette catégorie';
      if (confirm(`Voulez-vous vraiment supprimer la catégorie "${catName}" et tous ses raccourcis ?`)) {
        categories.splice(catIdx, 1);
        localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
        renderCategories();
        if (typeof showToast === 'function') {
          showToast(`Catégorie "${catName}" supprimée`, 'info');
        }
      }
    });
  });

  // Bouton suppression rapide d'un lien (croix rouge)
  document.querySelectorAll('.link-delete-badge').forEach((badge) => {
    badge.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const catIdx = Number(badge.dataset.delCat);
      const linkIdx = Number(badge.dataset.delLink);
      deleteBookmark(catIdx, linkIdx);
    });
  });
}

let lastDeletedBookmark = null;

function undoDeleteBookmark() {
  if (!lastDeletedBookmark || !categories[lastDeletedBookmark.catIdx]) return false;
  const { catIdx, linkIdx, item } = lastDeletedBookmark;
  categories[catIdx].links.splice(linkIdx, 0, item);
  lastDeletedBookmark = null;
  localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
  renderCategories();
  if (typeof showToast === 'function') {
    showToast(`Raccourci "${item.name}" restauré !`, 'success');
  }
  return true;
}

function deleteBookmark(catIdx, linkIdx) {
  if (catIdx === null || linkIdx === null) return;
  const item = categories[catIdx]?.links[linkIdx];
  if (!item) return;
  lastDeletedBookmark = { catIdx, linkIdx, item };
  categories[catIdx].links.splice(linkIdx, 1);
  localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
  renderCategories();
  if (typeof showToast === 'function') {
    showToast(`Raccourci "${item.name}" supprimé • Ctrl+Z pour annuler`, 'info');
  }
}

// ----------------------------------------------------
// Glisser-Déposer (Drag and Drop)
// ----------------------------------------------------
function attachDragAndDropEvents() {
  const linkItems = document.querySelectorAll('.link-item[draggable="true"]');
  const linkLists = document.querySelectorAll('.link-list');

  linkItems.forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      didDragOccur = true;
      const catIdx = Number(item.dataset.cat);
      const linkIdx = Number(item.dataset.link);
      draggedData = { catIdx, linkIdx };

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
      setTimeout(() => item.classList.add('is-dragging'), 0);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('is-dragging');
      document.querySelectorAll('.link-item').forEach((el) => {
        el.classList.remove('drag-over-top', 'drag-over-bottom');
      });
      document.querySelectorAll('.category-card').forEach((el) => {
        el.classList.remove('drag-over-cat');
      });
      setTimeout(() => {
        didDragOccur = false;
        draggedData = null;
      }, 60);
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';

      const rect = item.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const isTop = e.clientY < midY;

      item.classList.toggle('drag-over-top', isTop);
      item.classList.toggle('drag-over-bottom', !isTop);
    });

    item.addEventListener('dragleave', (e) => {
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove('drag-over-top', 'drag-over-bottom');
      }
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      item.classList.remove('drag-over-top', 'drag-over-bottom');
      if (!draggedData) return;

      const targetCatIdx = Number(item.dataset.cat);
      const targetLinkIdx = Number(item.dataset.link);
      const rect = item.getBoundingClientRect();
      const isTop = e.clientY < rect.top + rect.height / 2;

      moveBookmark(draggedData.catIdx, draggedData.linkIdx, targetCatIdx, targetLinkIdx, isTop);
    });
  });

  linkLists.forEach((list) => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.closest('.category-card')?.classList.add('drag-over-cat');
    });

    list.addEventListener('dragleave', (e) => {
      if (!list.contains(e.relatedTarget)) {
        list.closest('.category-card')?.classList.remove('drag-over-cat');
      }
    });

    list.addEventListener('drop', (e) => {
      list.closest('.category-card')?.classList.remove('drag-over-cat');
      if (!draggedData) return;
      if (e.target === list || e.target.closest('.link-item-add-quick')) {
        e.preventDefault();
        const targetCatIdx = Number(list.dataset.cat);
        moveBookmark(draggedData.catIdx, draggedData.linkIdx, targetCatIdx, categories[targetCatIdx].links.length, false);
      }
    });
  });
}

function moveBookmark(srcCat, srcLink, dstCat, dstLink, insertBefore) {
  if (srcCat === null || srcLink === null) return;

  const itemToMove = categories[srcCat].links[srcLink];
  if (!itemToMove) return;

  // Retirer l'élément de sa catégorie d'origine
  categories[srcCat].links.splice(srcLink, 1);

  // Calculer le nouvel index dans la catégorie cible
  let insertionIndex = dstLink;
  if (srcCat === dstCat && srcLink < dstLink) {
    insertionIndex = Math.max(0, dstLink - 1);
  }
  if (!insertBefore) {
    insertionIndex += 1;
  }
  insertionIndex = Math.min(insertionIndex, categories[dstCat].links.length);

  categories[dstCat].links.splice(insertionIndex, 0, itemToMove);

  localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
  renderCategories();
}

// ----------------------------------------------------
// Modale d'édition d'un raccourci (Ajout ou Modification)
// ----------------------------------------------------
function openAddModal(catIdx) {
  openEditModal(catIdx, null);
}

function openEditModal(catIdx, linkIdx) {
  const editModal = document.getElementById('edit-modal');
  const modalTitle = document.getElementById('edit-modal-title');
  const editNameInput = document.getElementById('edit-name');
  const editUrlInput = document.getElementById('edit-url');
  const editIconInput = document.getElementById('edit-icon');
  const deleteBtn = document.getElementById('modal-delete-shortcut-btn');
  const submitBtn = document.getElementById('modal-submit-btn');

  currentEditingTarget = { catIdx, linkIdx };

  if (linkIdx !== null) {
    // Mode Modification
    const data = categories[catIdx].links[linkIdx];
    if (modalTitle) modalTitle.textContent = 'Modifier le raccourci';
    if (editNameInput) editNameInput.value = data.name;
    if (editUrlInput) editUrlInput.value = data.url;
    if (editIconInput) editIconInput.value = data.icon;
    updateIconPreview(data.icon);
    updateColorPickerUI(data.color || '');
    if (deleteBtn) deleteBtn.hidden = false;
    if (submitBtn) submitBtn.textContent = 'Enregistrer';
  } else {
    // Mode Ajout
    if (modalTitle) modalTitle.textContent = `Nouveau lien (${categories[catIdx]?.title || 'Catégorie'})`;
    if (editNameInput) editNameInput.value = '';
    if (editUrlInput) editUrlInput.value = 'https://';
    if (editIconInput) editIconInput.value = 'fa-solid fa-link';
    updateIconPreview('fa-solid fa-link');
    updateColorPickerUI('');
    if (deleteBtn) deleteBtn.hidden = true;
    if (submitBtn) submitBtn.textContent = 'Ajouter';
  }

  if (editModal) editModal.hidden = false;
  if (editNameInput) editNameInput.focus();
}

function closeEditModal() {
  const editModal = document.getElementById('edit-modal');
  if (editModal) editModal.hidden = true;
  currentEditingTarget = { catIdx: null, linkIdx: null };
}

function updateIconPreview(cls) {
  const editIconPreview = document.getElementById('edit-icon-preview');
  if (editIconPreview) {
    editIconPreview.className = cls || 'fa-solid fa-link';
  }
}

// ----------------------------------------------------
// Modale d'édition / création de catégorie
// ----------------------------------------------------
function openCategoryModal(catIdx = null) {
  const modal = document.getElementById('category-modal');
  const titleEl = document.getElementById('cat-modal-title');
  const nameInput = document.getElementById('cat-modal-name');
  const iconInput = document.getElementById('cat-modal-icon');
  const preview = document.getElementById('cat-modal-icon-preview');

  currentEditingCategoryIdx = catIdx;

  if (catIdx !== null) {
    const cat = categories[catIdx];
    if (titleEl) titleEl.textContent = 'Modifier la catégorie';
    if (nameInput) nameInput.value = cat.title;
    if (iconInput) iconInput.value = cat.icon;
    if (preview) preview.className = cat.icon;
  } else {
    if (titleEl) titleEl.textContent = 'Nouvelle catégorie';
    if (nameInput) nameInput.value = '';
    if (iconInput) iconInput.value = 'fa-solid fa-folder';
    if (preview) preview.className = 'fa-solid fa-folder';
  }

  if (modal) modal.hidden = false;
  if (nameInput) nameInput.focus();
}

function closeCategoryModal() {
  const modal = document.getElementById('category-modal');
  if (modal) modal.hidden = true;
  currentEditingCategoryIdx = null;
}

// ----------------------------------------------------
// Sauvegarde & Restauration (Export / Import JSON Complet)
// ----------------------------------------------------
function exportFullConfig() {
  let customFeeds = [];
  try { customFeeds = JSON.parse(localStorage.getItem('startpage_custom_feeds') || '[]'); } catch {}

  let todos = [];
  try { todos = JSON.parse(localStorage.getItem('startpage_todos_v2') || '[]'); } catch {}

  let topbarWidgetsData = null;
  try { topbarWidgetsData = JSON.parse(localStorage.getItem('startpage_topbar_widgets') || 'null'); } catch {}

  let appearanceData = null;
  try { appearanceData = JSON.parse(localStorage.getItem('startpage_appearance') || 'null'); } catch {}

  let portfolioData = null;
  try {
    portfolioData = JSON.parse(
      localStorage.getItem('violet_portfolio_tracker_v5') ||
      localStorage.getItem('violet_portfolio_tracker_v4') ||
      'null'
    );
  } catch {}

  const config = {
    app: 'violet-startpage',
    version: '2.1',
    exportDate: new Date().toISOString(),
    theme: localStorage.getItem('startpage_theme') || '1',
    promptPath: localStorage.getItem('startpage_prompt_path') || '~/startpage',
    weatherCity: localStorage.getItem('startpage_weather_city') || '',
    weatherFx: localStorage.getItem('startpage_weather_fx') !== 'false',
    scratchpad: localStorage.getItem('startpage_scratchpad_v2') || localStorage.getItem('startpage_scratchpad') || '',
    topbarWidgets: topbarWidgetsData,
    appearance: appearanceData,
    categories: categories,
    todos: todos,
    customFeeds: customFeeds,
    portfolio: portfolioData
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
  const downloadAnchor = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `startpage-backup-${today}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  if (typeof showToast === 'function') {
    showToast('Sauvegarde JSON complète téléchargée !', 'success');
  }
}

function importFullConfig(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (!data || (!data.categories && !data.todos)) {
        throw new Error('Format de fichier de configuration invalide');
      }

      if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
        localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
        renderCategories();
      }

      if (data.todos && Array.isArray(data.todos)) {
        localStorage.setItem('startpage_todos_v2', JSON.stringify(data.todos));
        if (typeof initTasks === 'function') initTasks();
      }

      if (data.customFeeds && Array.isArray(data.customFeeds)) {
        localStorage.setItem('startpage_custom_feeds', JSON.stringify(data.customFeeds));
        if (typeof initFeeds === 'function') initFeeds();
      }

      if (data.promptPath) {
        localStorage.setItem('startpage_prompt_path', data.promptPath);
        if (typeof setPromptPath === 'function') setPromptPath(data.promptPath);
      }

      if (data.scratchpad !== undefined) {
        localStorage.setItem('startpage_scratchpad_v2', data.scratchpad);
        localStorage.setItem('startpage_scratchpad', data.scratchpad);
        const scratchpadTextarea = document.getElementById('notes-editor');
        if (scratchpadTextarea) {
          scratchpadTextarea.value = data.scratchpad;
        }
      }

      if (data.topbarWidgets) {
        localStorage.setItem('startpage_topbar_widgets', JSON.stringify(data.topbarWidgets));
        if (typeof loadTopbarWidgetsSettings === 'function') loadTopbarWidgetsSettings();
        if (typeof applyTopbarWidgetsVisibility === 'function') applyTopbarWidgetsVisibility();
      }

      if (data.appearance) {
        localStorage.setItem('startpage_appearance', JSON.stringify(data.appearance));
        if (typeof loadAppearanceSettings === 'function') loadAppearanceSettings();
        if (typeof applyAppearance === 'function') applyAppearance();
      }

      if (data.weatherCity !== undefined) {
        localStorage.setItem('startpage_weather_city', data.weatherCity);
        if (typeof fetchWeather === 'function') fetchWeather();
      }

      if (data.weatherFx !== undefined) {
        localStorage.setItem('startpage_weather_fx', String(data.weatherFx));
        if (typeof toggleWeatherFx === 'function') toggleWeatherFx(data.weatherFx);
      }

      if (data.theme && typeof applyTheme === 'function') {
        applyTheme(data.theme);
      }

      if (data.portfolio && typeof data.portfolio === 'object') {
        localStorage.setItem('violet_portfolio_tracker_v5', JSON.stringify(data.portfolio));
        localStorage.setItem('violet_portfolio_tracker_v4', JSON.stringify(data.portfolio));
        if (typeof window.loadPortfolioState === 'function') {
          window.portfolioState = window.loadPortfolioState();
          if (typeof window.renderPortfolioModule === 'function') window.renderPortfolioModule();
        }
      }

      if (typeof showToast === 'function') {
        showToast('Configuration complète restaurée avec succès !', 'success');
      }
    } catch (err) {
      if (typeof showToast === 'function') {
        showToast('Erreur : fichier JSON non valide ou corrompu', 'error');
      }
    }
  };

  reader.readAsText(file);
}

// ----------------------------------------------------
// Initialisation du module
// ----------------------------------------------------
function initBookmarks() {
  try {
    const saved = localStorage.getItem('startpage_categories_v1');
    categories = saved ? JSON.parse(saved) : structuredClone(defaultCategories);
  } catch {
    categories = structuredClone(defaultCategories);
  }

  renderCategories();

  const editModal = document.getElementById('edit-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const deleteShortcutBtn = document.getElementById('modal-delete-shortcut-btn');
  const editForm = document.getElementById('edit-shortcut-form');
  const editNameInput = document.getElementById('edit-name');
  const editUrlInput = document.getElementById('edit-url');
  const editIconInput = document.getElementById('edit-icon');
  const categoriesContainer = document.getElementById('categories-container');

  // Modale de catégorie
  const catModal = document.getElementById('category-modal');
  const catModalCloseBtn = document.getElementById('cat-modal-close');
  const catModalCancelBtn = document.getElementById('cat-modal-cancel');
  const catModalForm = document.getElementById('category-form');
  const catNameInput = document.getElementById('cat-modal-name');
  const catIconInput = document.getElementById('cat-modal-icon');
  const catIconPreview = document.getElementById('cat-modal-icon-preview');
  const resetAllBtn = document.getElementById('reset-all-shortcuts-btn');

  // Clic sur un lien en mode édition = ouvrir la modale de modification
  if (categoriesContainer) {
    categoriesContainer.addEventListener('click', (e) => {
      if (!isEditMode) return;
      if (didDragOccur) return;

      // Si le clic provient d'un bouton d'action ou de suppression rapide, ne rien faire ici
      if (e.target.closest('.link-delete-badge') || e.target.closest('.cat-tool-btn') || e.target.closest('.link-item-add-quick')) {
        return;
      }

      const linkEl = e.target.closest('.link-item');
      if (!linkEl) return;

      e.preventDefault();
      const catIdx = Number(linkEl.dataset.cat);
      const linkIdx = Number(linkEl.dataset.link);
      openEditModal(catIdx, linkIdx);
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeEditModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeEditModal);

  if (deleteShortcutBtn) {
    deleteShortcutBtn.addEventListener('click', () => {
      const { catIdx, linkIdx } = currentEditingTarget;
      if (catIdx !== null && linkIdx !== null) {
        deleteBookmark(catIdx, linkIdx);
        closeEditModal();
      }
    });
  }

  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) closeEditModal();
    });
  }

  if (editIconInput) {
    editIconInput.addEventListener('input', () => {
      updateIconPreview(editIconInput.value.trim());
    });
  }

  document.querySelectorAll('.q-icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const iconCls = btn.dataset.icon;
      if (editIconInput) {
        editIconInput.value = iconCls;
        updateIconPreview(iconCls);
      }
    });
  });

  // Sélecteur de couleur néon pour le raccourci
  document.querySelectorAll('.color-dot-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color || 'auto';
      updateColorPickerUI(color);
    });
  });

  const customColorInput = document.getElementById('edit-custom-color');
  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      updateColorPickerUI(e.target.value);
    });
  }

  // Soumission du formulaire de raccourci (Ajout ou Modification)
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { catIdx, linkIdx } = currentEditingTarget;
      if (catIdx === null) return;

      const colorValEl = document.getElementById('edit-color-val');
      const chosenColor = colorValEl ? colorValEl.value.trim() : '';

      const newBookmark = {
        name: editNameInput.value.trim(),
        url: editUrlInput.value.trim(),
        icon: editIconInput.value.trim() || 'fa-solid fa-link'
      };

      if (chosenColor && chosenColor !== 'auto') {
        newBookmark.color = chosenColor;
      }

      if (linkIdx === null) {
        // Ajout
        categories[catIdx].links.push(newBookmark);
        if (typeof showToast === 'function') {
          showToast(`Nouveau raccourci "${newBookmark.name}" ajouté !`, 'success');
        }
      } else {
        // Modification
        categories[catIdx].links[linkIdx] = newBookmark;
        if (typeof showToast === 'function') {
          showToast(`Raccourci "${newBookmark.name}" mis à jour`, 'success');
        }
      }

      localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
      renderCategories();
      closeEditModal();
    });
  }

  // Gestion du formulaire de catégorie
  if (catModalCloseBtn) catModalCloseBtn.addEventListener('click', closeCategoryModal);
  if (catModalCancelBtn) catModalCancelBtn.addEventListener('click', closeCategoryModal);
  if (catModal) {
    catModal.addEventListener('click', (e) => {
      if (e.target === catModal) closeCategoryModal();
    });
  }

  if (catIconInput) {
    catIconInput.addEventListener('input', () => {
      if (catIconPreview) catIconPreview.className = catIconInput.value.trim() || 'fa-solid fa-folder';
    });
  }

  document.querySelectorAll('.q-cat-icon-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const iconCls = btn.dataset.icon;
      if (catIconInput) catIconInput.value = iconCls;
      if (catIconPreview) catIconPreview.className = iconCls;
    });
  });

  if (catModalForm) {
    catModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (catNameInput?.value || '').trim();
      const icon = (catIconInput?.value || '').trim() || 'fa-solid fa-folder';
      if (!title) return;

      if (currentEditingCategoryIdx !== null) {
        // Mise à jour
        categories[currentEditingCategoryIdx].title = title;
        categories[currentEditingCategoryIdx].icon = icon;
        if (typeof showToast === 'function') {
          showToast(`Catégorie "${title}" mise à jour`, 'success');
        }
      } else {
        // Nouvelle catégorie
        categories.push({
          id: `cat_${Date.now()}`,
          title,
          icon,
          links: []
        });
        if (typeof showToast === 'function') {
          showToast(`Catégorie "${title}" créée avec succès !`, 'success');
        }
      }

      localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
      renderCategories();
      closeCategoryModal();
    });
  }

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment restaurer tous les raccourcis d\'origine ?')) {
        categories = structuredClone(defaultCategories);
        localStorage.setItem('startpage_categories_v1', JSON.stringify(categories));
        renderCategories();
        closeEditModal();
        if (typeof showToast === 'function') {
          showToast('Raccourcis par défaut restaurés', 'info');
        }
      }
    });
  }
}
