// 2409 (Misty 19 Nov 12:48, Celine's laptop: "some parts are stuck and cannot move") · the "Coming up in China" card was rebuilt every
//   time Overview changed, and Celine's Overview moves cards under her summary, which changed Overview again: a loop that made the
//   app pause its page watchers for 30 s at a time (cards stopped updating). The card is now only rebuilt when its dates change.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  function today(v){ if(typeof D === 'undefined' || !D || D.mgr) return; const old = v.querySelector('.cn95'); if(old) old.remove();\n    const L = over(T(), addD(T(), 21)); if(L.length) v.insertAdjacentHTML('beforeend', box('Coming up in China', L)); }",
   "  function today(v){ if(typeof D === 'undefined' || !D || D.mgr) return; const L = over(T(), addD(T(), 21)), h = L.length ? box('Coming up in China', L) : '', old = v.querySelector('.cn95');\n    if(old && old.dataset.h === String(h.length) + ':' + L.map(x => x.n).join('|')) return; if(old) old.remove();   /* 2409 */\n    if(h) v.insertAdjacentHTML('beforeend', h.replace('<section class=\"cn95\"', '<section class=\"cn95\" data-h=\"' + E(String(h.length) + ':' + L.map(x => x.n).join('|')) + '\"')); }"],
  ["  function home(v){ if(typeof D === 'undefined' || !D || !D.mgr) return; const old = v.querySelector('.cn95'); if(old) old.remove();\n    const L = over(T(), addD(T(), 21)); v.insertAdjacentHTML('beforeend', L.length ?",
   "  function home(v){ if(typeof D === 'undefined' || !D || !D.mgr) return; const L = over(T(), addD(T(), 21)), k2409 = 'h' + L.map(x => x.n + x.a + x.b).join('|'), old = v.querySelector('.cn95');\n    if(old && old.dataset.h === k2409) return; if(old) old.remove();   /* 2409: unchanged → left where it is (no loop with Celine's Overview) */\n    v.insertAdjacentHTML('beforeend', (L.length ?"],
  ["<div class=\"it\">Nothing in the next 3 weeks.</div></section>'); }\n  const RUN =",
   "<div class=\"it\">Nothing in the next 3 weeks.</div></section>').replace('<section class=\"cn95\"', '<section class=\"cn95\" data-h=\"' + E(k2409) + '\"')); }\n  const RUN ="]
]);
