/* 保存データ（localStorage） */
(function (global) {
  'use strict';

  const KEY = 'typing-adventure-v1';

  function defaults() {
    return {
      settings: { lang: 'ja', romaji: true, keyboard: true, finger: true, sound: true, volume: 0.6 },
      progress: { ja: {}, en: {} }, // progress[lang]['w-s'] = { stars:[0,0,0], best:[null,null,null] }
      costume: null,
      stamps: {},                    // stamps[id] = 'YYYY-MM-DD'
      plays: 0,
      lastPlay: null,
      streak: 0,
      custom: []                     // { id, lang, text, kana }
    };
  }

  let data = defaults();

  function merge(base, saved) {
    Object.keys(saved || {}).forEach(function (k) {
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && saved[k] && typeof saved[k] === 'object') {
        merge(base[k], saved[k]);
      } else {
        base[k] = saved[k];
      }
    });
    return base;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      data = raw ? merge(defaults(), JSON.parse(raw)) : defaults();
    } catch (e) {
      data = defaults();
    }
    return data;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* 容量不足などは無視 */ }
  }

  function reset() {
    data = defaults();
    save();
  }

  function stageKey(w, s) { return w + '-' + s; }

  function stage(lang, w, s) {
    return data.progress[lang][stageKey(w, s)] || { stars: [0, 0, 0], best: [null, null, null] };
  }

  function stageMaxStars(lang, w, s) {
    return Math.max.apply(null, stage(lang, w, s).stars);
  }

  function isCleared(lang, w, s) { return stageMaxStars(lang, w, s) > 0; }

  function isUnlocked(lang, w, s) {
    const k = w * 3 + s;
    if (k === 0) return true;
    const pw = Math.floor((k - 1) / 3), ps = (k - 1) % 3;
    return isCleared(lang, pw, ps);
  }

  function totalStars() {
    let sum = 0;
    ['ja', 'en'].forEach(function (lang) {
      Object.keys(data.progress[lang]).forEach(function (k) {
        data.progress[lang][k].stars.forEach(function (n) { sum += n; });
      });
    });
    return sum;
  }

  function recordResult(lang, w, s, diff, stars, time) {
    const k = stageKey(w, s);
    const st = data.progress[lang][k] || { stars: [0, 0, 0], best: [null, null, null] };
    const newBest = st.best[diff] === null || time < st.best[diff];
    if (stars > st.stars[diff]) st.stars[diff] = stars;
    if (newBest) st.best[diff] = time;
    data.progress[lang][k] = st;
    save();
    return { newBest: newBest };
  }

  function dateStr(d) {
    const z = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }

  // プレイ回数と連続日数を更新
  function countPlay() {
    const now = new Date();
    const today = dateStr(now);
    const y = new Date(now); y.setDate(now.getDate() - 1);
    if (data.lastPlay !== today) {
      data.streak = data.lastPlay === dateStr(y) ? data.streak + 1 : 1;
      data.lastPlay = today;
    }
    data.plays += 1;
    save();
  }

  function addStamp(id) {
    if (data.stamps[id]) return false;
    data.stamps[id] = dateStr(new Date());
    save();
    return true;
  }

  global.Store = {
    load: load, save: save, reset: reset,
    get data() { return data; },
    stage: stage, stageMaxStars: stageMaxStars, isCleared: isCleared, isUnlocked: isUnlocked,
    totalStars: totalStars, recordResult: recordResult, countPlay: countPlay, addStamp: addStamp
  };
})(this);
