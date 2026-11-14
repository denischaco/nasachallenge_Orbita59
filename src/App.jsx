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
    <button className={`sound-toggle${compact ? ' sound-toggle--compact' : ''}`} type="button" role="switch" aria-checked={enabled} onClick={() => onChange(!enabled)}>
      <span className="sound-copy">
        <span className="sound-title">Música ambiental</span>
        {!compact && <span className="sound-detail">Podés activarla o disfrutar el viaje en silencio.</span>}
      </span>
      <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
    </button>
  );
}

function LoadingScreen({ visible }) {
  return (
    <div className={`loading-screen${visible ? ' loading-screen--visible' : ''}`} aria-hidden={!visible}>
      <span className="loading-word">ORBITAR</span>
      <span className="loading-caption">PREPARANDO EL VIAJE</span>
      <span className="loading-line" aria-hidden="true"><span /></span>
    </div>
  );
}

function TreeArtwork() {
  return (
    <div className="tree-backdrop" aria-hidden="true">
      <svg className="tree-art" viewBox="0 0 1440 5000" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="bark" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#302a2e" />
            <stop offset=".48" stopColor="#91634b" />
            <stop offset="1" stopColor="#342a31" />
          </linearGradient>
          <radialGradient id="canopy"><stop stopColor="#637a65" stopOpacity=".42" /><stop offset="1" stopColor="#26333a" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="720" cy="450" rx="490" ry="390" fill="url(#canopy)" />
        <ellipse cx="390" cy="1460" rx="350" ry="330" fill="url(#canopy)" />
        <ellipse cx="1050" cy="2380" rx="370" ry="380" fill="url(#canopy)" />
        <ellipse cx="430" cy="3380" rx="390" ry="360" fill="url(#canopy)" />
        <path d="M680 5000 C650 4240 795 3550 700 2800 C625 2190 765 1510 700 880 C675 620 710 340 720 100" fill="none" stroke="url(#bark)" strokeWidth="150" strokeLinecap="round" />
        <g fill="none" stroke="#785342" strokeLinecap="round" strokeLinejoin="round">
          <path d="M700 900 C520 800 440 610 310 430 M710 1160 C880 1040 990 790 1150 600 M680 1780 C490 1680 380 1470 220 1320 M730 2260 C930 2130 1030 1920 1210 1760 M700 3000 C510 2880 400 2670 220 2500 M710 3550 C930 3410 1030 3210 1210 3040 M690 4120 C500 4000 390 3810 230 3650" strokeWidth="68" />
          <path d="M680 5000 C540 4810 430 4780 300 4730 M680 5000 C615 4790 610 4680 600 4550 M700 5000 C790 4780 920 4730 1050 4670 M700 5000 C850 4880 1010 4880 1190 4850 M670 5000 C510 4930 390 4910 190 4920 M710 5000 C730 4810 760 4690 810 4540" strokeWidth="46" />
        </g>
        <g fill="#78906d" opacity=".55">
          <circle cx="300" cy="420" r="100"/><circle cx="440" cy="560" r="120"/><circle cx="1140" cy="590" r="125"/><circle cx="970" cy="830" r="115"/>
          <circle cx="220" cy="1300" r="115"/><circle cx="400" cy="1510" r="135"/><circle cx="1200" cy="1740" r="130"/><circle cx="1030" cy="1980" r="115"/>
          <circle cx="230" cy="2480" r="130"/><circle cx="420" cy="2690" r="125"/><circle cx="1200" cy="3010" r="125"/><circle cx="1020" cy="3260" r="125"/>
          <circle cx="240" cy="3620" r="130"/><circle cx="430" cy="3840" r="120"/>
        </g>
        <g fill="#f4c593" opacity=".8">
          <circle cx="360" cy="780" r="12"/><circle cx="1080" cy="1280" r="10"/><circle cx="340" cy="2150" r="11"/><circle cx="1110" cy="2700" r="12"/><circle cx="370" cy="3200" r="10"/><circle cx="1030" cy="3900" r="12"/>
        </g>
      </svg>
      <div className="tree-vignette" />
    </div>
  );
}

function FixedClimber() {
  return (
    <div className="climber-fixed" aria-hidden="true">
      <svg viewBox="0 0 150 220" role="presentation">
        <ellipse cx="80" cy="207" rx="65" ry="9" fill="#070a0d" opacity=".55" />
        <path d="M93 112 C78 119 73 140 79 162 L95 192 L119 187 L108 152 L122 128 Z" fill="#d5a176" />
        <path d="M86 117 C68 124 55 140 45 158 L55 165 L86 145 L105 137 Z" fill="#f0c39b" />
        <path d="M99 117 C119 120 132 131 139 147 L130 153 L105 139 L91 137 Z" fill="#e9b88c" />
        <path d="M81 158 L57 183 L35 190 L39 199 L70 195 L101 173 Z" fill="#33404b" />
        <path d="M99 158 L113 181 L137 187 L134 197 L104 195 L84 174 Z" fill="#27333e" />
        <path d="M78 83 C78 65 93 53 109 57 C126 60 132 77 126 93 L119 111 L97 111 L83 99 Z" fill="#dca980" />
        <path d="M77 78 C82 56 105 48 124 60 L132 77 L119 73 L110 65 L95 76 Z" fill="#202b32" />
        <path d="M120 88 Q129 91 135 86" fill="none" stroke="#6e4338" strokeWidth="3" strokeLinecap="round" />
        <path d="M91 111 Q104 101 121 112 L113 153 L83 155 L76 132 Z" fill="#b76f50" />
        <path d="M91 119 L105 140" stroke="#e9b88c" strokeWidth="4" opacity=".8" />
      </svg>
      <span>SUBIENDO JUNTOS</span>
    </div>
  );
}

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openedStories, setOpenedStories] = useState(() => new Set());
  const [activeStory, setActiveStory] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const audioRef = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
      setSettingsOpen(true);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (!started) return undefined;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [started]);

  useEffect(() => {
    if (!started || settingsOpen || activeStory) return undefined;
    const handleWheel = (event) => {
      event.preventDefault();
      window.scrollBy({ top: event.deltaY * 0.55, behavior: 'smooth' });
    };
    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (event) => {
      if (touchStartY.current === null) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;
      const fingerDelta = currentY - touchStartY.current;
      touchStartY.current = currentY;
      event.preventDefault();
      window.scrollBy({ top: -fingerDelta * 0.7, behavior: 'auto' });
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [started, settingsOpen, activeStory]);

  function beginJourney() {
    setStarted(true);
    setSettingsOpen(false);
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
      <LoadingScreen visible={loading} />
      <TreeArtwork />
      <FixedClimber />

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
                <button className={`story-card${openedStories.has(story.id) ? ' story-card--seen' : ''}`} type="button" key={story.id} onClick={() => openStory(story)}>
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

      {settingsOpen && !loading && (
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
