/* 主人公「ぷるん」と衣装（SVGで描画） */
(function (global) {
  'use strict';

  // 衣装：need = 解放に必要な★の合計
  const COSTUMES = [
    { id: 'ribbon', name: 'リボン', need: 3 },
    { id: 'glasses', name: 'まるメガネ', need: 8 },
    { id: 'scarf', name: 'マフラー', need: 15 },
    { id: 'flowers', name: 'はなかんむり', need: 25 },
    { id: 'party', name: 'パーティーぼうし', need: 35 },
    { id: 'headphones', name: 'ヘッドホン', need: 50 },
    { id: 'cape', name: 'マント', need: 65 },
    { id: 'wizard', name: 'まほうの ぼうし', need: 80 },
    { id: 'helmet', name: 'うちゅう ヘルメット', need: 100 },
    { id: 'crown', name: 'おうかん', need: 120 }
  ];

  // 体の後ろに描くもの
  const BACK = {
    cape: '<path d="M34 58 Q8 78 6 110 Q30 100 52 104 Z" fill="#B49BE8" stroke="#8E74C9" stroke-width="2"/>' +
          '<path d="M34 58 Q18 80 16 102" fill="none" stroke="#8E74C9" stroke-width="1.5" opacity=".6"/>'
  };

  // 体の前に描くもの
  const FRONT = {
    ribbon: '<g transform="translate(84 40) rotate(20)"><path d="M0 0 L-14 -9 L-14 9 Z M0 0 L14 -9 L14 9 Z" fill="#FF9EB8" stroke="#E57C99" stroke-width="1.5" stroke-linejoin="round"/><circle r="4" fill="#FF7FA3"/></g>',
    glasses: '<g fill="rgba(255,255,255,.3)" stroke="#5A4A6B" stroke-width="2.5"><circle cx="47" cy="68" r="10"/><circle cx="73" cy="68" r="10"/></g><path d="M57 67 Q60 64 63 67" fill="none" stroke="#5A4A6B" stroke-width="2.5"/>',
    scarf: '<path d="M22 86 Q60 100 98 86 L99 95 Q60 110 21 95 Z" fill="#FF8C8C" stroke="#E06A6A" stroke-width="1.5"/>' +
           '<path d="M76 96 L84 118 L72 118 L68 99 Z" fill="#FF8C8C" stroke="#E06A6A" stroke-width="1.5"/>' +
           '<path d="M30 92 L32 98 M44 96 L45 102 M58 98 L58 104" stroke="#fff" stroke-width="2" opacity=".7"/>',
    flowers: (function () {
      const pts = [[34, 42], [46, 35], [60, 32], [74, 35], [86, 42]];
      const cols = ['#FFB5C5', '#FFE79A', '#CDB4F6', '#FFE79A', '#FFB5C5'];
      return '<path d="M30 46 Q60 24 90 46" fill="none" stroke="#7CC48F" stroke-width="3"/>' + pts.map(function (p, i) {
        let petals = '';
        for (let k = 0; k < 5; k++) {
          const a = k * 72 * Math.PI / 180;
          petals += '<circle cx="' + (p[0] + Math.cos(a) * 4).toFixed(1) + '" cy="' + (p[1] + Math.sin(a) * 4).toFixed(1) + '" r="3.2" fill="' + cols[i] + '"/>';
        }
        return petals + '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.2" fill="#FFF7E0"/>';
      }).join('');
    })(),
    party: '<path d="M44 38 L60 0 L76 38 Z" fill="#A9D8F5" stroke="#7BB8DE" stroke-width="1.5" stroke-linejoin="round"/>' +
           '<path d="M50 24 L70 24 M47 31 L73 31 M54 14 L66 14" stroke="#FFB5C5" stroke-width="3"/>' +
           '<circle cx="60" cy="1" r="5" fill="#FFE79A" stroke="#E8C96A" stroke-width="1.5"/>',
    headphones: '<path d="M22 70 Q22 22 60 22 Q98 22 98 70" fill="none" stroke="#7A6A8C" stroke-width="5" stroke-linecap="round"/>' +
                '<rect x="12" y="60" width="14" height="22" rx="6" fill="#FFB5C5" stroke="#7A6A8C" stroke-width="2"/>' +
                '<rect x="94" y="60" width="14" height="22" rx="6" fill="#FFB5C5" stroke="#7A6A8C" stroke-width="2"/>',
    wizard: '<path d="M30 40 Q60 30 90 40 Q60 48 30 40 Z" fill="#6C5BA8"/>' +
            '<path d="M42 39 L66 -6 Q70 -10 72 -4 L78 39 Z" fill="#7E6CC2" stroke="#5A4A96" stroke-width="1.5" stroke-linejoin="round"/>' +
            '<path d="M58 22 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5 Z" fill="#FFE79A"/>' +
            '<circle cx="68" cy="8" r="2" fill="#FFE79A"/>',
    helmet: '<circle cx="60" cy="68" r="50" fill="rgba(200,235,255,.28)" stroke="#E6F4FF" stroke-width="4"/>' +
            '<path d="M30 40 Q40 26 56 22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>' +
            '<line x1="60" y1="18" x2="60" y2="6" stroke="#B8C4D6" stroke-width="3"/><circle cx="60" cy="5" r="4" fill="#FF9EB8"/>',
    crown: '<path d="M40 38 L40 20 L50 30 L60 14 L70 30 L80 20 L80 38 Z" fill="#FFD966" stroke="#E0B640" stroke-width="2" stroke-linejoin="round"/>' +
           '<circle cx="60" cy="31" r="3" fill="#FF9EB8"/><circle cx="48" cy="34" r="2" fill="#A9D8F5"/><circle cx="72" cy="34" r="2" fill="#A9D8F5"/>'
  };

  // 頭の芽（帽子系をかぶっているときは隠す）
  const HIDE_SPROUT = ['party', 'wizard', 'crown', 'helmet', 'flowers'];

  function svg(costumeId, extraClass) {
    const sprout = HIDE_SPROUT.indexOf(costumeId) >= 0 ? '' :
      '<g class="sprout"><path d="M60 34 Q59 26 60 20" fill="none" stroke="#6BBF9A" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="53" cy="20" rx="7" ry="4" transform="rotate(-25 53 20)" fill="#8ED9A8"/>' +
      '<ellipse cx="67" cy="18" rx="7" ry="4" transform="rotate(25 67 18)" fill="#8ED9A8"/></g>';
    return '<svg class="chara-svg ' + (extraClass || '') + '" viewBox="-10 -14 140 140" aria-label="ぷるん">' +
      (BACK[costumeId] || '') +
      '<ellipse class="foot foot-l" cx="45" cy="104" rx="10" ry="6" fill="#7FCFAA"/>' +
      '<ellipse class="foot foot-r" cx="75" cy="104" rx="10" ry="6" fill="#7FCFAA"/>' +
      '<g class="body">' +
        sprout +
        '<path d="M20 80 C20 46 40 32 60 32 C80 32 100 46 100 80 C100 98 82 105 60 105 C38 105 20 98 20 80 Z" fill="#A8E6CF" stroke="#6BBF9A" stroke-width="3"/>' +
        '<ellipse cx="44" cy="48" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-20 44 48)"/>' +
        '<g class="eyes"><ellipse cx="47" cy="68" rx="4.5" ry="6" fill="#4A3B5C"/><ellipse cx="73" cy="68" rx="4.5" ry="6" fill="#4A3B5C"/>' +
        '<circle cx="48.5" cy="65.5" r="1.8" fill="#fff"/><circle cx="74.5" cy="65.5" r="1.8" fill="#fff"/></g>' +
        '<ellipse cx="36" cy="80" rx="6" ry="3.5" fill="#FFB5C5" opacity=".8"/><ellipse cx="84" cy="80" rx="6" ry="3.5" fill="#FFB5C5" opacity=".8"/>' +
        '<path class="mouth" d="M55 80 Q60 86 65 80" fill="none" stroke="#4A3B5C" stroke-width="2.5" stroke-linecap="round"/>' +
        (FRONT[costumeId] || '') +
      '</g>' +
    '</svg>';
  }

  function unlocked(totalStars) {
    return COSTUMES.filter(function (c) { return totalStars >= c.need; });
  }

  global.Chara = { COSTUMES: COSTUMES, svg: svg, unlocked: unlocked };
})(this);
