/*
 * ローマ字判定エンジン
 * ひらがな文字列を「入力単位(unit)」に分け、各単位で受け付けるローマ字の候補を持つ。
 * 例：「しゃ」→ sha / sya / shixya ... 、「っか」→ kka / xtuka ...
 */
(function (global) {
  'use strict';

  // 1文字の候補（先頭が画面に表示される「おすすめの打ち方」）
  const SINGLE = {
    'あ': ['a'], 'い': ['i', 'yi'], 'う': ['u', 'wu', 'whu'], 'え': ['e'], 'お': ['o'],
    'か': ['ka', 'ca'], 'き': ['ki'], 'く': ['ku', 'cu', 'qu'], 'け': ['ke'], 'こ': ['ko', 'co'],
    'さ': ['sa'], 'し': ['shi', 'si', 'ci'], 'す': ['su'], 'せ': ['se', 'ce'], 'そ': ['so'],
    'た': ['ta'], 'ち': ['chi', 'ti'], 'つ': ['tsu', 'tu'], 'て': ['te'], 'と': ['to'],
    'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
    'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
    'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
    'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
    'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
    'わ': ['wa'], 'を': ['wo'],
    'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
    'ざ': ['za'], 'じ': ['ji', 'zi'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
    'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
    'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
    'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
    'ゔ': ['vu'],
    'ぁ': ['xa', 'la'], 'ぃ': ['xi', 'li'], 'ぅ': ['xu', 'lu'], 'ぇ': ['xe', 'le'], 'ぉ': ['xo', 'lo'],
    'ゃ': ['xya', 'lya'], 'ゅ': ['xyu', 'lyu'], 'ょ': ['xyo', 'lyo'], 'ゎ': ['xwa', 'lwa'],
    'っ': ['xtu', 'ltu', 'xtsu', 'ltsu'],
    'ー': ['-'], '、': [','], '。': ['.'], '　': [' '], ' ': [' '],
    '！': ['!'], '？': ['?']
  };

  // 2文字の組み合わせ（まとめて打てる形）。分けて打つ形は自動で追加する。
  const COMBO = {
    'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'], 'きぇ': ['kye'],
    'しゃ': ['sha', 'sya'], 'しゅ': ['shu', 'syu'], 'しょ': ['sho', 'syo'], 'しぇ': ['she', 'sye'],
    'ちゃ': ['cha', 'tya', 'cya'], 'ちゅ': ['chu', 'tyu', 'cyu'], 'ちょ': ['cho', 'tyo', 'cyo'], 'ちぇ': ['che', 'tye', 'cye'],
    'にゃ': ['nya'], 'にゅ': ['nyu'], 'にょ': ['nyo'],
    'ひゃ': ['hya'], 'ひゅ': ['hyu'], 'ひょ': ['hyo'],
    'みゃ': ['mya'], 'みゅ': ['myu'], 'みょ': ['myo'],
    'りゃ': ['rya'], 'りゅ': ['ryu'], 'りょ': ['ryo'],
    'ぎゃ': ['gya'], 'ぎゅ': ['gyu'], 'ぎょ': ['gyo'],
    'じゃ': ['ja', 'zya', 'jya'], 'じゅ': ['ju', 'zyu', 'jyu'], 'じょ': ['jo', 'zyo', 'jyo'], 'じぇ': ['je', 'zye', 'jye'],
    'ぢゃ': ['dya'], 'ぢゅ': ['dyu'], 'ぢょ': ['dyo'],
    'びゃ': ['bya'], 'びゅ': ['byu'], 'びょ': ['byo'],
    'ぴゃ': ['pya'], 'ぴゅ': ['pyu'], 'ぴょ': ['pyo'],
    'ふぁ': ['fa'], 'ふぃ': ['fi'], 'ふぇ': ['fe'], 'ふぉ': ['fo'], 'ふゅ': ['fyu'],
    'てぃ': ['thi'], 'でぃ': ['dhi'], 'でゅ': ['dhu'], 'とぅ': ['twu'], 'どぅ': ['dwu'],
    'うぃ': ['wi', 'whi'], 'うぇ': ['we', 'whe'], 'うぉ': ['who'],
    'ゔぁ': ['va'], 'ゔぃ': ['vi'], 'ゔぇ': ['ve'], 'ゔぉ': ['vo'],
    'つぁ': ['tsa'], 'つぃ': ['tsi'], 'つぇ': ['tse'], 'つぉ': ['tso'],
    'いぇ': ['ye']
  };

  const N_OPTIONS = ['nn', 'xn', "n'"];

  function toHiragana(str) {
    return str.replace(/[ァ-ヶ]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    });
  }

  function uniq(arr) {
    return arr.filter(function (v, i) { return arr.indexOf(v) === i; });
  }

  // ひらがな → 入力単位の配列
  function tokenize(kana) {
    const s = toHiragana(kana);
    const raw = [];
    let i = 0;
    while (i < s.length) {
      const two = s.substr(i, 2);
      if (two.length === 2 && COMBO[two]) {
        const split = [];
        SINGLE[two[0]].forEach(function (a) {
          SINGLE[two[1]].forEach(function (b) { split.push(a + b); });
        });
        raw.push({ kana: two, options: uniq(COMBO[two].concat(split)) });
        i += 2;
        continue;
      }
      const ch = s[i];
      if (ch === 'ん') {
        raw.push({ kana: 'ん', options: null }); // 後で次の文字を見て決める
      } else if (SINGLE[ch]) {
        raw.push({ kana: ch, options: SINGLE[ch].slice() });
      } else {
        // 英数字や記号などはそのまま
        raw.push({ kana: ch, options: [ch.toLowerCase()] });
      }
      i += 1;
    }

    // 後ろから処理して「ん」「っ」を確定させる
    const units = [];
    for (let j = raw.length - 1; j >= 0; j--) {
      const u = raw[j];
      const next = units[0];
      if (u.kana === 'ん') {
        const opts = N_OPTIONS.slice();
        // 次が母音・や行・な行・「ん」でなければ n 1つでOK
        if (next && next.options.every(function (o) { return !/^[aiueoyn']/.test(o); })) {
          opts.unshift('n');
        }
        units.unshift({ kana: 'ん', options: opts });
      } else if (u.kana === 'っ' && next && next.options.some(function (o) { return /^[bcdfghjklmpqrstvwxz]/.test(o) && !/^x|^l[aiueoyw]/.test(o); })) {
        // 次の子音を重ねる形と、xtu などで単独入力する形を合成して1単位にする
        const opts = [];
        next.options.forEach(function (o) {
          if (/^[bcdfghjkmpqrstvwz]/.test(o)) {
            opts.push(o[0] + o);
            if (o.indexOf('ch') === 0) opts.push('t' + o);
          }
        });
        SINGLE['っ'].forEach(function (x) {
          next.options.forEach(function (o) { opts.push(x + o); });
        });
        units[0] = { kana: 'っ' + next.kana, options: uniq(opts) };
      } else {
        units.unshift(u);
      }
    }
    return units;
  }

  /*
   * 入力を判定するクラス
   *   new Matcher(units)
   *   .input(key) → 'ok' | 'miss'
   *   .done  → すべて打ち終わったか
   */
  function Matcher(units) {
    this.units = units;
    this.idx = 0;
    this.buf = '';
    this.typed = []; // 確定した単位ごとの実際の入力
    this.done = units.length === 0;
  }

  Matcher.prototype._finishUnit = function () {
    this.typed.push(this.buf);
    this.idx += 1;
    this.buf = '';
    if (this.idx >= this.units.length) this.done = true;
  };

  Matcher.prototype.input = function (key) {
    if (this.done) return 'miss';
    key = key.toLowerCase();
    const opts = this.units[this.idx].options;
    const nb = this.buf + key;
    const cands = opts.filter(function (o) { return o.indexOf(nb) === 0; });
    if (cands.length > 0) {
      this.buf = nb;
      const exact = cands.indexOf(nb) >= 0;
      const longer = cands.some(function (o) { return o.length > nb.length; });
      if (exact && !longer) this._finishUnit();
      // 最後の単位で exact かつ longer（例：最後の「ん」を n だけ）はありえないよう tokenize 側で保証
      return 'ok';
    }
    // 保留中（例：「ん」を n まで打った）なら確定して次の単位で判定し直す
    if (this.buf && opts.indexOf(this.buf) >= 0) {
      const saved = { idx: this.idx, buf: this.buf, typedLen: this.typed.length, done: this.done };
      this._finishUnit();
      if (!this.done && this.input(key) === 'ok') return 'ok';
      // 次の単位でもダメなら元に戻す
      this.idx = saved.idx; this.buf = saved.buf; this.done = saved.done;
      this.typed.length = saved.typedLen;
    }
    return 'miss';
  };

  // 画面表示用：[打ったローマ字, これから打つローマ字]
  Matcher.prototype.display = function () {
    const typed = this.typed.join('') + this.buf;
    let rest = '';
    if (!this.done) {
      const buf = this.buf;
      const cur = this.units[this.idx].options.find(function (o) { return o.indexOf(buf) === 0; });
      rest += cur.slice(buf.length);
      for (let i = this.idx + 1; i < this.units.length; i++) rest += this.units[i].options[0];
    }
    return [typed, rest];
  };

  // 次に押すべきキー（保留中なら次の単位の先頭）
  Matcher.prototype.nextKey = function () {
    const r = this.display()[1];
    if (r) return r[0];
    if (!this.done && this.idx + 1 < this.units.length) return this.units[this.idx + 1].options[0][0];
    return '';
  };

  // 進み具合 0〜1（ローマ字の文字数ベース）
  Matcher.prototype.progress = function () {
    const d = this.display();
    const total = d[0].length + d[1].length;
    return total ? d[0].length / total : 1;
  };

  // 英語用：1文字ずつそのまま
  function plainUnits(text) {
    return Array.from(text).map(function (ch) { return { kana: ch, options: [ch.toLowerCase()] }; });
  }

  const api = { tokenize: tokenize, plainUnits: plainUnits, Matcher: Matcher, toHiragana: toHiragana };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Kana = api;
})(this);
