'use strict';

const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(__dirname, '..', '..', 'dist', 'CyberType.html');
const targetDirectory = path.resolve(__dirname, '..', 'app');
const target = path.join(targetDirectory, 'index.html');

if (!fs.existsSync(source)) {
  console.error('No existe dist/CyberType.html. Ejecuta "python3 build.py" en la raíz del proyecto.');
  process.exit(1);
}

fs.mkdirSync(targetDirectory, { recursive: true });
fs.copyFileSync(source, target);
console.log('Preparado: ' + target);
