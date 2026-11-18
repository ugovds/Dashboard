import './agenda.css';

export class AgendaView {
  constructor(container) {
    this.container = container;
    this.currentCalDate = new Date();
    this.selectedDateFilter = null;
    this.statusFilter = 'all'; // 'all', 'pending', 'done', 'today'
    this.todos = [];
    this.init();
  }

  async init() {
    await this.loadTasks();
    this.render();
    this.bindEvents();
  }

  toISODate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  async loadTasks() {
    try {
      const stored = await window.desktopAPI?.getStore('agenda_todos');
      if (stored && Array.isArray(stored)) {
        this.todos = stored;
        return;
      }
      const local = localStorage.getItem('violet_todos');
      if (local) {
        this.todos = JSON.parse(local);
        return;
      }
    } catch (_) {}

    // Tâches par défaut
    const todayStr = this.toISODate(new Date());
    this.todos = [
      { id: '1', title: 'Session 5 : Organisation & Notifications OS', date: todayStr, priority: 'urgent', done: false },
      { id: '2', title: 'Suivre l\'évolution du portefeuille boursier', date: todayStr, priority: 'normal', done: true },
      { id: '3', title: 'Session focus Pomodoro 25 min (Code & Zen)', date: todayStr, priority: 'normal', done: false },
    ];
  }

  async saveTasks() {
    try {
      localStorage.setItem('violet_todos', JSON.stringify(this.todos));
      await window.desktopAPI?.setStore('agenda_todos', this.todos);
    } catch (_) {}
  }

  render() {
    this.container.innerHTML = `
      <section class="agenda-hub" id="agenda-hub">
        <!-- En-tête -->
        <div class="agenda-header-row">
          <div class="agenda-title-wrap">
            <h1 class="agenda-main-title">AGENDA & TÂCHES</h1>
            <span class="agenda-stats-badge" id="agenda-stats-badge">0 tâche</span>
          </div>
        </div>

        <!-- 2 Colonnes : Calendrier à gauche, Tâches à droite -->
        <div class="agenda-split-grid">
          <!-- 1. Mini-Calendrier -->
          <div class="calendar-card" id="cal-card">
            <div class="calendar-nav-header">
              <span class="cal-month-title" id="cal-month-title">--</span>
              <div class="cal-nav-buttons">
                <button type="button" class="cal-nav-btn" id="cal-prev-btn" title="Mois précédent">&lt;</button>
                <button type="button" class="cal-nav-btn" id="cal-next-btn" title="Mois suivant">&gt;</button>
              </div>
            </div>

            <!-- Jours semaine -->
            <div class="calendar-weekdays-row">
              <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>

            <!-- Grille des jours -->
            <div class="calendar-days-grid" id="cal-days-grid"></div>

            <!-- Bannière si filtre date actif -->
            <div class="cal-active-filter-banner" id="cal-filter-banner" style="display: none;">
              <span>Filtre : <strong id="cal-filter-date-text">--</strong></span>
              <button type="button" class="cal-clear-filter-btn" id="cal-clear-filter-btn">Effacer</button>
            </div>
          </div>

          <!-- 2. Gestionnaire de Tâches -->
          <div class="tasks-panel-card" id="tasks-card">
            <!-- Formulaire ajout rapide -->
            <form class="task-add-form" id="task-add-form">
              <input
                type="text"
                class="task-input-text"
                id="task-input-title"
                placeholder="Ajouter une tâche et appuyer sur Entrée..."
                required
              />
              <input
                type="date"
                class="task-input-date"
                id="task-input-date"
                value="${this.toISODate(new Date())}"
              />
              <select class="task-priority-select" id="task-input-priority">
                <option value="urgent">🔴 Urgent</option>
                <option value="normal" selected>🟡 Normal</option>
                <option value="low">🟢 Faible</option>
              </select>
              <button type="submit" class="task-add-btn">+ Ajouter</button>
            </form>

            <!-- Barre de filtres & progression -->
            <div class="tasks-toolbar">
              <div class="task-filter-chips">
                <button type="button" class="filter-chip active" data-filter="all">Toutes</button>
                <button type="button" class="filter-chip" data-filter="pending">À faire</button>
                <button type="button" class="filter-chip" data-filter="done">Faites</button>
                <button type="button" class="filter-chip" data-filter="today">Aujourd'hui</button>
              </div>

              <div class="task-progress-box">
                <span id="task-progress-text">0%</span>
                <div class="task-progress-bar">
                  <div class="task-progress-fill" id="task-progress-fill" style="width: 0%;"></div>
                </div>
              </div>
            </div>

            <!-- Liste des tâches -->
            <div class="tasks-list-container" id="tasks-list"></div>
          </div>
        </div>
      </section>
    `;

    this.renderCalendar();
    this.renderTasks();
  }

  renderCalendar() {
    const year = this.currentCalDate.getFullYear();
    const month = this.currentCalDate.getMonth();
    const todayStr = this.toISODate(new Date());

    const titleEl = this.container.querySelector('#cal-month-title');
    if (titleEl) {
      titleEl.textContent = this.currentCalDate.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      });
    }

    // Mapping des dates de tâches
    const taskDates = new Set(this.todos.map((t) => t.date).filter(Boolean));

    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = (firstDay + 6) % 7; // Lundi = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysGrid = this.container.querySelector('#cal-days-grid');
    if (!daysGrid) return;

    let html = '';
    for (let i = 0; i < startOffset; i++) {
      html += `<div class="cal-day-cell empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = iso === todayStr;
      const isSelected = iso === this.selectedDateFilter;
      const hasTasks = taskDates.has(iso);

      let classes = 'cal-day-cell';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';

      html += `
        <div class="${classes}" data-date="${iso}">
          <span>${d}</span>
          ${hasTasks ? '<span class="cal-task-dot"></span>' : ''}
        </div>
      `;
    }

    daysGrid.innerHTML = html;

    // Clic sur un jour pour filtrer
    daysGrid.querySelectorAll('.cal-day-cell:not(.empty)').forEach((cell) => {
      cell.addEventListener('click', () => {
        const date = cell.getAttribute('data-date');
        if (this.selectedDateFilter === date) {
          this.selectedDateFilter = null;
        } else {
          this.selectedDateFilter = date;
        }
        this.updateFilterBanner();
        this.renderCalendar();
        this.renderTasks();
      });
    });

    this.updateFilterBanner();
  }

  updateFilterBanner() {
    const banner = this.container.querySelector('#cal-filter-banner');
    const text = this.container.querySelector('#cal-filter-date-text');
    if (!banner || !text) return;

    if (this.selectedDateFilter) {
      banner.style.display = 'flex';
      text.textContent = this.selectedDateFilter;
    } else {
      banner.style.display = 'none';
    }
  }

  renderTasks() {
    const listEl = this.container.querySelector('#tasks-list');
    const statsBadge = this.container.querySelector('#agenda-stats-badge');
    const progressText = this.container.querySelector('#task-progress-text');
    const progressFill = this.container.querySelector('#task-progress-fill');
    if (!listEl) return;

    const todayStr = this.toISODate(new Date());

    let filtered = this.todos;

    // Filtre date du calendrier
    if (this.selectedDateFilter) {
      filtered = filtered.filter((t) => t.date === this.selectedDateFilter);
    }

    // Filtre statut
    if (this.statusFilter === 'pending') {
      filtered = filtered.filter((t) => !t.done);
    } else if (this.statusFilter === 'done') {
      filtered = filtered.filter((t) => t.done);
    } else if (this.statusFilter === 'today') {
      filtered = filtered.filter((t) => t.date === todayStr);
    }

    // Progression globale
    const total = this.todos.length;
    const doneCount = this.todos.filter((t) => t.done).length;
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    if (statsBadge) statsBadge.textContent = `${doneCount}/${total} accomplie${doneCount > 1 ? 's' : ''}`;
    if (progressText) progressText.textContent = `${pct}%`;
    if (progressFill) progressFill.style.width = `${pct}%`;

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); padding: 30px; font-size: 0.88rem;">
          Aucune tâche pour ce filtre.
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered
      .map(
        (t) => `
      <div class="task-item-row ${t.done ? 'done' : ''}" data-id="${t.id}">
        <div class="task-row-left">
          <button type="button" class="task-checkbox-custom ${t.done ? 'checked' : ''}" data-action="toggle">
            ${t.done ? '✓' : ''}
          </button>
          <span class="task-title-text" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</span>
        </div>

        <div class="task-row-right">
          <span class="task-badge-priority ${t.priority}">${t.priority.toUpperCase()}</span>
          ${t.date ? `<span class="task-badge-date">${t.date}</span>` : ''}
          <button type="button" class="task-delete-btn" data-action="delete" title="Supprimer la tâche">✕</button>
        </div>
      </div>
    `
      )
      .join('');

    // Actions clics sur tâches
    listEl.querySelectorAll('.task-item-row').forEach((row) => {
      const id = row.getAttribute('data-id');

      row.querySelector('[data-action="toggle"]')?.addEventListener('click', () => {
        this.toggleTask(id);
      });

      row.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
        this.deleteTask(id);
      });
    });
  }

  toggleTask(id) {
    const task = this.todos.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
      this.saveTasks();
      this.renderTasks();
      this.renderCalendar();
    }
  }

  deleteTask(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveTasks();
    this.renderTasks();
    this.renderCalendar();
  }

  bindEvents() {
    // Navigation mois
    const prevBtn = this.container.querySelector('#cal-prev-btn');
    const nextBtn = this.container.querySelector('#cal-next-btn');

    prevBtn?.addEventListener('click', () => {
      this.currentCalDate.setMonth(this.currentCalDate.getMonth() - 1);
      this.renderCalendar();
    });

    nextBtn?.addEventListener('click', () => {
      this.currentCalDate.setMonth(this.currentCalDate.getMonth() + 1);
      this.renderCalendar();
    });

    // Effacer filtre date
    const clearBtn = this.container.querySelector('#cal-clear-filter-btn');
    clearBtn?.addEventListener('click', () => {
      this.selectedDateFilter = null;
      this.renderCalendar();
      this.renderTasks();
    });

    // Formulaire ajout tâche
    const addForm = this.container.querySelector('#task-add-form');
    addForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = this.container.querySelector('#task-input-title');
      const dateInput = this.container.querySelector('#task-input-date');
      const prioritySelect = this.container.querySelector('#task-input-priority');

      const title = titleInput?.value?.trim();
      if (!title) return;

      const newTask = {
        id: String(Date.now()),
        title,
        date: dateInput?.value || this.toISODate(new Date()),
        priority: prioritySelect?.value || 'normal',
        done: false,
      };

      this.todos.unshift(newTask);
      this.saveTasks();

      if (titleInput) titleInput.value = '';
      this.renderTasks();
      this.renderCalendar();
    });

    // Filtres statut
    this.container.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        this.container.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        this.statusFilter = chip.getAttribute('data-filter') || 'all';
        this.renderTasks();
      });
    });
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
