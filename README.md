# ORBITA 59 (v2)

Experiencia web y mobile de **navegabilidad invertida** que une la cosmovisión del pueblo **Wichí de El Impenetrable, Chaco** con las misiones espaciales en el marco de **NASA International Space Apps Challenge**.

## Características principales (v2)

1. **Preloader "ORBITA 59" desde la oscuridad**: El título emerge lentamente mientras se precargan los recursos visuales y aguarda a que la persona presione **"Iniciar en las Raíces ↑"** para comenzar.
2. **Inicio abajo en las raíces + Escalador fijo**: La experiencia comienza al final de la página (`Altitud 0%`, pleno tono árbol y raíces) con una barra inferior fija (`position: fixed`) que muestra al escalador de espaldas mirando hacia arriba.
3. **Indicador lateral derecho y física de ascenso suave**: Flecha derecha interactiva (`SUBIR · SWIPE ↑`) y motor de scroll/swipe con velocidad reducida e interpolación suave (LERP).
4. **3 Niveles × 2 Mundos unidos por Historias Conectoras (6 relatos en total)**:
   - **Mundo Wichí (El Impenetrable, Chaco)**: Paleta tierra de fibras de chaguar, gris de monte, ocres y vetas de palo santo, guardas geométricas angulares de *yicas* y tipografía *Sansita*.
   - **Mundo Espacial (NASA Space Apps Challenge)**: Gradiente *Electric Blue* a *Deep Space Navy*, acentos *Neon Yellow* (`#E7F434`), insignia vectorial NASA, estrellas interactivas y relatos en primera persona.
   - Cada historia abierta queda **pintada permanentemente** en el árbol.
5. **Cierre superior en pleno cielo espacial**: Al llegar al tope (`Altitud 100%`), el fondo se abre al cielo estrellado con una composición limpia y sin cajas recargadas, presentando el agradecimiento, las personas que participaron y las herramientas utilizadas.

## Ejecutar localmente

Podés servir la carpeta directamente con cualquier servidor estático o mediante Vite:

```bash
npm install
npm run dev
```

Para generar el build de producción en `dist/`:

```bash
npm run build
```
