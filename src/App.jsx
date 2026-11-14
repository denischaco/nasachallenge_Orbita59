import { useEffect, useRef, useState } from 'react';
import './navigation.css';

const levels = [
  {
    number: 3,
    title: 'Donde las ramas tocan las estrellas',
    subtitle: 'En la copa, los relatos de la Tierra se encuentran con las historias que viajan por el espacio.',
    stories: [
      { id: 'wichi-3', kind: 'WICHI', title: 'Chelchupé y el tejido de las Mujeres Estrella', text: 'Una historia ancestral cuenta que las Mujeres Estrella descendían desde la Vía Láctea por una cuerda de fibra de chaguar hasta las ramas más altas. Sus relatos nos recuerdan que el cielo también forma parte de la memoria de la Tierra.' },
      { id: 'space-3', kind: 'ESPACIAL', title: 'Voyager: un mensaje entre las estrellas', text: 'La Voyager lleva consigo sonidos e imágenes de nuestro planeta. Carl Sagan y Ann Druyan ayudaron a reunir ese mensaje: una pequeña carta de la humanidad que continúa viajando mucho más allá de la Tierra.' },
    ],
  },
  {
    number: 2,
    title: 'El latido de la madera y la mirada orbital',
    subtitle: 'El calor escondido en la fibra del árbol dialoga con la tecnología que observa nuestro planeta.',
    stories: [
      { id: 'wichi-2', kind: 'WICHI', title: 'El guardián de la brasa', text: 'En los relatos de la región, el fuego es cuidado y compartido. Una brasa protegida permite que el calor y la vida continúen, como una memoria que pasa de una generación a otra.' },
      { id: 'space-2', kind: 'ESPACIAL', title: 'Ojos de radar sobre el Gran Chaco', text: 'Los satélites de radar pueden observar la superficie incluso entre nubes. Misiones como SAOCOM ayudan a estudiar la humedad del suelo y a comprender mejor los paisajes que habitamos.' },
    ],
  },
  {
    number: 1,
    title: 'El agua de la raíz y el primer paso lunar',
    subtitle: 'Comenzá en las raíces del árbol: dos historias sobre los orígenes y el deseo de explorar.',
    stories: [
      { id: 'wichi-1', kind: 'WICHI', title: 'El gran Yuchán y el agua primordial', text: 'En una versión del relato del gran árbol, los ríos y los peces permanecían en su interior antes de llegar al mundo. El Yuchán guarda el agua y nos invita a pensar en el origen de la vida.' },
      { id: 'space-1', kind: 'ESPACIAL', title: 'Apolo 11: la Tierra desde la Luna', text: 'Neil Armstrong dio el primer paso humano sobre la Luna junto a Buzz Aldrin, mientras Michael Collins los esperaba en órbita. Desde allí, la Tierra podía verse como un hogar azul, pequeño y compartido.' },
    ],
  },
];

function createAmbientMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(0.035, context.currentTime + 2.5);
  master.connect(context.destination);
  const oscillators = [110, 164.81, 220, 329.63].map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 3 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 3 ? 0.1 : 0.18;
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    return oscillator;
  });
  return {
    stop() {
      master.gain.setTargetAtTime(0, context.currentTime, 0.25);
      window.setTimeout(() => {
        oscillators.forEach((oscillator) => oscillator.stop());
        context.close();
      }, 1000);
    },
  };
}

function SoundToggle({ enabled, onChange, compact = false }) {
  return (
    <button className={`sound-toggle${compact ? ' sound-toggle--compact' : ''}`} type="button" role="switch" aria-checked={enabled} onClick={() => onChange(!enabled)}>
      <span className="sound-copy"><span className="sound-title">Música ambiental</span>{!compact && <span className="sound-detail">La música está apagada hasta que decidas activarla.</span>}</span>
      <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
    </button>
  );
}

function StoryCard({ story, seen, onOpen, level }) {
  return (
    <button className={`story-card story-card--${story.kind.toLowerCase()}${seen ? ' story-card--seen' : ''}`} type="button" onClick={onOpen}>
      <span className="story-card__top"><span className="story-kind">{story.kind} · NIVEL {level}</span><span className="story-state">{seen ? '★ DESCUBIERTA' : 'POR DESCUBRIR'}</span></span>
      <span className="story-card__symbol" aria-hidden="true">{story.kind === 'WICHI' ? '⌘' : '✦'}</span>
      <strong>{story.title}</strong>
      <span className="story-summary">{story.text}</span>
      <span className="story-open">{seen ? 'VOLVER A LEER' : 'ABRIR HISTORIA'} <span aria-hidden="true">↗</span></span>
    </button>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [openedStories, setOpenedStories] = useState(() => new Set());
  const [activeStory, setActiveStory] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const audioRef = useRef(null);
  const touchY = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
      setSettingsOpen(true);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (started && musicEnabled) audioRef.current = createAmbientMusic();
    else if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
    }
    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, [started, musicEnabled]);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.max(0, Math.min(1, (max - window.scrollY) / max)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [started]);

  // Put the visitor at the actual bottom after React has rendered the journey.
  useEffect(() => {
    if (!started) return undefined;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        const bottom = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.max(0, bottom));
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [started]);

  // Climbing is intentionally upward: wheel-up and a finger swipe up move the
  // document toward its top. Both gestures are damped for a calmer story pace.
  useEffect(() => {
    if (!started || settingsOpen || activeStory) return undefined;
    const wheel = (event) => {
      event.preventDefault();
      window.scrollBy({ top: event.deltaY * 0.48, behavior: 'auto' });
    };
    const touchStart = (event) => { touchY.current = event.touches[0]?.clientY ?? null; };
    const touchMove = (event) => {
      if (touchY.current === null) return;
      const y = event.touches[0]?.clientY;
      if (y === undefined) return;
      const delta = y - touchY.current;
      touchY.current = y;
      event.preventDefault();
      window.scrollBy({ top: delta * 0.68, behavior: 'auto' });
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
    };
  }, [started, settingsOpen, activeStory]);

  useEffect(() => {
    if (!activeStory) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setActiveStory(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeStory]);

  function beginJourney() {
    setStarted(true);
    setSettingsOpen(false);
  }
  function openStory(story) {
    setActiveStory(story);
    setOpenedStories((previous) => new Set(previous).add(story.id));
  }
  function moveUp() {
    window.scrollBy({ top: -Math.max(320, window.innerHeight * 0.72), behavior: 'smooth' });
  }
  const seenCount = openedStories.size;

  return (
    <main className="experience-shell">
      <div className="forest-backdrop" aria-hidden="true" />
      <div className="forest-grain" aria-hidden="true" />

      <div className={`loading-screen${loading ? ' loading-screen--visible' : ''}`} aria-hidden={!loading}>
        <span className="loading-word">ORBITAR</span>
        <span className="loading-caption">UN VIAJE ENTRE RAÍCES Y ESTRELLAS</span>
        <span className="loading-line"><span /></span>
      </div>

      <header className="topbar">
        <a className="wordmark" href="#inicio" aria-label="Orbitar, comienzo"><span className="brand-dot" /> ORBITAR</a>
        {started && <SoundToggle compact enabled={musicEnabled} onChange={setMusicEnabled} />}
      </header>

      <div className="journey-stack">
        <section className="journey-panel ending-panel" aria-labelledby="ending-title">
          <p className="journey-kicker">✦ TOPE DEL ÁRBOL Y EL COSMOS · ALTITUD 100% ✦</p>
          <h2 id="ending-title">Gracias por experimentar <span>Orbitar</span></h2>
          <p className="ending-copy">Gracias por escalar desde la oscuridad de las raíces hasta la copa estrellada. En este viaje se encuentran la memoria de la tierra y las historias de quienes exploraron el espacio.</p>
          <div className="completion-banner"><strong>HISTORIAS DESCUBIERTAS</strong><span>Abriste {seenCount} de 6 relatos <b>{seenCount}/6</b></span></div>
          <div className="credits-grid">
            <section><h3>Personas y equipo</h3><p>Un proyecto de Órbita 59<br />Narración · Investigación · Diseño · Desarrollo</p></section>
            <section><h3>Herramientas</h3><p>React · Vite · CSS · Web Audio<br />Ilustración y recursos visuales del proyecto</p></section>
          </div>
          <button className="return-button" type="button" onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })}>↓ VOLVER A LAS RAÍCES</button>
        </section>

        {levels.map((level) => (
          <section className={`journey-panel level-panel level-panel--${level.number}`} key={level.number} aria-labelledby={`level-${level.number}`}>
            <header className="level-heading">
              <p className="journey-kicker">NIVEL {level.number} DE 3 · {level.number === 1 ? 'RAÍCES Y HORIZONTE' : level.number === 2 ? 'TRONCO Y ÓRBITA TERRESTRE' : 'COPA CELESTE Y ESPACIO PROFUNDO'}</p>
              <h2 id={`level-${level.number}`}>{level.title}</h2>
              <p>{level.subtitle}</p>
            </header>
            <div className="story-pair">
              {level.stories.map((story) => (
                <StoryCard key={story.id} story={story} level={level.number} seen={openedStories.has(story.id)} onOpen={() => openStory(story)} />
              ))}
            </div>
          </section>
        ))}

        <section className="journey-panel root-panel" id="inicio" aria-labelledby="root-title">
          <div className="root-card">
            <p className="journey-kicker">✦ PUNTO DE PARTIDA · RAÍCES DEL ÁRBOL · ALTITUD 0%</p>
            <h1 id="root-title">Tu ascenso comienza aquí, abajo, en las <span>raíces del mundo</span></h1>
            <p>Estás al pie del gran árbol. Deslizá hacia arriba para recorrer sus tres niveles y descubrir seis historias: tres relatos Wichí y tres misiones espaciales.</p>
            <button className="start-button" type="button" onClick={() => started ? moveUp() : setSettingsOpen(true)}>{started ? 'CONTINUAR EL ASCENSO ↑' : 'PREPARAR LA EXPERIENCIA ↑'}</button>
          </div>
        </section>
      </div>

      {started && (
        <>
          <aside className="climb-dock" aria-label="Progreso del ascenso">
            <div className="dock-location"><span>POSICIÓN EN EL ÁRBOL</span><strong>{scrollProgress < .2 ? 'RAÍCES DEL YUCHÁN' : scrollProgress > .82 ? 'COPA Y ESTRELLAS' : 'ASCENSO EN CURSO'}</strong></div>
            <button className="dock-up" type="button" onClick={moveUp} aria-label="Subir hacia las historias">↑</button>
            <div className="dock-progress"><span>HISTORIAS PINTADAS <b>{seenCount}/6</b></span><div>{Array.from({ length: 6 }, (_, index) => <i className={index < seenCount ? 'is-filled' : ''} key={index} />)}</div></div>
          </aside>
          {scrollProgress > 0.015 && <button className="climb-hint" type="button" onClick={moveUp}><span>SUBIR</span> ↑</button>}
        </>
      )}

      {settingsOpen && !loading && (
        <div className="dialog-backdrop">
          <section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <button className="dialog-close" type="button" aria-label="Cerrar configuración" onClick={() => setSettingsOpen(false)}>×</button>
            <p className="dialog-kicker">ANTES DE DESPEGAR</p><h2 id="dialog-title">Prepará tu viaje</h2>
            <p className="dialog-description">Elegí cómo querés vivir esta aventura. La música está desactivada hasta que la habilites.</p>
            <div className="settings-options">
              <SoundToggle enabled={musicEnabled} onChange={setMusicEnabled} />
              <p className="device-note"><strong>Una recomendación</strong><br />En PC o notebook vas a disfrutar mejor cada detalle. También podés explorar desde el celular.</p>
            </div>
            <button className="launch-button" type="button" onClick={beginJourney}>ENTRAR A LA HISTORIA <span>↑</span></button>
          </section>
        </div>
      )}

      {activeStory && (
        <div className="dialog-backdrop story-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveStory(null); }}>
          <section className="settings-dialog story-dialog" role="dialog" aria-modal="true" aria-labelledby="story-title">
            <button className="dialog-close" type="button" aria-label="Cerrar historia" onClick={() => setActiveStory(null)}>×</button>
            <p className="dialog-kicker">{activeStory.kind} · HISTORIA DESCUBIERTA</p>
            <h2 id="story-title">{activeStory.title}</h2>
            <p className="story-narrative">{activeStory.text}</p>
            <button className="launch-button" type="button" onClick={() => setActiveStory(null)}>SEGUIR EXPLORANDO <span>↑</span></button>
          </section>
        </div>
      )}
    </main>
  );
}
