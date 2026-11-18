import './pomodoro.css';

export const POMO_PRESETS = {
  focus: { label: 'Focus', seconds: 25 * 60 },
  short: { label: 'Pause Courte', seconds: 5 * 60 },
  long: { label: 'Pause Longue', seconds: 15 * 60 },
};

export class PomodoroWidget {
  constructor(container) {
    this.container = container;
    this.currentMode = 'focus';
    this.totalSeconds = POMO_PRESETS.focus.seconds;
    this.timeLeft = this.totalSeconds;
    this.isRunning = false;
    this.timer = null;
    this.completedSessions = 0;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.updateDisplay();
  }

  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  playZenChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Accord harmonique céleste C5 - E5 - G5 - C6
      const chord = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const startTime = now + idx * 0.12;
        const duration = 1.4;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      });
    } catch (err) {
      console.warn('[Pomodoro] Audio non disponible:', err.message);
    }
  }

  onSessionComplete() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // 1. Carillon Zen Web Audio
    this.playZenChime();

    // 2. Notification système native OS via le pont Electron desktopAPI
    const modeName = this.currentMode === 'focus' ? 'Focus' : 'Pause';
    const message =
      this.currentMode === 'focus'
        ? 'Session de travail achevée avec succès. Prenez une pause méritée !'
        : 'La pause est terminée. Prêt à reprendre une session de focus ?';

    if (window.desktopAPI?.showNotification) {
      window.desktopAPI.showNotification({
        title: `⏱️ Pomodoro : ${modeName} terminé !`,
        body: message,
      });
    }

    // Incrémenter sessions
    if (this.currentMode === 'focus') {
      this.completedSessions++;
      this.setMode('short');
    } else {
      this.setMode('focus');
    }

    this.updateDisplay();
  }

  setMode(modeKey) {
    if (!POMO_PRESETS[modeKey]) return;
    this.currentMode = modeKey;
    this.totalSeconds = POMO_PRESETS[modeKey].seconds;
    this.timeLeft = this.totalSeconds;
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Onglets UI
    this.container.querySelectorAll('.pomo-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === modeKey);
    });

    this.updateDisplay();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateDisplay();
      } else {
        this.onSessionComplete();
      }
    }, 1000);
    this.updateDisplay();
  }

  pause() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.updateDisplay();
  }

  reset() {
    this.pause();
    this.timeLeft = this.totalSeconds;
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const digitsEl = this.container.querySelector('#pomo-digits');
    const mainBtn = this.container.querySelector('#pomo-btn-main');
    const modeLabelEl = this.container.querySelector('#pomo-mode-label');
    const completedEl = this.container.querySelector('#pomo-completed-count');
    const circle = this.container.querySelector('#pomo-circle-progress');

    if (digitsEl) digitsEl.textContent = formatted;
    if (mainBtn) mainBtn.textContent = this.isRunning ? 'Pause' : 'Démarrer';
    if (modeLabelEl) modeLabelEl.textContent = POMO_PRESETS[this.currentMode]?.label || 'Focus';
    if (completedEl) completedEl.textContent = `${this.completedSessions} cycle${this.completedSessions > 1 ? 's' : ''} complété${this.completedSessions > 1 ? 's' : ''}`;

    // Progression circulaire SVG (circonférence = 2 * PI * 100 ≈ 628.32)
    if (circle) {
      const circumference = 628.32;
      const progressFraction = 1 - this.timeLeft / this.totalSeconds;
      const offset = circumference * (1 - progressFraction);
      circle.style.strokeDashoffset = offset;
    }
  }

  render() {
    this.container.innerHTML = `
      <section class="pomodoro-hub" id="pomodoro-hub">
        <div class="pomodoro-card">
          <!-- En-tête -->
          <div class="pomodoro-header-row">
            <div class="pomodoro-title-group">
              <h1 class="pomodoro-main-title">STUDIO FOCUS POMODORO</h1>
              <span class="pomodoro-tag">Web Audio & Notifications OS</span>
            </div>

            <select class="pomo-subject-select" id="pomo-subject-select">
              <option value="dev">💻 Code & Développement</option>
              <option value="math">📐 Mathématiques & Algorithmes</option>
              <option value="write">📝 Rédaction & Documentation</option>
              <option value="finance">📈 Analyse Financière & Bourse</option>
            </select>
          </div>

          <!-- Onglets de presets -->
          <div class="pomo-mode-tabs">
            <button type="button" class="pomo-mode-btn active" data-mode="focus">Focus (25m)</button>
            <button type="button" class="pomo-mode-btn" data-mode="short">Pause (5m)</button>
            <button type="button" class="pomo-mode-btn" data-mode="long">Pause Longue (15m)</button>
          </div>

          <!-- Anneau Circulaire de Progression -->
          <div class="pomo-circle-wrap">
            <svg class="pomo-svg" viewBox="0 0 240 240">
              <circle class="pomo-circle-bg" cx="120" cy="120" r="100"></circle>
              <circle
                class="pomo-circle-progress"
                id="pomo-circle-progress"
                cx="120"
                cy="120"
                r="100"
                stroke-dasharray="628.32"
                stroke-dashoffset="628.32"
              ></circle>
            </svg>

            <div class="pomo-time-center">
              <span class="pomo-digits" id="pomo-digits">25:00</span>
              <span class="pomo-current-mode-label" id="pomo-mode-label">Focus</span>
            </div>
          </div>

          <!-- Boutons de Contrôle -->
          <div class="pomo-controls-row">
            <button type="button" class="pomo-btn-main" id="pomo-btn-main">Démarrer</button>
            <button type="button" class="pomo-btn-secondary" id="pomo-btn-reset">Réinitialiser</button>
          </div>

          <!-- Pied de carte -->
          <div class="pomo-footer-row">
            <span id="pomo-completed-count">0 cycle complété</span>
            <button type="button" class="pomo-test-chime-btn" id="pomo-test-chime-btn">
              🔔 Tester Carillon Zen
            </button>
          </div>
        </div>
      </section>
    `;
  }

  bindEvents() {
    const mainBtn = this.container.querySelector('#pomo-btn-main');
    const resetBtn = this.container.querySelector('#pomo-btn-reset');
    const testChimeBtn = this.container.querySelector('#pomo-test-chime-btn');

    mainBtn?.addEventListener('click', () => {
      this.toggle();
    });

    resetBtn?.addEventListener('click', () => {
      this.reset();
    });

    testChimeBtn?.addEventListener('click', () => {
      this.playZenChime();
    });

    // Clic sur les onglets de mode
    this.container.querySelectorAll('.pomo-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (mode) {
          this.setMode(mode);
        }
      });
    });
  }
}
