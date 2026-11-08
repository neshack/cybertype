# Guía de Contribución a CyberType 🇲🇽

¡Gracias por tu interés en contribuir a **CyberType**! Este proyecto es un entrenador de mecanografía offline en español de México, pensado para estudiantes de primaria y secundaria, docentes y familias, funcionando sin conexión, sin cuentas y sin costo alguno.

---

## 📌 Principios Innegociables del Proyecto

Antes de escribir código o proponer cambios, ten en cuenta los pilares fundamentales de diseño y arquitectura de CyberType:

1. **100 % Offline y Autosuficiente:**
   - Cero dependencias externas en tiempo de ejecución.
   - Prohibido el uso de CDNs externas, fuentes remotas (Google Fonts, etc.) o analítica/telemetría.
   - Todo recurso (fuentes `.woff2`, iconos SVG, sonidos Web Audio API) debe estar autocontenido en el repositorio.
2. **Distribución Portátil en un Solo Archivo:**
   - La distribución web `dist/CyberType.html` debe generarse mediante `python3 build.py` y funcionar abriéndose directamente con doble clic en cualquier navegador moderno sin necesidad de servidor web.
3. **Privacidad Total (Protección de Menores):**
   - No se solicitan datos personales, correos ni nombres.
   - El progreso se guarda exclusivamente en el `localStorage` del dispositivo local.
4. **Enfoque Pedagógico Mexicano (`es-MX`):**
   - El vocabulario, frases, ortografía y disposición del teclado están adaptados a la enseñanza del español en México (incluyendo el manejo explícito de la tecla muerta `´` para vocales acentuadas: á, é, í, ó, ú).
5. **Rendimiento y Accesibilidad en Hardware Escolar:**
   - Debe funcionar de manera fluida en netbooks escolares de bajos recursos (resolución mínima objetivo: 1024×600 px y navegadores ligeros).
   - Se debe mantener contraste WCAG AA en ambos temas (**Aula** y **Arcade**), soporte para navegación completa por teclado, `aria-live` para lectores de pantalla y respeto a `prefers-reduced-motion`.

---

## 🛠️ Entorno de Desarrollo Local

### Requisitos previos

* **Node.js**: v20 o v22+
* **Python**: v3.10+
* **Git**

### Pasos para clonar y ejecutar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/neshack/cybertype.git
   cd cybertype
   ```

2. Instala las dependencias de desarrollo y testing:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo local:
   ```bash
   npm run serve
   # o directamente:
   python3 serve.py
   ```
   Abre en tu navegador la URL indicada (usualmente `http://127.0.0.1:8000/`).

4. Genera el archivo portátil autocontenido:
   ```bash
   npm run build
   # Generará dist/CyberType.html
   ```

5. Ejecuta las pruebas automatizadas (Playwright):
   ```bash
   npm test
   # Modo visual (con navegador visible):
   npm run test:headed
   ```

---

## 💻 Desarrollo de la Aplicación de Escritorio (Electron)

CyberType cuenta con un contenedor Electron en el directorio `desktop/`:

```bash
cd desktop
npm install

# Probar la app de escritorio en modo desarrollo
npm start

# Empaquetar para Linux (.AppImage)
npm run pack:linux

# Empaquetar para Windows (.exe portable)
npm run pack:win
```

---

## 🧪 Pruebas y Control de Calidad

Cualquier cambio en la lógica de mecanografía, el teclado virtual, los temas o la persistencia debe pasar todas las pruebas de integración con Playwright:

```bash
npm test
```

Si agregas una nueva funcionalidad o corriges un error:
* Incluye o actualiza las pruebas correspondientes en el directorio `tests/e2e/`.
* Comprueba que la aplicación siga pasando la prueba de carga sin conexión y que el archivo `dist/CyberType.html` mantenga su integridad.

---

## 🤝 Flujo de Trabajo para Contribuir

1. **Revisa los Issues:** Si vas a trabajar en una nueva característica o bug complejo, abre un *Issue* previo o comenta en uno existente para alinear el diseño antes de implementar.
2. **Crea una rama (`branch`):**
   * Corrección de errores: `fix/descripcion-del-bug`
   * Nuevas funciones: `feat/nombre-de-la-funcion`
   * Documentación: `docs/descripcion-del-cambio`
3. **Realiza commits claros:**
   Seguimos la convención de [Conventional Commits](https://www.conventionalcommits.org/):
   * `feat: agregar nuevo ejercicio de palabras compuestas`
   * `fix: corregir detección de voz en navegadores Firefox Linux`
   * `docs: actualizar instrucciones de instalación en Windows`
4. **Verifica tus cambios:**
   Asegúrate de que `npm test` y `python3 build.py` corran sin errores.
5. **Abre un Pull Request:**
   Describe claramente el problema resuelto, los pasos seguidos para verificarlo y adjunta capturas si hubo cambios en la interfaz.

---

## 📜 Licencia

Al contribuir a CyberType, aceptas que tus contribuciones se licencien bajo los términos de la [Licencia MIT](LICENSE).
