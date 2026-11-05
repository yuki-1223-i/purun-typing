/* ワールドごとの背景（SVG） */
(function (global) {
  'use strict';

  const W = 800, H = 240, GROUND = 190;

  function cloud(x, y, s) {
    return '<g class="cloud" transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff" opacity=".9">' +
      '<ellipse cx="0" cy="0" rx="26" ry="14"/><ellipse cx="22" cy="-8" rx="20" ry="16"/><ellipse cx="44" cy="0" rx="24" ry="13"/></g>';
  }

  function tree(x, h, c) {
    return '<rect x="' + (x - 5) + '" y="' + (GROUND - h * 0.45) + '" width="10" height="' + (h * 0.45) + '" rx="3" fill="#C9A27E"/>' +
      '<circle cx="' + x + '" cy="' + (GROUND - h * 0.6) + '" r="' + (h * 0.32) + '" fill="' + c + '"/>' +
      '<circle cx="' + (x - h * 0.18) + '" cy="' + (GROUND - h * 0.48) + '" r="' + (h * 0.22) + '" fill="' + c + '"/>' +
      '<circle cx="' + (x + h * 0.18) + '" cy="' + (GROUND - h * 0.48) + '" r="' + (h * 0.22) + '" fill="' + c + '"/>';
  }

  function stars(n, seed) {
    let s = '', r = seed;
    for (let i = 0; i < n; i++) {
      r = (r * 9301 + 49297) % 233280;
      const x = (r / 233280) * W;
      r = (r * 9301 + 49297) % 233280;
      const y = (r / 233280) * (GROUND - 30);
      s += '<circle class="twinkle" style="animation-delay:' + (i % 7) * 0.4 + 's" cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (1 + (i % 3) * 0.7) + '" fill="#FFF7D6"/>';
    }
    return s;
  }

  const SCENES = {
    forest: function () {
      let t = '';
      [[60, 120, '#9FD8A0'], [170, 90, '#B5E3A8'], [300, 130, '#8ED19A'], [430, 100, '#A8DDA0'], [560, 125, '#95D49C'], [690, 95, '#B0E0A6'], [770, 115, '#9FD8A0']]
        .forEach(function (p) { t += tree(p[0], p[1], p[2]); });
      return '<rect width="' + W + '" height="' + H + '" fill="url(#g-forest)"/>' +
        '<circle cx="700" cy="45" r="26" fill="#FFE79A"/>' +
        cloud(90, 50, 1) + cloud(380, 35, 0.8) +
        '<path d="M0 ' + (GROUND - 30) + ' Q200 ' + (GROUND - 70) + ' 400 ' + (GROUND - 30) + ' T800 ' + (GROUND - 30) + ' V' + H + ' H0Z" fill="#CDEFC0"/>' +
        t +
        '<rect y="' + GROUND + '" width="' + W + '" height="' + (H - GROUND) + '" fill="#BFE3A0"/>' +
        '<path d="M0 ' + GROUND + ' H' + W + '" stroke="#A6D38A" stroke-width="4"/>';
    },
    ocean: function () {
      let fish = '';
      [[120, 150, '#FFB5C5'], [330, 165, '#FFE79A'], [520, 145, '#CDB4F6'], [650, 170, '#FFB5C5']].forEach(function (f) {
        fish += '<g class="fish" transform="translate(' + f[0] + ' ' + f[1] + ')"><ellipse rx="12" ry="7" fill="' + f[2] + '"/><path d="M10 0 L20 -7 L20 7 Z" fill="' + f[2] + '"/><circle cx="-6" cy="-2" r="1.5" fill="#4A3B5C"/></g>';
      });
      return '<rect width="' + W + '" height="' + H + '" fill="url(#g-ocean)"/>' +
        '<circle cx="110" cy="45" r="24" fill="#FFE79A"/>' +
        cloud(450, 40, 0.9) + cloud(650, 60, 0.7) +
        '<rect y="110" width="' + W + '" height="' + (GROUND - 110) + '" fill="#8FD0EC"/>' +
        '<path class="wave" d="M0 112 Q25 102 50 112 T100 112 T150 112 T200 112 T250 112 T300 112 T350 112 T400 112 T450 112 T500 112 T550 112 T600 112 T650 112 T700 112 T750 112 T800 112 T850 112" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/>' +
        fish +
        '<rect y="' + GROUND + '" width="' + W + '" height="' + (H - GROUND) + '" fill="#FBE7C2"/>' +
        '<path d="M0 ' + GROUND + ' H' + W + '" stroke="#F1D59E" stroke-width="4"/>' +
        '<g fill="#FFB5C5"><path d="M200 214 l6 -10 6 10 z"/><path d="M590 220 l5 -8 5 8 z"/></g>';
    },
    town: function () {
      const b = [[20, 70, 90, '#FFD1DC'], [120, 60, 120, '#CDE7F7'], [200, 80, 80, '#FFF0B8'], [300, 64, 130, '#D8CCF5'], [390, 90, 95, '#CFEFD9'], [500, 60, 140, '#FFD1DC'], [580, 85, 100, '#CDE7F7'], [690, 70, 115, '#FFF0B8']];
      let s = '';
      b.forEach(function (p) {
        const x = p[0], w = p[1], h = p[2];
        s += '<rect x="' + x + '" y="' + (GROUND - h) + '" width="' + w + '" height="' + h + '" rx="6" fill="' + p[3] + '"/>';
        for (let yy = GROUND - h + 14; yy < GROUND - 26; yy += 26) {
          for (let xx = x + 10; xx < x + w - 14; xx += 22) {
            s += '<rect x="' + xx + '" y="' + yy + '" width="12" height="14" rx="2" fill="#fff" opacity=".85"/>';
          }
        }
      });
      return '<rect width="' + W + '" height="' + H + '" fill="url(#g-town)"/>' +
        cloud(140, 40, 0.9) + cloud(560, 30, 0.8) + s +
        '<rect y="' + GROUND + '" width="' + W + '" height="' + (H - GROUND) + '" fill="#D9D2CB"/>' +
        '<path d="M0 ' + (GROUND + 25) + ' H' + W + '" stroke="#fff" stroke-width="4" stroke-dasharray="30 22"/>';
    },
    space: function () {
      return '<rect width="' + W + '" height="' + H + '" fill="url(#g-space)"/>' +
        stars(60, 7) +
        '<g transform="translate(640 70)"><circle r="30" fill="#FFB5C5"/><ellipse rx="52" ry="11" fill="none" stroke="#FFE79A" stroke-width="5" transform="rotate(-15)"/></g>' +
        '<circle cx="150" cy="60" r="16" fill="#A9D8F5"/><circle cx="145" cy="55" r="4" fill="#8CC3E8"/>' +
        '<rect y="' + GROUND + '" width="' + W + '" height="' + (H - GROUND) + '" fill="#DCD6EE"/>' +
        '<path d="M0 ' + GROUND + ' Q100 ' + (GROUND - 8) + ' 200 ' + GROUND + ' T400 ' + GROUND + ' T600 ' + GROUND + ' T800 ' + GROUND + '" fill="#DCD6EE"/>' +
        '<g fill="#C6BEE0"><ellipse cx="120" cy="212" rx="18" ry="6"/><ellipse cx="420" cy="222" rx="24" ry="7"/><ellipse cx="700" cy="210" rx="14" ry="5"/></g>';
    },
    school: function () {
      let win = '';
      for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
        win += '<rect x="' + (262 + c * 46) + '" y="' + (98 + r * 40) + '" width="28" height="24" rx="3" fill="#CDE7F7"/>';
      }
      return '<rect width="' + W + '" height="' + H + '" fill="url(#g-school)"/>' +
        cloud(80, 45, 0.9) + cloud(640, 35, 1) +
        '<rect x="240" y="80" width="300" height="' + (GROUND - 80) + '" rx="6" fill="#FFF3E0" stroke="#F0D9B5" stroke-width="3"/>' +
        '<rect x="350" y="40" width="80" height="50" rx="6" fill="#FFF3E0" stroke="#F0D9B5" stroke-width="3"/>' +
        '<circle cx="390" cy="64" r="15" fill="#fff" stroke="#E0B640" stroke-width="3"/><path d="M390 64 V54 M390 64 H398" stroke="#5A4A6B" stroke-width="2.5" stroke-linecap="round"/>' +
        win +
        '<rect x="372" y="' + (GROUND - 36) + '" width="36" height="36" rx="3" fill="#E3C79E"/>' +
        tree(110, 100, '#FFC9D6') + tree(680, 110, '#FFC9D6') +
        '<rect y="' + GROUND + '" width="' + W + '" height="' + (H - GROUND) + '" fill="#EBD9B8"/>' +
        '<path d="M0 ' + GROUND + ' H' + W + '" stroke="#DCC59C" stroke-width="4"/>';
    },
    custom: function () {
      return '<rect width="' + W + '" height="' + H + '" fill="url(#g-custom)"/>' +
        cloud(120, 50, 1) + cloud(500, 40, 0.8) +
        '<g fill="#fff" opacity=".7"><circle cx="300" cy="70" r="6"/><circle cx="660" cy="90" r="4"/><circle cx="220" cy="130" r="3"/></g>' +
        '<rect y="' + GROUND + '" width="' + W + '" height="' + (H - GROUND) + '" fill="#F6D7E6"/>' +
        '<path d="M0 ' + GROUND + ' H' + W + '" stroke="#EBBBD2" stroke-width="4"/>';
    }
  };

  const DEFS = '<defs>' +
    '<linearGradient id="g-forest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D6F0FF"/><stop offset="1" stop-color="#F0FAF0"/></linearGradient>' +
    '<linearGradient id="g-ocean" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CBEBFF"/><stop offset="1" stop-color="#EAF7FF"/></linearGradient>' +
    '<linearGradient id="g-town" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3EC"/><stop offset="1" stop-color="#FFF6EE"/></linearGradient>' +
    '<linearGradient id="g-space" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E2A5A"/><stop offset="1" stop-color="#5D4E9E"/></linearGradient>' +
    '<linearGradient id="g-school" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1C9"/><stop offset="1" stop-color="#FFF9EC"/></linearGradient>' +
    '<linearGradient id="g-custom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E6FF"/><stop offset="1" stop-color="#FFF0F6"/></linearGradient>' +
    '</defs>';

  function render(id) {
    return '<svg class="scene-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      DEFS + (SCENES[id] || SCENES.custom)() +
      // ゴールの旗
      '<g class="goal" transform="translate(' + (W * 0.93) + ' ' + GROUND + ')">' +
        '<rect x="-2" y="-90" width="4" height="90" fill="#8C7A9E"/>' +
        '<path d="M2 -90 L40 -78 L2 -64 Z" fill="#FF9EB8"/>' +
        '<text x="7" y="-73" font-size="9" fill="#fff" font-weight="bold">ゴール</text>' +
      '</g>' +
      '</svg>';
  }

  global.Scenery = { render: render, GROUND_RATIO: GROUND / H };
})(this);
