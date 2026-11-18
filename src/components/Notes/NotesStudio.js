import './notes.css';

const DEFAULT_DOCUMENTS = [
  {
    id: 'notes-md',
    name: 'notes.md',
    content: `# 📝 Bloc-Notes & Studio Markdown (Violet Cockpit)

Bienvenue dans votre espace d'écriture épuré et ultra-rapide.

- [x] Initialiser le projet Electron + Vite (Session 1)
- [x] Intégrer les 5 thèmes & Navigation Cockpit (Session 2)
- [x] Station Horloge, Omnibox & Signets (Session 3)
- [x] Passerelle Marchés & Bourse sans Python (Session 4)
- [x] Agenda, Tâches, Météo & Minuteur Pomodoro (Session 5)
- [ ] Finaliser le Studio Markdown, Flux RSS & Audio Lo-Fi (Session 6)

> "La simplicité est la condition préalable absolue de la fiabilité." — Edsger W. Dijkstra

### Raccourcis & Fonctionnalités
* **Aperçu en direct** : Cliquez sur le bouton *Aperçu Markdown* pour basculer.
* **Export local** : Cliquez sur *Exporter .md* pour sauvegarder directement votre fichier sur le bureau via Electron.
`,
  },
  {
    id: 'scratchpad-md',
    name: 'scratchpad.md',
    content: `# 💡 Idées & Liens Rapides

Collez ici vos mémos temporaires, snippets de code ou liens de veille.
`,
  },
];

export class NotesStudio {
  constructor(container) {
    this.container = container;
    this.documents = DEFAULT_DOCUMENTS;
    this.activeDocId = 'notes-md';
    this.isPreviewMode = false;
    this.debounceSaveTimer = null;
    this.init();
  }

  async init() {
    await this.loadDocuments();
    this.render();
    this.bindEvents();
    this.updateStats();
  }

  async loadDocuments() {
    try {
      const stored = await window.desktopAPI?.getStore('notes_documents');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        this.documents = stored;
        return;
      }
      const local = localStorage.getItem('violet_notes_docs');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.documents = parsed;
        }
      }
    } catch (_) {}
  }

  async saveDocuments() {
    try {
      localStorage.setItem('violet_notes_docs', JSON.stringify(this.documents));
      await window.desktopAPI?.setStore('notes_documents', this.documents);
    } catch (_) {}
  }

  getCurrentDoc() {
    return this.documents.find((d) => d.id === this.activeDocId) || this.documents[0];
  }

  render() {
    const doc = this.getCurrentDoc();

    this.container.innerHTML = `
      <section class="notes-hub" id="notes-hub">
        <!-- Barre supérieure avec onglets & actions -->
        <div class="notes-top-bar">
          <div class="notes-tabs-row" id="notes-tabs">
            ${this.documents
              .map(
                (d) => `
              <button
                type="button"
                class="note-tab-btn ${d.id === this.activeDocId ? 'active' : ''}"
                data-doc-id="${d.id}"
              >
                <span>📄 ${escapeHtml(d.name)}</span>
                ${this.documents.length > 1 ? `<span class="note-tab-close" data-close-id="${d.id}">✕</span>` : ''}
              </button>
            `
              )
              .join('')}
            <button type="button" class="note-new-tab-btn" id="note-new-tab" title="Nouveau document">+</button>
          </div>

          <div class="notes-actions-group">
            <button type="button" class="notes-tool-btn" id="notes-toggle-preview">
              <span id="preview-icon">👁️</span>
              <span id="preview-label">Aperçu Markdown</span>
            </button>
            <button type="button" class="notes-export-btn" id="notes-export-btn">
              <span>💾 Exporter .md</span>
            </button>
          </div>
        </div>

        <!-- Cadre éditeur -->
        <div class="notes-editor-frame">
          <!-- Barre d'outils Markdown rapide -->
          <div class="markdown-quick-bar" id="md-quick-bar">
            <button type="button" class="md-insert-btn" data-syntax="h1"># H1</button>
            <button type="button" class="md-insert-btn" data-syntax="h2">## H2</button>
            <button type="button" class="md-insert-btn" data-syntax="bold">**Gras**</button>
            <button type="button" class="md-insert-btn" data-syntax="italic">*Italique*</button>
            <button type="button" class="md-insert-btn" data-syntax="quote">&gt; Citation</button>
            <button type="button" class="md-insert-btn" data-syntax="list">- Liste</button>
            <button type="button" class="md-insert-btn" data-syntax="task">- [ ] Tâche</button>
            <button type="button" class="md-insert-btn" data-syntax="code">\`Code\`</button>
            <button type="button" class="md-insert-btn" data-syntax="codeblock">\`\`\` Bloc</button>
          </div>

          <!-- Zone centrale de texte & rendu -->
          <div class="notes-content-area">
            <textarea
              class="notes-textarea"
              id="notes-textarea"
              placeholder="Rédigez en Markdown..."
              spellcheck="false"
            >${escapeHtml(doc.content)}</textarea>

            <div class="notes-preview-pane" id="notes-preview" style="display: none;"></div>
          </div>

          <!-- Barre de statut inférieure -->
          <div class="notes-status-bar">
            <span id="notes-stats-info">0 mot • 0 car.</span>
            <span id="notes-status-state">Prêt</span>
          </div>
        </div>
      </section>
    `;

    this.textarea = this.container.querySelector('#notes-textarea');
    this.previewPane = this.container.querySelector('#notes-preview');
    this.statsInfo = this.container.querySelector('#notes-stats-info');
    this.statusState = this.container.querySelector('#notes-status-state');
  }

  bindEvents() {
    // Saisie continue dans le textarea
    this.textarea?.addEventListener('input', () => {
      const doc = this.getCurrentDoc();
      if (doc) {
        doc.content = this.textarea.value;
        this.updateStats();

        if (this.statusState) this.statusState.textContent = 'Enregistrement...';
        clearTimeout(this.debounceSaveTimer);
        this.debounceSaveTimer = setTimeout(() => {
          this.saveDocuments();
          if (this.statusState) this.statusState.textContent = 'Sauvegardé en local';
        }, 600);
      }
    });

    // Bascule Aperçu
    const toggleBtn = this.container.querySelector('#notes-toggle-preview');
    toggleBtn?.addEventListener('click', () => {
      this.togglePreview();
    });

    // Bouton Export
    const exportBtn = this.container.querySelector('#notes-export-btn');
    exportBtn?.addEventListener('click', () => {
      this.exportCurrentDocument();
    });

    // Changement d'onglet
    this.container.querySelectorAll('.note-tab-btn[data-doc-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (e.target.classList.contains('note-tab-close')) return;
        const id = btn.getAttribute('data-doc-id');
        if (id && id !== this.activeDocId) {
          this.activeDocId = id;
          this.render();
          this.bindEvents();
          this.updateStats();
        }
      });
    });

    // Fermeture d'onglet
    this.container.querySelectorAll('.note-tab-close').forEach((closeBtn) => {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = closeBtn.getAttribute('data-close-id');
        this.deleteDocument(id);
      });
    });

    // Nouveau document
    const newTabBtn = this.container.querySelector('#note-new-tab');
    newTabBtn?.addEventListener('click', () => {
      this.createNewDocument();
    });

    // Boutons de syntaxe Markdown rapide
    this.container.querySelectorAll('.md-insert-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const syntax = btn.getAttribute('data-syntax');
        this.insertSyntax(syntax);
      });
    });
  }

  insertSyntax(syntax) {
    if (!this.textarea) return;
    if (this.isPreviewMode) this.togglePreview();

    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const text = this.textarea.value;
    const selected = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (syntax) {
      case 'h1':
        replacement = `# ${selected || 'Titre H1'}`;
        break;
      case 'h2':
        replacement = `## ${selected || 'Titre H2'}`;
        break;
      case 'bold':
        replacement = `**${selected || 'texte en gras'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'texte en italique'}*`;
        break;
      case 'quote':
        replacement = `> ${selected || 'Citation'}`;
        break;
      case 'list':
        replacement = `- ${selected || 'Élément'}`;
        break;
      case 'task':
        replacement = `- [ ] ${selected || 'Nouvelle tâche'}`;
        break;
      case 'code':
        replacement = `\`${selected || 'code'}\``;
        break;
      case 'codeblock':
        replacement = `\`\`\`javascript\n${selected || '// code'}\n\`\`\``;
        break;
    }

    this.textarea.value = text.substring(0, start) + replacement + text.substring(end);
    this.textarea.focus();
    this.textarea.setSelectionRange(start + replacement.length, start + replacement.length);

    const doc = this.getCurrentDoc();
    if (doc) doc.content = this.textarea.value;
    this.saveDocuments();
    this.updateStats();
  }

  togglePreview() {
    this.isPreviewMode = !this.isPreviewMode;
    const label = this.container.querySelector('#preview-label');
    const toggleBtn = this.container.querySelector('#notes-toggle-preview');

    if (this.isPreviewMode) {
      if (this.previewPane) {
        this.previewPane.innerHTML = this.renderMarkdownToHtml(this.textarea.value);
        this.previewPane.style.display = 'block';
      }
      if (this.textarea) this.textarea.style.display = 'none';
      if (label) label.textContent = 'Mode Édition';
      toggleBtn?.classList.add('active');
    } else {
      if (this.previewPane) this.previewPane.style.display = 'none';
      if (this.textarea) {
        this.textarea.style.display = 'block';
        this.textarea.focus();
      }
      if (label) label.textContent = 'Aperçu Markdown';
      toggleBtn?.classList.remove('active');
    }
  }

  renderMarkdownToHtml(md) {
    if (!md || !md.trim()) {
      return '<p style="color: var(--text-dim); font-style: italic;">Note vierge.</p>';
    }

    // Échappement anti-XSS
    let text = escapeHtml(md);

    // Blocs de code
    text = text.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      return `<pre><div style="font-size: 0.72rem; color: var(--text-dim); margin-bottom: 4px;">${lang || 'code'}</div><code>${code.trim()}</code></pre>`;
    });

    // Titres
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Citations
    text = text.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Listes de tâches
    text = text.replace(/^- \[x\] (.*$)/gim, '<li><input type="checkbox" checked disabled> $1</li>');
    text = text.replace(/^- \[ \] (.*$)/gim, '<li><input type="checkbox" disabled> $1</li>');

    // Listes standard
    text = text.replace(/^- (.*$)/gim, '<li>$1</li>');
    text = text.replace(/^\* (.*$)/gim, '<li>$1</li>');

    // Code en ligne
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Gras et Italique
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Paragraphes
    text = text.replace(/\n\n+/g, '</p><p>');
    text = text.replace(/\n/g, '<br />');

    return `<p>${text}</p>`;
  }

  async exportCurrentDocument() {
    const doc = this.getCurrentDoc();
    if (!doc) return;

    if (this.statusState) this.statusState.textContent = 'Exportation en cours...';

    // 1. Appel du dialog natif Electron
    try {
      if (window.desktopAPI?.exportNote) {
        const res = await window.desktopAPI.exportNote(doc.name, doc.content);
        if (res?.success) {
          if (this.statusState) this.statusState.textContent = `Exporté : ${res.filePath}`;
          return;
        }
      }
    } catch (_) {}

    // 2. Fallback téléchargement Blob
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (this.statusState) this.statusState.textContent = 'Fichier téléchargé';
  }

  createNewDocument() {
    const num = this.documents.length + 1;
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: `note-${num}.md`,
      content: `# Nouvelle Note ${num}\n\nRédigez vos notes ici...\n`,
    };
    this.documents.push(newDoc);
    this.activeDocId = newDoc.id;
    this.saveDocuments();
    this.render();
    this.bindEvents();
    this.updateStats();
  }

  deleteDocument(id) {
    if (this.documents.length <= 1) return;
    this.documents = this.documents.filter((d) => d.id !== id);
    if (this.activeDocId === id) {
      this.activeDocId = this.documents[0].id;
    }
    this.saveDocuments();
    this.render();
    this.bindEvents();
    this.updateStats();
  }

  updateStats() {
    if (!this.textarea || !this.statsInfo) return;
    const text = this.textarea.value;
    const words = (text.trim().match(/\S+/g) || []).length;
    const chars = text.length;
    const lines = text.split('\n').length;
    this.statsInfo.textContent = `${words} mot${words > 1 ? 's' : ''} • ${chars} car. • ${lines} ligne${lines > 1 ? 's' : ''}`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
