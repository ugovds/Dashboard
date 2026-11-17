/**
 * js/notes.js - Bloc-Notes Markdown & Scratchpad Haute Performance
 * Violet Startpage - Version allégée, instantanée et sans dépendances lourdes
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'startpage_notes_buffers';
  const ACTIVE_TAB_KEY = 'startpage_notes_active_id';

  const DEFAULT_BUFFERS = [
    {
      id: 'notes-md',
      name: 'notes.md',
      lang: 'markdown',
      content: `# 📝 Bloc-Notes & Scratchpad Markdown\n\n- [x] Optimiser le temps de chargement de la startpage\n- [ ] Suivre les cotations des marchés en direct\n- [ ] Organiser les favoris et widgets\n\n> "La simplicité est la condition préalable absolue de la fiabilité." — Edsger W. Dijkstra\n\n### Raccourcis utiles\n* Basculer l'aperçu rendu : Cliquez sur le bouton **M↓**\n* Exporter en fichier : Bouton **Télécharger** pour sauvegarder votre \`.md\`\n`
    },
    {
      id: 'scratchpad-md',
      name: 'scratchpad.md',
      lang: 'markdown',
      content: `# 💡 Idées & Liens temporaires\n\nCollez ici vos liens rapides, fragments de texte ou mémos du jour.\n`
    }
  ];

  let buffers = [];
  let activeBufferId = 'notes-md';
  let isPreviewMode = false;
  let saveDebounceTimer = null;

  // Éléments du DOM
  let editorEl = null;
  let previewEl = null;
  let lineNumbersEl = null;
  let tabsContainerEl = null;
  let cursorPosEl = null;
  let statsInfoEl = null;
  let linesCountEl = null;
  let statusTextEl = null;
  let mdToggleBtn = null;

  function loadBuffers() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          buffers = parsed.map(b => ({
            id: b.id || `buf_${Date.now()}`,
            name: (b.name && b.name.endsWith('.md')) ? b.name : `${b.name || 'note'}.md`,
            lang: 'markdown',
            content: typeof b.content === 'string' ? b.content : ''
          }));
        }
      }
    } catch {}

    if (!buffers || buffers.length === 0) {
      buffers = [...DEFAULT_BUFFERS];
    }

    const savedActive = localStorage.getItem(ACTIVE_TAB_KEY);
    if (savedActive && buffers.some(b => b.id === savedActive)) {
      activeBufferId = savedActive;
    } else {
      activeBufferId = buffers[0].id;
    }
  }

  function saveBuffers() {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(buffers));
        localStorage.setItem(ACTIVE_TAB_KEY, activeBufferId);
        if (statusTextEl) {
          statusTextEl.textContent = 'Sauvegardé en local';
        }
      } catch {}
    }, 150);
  }

  function getActiveBuffer() {
    return buffers.find(b => b.id === activeBufferId) || buffers[0];
  }

  function renderTabs() {
    if (!tabsContainerEl) return;
    tabsContainerEl.innerHTML = '';

    buffers.forEach((buf) => {
      const tab = document.createElement('div');
      const isActive = buf.id === activeBufferId;
      tab.className = `studio-file-tab ${isActive ? 'active' : ''}`;
      tab.dataset.bufId = buf.id;

      tab.innerHTML = `
        <i class="fa-brands fa-markdown text-accent"></i>
        <span class="file-tab-name">${escapeHtml(buf.name)}</span>
        ${buffers.length > 1 ? '<button type="button" class="file-tab-close" title="Fermer ce document">&times;</button>' : ''}
      `;

      tab.addEventListener('click', (e) => {
        if (e.target.closest('.file-tab-close')) {
          e.stopPropagation();
          closeBuffer(buf.id);
          return;
        }
        switchBuffer(buf.id);
      });

      tabsContainerEl.appendChild(tab);
    });
  }

  function switchBuffer(id) {
    const current = getActiveBuffer();
    if (current && editorEl) {
      current.content = editorEl.value;
    }

    activeBufferId = id;
    const target = getActiveBuffer();
    if (target && editorEl) {
      editorEl.value = target.content;
      updateLineNumbers();
      updateStats();
      if (isPreviewMode) renderMarkdownPreview();
    }
    renderTabs();
    saveBuffers();
  }

  function closeBuffer(id) {
    if (buffers.length <= 1) return;
    const idx = buffers.findIndex(b => b.id === id);
    if (idx === -1) return;

    buffers.splice(idx, 1);
    if (activeBufferId === id) {
      activeBufferId = buffers[Math.max(0, idx - 1)].id;
    }
    switchBuffer(activeBufferId);
  }

  function createNewBuffer() {
    const count = buffers.length + 1;
    const newId = `note_${Date.now()}`;
    const newBuf = {
      id: newId,
      name: `note-${count}.md`,
      lang: 'markdown',
      content: `# Nouvelle Note ${count}\n\n`
    };
    buffers.push(newBuf);
    switchBuffer(newId);
    if (editorEl) editorEl.focus();
    if (typeof showToast === 'function') {
      showToast(`Fichier "${newBuf.name}" créé`, 'info');
    }
  }

  function updateLineNumbers() {
    if (!lineNumbersEl || !editorEl) return;
    const lines = editorEl.value.split('\n').length;
    let gutter = '';
    for (let i = 1; i <= lines; i++) {
      gutter += `${i}\n`;
    }
    lineNumbersEl.textContent = gutter.trimEnd();
  }

  function updateStats() {
    if (!editorEl) return;
    const text = editorEl.value;
    const words = (text.trim().match(/\S+/g) || []).length;
    const chars = text.length;
    const lines = text.split('\n').length;

    if (statsInfoEl) {
      statsInfoEl.textContent = `${words} ${words > 1 ? 'mots' : 'mot'} • ${chars} car.`;
    }
    if (linesCountEl) {
      linesCountEl.textContent = `${lines} ${lines > 1 ? 'lignes' : 'ligne'}`;
    }
  }

  function updateCursorPos() {
    if (!editorEl || !cursorPosEl) return;
    const pos = editorEl.selectionStart || 0;
    const sub = editorEl.value.substring(0, pos);
    const line = sub.split('\n').length;
    const col = pos - sub.lastIndexOf('\n');
    cursorPosEl.textContent = `Ln ${line}, Col ${col}`;
  }

  function renderMarkdownPreview() {
    if (!previewEl || !editorEl) return;
    const renderFn = window.renderMarkdownToHtml || ((t) => `<div class="md-content"><pre>${escapeHtml(t)}</pre></div>`);
    previewEl.innerHTML = renderFn(editorEl.value);
  }

  function togglePreview() {
    if (!previewEl || !editorEl) return;
    isPreviewMode = !isPreviewMode;

    if (isPreviewMode) {
      renderMarkdownPreview();
      previewEl.hidden = false;
      editorEl.style.display = 'none';
      if (mdToggleBtn) mdToggleBtn.classList.add('active');
      if (statusTextEl) statusTextEl.textContent = 'Mode Aperçu Markdown (Lecture)';
    } else {
      previewEl.hidden = true;
      editorEl.style.display = '';
      if (mdToggleBtn) mdToggleBtn.classList.remove('active');
      if (statusTextEl) statusTextEl.textContent = 'Sauvegardé en local';
      editorEl.focus();
    }
  }

  function insertMarkdownSyntax(type) {
    if (!editorEl || isPreviewMode) return;
    const start = editorEl.selectionStart;
    const end = editorEl.selectionEnd;
    const val = editorEl.value;
    const selected = val.substring(start, end);

    let insertion = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        insertion = `**${selected || 'texte gras'}**`;
        cursorOffset = selected ? insertion.length : 2;
        break;
      case 'italic':
        insertion = `*${selected || 'texte italique'}*`;
        cursorOffset = selected ? insertion.length : 1;
        break;
      case 'heading':
        insertion = `\n## ${selected || 'Titre'}\n`;
        cursorOffset = insertion.length;
        break;
      case 'code':
        insertion = `\n\`\`\`markdown\n${selected || '// Votre code'}\n\`\`\`\n`;
        cursorOffset = insertion.length;
        break;
      case 'inline-code':
        insertion = `\`${selected || 'code'}\``;
        cursorOffset = selected ? insertion.length : 1;
        break;
      case 'link':
        insertion = `[${selected || 'Titre du lien'}](https://)`;
        cursorOffset = insertion.length - 1;
        break;
      case 'task':
        insertion = `\n- [ ] ${selected || 'Nouvelle tâche'}`;
        cursorOffset = insertion.length;
        break;
      case 'list':
        insertion = `\n* ${selected || 'Élément'}`;
        cursorOffset = insertion.length;
        break;
      case 'quote':
        insertion = `\n> ${selected || 'Citation'}\n`;
        cursorOffset = insertion.length;
        break;
      case 'hr':
        insertion = `\n---\n`;
        cursorOffset = insertion.length;
        break;
      default:
        return;
    }

    editorEl.value = val.substring(0, start) + insertion + val.substring(end);
    editorEl.focus();
    editorEl.setSelectionRange(start + cursorOffset, start + cursorOffset);

    const curr = getActiveBuffer();
    if (curr) curr.content = editorEl.value;
    updateLineNumbers();
    updateStats();
    saveBuffers();
  }

  function downloadCurrentNote() {
    if (!editorEl) return;
    const buf = getActiveBuffer();
    const content = editorEl.value;
    const filename = buf.name.endsWith('.md') ? buf.name : `${buf.name}.md`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    if (typeof showToast === 'function') {
      showToast(`Note "${filename}" téléchargée`, 'success');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initNotes() {
    if (initNotes._initialized) return;
    initNotes._initialized = true;

    editorEl = document.getElementById('notes-editor');
    previewEl = document.getElementById('notes-preview');
    lineNumbersEl = document.getElementById('studio-line-numbers');
    tabsContainerEl = document.getElementById('studio-file-tabs');
    cursorPosEl = document.getElementById('studio-cursor-pos');
    statsInfoEl = document.getElementById('notes-stats-info');
    linesCountEl = document.getElementById('studio-lines-count');
    statusTextEl = document.getElementById('notes-status-text');
    mdToggleBtn = document.getElementById('notes-markdown-toggle');

    if (!editorEl) return;

    loadBuffers();
    renderTabs();

    const activeBuf = getActiveBuffer();
    editorEl.value = activeBuf.content;
    updateLineNumbers();
    updateStats();

    // Synchronisation défilement lignes / textarea
    editorEl.addEventListener('scroll', () => {
      if (lineNumbersEl) {
        lineNumbersEl.scrollTop = editorEl.scrollTop;
      }
    });

    // Saisie dans l'éditeur
    editorEl.addEventListener('input', () => {
      const curr = getActiveBuffer();
      if (curr) curr.content = editorEl.value;
      updateLineNumbers();
      updateStats();
      if (statusTextEl) statusTextEl.textContent = 'Enregistrement...';
      saveBuffers();
    });

    // Mouvements du curseur
    editorEl.addEventListener('keyup', updateCursorPos);
    editorEl.addEventListener('click', updateCursorPos);

    // Support Tabulation dans le bloc-notes
    editorEl.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editorEl.selectionStart;
        const end = editorEl.selectionEnd;
        editorEl.value = editorEl.value.substring(0, start) + '  ' + editorEl.value.substring(end);
        editorEl.selectionStart = editorEl.selectionEnd = start + 2;
        const curr = getActiveBuffer();
        if (curr) curr.content = editorEl.value;
        saveBuffers();
      }
    });

    // Raccourci Ctrl+S pour sauvegarder immédiatement
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        const notesView = document.getElementById('deck-view-notes');
        if (notesView && !notesView.hidden) {
          e.preventDefault();
          saveBuffers();
          if (typeof showToast === 'function') {
            showToast('Note enregistrée en local !', 'success');
          }
        }
      }
    });

    // Boutons de la barre Markdown
    document.querySelectorAll('.md-tool-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        insertMarkdownSyntax(btn.dataset.md);
      });
    });

    // Bouton de bascule Aperçu Markdown
    if (mdToggleBtn) {
      mdToggleBtn.addEventListener('click', togglePreview);
    }

    // Bouton Copier
    const copyBtn = document.getElementById('notes-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        if (!editorEl.value.trim()) return;
        try {
          await navigator.clipboard.writeText(editorEl.value);
          if (typeof showToast === 'function') showToast('Texte copié dans le presse-papier !', 'success');
        } catch {
          editorEl.select();
          document.execCommand('copy');
          if (typeof showToast === 'function') showToast('Copié !', 'success');
        }
      });
    }

    // Bouton Télécharger
    const downloadBtn = document.getElementById('notes-download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadCurrentNote);
    }

    // Bouton Effacer
    const clearBtn = document.getElementById('notes-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment effacer le contenu de cette note ?')) {
          const curr = getActiveBuffer();
          if (curr) curr.content = '';
          editorEl.value = '';
          saveBuffers();
          updateLineNumbers();
          updateStats();
          if (previewEl) previewEl.innerHTML = '';
          if (typeof showToast === 'function') showToast('Note effacée', 'info');
        }
      });
    }

    // Bouton Nouveau Document (+)
    const newTabBtn = document.getElementById('studio-new-tab-btn');
    if (newTabBtn) {
      newTabBtn.addEventListener('click', createNewBuffer);
    }
  }

  // Initialisation paresseuse (Lazy) si le DOM est déjà prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotes);
  } else {
    initNotes();
  }

  window.initNotes = initNotes;
})();
