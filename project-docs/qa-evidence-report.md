# QA Evidence-Based Report — ORBITAR (NEXUS-Sprint)

## 🔍 Reality Check Results
- **Command Executed**: `python d:\Localhost\NASA\qa_playwright_capture.py`
- **Target URL**: `http://localhost:8090`
- **Console Errors**: `0`
- **Screenshots Reviewed**:
  - `01-loader-orbitar-darkness.png`
  - `02-desktop-bottom-start-roots.png`
  - `03-desktop-level1-unpainted.png`
  - `04-popup-wichi-level1.png`
  - `05-popup-espacial-star-level1.png`
  - `06-desktop-level1-painted.png`
  - `07-desktop-level2-painted.png`
  - `08-desktop-level3-painted.png`
  - `09-desktop-summit-top-credits.png`
  - `10-mobile-bottom-start-roots.png`
  - `11-mobile-level1-painted.png`
  - `12-mobile-summit-top-credits.png`

---

## 📸 Specification Compliance Matrix

1. **Requisito 1 — Loading "ORBITAR" desde la oscuridad**:
   - **Cita Spec**: *"1) un sitio que antes de cargar muestra un texto en pantalla ORBITAR que aparece lentamente desde la oscuridad (este es el loading para que carguen los assets de atras)"*
   - **Evidencia**: `01-loader-orbitar-darkness.png`
   - **Resultado**: **PASS** — Fondo oscuro total (`#000000` / `#060200`) con el título `ORBITAR` emergiendo gradualmente mientras se precargan `tree-bg.jpg` y `climber-back.jpg`.

2. **Requisito 2 — Inicio abajo del todo + Persona de espaldas mirando hacia arriba (Fixed Navbar Inferior)**:
   - **Cita Spec**: *"2) el sitio va al final de abajo y comienza desde ahi. al final de la pagina (lo que seria el footer) tiene una imagen de una persona de espaldas mirando hacia arriba (como escalando/trepando). Esta imagen es fija (fixed) como si fuera una navbar inferior"*
   - **Evidencia**: `02-desktop-bottom-start-roots.png`, `10-mobile-bottom-start-roots.png`
   - **Resultado**: **PASS** — `window.scrollY === maxScrollY (4320px)`, `Altitud 0%`, barra inferior `position: fixed; bottom: 0` con la ilustración del escalador de espaldas mirando hacia arriba (`assets/climber-back.jpg`).

3. **Requisito 3 — Indicador de flecha a la derecha + Scroll/Swipe reducido y suave**:
   - **Cita Spec**: *"3) se muestra un indicador de pantalla a la derecha, una flecha que indica que debemos scrollear/swippea hacia arriba para recorrer el contenido. Este swipe debe estar reducido en su velocidad para que sea suave."*
   - **Evidencia**: `02-desktop-bottom-start-roots.png`, `03-desktop-level1-unpainted.png`
   - **Resultado**: **PASS** — Panel lateral derecho fijo (`#climb-indicator-right`) con botón de flecha hacia arriba (`#btn-climb-up`), etiqueta vertical `SUBIR · SWIPE ↑`, barra de altitud y motor físico LERP con velocidad reducida (`WHEEL_SPEED_FACTOR = 0.36`, `TOUCH_SWIPE_FACTOR = 0.42`).

4. **Requisito 4 — Imagen vertical larga de un árbol cuya raíz está abajo**:
   - **Cita Spec**: *"4) de fondo para toda la pagina, es una imagen vertical larga, de un arbol (cuya raiz esta abajo). el usuario comienza su escalada desde abajo y va subiendo"*
   - **Evidencia**: `02-desktop-bottom-start-roots.png` → `07-desktop-level2-painted.png` → `08-desktop-level3-painted.png`
   - **Resultado**: **PASS** — Lienzo vertical continuo de `500vh` combinando `assets/tree-bg.jpg` y geometría SVG multicapa con raíces profundas en la base, tronco sagrado en los niveles medios y copa/cosmos en el tope.

5. **Requisito 5 — 3 Niveles × 2 Modos (WICHÍ mito de la tierra y ESPACIAL clic en una estrella)**:
   - **Cita Spec**: *"5) subiendo aparecen 3 diferentes niveles de contenido. Cada nivel tiene dos secciones/modos: uno es el WICHI (el cual al hacer clic abre un popup con una historia de la tierra, un mito) y la otra seccion/modo es el ESPACIAL (abre el popup al hacer clic en una estrella, y narra la historia de misiones espaciales contadas por un protagonista)"*
   - **Evidencia**: `04-popup-wichi-level1.png`, `05-popup-espacial-star-level1.png`, `06-desktop-level1-painted.png`, `07-desktop-level2-painted.png`, `08-desktop-level3-painted.png`
   - **Resultado**: **PASS** — 3 niveles con 2 historias por nivel (6 en total). Los popups Wichí narran mitos del Gran Chaco y los popups Espaciales se abren al hacer clic en la estrella narrando en primera persona las misiones Apolo 11, SAOCOM 1A y Voyager 1.

6. **Requisito 6 — Historias quedan pintadas al abrirse + Tope del árbol con agradecimiento, personas y herramientas**:
   - **Cita Spec**: *"Luego de pasar por los 3 niveles y ver todas las historias (3 niveles, 2 historias por nivel, 6 en total)(deben quedar pintadas una vez que las abrimos) el usuario llega al tope de la pagina/arbol y aparece un texto de agradecimiento por haber experimentado el sitio y un listado de las personas que participaron y herramientas que se usaron."*
   - **Evidencia**: `06-desktop-level1-painted.png`, `09-desktop-summit-top-credits.png`, `12-mobile-summit-top-credits.png`
   - **Resultado**: **PASS** — Las 6 tarjetas quedan pintadas con la paleta oficial (`#339136`, `#321401`, `#F48138`, `#B95D0E`) y en la cima (`Altitud 100%`) se despliegan el texto de agradecimiento, el listado de personas que participaron y las herramientas utilizadas.

---

## 🔄 Dev ↔ QA Iteration Summary
- **Ciclo 1 (Hallazgos corregidos)**:
  1. Se ajustó la opacidad radial de `#orbitar-loader` a negro sólido (`#180900` → `#000000`) para evitar transparencia prematura durante la emergencia del texto `ORBITAR`.
  2. Se optimizó `climbOneStepUp()` en `js/app.js` para que el primer clic en la flecha derecha desde las raíces ascienda directamente al Nivel 1 (`27%` de altitud).
  3. Se amplió el encuadre del escalador de espaldas (`transform: scale(1.38)`, `object-position: center 62%`) en la barra fija inferior.
  4. Se compactó la grilla de créditos en `#zone-summit` (2×3 por panel) para que todo el bloque de agradecimiento, participantes y herramientas sea visible en `1920x1080` sin solaparse con la barra inferior.
- **Ciclo 2 (Verificación Final)**: **PASS (6/6 Requisitos validados en Desktop y Mobile)**.
