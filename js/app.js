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
    touchStartY: 0,
    touchLastY: 0,
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
    dom.modalCloseBtn = document.getElementById("modal-close-btn");
    dom.modalCloseFooterBtn = document.getElementById("modal-close-footer-btn");
    dom.modalNextStoryBtn = document.getElementById("modal-next-story-btn");
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
    // 1. Wheel listener with reduced speed for smooth climbing
    window.addEventListener(
      "wheel",
      (e) => {
        if (!state.isLoaded || state.isModalOpen) return;
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

    // 2. Touch swipe listener with reduced velocity for smooth mobile swipe
    window.addEventListener(
      "touchstart",
      (e) => {
        if (!state.isLoaded || state.isModalOpen) return;
        if (!e.touches || e.touches.length === 0) return;
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
        if (!state.isLoaded || state.isModalOpen || !state.isTouching) return;
        if (!e.touches || e.touches.length === 0) return;
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

    // 3. Sync when user drags scrollbar or programmatic scroll happens
    window.addEventListener(
      "scroll",
      () => {
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
     3. STORY MODAL POPUP (WICHÍ MYTHS & ESPACIAL STARS)
     -------------------------------------------------------------------------- */
  function openStoryModal(storyId) {
    const story = window.ORBITAR_STORIES && window.ORBITAR_STORIES[storyId];
    if (!story || !dom.modalBackdrop) return;

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

    dom.modalBody.innerHTML = "";
    story.paragraphs.forEach((pText) => {
      const p = document.createElement("p");
      p.textContent = pText;
      dom.modalBody.appendChild(p);
    });

    dom.modalBackdrop.classList.add("is-open");
    dom.modalBackdrop.setAttribute("aria-hidden", "false");
    dom.modalCloseBtn.focus();
  }

  function closeStoryModal() {
    if (!dom.modalBackdrop) return;
    state.isModalOpen = false;
    dom.modalBackdrop.classList.remove("is-open");
    dom.modalBackdrop.setAttribute("aria-hidden", "true");
  }

  function openNextUnpaintedOrSequentialStory() {
    const order = window.ORBITAR_STORY_ORDER || [];
    if (!order.length) return;

    // Prefer next unpainted story if any exists
    for (const id of order) {
      if (!state.paintedStories.has(id)) {
        openStoryModal(id);
        const node = document.querySelector(`.story-node[data-story-id="${id}"]`);
        if (node) {
          const rect = node.getBoundingClientRect();
          smoothGlideToY(window.scrollY + rect.top - window.innerHeight * 0.22);
        }
        return;
      }
    }

    // All 6 are painted! Close modal and ascend to the Summit at the top of the tree
    closeStoryModal();
    smoothGlideToY(0);
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
    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener("click", closeStoryModal);
    }
    if (dom.modalCloseFooterBtn) {
      dom.modalCloseFooterBtn.addEventListener("click", closeStoryModal);
    }
    if (dom.modalNextStoryBtn) {
      dom.modalNextStoryBtn.addEventListener("click", openNextUnpaintedOrSequentialStory);
    }
    if (dom.modalBackdrop) {
      dom.modalBackdrop.addEventListener("click", (e) => {
        if (e.target === dom.modalBackdrop) {
          closeStoryModal();
        }
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.isModalOpen) {
        closeStoryModal();
      } else if (!state.isModalOpen && state.isLoaded) {
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
