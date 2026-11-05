/*
 * 出題データ
 * WORLDS[i].ja / .en は [ステージ0, ステージ1, ステージ2] の配列。
 * 各ステージは [かんたん, ふつう, むずかしい] の3レベル。
 *   かんたん  … 小学校低学年
 *   ふつう    … 小学校高学年
 *   むずかしい … 中学生
 * 日本語は「表示|よみ」。表示がそのまま読みなら「よみ」だけでOK（カタカナ可）。
 */
(function (global) {
  'use strict';

  const STAGE_NAMES = ['たんご', 'ながい ことば', 'ぶんしょう'];

  const WORLDS = [
    {
      id: 'forest', name: 'もり・どうぶつ', short: 'もり',
      ja: [
        [
          ['りす', 'くま', 'うさぎ', 'さる', 'しか', 'たぬき', 'きつね', 'ことり'],
          ['動物|どうぶつ', '植物|しょくぶつ', '自然|しぜん', '野鳥|やちょう', '若葉|わかば', '落ち葉|おちば'],
          ['生態|せいたい', '樹木|じゅもく', '繁殖|はんしょく', '渓流|けいりゅう', '野生|やせい', '進化|しんか']
        ],
        [
          ['かぶとむし', 'てんとうむし', 'あらいぐま', 'ちょうちょ', 'かたつむり', 'どんぐり'],
          ['森林浴|しんりんよく', '野生動物|やせいどうぶつ', '冬眠する|とうみんする', '木登り|きのぼり', '虫かご|むしかご', '鳥のさえずり|とりのさえずり'],
          ['生態系|せいたいけい', '食物連鎖|しょくもつれんさ', '絶滅危惧種|ぜつめつきぐしゅ', '光合成|こうごうせい', '広葉樹|こうようじゅ', '針葉樹|しんようじゅ']
        ],
        [
          ['りすがきのみをたべた', 'くまがねむっている', 'うさぎがはねる', 'ことりがうたう', 'もりはしずかだ', 'きつねがかくれた'],
          ['森で虫を見つけた|もりでむしをみつけた', '鳥が空を飛ぶ|とりがそらをとぶ', '大きな木に登る|おおきなきにのぼる', '花がさいている|はながさいている', '動物たちが集まる|どうぶつたちがあつまる', '夏休みに森へ行く|なつやすみにもりへいく'],
          ['森林は二酸化炭素を吸収する|しんりんはにさんかたんそをきゅうしゅうする', '冬になると熊は冬眠する|ふゆになるとくまはとうみんする', '野生動物を保護しよう|やせいどうぶつをほごしよう', '木々の緑が目にしみる|きぎのみどりがめにしみる', '豊かな自然を守る|ゆたかなしぜんをまもる']
        ]
      ],
      en: [
        [
          ['fox', 'owl', 'bear', 'tree', 'leaf', 'bird', 'deer', 'ant'],
          ['forest', 'monkey', 'flower', 'insect', 'nature', 'animal'],
          ['habitat', 'species', 'branch', 'wildlife', 'protect', 'survive']
        ],
        [
          ['rabbit', 'turtle', 'garden', 'acorn', 'spider', 'beetle'],
          ['squirrel', 'butterfly', 'mushroom', 'raccoon', 'hedgehog', 'woodpecker'],
          ['environment', 'ecosystem', 'endangered', 'hibernation', 'biodiversity', 'deciduous']
        ],
        [
          ['A bird can fly.', 'The bear is big.', 'Look at the owl.', 'The fox is red.', 'A cat is in the tree.', 'The deer can run.'],
          ['We walk in the forest.', 'The rabbit eats carrots.', 'Birds sing in the morning.', 'There are many trees.', 'The squirrel climbs a tree.', 'My dog likes the forest.'],
          ['We should protect the forest.', 'Many animals live in this forest.', 'Bears sleep during the winter.', 'Trees give us fresh air.', 'The owl hunts at night.', 'Nature is full of wonders.']
        ]
      ]
    },
    {
      id: 'ocean', name: 'うみ・いきもの', short: 'うみ',
      ja: [
        [
          ['さかな', 'かに', 'たこ', 'いか', 'くじら', 'かめ', 'えび', 'うに'],
          ['海岸|かいがん', '貝がら|かいがら', '砂浜|すなはま', '海水|かいすい', '船|ふね', '港|みなと'],
          ['潮流|ちょうりゅう', '珊瑚|さんご', '漁業|ぎょぎょう', '干潟|ひがた', '深海|しんかい', '海藻|かいそう']
        ],
        [
          ['ペンギン', 'あざらし', 'おっとせい', 'たつのおとしご', 'いそぎんちゃく', 'ジンベエザメ'],
          ['海水浴|かいすいよく', '水族館|すいぞくかん', '潮干狩り|しおひがり', '熱帯魚|ねったいぎょ', '魚つり|さかなつり', '海の生き物|うみのいきもの'],
          ['海洋汚染|かいようおせん', '地球温暖化|ちきゅうおんだんか', '海洋資源|かいようしげん', '塩分濃度|えんぶんのうど', '植物プランクトン|しょくぶつぷらんくとん', '満ち潮|みちしお']
        ],
        [
          ['さかながおよぐ', 'かにがあるく', 'なみがきた', 'くじらはおおきい', 'うみであそぶ', 'かいをひろった'],
          ['海で泳いだ|うみでおよいだ', '魚がたくさんいる|さかながたくさんいる', '船が港に着く|ふねがみなとにつく', '水族館へ行こう|すいぞくかんへいこう', '波の音が聞こえる|なみのおとがきこえる', '砂浜を歩く|すなはまをあるく'],
          ['海の水はしょっぱい|うみのみずはしょっぱい', '深海には不思議な生物がいる|しんかいにはふしぎなせいぶつがいる', '海洋ごみを減らそう|かいようごみをへらそう', '珊瑚礁は美しい|さんごしょうはうつくしい', '潮が満ちてきた|しおがみちてきた']
        ]
      ],
      en: [
        [
          ['fish', 'crab', 'sea', 'wave', 'sand', 'ship', 'boat', 'shell'],
          ['ocean', 'whale', 'shark', 'beach', 'island', 'turtle'],
          ['marine', 'current', 'harbor', 'tide', 'coast', 'voyage']
        ],
        [
          ['dolphin', 'penguin', 'octopus', 'starfish', 'seahorse', 'jellyfish'],
          ['aquarium', 'lighthouse', 'submarine', 'swimming', 'seaweed', 'sailboat'],
          ['pollution', 'underwater', 'navigation', 'coastline', 'plankton', 'conservation']
        ],
        [
          ['A fish can swim.', 'I see the sea.', 'The crab is red.', 'Look at the waves.', 'The whale is big.', 'We play on the sand.'],
          ['We swim in the ocean.', 'The ship sails to the island.', 'Dolphins are very smart.', 'I found a pretty shell.', 'Penguins cannot fly.', 'We go to the aquarium.'],
          ['We must keep the ocean clean.', 'Whales are the largest animals.', 'The tide comes in at night.', 'Coral reefs are very beautiful.', 'Plastic is a big problem.', 'Many fish live in deep water.']
        ]
      ]
    },
    {
      id: 'town', name: 'まち・たべもの', short: 'まち',
      ja: [
        [
          ['パン', 'すし', 'みかん', 'りんご', 'ケーキ', 'おにぎり', 'バス', 'えき'],
          ['野菜|やさい', '果物|くだもの', '電車|でんしゃ', '駅前|えきまえ', '料理|りょうり', '牛乳|ぎゅうにゅう'],
          ['栄養|えいよう', '食糧|しょくりょう', '交通|こうつう', '郵便|ゆうびん', '調味料|ちょうみりょう', '発酵|はっこう']
        ],
        [
          ['カレーライス', 'ハンバーグ', 'スパゲッティ', 'ショートケーキ', 'パンやさん', 'しょうぼうしゃ'],
          ['商店街|しょうてんがい', '図書館|としょかん', '消防署|しょうぼうしょ', '郵便局|ゆうびんきょく', '給食当番|きゅうしょくとうばん', '交差点|こうさてん'],
          ['公共交通機関|こうきょうこうつうきかん', '地産地消|ちさんちしょう', '栄養バランス|えいようばらんす', '食品ロス|しょくひんろす', '再開発|さいかいはつ', '市役所|しやくしょ']
        ],
        [
          ['パンをかう', 'ケーキをたべた', 'バスにのる', 'おみせにいく', 'おにぎりがすき', 'りんごはあかい'],
          ['駅で電車を待つ|えきででんしゃをまつ', '八百屋で野菜を買う|やおやでやさいをかう', '図書館で本をかりる|としょかんでほんをかりる', 'お昼ごはんはカレーだ|おひるごはんはかれーだ', '信号が青になった|しんごうがあおになった', '町のお祭りに行く|まちのおまつりにいく'],
          ['好き嫌いせずに食べよう|すききらいせずにたべよう', '地元の野菜を使った料理|じもとのやさいをつかったりょうり', '食品ロスを減らす工夫|しょくひんろすをへらすくふう', '交通ルールを守ろう|こうつうるーるをまもろう', '市役所で手続きをする|しやくしょでてつづきをする']
        ]
      ],
      en: [
        [
          ['cake', 'milk', 'bus', 'car', 'shop', 'egg', 'rice', 'bread'],
          ['apple', 'juice', 'train', 'store', 'pizza', 'lemon'],
          ['market', 'recipe', 'traffic', 'station', 'bakery', 'lunch']
        ],
        [
          ['banana', 'orange', 'cookie', 'sandwich', 'hamburger', 'candy'],
          ['restaurant', 'supermarket', 'hospital', 'library', 'chocolate', 'strawberry'],
          ['transportation', 'vegetables', 'convenience', 'delicious', 'ingredient', 'neighborhood']
        ],
        [
          ['I like cake.', 'The bus is here.', 'I eat rice.', 'Milk is white.', 'This is my bread.', 'The car is fast.'],
          ['We eat lunch at noon.', 'The train is coming.', 'I buy apples at the store.', 'Pizza is my favorite food.', 'The library is near the station.', 'Mom makes a sandwich.'],
          ['Eating vegetables keeps us healthy.', 'The supermarket opens at nine.', 'Please follow the traffic rules.', 'This restaurant is very popular.', 'We should not waste food.', 'Our town has a big festival.']
        ]
      ]
    },
    {
      id: 'space', name: 'うちゅう・そら', short: 'うちゅう',
      ja: [
        [
          ['ほし', 'つき', 'そら', 'くも', 'あめ', 'にじ', 'ゆき', 'かぜ'],
          ['太陽|たいよう', '地球|ちきゅう', '星座|せいざ', '天気|てんき', '雷|かみなり', '流れ星|ながれぼし'],
          ['惑星|わくせい', '銀河|ぎんが', '衛星|えいせい', '引力|いんりょく', '気圧|きあつ', '彗星|すいせい']
        ],
        [
          ['ロケット', 'うちゅうじん', 'ゆきだるま', 'おほしさま', 'たなばた', 'あまのがわ'],
          ['宇宙飛行士|うちゅうひこうし', '天気予報|てんきよほう', '天体観測|てんたいかんそく', '北極星|ほっきょくせい', '三日月|みかづき', '夏の大三角|なつのだいさんかく'],
          ['国際宇宙ステーション|こくさいうちゅうすてーしょん', '太陽系|たいようけい', '無重力|むじゅうりょく', '皆既日食|かいきにっしょく', '天の川銀河|あまのがわぎんが', '積乱雲|せきらんうん']
        ],
        [
          ['ほしがひかる', 'つきがでた', 'あめがふる', 'にじがきれい', 'そらはあおい', 'ロケットがとぶ'],
          ['夜空に星が光る|よぞらにほしがひかる', '明日は晴れるかな|あしたははれるかな', '月はとても明るい|つきはとてもあかるい', '雪で遊びたい|ゆきであそびたい', '宇宙に行ってみたい|うちゅうにいってみたい', '流れ星に願いごと|ながれぼしにねがいごと'],
          ['地球は太陽の周りを回る|ちきゅうはたいようのまわりをまわる', '宇宙飛行士は無重力で暮らす|うちゅうひこうしはむじゅうりょくでくらす', '火星には水があったらしい|かせいにはみずがあったらしい', '台風が近づいている|たいふうがちかづいている', '月の満ち欠けを観察する|つきのみちかけをかんさつする']
        ]
      ],
      en: [
        [
          ['sun', 'moon', 'star', 'sky', 'rain', 'snow', 'wind', 'cloud'],
          ['planet', 'rocket', 'earth', 'comet', 'storm', 'rainbow'],
          ['galaxy', 'orbit', 'gravity', 'solar', 'weather', 'climate']
        ],
        [
          ['sunshine', 'snowman', 'thunder', 'spaceship', 'starlight', 'raindrop'],
          ['astronaut', 'telescope', 'universe', 'satellite', 'umbrella', 'lightning'],
          ['atmosphere', 'constellation', 'temperature', 'exploration', 'meteorite', 'forecast']
        ],
        [
          ['The sun is hot.', 'I see the moon.', 'Stars are pretty.', 'It is rainy today.', 'The sky is blue.', 'I like snow.'],
          ['The rocket goes to space.', 'We can see many stars.', 'The earth is round.', 'I want to be an astronaut.', 'There is a rainbow in the sky.', 'Look through the telescope.'],
          ['The earth goes around the sun.', 'Mars is called the red planet.', 'Astronauts live in space for months.', 'The weather will change soon.', 'The moon has no air.', 'Our galaxy is very large.']
        ]
      ]
    },
    {
      id: 'school', name: 'がっこう', short: 'がっこう',
      ja: [
        [
          ['ほん', 'えんぴつ', 'ノート', 'けしごむ', 'つくえ', 'いす', 'こくばん', 'ずこう'],
          ['算数|さんすう', '国語|こくご', '理科|りか', '社会|しゃかい', '音楽|おんがく', '体育|たいいく'],
          ['数学|すうがく', '英語|えいご', '歴史|れきし', '地理|ちり', '部活|ぶかつ', '試験|しけん']
        ],
        [
          ['ランドセル', 'じょうぎ', 'ふでばこ', 'きゅうしょく', 'うんどうかい', 'なつやすみ'],
          ['運動会|うんどうかい', '遠足|えんそく', '学級会|がっきゅうかい', '夏休み|なつやすみ', '卒業式|そつぎょうしき', '自由研究|じゆうけんきゅう'],
          ['生徒会長|せいとかいちょう', '修学旅行|しゅうがくりょこう', '定期テスト|ていきてすと', '文化祭|ぶんかさい', '方程式|ほうていしき', '部活動|ぶかつどう']
        ],
        [
          ['がっこうにいく', 'ほんをよむ', 'えをかく', 'ともだちとあそぶ', 'せんせいおはよう', 'きゅうしょくがおいしい'],
          ['毎朝早く起きる|まいあさはやくおきる', '宿題を終わらせた|しゅくだいをおわらせた', '図工で絵をかく|ずこうでえをかく', '友達と一緒に帰る|ともだちといっしょにかえる', '漢字の練習をする|かんじのれんしゅうをする', '先生に質問する|せんせいにしつもんする'],
          ['修学旅行で京都へ行く|しゅうがくりょこうできょうとへいく', '部活動で全国大会を目指す|ぶかつどうでぜんこくたいかいをめざす', '歴史の授業は面白い|れきしのじゅぎょうはおもしろい', '方程式を解いてみよう|ほうていしきをといてみよう', '将来の夢を発表する|しょうらいのゆめをはっぴょうする']
        ]
      ],
      en: [
        [
          ['pen', 'book', 'desk', 'bag', 'art', 'math'],
          ['pencil', 'school', 'music', 'friend', 'teacher', 'eraser'],
          ['science', 'history', 'subject', 'homework', 'student', 'lesson']
        ],
        [
          ['notebook', 'classroom', 'painting', 'backpack', 'lunchbox', 'playground'],
          ['dictionary', 'blackboard', 'schoolyard', 'principal', 'scissors', 'textbook'],
          ['mathematics', 'experiment', 'examination', 'graduation', 'laboratory', 'literature']
        ],
        [
          ['I go to school.', 'This is my pen.', 'I read a book.', 'We like art.', 'Open your bag.', 'Good morning, teacher.'],
          ['I do my homework every day.', 'My favorite subject is music.', 'We play in the schoolyard.', 'The teacher is very kind.', 'Please open your textbook.', 'I have a new pencil.'],
          ['We study English and science.', 'The school trip was exciting.', 'I will do my best on the test.', 'Our club practices after school.', 'History tells us about the past.', 'I want to be a scientist.']
        ]
      ]
    }
  ];

  // 1回のプレイで出す問題数 [ステージ][難易度]
  const PROMPT_COUNT = [[5, 6, 6], [5, 5, 6], [3, 4, 4]];

  function parseEntry(entry, lang) {
    if (lang === 'en') return { text: entry, kana: entry };
    const p = entry.split('|');
    return { text: p[0], kana: p[1] || p[0] };
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // 問題をランダムに選ぶ
  function pick(worldIdx, stageIdx, diff, lang) {
    const pool = WORLDS[worldIdx][lang][stageIdx][diff];
    const n = PROMPT_COUNT[stageIdx][diff];
    let list = shuffle(pool);
    while (list.length < n) list = list.concat(shuffle(pool));
    return list.slice(0, n).map(function (e) { return parseEntry(e, lang); });
  }

  global.WORDS = { WORLDS: WORLDS, STAGE_NAMES: STAGE_NAMES, pick: pick, shuffle: shuffle };
})(this);
