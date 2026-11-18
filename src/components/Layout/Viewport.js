import { ClockStation } from '../Clock/ClockStation.js';
import { Omnibox } from '../Omnibox/Omnibox.js';
import { BookmarksGrid } from '../Bookmarks/BookmarksGrid.js';
import { MarketsView } from '../Markets/MarketsView.js';
import { AgendaView } from '../Agenda/AgendaView.js';
import { WeatherView } from '../Weather/WeatherView.js';
import { PomodoroWidget } from '../Pomodoro/PomodoroWidget.js';
import { NotesStudio } from '../Notes/NotesStudio.js';
import { FeedsView } from '../Feeds/FeedsView.js';
import { SettingsView } from '../Settings/SettingsView.js';

export class Viewport {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.currentView = 'dashboard';
    this.clockStation = null;
    this.dashboardOmnibox = null;
    this.dashboardBookmarks = null;
    this.dedicatedBookmarks = null;
    this.marketsView = null;
    this.agendaView = null;
    this.weatherView = null;
    this.pomodoroWidget = null;
    this.notesStudio = null;
    this.feedsView = null;
    this.settingsView = null;
    this.init();
  }

  init() {
    this.render();
    this.mountComponents();
  }

  render() {
    this.container.innerHTML = `
      <main class="cockpit-viewport" id="cockpit-viewport">
        <!-- VUE 1 : ACCUEIL COCKPIT (SESSION 3) -->
        <div class="deck-view active" id="view-dashboard">
          <!-- Station Horloge & Télémétrie Solaire -->
          <div id="dash-clock-slot"></div>

          <!-- Omnibox Universelle -->
          <div id="dash-omnibox-slot"></div>

          <!-- Grille des Favoris Startpage -->
          <div id="dash-bookmarks-slot"></div>
        </div>

        <!-- VUE 2 : SIGNETS & WEB DÉDIÉE -->
        <div class="deck-view" id="view-bookmarks">
          <div id="dedicated-bookmarks-slot"></div>
        </div>

        <!-- VUE 3 : AGENDA & TÂCHES (SESSION 5 • OPÉRATIONNEL) -->
        <div class="deck-view" id="view-agenda">
          <div id="agenda-slot"></div>
        </div>

        <!-- VUE 4 : MÉTÉO & RADAR (SESSION 5 • OPÉRATIONNEL) -->
        <div class="deck-view" id="view-weather">
          <div id="weather-slot"></div>
        </div>

        <!-- VUE 5 : MARCHÉS & ETF (SESSION 4 • OPÉRATIONNEL NATIVE) -->
        <div class="deck-view" id="view-markets">
          <div id="markets-slot"></div>
        </div>

        <!-- VUE 6 : FOCUS POMODORO (SESSION 5 • OPÉRATIONNEL) -->
        <div class="deck-view" id="view-pomodoro">
          <div id="pomodoro-slot"></div>
        </div>

        <!-- VUE 7 : BLOC-NOTES (SESSION 6 • OPÉRATIONNEL) -->
        <div class="deck-view" id="view-notes">
          <div id="notes-slot"></div>
        </div>

        <!-- VUE 8 : ACTUALITÉS & AMBIANCE (SESSION 6 • OPÉRATIONNEL) -->
        <div class="deck-view" id="view-feeds">
          <div id="feeds-slot"></div>
        </div>

        <!-- VUE 9 : PARAMÈTRES (SESSION 7 • OPÉRATIONNEL) -->
        <div class="deck-view" id="view-settings">
          <div id="settings-slot"></div>
        </div>
      </main>
    `;
  }

  mountComponents() {
    const handleOpenExternal = (url) => {
      if (window.desktopAPI?.openExternal) {
        window.desktopAPI.openExternal(url);
      } else {
        window.open(url, '_blank');
      }
    };

    // 1. Horloge Station dans Accueil
    const clockSlot = this.container.querySelector('#dash-clock-slot');
    if (clockSlot) {
      this.clockStation = new ClockStation(clockSlot);
    }

    // 2. Omnibox dans Accueil
    const omniboxSlot = this.container.querySelector('#dash-omnibox-slot');
    if (omniboxSlot) {
      this.dashboardOmnibox = new Omnibox(omniboxSlot, {
        onOpenExternal: handleOpenExternal,
      });
    }

    // 3. Grille de Signets dans Accueil
    const bookmarksSlot = this.container.querySelector('#dash-bookmarks-slot');
    if (bookmarksSlot) {
      this.dashboardBookmarks = new BookmarksGrid(bookmarksSlot, {
        onOpenExternal: handleOpenExternal,
      });
    }

    // 4. Grille de Signets Complète dans la vue Signets
    const dedicatedSlot = this.container.querySelector('#dedicated-bookmarks-slot');
    if (dedicatedSlot) {
      this.dedicatedBookmarks = new BookmarksGrid(dedicatedSlot, {
        onOpenExternal: handleOpenExternal,
      });
    }

    // 5. Hub Marchés Boursiers, ETF & Crypto (Session 4)
    const marketsSlot = this.container.querySelector('#markets-slot');
    if (marketsSlot) {
      this.marketsView = new MarketsView(marketsSlot);
    }

    // 6. Agenda & To-Do List (Session 5)
    const agendaSlot = this.container.querySelector('#agenda-slot');
    if (agendaSlot) {
      this.agendaView = new AgendaView(agendaSlot);
    }

    // 7. Station Météo en Direct (Session 5)
    const weatherSlot = this.container.querySelector('#weather-slot');
    if (weatherSlot) {
      this.weatherView = new WeatherView(weatherSlot);
    }

    // 8. Studio Focus Pomodoro (Session 5)
    const pomodoroSlot = this.container.querySelector('#pomodoro-slot');
    if (pomodoroSlot) {
      this.pomodoroWidget = new PomodoroWidget(pomodoroSlot);
    }

    // 9. Studio Markdown (Session 6)
    const notesSlot = this.container.querySelector('#notes-slot');
    if (notesSlot) {
      this.notesStudio = new NotesStudio(notesSlot);
    }

    // 10. Flux RSS & Ambiance Lo-Fi (Session 6)
    const feedsSlot = this.container.querySelector('#feeds-slot');
    if (feedsSlot) {
      this.feedsView = new FeedsView(feedsSlot);
    }

    // 11. Centre de Contrôle & Paramètres (Session 7)
    const settingsSlot = this.container.querySelector('#settings-slot');
    if (settingsSlot) {
      this.settingsView = new SettingsView(settingsSlot, {
        onThemeChange: this.options?.onThemeChange,
      });
    }
  }

  setTheme(themeId) {
    if (this.settingsView) {
      this.settingsView.setTheme(themeId, false);
    }
  }

  showView(viewId) {
    this.currentView = viewId;
    const views = this.container.querySelectorAll('.deck-view');
    views.forEach((v) => {
      const match = v.id === `view-${viewId}`;
      v.classList.toggle('active', match);
    });

    const viewport = this.container.querySelector('#cockpit-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }
  }
}
