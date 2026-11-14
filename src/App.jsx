import { useEffect, useRef, useState } from 'react';

function createAmbientMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(0.055, context.currentTime + 2.5);
  master.connect(context.destination);

  // A soft, slow-moving chord works as a temporary soundtrack until the
  // original music assets are ready.
  const notes = [110, 164.81, 220, 329.63];
  const oscillators = notes.map((frequency, index) => {
    const oscillator = context.createOscillator();
    const voice = context.createGain();
    oscillator.type = index === 3 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    voice.gain.value = index === 3 ? 0.12 : 0.22;
    oscillator.connect(voice);
    voice.connect(master);
    oscillator.start();
    return oscillator;
  });

  return {
    stop() {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0, context.currentTime, 0.25);
      window.setTimeout(() => {
        oscillators.forEach((oscillator) => oscillator.stop());
        context.close();
      }, 1100);
    },
  };
}

function SoundToggle({ enabled, onChange, compact = false }) {
  return (
    <button
      className={`sound-toggle${compact ? ' sound-toggle--compact' : ''}`}
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span className="sound-copy">
        <span className="sound-title">Música ambiental</span>
        {!compact && <span className="sound-detail">Podés activarla o disfrutar el viaje en silencio.</span>}
      </span>
      <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
    </button>
  );
}

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (musicEnabled && started) {
      audioRef.current = createAmbientMusic();
    } else if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
    }
    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, [musicEnabled, started]);

  function beginJourney() {
    setStarted(true);
    setSettingsOpen(false);
  }

  return (
    <main className="experience-shell">
      <div className="starfield" aria-hidden="true" />
      <div className="planet-glow" aria-hidden="true" />

      <header className="topbar">
        <a className="wordmark" href="#inicio" aria-label="Órbita 59, inicio">ÓRBITA<span>59</span></a>
        {started && <SoundToggle compact enabled={musicEnabled} onChange={setMusicEnabled} />}
      </header>

      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-line" /> UNA AVENTURA INTERACTIVA <span className="eyebrow-line" /></p>
          <h1 id="hero-title">Hay historias<br />que <span>siguen viajando.</span></h1>
          <p className="hero-description">
            En algún lugar de Marte, los exploradores dejaron algo atrás.
            ¿Te animás a descubrir qué pasó?
          </p>
          <button className="start-button" type="button" onClick={() => setSettingsOpen(true)}>
            {started ? 'Volver a configurar' : 'Comenzar la aventura'}
            <span aria-hidden="true">↗</span>
          </button>
          <p className="age-note">Un viaje para mentes curiosas <span>·</span> Órbita 59</p>
        </div>

        <div className="planet-scene" aria-hidden="true">
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="planet"><span className="planet-mark" /></div>
          <div className="planet-label"><span className="label-dot" /> MARTE · 225 MILLONES DE KM</div>
          <div className="tiny-star tiny-star--one">✦</div>
          <div className="tiny-star tiny-star--two">✧</div>
          <div className="tiny-star tiny-star--three">·</div>
        </div>
      </section>

      <footer className="page-footer">
        <span>UNA HISTORIA SOBRE LO QUE DEJAMOS ATRÁS</span>
        <span className="scroll-hint">DESLIZÁ PARA EXPLORAR <span aria-hidden="true">↓</span></span>
        <span>01 — 06</span>
      </footer>

      {settingsOpen && (
        <div className="dialog-backdrop" role="presentation">
          <section
            className="settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
          >
            <button
              className="dialog-close"
              type="button"
              aria-label="Cerrar configuración"
              onClick={() => setSettingsOpen(false)}
            >×</button>
            <div className="dialog-symbol" aria-hidden="true"><span>✦</span></div>
            <p className="dialog-kicker">ANTES DE DESPEGAR</p>
            <h2 id="dialog-title">Prepará tu viaje</h2>
            <p className="dialog-description" id="dialog-description">
              Elegí cómo querés vivir esta aventura. Siempre podés cambiarlo después.
            </p>

            <div className="settings-options">
              <SoundToggle enabled={musicEnabled} onChange={setMusicEnabled} />
              <div className="device-note">
                <span className="device-icon" aria-hidden="true">▱</span>
                <span><strong>Una recomendación</strong><br />En PC o notebook vas a disfrutar mejor cada detalle. También podés explorar desde el celular.</span>
              </div>
            </div>

            <button className="launch-button" type="button" onClick={beginJourney}>
              Entrar a la historia <span aria-hidden="true">→</span>
            </button>
            <p className="privacy-note">La música empieza solo si vos la activás.</p>
          </section>
        </div>
      )}
    </main>
  );
}
