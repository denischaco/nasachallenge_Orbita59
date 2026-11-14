/**
 * ORBITA 59 — Narrative Database (3 Levels × 2 Modes = 6 Interactive Stories)
 * Each story belongs to either:
 * - "wichi": Cultura Wichí de El Impenetrable, Chaco
 * - "espacial": NASA International Space Apps Challenge
 * Includes illustrated visual plates (SVG scenes + optional photo URLs) and same-level sibling links.
 */

window.ORBITAR_STORIES = {
  "wichi-1": {
    id: "wichi-1",
    siblingId: "espacial-1",
    siblingButtonLabel: "Ir al relato ESPACIAL del Nivel 1 ★",
    level: 1,
    levelLabel: "Nivel 1 · Raíces y Horizonte",
    mode: "wichi",
    modeTitle: "Modo WICHÍ · Mito de la Tierra",
    title: "El Gran Yuchán y el Agua Primordial",
    protagonist: "Relato Ancestral Wichí · El Árbol Madre (Llach'e) · El Impenetrable, Chaco",
    quote: "«En el vientre del árbol botella dormían todos los ríos y todos los peces del mundo, esperando fluir para dar vida al monte.»",
    blocks: [
      {
        type: "text",
        content: "Cuentan los ancianos wichí que, en el principio de los tiempos, la tierra del Gran Chaco era árida y silenciosa. Toda el agua del universo estaba guardada dentro del tronco abultado del gran Yuchán —el palo borracho sagrado—, cuyas raíces profundas abrazaban el corazón oscuro de la tierra."
      },
      {
        type: "illustration",
        artId: "wichi-yuchan-water",
        caption: "Ilustración I · El vientre del Gran Yuchán (Llach'e) resguardando los cardúmenes y las aguas primordiales en las raíces del monte chaqueño."
      },
      {
        type: "text",
        content: "Dentro de su corteza espinosa nadaban el dorado, el surubí y el sábalo. Nadie pasaba sed si pedía con respeto unas gotas a sus ramas bajas.Las mujeres tejían sus yicas con fibra de chaguar junto a la sombra fresca del gran árbol, escuchando el murmullo del agua interior."
      },
      {
        type: "text",
        content: "Pero un día Tokwjaj, inquieto y desmesurado, quiso atrapar para sí al pez más grande de las profundidades y clavó su lanza en el vientre del árbol madre."
      },
      {
        type: "illustration",
        artId: "wichi-pilcomayo-river",
        caption: "Ilustración II · El nacimiento de los ríos Pilcomayo y Bermejo brotando desde las raíces hacia la llanura de El Impenetrable."
      },
      {
        type: "text",
        content: "De la herida del Yuchán brotó un torrente luminoso que corrió por la tierra seca, dibujando los meandros del río Pilcomayo y del Bermejo. Así las raíces del árbol cósmico se convirtieron en los ríos que hoy alimentan la vida, recordándonos que quien cuida la raíz cuida el agua del mundo."
      }
    ]
  },

  "espacial-1": {
    id: "espacial-1",
    siblingId: "wichi-1",
    siblingButtonLabel: "← Ir al relato WICHÍ del Nivel 1",
    level: 1,
    levelLabel: "Nivel 1 · Raíces y Horizonte",
    mode: "espacial",
    modeTitle: "Modo ESPACIAL · Estrella Alfa",
    title: "El Primer Paso en el Mar de la Tranquilidad",
    protagonist: "Protagonista: Neil Armstrong · Comandante de la Misión Apolo 11 (NASA)",
    quote: "«Cuando levanté mi pulgar frente a la ventana del Eagle, pude cubrir toda la Tierra: cada río, cada árbol y cada ser humano que jamás existió.»",
    blocks: [
      {
        type: "text",
        content: "Soy Neil Armstrong. Cuando el motor de descenso del módulo lunar Eagle se apagó sobre el Mar de la Tranquilidad, el silencio que nos rodeó fue más profundo que cualquier silencio en la Tierra. Nos quedaban apenas segundos de combustible, pero estábamos posados sobre otro mundo."
      },
      {
        type: "illustration",
        artId: "space-apollo-bootprint",
        caption: "Registro Visual NASA · Descenso del Módulo Lunar Eagle y la primera huella sobre el regolito del Mar de la Tranquilidad (20 de julio de 1969)."
      },
      {
        type: "text",
        content: "Al bajar por los nueve peldaños de la escalerilla y apoyar mi bota sobre el regolito lunar, sentí que el polvo fino era como carbón mineral. Miré hacia el horizonte curvado y negro, sin atmósfera que difuminara la luz del Sol."
      },
      {
        type: "illustration",
        artId: "space-earthrise-oasis",
        caption: "Telemetría Orbital · La Tierra suspendida como una esfera azul y verde sobre el horizonte lunar."
      },
      {
        type: "text",
        content: "Pero lo que transformó mi vida no fue mirar el suelo gris de la Luna, sino alzar la vista hacia arriba: allí flotaba la Tierra, un oasis verde y azul increíblemente frágil suspendido en la oscuridad. Comprendí entonces que no habíamos viajado para escapar de nuestro hogar, sino para descubrir cuánto debemos proteger nuestras raíces."
      }
    ]
  },

  "wichi-2": {
    id: "wichi-2",
    siblingId: "espacial-2",
    siblingButtonLabel: "Ir al relato ESPACIAL del Nivel 2 ★",
    level: 2,
    levelLabel: "Nivel 2 · Tronco Sagrado y Órbita",
    mode: "wichi",
    modeTitle: "Modo WICHÍ · Mito de la Tierra",
    title: "El Guardián de la Brasa y el Fuego del Monte",
    protagonist: "Relato Ancestral Wichí · Vetas de Palo Santo y Quebracho · El Impenetrable",
    quote: "«El fuego no cayó del cielo para destruir: se escondió en el corazón del palo santo y del mistol para abrazar las noches de invierno.»",
    blocks: [
      {
        type: "text",
        content: "Antiguamente, la gente de la tierra no conocía el fuego. Cuando el viento helado del sur soplaba entre los troncos del monte chaqueño, las familias se acurrucaban en la penumbra, mirando de lejos el resplandor anaranjado que el dueño egoísta del fuego guardaba sólo para sí."
      },
      {
        type: "illustration",
        artId: "wichi-ember-guardian",
        caption: "Ilustración I · La chispa sagrada transportada a través de las sendas nocturnas del monte."
      },
      {
        type: "text",
        content: "Fue entonces cuando los pequeños habitantes de la tierra y del aire —el oculto que cava túneles entre las raíces y el ave veloz del monte— trazaron un plan. Aprovechando un descuido, tomaron una brasa viva y corrieron entre la espesura."
      },
      {
        type: "illustration",
        artId: "wichi-palo-santo-grain",
        caption: "Ilustración II · Las vetas del palo santo y del quebracho guardando el calor vivo dentro de su fibra."
      },
      {
        type: "text",
        content: "Para que la lluvia nunca pudiera apagarla, depositaron la chispa sagrada dentro de la fibra de los árboles del Chaco. Desde aquel día, el fuego habita dormido dentro de la madera: basta frotar dos ramas secas con paciencia para que el árbol devuelva su luz cálida y reúna a la comunidad en ronda para contar historias."
      }
    ]
  },

  "espacial-2": {
    id: "espacial-2",
    siblingId: "wichi-2",
    siblingButtonLabel: "← Ir al relato WICHÍ del Nivel 2",
    level: 2,
    levelLabel: "Nivel 2 · Tronco Sagrado y Órbita",
    mode: "espacial",
    modeTitle: "Modo ESPACIAL · Estrella Beta",
    title: "Ojos de Radar sobre el Gran Chaco",
    protagonist: "Protagonista: Dra. Laura Frulla · Investigadora Principal Misión SAOCOM (CONAE / NASA)",
    quote: "«Desde 620 kilómetros de altura, nuestros pulsos de radar atraviesan las nubes y las copas de los árboles para escuchar la sed de la tierra.»",
    blocks: [
      {
        type: "text",
        content: "Soy Laura Frulla, científica de la misión satelital argentina SAOCOM. Durante años soñamos con lanzar al espacio un instrumento capaz de ver lo que los ojos humanos no pueden: el agua escondida debajo de la superficie terrestre."
      },
      {
        type: "illustration",
        artId: "space-saocom-radar",
        caption: "Telemetría SAR Banda L · Despliegue de la antena radar de 35 m² en órbita polar a 620 km de altitud."
      },
      {
        type: "text",
        content: "Cuando la enorme antena radar de 35 metros cuadrados se desplegó en órbita polar, contuvimos la respiración en el centro de control en Córdoba. Minutos después llegaron los primeros ecos desde el espacio: nuestras ondas en banda L atravesaban el follaje de los bosques y medían con precisión milimétrica la humedad en las raíces del suelo."
      },
      {
        type: "illustration",
        artId: "space-chaco-moisture",
        caption: "Mapa de Humedad de Suelo · Lectura orbital sobre la cuenca chaqueña y los bosques nativos."
      },
      {
        type: "text",
        content: "Saber que un satélite diseñado por nuestras manos orbita entre las estrellas para cuidar las cosechas, anticipar inundaciones y proteger los bosques nativos del norte argentino me enseñó que la ciencia espacial más avanzada es, en esencia, un acto de amor por nuestra tierra."
      }
    ]
  },

  "wichi-3": {
    id: "wichi-3",
    siblingId: "espacial-3",
    siblingButtonLabel: "Ir al relato ESPACIAL del Nivel 3 ★",
    level: 3,
    levelLabel: "Nivel 3 · Copa Celeste y Espacio Profundo",
    mode: "wichi",
    modeTitle: "Modo WICHÍ · Mito de la Tierra",
    title: "Chelchupé y el Tejido de las Mujeres Estrella",
    protagonist: "Relato Ancestral Wichí · El Camino del Cielo (Nayic) · El Impenetrable",
    quote: "«La copa del árbol toca el río blanco de la Vía Láctea; por sus fibras de chaguar bajaban las estrellas a conversar con la tierra.»",
    blocks: [
      {
        type: "text",
        content: "En lo más alto del árbol cósmico, donde las hojas verdes se funden con la noche estrellada, los antiguos wichí sabían que el cielo y la tierra eran dos pisos de una misma casa. La Vía Láctea era conocida como Nayic, el gran camino celeste lleno de huellas luminosas."
      },
      {
        type: "illustration",
        artId: "wichi-chaguar-cord",
        caption: "Ilustración I · La cuerda trenzada de fibra de chaguar uniendo la copa del monte con las Pléyades (Chelchupé)."
      },
      {
        type: "text",
        content: "Por una larga cuerda trenzada con fibra de chaguar que colgaba desde la copa del cielo hasta las ramas más altas del monte, descendían de noche las Mujeres Estrella —las Pléyades, Chelchupé—. Su piel brillaba como brasas suaves y traían consigo el conocimiento de los ciclos de la escarcha, la floración del algarrobo y la maduración de los frutos."
      },
      {
        type: "illustration",
        artId: "wichi-star-weave",
        caption: "Ilustración II · Geometría de las yicas reflejando las constelaciones del cielo austral."
      },
      {
        type: "text",
        content: "Aunque un día la cuerda entre ambos mundos se cortó y ellas quedaron habitando en lo alto del firmamento, nunca nos abandonaron: cada invierno reaparecen sobre la copa de los árboles para anunciar el nuevo ciclo de la vida, recordándonos que mirar las estrellas es reconocer nuestra propia memoria."
      }
    ]
  },

  "espacial-3": {
    id: "espacial-3",
    siblingId: "wichi-3",
    siblingButtonLabel: "← Ir al relato WICHÍ del Nivel 3",
    level: 3,
    levelLabel: "Nivel 3 · Copa Celeste y Espacio Profundo",
    mode: "espacial",
    modeTitle: "Modo ESPACIAL · Estrella Gamma",
    title: "El Disco de Oro en el Océano Interestelar",
    protagonist: "Protagonistas: Carl Sagan y Ann Druyan · Misión Voyager 1 (NASA)",
    quote: "«Grabamos en un disco dorado el sonido del viento entre los árboles, el canto de las aves y el latido de un corazón humano para que viajen mil millones de años.»",
    blocks: [
      {
        type: "text",
        content: "Hablamos como Carl Sagan y Ann Druyan. Cuando la NASA nos pidió crear un mensaje a bordo de las sondas Voyager 1 y 2 —destinadas a abandonar para siempre el Sistema Solar—, nos preguntamos cómo resumir el espíritu de todo un planeta en un disco de cobre bañado en oro."
      },
      {
        type: "illustration",
        artId: "space-golden-record",
        caption: "Archivo NASA JPL · El Disco de Oro de Voyager con diagramas de navegación pulsar y ondas sonoras de la Tierra."
      },
      {
        type: "text",
        content: "Decidimos no enviar boletines de guerra ni fronteras políticas. Grabamos saludos en 55 idiomas, el murmullo de la lluvia cayendo sobre las hojas verdes, el trueno, el canto de los grillos nocturnos, la música de nuestras culturas y las ondas cerebrales y cardíacas de una persona enamorada."
      },
      {
        type: "illustration",
        artId: "space-voyager-interstellar",
        caption: "Espacio Interestelar · Voyager 1 navegando más allá de la heliosfera a 24.000 millones de kilómetros."
      },
      {
        type: "text",
        content: "Hoy, a más de 24.000 millones de kilómetros de distancia, más allá de la heliosfera, Voyager 1 sigue navegando en la oscuridad interestelar. Es una semilla desprendida de la copa de nuestro árbol terrestre, llevando la memoria de los bosques y de la humanidad hacia las estrellas por toda la eternidad."
      }
    ]
  }
};

window.ORBITAR_STORY_ORDER = [
  "wichi-1",
  "espacial-1",
  "wichi-2",
  "espacial-2",
  "wichi-3",
  "espacial-3"
];
