# Pruebas de CyberType

## Automáticas

```bash
python3 build.py
python3 tests/check_offline.py
python3 tests/check_contrast.py
```

- `check_offline.py` verifica que `index.html`, el CSS y `dist/CyberType.html` no dependan de la red y que todas las rutas locales existan.
- `check_contrast.py` calcula el contraste WCAG de texto, botones, teclas, badges y estados en Aula y Arcade. Falla si algún par baja del mínimo declarado.

## Matriz manual

Marca cada casilla en una sesión real antes de publicar.

### Teclado físico

- [ ] `es-MX`: escribir una lección completa con Ñ y espacios.
- [ ] `es-ES`: cambiar la distribución en Ajustes y comprobar las etiquetas.
- [ ] `en-US`: cambiar la distribución y comprobar que la Ñ se adapta a `;` en el Nivel 1.
- [ ] Mayúsculas con Shift izquierdo y derecho; la mano contraria se ilumina.
- [ ] Bloq Mayús activado: el aviso aparece, las minúsculas siguen funcionando y las mayúsculas exigen Shift.
- [ ] Ctrl+F, Cmd+R, Alt+Tab: no cuentan como errores ni escriben caracteres.
- [ ] Mantener una tecla pulsada: no auto-repite ni infla la racha.
- [ ] Flechas, Backspace, Enter y Tab: no cuentan como errores y no rompen la navegación.

### Teclado en pantalla y touch

- [ ] Pulsar la tecla Shift en pantalla y luego una letra mayúscula del Nivel 4.
- [ ] La tecla Shift se desactiva después de usarla y su `aria-pressed` cambia.
- [ ] La tecla objetivo se desplaza a la vista en la franja horizontal del teclado.
- [ ] El nivel actual se desplaza a la vista en la ruta horizontal al recargar.
- [ ] Objetivos táctiles de 44 px en el topbar, acciones, diálogos y teclas.
- [ ] Sin scroll horizontal en el `body` a 360 px.
- [ ] El teclado se desplaza dentro de su marco, no la página.

### Modos y temas

- [ ] Aula con el SO en claro y en oscuro: el tema no cambia de color.
- [ ] Arcade con el SO en claro y en oscuro: el tema no cambia de color.
- [ ] Contraste de texto normal ≥4.5:1 en todos los paneles.
- [ ] Modo Aula: Tico y copy de aula.
- [ ] Modo Arcade: CyberBot y copy arcade.

### Flujo

- [ ] Completar un ejercicio: modal, estrellas, PPM, precisión, racha y puntos.
- [ ] Repetir, siguiente ejercicio y siguiente nivel.
- [ ] Completar el último ejercicio del Nivel 5: “Curso completado”.
- [ ] Cerrar el resumen con Escape: avanza o vuelve al inicio sin dejar un estado muerto.
- [ ] Abrir y cerrar Ayuda, Calibrar y Reiniciar con Escape y con los botones.
- [ ] El foco vuelve a la práctica al cerrar un diálogo.
- [ ] Calibrar con `Ñ` y con `;`; el selector de distribución queda sincronizado.
- [ ] Reiniciar avance pide confirmación y conserva modo/distribución/sonido/voz.

### Persistencia y robustez

- [ ] Recargar conserva estrellas, nivel, ejercicio, modo, distribución, sonido y voz.
- [ ] `cybertype_v2` con estrellas 99/-5/2.6 y nivel 99 se sanea sin errores.
- [ ] `localStorage` bloqueado: la app sigue funcionando sin guardar.
- [ ] Modo offline: abrir `dist/CyberType.html` sin red y completar un ejercicio.
- [ ] Service worker: servir con `python3 serve.py`, recargar offline y comprobar que cachea.
- [ ] Subir `CACHE_NAME` en `sw.js` al cambiar assets cacheados.

### Accesibilidad

- [ ] `prefers-reduced-motion: reduce`: sin pulso, sin shake, sin parallax; el contenido sigue visible.
- [ ] Navegación completa con Tab y Shift+Tab; foco visible y no tapado por el topbar.
- [ ] Lector de pantalla: títulos, botones, teclas, `aria-pressed`, `aria-live` del coach y diálogos.
- [ ] Zoom al 200 %: sin scroll horizontal del body y sin texto cortado.
- [ ] Contraste en modo de colores forzados.

### Tamaños

- [ ] 1440×900.
- [ ] 1366×768.
- [ ] 1024×600 (netbook).
- [ ] 768×1024.
- [ ] 390×844.
- [ ] 360×740.

### Contenido

- [ ] Sin tildes faltantes en palabras que las necesiten (el contenido actual evita palabras con tilde).
- [ ] Sin emojis usados como iconos.
- [ ] Copy de acciones claro: “Escuchar”, “Mostrar pista”, “Siguiente ejercicio”, “Volver al inicio”.
