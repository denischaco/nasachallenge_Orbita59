# ORBITAR — Startup MVP Web/Mobile Xperience Specification (NEXUS-Sprint)

## 1. Executive Summary & Experience Vision
**ORBITAR** is an inverted-navigation interactive web and mobile storytelling experience that bridges ancestral **Wichí earth mythology** (Gran Chaco cosmology) with **humanity's space exploration missions**.

Instead of scrolling downward from top to bottom, the user begins at the **bottom of the page** — at the deep subterranean roots of the sacred cosmic tree (*Llach'e / Palo Borracho / Árbol del Mundo*) — and ascends upward toward the treetop canopy and deep cosmos.

---

## 2. Exact User Requirements (Quoted from Spec)
1. **Loading Experience ("ORBITAR")**:
   > *"1) un sitio que antes de cargar muestra un texto en pantalla ORBITAR que aparece lentamente desde la oscuridad (este es el loading para que carguen los assets de atras)"*
   - Pitch-dark full-screen preload overlay (`#080300` → `#321401`).
   - The word **ORBITAR** emerges slowly from total darkness (`opacity: 0` → `1`, letter-spacing expansion, subtle luminescence) while preloading background tree, climber, and story assets behind the scenes.
   - Displays subtle loading progress and transitions smoothly once assets and the emergence animation complete (also includes a manual/auto enter trigger so neither automated tests nor impatient users ever get stuck).

2. **Bottom-Up Start & Fixed Climber Bottom Navbar**:
   > *"2) el sitio va al final de abajo y comienza desde ahi. al final de la pagina (lo que seria el footer) tiene una imagen de una persona de espaldas mirando hacia arriba (como escalando/trepando). Esta imagen es fija (fixed) como si fuera una navbar inferior"*
   - On load/start, the scroll position is automatically set to the **very bottom** of the document (the roots of the tree, `Altitude 0m`).
   - A `position: fixed; bottom: 0` bottom bar / foreground overlay sits permanently anchored at the bottom of the viewport, featuring an illustration/image of a **person seen from behind looking upward in a climbing posture** (`persona de espaldas mirando hacia arriba (como escalando/trepando)`), accompanied by compact HUD controls (story counter `X/6 Pintadas`, current level badge, and quick-jump accessibility).

3. **Right-Side Screen Indicator & Damped/Smooth Upward Scroll/Swipe**:
   > *"3) se muestra un indicador de pantalla a la derecha, una flecha que indica que debemos scrollear/swippea hacia arriba para recorrer el contenido. Este swipe debe estar reducido en su velocidad para que sea suave."*
   - Fixed right-side HUD panel (`position: fixed; right: ...`) showing an **upward-pointing arrow indicator** instructing the user to scroll/swipe UP (`Subir / Deslizar hacia arriba`), an interactive **"Subir ↑" arrow button** for step-by-step or continuous smooth ascent, and a vertical altitude track indicating Levels 1, 2, 3, and Cima.
   - **Damped Scroll & Swipe Physics**: Wheel events (`wheel`) and mobile touch gestures (`touchstart` / `touchmove` / `touchend`) are intercepted by a custom damped physics engine (`velocity *= damping`, reduced speed multiplier `0.38x`) so that ascending feels smooth, weighted, and deliberate like climbing a giant tree.

4. **Long Vertical Tree Background (Roots at Bottom)**:
   > *"4) de fondo para toda la pagina, es una imagen vertical larga, de un arbol (cuya raiz esta abajo). el usuario comienza su "escalada" desde abajo y va subiendo (scrolleando o con boton flechita para arriba o en mobile swipe."*
   - The entire vertical canvas (`~480vh` height) features a continuous, tall vertical tree composition whose roots anchor the bottom (`Raíces`) and whose trunk rises through Levels 1, 2, and 3 into the starry canopy at the top (`Cima / Cosmos`).
   - Combines a high-resolution custom tree illustration with multi-layered SVG organic roots, bark textures, branches, glowing foliage, and parallax starfields for crisp rendering at any resolution on both desktop and mobile.

5. **3 Content Levels × 2 Modes per Level (WICHÍ & ESPACIAL = 6 Stories)**:
   > *"5) subiendo aparecen 3 diferentes niveles de contenido. Cada nivel tiene dos secciones/modos: uno es el WICHI (el cual al hacer clic abre un popup con una historia de la tierra, un mito) y la otra seccion/modo es el ESPACIAL (abre el popup al hacer clic en una estrella, y narra la historia de misiones espaciales contadas por un protagonista)"*
   - Ascending from bottom to top, the user encounters **Nivel 1 (Raíces y Horizonte)**, **Nivel 2 (Tronco Sagrado y Órbita)**, and **Nivel 3 (Copa Celeste y Espacio Profundo)**.
   - Each level contains two interactive story triggers:
     - **Modo WICHÍ (Tierra / Mito)**: An organic earth/tree emblem that opens a modal popup narrating an ancestral Wichí myth of the earth and sky.
     - **Modo ESPACIAL (Estrella / Misión)**: A luminous **Star node** (`al hacer clic en una estrella`) that opens a modal popup narrating a historic or modern space mission told in **first person by a protagonist**.

6. **Painted ("Pintadas") Visited State & Top-of-Tree Credits Finale**:
   > *"Luego de pasar por los 3 niveles y ver todas las historias (3 niveles, 2 historias por nivel, 6 en total)(deben quedar pintadas una vez que las abrimos) el usuario llega al tope de la pagina/arbol y aparece un texto de agradecimiento por haber experimentado el sitio y un listado de las personas que participaron y herramientas que se usaron."*
   - **Unvisited vs. Painted ("Pintadas") State**: Initially, the 6 story nodes appear in a dormant/monochrome-etched state with a subtle pulse inviting interaction. Once opened (`clic`), the node transitions permanently to its **PAINTED ("PINTADA")** state — vivid brand colors (`#F48138` orange, `#339136` green, `#B95D0E` dark orange), glowing aura, painted brush/constellation fill, and a `"PINTADA ✓"` badge.
   - **Summit / Top of the Tree (`Tope de la página/árbol`)**: At the very top of the page (`scrollY = 0`), the user reaches the **Cima del Árbol & Cosmos**, which displays:
     - A heartfelt **thank-you message** for experiencing ORBITAR (with a special completion celebration banner when all 6/6 stories are painted, plus a helper button to visit any unpainted story or paint/review them).
     - A complete **list of participants (Personas que participaron)** and **tools used (Herramientas que se usaron)**.

---

## 3. Brand Color Palette (Mandatory Rule Compliance)
All visual elements, UI tokens, illustrations, painted states, and popups strictly adhere to the official brand palette:
- **Brand Green**: `#339136` — Sacred foliage, Wichi nature vitality, painted earth badges, canopy glow
- **Brand Dark Brown**: `#321401` — Deep root earth, primary dark surface, modal backdrop base, tree bark shadow
- **Brand Orange**: `#F48138` — Primary luminous accent, star glow, painted state highlight, upward indicator arrow
- **Brand Dark Orange**: `#B95D0E` — Secondary warm accent, bark veins, active borders, gradient transitions
- **Supporting Neutrals (Derived from `#321401`)**:
  - Deep Void (Loader & Sky Top): `#0b0501`
  - Warm Cream Text: `#FDF6F0`
  - Muted Amber Text: `#D9BDA5`

---

## 4. Narrative Content Architecture (6 Stories: 3 Wichí + 3 Espacial)

### Nivel 1 (Bajo — Raíces y Despegue)
- **1A. Modo WICHÍ (`wichi-1`)**: *"El Yuchán y el Agua Primordial"*
  - **Subtitle**: Mito Wichí del Origen de los Ríos
  - **Story**: Relata cómo en el principio del mundo toda el agua y los peces habitaban dentro del gran árbol Yuchán (*Palo Borracho*), custodiado en las raíces de la tierra, hasta que Tokwjaj liberó su cauce para dar vida al Gran Chaco y trazar el espejo del río Pilcomayo.
- **1B. Modo ESPACIAL — Estrella (`espacial-1`)**: *"Estrella Alfa: El Primer Paso en el Mar de la Tranquilidad"*
  - **Subtitle**: Misión Apolo 11 — Narrado por Neil Armstrong (Protagonista)
  - **Story**: Narración en primera persona desde la escalerilla del módulo lunar *Eagle*: el silencio del vacío, el polvo gris bajo la bota, y la visión de la Tierra suspendida como una pequeña esfera verde y azul sobre la oscuridad infinita.

### Nivel 2 (Medio — Tronco Sagrado y Órbita Terrestre)
- **2A. Modo WICHÍ (`wichi-2`)**: *"El Robo de la Chispa y el Fuego del Monte"*
  - **Subtitle**: Mito Wichí del Fuego Sagrado
  - **Story**: Cuenta cómo los antiguos habitantes del monte vivían en la penumbra helada hasta que el pequeño oculto (tuco-tuco) y el ave guardiana lograron tomar una brasa viva y esconderla en el corazón de la madera seca del quebracho y el mistol, entregando el calor a la humanidad.
- **2B. Modo ESPACIAL — Estrella (`espacial-2`)**: *"Estrella Beta: Ojos de Radar sobre el Gran Chaco"*
  - **Subtitle**: Misión SAOCOM 1A / CONAE — Narrado por Laura Frulla (Protagonista)
  - **Story**: Narración en primera persona desde el centro de control en Córdoba y la órbita polar a 620 km de altura: cómo la antena radar desplegada en el espacio lee la humedad profunda debajo de los árboles y raíces de nuestra propia tierra.

### Nivel 3 (Alto — Copa Celeste y Espacio Profundo)
- **3A. Modo WICHÍ (`wichi-3`)**: *"Chelchupé y las Mujeres de las Pléyades"*
  - **Subtitle**: Mito Wichí del Camino del Cielo (*Nayic*)
  - **Story**: Narra cómo las mujeres estrella descendían desde la copa del cielo por una cuerda tejida de chaguar hasta las ramas más altas del árbol cósmico, enseñando que las constelaciones del sur son hogueras encendidas por nuestros ancestros que nunca se apagan.
- **3B. Modo ESPACIAL — Estrella (`espacial-3`)**: *"Estrella Gamma: El Disco de Oro más allá del Sol"*
  - **Subtitle**: Misión Voyager 1 — Narrado por Carl Sagan / Ann Druyan (Protagonistas)
  - **Story**: Narración en primera persona sobre el mensaje grabado en cobre bañado en oro viajando por el espacio interestelar: sonidos de lluvia, viento en los árboles, latidos humanos y saludos de la Tierra navegando hacia la eternidad.
