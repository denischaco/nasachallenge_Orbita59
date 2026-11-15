/**
 * ORBITAR — Interactive Inverted-Navigation Engine (Web & Mobile)
 * Features:
 * 1) Darkness-emergence "ORBITAR" preloader while background assets load
 * 2) Starts at the bottom of the page (Roots of the World Tree) + fixed bottom Climber navbar
 * 3) Right-side upward arrow indicator + damped smooth wheel & touch-swipe physics
 * 4) 3 Content Levels × 2 Modes (WICHÍ earth myth & ESPACIAL protagonist star) = 6 stories
 * 5) Visited stories remain permanently PAINTED ("PINTADAS") in brand colors
 * 6) Summit / Top of the tree displays thank-you message, participants, and tools used
 */

(function () {
  "use strict";

  const STORAGE_KEY = "orbitar_painted_stories_v1";

  // Damped scroll / swipe configuration ("reducido en su velocidad para que sea suave")
  const WHEEL_SPEED_FACTOR = 0.36;   // Reduced wheel speed for smooth climbing
  const TOUCH_SWIPE_FACTOR = 0.42;   // Reduced mobile swipe speed for smooth ascent
  const LERP_SMOOTHING = 0.135;      // Smooth interpolation factor per frame
  const TOUCH_FRICTION = 0.91;       // Gentle momentum decay on touch release

  // State
  const state = {
    isLoaded: false,
    isModalOpen: false,
    currentStoryId: null,
    paintedStories: new Set(),
    currentScrollY: 0,
    targetScrollY: 0,
    maxScrollY: 0,
    lockedScrollY: 0,
    touchStartY: 0,
    touchLastY: 0,
    modalTouchLastY: 0,
    touchVelocityY: 0,
    isTouching: false,
    isProgrammaticScroll: false,
    climbTimeout: null
  };

  // DOM Elements
  const dom = {};

  function cacheDom() {
    dom.loader = document.getElementById("orbitar-loader");
    dom.loaderFill = document.getElementById("loader-progress-fill");
    dom.loaderStatus = document.getElementById("loader-status-text");
    dom.btnEnterNow = document.getElementById("btn-enter-now");

    dom.altitudeFill = document.getElementById("altitude-track-fill");
    dom.altitudeReadout = document.getElementById("altitude-readout");
    dom.btnClimbUp = document.getElementById("btn-climb-up");
    dom.btnStartClimb = document.getElementById("btn-start-climb");
    dom.btnDescendRoots = document.getElementById("btn-descend-roots");
    dom.btnResetPainted = document.getElementById("btn-reset-painted");
    dom.btnPaintAllDemo = document.getElementById("btn-paint-all-demo");
    dom.climbHintCallout = document.getElementById("climb-hint-callout");

    dom.zoneNameDisplay = document.getElementById("climber-zone-name");
    dom.climberStatusCaption = document.getElementById("climber-status-caption");
    dom.paintedCountNumbers = document.querySelectorAll(".js-painted-count");

    dom.storyNodes = document.querySelectorAll(".story-node[data-story-id]");
    dom.storyPips = document.querySelectorAll(".story-pip[data-story-id]");
    dom.altitudeDots = document.querySelectorAll(".altitude-node-dot[data-target-zone]");

    dom.summitBanner = document.getElementById("summit-completion-banner");
    dom.summitBannerTitle = document.getElementById("summit-banner-title");
    dom.summitBannerDesc = document.getElementById("summit-banner-desc");

    // Modal
    dom.modalBackdrop = document.getElementById("story-modal");
    dom.modalDialog = document.getElementById("story-modal-dialog");
    dom.modalStoryScroll = document.getElementById("modal-story-scroll");
    dom.modalAudioBox = document.getElementById("modal-audio-box");
    dom.modalAudioTitle = document.getElementById("modal-audio-title");
    dom.modalAudioSub = document.getElementById("modal-audio-sub");
    dom.modalNativeAudio = document.getElementById("modal-native-audio");
    dom.btnAudioBoost = document.getElementById("btn-audio-boost");
    dom.modalMissionBox = document.getElementById("modal-mission-box");
    dom.modalMissionLink = document.getElementById("modal-mission-link");
    dom.modalMissionLabel = document.getElementById("modal-mission-label");
    dom.modalCloseBtn = document.getElementById("modal-close-btn");
    dom.modalCloseFooterBtn = document.getElementById("modal-close-footer-btn");
    dom.modalNextStoryBtn = document.getElementById("modal-next-story-btn");
    dom.modalNextStoryLabel = document.getElementById("modal-next-story-label");
    dom.modalModeBadge = document.getElementById("modal-mode-badge");
    dom.modalLevelBadge = document.getElementById("modal-level-badge");
    dom.modalTitle = document.getElementById("modal-title");
    dom.modalProtagonist = document.getElementById("modal-protagonist");
    dom.modalQuote = document.getElementById("modal-quote");
    dom.modalBody = document.getElementById("modal-story-body");
  }

  /* --------------------------------------------------------------------------
     1. STORAGE & PAINTED ("PINTADAS") STATE MANAGEMENT
     -------------------------------------------------------------------------- */
  function loadPaintedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => {
            if (window.ORBITAR_STORIES && window.ORBITAR_STORIES[id]) {
              state.paintedStories.add(id);
            }
          });
        }
      }
    } catch (err) {
      // Ignore storage errors in private mode
    }
  }

  function savePaintedState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.paintedStories)));
    } catch (err) {
      // Ignore storage errors
    }
  }

  function markStoryAsPainted(storyId) {
    if (!window.ORBITAR_STORIES[storyId]) return;
    state.paintedStories.add(storyId);
    savePaintedState();
    syncPaintedUI();
  }

  function syncPaintedUI() {
    const totalPainted = state.paintedStories.size;

    // Update all numeric counters (bottom navbar, summit, etc.)
    dom.paintedCountNumbers.forEach((el) => {
      el.textContent = String(totalPainted);
    });

    // Update each of the 6 story nodes on the tree
    dom.storyNodes.forEach((node) => {
      const id = node.getAttribute("data-story-id");
      const mode = node.getAttribute("data-mode");
      const statusPill = node.querySelector(".painted-status-pill");
      const ctaLabel = node.querySelector(".story-node-cta-text");
      const isPainted = state.paintedStories.has(id);

      node.classList.toggle("is-painted", isPainted);
      node.setAttribute("aria-pressed", isPainted ? "true" : "false");

      if (statusPill) {
        if (isPainted) {
          statusPill.textContent = mode === "espacial" ? "ESTRELLA PINTADA ★" : "HISTORIA PINTADA ✓";
        } else {
          statusPill.textContent = "SIN PINTAR · ABRIR";
        }
      }

      if (ctaLabel) {
        if (isPainted) {
          ctaLabel.textContent = mode === "espacial"
            ? "Estrella ya pintada · Volver a leer misión"
            : "Mito ya pintado · Volver a leer historia";
        } else {
          ctaLabel.textContent = mode === "espacial"
            ? "Hacer clic en la estrella para abrir y pintar"
            : "Hacer clic en el mito Wichí para abrir y pintar";
        }
      }
    });

    // Update bottom navbar mini-pips
    dom.storyPips.forEach((pip) => {
      const id = pip.getAttribute("data-story-id");
      pip.classList.toggle("is-painted", state.paintedStories.has(id));
    });

    // Update level dots on right-side altitude track if both stories in a level are painted
    [1, 2, 3].forEach((lvl) => {
      const bothPainted =
        state.paintedStories.has("wichi-" + lvl) &&
        state.paintedStories.has("espacial-" + lvl);
      const dot = document.querySelector(`.altitude-node-dot[data-target-zone="zone-level-${lvl}"]`);
      if (dot) {
        dot.classList.toggle("is-level-painted", bothPainted);
      }
    });

    // Update Summit completion banner at the top of the tree
    if (dom.summitBanner && dom.summitBannerTitle && dom.summitBannerDesc) {
      if (totalPainted >= 6) {
        dom.summitBanner.classList.add("is-all-painted");
        dom.summitBannerTitle.textContent = "✦ ¡Constelación Completa! Las 6 historias (3 Wichí + 3 Espaciales) están pintadas";
        dom.summitBannerDesc.textContent = "Recorriste los 3 niveles desde las raíces hasta el cosmos y dejaste iluminadas todas las memorias del árbol.";
      } else {
        dom.summitBanner.classList.remove("is-all-painted");
        dom.summitBannerTitle.textContent = `Has pintado ${totalPainted} de 6 historias en tu ascenso`;
        dom.summitBannerDesc.textContent = "Abrí los mitos Wichí y las estrellas Espaciales en los 3 niveles para que queden pintados de color.";
      }
    }
  }

  /* --------------------------------------------------------------------------
     2. BOTTOM-START POSITIONING & DAMPED SMOOTH SCROLL/SWIPE ENGINE
     -------------------------------------------------------------------------- */
  function recalcScrollBounds() {
    state.maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function jumpToBottomRootsInstant() {
    recalcScrollBounds();
    state.isProgrammaticScroll = true;
    state.currentScrollY = state.maxScrollY;
    state.targetScrollY = state.maxScrollY;
    window.scrollTo(0, state.maxScrollY);
    updateAltitudeHUD(state.maxScrollY);
    setTimeout(() => {
      state.isProgrammaticScroll = false;
    }, 60);
  }

  function smoothGlideToY(destinationY) {
    recalcScrollBounds();
    state.targetScrollY = Math.max(0, Math.min(state.maxScrollY, destinationY));
  }

  function smoothGlideToZone(zoneId) {
    recalcScrollBounds();
    if (zoneId === "zone-summit") {
      smoothGlideToY(0);
      return;
    }
    if (zoneId === "zone-roots") {
      smoothGlideToY(state.maxScrollY);
      return;
    }
    const el = document.getElementById(zoneId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    smoothGlideToY(Math.max(0, absoluteTop - 24));
  }

  // Step upward to the next zone when clicking the right-side Upward Arrow button
  function climbOneStepUp() {
    recalcScrollBounds();
    const currentY = window.scrollY;
    const targetsAboveRoots = ["zone-level-1", "zone-level-2", "zone-level-3"];

    // Order targets from bottom-most (Nivel 1) to top-most (Nivel 3)
    const zoneTargets = targetsAboveRoots
      .map((id) => {
        const el = document.getElementById(id);
        return el ? { id, targetY: Math.max(0, el.offsetTop - 24) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.targetY - a.targetY);

    for (const z of zoneTargets) {
      if (z.targetY < currentY - 90) {
        smoothGlideToY(z.targetY);
        return;
      }
    }

    // If already at or above Nivel 3, glide all the way to 0 (Summit)
    smoothGlideToY(0);
  }

  function updateAltitudeHUD(scrollY) {
    recalcScrollBounds();
    const max = state.maxScrollY || 1;
    // Inverted progress: bottom (scrollY = max) is 0% altitude; top (scrollY = 0) is 100% altitude
    const progress = Math.max(0, Math.min(1, (max - scrollY) / max));
    const percent = Math.round(progress * 100);

    if (dom.altitudeFill) {
      dom.altitudeFill.style.height = `${percent}%`;
    }
    if (dom.altitudeReadout) {
      dom.altitudeReadout.textContent = `${percent}%`;
    }

    // Dismiss floating hint once user climbs past 8%
    if (dom.climbHintCallout && percent > 8) {
      dom.climbHintCallout.classList.add("is-dismissed");
    }

    // Determine active zone
    let activeZoneId = "zone-roots";
    let activeZoneLabel = "Raíces del Yuchán · Inicio (Abajo)";
    let climberCaption = "Escalando desde la Raíz ↑";

    if (percent >= 84) {
      activeZoneId = "zone-summit";
      activeZoneLabel = "Cima del Árbol · Cosmos y Créditos";
      climberCaption = "Cima Alcanzada ✦ Cosmos";
    } else if (percent >= 60) {
      activeZoneId = "zone-level-3";
      activeZoneLabel = "Nivel 3 · Copa Celeste y Espacio Profundo";
      climberCaption = "Nivel 3 · Copa y Estrellas ↑";
    } else if (percent >= 36) {
      activeZoneId = "zone-level-2";
      activeZoneLabel = "Nivel 2 · Tronco Sagrado y Órbita";
      climberCaption = "Nivel 2 · Tronco Sagrado ↑";
    } else if (percent >= 14) {
      activeZoneId = "zone-level-1";
      activeZoneLabel = "Nivel 1 · Raíces y Horizonte";
      climberCaption = "Nivel 1 · Primer Ascenso ↑";
    }

    if (dom.zoneNameDisplay) {
      dom.zoneNameDisplay.textContent = activeZoneLabel;
    }
    if (dom.climberStatusCaption) {
      dom.climberStatusCaption.textContent = climberCaption;
    }

    dom.altitudeDots.forEach((dot) => {
      const target = dot.getAttribute("data-target-zone");
      dot.classList.toggle("is-active", target === activeZoneId);
    });
  }

  function triggerClimbingVisualPulse() {
    document.body.classList.add("is-climbing");
    if (state.climbTimeout) clearTimeout(state.climbTimeout);
    state.climbTimeout = setTimeout(() => {
      document.body.classList.remove("is-climbing");
    }, 260);
  }

  function setupDampedScrollPhysics() {
    // 1. Wheel listener with reduced speed for smooth climbing & strict modal scroll lock
    window.addEventListener(
      "wheel",
      (e) => {
        if (!state.isLoaded) {
          e.preventDefault();
          return;
        }

        // When a story popup is open, NEVER scroll the background tree:
        // allow scrolling ONLY inside #modal-story-scroll and block overscroll at boundaries
        if (state.isModalOpen) {
          const scrollArea = dom.modalStoryScroll;
          if (!scrollArea || !scrollArea.contains(e.target)) {
            e.preventDefault();
            return;
          }
          const canScroll = scrollArea.scrollHeight > scrollArea.clientHeight;
          if (!canScroll) {
            e.preventDefault();
            return;
          }
          const atTop = scrollArea.scrollTop <= 0 && e.deltaY < 0;
          const atBottom =
            scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1 &&
            e.deltaY > 0;
          if (atTop || atBottom) {
            e.preventDefault();
          }
          return;
        }

        e.preventDefault();
        recalcScrollBounds();
        const dampedDelta = e.deltaY * WHEEL_SPEED_FACTOR;
        state.targetScrollY = Math.max(
          0,
          Math.min(state.maxScrollY, state.targetScrollY + dampedDelta)
        );
        triggerClimbingVisualPulse();
      },
      { passive: false }
    );

    // 2. Touch swipe listener with reduced velocity for smooth mobile swipe & modal lock
    window.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || e.touches.length === 0) return;
        if (state.isModalOpen) {
          state.modalTouchLastY = e.touches[0].clientY;
          return;
        }
        if (!state.isLoaded) return;
        state.isTouching = true;
        state.touchStartY = e.touches[0].clientY;
        state.touchLastY = state.touchStartY;
        state.touchVelocityY = 0;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!e.touches || e.touches.length === 0) return;

        // When modal is open, prevent touch-scrolling outside #modal-story-scroll or past its edges
        if (state.isModalOpen) {
          const scrollArea = dom.modalStoryScroll;
          const currentTouchY = e.touches[0].clientY;
          const deltaTouchY = state.modalTouchLastY - currentTouchY; // >0 scrolling down
          state.modalTouchLastY = currentTouchY;

          if (!scrollArea || !scrollArea.contains(e.target)) {
            e.preventDefault();
            return;
          }
          const canScroll = scrollArea.scrollHeight > scrollArea.clientHeight;
          if (!canScroll) {
            e.preventDefault();
            return;
          }
          const atTop = scrollArea.scrollTop <= 0 && deltaTouchY < 0;
          const atBottom =
            scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1 &&
            deltaTouchY > 0;
          if (atTop || atBottom) {
            e.preventDefault();
          }
          return;
        }

        if (!state.isLoaded || !state.isTouching) return;
        // Prevent abrupt native fling so our damped swipe governs ascent smoothly
        e.preventDefault();
        recalcScrollBounds();
        const currentY = e.touches[0].clientY;
        const rawDeltaY = state.touchLastY - currentY;
        state.touchLastY = currentY;

        const dampedDelta = rawDeltaY * TOUCH_SWIPE_FACTOR;
        state.touchVelocityY = dampedDelta;
        state.targetScrollY = Math.max(
          0,
          Math.min(state.maxScrollY, state.targetScrollY + dampedDelta)
        );
        triggerClimbingVisualPulse();
      },
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      () => {
        state.isTouching = false;
      },
      { passive: true }
    );

    // 3. Sync when user drags scrollbar or programmatic scroll happens (strictly locked when modal open)
    window.addEventListener(
      "scroll",
      () => {
        if (state.isModalOpen) {
          if (Math.abs(window.scrollY - state.lockedScrollY) > 1) {
            state.isProgrammaticScroll = true;
            window.scrollTo(0, state.lockedScrollY);
            state.isProgrammaticScroll = false;
          }
          return;
        }
        if (!state.isProgrammaticScroll) {
          const actualY = window.scrollY;
          // If external scroll jump happened (e.g. scrollbar drag), sync target
          if (Math.abs(actualY - state.currentScrollY) > 65) {
            state.currentScrollY = actualY;
            state.targetScrollY = actualY;
          }
        }
        updateAltitudeHUD(window.scrollY);
      },
      { passive: true }
    );

    // 4. Continuous rAF smooth interpolation loop
    function tickSmoothScroll() {
      if (state.isLoaded && !state.isModalOpen) {
        // Apply residual touch momentum if not actively touching
        if (!state.isTouching && Math.abs(state.touchVelocityY) > 0.25) {
          state.targetScrollY = Math.max(
            0,
            Math.min(state.maxScrollY, state.targetScrollY + state.touchVelocityY)
          );
          state.touchVelocityY *= TOUCH_FRICTION;
        }

        const diff = state.targetScrollY - state.currentScrollY;
        if (Math.abs(diff) > 0.4) {
          state.currentScrollY += diff * LERP_SMOOTHING;
          state.isProgrammaticScroll = true;
          window.scrollTo(0, Math.round(state.currentScrollY));
          state.isProgrammaticScroll = false;
        }
      }
      requestAnimationFrame(tickSmoothScroll);
    }

    requestAnimationFrame(tickSmoothScroll);
  }

  /* --------------------------------------------------------------------------
     3. STORY MODAL POPUP (SCROLLABLE ILLUSTRATED STORIES + SAME-LEVEL SIBLING)
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let audioGainNode = null;
  const BOOST_LEVELS = [1.6, 2.2, 1.0];
  let currentBoostIndex = 0;

  function ensureWebAudioBooster() {
    if (!dom.modalNativeAudio) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaElementSource(dom.modalNativeAudio);
        const compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.value = -20;
        compressor.knee.value = 18;
        compressor.ratio.value = 4;
        compressor.attack.value = 0.005;
        compressor.release.value = 0.2;

        audioGainNode = audioCtx.createGain();
        audioGainNode.gain.value = BOOST_LEVELS[currentBoostIndex];

        source.connect(compressor);
        compressor.connect(audioGainNode);
        audioGainNode.connect(audioCtx.destination);
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    } catch (err) {
      // Fallback gracefully to native audio element output
    }
  }

  function cycleAudioBoost() {
    currentBoostIndex = (currentBoostIndex + 1) % BOOST_LEVELS.length;
    const gainValue = BOOST_LEVELS[currentBoostIndex];
    ensureWebAudioBooster();
    if (audioGainNode && audioCtx) {
      audioGainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    }
    if (dom.btnAudioBoost) {
      const pct = Math.round(gainValue * 100);
      dom.btnAudioBoost.innerHTML = `<span>⚡ Boost Voz: ${pct}%</span>`;
      dom.btnAudioBoost.classList.toggle("is-active", gainValue > 1.0);
    }
  }

  function stopModalAudio() {
    if (dom.modalNativeAudio) {
      try {
        dom.modalNativeAudio.pause();
        dom.modalNativeAudio.currentTime = 0;
      } catch (err) {
        // Ignore audio reset errors
      }
    }
  }

  function renderStoryIllustrationSVG(artId, mode) {
    if (mode === "wichi") {
      if (artId === "wichi-yuchan-dorado" || artId === "wichi-yuchan-water") {
        return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración del enorme Yuchán resguardando el agua y al dorado sagrado de cola colorada">
          <rect width="640" height="220" fill="#1A1512"/>
          <rect x="0" y="0" width="640" height="14" fill="url(#yicaPattern)"/>
          <rect x="0" y="206" width="640" height="14" fill="url(#yicaPattern)"/>
          <ellipse cx="320" cy="112" rx="86" ry="74" fill="#2A2019" stroke="#C97A2B" stroke-width="4"/>
          <ellipse cx="320" cy="112" rx="62" ry="52" fill="#13251B" stroke="#339136" stroke-width="2.5"/>
          <!-- El Dorado Sagrado con cola brillante y colorada -->
          <path d="M278,100 Q318,76 356,100 Q318,124 278,100 Z" fill="#F48138" stroke="#F3EBDD" stroke-width="1.5"/>
          <polygon points="274,100 252,85 256,100 252,115" fill="#E03C1F" stroke="#F48138" stroke-width="1.2"/>
          <circle cx="342" cy="98" r="2.8" fill="#1A1512"/>
          <!-- Otros peces nadando en el interior -->
          <path d="M352,132 Q324,116 296,132 Q324,148 352,132 Z" fill="#E2D3BA"/>
          <polygon points="356,132 372,122 372,142" fill="#E2D3BA"/>
          <path d="M90,176 Q190,152 240,168 M400,168 Q450,152 550,176" stroke="#C97A2B" stroke-width="3.5" fill="none"/>
          <text x="320" y="30" text-anchor="middle" fill="#F3EBDD" font-family="Sansita, sans-serif" font-size="13" letter-spacing="1.8">EL YUCHÁN Y EL DORADO SAGRADO DE COLA COLORADA</text>
        </svg>`;
      }
      if (artId === "wichi-tokwaj-rios" || artId === "wichi-pilcomayo-river") {
        return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de la flecha de Tokwaj y el Yuchán liberando los ríos y lagunas">
          <rect width="640" height="220" fill="#1E1713"/>
          <!-- Flecha de Tokwaj -->
          <line x1="120" y1="42" x2="292" y2="96" stroke="#F3EBDD" stroke-width="3.5"/>
          <polygon points="298,98 282,86 286,102" fill="#E03C1F"/>
          <!-- Ríos, lagunas y arroyos brotando en todas direcciones -->
          <path d="M320,104 Q190,115 20,155" stroke="#2E96F5" stroke-width="12" fill="none" opacity="0.65"/>
          <path d="M320,104 Q450,115 620,155" stroke="#2E96F5" stroke-width="12" fill="none" opacity="0.65"/>
          <path d="M0,145 Q160,105 320,145 T640,140" stroke="#C97A2B" stroke-width="14" fill="none" opacity="0.45"/>
          <path d="M0,162 Q160,122 320,162 T640,155" stroke="#F3EBDD" stroke-width="3.5" fill="none" stroke-dasharray="10 6"/>
          <path d="M0,178 Q160,138 320,178 T640,172" stroke="#339136" stroke-width="3.5" fill="none"/>
          <polygon points="320,38 356,88 320,138 284,88" fill="#2A2019" stroke="#F48138" stroke-width="3"/>
          <text x="320" y="200" text-anchor="middle" fill="#E2D3BA" font-family="Sansita, sans-serif" font-size="13" letter-spacing="1.8">TOKWAJ Y EL ESTALLIDO QUE FORMÓ LOS RÍOS Y LAGUNAS</text>
        </svg>`;
      }
      if (artId === "wichi-ember-guardian") {
        return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración del guardián de la brasa sagrada">
          <rect width="640" height="220" fill="#1A1512"/>
          <circle cx="320" cy="105" r="56" fill="rgba(244,129,56,0.16)" stroke="#C97A2B" stroke-width="2" stroke-dasharray="6 4"/>
          <polygon points="320,52 352,108 320,154 288,108" fill="#F48138" stroke="#F3EBDD" stroke-width="2.5"/>
          <polygon points="320,74 338,108 320,136 302,108" fill="#E2D3BA"/>
          <g stroke="#C97A2B" stroke-width="2.5" fill="none">
            <polyline points="70,110 110,80 150,110 190,80 230,110"/>
            <polyline points="410,110 450,80 490,110 530,80 570,110"/>
          </g>
          <text x="320" y="196" text-anchor="middle" fill="#F3EBDD" font-family="Sansita, sans-serif" font-size="13" letter-spacing="2">LA CHISPA SAGRADA EN LA NOCHE DEL CHACO</text>
        </svg>`;
      }
      if (artId === "wichi-palo-santo-grain") {
        return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de las vetas de palo santo y quebracho">
          <rect width="640" height="220" fill="#1C1510"/>
          <path d="M40,65 Q180,40 320,65 T600,65" stroke="#857F74" stroke-width="3" fill="none"/>
          <path d="M40,105 Q180,82 320,105 T600,105" stroke="#C97A2B" stroke-width="4" fill="none"/>
          <path d="M40,145 Q180,125 320,145 T600,145" stroke="#339136" stroke-width="3" fill="none"/>
          <circle cx="320" cy="105" r="28" fill="#2A2019" stroke="#F48138" stroke-width="3.5"/>
          <circle cx="320" cy="105" r="11" fill="#F48138"/>
          <text x="320" y="196" text-anchor="middle" fill="#F3EBDD" font-family="Sansita, sans-serif" font-size="13" letter-spacing="2">VETAS DE PALO SANTO · EL CALOR DE LA MADERA</text>
        </svg>`;
      }
      if (artId === "wichi-chaguar-cord") {
        return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de las mujeres estrella y cuerda de chaguar">
          <rect width="640" height="220" fill="#161215"/>
          <line x1="320" y1="20" x2="320" y2="180" stroke="#C97A2B" stroke-width="6" stroke-dasharray="10 5"/>
          <polygon points="320,24 328,46 352,46 332,60 340,82 320,68 300,82 308,60 288,46 312,46" fill="#F3EBDD" stroke="#F48138" stroke-width="2"/>
          <circle cx="200" cy="70" r="4.5" fill="#E2D3BA"/>
          <circle cx="440" cy="65" r="5.5" fill="#F48138"/>
          <circle cx="150" cy="135" r="4" fill="#339136"/>
          <circle cx="485" cy="130" r="4.5" fill="#E2D3BA"/>
          <text x="320" y="202" text-anchor="middle" fill="#F3EBDD" font-family="Sansita, sans-serif" font-size="13" letter-spacing="2">CHELCHUPÉ · LA CUERDA ENTRE MONTE Y CIELO</text>
        </svg>`;
      }
      return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de geometría de yica y constelaciones wichí">
        <rect width="640" height="220" fill="#121014"/>
        <path d="M40,175 Q240,40 600,40" stroke="#E2D3BA" stroke-width="22" stroke-linecap="round" fill="none" opacity="0.22"/>
        <polyline points="90,145 160,95 230,145 300,95 370,145 440,95 510,145" stroke="#C97A2B" stroke-width="3.5" fill="none"/>
        <g fill="#F48138">
          <circle cx="160" cy="95" r="6"/><circle cx="300" cy="95" r="6"/><circle cx="440" cy="95" r="6"/>
        </g>
        <text x="320" y="198" text-anchor="middle" fill="#F3EBDD" font-family="Sansita, sans-serif" font-size="13" letter-spacing="2">NAYIC · TEJIDO DE YICA Y CAMINO ESTELAR</text>
      </svg>`;
    }

    // Mode === "espacial" (3 Selected Official NASA Missions)
    if (artId === "space-rovers-water") {
      return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rovers Spirit y Opportunity siguiendo las huellas del agua en Marte">
        <rect width="640" height="220" fill="#07173F"/>
        <path d="M0,155 Q180,120 340,152 T640,145 L640,220 L0,220 Z" fill="#2A1A17" stroke="#F48138" stroke-width="2"/>
        <!-- Cauce antiguo de agua marciana -->
        <path d="M70,178 Q240,138 380,172 T590,168" stroke="#2E96F5" stroke-width="6" stroke-dasharray="10 5" fill="none"/>
        <!-- Rover Opportunity silueta -->
        <rect x="285" y="102" width="70" height="26" rx="4" fill="#1B2B85" stroke="#E7F434" stroke-width="2.5"/>
        <line x1="335" y1="102" x2="345" y2="62" stroke="#E7F434" stroke-width="3"/>
        <rect x="333" y="52" width="24" height="12" rx="2" fill="#E7F434"/>
        <circle cx="292" cy="142" r="10" fill="#151622" stroke="#E7F434" stroke-width="2.5"/>
        <circle cx="320" cy="144" r="10" fill="#151622" stroke="#E7F434" stroke-width="2.5"/>
        <circle cx="348" cy="142" r="10" fill="#151622" stroke="#E7F434" stroke-width="2.5"/>
        <!-- Hematite blueberries -->
        <circle cx="205" cy="166" r="5" fill="#2E96F5"/><circle cx="222" cy="174" r="4.5" fill="#2E96F5"/>
        <circle cx="435" cy="168" r="5" fill="#2E96F5"/><circle cx="454" cy="162" r="4" fill="#2E96F5"/>
        <text x="24" y="32" fill="#E7F434" font-family="JetBrains Mono, monospace" font-size="11">MARS EXPLORATION ROVERS · SPIRIT &amp; OPPORTUNITY · FOLLOW THE WATER</text>
      </svg>`;
    }
    if (artId === "space-opportunity-tracks") {
      return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Huellas de Opportunity en Meridiani Planum y el cráter Endeavour">
        <rect width="640" height="220" fill="#050D24"/>
        <path d="M0,130 Q320,95 640,130 L640,220 L0,220 Z" fill="#1F1518" stroke="#C97A2B" stroke-width="2"/>
        <path d="M120,215 Q240,155 305,112" stroke="#E7F434" stroke-width="3" stroke-dasharray="6 4" fill="none"/>
        <path d="M165,215 Q275,155 335,112" stroke="#E7F434" stroke-width="3" stroke-dasharray="6 4" fill="none"/>
        <circle cx="490" cy="64" r="22" fill="rgba(46,150,245,0.25)" stroke="#2E96F5" stroke-width="2.5"/>
        <text x="24" y="32" fill="#E7F434" font-family="JetBrains Mono, monospace" font-size="11">MER-B OPPORTUNITY · 45.16 KM ODYSSEY · ANCIENT SHORELINES</text>
      </svg>`;
    }
    if (artId === "space-insight-seis") {
      return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Módulo InSight y sismómetro SEIS sobre la corteza de Marte">
        <rect width="640" height="220" fill="#07173F"/>
        <line x1="0" y1="150" x2="640" y2="150" stroke="#F48138" stroke-width="3"/>
        <!-- Lander body & solar arrays -->
        <rect x="275" y="96" width="76" height="28" rx="4" fill="#1B2B85" stroke="#E7F434" stroke-width="2.5"/>
        <circle cx="220" cy="110" r="32" fill="rgba(46,150,245,0.22)" stroke="#2E96F5" stroke-width="2"/>
        <circle cx="406" cy="110" r="32" fill="rgba(46,150,245,0.22)" stroke="#2E96F5" stroke-width="2"/>
        <!-- Robotic arm & SEIS dome -->
        <polyline points="335,96 390,68 455,134" stroke="#E7F434" stroke-width="3" fill="none"/>
        <path d="M435,150 Q455,120 475,150 Z" fill="#E7F434"/>
        <!-- Seismic waves below ground -->
        <path d="M415,168 Q455,192 495,168" stroke="#F48138" stroke-width="2.5" fill="none"/>
        <path d="M395,180 Q455,212 515,180" stroke="#E7F434" stroke-width="2" stroke-dasharray="5 4" fill="none"/>
        <text x="24" y="32" fill="#E7F434" font-family="JetBrains Mono, monospace" font-size="11">NASA INSIGHT · SEIS SEISMOMETER · 1,319 MARSQUAKES DETECTED</text>
      </svg>`;
    }
    if (artId === "space-insight-core") {
      return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interior profundo y núcleo líquido caliente detectado por InSight">
        <rect width="640" height="220" fill="#091533"/>
        <circle cx="320" cy="116" r="78" fill="#2A1A17" stroke="#C97A2B" stroke-width="3"/>
        <circle cx="320" cy="116" r="54" fill="#5A2713" stroke="#F48138" stroke-width="2.5"/>
        <circle cx="320" cy="116" r="30" fill="#E7F434" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M110,116 L240,116 M400,116 L530,116" stroke="#2E96F5" stroke-width="2" stroke-dasharray="6 4"/>
        <text x="24" y="32" fill="#2E96F5" font-family="JetBrains Mono, monospace" font-size="11">PLANETARY INTERIOR · LIQUID CORE HEAT &amp; SEISMIC HEARTBEAT</text>
      </svg>`;
    }
    if (artId === "space-pioneer-plaque") {
      return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La Placa Dorada de Pioneer 10 con el mapa de púlsares y las figuras humanas">
        <rect width="640" height="220" fill="#050D24"/>
        <rect x="170" y="42" width="300" height="148" rx="8" fill="rgba(231,244,52,0.12)" stroke="#E7F434" stroke-width="3"/>
        <!-- Pulsar starburst on left -->
        <circle cx="245" cy="116" r="5" fill="#E7F434"/>
        <g stroke="#E7F434" stroke-width="1.8">
          <line x1="245" y1="116" x2="195" y2="68"/><line x1="245" y1="116" x2="190" y2="116"/>
          <line x1="245" y1="116" x2="202" y2="162"/><line x1="245" y1="116" x2="295" y2="72"/>
          <line x1="245" y1="116" x2="298" y2="158"/><line x1="245" y1="116" x2="245" y2="58"/>
        </g>
        <!-- Two human figures silhouette on right -->
        <circle cx="372" cy="78" r="8" fill="none" stroke="#E7F434" stroke-width="2.2"/>
        <line x1="372" y1="86" x2="372" y2="132" stroke="#E7F434" stroke-width="2.2"/>
        <polyline points="356,108 372,94 392,76" stroke="#E7F434" stroke-width="2.2" fill="none"/>
        <line x1="372" y1="132" x2="362" y2="166" stroke="#E7F434" stroke-width="2.2"/>
        <line x1="372" y1="132" x2="382" y2="166" stroke="#E7F434" stroke-width="2.2"/>
        <circle cx="416" cy="84" r="7.5" fill="none" stroke="#E7F434" stroke-width="2.2"/>
        <line x1="416" y1="92" x2="416" y2="134" stroke="#E7F434" stroke-width="2.2"/>
        <line x1="416" y1="134" x2="408" y2="166" stroke="#E7F434" stroke-width="2.2"/>
        <line x1="416" y1="134" x2="424" y2="166" stroke="#E7F434" stroke-width="2.2"/>
        <text x="24" y="28" fill="#E7F434" font-family="JetBrains Mono, monospace" font-size="11">PIONEER 10 GOLDEN PLAQUE · HUMAN GREETING &amp; PULSAR MAP</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pioneer 10 navegando hacia Aldebarán y las Pléyades">
      <rect width="640" height="220" fill="#07173F"/>
      <path d="M70,170 Q280,105 550,58" stroke="#2E96F5" stroke-width="3" stroke-dasharray="8 5" fill="none"/>
      <circle cx="550" cy="58" r="14" fill="#F48138" stroke="#E7F434" stroke-width="2.5"/>
      <!-- Pleiades cluster nearby -->
      <g fill="#E7F434">
        <circle cx="470" cy="48" r="3.5"/><circle cx="485" cy="42" r="4"/><circle cx="496" cy="52" r="3"/>
        <circle cx="478" cy="60" r="3.5"/><circle cx="508" cy="44" r="3"/>
      </g>
      <polygon points="240,126 278,106 278,146" fill="#1B2B85" stroke="#E7F434" stroke-width="2.5"/>
      <text x="24" y="32" fill="#E7F434" font-family="JetBrains Mono, monospace" font-size="11">PIONEER 10 INTERSTELLAR TRAJECTORY · TAURUS &amp; PLEIADES</text>
    </svg>`;
  }

  function openStoryModal(storyId) {
    const story = window.ORBITAR_STORIES && window.ORBITAR_STORIES[storyId];
    if (!story || !dom.modalBackdrop) return;

    // Stop any playing audio from previous story before switching
    stopModalAudio();

    // Lock background scroll position at the exact tree altitude where modal opened
    if (!state.isModalOpen) {
      state.lockedScrollY = window.scrollY;
      state.currentScrollY = state.lockedScrollY;
      state.targetScrollY = state.lockedScrollY;
      state.touchVelocityY = 0;
    }

    state.currentStoryId = storyId;
    state.isModalOpen = true;

    // Immediately mark story as PAINTED ("PINTADA") when opened
    markStoryAsPainted(storyId);

    // Populate modal attributes & content
    dom.modalDialog.setAttribute("data-mode", story.mode);
    dom.modalModeBadge.textContent = story.modeTitle;
    dom.modalModeBadge.className =
      "mode-badge " + (story.mode === "espacial" ? "mode-badge--espacial" : "mode-badge--wichi");
    dom.modalLevelBadge.textContent = story.levelLabel;
    dom.modalTitle.textContent = story.title;
    dom.modalProtagonist.textContent = story.protagonist;
    dom.modalQuote.textContent = story.quote;

    // Bonus Audio Player (e.g. Wichí Level 1 native-language narration cuento.mp4)
    if (dom.modalAudioBox && dom.modalNativeAudio) {
      if (story.audioSrc) {
        dom.modalAudioBox.hidden = false;
        if (dom.modalAudioTitle) {
          dom.modalAudioTitle.textContent =
            story.audioTitle || "🔊 Escuchar narración en lengua nativa Wichí";
        }
        if (dom.modalAudioSub) {
          dom.modalAudioSub.textContent =
            story.audioSubtitle || "Audio original del relato";
        }
        const fallback = story.audioFallbackSrc || "audio/cuento.mp4";
        dom.modalNativeAudio.innerHTML = `
          <source src="${story.audioSrc}" type="audio/mp4">
          <source src="${fallback}" type="audio/mp4">
          <source src="${story.audioSrc}" type="video/mp4">
          <source src="${fallback}" type="video/mp4">
        `;
        dom.modalNativeAudio.load();
      } else {
        dom.modalAudioBox.hidden = true;
        dom.modalNativeAudio.innerHTML = "";
      }
    }

    // Official NASA Mission Link (Space Mode)
    if (dom.modalMissionBox && dom.modalMissionLink) {
      if (story.missionUrl) {
        dom.modalMissionBox.hidden = false;
        dom.modalMissionLink.href = story.missionUrl;
        if (dom.modalMissionLabel) {
          dom.modalMissionLabel.textContent =
            story.missionLabel || "Ver misión oficial en science.nasa.gov";
        }
      } else {
        dom.modalMissionBox.hidden = true;
      }
    }

    // Update the same-level sibling button label (Wichí -> Space or Space -> Wichí)
    if (dom.modalNextStoryLabel && story.siblingButtonLabel) {
      dom.modalNextStoryLabel.textContent = story.siblingButtonLabel;
    }

    // Populate rich story blocks (paragraphs + illustrations/photos) inside the scrollable container
    dom.modalBody.innerHTML = "";
    if (Array.isArray(story.blocks) && story.blocks.length > 0) {
      story.blocks.forEach((block) => {
        if (block.type === "text") {
          const p = document.createElement("p");
          p.textContent = block.content;
          dom.modalBody.appendChild(p);
        } else if (block.type === "illustration") {
          const figure = document.createElement("figure");
          figure.className = "modal-story-figure";

          const artWrap = document.createElement("div");
          artWrap.className = "modal-story-illustration";
          if (block.imageSrc) {
            const img = document.createElement("img");
            img.className = "modal-story-photo";
            img.src = block.imageSrc;
            img.alt = block.caption || story.title;
            img.loading = "lazy";
            artWrap.appendChild(img);
          } else {
            artWrap.innerHTML = renderStoryIllustrationSVG(block.artId, story.mode);
          }
          figure.appendChild(artWrap);

          if (block.caption) {
            const figcaption = document.createElement("figcaption");
            figcaption.className = "modal-story-caption";
            figcaption.textContent = block.caption;
            figure.appendChild(figcaption);
          }

          dom.modalBody.appendChild(figure);
        }
      });
    } else if (Array.isArray(story.paragraphs)) {
      story.paragraphs.forEach((pText) => {
        const p = document.createElement("p");
        p.textContent = pText;
        dom.modalBody.appendChild(p);
      });
    }

    // Reset story scroll container to top so user reads from the beginning
    if (dom.modalStoryScroll) {
      dom.modalStoryScroll.scrollTop = 0;
    }

    dom.modalBackdrop.classList.add("is-open");
    dom.modalBackdrop.setAttribute("aria-hidden", "false");
    if (dom.modalStoryScroll) {
      dom.modalStoryScroll.focus({ preventScroll: true });
    }
  }

  function closeStoryModal() {
    if (!dom.modalBackdrop) return;
    stopModalAudio();
    state.isModalOpen = false;
    dom.modalBackdrop.classList.remove("is-open");
    dom.modalBackdrop.setAttribute("aria-hidden", "true");
    // Ensure background scroll stays at the exact locked tree position on close
    state.isProgrammaticScroll = true;
    window.scrollTo(0, state.lockedScrollY);
    state.currentScrollY = state.lockedScrollY;
    state.targetScrollY = state.lockedScrollY;
    state.isProgrammaticScroll = false;
  }

  // Switches ONLY to the companion story of the SAME level (Wichí <-> Espacial)
  // Does NOT advance to another level so the user must close the popup and climb the tree
  function openSiblingStorySameLevel() {
    const currentStory = window.ORBITAR_STORIES && window.ORBITAR_STORIES[state.currentStoryId];
    if (!currentStory || !currentStory.siblingId) return;
    openStoryModal(currentStory.siblingId);
  }

  /* --------------------------------------------------------------------------
     4. DARKNESS-EMERGENCE "ORBITAR" PRELOADER
     Requirement #1: "un sitio que antes de cargar muestra un texto en pantalla
     ORBITAR que aparece lentamente desde la oscuridad (este es el loading para
     que carguen los assets de atras)"
     -------------------------------------------------------------------------- */
  function runPreloader() {
    const assetsToPreload = [
      "assets/tree-bg.jpg",
      "assets/climber-back.jpg"
    ];

    let loadedCount = 0;
    const totalAssets = assetsToPreload.length;

    function updateProgress(pct, label) {
      if (dom.loaderFill) dom.loaderFill.style.width = `${pct}%`;
      if (dom.loaderStatus && label) dom.loaderStatus.textContent = label;
    }

    updateProgress(18, "Emergiendo desde la oscuridad · Cargando raíces y cosmos...");

    const assetPromises = assetsToPreload.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            const pct = Math.min(90, 25 + Math.round((loadedCount / totalAssets) * 65));
            updateProgress(pct, `Assets cargados (${loadedCount}/${totalAssets}) · Posicionando en la raíz...`);
            resolve();
          };
          img.onerror = () => {
            loadedCount++;
            resolve();
          };
          img.src = src;
        })
    );

    // Ensure the slow darkness-emergence animation of "ORBITAR" is experienced
    const minAnimationTime = new Promise((resolve) => setTimeout(resolve, 2900));

    Promise.all([Promise.all(assetPromises), minAnimationTime]).then(() => {
      updateProgress(100, "✦ Experiencia cargada (100%) · Presioná para iniciar el ascenso");
      if (dom.loader) {
        dom.loader.classList.add("is-ready");
      }
      if (dom.btnEnterNow) {
        dom.btnEnterNow.classList.add("is-ready");
        dom.btnEnterNow.removeAttribute("disabled");
        dom.btnEnterNow.focus();
      }
      // Do NOT auto-dismiss: wait for the user to press #btn-enter-now
    });
  }

  function completeLoaderAndStartAtBottom() {
    if (state.isLoaded) return;
    state.isLoaded = true;

    // Position viewport at the very bottom (roots of the tree) before revealing
    jumpToBottomRootsInstant();

    setTimeout(() => {
      if (dom.loader) {
        dom.loader.classList.add("is-hidden");
      }
      // Re-verify bottom position after layout settle
      jumpToBottomRootsInstant();
    }, 180);
  }

  /* --------------------------------------------------------------------------
     5. EVENT BINDINGS & INITIALIZATION
     -------------------------------------------------------------------------- */
  function bindEvents() {
    if (dom.btnEnterNow) {
      dom.btnEnterNow.addEventListener("click", () => {
        completeLoaderAndStartAtBottom();
      });
    }

    if (dom.btnClimbUp) {
      dom.btnClimbUp.addEventListener("click", () => {
        climbOneStepUp();
      });
    }

    if (dom.btnStartClimb) {
      dom.btnStartClimb.addEventListener("click", () => {
        smoothGlideToZone("zone-level-1");
      });
    }

    if (dom.btnDescendRoots) {
      dom.btnDescendRoots.addEventListener("click", () => {
        smoothGlideToY(state.maxScrollY);
      });
    }

    if (dom.btnResetPainted) {
      dom.btnResetPainted.addEventListener("click", () => {
        state.paintedStories.clear();
        savePaintedState();
        syncPaintedUI();
      });
    }

    if (dom.btnPaintAllDemo) {
      dom.btnPaintAllDemo.addEventListener("click", () => {
        (window.ORBITAR_STORY_ORDER || []).forEach((id) => state.paintedStories.add(id));
        savePaintedState();
        syncPaintedUI();
      });
    }

    // Story node triggers (3 Wichí + 3 Espacial Stars)
    dom.storyNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const storyId = node.getAttribute("data-story-id");
        openStoryModal(storyId);
      });
    });

    // Bottom navbar pips also open their corresponding story
    dom.storyPips.forEach((pip) => {
      pip.addEventListener("click", () => {
        const storyId = pip.getAttribute("data-story-id");
        openStoryModal(storyId);
      });
    });

    // Right-side altitude dots glide smoothly to their zone
    dom.altitudeDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetZone = dot.getAttribute("data-target-zone");
        smoothGlideToZone(targetZone);
      });
    });

    // Modal controls
    if (dom.modalNativeAudio) {
      dom.modalNativeAudio.addEventListener("play", () => {
        ensureWebAudioBooster();
      });
    }
    if (dom.btnAudioBoost) {
      dom.btnAudioBoost.addEventListener("click", cycleAudioBoost);
    }
    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener("click", closeStoryModal);
    }
    if (dom.modalCloseFooterBtn) {
      dom.modalCloseFooterBtn.addEventListener("click", closeStoryModal);
    }
    if (dom.modalNextStoryBtn) {
      dom.modalNextStoryBtn.addEventListener("click", openSiblingStorySameLevel);
    }
    if (dom.modalBackdrop) {
      dom.modalBackdrop.addEventListener("click", (e) => {
        if (e.target === dom.modalBackdrop) {
          closeStoryModal();
        }
      });
    }

    window.addEventListener("keydown", (e) => {
      if (state.isModalOpen) {
        if (e.key === "Escape") {
          closeStoryModal();
          return;
        }
        if (
          dom.modalStoryScroll &&
          (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp")
        ) {
          e.preventDefault();
          const step = e.key.startsWith("Page") ? dom.modalStoryScroll.clientHeight * 0.75 : 75;
          const dir = e.key === "ArrowDown" || e.key === "PageDown" ? 1 : -1;
          dom.modalStoryScroll.scrollBy({ top: dir * step, behavior: "smooth" });
        }
      } else if (state.isLoaded) {
        if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          const step = e.key === "PageUp" ? window.innerHeight * 0.65 : 140;
          smoothGlideToY(state.targetScrollY - step);
          triggerClimbingVisualPulse();
        } else if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          const step = e.key === "PageDown" ? window.innerHeight * 0.65 : 140;
          smoothGlideToY(state.targetScrollY + step);
          triggerClimbingVisualPulse();
        }
      }
    });

    window.addEventListener("resize", () => {
      recalcScrollBounds();
      updateAltitudeHUD(window.scrollY);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    loadPaintedState();
    syncPaintedUI();
    bindEvents();
    setupDampedScrollPhysics();
    // Position at bottom immediately so behind the loader the page is already at the roots
    jumpToBottomRootsInstant();
    runPreloader();
  });
})();
