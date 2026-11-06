'use strict';

const { app, BrowserWindow, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

app.setName('CyberType');
if (process.platform === 'win32') app.setAppUserModelId('mx.cybertype.app');

function createWindow() {
  const appFile = path.join(__dirname, 'app', 'index.html');

  if (!fs.existsSync(appFile)) {
    console.error('No existe app/index.html. Ejecuta "npm run prepare:app" después de "python3 build.py".');
    app.quit();
    return;
  }

  const window = new BrowserWindow({
    width: 1366,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: '#F4EFE6',
    show: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  window.loadFile(appFile).catch((error) => {
    console.error('No se pudo cargar app/index.html:', error);
  });

  window.webContents.on('did-fail-load', (event, code, description, url) => {
    console.error('did-fail-load', code, description, url);
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
