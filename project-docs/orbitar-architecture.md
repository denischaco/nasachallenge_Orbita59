# ORBITAR Technical Architecture & UX Foundation (NEXUS-Sprint)

## 1. Inverted Spatial Coordinate System (Bottom-to-Top Ascent)
Traditional websites map `scrollY = 0` to the start and `scrollY = max` to the footer.
**ORBITAR** inverts the narrative space:
- **Start (`scrollY = maxScroll`, 100% DOM depth, Altitude `0%`)**: **Raíces de la Tierra (El Origen)** — Deep subterranean roots of the sacred Yuchán tree (`#321401` dark brown earth with `#B95D0E` and `#F48138` glowing veins).
- **Nivel 1 (`~75%` DOM depth, Altitude `25%`)**: **Raíces Superficiales y Horizonte Austral** — Wichí Myth 1 (*El Yuchán y el Agua Primordial*) + Espacial Star 1 (*Apolo 11 — Neil Armstrong*).
- **Nivel 2 (`~50%` DOM depth, Altitude `50%`)**: **Tronco Sagrado y Órbita Terrestre** — Wichí Myth 2 (*El Robo de la Chispa y el Fuego del Monte*) + Espacial Star 2 (*SAOCOM 1A — Laura Frulla*).
- **Nivel 3 (`~25%` DOM depth, Altitude `75%`)**: **Copa Esmeralda y Espacio Profundo** — Wichí Myth 3 (*Chelchupé y las Mujeres de las Pléyades*) + Espacial Star 3 (*Voyager 1 — Carl Sagan & Ann Druyan*).
- **Summit / Finale (`scrollY = 0`, 0% DOM depth, Altitude `100%`)**: **Cima del Árbol y el Cosmos** — Thank-you celebration message, 6/6 Painted Stories constellation summary, Participants Roster, and Tools Used.

---

## 2. Custom Damped Scroll & Touch-Swipe Physics Engine
To satisfy requirement #3 (*"Este swipe debe estar reducido en su velocidad para que sea suave"*):
- **Wheel Interception (`wheel` event, `{ passive: false }`)**:
  - When no modal is open, native abrupt wheel jumps are intercepted and fed into `targetScrollY` with a **damping speed multiplier (`0.38`)**.
  - A `requestAnimationFrame` loop interpolates `currentScrollY` toward `targetScrollY` using smooth linear interpolation (`lerpFactor = 0.095`), producing a gentle, weightless climbing motion.
- **Mobile Touch Swipe Interception (`touchstart`, `touchmove`, `touchend`)**:
  - Touch delta (`deltaY`) is multiplied by a **reduced swipe sensitivity factor (`0.42`)** with gentle momentum decay (`friction = 0.92`) so mobile swiping upward feels controlled and smooth rather than flinging past levels.
- **Upward Arrow Indicator & Step Button (`#btn-climb-up`)**:
  - Fixed on the right edge of the viewport (`right: 20px`), displaying an animated upward arrow, altitude percentage, level markers, and a clickable/tappable button that ascends smoothly to the next level above.

---

## 3. Brand Color System & Painted ("Pintadas") State Machine
```css
:root {
  /* Official Brand Color Palette */
  --brand-green: #339136;
  --brand-dark-brown: #321401;
  --brand-orange: #F48138;
  --brand-dark-orange: #B95D0E;

  /* Derived Surface & Atmospheric Tokens */
  --bg-void: #070301;
  --bg-earth-deep: #1b0a01;
  --bg-surface-glass: rgba(50, 20, 1, 0.84);
  --bg-surface-elevated: rgba(32, 13, 2, 0.94);
  --text-primary: #FDF7F2;
  --text-secondary: #E2C6B0;
  --text-muted: #A9876E;
}
```

### Unvisited vs. Painted ("Pintada") Node States
- **Unvisited (`.story-node:not(.is-painted)`)**:
  - Desaturated / etched parchment-and-charcoal look (`filter: saturate(0.25)`), dashed orbital ring, badge `"SIN EXPLORAR · TOCAR PARA ABRIR"`.
- **Painted (`.story-node.is-painted`)**:
  - Triggered immediately when the user opens the story popup (`openStoryModal(id)`).
  - Permanently illuminated in vivid brand colors:
    - **Modo WICHÍ Painted**: Lush `#339136` (Brand Green) & `#B95D0E` (Brand Dark Orange) glowing border, painted indigenous geometric icon fill, warm aura, and `"PINTADA ✓"` pill badge.
    - **Modo ESPACIAL Star Painted**: Radiant `#F48138` (Brand Orange) & `#339136` (Brand Green) star burst, golden-orange corona, and `"ESTRELLA PINTADA ★"` pill badge.
  - Persisted in `localStorage` (`orbitar_painted_stories`) and reflected live in the bottom climber navbar (`X / 6 Historias Pintadas`), right-side level dots, and top summit ceremony.
