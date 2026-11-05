/* 画面遷移とゲーム進行 */
(function () {
  'use strict';

  const $ = function (id) { return document.getElementById(id); };
  const WORLDS = WORDS.WORLDS;
  const DIFF_NAMES = ['かんたん', 'ふつう', 'むずかしい'];
  const SPEED = [1.0, 1.5, 2.1]; // ★3の目安：1秒あたりのキー数
  const IS_TOUCH = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  // スタンプ・称号
  const STAMPS = [
    { id: 'first_clear', icon: '★', name: 'はじめての クリア', desc: 'ステージを はじめて クリアした' },
    { id: 'star3', icon: '✦', name: 'ほしみっつ', desc: 'はじめて ★3を とった' },
    { id: 'no_miss', icon: '◎', name: 'ノーミス', desc: 'ミス 0で クリアした' },
    { id: 'hard_clear', icon: '▲', name: 'がんばりや', desc: '「むずかしい」を クリアした' },
    { id: 'world_forest', icon: '♣', name: 'もりの たんけんか', desc: 'もりの ステージを ぜんぶ クリア' },
    { id: 'world_ocean', icon: '≈', name: 'うみの たんけんか', desc: 'うみの ステージを ぜんぶ クリア' },
    { id: 'world_town', icon: '■', name: 'まちの たんけんか', desc: 'まちの ステージを ぜんぶ クリア' },
    { id: 'world_space', icon: '☾', name: 'うちゅうの たんけんか', desc: 'うちゅうの ステージを ぜんぶ クリア' },
    { id: 'world_school', icon: '✎', name: 'がっこうの たんけんか', desc: 'がっこうの ステージを ぜんぶ クリア' },
    { id: 'all_clear', icon: '♛', name: 'だいぼうけんの ゆうしゃ', desc: 'ひとつの モードで ぜんぶの ステージを クリア' },
    { id: 'bilingual', icon: '⇄', name: 'ふたつの ことば', desc: 'にほんごと えいごの りょうほうで クリア' },
    { id: 'streak3', icon: '3', name: '3にち れんぞく', desc: '3にち つづけて あそんだ' },
    { id: 'streak7', icon: '7', name: '7にち れんぞく', desc: '7にち つづけて あそんだ' },
    { id: 'plays10', icon: '10', name: '10かい あそんだ', desc: 'ゲームを 10かい あそんだ' },
    { id: 'plays50', icon: '50', name: '50かい あそんだ', desc: 'ゲームを 50かい あそんだ' },
    { id: 'custom', icon: '✿', name: 'オリジナル もんだい', desc: '「じぶんの もんだい」で あそんだ' }
  ];

  let lang = 'ja';
  let game = null;

  // ---------- 共通 ----------
  function show(name) {
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    $('screen-' + name).classList.add('active');
    if (RENDER[name]) RENDER[name]();
    window.scrollTo(0, 0);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.add('hidden'); }, 2200);
  }

  function confirmBox(msg) {
    return new Promise(function (resolve) {
      $('confirm-msg').textContent = msg;
      $('modal-confirm').classList.remove('hidden');
      function done(v) {
        $('modal-confirm').classList.add('hidden');
        $('confirm-yes').onclick = $('confirm-no').onclick = null;
        resolve(v);
      }
      $('confirm-yes').onclick = function () { done(true); };
      $('confirm-no').onclick = function () { done(false); };
    });
  }

  function starsHtml(n, max) {
    let s = '';
    for (let i = 0; i < (max || 3); i++) s += '<span class="' + (i < n ? 'on' : '') + '">★</span>';
    return s;
  }

  function charaSvg(cls) { return Chara.svg(Store.data.costume, cls); }

  function applySettings() {
    const st = Store.data.settings;
    Sound.setEnabled(st.sound);
    Sound.setVolume(st.volume);
  }

  // ---------- 各画面の描画 ----------
  const RENDER = {
    title: function () { $('title-chara').innerHTML = charaSvg('bounce'); },

    map: function () {
      $('map-title').textContent = (lang === 'ja' ? 'にほんご' : 'えいご') + ' ・ ステージを えらぼう';
      $('map-stars').textContent = Store.totalStars();
      let html = '';
      WORLDS.forEach(function (w, wi) {
        html += '<div class="world world-' + w.id + '"><h3>' + (wi + 1) + '. ' + w.name + '</h3><div class="stages">';
        WORDS.STAGE_NAMES.forEach(function (sn, si) {
          const open = Store.isUnlocked(lang, wi, si);
          const st = Store.stage(lang, wi, si);
          html += '<button class="stage-btn' + (open ? '' : ' locked') + '" data-w="' + wi + '" data-s="' + si + '"' + (open ? '' : ' disabled') + '>' +
            '<span class="stage-no">' + (wi + 1) + '-' + (si + 1) + '</span>' +
            '<span class="stage-name">' + (open ? sn : 'まだ ひみつ') + '</span>' +
            '<span class="stage-stars">' + (open ? st.stars.map(function (n) { return '<i class="mini">' + starsHtml(n) + '</i>'; }).join('') : '<i class="lock">？</i>') + '</span>' +
            '</button>';
        });
        html += '</div></div>';
      });
      const customs = Store.data.custom.filter(function (c) { return c.lang === lang; });
      html += '<div class="world world-custom"><h3>じぶんの もんだい</h3><div class="stages">' +
        (customs.length
          ? '<button class="stage-btn" data-custom="1"><span class="stage-no">★</span><span class="stage-name">オリジナル（' + customs.length + 'もん）</span><span class="stage-stars"></span></button>'
          : '<p class="custom-empty">おうちの ひとに もんだいを つくって もらおう</p>') +
        '</div></div>';
      $('map').innerHTML = html;
    },

    dress: function () {
      const total = Store.totalStars();
      $('dress-stars').textContent = total;
      $('dress-preview').innerHTML = charaSvg('bounce');
      let html = '<button class="dress-item' + (!Store.data.costume ? ' selected' : '') + '" data-c="">' +
        '<span class="dress-thumb">' + Chara.svg(null) + '</span><span>なし</span></button>';
      Chara.COSTUMES.forEach(function (c) {
        const open = total >= c.need;
        html += '<button class="dress-item' + (open ? '' : ' locked') + (Store.data.costume === c.id ? ' selected' : '') + '" data-c="' + c.id + '"' + (open ? '' : ' disabled') + '>' +
          '<span class="dress-thumb">' + (open ? Chara.svg(c.id) : '<b>?</b>') + '</span>' +
          '<span>' + (open ? c.name : '★' + c.need + 'で かいほう') + '</span></button>';
      });
      $('dress-list').innerHTML = html;
    },

    stamps: function () {
      const got = Store.data.stamps;
      const n = STAMPS.filter(function (s) { return got[s.id]; }).length;
      $('stamp-count').textContent = n + ' / ' + STAMPS.length;
      $('stamp-list').innerHTML = STAMPS.map(function (s) {
        const has = !!got[s.id];
        return '<div class="stamp' + (has ? ' got' : '') + '"><div class="stamp-icon">' + (has ? esc(s.icon) : '?') + '</div>' +
          '<div class="stamp-name">' + (has ? s.name : '？？？') + '</div><div class="stamp-desc">' + s.desc + '</div>' +
          (has ? '<div class="stamp-date">' + got[s.id] + '</div>' : '') + '</div>';
      }).join('');
    },

    settings: function () {
      const st = Store.data.settings;
      $('set-romaji').checked = st.romaji;
      $('set-keyboard').checked = st.keyboard;
      $('set-finger').checked = st.finger;
      $('set-sound').checked = st.sound;
      $('set-volume').value = st.volume;
    },

    custom: function () {
      const list = Store.data.custom;
      $('custom-list').innerHTML = list.length ? list.map(function (c) {
        return '<li><span class="cu-lang">' + (c.lang === 'ja' ? '日' : '英') + '</span><span class="cu-text">' + esc(c.text) +
          (c.lang === 'ja' && c.kana !== c.text ? '<small>（' + esc(c.kana) + '）</small>' : '') + '</span>' +
          '<button class="btn btn-mini" data-del="' + c.id + '">削除</button></li>';
      }).join('') : '<li class="empty">まだ登録されていません</li>';
      $('cu-kana-wrap').style.display = $('cu-lang').value === 'ja' ? '' : 'none';
    }
  };

  // ---------- 難易度選択 ----------
  function openDiff(wi, si) {
    const w = WORLDS[wi];
    $('diff-title').textContent = (wi + 1) + '-' + (si + 1) + '  ' + w.short + 'の ' + WORDS.STAGE_NAMES[si];
    const st = Store.stage(lang, wi, si);
    $('diff-btns').innerHTML = DIFF_NAMES.map(function (d, di) {
      return '<button class="diff-btn diff-' + di + '" data-d="' + di + '"><span class="diff-name">' + d + '</span>' +
        '<span class="diff-stars">' + starsHtml(st.stars[di]) + '</span>' +
        '<span class="diff-best">' + (st.best[di] !== null ? 'ベスト ' + st.best[di].toFixed(1) + 'びょう' : 'まだ あそんでいない') + '</span></button>';
    }).join('');
    $('diff-btns').onclick = function (e) {
      const b = e.target.closest('.diff-btn');
      if (!b) return;
      $('modal-diff').classList.add('hidden');
      startGame({ world: wi, stage: si, diff: +b.dataset.d });
    };
    $('modal-diff').classList.remove('hidden');
  }

  // ---------- ゲーム本体 ----------
  function startGame(opt) {
    Sound.unlock();
    let prompts, sceneId, title;
    if (opt.custom) {
      const pool = Store.data.custom.filter(function (c) { return c.lang === lang; });
      prompts = WORDS.shuffle(pool).slice(0, 8).map(function (c) { return { text: c.text, kana: c.kana }; });
      sceneId = 'custom';
      title = 'じぶんの もんだい';
      opt.diff = 1;
    } else {
      prompts = WORDS.pick(opt.world, opt.stage, opt.diff, lang);
      sceneId = WORLDS[opt.world].id;
      title = (opt.world + 1) + '-' + (opt.stage + 1) + ' ' + WORLDS[opt.world].short + 'の ' + WORDS.STAGE_NAMES[opt.stage] + '（' + DIFF_NAMES[opt.diff] + '）';
    }

    // 各問題の入力単位を作る
    prompts.forEach(function (p) {
      p.units = lang === 'ja' ? Kana.tokenize(p.kana) : Kana.plainUnits(p.text);
    });
    // ★3の目標タイム（おすすめの打ち方の文字数から計算）
    const chars = prompts.reduce(function (sum, p) { return sum + new Kana.Matcher(p.units).display()[1].length; }, 0);
    const target = Math.ceil(chars / SPEED[opt.diff] + prompts.length * 1.0);

    game = {
      opt: opt, prompts: prompts, idx: 0, matcher: null,
      correct: 0, miss: 0, start: 0, running: false, timer: null, target: target, finished: false
    };

    $('game-title').textContent = title;
    $('scene-bg').innerHTML = Scenery.render(sceneId);
    $('game-chara').innerHTML = charaSvg();
    $('game-time').textContent = '0.0';
    $('game-miss').textContent = '0';
    $('ime-warn').classList.add('hidden');

    const st = Store.data.settings;
    const showKb = st.keyboard || IS_TOUCH;
    $('keyboard').style.display = showKb ? '' : 'none';
    $('hands').style.display = st.finger ? '' : 'none';
    $('finger-label').style.display = st.finger ? '' : 'none';
    $('guide').style.display = (showKb || st.finger) ? '' : 'none';

    show('game');
    loadPrompt();
    moveRunner();
    countdown();
  }

  function countdown() {
    const el = $('countdown');
    let n = 3;
    el.classList.add('show');
    function step() {
      if (!game) return;
      if (n > 0) {
        el.textContent = n;
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
        Sound.count(false);
        n -= 1;
        game.timer = setTimeout(step, 700);
      } else {
        el.textContent = 'スタート！';
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
        Sound.count(true);
        game.running = true;
        game.start = performance.now();
        tick();
        game.timer = setTimeout(function () { el.classList.remove('show'); }, 600);
      }
    }
    step();
  }

  function tick() {
    if (!game || !game.running) return;
    $('game-time').textContent = ((performance.now() - game.start) / 1000).toFixed(1);
    requestAnimationFrame(tick);
  }

  function loadPrompt() {
    const p = game.prompts[game.idx];
    game.matcher = new Kana.Matcher(p.units);
    $('prompt-count').textContent = (game.idx + 1) + ' / ' + game.prompts.length;
    $('prompt').classList.remove('next-in'); void $('prompt').offsetWidth; $('prompt').classList.add('next-in');
    renderPrompt(false);
  }

  function renderPrompt(missed) {
    const p = game.prompts[game.idx];
    const m = game.matcher;
    const st = Store.data.settings;
    if (lang === 'ja') {
      // 打ち終わった「かな」の文字数
      let kanaDone = 0;
      for (let i = 0; i < m.idx; i++) kanaDone += m.units[i].kana.length;
      const kana = p.units.map(function (u) { return u.kana; }).join('');
      const kanaHtml = '<span class="done">' + esc(kana.slice(0, kanaDone)) + '</span>' + esc(kana.slice(kanaDone));
      if (p.text !== p.kana) {
        $('prompt-kana').innerHTML = kanaHtml;
        $('prompt-text').innerHTML = esc(p.text);
      } else {
        $('prompt-kana').innerHTML = '';
        $('prompt-text').innerHTML = '<span class="done">' + esc(p.text.slice(0, kanaDone)) + '</span>' + esc(p.text.slice(kanaDone));
      }
      const d = m.display();
      $('prompt-romaji').style.visibility = st.romaji ? '' : 'hidden';
      $('prompt-romaji').innerHTML = '<span class="done">' + esc(d[0]) + '</span>' +
        (d[1] ? '<span class="cur' + (missed ? ' miss' : '') + '">' + esc(d[1][0]) + '</span>' + esc(d[1].slice(1)) : '');
    } else {
      const done = m.idx;
      const t = p.text;
      $('prompt-kana').innerHTML = '';
      $('prompt-text').innerHTML = '<span class="done">' + esc(t.slice(0, done)) + '</span>' +
        (done < t.length ? '<span class="cur' + (missed ? ' miss' : '') + '">' + (t[done] === ' ' ? '&nbsp;' : esc(t[done])) + '</span>' + esc(t.slice(done + 1)) : '');
      $('prompt-romaji').innerHTML = '';
    }
    Keyboard.highlight(m.done ? '' : m.nextKey(), missed);
  }

  function moveRunner() {
    const n = game.prompts.length;
    const prog = Math.min(1, (game.idx + (game.matcher ? game.matcher.progress() : 0)) / n);
    $('runner').style.left = (3 + prog * 83) + '%';
  }

  function handleKey(key) {
    if (!game || !game.running || game.finished) return;
    const r = game.matcher.input(key);
    const chara = $('game-chara');
    if (r === 'ok') {
      game.correct += 1;
      Sound.key();
      chara.classList.add('running');
      clearTimeout(handleKey._run);
      handleKey._run = setTimeout(function () { chara.classList.remove('running'); }, 350);
      if (game.matcher.done) {
        Sound.word();
        game.idx += 1;
        if (game.idx >= game.prompts.length) {
          moveRunner();
          finish();
          return;
        }
        loadPrompt();
      } else {
        renderPrompt(false);
      }
      moveRunner();
    } else {
      game.miss += 1;
      $('game-miss').textContent = game.miss;
      Sound.miss();
      chara.classList.remove('stumble'); void chara.offsetWidth; chara.classList.add('stumble');
      renderPrompt(true);
    }
  }

  function onKeyDown(e) {
    if (!$('screen-game').classList.contains('active')) return;
    if (e.key === 'Escape') { quitGame(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.isComposing || e.key === 'Process' || e.keyCode === 229) {
      $('ime-warn').classList.remove('hidden');
      return;
    }
    if (e.key.length !== 1) return;
    e.preventDefault();
    $('ime-warn').classList.add('hidden');
    handleKey(e.key);
  }

  async function quitGame() {
    if (!game || game.finished) return;
    const wasRunning = game.running;
    game.running = false;
    const pausedAt = performance.now();
    const ok = await confirmBox('ゲームを やめて マップに もどる？');
    if (!game) return;
    if (ok) {
      clearTimeout(game.timer);
      $('countdown').classList.remove('show');
      game = null;
      show('map');
    } else if (wasRunning) {
      game.start += performance.now() - pausedAt; // 止めていた時間は数えない
      game.running = true;
      tick();
    } else {
      // カウントダウン中だった場合はやり直し
      clearTimeout(game.timer);
      countdown();
    }
  }

  function calcStars(acc, time, target) {
    if (acc >= 0.95 && time <= target) return 3;
    if (acc >= 0.8) return 2;
    return 1;
  }

  function finish() {
    game.running = false;
    game.finished = true;
    const time = Math.round((performance.now() - game.start) / 100) / 10;
    const acc = game.correct / Math.max(1, game.correct + game.miss);
    const stars = calcStars(acc, time, game.target);
    const opt = game.opt;
    $('game-time').textContent = time.toFixed(1);
    Keyboard.highlight('');
    $('game-chara').classList.add('happy');

    const beforeStars = Store.totalStars();
    let newBest = false;
    if (!opt.custom) newBest = Store.recordResult(lang, opt.world, opt.stage, opt.diff, stars, time).newBest;
    Store.countPlay();
    const afterStars = Store.totalStars();

    // スタンプ判定
    const newStamps = [];
    function stamp(id, cond) { if (cond && Store.addStamp(id)) newStamps.push(id); }
    const d = Store.data;
    stamp('first_clear', true);
    stamp('star3', stars === 3);
    stamp('no_miss', game.miss === 0);
    stamp('hard_clear', opt.diff === 2 && !opt.custom);
    stamp('custom', !!opt.custom);
    WORLDS.forEach(function (w, wi) {
      stamp('world_' + w.id, ['ja', 'en'].some(function (l) {
        return [0, 1, 2].every(function (si) { return Store.isCleared(l, wi, si); });
      }));
    });
    stamp('all_clear', ['ja', 'en'].some(function (l) {
      return WORLDS.every(function (w, wi) { return [0, 1, 2].every(function (si) { return Store.isCleared(l, wi, si); }); });
    }));
    function anyCleared(l) { return WORLDS.some(function (w, wi) { return [0, 1, 2].some(function (si) { return Store.isCleared(l, wi, si); }); }); }
    stamp('bilingual', anyCleared('ja') && anyCleared('en'));
    stamp('streak3', d.streak >= 3);
    stamp('streak7', d.streak >= 7);
    stamp('plays10', d.plays >= 10);
    stamp('plays50', d.plays >= 50);

    const newCostumes = Chara.COSTUMES.filter(function (c) { return beforeStars < c.need && afterStars >= c.need; });

    const result = { time: time, acc: acc, stars: stars, newBest: newBest, newStamps: newStamps, newCostumes: newCostumes };
    setTimeout(function () { showResult(result); }, 900);
  }

  function showResult(r) {
    const opt = game.opt;
    show('result');
    $('result-chara').innerHTML = charaSvg('bounce');
    $('res-time').textContent = r.time.toFixed(1) + ' びょう' + (r.newBest ? '  ベスト！' : '');
    $('res-acc').textContent = Math.round(r.acc * 100) + ' %';
    $('res-miss').textContent = game.miss + ' かい';
    $('res-hint').textContent = r.stars < 3
      ? '★3の めやす：せいかくさ 95% いじょう ＆ ' + game.target + 'びょう いない'
      : 'すごい！ ★3 だよ！';

    const starEls = $('result-stars').children;
    for (let i = 0; i < 3; i++) starEls[i].className = '';
    Sound.fanfare();
    for (let i = 0; i < r.stars; i++) {
      (function (i) {
        setTimeout(function () { starEls[i].className = 'on pop'; Sound.star(i); }, 700 + i * 380);
      })(i);
    }

    let rewards = '';
    r.newCostumes.forEach(function (c) {
      rewards += '<div class="reward"><span class="reward-thumb">' + Chara.svg(c.id) + '</span>あたらしい きせかえ「' + c.name + '」を ゲット！</div>';
    });
    r.newStamps.forEach(function (id) {
      const s = STAMPS.find(function (x) { return x.id === id; });
      rewards += '<div class="reward"><span class="stamp-icon small">' + esc(s.icon) + '</span>スタンプ「' + s.name + '」を ゲット！</div>';
    });
    $('res-rewards').innerHTML = rewards;
    if (rewards) setTimeout(Sound.reward, 700 + r.stars * 380 + 200);

    // 「つぎへ」ボタン
    let next = null;
    if (!opt.custom) {
      const k = opt.world * 3 + opt.stage + 1;
      if (k < 15) next = { world: Math.floor(k / 3), stage: k % 3, diff: opt.diff };
    }
    $('btn-next').style.display = next ? '' : 'none';
    $('btn-next').onclick = function () { if (next) startGame(next); };
    $('btn-retry').onclick = function () { startGame(Object.assign({}, opt)); };
  }

  // ---------- おうちの方向け：長押しで入る ----------
  function setupHold() {
    const btn = $('btn-admin');
    let timer = null;
    function cancel() { clearTimeout(timer); btn.classList.remove('holding'); }
    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      btn.classList.add('holding');
      timer = setTimeout(function () { cancel(); show('custom'); }, 2000);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { btn.addEventListener(ev, cancel); });
    btn.addEventListener('click', function () { if (!btn.classList.contains('holding')) toast('2びょう ながおし してね'); });
  }

  function validateCustom(lng, text, kana) {
    if (!text) return '表示する文字を入力してください。';
    if (lng === 'en') {
      if (!/^[A-Za-z][A-Za-z .,]*$/.test(text)) return '英語は半角の英字・スペース・「,」「.」のみ使えます。';
      return '';
    }
    if (!kana) kana = text;
    if (!/^[ぁ-ゔァ-ヴー、。]+$/.test(kana)) return '読みは ひらがな・カタカナ で入力してください。';
    const units = Kana.tokenize(kana);
    const m = new Kana.Matcher(units);
    const s = m.display()[1];
    for (let i = 0; i < s.length; i++) if (m.input(s[i]) !== 'ok') return 'この読みはローマ字で入力できない組み合わせを含んでいます。';
    if (!m.done) return '読みの最後が入力できない形になっています（例：「っ」で終わる）。';
    return '';
  }

  // ---------- イベント ----------
  function bind() {
    document.addEventListener('click', function (e) {
      const go = e.target.closest('[data-go]');
      if (go) { Sound.unlock(); Sound.click(); show(go.dataset.go); }
    });

    document.querySelectorAll('.mode-card').forEach(function (b) {
      b.addEventListener('click', function () {
        Sound.unlock(); Sound.click();
        lang = b.dataset.lang;
        Store.data.settings.lang = lang;
        Store.save();
        show('map');
      });
    });

    $('map').addEventListener('click', function (e) {
      const b = e.target.closest('.stage-btn');
      if (!b || b.disabled) return;
      Sound.click();
      if (b.dataset.custom) startGame({ custom: true });
      else openDiff(+b.dataset.w, +b.dataset.s);
    });
    $('diff-cancel').addEventListener('click', function () { $('modal-diff').classList.add('hidden'); });

    $('btn-quit').addEventListener('click', quitGame);
    $('btn-tomap').addEventListener('click', function () { game = null; show('map'); });
    document.addEventListener('keydown', onKeyDown);

    $('dress-list').addEventListener('click', function (e) {
      const b = e.target.closest('.dress-item');
      if (!b || b.disabled) return;
      Sound.click();
      Store.data.costume = b.dataset.c || null;
      Store.save();
      RENDER.dress();
    });

    // 設定
    [['set-romaji', 'romaji'], ['set-keyboard', 'keyboard'], ['set-finger', 'finger'], ['set-sound', 'sound']].forEach(function (p) {
      $(p[0]).addEventListener('change', function () {
        Store.data.settings[p[1]] = $(p[0]).checked;
        Store.save(); applySettings();
      });
    });
    $('set-volume').addEventListener('input', function () {
      Store.data.settings.volume = parseFloat($('set-volume').value);
      Store.save(); applySettings();
    });
    $('set-volume').addEventListener('change', function () { Sound.key(); });
    $('btn-reset').addEventListener('click', async function () {
      if (await confirmBox('★、きせかえ、スタンプ、オリジナル もんだい など、きろくを ぜんぶ けします。ほんとうに いい？')) {
        Store.reset(); applySettings(); RENDER.settings(); toast('きろくを けしました');
      }
    });

    // オリジナル問題
    setupHold();
    $('cu-lang').addEventListener('change', RENDER.custom);
    $('custom-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const lng = $('cu-lang').value;
      const text = $('cu-text').value.trim();
      let kana = lng === 'ja' ? ($('cu-kana').value.trim() || text) : text;
      const err = validateCustom(lng, text, kana);
      $('cu-error').textContent = err;
      if (err) return;
      Store.data.custom.push({ id: Date.now().toString(36), lang: lng, text: text, kana: kana });
      Store.save();
      $('cu-text').value = ''; $('cu-kana').value = '';
      RENDER.custom();
      toast('登録しました');
    });
    $('custom-list').addEventListener('click', function (e) {
      const b = e.target.closest('[data-del]');
      if (!b) return;
      Store.data.custom = Store.data.custom.filter(function (c) { return c.id !== b.dataset.del; });
      Store.save();
      RENDER.custom();
    });
  }

  // ---------- 起動 ----------
  Store.load();
  lang = Store.data.settings.lang || 'ja';
  applySettings();
  Keyboard.build($('keyboard'), $('hands'), $('finger-label'), handleKey);
  bind();
  RENDER.title();
})();
