export class AmbientAudio {
  constructor(container) {
    this.container = container;
    this.audioCtx = null;
    this.gainNode = null;
    this.sourceNode = null;
    this.currentMode = 'rain'; // 'rain', 'brown', 'zen'
    this.isPlaying = false;
    this.volume = 0.5;
    this.animFrame = null;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.startVisualizerLoop();
  }

  destroy() {
    this.stopAudio();
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  createRainGenerator(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;

    noise.connect(filter);
    return { source: noise, output: filter };
  }

  createBrownNoiseGenerator(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.8;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 550;

    noise.connect(filter);
    return { source: noise, output: filter };
  }

  createZenWavesGenerator(ctx) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, ctx.currentTime); // Fréquence 432 Hz de relaxation

    // Modulation basse fréquence (LFO)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.2, ctx.currentTime);

    const ampGain = ctx.createGain();
    ampGain.gain.setValueAtTime(0.3, ctx.currentTime);

    lfo.connect(ampGain.gain);
    osc.connect(ampGain);

    lfo.start();
    return { source: osc, output: ampGain };
  }

  startAudio() {
    try {
      this.initAudioContext();
      this.stopAudio();

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioCtx.currentTime);

      let gen = null;
      if (this.currentMode === 'rain') {
        gen = this.createRainGenerator(this.audioCtx);
      } else if (this.currentMode === 'brown') {
        gen = this.createBrownNoiseGenerator(this.audioCtx);
      } else if (this.currentMode === 'zen') {
        gen = this.createZenWavesGenerator(this.audioCtx);
      }

      if (gen) {
        this.sourceNode = gen.source;
        gen.output.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.sourceNode.start();
        this.isPlaying = true;
      }
    } catch (err) {
      console.warn('[AmbientAudio] Erreur audio:', err.message);
    }
  }

  stopAudio() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (_) {}
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.stopAudio();
    } else {
      this.startAudio();
    }
    this.updateControls();
  }

  render() {
    this.container.innerHTML = `
      <div class="ambient-audio-bar" id="ambient-audio-bar">
        <div class="ambient-left">
          <button type="button" class="ambient-play-btn" id="ambient-play-btn" title="Lecture / Pause Ambiance">
            <span id="ambient-btn-icon">▶</span>
          </button>
          <div class="ambient-info">
            <span class="ambient-title">Ambiance Lo-Fi Procédurale</span>
            <div class="ambient-modes-row">
              <button type="button" class="ambient-mode-chip active" data-ambient="rain">🌧️ Pluie</button>
              <button type="button" class="ambient-mode-chip" data-ambient="brown">☕ Bruit Brun</button>
              <button type="button" class="ambient-mode-chip" data-ambient="zen">🧘 Zen 432Hz</button>
            </div>
          </div>
        </div>

        <div class="ambient-right">
          <!-- Visualiseur Canvas -->
          <canvas class="ambient-canvas" id="ambient-canvas" width="120" height="32"></canvas>

          <!-- Slider Volume -->
          <div class="ambient-volume-wrap">
            <span style="font-size: 0.8rem; color: var(--text-dim);">🔊</span>
            <input
              type="range"
              class="ambient-volume-slider"
              id="ambient-volume"
              min="0"
              max="1"
              step="0.05"
              value="${this.volume}"
            />
          </div>
        </div>
      </div>
    `;

    this.playBtn = this.container.querySelector('#ambient-play-btn');
    this.btnIcon = this.container.querySelector('#ambient-btn-icon');
    this.canvas = this.container.querySelector('#ambient-canvas');
  }

  bindEvents() {
    this.playBtn?.addEventListener('click', () => {
      this.toggle();
    });

    const volumeSlider = this.container.querySelector('#ambient-volume');
    volumeSlider?.addEventListener('input', (e) => {
      this.volume = parseFloat(e.target.value);
      if (this.gainNode && this.audioCtx) {
        this.gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioCtx.currentTime);
      }
    });

    this.container.querySelectorAll('.ambient-mode-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const mode = chip.getAttribute('data-ambient');
        if (mode && mode !== this.currentMode) {
          this.currentMode = mode;
          this.container.querySelectorAll('.ambient-mode-chip').forEach((c) => c.classList.remove('active'));
          chip.classList.add('active');
          if (this.isPlaying) {
            this.startAudio();
          }
        }
      });
    });
  }

  updateControls() {
    if (this.btnIcon) {
      this.btnIcon.textContent = this.isPlaying ? '❚❚' : '▶';
    }
    if (this.playBtn) {
      this.playBtn.classList.toggle('playing', this.isPlaying);
    }
  }

  startVisualizerLoop() {
    const draw = () => {
      if (this.canvas) {
        const ctx = this.canvas.getContext('2d');
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);

        const bars = 16;
        const barWidth = w / bars - 2;
        const accent = getComputedStyle(document.body).getPropertyValue('--accent-primary').trim() || '#a855f7';

        for (let i = 0; i < bars; i++) {
          const heightRatio = this.isPlaying
            ? Math.sin(Date.now() * 0.007 + i * 0.5) * 0.4 + 0.5
            : 0.1;
          const barHeight = Math.max(3, h * heightRatio);

          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.roundRect(i * (barWidth + 2), h - barHeight, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();
        }
      }
      this.animFrame = requestAnimationFrame(draw);
    };
    draw();
  }
}
