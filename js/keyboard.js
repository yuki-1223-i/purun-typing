/* 画面上のキーボードと指のガイド */
(function (global) {
  'use strict';

  const ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    [' ']
  ];

  // 0:ひだりこゆび 1:ひだりくすりゆび 2:ひだりなかゆび 3:ひだりひとさしゆび 4:おやゆび
  // 5:みぎひとさしゆび 6:みぎなかゆび 7:みぎくすりゆび 8:みぎこゆび
  const FINGER = {};
  [['1qaz', 0], ['2wsx', 1], ['3edc', 2], ['45rtfgvb', 3], ['67yuhjnm', 5], ['8ik,', 6], ['9ol.', 7], ['0-p;/\'', 8]]
    .forEach(function (p) { p[0].split('').forEach(function (k) { FINGER[k] = p[1]; }); });
  FINGER[' '] = 4;

  const FINGER_NAMES = ['ひだりての こゆび', 'ひだりての くすりゆび', 'ひだりての なかゆび', 'ひだりての ひとさしゆび',
    'おやゆび', 'みぎての ひとさしゆび', 'みぎての なかゆび', 'みぎての くすりゆび', 'みぎての こゆび'];

  let kbEl = null, handsEl = null, labelEl = null, onTap = null;

  function build(kbContainer, handsContainer, label, tapHandler) {
    kbEl = kbContainer; handsEl = handsContainer; labelEl = label; onTap = tapHandler;
    kbEl.innerHTML = ROWS.map(function (row, ri) {
      return '<div class="kb-row kb-row-' + ri + '">' + row.map(function (k) {
        const cls = 'kb-key f' + FINGER[k] + (k === ' ' ? ' kb-space' : '') + (k === 'f' || k === 'j' ? ' kb-home' : '');
        return '<button type="button" class="' + cls + '" data-key="' + (k === ' ' ? 'space' : k) + '" tabindex="-1">' +
          (k === ' ' ? 'スペース' : k.toUpperCase()) + '</button>';
      }).join('') + '</div>';
    }).join('');

    kbEl.addEventListener('pointerdown', function (e) {
      const btn = e.target.closest('.kb-key');
      if (!btn) return;
      e.preventDefault();
      const k = btn.dataset.key === 'space' ? ' ' : btn.dataset.key;
      btn.classList.add('pressed');
      setTimeout(function () { btn.classList.remove('pressed'); }, 120);
      if (onTap) onTap(k);
    });

    handsEl.innerHTML = handsSvg();
  }

  // 左右の手（指ごとに丸い棒）
  function handsSvg() {
    // [x, 高さ, 指番号]
    const left = [[14, 44, 0], [34, 56, 1], [54, 62, 2], [74, 56, 3]];
    const right = [[146, 56, 5], [166, 62, 6], [186, 56, 7], [206, 44, 8]];
    function finger(f) {
      return '<rect class="finger fg' + f[2] + '" x="' + (f[0] - 8) + '" y="' + (78 - f[1]) + '" width="16" height="' + (f[1] + 10) + '" rx="8"/>';
    }
    return '<svg viewBox="0 0 220 110" class="hands-svg" aria-hidden="true">' +
      '<rect class="palm" x="4" y="66" width="82" height="40" rx="18"/>' +
      '<rect class="palm" x="134" y="66" width="82" height="40" rx="18"/>' +
      left.map(finger).join('') + right.map(finger).join('') +
      '<rect class="finger fg4" x="88" y="74" width="16" height="30" rx="8" transform="rotate(-50 96 89)"/>' +
      '<rect class="finger fg4" x="116" y="74" width="16" height="30" rx="8" transform="rotate(50 124 89)"/>' +
      '</svg>';
  }

  function highlight(key, missed) {
    if (!kbEl) return;
    kbEl.querySelectorAll('.kb-key.next, .kb-key.miss').forEach(function (el) { el.classList.remove('next', 'miss'); });
    handsEl.querySelectorAll('.finger.on').forEach(function (el) { el.classList.remove('on'); });
    if (!key) { if (labelEl) labelEl.textContent = ''; return; }
    const k = key.toLowerCase();
    const sel = '.kb-key[data-key="' + (k === ' ' ? 'space' : (k === '"' ? '\\"' : k)) + '"]';
    const btn = kbEl.querySelector(sel);
    if (btn) btn.classList.add(missed ? 'miss' : 'next');
    const f = FINGER[k];
    if (f !== undefined) {
      handsEl.querySelectorAll('.fg' + f).forEach(function (el) { el.classList.add('on'); });
      if (labelEl) labelEl.textContent = FINGER_NAMES[f] + 'で「' + (k === ' ' ? 'スペース' : k.toUpperCase()) + '」';
    } else if (labelEl) {
      labelEl.textContent = '';
    }
  }

  global.Keyboard = { build: build, highlight: highlight };
})(this);
