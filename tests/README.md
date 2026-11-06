# Pruebas de CyberType

## Automáticas

```bash
python3 build.py
python3 tests/check_offline.py
python3 tests/check_contrast.py
npm test
```

- `check_offline.py` verifica que `index.html`, el CSS y `dist/CyberType.html` no dependan de la red y que todas las rutas locales existan.
- `check_contrast.py` calcula el contraste WCAG de texto, botones, teclas, badges y estados en Aula y Arcade.
- `npm test` ejecuta 10 pruebas Playwright: carga, ejercicio completo, ruta, guía de teclas interactiva, ajustes, acentos en pantalla y teclado físico, localStorage corrupto, migración, reduced motion, temas y build de un solo archivo.
- `.github/workflows/ci.yml` corre todo en cada push y pull request.

## Matriz manual

Marca cada casilla en una sesión real antes de publicar.

### Español de México

- [ ] La interfaz, el teclado y los ejercicios están en español de México.
- [ ] No hay selector de otros idiomas ni distribuciones de teclado.
- [ ] El teclado muestra Ñ, `´` y `{` en las posiciones de la distribución mexicana.
- [ ] La voz de `speak` usa `es-MX` o una variante latina, no `es-ES` por defecto.

### Teclado físico

- [ ] Completar una lección con Ñ, espacios y punto.
- [ ] Mayúsculas con Shift izquierdo y derecho; la mano contraria se ilumina.
- [ ] Bloq Mayús activado: el aviso aparece, las minúsculas siguen funcionando y las mayúsculas exigen Shift.
- [ ] Ctrl+F, Cmd+R, Alt+Tab: no cuentan como errores ni escriben caracteres.
- [ ] Mantener una tecla pulsada: no auto-repite ni infla la racha.
- [ ] Flechas, Backspace, Enter y Tab: no cuentan como errores y no rompen la navegación.

### Práctica y panel de Tico

- [ ] En escritorio, Tico está fuera de la tarjeta de práctica y en un panel a la derecha.
- [ ] A 1024×600 el panel derecho sigue visible y el teclado no provoca scroll horizontal del body.
- [ ] A 390 px el panel se convierte en una franja compacta debajo de la práctica.
- [ ] Las manos muestran palma, cuatro dedos de longitudes distintas y pulgar interno en el orden correcto.
- [ ] Al escribir, el dedo activo de la mano correcta se ilumina y se distinguen índice izquierdo y derecho.

### Acentos

- [ ] Nivel 6: `árbol música rápido` y `mamá papá café`.
- [ ] La tecla `´` física seguida de vocal produce á/é/í/ó/ú y avanza.
- [ ] La tecla `´` en pantalla se activa, muestra “Acento agudo activo” y luego la vocal avanza.
- [ ] Si se pulsa `´` y una consonante, la app explica el error y no deja el acento pegado.
- [ ] La tecla objetivo principal y la tecla `´` se distinguen visualmente; la mano muestra el dedo de la vocal y el meñique del acento.
- [ ] `El árbol está aquí.` combina mayúscula, tildes y punto.

### Teclado en pantalla y touch

- [ ] Pulsar Shift en pantalla y luego una letra mayúscula del Nivel 4.
- [ ] La tecla Shift se desactiva después de usarla y su `aria-pressed` cambia.
- [ ] La tecla objetivo se desplaza a la vista en la franja horizontal del teclado.
- [ ] Objetivos táctiles de 44 px en el topbar, acciones, diálogos y teclas.
- [ ] Sin scroll horizontal en el `body` a 360 px.
- [ ] El teclado se desplaza dentro de su marco, no la página.

### Ruta y ajustes

- [ ] La ruta no se ve al cargar; se abre con **Ruta** del header.
- [ ] La ruta muestra seis niveles, estrellas y nivel actual; elegir un nivel cierra la ventana y empieza.
- [ ] Ajustes se abre con el engranaje del header.
- [ ] Sonido y voz se alternan con los switches y persisten al recargar.
- [ ] La voz automática prioriza una voz latina femenina y lo indica; “Probar voz” usa la voz seleccionada.
- [ ] El selector solo ofrece voces latinoamericanas; si no hay, la voz guía se desactiva y se explica.
- [ ] Reiniciar avance pide confirmación, cierra Ajustes y vuelve al Nivel 1 sin borrar modo/sonido/voz.

### Guía de teclas

- [ ] La guía se abre desde la tarjeta **Guía de teclas** de la ruta.
- [ ] La guía se abre desde el botón **Ver guía de teclas** de Ayuda.
- [ ] La guía muestra el mismo teclado de la práctica, con las mismas teclas y colores por dedo.
- [ ] Al tocar una letra, aparece su nombre, su función, el dedo y un ejemplo.
- [ ] Al tocar Tab, Bloq Mayús, Shift, espacio y ´, aparece su explicación específica.
- [ ] La fila **También en tu teclado físico** incluye Enter, Backspace, Supr, Ctrl, Alt, Esc, flechas, Windows/Command y F1–F12.
- [ ] La tecla seleccionada queda marcada y el botón **Escuchar** repite la explicación.
- [ ] Si no hay voz disponible, la explicación escrita sigue funcionando.
- [ ] La guía no cambia estrellas ni el nivel actual; al cerrar, el foco vuelve a la práctica.

### Modos y temas

- [ ] Aula con el SO en claro y en oscuro: el tema no cambia de color.
- [ ] Arcade con el SO en claro y en oscuro: el tema no cambia de color.
- [ ] Contraste de texto normal ≥4.5:1 en todos los paneles.
- [ ] Aula: Tico y copy de aula. Arcade: CyberBot y copy arcade.

### Flujo

- [ ] Completar un ejercicio: modal, estrellas, PPM, precisión, racha y puntos.
- [ ] Repetir, siguiente ejercicio y siguiente nivel.
- [ ] Completar el último ejercicio del Nivel 6: “Curso completado”.
- [ ] Cerrar el resumen con Escape: avanza o vuelve al inicio sin dejar un estado muerto.
- [ ] Abrir y cerrar Ayuda, Ruta, Ajustes y Reiniciar con Escape y con los botones.
- [ ] El foco vuelve a la práctica al cerrar un diálogo; al abrir Reiniciar desde Ajustes, el foco queda dentro de Reiniciar.

### Persistencia y robustez

- [ ] Recargar conserva estrellas, nivel, ejercicio, modo, sonido, voz y voz seleccionada.
- [ ] `cybertype_v3` con estrellas 99/-5/2.6 y nivel 99 se sanea sin errores.
- [ ] El progreso anterior de `cybertype_v2` migra a seis niveles.
- [ ] `localStorage` bloqueado: la app sigue funcionando sin guardar.
- [ ] Modo offline: abrir `dist/CyberType.html` sin red y completar un ejercicio.
- [ ] Service worker: servir con `python3 serve.py`, recargar offline y comprobar que cachea.
- [ ] Subir `CACHE_NAME` en `sw.js` al cambiar assets cacheados.

### Accesibilidad

- [ ] `prefers-reduced-motion: reduce`: sin pulso, sin shake, sin parallax; el contenido sigue visible.
- [ ] Navegación completa con Tab y Shift+Tab; foco visible y no tapado por el topbar.
- [ ] Lector de pantalla: títulos, botones, teclas, `aria-pressed`, `aria-live` del coach y del detalle de la guía, y diálogos.
- [ ] Zoom al 200 %: sin scroll horizontal del body y sin texto cortado.
- [ ] Contraste en modo de colores forzados.

### Escritorio (Electron)

- [ ] `npm start` en `desktop/` abre la app y carga el build portátil.
- [ ] La ventana respeta 1024×600 y el contenido sigue siendo usable.
- [ ] Los enlaces externos no se abren dentro de Electron.
- [ ] `npm run pack:linux` genera un AppImage.
- [ ] El workflow **Desktop packages** genera Linux y Windows en GitHub Actions.
- [ ] La firma se prueba con `CSC_LINK`/`CSC_KEY_PASSWORD` cuando exista certificado.

### Tamaños

- [ ] 1440×900.
- [ ] 1366×768.
- [ ] 1024×600 (netbook).
- [ ] 768×1024.
- [ ] 390×844.
- [ ] 360×740.
