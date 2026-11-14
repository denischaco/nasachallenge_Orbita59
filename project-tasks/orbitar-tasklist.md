# ORBITAR Development Tasks (NEXUS-Sprint Tasklist)

## Specification Summary
- **Original Requirements (Quoted)**:
  1. *"1) un sitio que antes de cargar muestra un texto en pantalla ORBITAR que aparece lentamente desde la oscuridad (este es el loading para que carguen los assets de atras)"*
  2. *"2) el sitio va al final de abajo y comienza desde ahi. al final de la pagina (lo que seria el footer) tiene una imagen de una persona de espaldas mirando hacia arriba (como escalando/trepando). Esta imagen es fija (fixed) como si fuera una navbar inferior"*
  3. *"3) se muestra un indicador de pantalla a la derecha, una flecha que indica que debemos scrollear/swippea hacia arriba para recorrer el contenido. Este swipe debe estar reducido en su velocidad para que sea suave."*
  4. *"4) de fondo para toda la pagina, es una imagen vertical larga, de un arbol (cuya raiz esta abajo). el usuario comienza su "escalada" desde abajo y va subiendo (scrolleando o con boton flechita para arriba o en mobile swipe."*
  5. *"5) subiendo aparecen 3 diferentes niveles de contenido. Cada nivel tiene dos secciones/modos: uno es el WICHI (el cual al hacer clic abre un popup con una historia de la tierra, un mito) y la otra seccion/modo es el ESPACIAL (abre el popup al hacer clic en una estrella, y narra la historia de misiones espaciales contadas por un protagonista)"*
  6. *"Luego de pasar por los 3 niveles y ver todas las historias (3 niveles, 2 historias por nivel, 6 en total)(deben quedar pintadas una vez que las abrimos) el usuario llega al tope de la pagina/arbol y aparece un texto de agradecimiento por haber experimentado el sitio y un listado de las personas que participaron y herramientas que se usaron."*
- **Brand Color Palette (Mandatory)**: `#339136` (green), `#321401` (dark brown), `#F48138` (orange), `#B95D0E` (dark orange).

---

## Development Tasks

### [x] Task 1: Design System, Brand Tokens & Technical Architecture
**Description**: Create the CSS design system (`css/design-system.css` and `css/main.css`) incorporating the mandatory brand palette (`#339136`, `#321401`, `#F48138`, `#B95D0E`), responsive typography, and inverted vertical layout (`~480vh`).
**Acceptance Criteria**:
- Brand colors `#339136`, `#321401`, `#F48138`, `#B95D0E` defined in `:root` and applied across UI components.
- Responsive layout works on both Desktop (`1920x1080`) and Mobile (`375x667`).

### [x] Task 2: "ORBITAR" Darkness-Emergence Preloader & Bottom-Start Positioning
**Description**: Implement the pitch-dark loading overlay where the word **ORBITAR** slowly emerges from darkness while preloading `assets/tree-bg.jpg` and `assets/climber-back.jpg`, then automatically positions the user at the very bottom of the page (`Raíces`, `scrollY = maxScroll`).
**Acceptance Criteria**:
- Before revealing the scene, the screen is dark and **ORBITAR** slowly fades/emerges from darkness.
- Assets (`tree-bg.jpg`, `climber-back.jpg`) are preloaded behind the loader.
- Upon loader completion, the viewport is positioned at the bottom of the page (`Inicio del Ascenso — Raíces`).

### [x] Task 3: Long Vertical Tree Background & Fixed Bottom Climber Navbar
**Description**: Implement the tall vertical tree canvas (`assets/tree-bg.jpg` + parallax SVG overlays with roots at the bottom and canopy/cosmos at the top) and the `position: fixed; bottom: 0` climber navbar featuring the person seen from behind looking upward (`assets/climber-back.jpg` + interactive climber badge & progress bar).
**Acceptance Criteria**:
- Vertical tree image spans the entire page height with roots at the bottom and crown/stars at the top.
- Fixed bottom bar (`position: fixed; bottom: 0`) stays anchored across all scroll positions and displays the person from behind looking up as if climbing, plus painted-story progress (`0/6` → `6/6`).

### [x] Task 4: Right-Side Upward Arrow Indicator & Damped Smooth Scroll/Swipe Engine
**Description**: Build the fixed right-side HUD indicator with an upward-pointing arrow, altitude gauge, and interactive "Subir ↑" arrow button, plus a custom damped wheel/touch-swipe physics engine (`reduced speed factor ~0.38`, `lerp` smoothing).
**Acceptance Criteria**:
- Right-side indicator is clearly visible on desktop and mobile with an upward arrow and instructions to scroll/swipe up.
- Clicking the upward arrow button smoothly ascends to the next level/section.
- Mouse wheel and touch swipe speed are damped and smoothed for a gentle climbing feel.

### [x] Task 5: 3 Content Levels × 2 Modes (WICHÍ & ESPACIAL Stars) + Persistent "Pintadas" State
**Description**: Implement Levels 1, 2, and 3 ascending the tree. Each level has a **Modo WICHÍ** node (earth myth popup) and a **Modo ESPACIAL** Star node (clicking a star opens a protagonist-narrated space mission popup). Opening any story permanently marks and colors that node as **PINTADA** (`is-painted`).
**Acceptance Criteria**:
- 3 distinct levels positioned along the vertical climb from bottom to top.
- Each level has 1 WICHÍ trigger and 1 ESPACIAL Star trigger (6 total).
- Clicking any trigger opens an accessible modal popup with full narrative content, protagonist/myth metadata, and visual illustration.
- Once opened, the trigger node remains permanently painted ("PINTADA") in full brand color (`#339136` / `#F48138` / `#B95D0E`) and increments the global counter (`X/6 Historias Pintadas`).

### [x] Task 6: Summit / Top-of-Tree Finale (Thank You, Participants & Tools Used)
**Description**: At the top of the page/tree (`scrollY = 0`), display the Summit ("Cima del Árbol y el Cosmos") section with a thank-you message for experiencing the site, celebration of the 6 painted stories, and a structured credits section listing the participants (NEXUS-Sprint team & collaborators) and tools used.
**Acceptance Criteria**:
- Located at the very top of the page/tree (`Cima`).
- Displays the thank-you message (`texto de agradecimiento por haber experimentado el sitio`).
- Displays the list of people who participated (`listado de las personas que participaron`) and tools used (`herramientas que se usaron`).
- Includes interactive controls to review any story, paint all/reset for testing, or descend back to the roots.
