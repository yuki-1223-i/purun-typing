/* 効果音（Web Audio API で生成） */
(function (global) {
  'use strict';

  let ctx = null;
  let enabled = true;
  let volume = 0.6;

  function ensure() {
    if (!ctx) {
      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // 1音鳴らす
  function tone(freq, start, dur, type, vol) {
    const c = ensure();
    if (!c || !enabled || volume <= 0) return;
    const t0 = c.currentTime + (start || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    const v = (vol || 0.3) * volume;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  const Sound = {
    unlock: ensure,
    setEnabled: function (on) { enabled = on; },
    setVolume: function (v) { volume = v; },
    key: function () { tone(1046, 0, 0.06, 'triangle', 0.18); },
    miss: function () { tone(330, 0, 0.12, 'sine', 0.25); tone(262, 0.07, 0.16, 'sine', 0.2); },
    word: function () { tone(784, 0, 0.1, 'triangle', 0.25); tone(1175, 0.08, 0.16, 'triangle', 0.25); },
    count: function (last) { tone(last ? 1046 : 659, 0, last ? 0.35 : 0.15, 'square', 0.12); },
    star: function (i) { tone([880, 1109, 1319][i] || 880, 0, 0.25, 'triangle', 0.3); tone(([880, 1109, 1319][i] || 880) * 2, 0.04, 0.2, 'sine', 0.12); },
    click: function () { tone(660, 0, 0.05, 'triangle', 0.15); },
    fanfare: function () {
      const notes = [523, 659, 784, 1046, 784, 1046];
      const times = [0, 0.12, 0.24, 0.36, 0.52, 0.64];
      notes.forEach(function (f, i) { tone(f, times[i], i === notes.length - 1 ? 0.6 : 0.16, 'triangle', 0.28); });
      tone(262, 0.36, 0.5, 'sine', 0.18);
      tone(392, 0.64, 0.6, 'sine', 0.18);
    },
    reward: function () {
      [1319, 1568, 2093].forEach(function (f, i) { tone(f, i * 0.09, 0.22, 'sine', 0.22); });
    }
  };

  global.Sound = Sound;
})(this);
