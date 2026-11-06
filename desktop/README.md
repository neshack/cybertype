# CyberType Desktop

Wrapper de Electron para distribuir CyberType como aplicación de escritorio en Windows y Linux. La app sigue funcionando sin conexión y sin servidor.

## Requisitos

- Node.js 20 o superior.
- Python 3 para generar `dist/CyberType.html`.
- En Linux, las dependencias de Electron para construir el AppImage.

## Desarrollo

```bash
# Desde la raíz del proyecto
python3 build.py

# Desde desktop/
npm install
npm start
```

`npm start` ejecuta `scripts/prepare.js`, copia `dist/CyberType.html` a `desktop/app/index.html` y abre Electron.

## Empaquetado

```bash
# Linux: AppImage
npm run pack:linux

# Windows: ejecutable portable
npm run pack:win
```

Los artefactos se generan en `desktop/release/`. Los binarios no se versionan en git por tamaño; se producen localmente o en GitHub Actions.

La forma recomendada de generar ambos es el workflow [`desktop.yml`](../.github/workflows/desktop.yml):

- Linux corre en `ubuntu-latest` y produce un AppImage.
- Windows corre en `windows-latest` y produce un `.exe` portable.
- Los artifacts quedan disponibles en la ejecución del workflow.

## Firma

El empaquetado sin firma funciona, pero Windows SmartScreen y algunos sistemas Linux pueden mostrar advertencias. Para firmar:

- Configura `CSC_LINK` y `CSC_KEY_PASSWORD` como secretos del repositorio.
- Para Windows, usa un certificado de code signing PFX.
- La firma no se puede completar sin un certificado emitido por una CA; el workflow ya pasa las variables si existen.

No se incluyen certificados ni secretos en el repositorio.

## Notas

- El wrapper carga el build autocontenido (`dist/CyberType.html`), así que no necesita internet.
- La ventana mínima es 1024×600; el objetivo principal es escritorio.
- El proceso de render no tiene acceso a Node (`nodeIntegration: false`, `sandbox: true`).
- Los enlaces externos se abren en el navegador del sistema, no dentro de Electron.
- El progreso se guarda en el almacenamiento local del perfil de Electron.
