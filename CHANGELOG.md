# Registro de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.4.1] - 2026-11-06

### Añadido
- **Panel lateral para Tico:** En pantallas de escritorio, el coach vive en una columna dedicada a la derecha de la práctica sin quitar espacio al teclado ni a la tarjeta de texto. En pantallas móviles/angostas se colapsa de forma compacta debajo del ejercicio.
* **Manos anatómicas en SVG:** Ilustraciones rediseñadas con proporciones anatómicas reales: palma con nudillos, falanges diferenciadas, pulgar interno y realce con color, trazo y resplandor para el dedo activo.
* **Manejo inteligente de voz ausente:** La guía interactiva de teclas detecta si el sistema operativo no cuenta con voces en español de México/latinoamericanas, mostrando un mensaje explicativo y desactivando el botón de repetición en lugar de fallar en silencio.

### Mejorado
* Capturas de pantalla actualizadas en alta resolución en la documentación para ambos temas (Aula y Arcade) y vistas en netbook escolar.
* Enlaces directos de descarga para los paquetes de escritorio v2.4.1.

---

## [2.4.0] - 2026-11-06

### Añadido
- **Guía interactiva de teclas:** Nueva lección de referencia que reutiliza el teclado de la práctica para explorar tecla por tecla su propósito, dedo asignado y ejemplos prácticos.
- Fila complementaria de teclas especiales: Enter, Backspace, Supr, Ctrl, Alt, Esc, flechas de dirección, tecla Windows/Command y teclas de función F1–F12.
- Reproducción de voz sintetizada para cada tecla explicada.

---

## [2.3.0] - 2026-11-06

### Añadido
- **Empaquetado de escritorio con Electron:** Configuración en `desktop/` para compilar binarios portátiles en Windows (`.exe`) y Linux (`.AppImage`) sin requerir instalación.
- **Nivel 6 (Acentos):** Nivel dedicado a la práctica de palabras con tilde (á, é, í, ó, ú) con soporte real para la tecla muerta física (`´`) y tecla muerta virtual en pantalla para pantallas táctiles.
- Flujo de integración continua en GitHub Actions (`desktop.yml` y `ci.yml`) para verificar pruebas en múltiples sistemas y generar artefactos descargables.

### Optimizado
- Diseño de interfaz optimizado para pantallas netbook (1024×600 px) comunes en aulas escolares.

---

## [2.0.0] - 2026-11-05

### Añadido
- **Reconstrucción integral de CyberType:** Nueva base de código como entrenador de mecanografía 100 % offline para español de México.
- **Dos modos de inmersión:**
  - *Modo Aula:* Interfaz cálida, clara y táctil.
  - *Modo Arcade:* Interfaz oscura, inspirada en videojuegos retro con alto contraste.
- **Persistencia local:** Progreso, estrellas, nivel alcanzado, configuraciones de audio y voz guardados íntegramente en `localStorage`.
- **Cero dependencias remotas:** Fuentes Nunito y Fredoka autocontenidas en formato WOFF2, iconos vectoriales SVG propios y síntesis de audio mediante Web Audio API local.
- **Script de compilación (`build.py`):** Generador de `dist/CyberType.html`, un archivo único e independiente para distribución en memorias USB y aulas desconectadas.
