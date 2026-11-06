'use strict';

const { test, expect } = require('@playwright/test');

const ORIGIN = 'http://127.0.0.1:4180';

async function typeTarget(page) {
  const target = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.char'))
      .map((box) => box.textContent)
      .join('')
      .replace(/␣/g, ' ');
  });

  await page.evaluate(async (text) => {
    const accentBase = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
    const codeFor = (character) => {
      if (character === ' ') return 'Space';
      if (character === '.') return 'Period';
      if (character === 'ñ' || character === 'Ñ') return 'Semicolon';
      return 'Key' + character.toUpperCase();
    };

    for (const character of text) {
      if (accentBase[character]) {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Dead',
          code: 'BracketLeft',
          bubbles: true
        }));
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: accentBase[character],
          code: codeFor(accentBase[character]),
          bubbles: true
        }));
      } else {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: character,
          code: codeFor(character),
          bubbles: true
        }));
      }
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }, target);
}

test('carga offline, sin recursos remotos y con la ruta oculta', async ({ page }) => {
  const external = [];
  const errors = [];

  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(ORIGIN) && !url.startsWith('data:') && !url.startsWith('blob:')) {
      external.push(url);
    }
  });
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('lang', 'es-MX');
  await expect(page.locator('#currentLevelTitle')).toHaveText('Nivel 1 · Fila guía');
  await expect(page.locator('#lessonStep')).toHaveText('Ejercicio 1 de 4');
  await expect(page.locator('#pathDialog')).not.toBeVisible();
  await expect(page.locator('#settingsDialog')).not.toBeVisible();
  await expect(page.locator('#pathStars')).toHaveText('0/18');
  await expect(page.locator('.key')).toHaveCount(36);
  await expect(page.locator('.hand')).toHaveCount(2);

  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('completa un ejercicio, otorga estrellas y avanza con Escape', async ({ page }) => {
  await page.goto('/');
  await typeTarget(page);

  await expect(page.locator('#summaryDialog')).toBeVisible();
  await expect(page.locator('#summaryTitle')).toHaveText('Ejercicio completado');
  await expect(page.locator('#summaryStars')).toHaveAttribute('aria-label', '3 de 3 estrellas');
  await expect(page.locator('#pathStars')).toHaveText('3/18');
  await expect(page.locator('#summaryNextLabel')).toHaveText('Siguiente ejercicio');

  await page.keyboard.press('Escape');
  await expect(page.locator('#summaryDialog')).not.toBeVisible();
  await expect(page.locator('#lessonStep')).toHaveText('Ejercicio 2 de 4');
  await expect(page.locator('#lessonStep')).toBeVisible();
});

test('abre la ruta desde el header y selecciona el nivel de acentos', async ({ page }) => {
  await page.goto('/');

  await page.locator('#btnPath').click();
  await expect(page.locator('#pathDialog')).toBeVisible();
  await expect(page.locator('#levelRail .level-card')).toHaveCount(6);
  await expect(page.locator('#pathTotal')).toContainText('0 / 18');

  await page.locator('.level-card[data-level="5"]').click({ force: true });
  await expect(page.locator('#pathDialog')).not.toBeVisible();
  await expect(page.locator('#currentLevelTitle')).toHaveText('Nivel 6 · Acentos');
  await expect(page.locator('#lessonStep')).toHaveText('Ejercicio 1 de 4');
  await expect(page.locator('#fingerText')).toContainText('Acento agudo');
});

test('abre la guía de teclas y responde una pregunta', async ({ page }) => {
  await page.goto('/');

  await page.locator('#btnPath').click();
  await expect(page.locator('#pathDialog')).toBeVisible();
  await page.locator('#btnKeyGuide').click();

  await expect(page.locator('#keyGuideDialog')).toBeVisible();
  await expect(page.locator('.guide-key')).toHaveCount(13);
  await expect(page.locator('#keyQuizQuestion')).toContainText('mayúscula');

  await page.locator('#keyQuizOptions .quiz-option').filter({ hasText: 'Shift' }).click();
  await expect(page.locator('#keyQuizFeedback')).toContainText('Correcto');
  await expect(page.locator('#btnKeyQuizNext')).toBeVisible();
});

test('abre ajustes desde el header, alterna sonido y conserva la voz automática', async ({ page }) => {
  await page.goto('/');

  await page.locator('#btnSettings').click();
  await expect(page.locator('#settingsDialog')).toBeVisible();
  await expect(page.locator('#settingSound')).toBeChecked();
  await expect(page.locator('#voiceSelect option').first()).toHaveText('Automática · chica latina');
  await expect(page.locator('#voiceStatus')).not.toBeEmpty();

  const voiceSettings = await page.evaluate(() => ({
    checked: document.getElementById('settingVoice').checked,
    disabled: document.getElementById('settingVoice').disabled
  }));
  expect(voiceSettings.checked || voiceSettings.disabled).toBe(true);

  await page.locator('label[for="settingSound"]').click();
  await expect(page.locator('#settingSound')).not.toBeChecked();
  await page.locator('label[for="settingSound"]').click();
  await expect(page.locator('#settingSound')).toBeChecked();

  await page.keyboard.press('Escape');
  await expect(page.locator('#settingsDialog')).not.toBeVisible();
});

test('escribe una vocal acentuada con la tecla muerta en pantalla y con el teclado físico', async ({ page }) => {
  await page.goto('/');
  await page.locator('#btnPath').click();
  await page.locator('.level-card[data-level="5"]').click({ force: true });

  await page.locator('.key[data-code="BracketLeft"]').click({ force: true });
  await expect(page.locator('#accentCue')).toBeVisible();
  await page.locator('.key[data-code="KeyA"]').click({ force: true });
  await expect(page.locator('.char--done')).toHaveCount(1);
  await expect(page.locator('#accuracy')).toHaveText('100');

  await page.locator('#btnRestart').click();
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Dead',
      code: 'BracketLeft',
      bubbles: true
    }));
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      bubbles: true
    }));
  });
  await expect(page.locator('.char--done')).toHaveCount(1);
  await expect(page.locator('#accuracy')).toHaveText('100');
});

test('sanea localStorage corrupto sin romper la interfaz', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('cybertype_v3', JSON.stringify({
        version: 3,
        mode: 'arcade',
        sfx: 'bad',
        voice: 7,
        voiceName: 42,
        starsByLevel: { 1: 99, 2: -5, 3: 2.6, 4: 'x', 5: null, 6: 4 },
        levelIndex: 99,
        exerciseIndex: -5
      }));
    } catch (error) {
      /* The init script can run once on an opaque origin. */
    }
  });

  await page.goto('/');
  await expect(page.locator('#pathStars')).toHaveText('9/18');
  await expect(page.locator('#pathTotal')).toContainText('9 / 18');
  await expect(page.locator('#currentLevelTitle')).toHaveText('Nivel 6 · Acentos');
  await expect(page.locator('#lessonStep')).toHaveText('Ejercicio 1 de 4');
});

test('migra el progreso anterior de cinco niveles', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('cybertype_v3');
      localStorage.setItem('cybertype_v2', JSON.stringify({
        version: 2,
        mode: 'arcade',
        layout: 'es-ES',
        sfx: false,
        voice: true,
        starsByLevel: { 1: 2, 2: 1, 3: 3, 4: 0, 5: 1 },
        levelIndex: 3,
        exerciseIndex: 2
      }));
    } catch (error) {
      /* The init script can run once on an opaque origin. */
    }
  });

  await page.goto('/');
  await expect(page.locator('#pathStars')).toHaveText('7/18');
  await expect(page.locator('#currentLevelTitle')).toHaveText('Nivel 4 · Oraciones');
  await expect(page.locator('#lessonStep')).toHaveText('Ejercicio 3 de 4');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'arcade');
});

test('respeta reduced motion y cambia de tema sin depender del sistema', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('/');

  const duration = await page.evaluate(() => {
    const target = document.querySelector('.key--target');
    return target ? getComputedStyle(target, '::before').animationDuration : null;
  });
  expect(duration).not.toBeNull();
  expect(parseFloat(duration)).toBeLessThan(0.01);

  await page.locator('#modeArcade').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'arcade');
  await expect(page.locator('#brandSubtitle')).toHaveText('Entrenamiento arcade');

  await page.locator('#modeAula').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'aula');
  await expect(page.locator('#brandSubtitle')).toHaveText('Mecanografía para el aula');
});

test('el build de un solo archivo funciona sin scripts externos', async ({ page }) => {
  await page.goto('/dist/CyberType.html');

  await expect(page.locator('#currentLevelTitle')).toHaveText('Nivel 1 · Fila guía');
  await expect(page.locator('.key')).toHaveCount(36);

  const externalScripts = await page.evaluate(() => {
    return Array.from(document.scripts).map((script) => script.src).filter(Boolean);
  });
  expect(externalScripts).toEqual([]);
});
