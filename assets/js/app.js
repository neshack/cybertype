/*
 * CyberType — offline typing tutor
 * Vanilla JavaScript, no build step required for the folder version.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'cybertype_v2';
  var LEGACY_KEY = 'teclamagica_progress_v1';
  var STORAGE_VERSION = 2;

  var FINGER_INFO = {
    'L-PINKY': { name: 'Mano izquierda · meñique', colorVar: '--finger-pinky' },
    'L-RING': { name: 'Mano izquierda · anular', colorVar: '--finger-ring' },
    'L-MIDDLE': { name: 'Mano izquierda · dedo medio', colorVar: '--finger-middle' },
    'L-INDEX': { name: 'Mano izquierda · índice', colorVar: '--finger-index-l' },
    'R-INDEX': { name: 'Mano derecha · índice', colorVar: '--finger-index-r' },
    'R-MIDDLE': { name: 'Mano derecha · dedo medio', colorVar: '--finger-middle' },
    'R-RING': { name: 'Mano derecha · anular', colorVar: '--finger-ring' },
    'R-PINKY': { name: 'Mano derecha · meñique', colorVar: '--finger-pinky' },
    'THUMB': { name: 'Cualquier pulgar · barra espaciadora', colorVar: '--finger-thumb' }
  };

  var LEVELS = [
    {
      id: 1,
      shortName: 'Fila guía',
      description: 'ASDF · JKLÑ',
      icon: 'icon-home',
      dictation: false,
      exercises: [
        'fff jjj fff jjj fjf jfj',
        'ddd kkk sss lll aaa ñññ',
        'faja sala hada gala laña'
      ]
    },
    {
      id: 2,
      shortName: 'Fila superior',
      description: 'QWERTY · UIOP',
      icon: 'icon-rocket',
      dictation: false,
      exercises: [
        'rrr uuu eee iii www ooo qqq ppp',
        'tete yoyo ruta pipa queso',
        'perro gato loro pato toro'
      ]
    },
    {
      id: 3,
      shortName: 'Fila inferior',
      description: 'ZXCV · BNM',
      icon: 'icon-anchor',
      dictation: false,
      exercises: [
        'vvv mmm ccc nnn xxx zzz bbb',
        'vaca nube mano bote zona',
        'caminos volcanes mariposa'
      ]
    },
    {
      id: 4,
      shortName: 'Oraciones',
      description: 'Mayúsculas y puntos',
      icon: 'icon-book',
      dictation: false,
      exercises: [
        'Ana lee un libro bonito.',
        'Pedro y Elena estudian hoy.',
        'La escuela tiene muchas mesas.'
      ]
    },
    {
      id: 5,
      shortName: 'Dictado',
      description: 'Escucha y escribe',
      icon: 'icon-headphones',
      dictation: true,
      exercises: [
        'sol mar luz paz',
        'nube casa flor tren',
        'Teclado veloz y seguro.'
      ]
    }
  ];

  var state = {
    mode: 'aula',
    layout: 'es-MX',
    sfx: true,
    voice: true,
    levelIndex: 0,
    exerciseIndex: 0,
    target: '',
    charIndex: 0,
    total: 0,
    correct: 0,
    streak: 0,
    maxStreak: 0,
    score: 0,
    startTime: null,
    stickyShift: false,
    hintVisible: false,
    calibrating: false,
    capsLock: false,
    summaryResolved: true,
    summaryAction: 'advance',
    starsByLevel: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };

  var audioCtx = null;

  var dom = {
    themeColorMeta: document.getElementById('themeColorMeta'),
    brandSubtitle: document.getElementById('brandSubtitle'),
    modeAula: document.getElementById('modeAula'),
    modeArcade: document.getElementById('modeArcade'),
    btnSound: document.getElementById('btnSound'),
    soundIconUse: document.getElementById('soundIconUse'),
    btnVoice: document.getElementById('btnVoice'),
    voiceIconUse: document.getElementById('voiceIconUse'),
    btnHelp: document.getElementById('btnHelp'),
    levelRail: document.getElementById('levelRail'),
    starsTotal: document.getElementById('starsTotal'),
    btnResetProgress: document.getElementById('btnResetProgress'),
    practice: document.getElementById('practice'),
    currentLevelTitle: document.getElementById('currentLevelTitle'),
    lessonStep: document.getElementById('lessonStep'),
    btnListen: document.getElementById('btnListen'),
    btnHint: document.getElementById('btnHint'),
    hintIconUse: document.getElementById('hintIconUse'),
    hintLabel: document.getElementById('hintLabel'),
    btnRestart: document.getElementById('btnRestart'),
    promptTape: document.getElementById('promptTape'),
    exerciseProgress: document.getElementById('exerciseProgress'),
    exerciseProgressBar: document.getElementById('exerciseProgressBar'),
    fingerCue: document.getElementById('fingerCue'),
    fingerDot: document.getElementById('fingerDot'),
    fingerText: document.getElementById('fingerText'),
    shiftCue: document.getElementById('shiftCue'),
    shiftText: document.getElementById('shiftText'),
    capsCue: document.getElementById('capsCue'),
    coachName: document.getElementById('coachName'),
    coachMessage: document.getElementById('coachMessage'),
    mascot: document.getElementById('mascot'),
    keyboard: document.getElementById('keyboard'),
    wpm: document.getElementById('wpm'),
    accuracy: document.getElementById('accuracy'),
    combo: document.getElementById('combo'),
    streak: document.getElementById('streak'),
    score: document.getElementById('score'),
    layoutSelect: document.getElementById('layoutSelect'),
    btnCalibrate: document.getElementById('btnCalibrate'),
    summaryDialog: document.getElementById('summaryDialog'),
    summaryStars: document.getElementById('summaryStars'),
    summaryTitle: document.getElementById('summaryTitle'),
    summaryMessage: document.getElementById('summaryMessage'),
    summaryWpm: document.getElementById('summaryWpm'),
    summaryAcc: document.getElementById('summaryAcc'),
    summaryStreak: document.getElementById('summaryStreak'),
    summaryScore: document.getElementById('summaryScore'),
    btnSummaryRepeat: document.getElementById('btnSummaryRepeat'),
    btnSummaryNext: document.getElementById('btnSummaryNext'),
    summaryNextLabel: document.getElementById('summaryNextLabel'),
    calibrationDialog: document.getElementById('calibrationDialog'),
    calibrationResult: document.getElementById('calibrationResult'),
    btnCalibrateN: document.getElementById('btnCalibrateN'),
    btnCalibrateSemicolon: document.getElementById('btnCalibrateSemicolon'),
    resetDialog: document.getElementById('resetDialog'),
    btnConfirmReset: document.getElementById('btnConfirmReset'),
    helpDialog: document.getElementById('helpDialog'),
    srStatus: document.getElementById('srStatus')
  };

  /* -----------------------------------------------------------------------
   * Utilities
   * --------------------------------------------------------------------- */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function swapCase(character) {
    return character === character.toLowerCase()
      ? character.toUpperCase()
      : character.toLowerCase();
  }

  function comboMultiplier() {
    if (state.streak >= 25) return 8;
    if (state.streak >= 12) return 4;
    if (state.streak >= 5) return 2;
    return 1;
  }

  function starMarkup(count, animate) {
    var markup = '';
    for (var index = 0; index < 3; index += 1) {
      var filled = index < count;
      var animation = animate && filled ? ' style="animation-delay:' + index * 70 + 'ms"' : '';
      markup += '<svg class="star ' + (filled ? 'star--filled' : 'star--empty') + '" viewBox="0 0 24 24" aria-hidden="true"' + animation + '><use href="#' + (filled ? 'icon-star-filled' : 'icon-star') + '"></use></svg>';
    }
    return markup;
  }

  function makeIcon(symbolId) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + symbolId);
    svg.appendChild(use);
    return svg;
  }

  /* -----------------------------------------------------------------------
   * Persistence
   * --------------------------------------------------------------------- */
  function loadState() {
    var saved = null;

    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (error) {
      saved = null;
    }

    if (!saved) {
      try {
        var legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          var old = JSON.parse(legacy);
          saved = {
            version: 1,
            mode: old.mode === 'secundaria' ? 'arcade' : 'aula',
            layout: old.layout,
            starsByLevel: old.starsByLevel,
            sfx: true,
            voice: true,
            levelIndex: 0,
            exerciseIndex: 0
          };
        }
      } catch (error) {
        saved = null;
      }
    }

    if (!saved || typeof saved !== 'object') return;

    state.mode = saved.mode === 'arcade' || saved.mode === 'secundaria' ? 'arcade' : 'aula';
    state.layout = ['es-MX', 'es-ES', 'en-US'].indexOf(saved.layout) !== -1 ? saved.layout : 'es-MX';
    state.sfx = typeof saved.sfx === 'boolean' ? saved.sfx : true;
    state.voice = typeof saved.voice === 'boolean' ? saved.voice : true;

    state.starsByLevel = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (saved.starsByLevel && typeof saved.starsByLevel === 'object') {
      for (var levelId = 1; levelId <= 5; levelId += 1) {
        var stars = Number(saved.starsByLevel[levelId]);
        state.starsByLevel[levelId] = Number.isFinite(stars) ? clamp(Math.round(stars), 0, 3) : 0;
      }
    }

    state.levelIndex = Number.isInteger(saved.levelIndex)
      ? clamp(saved.levelIndex, 0, LEVELS.length - 1)
      : 0;
    state.exerciseIndex = Number.isInteger(saved.exerciseIndex)
      ? clamp(saved.exerciseIndex, 0, LEVELS[state.levelIndex].exercises.length - 1)
      : 0;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: STORAGE_VERSION,
        mode: state.mode,
        layout: state.layout,
        sfx: state.sfx,
        voice: state.voice,
        starsByLevel: state.starsByLevel,
        levelIndex: state.levelIndex,
        exerciseIndex: state.exerciseIndex
      }));
    } catch (error) {
      /* localStorage can be unavailable in private or restricted contexts. */
    }
  }

  /* -----------------------------------------------------------------------
   * Theme and controls
   * --------------------------------------------------------------------- */
  function applyMode(mode, options) {
    options = options || {};
    state.mode = mode === 'arcade' ? 'arcade' : 'aula';
    var arcade = state.mode === 'arcade';

    document.documentElement.dataset.theme = state.mode;
    dom.themeColorMeta.setAttribute('content', arcade ? '#080B14' : '#F4EFE6');
    dom.brandSubtitle.textContent = arcade ? 'Entrenamiento arcade' : 'Mecanografía para el aula';
    dom.coachName.textContent = arcade ? 'CyberBot' : 'Tico';

    dom.modeAula.classList.toggle('is-active', !arcade);
    dom.modeArcade.classList.toggle('is-active', arcade);
    dom.modeAula.setAttribute('aria-pressed', String(!arcade));
    dom.modeArcade.setAttribute('aria-pressed', String(arcade));

    if (!options.skipSave) saveState();
    if (state.target) highlightTarget();
  }

  function speechSupported() {
    return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  }

  function updateToggleButtons() {
    var voiceAvailable = speechSupported();
    if (!voiceAvailable) state.voice = false;

    dom.btnSound.setAttribute('aria-pressed', String(state.sfx));
    dom.btnSound.setAttribute('aria-label', state.sfx ? 'Desactivar sonidos' : 'Activar sonidos');
    dom.btnSound.title = state.sfx ? 'Sonidos activados' : 'Sonidos desactivados';
    dom.soundIconUse.setAttribute('href', state.sfx ? '#icon-volume' : '#icon-volume-off');

    dom.btnVoice.disabled = !voiceAvailable;
    dom.btnVoice.setAttribute('aria-pressed', String(state.voice));
    dom.btnVoice.setAttribute('aria-label', state.voice ? 'Desactivar voz guía' : 'Activar voz guía');
    dom.btnVoice.title = voiceAvailable
      ? (state.voice ? 'Voz activada' : 'Voz desactivada')
      : 'Voz no disponible en este navegador';
    dom.voiceIconUse.setAttribute('href', state.voice ? '#icon-mic' : '#icon-mic-off');

    dom.layoutSelect.value = state.layout;
  }

  function updateCapsCue() {
    dom.capsCue.classList.toggle('is-hidden', !state.capsLock);
  }

  function updateShiftKeys() {
    var keys = document.querySelectorAll('.key--shift');
    for (var index = 0; index < keys.length; index += 1) {
      keys[index].classList.toggle('key--shift-active', state.stickyShift);
      keys[index].setAttribute('aria-pressed', String(state.stickyShift));
    }
  }

  function updateHintButton(level) {
    var isDictation = !!level.dictation;
    dom.btnHint.classList.toggle('is-hidden', !isDictation);

    if (isDictation) {
      dom.hintLabel.textContent = state.hintVisible ? 'Ocultar pista' : 'Mostrar pista';
      dom.hintIconUse.setAttribute('href', state.hintVisible ? '#icon-eye-off' : '#icon-eye');
    }
  }

  /* -----------------------------------------------------------------------
   * Keyboard data
   * --------------------------------------------------------------------- */
  function getKeyboardRows(layout) {
    var isEnglish = layout === 'en-US';
    var semiLabel = isEnglish ? ';' : 'Ñ';
    var semiKey = isEnglish ? ';' : 'ñ';
    var bracketLabel = isEnglish ? '[' : '´';
    var bracketKey = isEnglish ? '[' : '´';
    var quoteLabel = isEnglish ? "'" : (layout === 'es-ES' ? 'Ç' : '{');
    var quoteKey = isEnglish ? "'" : (layout === 'es-ES' ? 'ç' : '{');

    return [
      [
        { code: 'Tab', label: 'Tab', wide: 'key--wide-1', type: 'decor' },
        { code: 'KeyQ', key: 'q', label: 'Q', finger: 'L-PINKY', type: 'char' },
        { code: 'KeyW', key: 'w', label: 'W', finger: 'L-RING', type: 'char' },
        { code: 'KeyE', key: 'e', label: 'E', finger: 'L-MIDDLE', type: 'char' },
        { code: 'KeyR', key: 'r', label: 'R', finger: 'L-INDEX', type: 'char' },
        { code: 'KeyT', key: 't', label: 'T', finger: 'L-INDEX', type: 'char' },
        { code: 'KeyY', key: 'y', label: 'Y', finger: 'R-INDEX', type: 'char' },
        { code: 'KeyU', key: 'u', label: 'U', finger: 'R-INDEX', type: 'char' },
        { code: 'KeyI', key: 'i', label: 'I', finger: 'R-MIDDLE', type: 'char' },
        { code: 'KeyO', key: 'o', label: 'O', finger: 'R-RING', type: 'char' },
        { code: 'KeyP', key: 'p', label: 'P', finger: 'R-PINKY', type: 'char' },
        { code: 'BracketLeft', key: bracketKey, label: bracketLabel, finger: 'R-PINKY', type: 'char' }
      ],
      [
        { code: 'CapsLock', label: 'Bloq', sub: 'Mayús', wide: 'key--wide-2', type: 'decor' },
        { code: 'KeyA', key: 'a', label: 'A', finger: 'L-PINKY', type: 'char' },
        { code: 'KeyS', key: 's', label: 'S', finger: 'L-RING', type: 'char' },
        { code: 'KeyD', key: 'd', label: 'D', finger: 'L-MIDDLE', type: 'char' },
        { code: 'KeyF', key: 'f', label: 'F', finger: 'L-INDEX', type: 'char', homing: true },
        { code: 'KeyG', key: 'g', label: 'G', finger: 'L-INDEX', type: 'char' },
        { code: 'KeyH', key: 'h', label: 'H', finger: 'R-INDEX', type: 'char' },
        { code: 'KeyJ', key: 'j', label: 'J', finger: 'R-INDEX', type: 'char', homing: true },
        { code: 'KeyK', key: 'k', label: 'K', finger: 'R-MIDDLE', type: 'char' },
        { code: 'KeyL', key: 'l', label: 'L', finger: 'R-RING', type: 'char' },
        { code: 'Semicolon', key: semiKey, label: semiLabel, finger: 'R-PINKY', type: 'char' },
        { code: 'Quote', key: quoteKey, label: quoteLabel, finger: 'R-PINKY', type: 'char' }
      ],
      [
        { code: 'ShiftLeft', label: 'Shift', wide: 'key--wide-3', type: 'shift', side: 'left' },
        { code: 'KeyZ', key: 'z', label: 'Z', finger: 'L-PINKY', type: 'char' },
        { code: 'KeyX', key: 'x', label: 'X', finger: 'L-RING', type: 'char' },
        { code: 'KeyC', key: 'c', label: 'C', finger: 'L-MIDDLE', type: 'char' },
        { code: 'KeyV', key: 'v', label: 'V', finger: 'L-INDEX', type: 'char' },
        { code: 'KeyB', key: 'b', label: 'B', finger: 'L-INDEX', type: 'char' },
        { code: 'KeyN', key: 'n', label: 'N', finger: 'R-INDEX', type: 'char' },
        { code: 'KeyM', key: 'm', label: 'M', finger: 'R-INDEX', type: 'char' },
        { code: 'Comma', key: ',', label: ',', finger: 'R-MIDDLE', type: 'char' },
        { code: 'Period', key: '.', label: '.', finger: 'R-RING', type: 'char' },
        { code: 'ShiftRight', label: 'Shift', wide: 'key--wide-3', type: 'shift', side: 'right' }
      ],
      [
        { code: 'Space', key: ' ', label: 'espacio', finger: 'THUMB', wide: 'key--space', type: 'char' }
      ]
    ];
  }

  function getAdaptedText(rawText) {
    if (state.layout !== 'en-US') return rawText;
    if (state.levelIndex === 0) {
      return rawText.replace(/ñ/g, ';').replace(/Ñ/g, ';');
    }
    return rawText.replace(/ñ/g, 'n').replace(/Ñ/g, 'N');
  }

  function getTargetKeyData(targetChar) {
    if (!targetChar) return null;

    var isUpper = targetChar !== targetChar.toLowerCase() && targetChar.toUpperCase() === targetChar;
    var baseChar = targetChar.toLowerCase();
    var rows = getKeyboardRows(state.layout);

    for (var rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      for (var keyIndex = 0; keyIndex < rows[rowIndex].length; keyIndex += 1) {
        var key = rows[rowIndex][keyIndex];
        if (key.key !== baseChar) continue;

        var isLeftHandKey = typeof key.finger === 'string' && key.finger.indexOf('L-') === 0;
        return {
          code: key.code,
          key: key.key,
          label: key.label,
          finger: key.finger,
          isUpper: isUpper,
          shiftCode: isUpper ? (isLeftHandKey ? 'ShiftRight' : 'ShiftLeft') : null,
          shiftFinger: isUpper ? (isLeftHandKey ? 'R-PINKY' : 'L-PINKY') : null
        };
      }
    }

    return null;
  }

  /* -----------------------------------------------------------------------
   * Rendering
   * --------------------------------------------------------------------- */
  function renderLevels() {
    dom.levelRail.innerHTML = '';
    var totalStars = 0;

    LEVELS.forEach(function (level, index) {
      var stars = clamp(Number(state.starsByLevel[level.id]) || 0, 0, 3);
      totalStars += stars;

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-card';
      button.dataset.level = String(index);
      button.setAttribute('aria-label', 'Nivel ' + level.id + ': ' + level.shortName + '. ' + stars + ' de 3 estrellas.');

      if (index === state.levelIndex) {
        button.classList.add('is-current');
        button.setAttribute('aria-current', 'step');
      } else if (stars > 0) {
        button.classList.add('is-done');
      }

      button.innerHTML =
        '<span class="level-card__top">' +
          '<span class="level-card__icon"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + level.icon + '"></use></svg></span>' +
          '<span class="level-card__stars" aria-hidden="true">' + starMarkup(stars, false) + '</span>' +
        '</span>' +
        '<span class="level-card__step">Nivel ' + level.id + '</span>' +
        '<span class="level-card__name">' + level.shortName + '</span>' +
        '<span class="level-card__sub">' + level.description + '</span>';

      button.addEventListener('click', function () {
        selectLevel(index);
      });

      dom.levelRail.appendChild(button);
    });

    var totalLabel = dom.starsTotal.querySelector('span');
    if (totalLabel) totalLabel.textContent = totalStars + ' / 15';
    dom.starsTotal.setAttribute('aria-label', 'Estrellas obtenidas: ' + totalStars + ' de 15');

    var currentCard = dom.levelRail.querySelector('.level-card.is-current');
    if (currentCard && dom.levelRail.scrollWidth > dom.levelRail.clientWidth) {
      var railRect = dom.levelRail.getBoundingClientRect();
      var cardRect = currentCard.getBoundingClientRect();
      if (cardRect.left < railRect.left) {
        dom.levelRail.scrollLeft -= railRect.left - cardRect.left + 8;
      } else if (cardRect.right > railRect.right) {
        dom.levelRail.scrollLeft += cardRect.right - railRect.right + 8;
      }
    }
  }

  function appendKeyContent(element, keyObject, withIcon) {
    var inner = document.createElement('span');
    inner.className = 'key__inner';

    if (withIcon) inner.appendChild(makeIcon('icon-arrow-up'));

    var label = document.createElement('span');
    label.className = 'key__label';
    label.textContent = keyObject.label;
    inner.appendChild(label);
    element.appendChild(inner);

    if (keyObject.sub) {
      var sub = document.createElement('span');
      sub.className = 'key__sub';
      sub.textContent = keyObject.sub;
      element.appendChild(sub);
    }

    if (keyObject.homing) {
      var homing = document.createElement('span');
      homing.className = 'key__homing';
      element.appendChild(homing);
    }
  }

  function createKey(keyObject) {
    var wide = keyObject.wide ? ' ' + keyObject.wide : '';

    if (keyObject.type === 'decor') {
      var decor = document.createElement('span');
      decor.className = 'key key--decor' + wide;
      decor.setAttribute('aria-hidden', 'true');
      appendKeyContent(decor, keyObject, false);
      return decor;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.tabIndex = -1;
    button.dataset.code = keyObject.code;

    if (keyObject.type === 'shift') {
      button.className = 'key key--shift' + wide;
      button.setAttribute('aria-label', keyObject.side === 'left' ? 'Shift izquierdo. Activa Shift para la siguiente tecla.' : 'Shift derecho. Activa Shift para la siguiente tecla.');
      appendKeyContent(button, keyObject, true);
      button.addEventListener('click', toggleStickyShift);
      return button;
    }

    button.className = 'key' + wide;
    button.dataset.key = keyObject.key;
    button.dataset.finger = keyObject.finger;
    button.setAttribute('aria-label', 'Tecla ' + keyObject.label + ', ' + FINGER_INFO[keyObject.finger].name);
    appendKeyContent(button, keyObject, false);

    button.addEventListener('click', function () {
      ensureAudio();
      var key = keyObject.key;
      var shift = false;

      if (state.stickyShift && /^[a-zñ]$/i.test(key)) {
        key = swapCase(key);
        shift = true;
      }

      consumeStickyShift();
      handleInput(key, keyObject.code, shift);
    });

    return button;
  }

  function renderKeyboard() {
    dom.keyboard.innerHTML = '';
    var rows = getKeyboardRows(state.layout);

    rows.forEach(function (row) {
      var rowElement = document.createElement('div');
      rowElement.className = 'kbd-row';

      row.forEach(function (keyObject) {
        rowElement.appendChild(createKey(keyObject));
      });

      dom.keyboard.appendChild(rowElement);
    });

    updateShiftKeys();
  }

  function renderPrompt() {
    var level = LEVELS[state.levelIndex];
    dom.currentLevelTitle.textContent = 'Nivel ' + level.id + ' · ' + level.shortName;
    dom.lessonStep.textContent = 'Ejercicio ' + (state.exerciseIndex + 1) + ' de ' + level.exercises.length;
    updateHintButton(level);

    dom.promptTape.innerHTML = '';
    var characters = state.target.split('');

    characters.forEach(function (character, index) {
      var span = document.createElement('span');
      var classes = ['char'];
      var hidden = level.dictation && !state.hintVisible && index >= state.charIndex && character !== ' ';

      if (index < state.charIndex) classes.push('char--done');
      else if (index === state.charIndex) classes.push('char--current');

      if (character === ' ') {
        classes.push('char--space');
        span.textContent = '␣';
        span.setAttribute('aria-label', 'espacio');
      } else if (hidden) {
        span.textContent = '?';
        span.setAttribute('aria-hidden', 'true');
      } else {
        span.textContent = character;
      }

      span.className = classes.join(' ');
      span.id = 'char-box-' + index;
      dom.promptTape.appendChild(span);
    });

    dom.promptTape.setAttribute(
      'aria-label',
      level.dictation ? 'Dictado. Escucha la palabra y escríbela.' : 'Texto del ejercicio.'
    );

    updateProgress();
  }

  function updateProgress() {
    var length = state.target.length || 1;
    var percent = Math.round((state.charIndex / length) * 100);

    dom.exerciseProgressBar.style.transform = 'scaleX(' + (percent / 100) + ')';
    dom.exerciseProgress.setAttribute('aria-valuenow', String(percent));
    dom.exerciseProgress.setAttribute('aria-valuetext', state.charIndex + ' de ' + state.target.length + ' caracteres');
  }

  function updateMetrics() {
    var accuracy = state.total === 0 ? 100 : Math.round((state.correct / state.total) * 100);
    var wpm = 0;

    if (state.startTime && state.correct > 0) {
      var elapsedMinutes = Math.max((Date.now() - state.startTime) / 60000, 0.02);
      wpm = Math.round((state.correct / 5) / elapsedMinutes);
    }

    dom.wpm.textContent = String(wpm);
    dom.accuracy.textContent = String(accuracy);
    dom.combo.textContent = 'x' + comboMultiplier();
    dom.streak.textContent = String(state.streak);
    dom.score.textContent = String(state.score);
  }

  function activateHandFinger(finger) {
    var fingers = document.querySelectorAll('.hand__finger[data-finger="' + finger + '"]');
    for (var index = 0; index < fingers.length; index += 1) {
      fingers[index].classList.add('is-active');
    }
  }

  function scrollKeyIntoView(keyElement) {
    if (dom.keyboard.scrollWidth <= dom.keyboard.clientWidth + 4) return;

    var keyRect = keyElement.getBoundingClientRect();
    var containerRect = dom.keyboard.getBoundingClientRect();
    var padding = 12;

    if (keyRect.left < containerRect.left + padding) {
      dom.keyboard.scrollLeft -= containerRect.left + padding - keyRect.left;
    } else if (keyRect.right > containerRect.right - padding) {
      dom.keyboard.scrollLeft += keyRect.right - (containerRect.right - padding);
    }
  }

  function highlightTarget() {
    var previousTargets = document.querySelectorAll('.key--target');
    for (var index = 0; index < previousTargets.length; index += 1) {
      previousTargets[index].classList.remove('key--target');
    }

    var activeFingers = document.querySelectorAll('.hand__finger.is-active');
    for (var fingerIndex = 0; fingerIndex < activeFingers.length; fingerIndex += 1) {
      activeFingers[fingerIndex].classList.remove('is-active');
    }

    var targetChar = state.target[state.charIndex];
    if (!targetChar) {
      dom.fingerText.textContent = 'Ejercicio completado.';
      dom.shiftCue.classList.add('is-hidden');
      return;
    }

    var keyData = getTargetKeyData(targetChar);
    if (!keyData) {
      dom.fingerText.textContent = 'Tecla especial';
      dom.shiftCue.classList.add('is-hidden');
      return;
    }

    var keyElement = dom.keyboard.querySelector('.key[data-code="' + keyData.code + '"]');
    if (keyElement) {
      keyElement.classList.add('key--target');
      scrollKeyIntoView(keyElement);
    }

    if (keyData.isUpper && keyData.shiftCode) {
      var shiftElement = dom.keyboard.querySelector('.key[data-code="' + keyData.shiftCode + '"]');
      if (shiftElement) shiftElement.classList.add('key--target');

      var shiftHand = keyData.shiftFinger.indexOf('L-') === 0 ? 'izquierda' : 'derecha';
      dom.shiftText.textContent = 'Mantén Shift con la mano ' + shiftHand;
      dom.shiftCue.classList.remove('is-hidden');
      activateHandFinger(keyData.shiftFinger);
    } else {
      dom.shiftCue.classList.add('is-hidden');
    }

    if (keyData.finger === 'THUMB') {
      activateHandFinger('L-THUMB');
      activateHandFinger('R-THUMB');
    } else {
      activateHandFinger(keyData.finger);
    }

    var info = FINGER_INFO[keyData.finger];
    if (info) {
      var color = getComputedStyle(document.documentElement).getPropertyValue(info.colorVar).trim();
      dom.fingerDot.style.background = color || 'var(--primary)';
      dom.fingerText.textContent = info.name + ' → tecla ' + (targetChar === ' ' ? 'ESPACIO' : keyData.label);
    }
  }

  function setMood(mood) {
    dom.mascot.dataset.mood = mood;
  }

  function setCoach(message, mood) {
    dom.coachMessage.innerHTML = message;
    if (mood) setMood(mood);
  }

  /* -----------------------------------------------------------------------
   * Audio and voice
   * --------------------------------------------------------------------- */
  function ensureAudio() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      try {
        audioCtx = new AudioContextClass();
      } catch (error) {
        return null;
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }

    return audioCtx;
  }

  function playSuccess() {
    if (!state.sfx) return;
    var context = ensureAudio();
    if (!context) return;

    var now = context.currentTime;
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    var step = Math.min(state.streak, 12);
    var baseFrequency = state.mode === 'aula' ? 440 : 360;
    var frequency = baseFrequency * Math.pow(1.045, step);

    oscillator.type = state.mode === 'aula' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.25, now + 0.07);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.09);
  }

  function playError() {
    if (!state.sfx) return;
    var context = ensureAudio();
    if (!context) return;

    var now = context.currentTime;
    var oscillator = context.createOscillator();
    var gain = context.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(170, now);
    oscillator.frequency.linearRampToValueAtTime(115, now + 0.16);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.19);
  }

  function playFanfare() {
    if (!state.sfx) return;
    var context = ensureAudio();
    if (!context) return;

    var notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function (frequency, index) {
      var now = context.currentTime + index * 0.11;
      var oscillator = context.createOscillator();
      var gain = context.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.27);
    });
  }

  function speak(text, priority) {
    if (!speechSupported()) return;

    try {
      if (priority) window.speechSynthesis.cancel();

      var utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = state.mode === 'aula' ? 0.98 : 1.06;
      utterance.pitch = state.mode === 'aula' ? 1.05 : 1;

      var voices = window.speechSynthesis.getVoices();
      var spanishVoice = voices.filter(function (voice) {
        return /^es[-_]/i.test(voice.lang) || /spanish|español/i.test(voice.name);
      })[0];

      if (spanishVoice) utterance.voice = spanishVoice;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      /* Speech is an enhancement; the visual cue still works. */
    }
  }

  function dictateWord(priority, force) {
    if (!state.target) return;
    if (!force && !state.voice) return;
    if (!speechSupported()) return;

    var remaining = state.target.slice(state.charIndex).trimStart();
    var nextWord = remaining.split(/\s+/)[0] || state.target;
    speak('Escribe: ' + nextWord, priority);
  }

  function announceTarget(priority, force) {
    if (!state.target) return;

    if (!speechSupported()) {
      setCoach('La voz no está disponible en este navegador. Puedes usar la pista visual.', 'oops');
      return;
    }

    if (!force && !state.voice) return;

    var level = LEVELS[state.levelIndex];
    if (level.dictation) {
      dictateWord(priority, force);
      return;
    }

    var targetChar = state.target[state.charIndex];
    if (!targetChar) return;
    speak('Presiona ' + (targetChar === ' ' ? 'espacio' : targetChar), priority);
  }

  /* -----------------------------------------------------------------------
   * Exercise flow
   * --------------------------------------------------------------------- */
  function focusPractice() {
    try {
      dom.practice.focus();
    } catch (error) {
      /* Older browsers without focus options still support the element focus. */
    }
  }

  function startExercise(options) {
    options = options || {};
    var shouldSpeak = !!options.speak;
    var shouldFocus = !!options.focus;
    var level = LEVELS[state.levelIndex];

    state.exerciseIndex = clamp(state.exerciseIndex, 0, level.exercises.length - 1);
    state.target = getAdaptedText(level.exercises[state.exerciseIndex]);
    state.charIndex = 0;
    state.total = 0;
    state.correct = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.score = 0;
    state.startTime = null;
    state.stickyShift = false;
    state.hintVisible = false;
    state.capsLock = false;
    state.summaryResolved = true;

    renderLevels();
    renderKeyboard();
    renderPrompt();
    updateMetrics();
    highlightTarget();
    updateCapsCue();

    if (level.dictation) {
      setMood('focused');
      if (!speechSupported() || !state.voice) {
        setCoach('Dictado sin voz. Pulsa <strong>Mostrar pista</strong> para ver las letras.', 'focused');
      } else {
        setCoach('Escucha la palabra y escríbela. Puedes pedir una pista.', 'focused');
        if (shouldSpeak) {
          window.setTimeout(function () {
            dictateWord(true, false);
          }, 160);
        }
      }
    } else if (state.levelIndex === 0) {
      setCoach('Coloca los índices en <strong>F</strong> y <strong>J</strong>. La tecla iluminada es la siguiente.', 'happy');
      if (shouldSpeak) {
        window.setTimeout(function () {
          announceTarget(true, false);
        }, 160);
      }
    } else {
      setCoach('Sigue la tecla iluminada. El color indica el dedo.', 'happy');
      if (shouldSpeak) {
        window.setTimeout(function () {
          announceTarget(true, false);
        }, 160);
      }
    }

    if (shouldFocus) focusPractice();
    saveState();
  }

  function selectLevel(index) {
    state.levelIndex = clamp(index, 0, LEVELS.length - 1);
    state.exerciseIndex = 0;
    startExercise({ speak: true, focus: true });
  }

  function handleInput(key, code, shift) {
    var targetChar = state.target[state.charIndex];
    if (!targetChar) return;

    if (!state.startTime) state.startTime = Date.now();

    var isCorrect = key === targetChar;
    if (!isCorrect && (targetChar.toLowerCase() === 'ñ' || targetChar === ';') && code === 'Semicolon') {
      var needsUpper = targetChar === 'Ñ';
      isCorrect = !needsUpper || !!shift;
    }

    state.total += 1;

    var currentBox = document.getElementById('char-box-' + state.charIndex);
    var pressedKeyElement = code
      ? dom.keyboard.querySelector('.key[data-code="' + code + '"]')
      : null;

    if (isCorrect) {
      state.correct += 1;
      state.streak += 1;
      state.maxStreak = Math.max(state.maxStreak, state.streak);
      state.score += 10 * comboMultiplier();

      playSuccess();

      if (pressedKeyElement) {
        pressedKeyElement.classList.add('key--ok');
        window.setTimeout(function () {
          pressedKeyElement.classList.remove('key--ok');
        }, 140);
      }

      var keyData = getTargetKeyData(targetChar);
      if (keyData && keyData.isUpper && keyData.shiftCode) {
        var shiftElement = dom.keyboard.querySelector('.key[data-code="' + keyData.shiftCode + '"]');
        if (shiftElement) {
          shiftElement.classList.add('key--ok');
          window.setTimeout(function () {
            shiftElement.classList.remove('key--ok');
          }, 140);
        }
      }

      var wasOops = dom.mascot.dataset.mood === 'oops';
      var previousCoach = dom.coachMessage.textContent || '';
      state.charIndex += 1;

      renderPrompt();
      updateProgress();
      highlightTarget();
      updateMetrics();

      if (state.streak === 5) {
        setCoach('Cinco seguidas. Mantén el ritmo.', 'celebrate');
      } else if (state.streak === 12) {
        setCoach('Doce seguidas. Vas muy bien.', 'celebrate');
      } else if (wasOops || previousCoach.indexOf('Shift activo') !== -1) {
        setCoach('Bien. Sigue con la siguiente.', 'focused');
      } else {
        setMood('focused');
      }

      var level = LEVELS[state.levelIndex];
      if (level.dictation && targetChar === ' ' && state.charIndex < state.target.length) {
        window.setTimeout(function () {
          dictateWord(true, false);
        }, 120);
      }

      if (state.charIndex >= state.target.length) {
        finishExercise();
      }
    } else {
      state.streak = 0;
      playError();

      if (currentBox) {
        currentBox.classList.add('char--wrong');
        window.setTimeout(function () {
          currentBox.classList.remove('char--wrong');
        }, 280);
      }

      if (pressedKeyElement) {
        pressedKeyElement.classList.add('key--error');
        window.setTimeout(function () {
          pressedKeyElement.classList.remove('key--error');
        }, 280);
      }

      var expectedData = getTargetKeyData(targetChar);
      var expectedFinger = expectedData ? FINGER_INFO[expectedData.finger] : null;
      var charName = targetChar === ' ' ? 'ESPACIO' : targetChar;

      setCoach(
        'Casi. Buscamos la tecla <strong>' + escapeHtml(charName) + '</strong> con ' +
        escapeHtml(expectedFinger ? expectedFinger.name : 'el dedo iluminado') + '.',
        'oops'
      );

      updateMetrics();
    }
  }

  function finishExercise() {
    var level = LEVELS[state.levelIndex];
    var accuracy = state.total === 0 ? 100 : Math.round((state.correct / state.total) * 100);
    var elapsedMinutes = Math.max((Date.now() - (state.startTime || Date.now())) / 60000, 0.02);
    var wpm = Math.round((state.correct / 5) / elapsedMinutes);
    var stars = 1;

    if (accuracy >= 95) stars = 3;
    else if (accuracy >= 85) stars = 2;

    if (stars > (state.starsByLevel[level.id] || 0)) {
      state.starsByLevel[level.id] = stars;
    }

    renderLevels();
    saveState();

    var isLastExercise = state.exerciseIndex + 1 >= level.exercises.length;
    var isLastLevel = state.levelIndex + 1 >= LEVELS.length;
    var title;
    var message;
    var nextLabel;
    var action;

    if (isLastLevel && isLastExercise) {
      title = 'Curso completado';
      message = 'Terminaste los cinco niveles. Puedes repetir el último ejercicio o volver al inicio.';
      nextLabel = 'Volver al inicio';
      action = 'home';
    } else if (isLastExercise) {
      title = 'Nivel completado';
      message = 'Terminaste ' + level.shortName + '. Sigue con el siguiente nivel.';
      nextLabel = 'Siguiente nivel';
      action = 'advance';
    } else {
      title = 'Ejercicio completado';
      message = 'Buen trabajo en ' + level.shortName + '. Sigue con el siguiente ejercicio.';
      nextLabel = 'Siguiente ejercicio';
      action = 'advance';
    }

    dom.summaryStars.innerHTML = starMarkup(stars, true);
    dom.summaryStars.setAttribute('role', 'img');
    dom.summaryStars.setAttribute('aria-label', stars + ' de 3 estrellas');
    dom.summaryTitle.textContent = title;
    dom.summaryMessage.textContent = message;
    dom.summaryWpm.textContent = String(wpm);
    dom.summaryAcc.textContent = String(accuracy);
    dom.summaryStreak.textContent = String(state.maxStreak);
    dom.summaryScore.textContent = String(state.score);
    dom.summaryNextLabel.textContent = nextLabel;
    state.summaryAction = action;
    state.summaryResolved = false;

    setMood('celebrate');
    setCoach('Ejercicio completado. ' + stars + ' de 3 estrellas.', 'celebrate');
    playFanfare();

    if (state.voice && speechSupported()) {
      speak('Ejercicio completado. ' + stars + ' estrellas. Precisión ' + accuracy + ' por ciento.', true);
    }

    showDialog(dom.summaryDialog, dom.btnSummaryNext);
  }

  function advanceExercise() {
    var level = LEVELS[state.levelIndex];

    if (state.exerciseIndex + 1 < level.exercises.length) {
      state.exerciseIndex += 1;
    } else if (state.levelIndex + 1 < LEVELS.length) {
      state.levelIndex += 1;
      state.exerciseIndex = 0;
    } else {
      state.levelIndex = 0;
      state.exerciseIndex = 0;
    }

    startExercise({ speak: true, focus: true });
  }

  function repeatExercise() {
    startExercise({ speak: false, focus: true });
  }

  function goHome() {
    state.levelIndex = 0;
    state.exerciseIndex = 0;
    startExercise({ speak: true, focus: true });
  }

  function toggleHint() {
    if (!LEVELS[state.levelIndex].dictation) return;
    state.hintVisible = !state.hintVisible;
    renderPrompt();
    dom.srStatus.textContent = state.hintVisible ? 'Pista visible.' : 'Pista oculta.';
  }

  function toggleSound() {
    state.sfx = !state.sfx;
    updateToggleButtons();
    saveState();

    if (state.sfx) {
      ensureAudio();
      playSuccess();
    }
  }

  function toggleVoice() {
    if (!speechSupported()) return;

    state.voice = !state.voice;
    if (!state.voice && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    updateToggleButtons();
    saveState();

    if (state.voice) announceTarget(false, false);
  }

  function toggleStickyShift() {
    state.stickyShift = !state.stickyShift;
    updateShiftKeys();
    setCoach(state.stickyShift
      ? 'Shift activo. La próxima letra será mayúscula.'
      : 'Shift desactivado.', 'focused');
    dom.srStatus.textContent = state.stickyShift ? 'Shift activo.' : 'Shift desactivado.';
  }

  function consumeStickyShift() {
    if (!state.stickyShift) return;
    state.stickyShift = false;
    updateShiftKeys();
  }

  function setLayout(layout, message, shouldFocus) {
    if (['es-MX', 'es-ES', 'en-US'].indexOf(layout) === -1) return;

    state.layout = layout;
    dom.layoutSelect.value = layout;
    saveState();

    startExercise({ speak: false, focus: !!shouldFocus });
    if (message) dom.calibrationResult.textContent = message;
    if (shouldFocus) setCoach('Distribución actualizada. Revisa las etiquetas del teclado.', 'focused');
  }

  function openCalibration() {
    state.calibrating = true;
    dom.calibrationResult.textContent = 'Esperando la tecla…';
    showDialog(dom.calibrationDialog, dom.btnCalibrateN);
  }

  function resetProgress() {
    state.starsByLevel = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    state.levelIndex = 0;
    state.exerciseIndex = 0;
    saveState();
    renderLevels();
    closeDialog(dom.resetDialog);
    startExercise({ speak: false, focus: true });
    setCoach('Progreso reiniciado. Empezamos de nuevo.', 'happy');
    dom.srStatus.textContent = 'Progreso reiniciado.';
  }

  /* -----------------------------------------------------------------------
   * Dialogs
   * --------------------------------------------------------------------- */
  function showDialog(dialog, focusElement) {
    if (!dialog || dialog.open) {
      if (focusElement) focusElement.focus();
      return;
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    if (focusElement) focusElement.focus();
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  /* -----------------------------------------------------------------------
   * Input events
   * --------------------------------------------------------------------- */
  function handleCalibrationKey(event) {
    var target = event.target;
    if (target && target.nodeType === 1 && target.closest('button, a') &&
        (event.key === 'Enter' || event.key === ' ')) {
      return;
    }

    if (event.key === 'Escape') return;
    if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'].indexOf(event.key) !== -1) return;

    event.preventDefault();

    if (event.key === 'ñ' || event.key === 'Ñ' || event.key === ';' || event.key === ':' || event.code === 'Semicolon') {
      var isEnglish = event.key === ';' || event.key === ':';
      setLayout(
        isEnglish ? 'en-US' : 'es-MX',
        isEnglish ? 'Detectado: teclado inglés US (;).' : 'Detectado: teclado español (Ñ).',
        false
      );
      window.setTimeout(function () {
        closeDialog(dom.calibrationDialog);
      }, 900);
      return;
    }

    if (event.key === 'Dead') {
      dom.calibrationResult.textContent = 'Esa tecla es un acento. Prueba con la tecla de la Ñ.';
    } else {
      dom.calibrationResult.textContent = 'Presionaste "' + event.key + '". Prueba con la tecla a la derecha de la L.';
    }
  }

  function handleKeydown(event) {
    if (state.calibrating) {
      handleCalibrationKey(event);
      return;
    }

    if (document.querySelector('dialog[open]')) return;

    var target = event.target;
    var isElement = target && target.nodeType === 1;

    if (isElement && target.closest('select, input, textarea, [contenteditable="true"]')) return;
    if (isElement && target.closest('button, a') && (event.key === 'Enter' || event.key === ' ')) return;

    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.isComposing) return;

    if (event.key === 'CapsLock') {
      var capsState = event.getModifierState
        ? event.getModifierState('CapsLock')
        : !state.capsLock;
      state.capsLock = !!capsState;
      updateCapsCue();
      return;
    }

    if ([
      'Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape', 'Enter', 'Backspace',
      'Delete', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Dead', 'Process'
    ].indexOf(event.key) !== -1) return;

    if (event.key.indexOf('Arrow') === 0 || /^F\d{1,2}$/.test(event.key)) return;

    if (event.key === ' ') event.preventDefault();
    if (event.key.length !== 1) return;

    var capsLock = event.getModifierState ? event.getModifierState('CapsLock') : false;
    state.capsLock = !!capsLock;
    updateCapsCue();

    var key = event.key;
    if (capsLock && /^[a-zñ]$/i.test(key)) {
      key = swapCase(key);
    }

    ensureAudio();
    handleInput(key, event.code, event.shiftKey);
  }

  function bindEvents() {
    dom.modeAula.addEventListener('click', function () {
      applyMode('aula');
      dom.srStatus.textContent = 'Modo Aula.';
    });

    dom.modeArcade.addEventListener('click', function () {
      applyMode('arcade');
      dom.srStatus.textContent = 'Modo Arcade.';
    });

    dom.btnSound.addEventListener('click', toggleSound);
    dom.btnVoice.addEventListener('click', toggleVoice);

    dom.btnHelp.addEventListener('click', function () {
      showDialog(dom.helpDialog, dom.helpDialog.querySelector('.btn--primary'));
    });

    dom.btnResetProgress.addEventListener('click', function () {
      var cancel = dom.resetDialog.querySelector('.dialog__actions .btn--soft');
      showDialog(dom.resetDialog, cancel);
    });

    dom.btnConfirmReset.addEventListener('click', resetProgress);
    dom.btnCalibrate.addEventListener('click', openCalibration);

    dom.btnCalibrateN.addEventListener('click', function () {
      setLayout('es-MX', 'Distribución española (Ñ) aplicada.', false);
      closeDialog(dom.calibrationDialog);
    });

    dom.btnCalibrateSemicolon.addEventListener('click', function () {
      setLayout('en-US', 'Distribución inglesa US (;) aplicada.', false);
      closeDialog(dom.calibrationDialog);
    });

    dom.layoutSelect.addEventListener('change', function () {
      setLayout(dom.layoutSelect.value, 'Distribución actualizada.', true);
    });

    dom.btnListen.addEventListener('click', function () {
      ensureAudio();
      announceTarget(true, true);
    });

    dom.btnHint.addEventListener('click', toggleHint);

    dom.btnRestart.addEventListener('click', function () {
      startExercise({ speak: false, focus: true });
      setCoach('Ejercicio reiniciado. Otra vez desde el principio.', 'happy');
      dom.srStatus.textContent = 'Ejercicio reiniciado.';
    });

    dom.btnSummaryRepeat.addEventListener('click', function () {
      state.summaryResolved = true;
      closeDialog(dom.summaryDialog);
      repeatExercise();
    });

    dom.btnSummaryNext.addEventListener('click', function () {
      state.summaryResolved = true;
      closeDialog(dom.summaryDialog);
      if (state.summaryAction === 'home') goHome();
      else advanceExercise();
    });

    var closeButtons = document.querySelectorAll('[data-close]');
    for (var index = 0; index < closeButtons.length; index += 1) {
      closeButtons[index].addEventListener('click', function () {
        var dialog = this.closest('dialog');
        if (dialog) closeDialog(dialog);
      });
    }

    [dom.summaryDialog, dom.calibrationDialog, dom.resetDialog, dom.helpDialog].forEach(function (dialog) {
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog && dialog !== dom.summaryDialog) closeDialog(dialog);
      });
    });

    dom.summaryDialog.addEventListener('close', function () {
      if (!state.summaryResolved) {
        state.summaryResolved = true;
        advanceExercise();
      } else {
        focusPractice();
      }
    });

    dom.calibrationDialog.addEventListener('close', function () {
      state.calibrating = false;
      focusPractice();
    });

    dom.resetDialog.addEventListener('close', focusPractice);
    dom.helpDialog.addEventListener('close', focusPractice);

    dom.practice.addEventListener('click', function (event) {
      if (!event.target.closest('button, a, select')) {
        dom.practice.focus({ preventScroll: true });
      }
    });

    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('beforeunload', saveState);
  }

  /* -----------------------------------------------------------------------
   * Boot
   * --------------------------------------------------------------------- */
  function init() {
    loadState();
    applyMode(state.mode, { skipSave: true });
    updateToggleButtons();
    bindEvents();
    startExercise({ speak: false, focus: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
