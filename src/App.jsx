import { useEffect, useRef, useState } from 'react';
import './navigation.css';

function createAmbientMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(0.055, context.currentTime + 2.5);
  master.connect(context.destination);

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

const levels = [
  {
    number: 3,
    title: 'El eco de las estrellas',
    subtitle: 'Más allá de la atmósfera, también hay historias esperando ser escuchadas.',
    stories: [
      { id: 'wichi-3', kind: 'WICHI', title: 'La voz de la noche', text: 'Cuando la noche se hizo inmensa, las abuelas wichí escucharon al cielo. Cada estrella guardaba una voz antigua: recordar que la Tierra, el agua y todos los seres están unidos.' },
      { id: 'space-3', kind: 'ESPACIAL', title: 'La señal que volvió', text: 'Desde Marte, una pequeña señal viajó millones de kilómetros. En la Tierra, quienes seguían la misión contuvieron el aliento: el explorador había despertado y todavía tenía una historia que contar.' },
    ],
  },
  {
    number: 2,
    title: 'El bosque que respira',
    subtitle: 'En las ramas y en el polvo rojo se esconden pistas sobre cómo seguimos explorando.',
    stories: [
      { id: 'wichi-2', kind: 'WICHI', title: 'El algarrobo generoso', text: 'Un algarrobo ofreció sombra, alimento y refugio. El pueblo aprendió que cuidar un árbol es cuidar también a quienes todavía no han llegado.' },
      { id: 'space-2', kind: 'ESPACIAL', title: 'El pequeño explorador', text: 'Un rover recorrió Marte con ruedas pacientes y ojos de cámara. Aunque la Tierra quedaba muy lejos, cada fotografía ayudaba a su equipo a imaginar el paisaje que tenía delante.' },
    ],
  },
  {
    number: 1,
    title: 'Las raíces del viaje',
    subtitle: 'Toda aventura empieza con una pregunta y con alguien dispuesto a escuchar.',
    stories: [
      { id: 'wichi-1', kind: 'WICHI', title: 'El origen de la Tierra', text: 'Al principio, cuentan los relatos wichí, el mundo todavía estaba por hacerse. Con el tiempo llegaron los ríos, los animales y las plantas, y cada ser encontró su lugar en una tierra compartida.' },
      { id: 'space-1', kind: 'ESPACIAL', title: 'Lo que quedó en Marte', text: 'Cuando una misión termina, algunos dispositivos se quedan en Marte. No son basura olvidada: son parte de una historia de ingenio, trabajo en equipo y preguntas que todavía buscamos responder.' },
    ],
  },
];

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
  const [openedStories, setOpenedStories] = useState(() => new Set());
  const [activeStory, setActiveStory] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.max(0, Math.min(1, 1 - window.scrollY / maxScroll)) : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [started]);

  function beginJourney() {
    setStarted(true);
    setSettingsOpen(false);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });
  }

  function openStory(story) {
    setActiveStory(story);
    setOpenedStories((previous) => new Set(previous).add(story.id));
  }

  function moveUp() {
    window.scrollBy({ top: -Math.max(360, window.innerHeight * 0.68), behavior: 'smooth' });
  }

  const allStoriesSeen = openedStories.size === 6;

  return (
    <main className="experience-shell">
      <div className="starfield" aria-hidden="true" />
      <div className="planet-glow" aria-hidden="true" />

      <header className="topbar">
        <a className="wordmark" href="#inicio" aria-label="Órbita 59, inicio">ÓRBITA<span>59</span></a>
        {started && <SoundToggle compact enabled={musicEnabled} onChange={setMusicEnabled} />}
      </header>

      <div className="journey-stack">
        <section className="journey-panel ending-panel" aria-labelledby="ending-title">
          <p className="journey-kicker">FIN DE LA TRAVESÍA</p>
          <h2 id="ending-title">Gracias por<br /><span>llegar hasta aquí.</span></h2>
          <p>{allStoriesSeen ? 'Abriste las seis historias. Gracias por escuchar, imaginar y explorar con nosotros.' : 'Cada historia es una puerta. ¿Te animás a abrir las seis antes de terminar el viaje?'}</p>
          <div className="credits-card">
            <strong>Este viaje fue creado por</strong>
            <span>Equipo Órbita 59 · Narración, ilustración y desarrollo</span>
            <span>Herramientas: React · Vite · Web Audio</span>
          </div>
          <a className="back-to-start" href="#inicio">Volver al comienzo ↓</a>
        </section>

        {levels.map((level) => (
          <section className={`journey-panel level-panel level-panel--${level.number}`} key={level.number} aria-labelledby={`level-${level.number}`}>
            <div className="level-heading">
              <span className="level-number">0{level.number}</span>
              <p className="journey-kicker">NIVEL 0{level.number}</p>
              <h2 id={`level-${level.number}`}>{level.title}</h2>
              <p>{level.subtitle}</p>
            </div>
            <div className="story-pair">
              {level.stories.map((story) => (
                <button
                  className={`story-card${openedStories.has(story.id) ? ' story-card--seen' : ''}`}
                  type="button"
                  key={story.id}
                  onClick={() => openStory(story)}
                >
                  <span className="story-star" aria-hidden="true">{openedStories.has(story.id) ? '✦' : '✧'}</span>
                  <span className="story-kind">{story.kind}</span>
                  <strong>{story.title}</strong>
                  <span className="story-open">{openedStories.has(story.id) ? 'Historia descubierta' : 'Abrir historia'} <span aria-hidden="true">↗</span></span>
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className="hero start-panel" id="inicio" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow"><span className="eyebrow-line" /> UNA AVENTURA INTERACTIVA <span className="eyebrow-line" /></p>
            <h1 id="hero-title">Hay historias<br />que <span>siguen viajando.</span></h1>
            <p className="hero-description">En algún lugar de Marte, los exploradores dejaron algo atrás. ¿Te animás a descubrir qué pasó?</p>
            {!started ? (
              <button className="start-button" type="button" onClick={() => setSettingsOpen(true)}>Comenzar la aventura <span aria-hidden="true">↗</span></button>
            ) : (
              <button className="start-button" type="button" onClick={moveUp}>Empezar a subir <span aria-hidden="true">↑</span></button>
            )}
            <p className="age-note">Un viaje para mentes curiosas <span>·</span> Órbita 59</p>
          </div>
          <div className="planet-scene" aria-hidden="true">
            <div className="orbit orbit--one" /><div className="orbit orbit--two" />
            <div className="planet"><span className="planet-mark" /></div>
            <div className="planet-label"><span className="label-dot" /> MARTE · 225 MILLONES DE KM</div>
            <div className="tiny-star tiny-star--one">✦</div><div className="tiny-star tiny-star--two">✧</div><div className="tiny-star tiny-star--three">·</div>
          </div>
        </section>
      </div>

      {started && (
        <>
          <div className="climb-progress" aria-hidden="true">
            <span className="progress-caption">ASCENSO</span>
            <span className="progress-track"><span style={{ height: `${scrollProgress * 100}%` }} /></span>
            <span className="progress-percent">{Math.round(scrollProgress * 100)}%</span>
          </div>
          <div className="climb-hint">
            <span>DESLIZÁ<br />HACIA ARRIBA</span>
            <button type="button" onClick={moveUp} aria-label="Subir por la historia"><span aria-hidden="true">↑</span></button>
            <small>para explorar</small>
          </div>
        </>
      )}

      {settingsOpen && (
        <div className="dialog-backdrop" role="presentation">
          <section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <button className="dialog-close" type="button" aria-label="Cerrar configuración" onClick={() => setSettingsOpen(false)}>×</button>
            <div className="dialog-symbol" aria-hidden="true"><span>✦</span></div>
            <p className="dialog-kicker">ANTES DE DESPEGAR</p>
            <h2 id="dialog-title">Prepará tu viaje</h2>
            <p className="dialog-description" id="dialog-description">Elegí cómo querés vivir esta aventura. Siempre podés cambiarlo después.</p>
            <div className="settings-options">
              <SoundToggle enabled={musicEnabled} onChange={setMusicEnabled} />
              <div className="device-note"><span className="device-icon" aria-hidden="true">▱</span><span><strong>Una recomendación</strong><br />En PC o notebook vas a disfrutar mejor cada detalle. También podés explorar desde el celular.</span></div>
            </div>
            <button className="launch-button" type="button" onClick={beginJourney}>Entrar a la historia <span aria-hidden="true">→</span></button>
            <p className="privacy-note">La música empieza solo si vos la activás.</p>
          </section>
        </div>
      )}

      {activeStory && (
        <div className="dialog-backdrop story-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveStory(null); }}>
          <section className="settings-dialog story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-title">
            <button className="dialog-close" type="button" aria-label="Cerrar historia" onClick={() => setActiveStory(null)}>×</button>
            <p className="dialog-kicker">{activeStory.kind} · ÓRBITA 59</p>
            <h2 id="story-title">{activeStory.title}</h2>
            <p className="story-narrative">{activeStory.text}</p>
            <button className="launch-button" type="button" onClick={() => setActiveStory(null)}>Seguir explorando <span aria-hidden="true">↑</span></button>
          </section>
        </div>
      )}
    </main>
  );
}
