# CyberType

Entrenador de mecanografía offline para primaria y secundaria. Funciona en Windows, Linux y macOS con un navegador moderno, sin cuentas, sin anuncios, sin servidor y sin conexión a internet.

![CyberType en modo Aula](docs/aula-desktop.png)

## Qué incluye

- **Dos modos:** Aula (claro, cálido, para primaria) y Arcade (oscuro, para secundaria).
- **Cinco niveles:** fila guía, fila superior, fila inferior, oraciones con mayúsculas y dictado.
- **Teclado virtual** con color por dedo, tecla objetivo iluminada y manos SVG que muestran el dedo activo.
- **Shift táctil:** en pantallas táctiles puedes activar Shift y escribir mayúsculas sin teclado físico.
- **Dictado por voz** con la Web Speech API; si el navegador no tiene voz, la pista visual sigue disponible.
- **Métricas en vivo:** PPM, precisión, racha, combo y puntos.
- **Progreso local:** estrellas, nivel, distribución, sonido y voz se guardan en `localStorage`.
- **Accesibilidad:** foco visible, diálogos nativos, `aria-live`, navegación por teclado, objetivos táctiles de 44 px y `prefers-reduced-motion`.
- **Cero dependencias externas en runtime:** fuentes locales, iconos SVG y CSS propio.

| Aula | Arcade |
| --- | --- |
| ![Modo Aula](docs/aula-desktop.png) | ![Modo Arcade](docs/arcade-desktop.png) |

## Cómo usarlo

### Opción 1: archivo portátil (la más simple)

Abre **`dist/CyberType.html`** con doble clic. Es un archivo autocontenido: incluye CSS, JavaScript, fuentes e iconos. No necesita internet, instalación ni servidor.

Puedes copiarlo a una USB, a una carpeta compartida o al escritorio de una netbook escolar. Funciona igual en Windows y Linux.

### Opción 2: carpeta completa + PWA

Para usar el service worker, instalar la app como PWA y tener una URL local estable:

- **Windows:** doble clic en `start.bat`.
- **Linux/macOS:** ejecuta `./start.sh`.
- **Manual:** `python3 serve.py` y abre la URL que imprime (normalmente `http://127.0.0.1:8000/`).

El servidor solo escucha en `127.0.0.1` y no envía nada a internet. Si el puerto 8000 está ocupado, prueba el siguiente automáticamente.

### Opción 3: abrir `index.html` directamente

También funciona sin servidor. La única diferencia es que el service worker y la instalación como PWA no están disponibles desde `file://`; los recursos locales y el progreso sí funcionan.

## Desarrollo

No hay framework, bundler ni `node_modules`. El código fuente es HTML, CSS y JavaScript vanilla.

```bash
# Servir en local con recarga manual
python3 serve.py

# Generar el archivo portátil autocontenido
python3 build.py

# Comprobar que no quedan recursos remotos ni rutas rotas
python3 tests/check_offline.py

# Comprobar contraste WCAG de ambos temas
python3 tests/check_contrast.py
```

Flujo recomendado:

1. Edita `index.html`, `assets/css/app.css` o `assets/js/app.js`.
2. Prueba en el navegador con `python3 serve.py`.
3. Ejecuta `python3 build.py` para actualizar `dist/CyberType.html`.
4. Ejecuta las dos comprobaciones de `tests/`.
5. Si cambias assets cacheados por el service worker, sube `CACHE_NAME` en `sw.js`.

### Estructura

```text
.
├── index.html                  # App fuente
├── assets/
│   ├── css/app.css             # Tokens, componentes y temas
│   ├── js/app.js               # Lógica, persistencia, audio y voz
│   ├── fonts/                  # Fredoka y Nunito (WOFF2 + OFL)
│   └── icons/                  # Icono SVG + PNG para PWA
├── dist/CyberType.html         # Build portátil de un solo archivo
├── design-system/cybertype/    # Sistema de diseño generado + brief de práctica
├── docs/                       # Capturas de referencia
├── legacy/                     # Implementación original conservada
├── tests/                      # Comprobaciones offline y de contraste
├── build.py                    # Genera dist/CyberType.html
├── serve.py                    # Servidor local opcional
├── start.sh / start.bat        # Lanzadores
├── manifest.webmanifest        # PWA
├── sw.js                       # Cache offline
├── PRODUCT.md                  # Verdad de producto
├── DESIGN.md                   # Decisiones visuales y de interacción
└── README.md
```

## Pruebas manuales recomendadas

La matriz completa está en [`tests/README.md`](tests/README.md). Como mínimo:

- Tres distribuciones: `es-MX`, `es-ES`, `en-US`.
- Teclado físico y teclado en pantalla; mayúsculas con Shift y con Shift táctil.
- Bloq Mayús activado, Ctrl/Cmd + tecla y tecla mantenida.
- Modo Aula y modo Arcade, con el sistema operativo en claro y en oscuro.
- 1440×900, 1024×600 (netbook), 768, 390 y 360 px.
- `prefers-reduced-motion: reduce`.
- `dist/CyberType.html` abierto sin conexión.
- Progreso corrupto en `localStorage` y reinicio de avance.

## Privacidad

- No hay backend, cuentas, cookies de seguimiento ni analítica.
- El progreso vive en `localStorage` de este navegador.
- La voz se sintetiza con el motor del sistema; el texto no sale del equipo.
- El único servidor es opcional, local y de solo lectura.

## Compatibilidad

- Chrome/Edge 100+, Firefox 100+, Safari 15.4+.
- Se usa `<dialog>` nativo, `:focus-visible`, `color-scheme` y `gap` en flex. Si necesitas navegadores más antiguos, hay que añadir fallbacks.
- La app está pensada para teclado físico; el teclado en pantalla es un apoyo táctil y se desplaza horizontalmente en pantallas pequeñas.

## Decisiones de diseño

- **Mundo visual:** un escritorio de aprendizaje táctil, con teclas físicas, papel cálido y acentos índigo/naranja en Aula; una cabina arcade de alto contraste en Arcade.
- **Tipografía:** Fredoka para títulos y teclas; Nunito para cuerpo e interfaz; mono del sistema para la cinta de escritura. Las fuentes están empaquetadas localmente.
- **Temas:** se controlan con `data-theme` y variables CSS. No se usan variantes `dark:` del sistema operativo, para que el modo elegido no se rompa si el SO cambia.
- **Interacción:** la tecla objetivo se ilumina, el dedo se resalta en la mano y el error se explica con la tecla esperada. El combo se usa para sumar puntos; las estrellas dependen de la precisión.
- **Accesibilidad:** diálogos nativos con foco atrapado, `aria-live` para el coach, `aria-pressed` en toggles, foco visible, etiquetas en teclas y soporte de movimiento reducido.
- **Netbook primero:** a 1024×600 la interfaz se compacta para que el prompt y las acciones sigan visibles.

![Vista en netbook 1024×600](docs/aula-netbook.png)

## Limitaciones y siguientes pasos

- **Tildes:** el contenido evita palabras con tilde para no depender de teclas muertas. Falta un nivel específico de acentos y un manejo de composición (`Dead` + vocal).
- **Binario nativo:** esta entrega es una app web autocontenida, no un `.exe`/AppImage. Es deliberado: cero instalación y cero dependencias. Si se necesita un binario, el siguiente paso es un wrapper Electron/Tauri con su pipeline de firma y empaquetado.
- **Perfiles:** el progreso es por navegador, no por estudiante. Un aula compartida necesita el botón de reinicio o perfiles locales.
- **Docente:** no hay panel ni exportación de resultados. Un CSV/JSON de sesión sería el siguiente incremento.
- **Analítica didáctica:** se pueden añadir errores por tecla, tiempo por lección y recomendaciones de práctica.
- **Contenido:** ampliar el corpus por nivel y añadir más frases contextualizadas.
- **Voz:** elegir una voz española disponible y avisar cuando el sistema no tenga ninguna.
- **Empaquetado:** service worker versionado y actualización automática; el cache actual requiere subir `CACHE_NAME` al publicar cambios.

## Créditos y licencia

- Código y diseño: proyecto CyberType.
- Tipografías: **Fredoka** y **Nunito**, SIL Open Font License 1.1. Las licencias están en `assets/fonts/`.
- Iconos: SVG de 24 px dibujados para este proyecto, con convenciones de trazo inspiradas en Lucide (ISC). Ver [`THIRD_PARTY.md`](THIRD_PARTY.md).
- La implementación original de TeclaMágica se conserva en `legacy/teclamagica-original.html` como referencia.
- Licencia del proyecto: MIT. Ver [`LICENSE`](LICENSE).
