/**
 * ORBITA 59 — Narrative Database (3 Levels × 2 Modes = 6 Interactive Stories)
 * Each story belongs to either:
 * - "wichi": Cultura Wichí de El Impenetrable, Chaco
 * - "espacial": NASA International Space Apps Challenge (3 selected NASA Missions paired with the Wichí stories)
 * Includes native-language audio support for Wichí Level 1 and illustrated visual plates.
 */

window.ORBITAR_STORIES = {
  /* ==========================================================================
     NIVEL 1: EL ORIGEN DE LAS AGUAS (YUCHÁN ↔ SPIRIT & OPPORTUNITY)
     ========================================================================== */
  "wichi-1": {
    id: "wichi-1",
    siblingId: "espacial-1",
    siblingButtonLabel: "Ir al relato ESPACIAL del Nivel 1 (Spirit y Opportunity) ★",
    level: 1,
    levelLabel: "Nivel 1 · El Origen de las Aguas",
    mode: "wichi",
    modeTitle: "Modo WICHÍ · Mito de la Tierra",
    title: "🌳 La Leyenda del Yuchán — El origen de las aguas",
    protagonist: "Relato Ancestral Wichí · Chiláj, Tokwaj y el Árbol Madre (Yuchán) · El Impenetrable, Chaco",
    audioSrc: "public/audio/cuento.mp4",
    audioFallbackSrc: "audio/cuento.mp4",
    audioTitle: "🔊 Bonus: Escuchar narración en lengua nativa Wichí",
    audioSubtitle: "Audio original del relato «La Leyenda del Yuchán — El origen de las aguas»",
    quote: "«Había una regla sagrada: podían pescar cualquier pez, menos el dorado. Era considerado el pez sagrado, el más grande y hermoso de todos, y estaba prohibido tocarlo.»",
    blocks: [
      {
        type: "text",
        content: "Hace muchísimo tiempo, el Chaco era una tierra seca, sin ríos ni lagunas. Toda el agua del mundo estaba guardada adentro de un enorme Yuchán (palo borracho). Y no solo agua: también había peces nadando en su interior."
      },
      {
        type: "illustration",
        artId: "wichi-yuchan-dorado",
        caption: "Ilustración I · El enorme Yuchán en medio del Chaco seco, guardando en su interior toda el agua del mundo y al dorado sagrado de cola brillante y colorada."
      },
      {
        type: "text",
        content: "La gente podía acercarse, abrir una pequeña abertura que tenía el árbol y sacar agua y pescar lo justo para comer. Pero había una regla sagrada: podían pescar cualquier pez, menos el dorado. Era considerado el pez sagrado, el más grande y hermoso de todos, y estaba prohibido tocarlo."
      },
      {
        type: "text",
        content: "Chiláj, el protector de los peces, le había advertido a todos que respetaran esa regla. Pero un día, un hombre llamado Tokwaj decidió no hacer caso. Vio al dorado, con su cola brillante y colorada, y quiso atraparlo."
      },
      {
        type: "illustration",
        artId: "wichi-tokwaj-rios",
        caption: "Ilustración II · La flecha de Tokwaj hiere al dorado y el Yuchán estalla liberando los ríos, las lagunas y los arroyos del mundo."
      },
      {
        type: "text",
        content: "Cuando lo hirió con su flecha, el Yuchán empezó a sacudirse con fuerza y reventó. Toda el agua que tenía adentro salió disparada por todas partes, formando los ríos, las lagunas y los arroyos que hoy conocemos en el mundo."
      },
      {
        type: "text",
        content: "Por eso se dice que antes de ese día no había ríos, y que el Yuchán fue quien los guardó y luego los soltó."
      }
    ]
  },

  "espacial-1": {
    id: "espacial-1",
    siblingId: "wichi-1",
    siblingButtonLabel: "← Ir a La Leyenda del Yuchán (Nivel 1)",
    level: 1,
    levelLabel: "Nivel 1 · El Origen de las Aguas",
    mode: "espacial",
    modeTitle: "Modo ESPACIAL · Estrella Alfa",
    title: "Spirit y Opportunity — Los Buscadores de los Ríos Perdidos",
    protagonist: "Protagonista: Rover Opportunity (MER-B) · Misión Mars Exploration Rovers (NASA)",
    missionUrl: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
    missionLabel: "Misión Oficial NASA: Mars Exploration Rovers (Spirit & Opportunity)",
    quote: "«Así como el Yuchán soltó las aguas que formaron los ríos del Chaco, mi hermano Spirit y yo recorrimos un planeta seco para demostrar que Marte también tuvo ríos, lagunas y mares antiguos.»",
    blocks: [
      {
        type: "text",
        content: "Me llamo Opportunity, y junto a mi gemelo Spirit aterrizamos en Marte en enero de 2004. Cuando abrí mis cámaras panorámicas por primera vez en Meridiani Planum, vi una llanura rojiza, silenciosa y completamente seca: un desierto sin ríos ni lagunas, muy parecido al Chaco antiguo antes de que el gran Yuchán abriera sus aguas."
      },
      {
        type: "illustration",
        artId: "space-rovers-water",
        caption: "Registro Visual NASA MER · Los rovers gemelos Spirit y Opportunity explorando antiguos cauces secos y esférulas de hematita formadas por el agua en Marte."
      },
      {
        type: "text",
        content: "Los científicos de la NASA nos enviaron con un mandato claro: «Seguir el agua». Al acercar mi brazo robótico a las rocas estratificadas del cráter Eagle, descubrí miles de pequeñas esferas minerales brillantes a las que llamaron «arándanos» de hematita. Aquellas esferas sólo podían haberse formado dentro del agua líquida."
      },
      {
        type: "text",
        content: "Mientras mi hermano Spirit exploraba antiguas fuentes termales al otro lado del planeta en el cráter Gusev, yo seguí rodando durante casi quince años a lo largo de antiguos bordes de lagunas y arroyos marcianos, hallando vetas de yeso donde el agua alguna vez corrió libremente por la superficie."
      },
      {
        type: "illustration",
        artId: "space-opportunity-tracks",
        caption: "Telemetría NASA · Más de 45 kilómetros de huellas sobre las antiguas riberas del Valle de la Perseverancia en el cráter Endeavour."
      },
      {
        type: "text",
        content: "Antes de que una gran tormenta de polvo apagara mis paneles solares en 2018, logré enviar mi último mensaje a la Tierra. Mi viaje probó que los mundos guardan la memoria de sus aguas en la piedra, recordándonos que cada río y cada laguna viva de nuestra Tierra es un tesoro sagrado que debemos proteger."
      }
    ]
  },

  /* ==========================================================================
     NIVEL 2: EL LATIDO Y EL CALOR DEL INTERIOR (FUEGO DEL MONTE ↔ INSIGHT)
     ========================================================================== */
  "wichi-2": {
    id: "wichi-2",
    siblingId: "espacial-2",
    siblingButtonLabel: "Ir al relato ESPACIAL del Nivel 2 (Misión InSight) ★",
    level: 2,
    levelLabel: "Nivel 2 · El Latido Interior y el Tronco",
    mode: "wichi",
    modeTitle: "Modo WICHÍ · Mito de la Tierra",
    title: "El Guardián de la Brasa y el Fuego del Monte",
    protagonist: "Relato Ancestral Wichí · Vetas de Palo Santo y Quebracho · El Impenetrable",
    quote: "«El fuego no cayó del cielo para destruir: se escondió en el corazón profundo del palo santo y de la tierra para abrazar las noches de invierno.»",
    blocks: [
      {
        type: "text",
        content: "Antiguamente, la gente de la tierra no conocía el fuego. Cuando el viento helado del sur soplaba entre los troncos del monte chaqueño, las familias se acurrucaban en la penumbra, mirando de lejos el resplandor anaranjado que el dueño egoísta del fuego guardaba sólo para sí."
      },
      {
        type: "illustration",
        artId: "wichi-ember-guardian",
        caption: "Ilustración I · La chispa sagrada transportada a través de las sendas nocturnas del monte chaqueño."
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
        content: "Para que la lluvia nunca pudiera apagarla, depositaron la chispa sagrada dentro de la fibra de los árboles del Chaco y en el abrigo de la tierra. Desde aquel día, el fuego habita dormido dentro de la madera: basta frotar dos ramas secas con paciencia para que el árbol devuelva su luz cálida y reúna a la comunidad en ronda para contar historias."
      }
    ]
  },

  "espacial-2": {
    id: "espacial-2",
    siblingId: "wichi-2",
    siblingButtonLabel: "← Ir al relato WICHÍ del Nivel 2",
    level: 2,
    levelLabel: "Nivel 2 · El Latido Interior y el Tronco",
    mode: "espacial",
    modeTitle: "Modo ESPACIAL · Estrella Beta",
    title: "InSight — El Oído que Escuchó el Corazón de un Planeta",
    protagonist: "Protagonista: Módulo Geofísico InSight · Laboratorio de Propulsión a Chorro (NASA)",
    missionUrl: "https://science.nasa.gov/mission/insight/",
    missionLabel: "Misión Oficial NASA: InSight Mars Lander",
    quote: "«Apoyé mi estetoscopio sobre la piel fría de otro mundo y escuché más de mil latidos profundos: la brasa viva que aún arde en el núcleo del planeta.»",
    blocks: [
      {
        type: "text",
        content: "Soy InSight. A diferencia de otros exploradores espaciales, no fui enviado a Marte con ruedas para recorrer cañones, sino para quedarme quieto en la llanura de Elysium Planitia y hacer algo que nadie había logrado antes: escuchar lo que late debajo de la tierra."
      },
      {
        type: "illustration",
        artId: "space-insight-seis",
        caption: "Telemetría NASA InSight · El brazo robótico depositando el sismómetro SEIS y la sonda de flujo de calor sobre la superficie marciana."
      },
      {
        type: "text",
        content: "Con mi brazo robótico apoyé suavemente sobre el suelo un sismómetro ultrasensible llamado SEIS, cubriéndolo con un escudo contra el viento, y desplegué una sonda térmica para medir el calor que emana del interior. En el silencio de la noche marciana, comencé a sentir pequeños temblores: los primeros «martemotos» registrados en la historia."
      },
      {
        type: "illustration",
        artId: "space-insight-core",
        caption: "Radiografía Planetaria · Ondas sísmicas revelando la corteza, el manto y la brasa líquida del núcleo profundo de Marte."
      },
      {
        type: "text",
        content: "Durante cuatro años registré más de 1.300 latidos sísmicos. Gracias a esas vibraciones descubrimos que, al igual que el fuego guardado dentro del palo santo en el relato Wichí, en lo más profundo de Marte todavía arde un gran núcleo líquido caliente. Escuchar el corazón de otro mundo nos enseñó cómo nacieron y cómo respiran por dentro los planetas rocosos como nuestra Tierra."
      }
    ]
  },

  /* ==========================================================================
     NIVEL 3: LA COPA CELESTE Y EL MENSAJE AL COSMOS (CHELCHUPÉ ↔ PIONEER 10)
     ========================================================================== */
  "wichi-3": {
    id: "wichi-3",
    siblingId: "espacial-3",
    siblingButtonLabel: "Ir al relato ESPACIAL del Nivel 3 (Misión Pioneer 10) ★",
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
    title: "Pioneer 10 — La Placa Dorada hacia las Constelaciones",
    protagonist: "Protagonista: Sonda Interestelar Pioneer 10 · Misión Pioneer (NASA Ames)",
    missionUrl: "https://science.nasa.gov/mission/pioneer-10/",
    missionLabel: "Misión Oficial NASA: Pioneer 10",
    quote: "«Llevo grabada en oro la figura de un hombre y una mujer alzando la mano en señal de saludo, tendiendo un nuevo hilo entre la Tierra y los habitantes de las estrellas.»",
    blocks: [
      {
        type: "text",
        content: "Soy Pioneer 10. Despegué en marzo de 1972 con la misión de aventurarme donde ninguna nave humana había llegado jamás: fui la primera en atravesar el turbulento cinturón de asteroides y la primera en mirar de cerca las tormentas gigantes de Júpiter."
      },
      {
        type: "illustration",
        artId: "space-pioneer-plaque",
        caption: "Archivo NASA Ames · La Placa de Pioneer 10 anodizada en oro con el saludo humano y el mapa de púlsares de nuestro Sol."
      },
      {
        type: "text",
        content: "Antes de partir, Carl Sagan, Frank Drake y Linda Salzman colocaron sobre mi estructura una placa de aluminio anodizado en oro. En ella grabaron las siluetas de una mujer y un hombre de la Tierra con la mano levantada en gesto de paz, junto a un mapa estelar tejido con las señales de catorce púlsares de nuestra galaxia para indicar dónde se encuentra nuestro hogar."
      },
      {
        type: "illustration",
        artId: "space-pioneer-aldebaran",
        caption: "Trayectoria Interestelar · Pioneer 10 navegando hacia la estrella Aldebarán en la constelación de Tauro, muy cerca de las Pléyades."
      },
      {
        type: "text",
        content: "Tras cruzar la órbita de Neptuno y enviar mi último susurro de radio desde más de 12.000 millones de kilómetros, sigo navegando en silencio hacia la estrella roja Aldebarán, en la misma región del cielo donde brillan las Pléyades del relato Wichí. Soy un mensaje eterno desprendido de la copa del árbol terrestre para volver a unir la Tierra con las estrellas."
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
