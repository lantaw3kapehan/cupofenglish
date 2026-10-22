// 630: Celebrate · Level up (CEFR goes up, e.g. A1 → A2; first sight records today's level quietly) · milestone card shows lessons, current book and level · wish lines split evenly.
require('../tools/lib.js')(process.argv[2], [
[
"  const booksOf = s => String((s && s.book) || '')",
"  const CEFR = ['PRE-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];\n  const cefrOf = v => { const m = up(v).replace(/\\s+/g, '').match(/PRE-?A1|A1|A2|B1|B2|C1|C2/); return m ? (/^PRE/.test(m[0]) ? 'PRE-A1' : m[0]) : ''; };\n  const booksOf = s => String((s && s.book) || '')"
],
[
"      const bk = booksOf(s).filter(x => bookName(x)); const seen = CEL.books[c];\n      if(!seen){ if(bk.length) seed[c] = bk; }",
"      const bk = booksOf(s).filter(x => bookName(x)); const seen = CEL.books[c], lv = cefrOf(s.cefr);\n      base.cur = bk.length ? bookName(bk[bk.length - 1]) : String(s.book || '').split(/[,;]/)[0].trim();\n      if(!seen){ const sd = bk.concat(lv ? ['CEFR:' + lv] : []); if(sd.length) seed[c] = sd; }\n      else if(lv){ const prev = seen.filter(y => /^CEFR:/.test(y)).map(y => y.slice(5));   /* level up: a higher CEFR than any level recorded before */\n        if(!prev.length) bset[c] = ['CEFR:' + lv];\n        else if(prev.indexOf(lv) < 0){ const hi = Math.max(...prev.map(y => CEFR.indexOf(y))); if(CEFR.indexOf(lv) > hi){ const k = 'V|' + c + '|' + lv; if(!done[k]) out.push(Object.assign({ kind: 'level', k, from: CEFR[hi], to: lv, book: 'CEFR:' + lv, days: 0 }, base)); } else bset[c] = ['CEFR:' + lv]; } }\n      if(!seen){}"
],
[
"const now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()), out = [], seed = {};",
"const now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()), out = [], seed = {}, bset = {};"
],
[
"    if(Object.keys(seed).length){ Object.assign(CEL.books, seed); call('cel_seed', { map: seed }).catch(() => {}); }\n    const ord = { bday: 0, book: 1, miles: 2 };",
"    if(Object.keys(seed).length){ Object.assign(CEL.books, seed); call('cel_seed', { map: seed }).catch(() => {}); }\n    if(Object.keys(bset).length){ Object.keys(bset).forEach(c => CEL.books[c] = (CEL.books[c] || []).concat(bset[c])); call('cel_base', { map: bset }).catch(() => {}); }\n    const ord = { bday: 0, level: 1, book: 2, miles: 3 };"
],
[
"miles: ['🏅', 'Milestone', '#B7791F', '#FDF3E1'] };",
"miles: ['🏅', 'Milestone', '#B7791F', '#FDF3E1'], level: ['⭐', 'Level up', '#00737B', '#E3F6F6'] };"
],
[
"if(x.kind === 'book') return 'Moved up to ' + x.bookN; return x.n + ' lessons with CupOfEnglish'; }",
"if(x.kind === 'book') return 'Moved up to ' + x.bookN; if(x.kind === 'level') return 'Moved up from CEFR ' + x.from + ' to ' + x.to + (x.cur ? ' · ' + x.cur : ''); return x.n + ' lessons with CupOfEnglish' + (x.cur ? ' · ' + x.cur : ''); }"
],
[
"${nk ? nk + ' new book' + (nk === 1 ? '' : 's') + ' or milestone' + (nk === 1 ? '' : 's') : ''}",
"${nk ? nk + ' achievement' + (nk === 1 ? '' : 's') + ' (level up, new book or lessons)' : ''}"
],
[
"    if(x.kind === 'book') return `Congratulations, ${en}! 🎉 You have moved up to",
"    if(x.kind === 'level') return `Congratulations, ${en}! 🎉 Your English level has moved up from CEFR ${x.from} to ${x.to}. Your English is getting better and better. Your teachers at CupOfEnglish are cheering for you!\\n恭喜${cn}！🎉 英语水平从欧标${x.from}提升到${x.to}，你的英语越来越棒了！一杯英语全体老师为你喝彩！`;\n    if(x.kind === 'book') return `Congratulations, ${en}! 🎉 You have moved up to"
],
[
"window.celMark = async function(i, skip){ const x = ITEMS[i]; if(!x) return; const m = { k: x.k, kind: x.kind, code: x.code, skipped: !!skip, at: new Date().toISOString(), by: (D.me || {}).name || '' };\n    CEL.marks.push(m); if(x.kind === 'book'){ CEL.books[x.code] = (CEL.books[x.code] || []).concat(x.book); } paint(); closeSheet && closeSheet();\n    toast(x.en + ' · ' + (skip ? 'skipped' : 'marked sent'));\n    try{ await call('cel_mark', { k: x.k, kind: x.kind, code: x.code, name: x.en, detail: what(x), skip: !!skip, book: x.book || '' }); }\n    catch(err){ CEL.marks = CEL.marks.filter(y => y !== m); if(x.kind === 'book') CEL.books[x.code] = (CEL.books[x.code] || []).filter(b => b !== x.book); paint(); toast(err.message || 'Not saved. Try again.'); } ",
"window.celMark = async function(i, skip){ const x = ITEMS[i]; if(!x) return; const m = { k: x.k, kind: x.kind, code: x.code, skipped: !!skip, at: new Date().toISOString(), by: (D.me || {}).name || '' };\n    CEL.marks.push(m); if(x.kind === 'book' || x.kind === 'level'){ CEL.books[x.code] = (CEL.books[x.code] || []).concat(x.book); } paint(); closeSheet && closeSheet();\n    toast(x.en + ' · ' + (skip ? 'skipped' : 'marked sent'));\n    try{ await call('cel_mark', { k: x.k, kind: x.kind, code: x.code, name: x.en, detail: what(x), skip: !!skip, book: x.book || '' }); }\n    catch(err){ CEL.marks = CEL.marks.filter(y => y !== m); if(x.kind === 'book' || x.kind === 'level') CEL.books[x.code] = (CEL.books[x.code] || []).filter(b => b !== x.book); paint(); toast(err.message || 'Not saved. Try again.'); } "
],
[
"      : x.kind === 'book' ? ['New book · 新教材', x.bookN, '升级到新教材'] : ['Lessons completed · 已完成课时', x.n + ' lessons', x.n + '节课'];",
"      : x.kind === 'level' ? ['Level up · 级别提升', x.from + ' → ' + x.to, '欧标 ' + x.from + ' → ' + x.to] : x.kind === 'book' ? ['New book · 新教材', x.bookN, '升级到新教材'] : ['Lessons completed · 已完成课时', x.n + ' lessons', x.n + '节课'];"
],
[
"const col = (cx, L, w) => { c.fillStyle = MUTE; c.font = '400 20px ' + F; c.fillText(L[0], cx, 666); c.fillStyle = NAVY; fit(L[1], 38, B, w); c.fillText(L[1], cx, 716); c.fillStyle = '#4A4766'; c.font = '400 24px ' + F; c.fillText(L[2], cx, 754); };\n    if(L2 && !(x.kind === 'bday' && !(x.age > 0 && x.age < 100))){ col(CX + IW / 4, L1, IW / 2 - 30); col(CX + IW * 3 / 4, L2, IW / 2 - 30); c.fillStyle = '#EEF0F4'; c.fillRect(MX - 1, 640, 2, 124); } else col(MX, L1, IW - 60);",
"const col = (cx, L, w) => { c.fillStyle = MUTE; fit(L[0], 20, F, w); c.fillText(L[0], cx, 666); c.fillStyle = NAVY; fit(L[1], 38, B, w); c.fillText(L[1], cx, 716); c.fillStyle = '#4A4766'; fit(L[2], 24, F, w); c.fillText(L[2], cx, 754); };\n    const BK = x.cur ? ['Book · 教材', x.cur, '当前教材'] : null;\n    const LS = (x.kind === 'bday' ? (x.age > 0 && x.age < 100 ? [L1, L2] : [L1]) : x.kind === 'miles' ? [L1, BK, L2] : x.kind === 'level' ? [L1, BK] : [L1, L2]).filter(Boolean), cw = IW / LS.length;\n    LS.forEach((L, k) => { col(CX + cw * k + cw / 2, L, cw - 24); if(k){ c.fillStyle = '#EEF0F4'; c.fillRect(CX + cw * k - 1, 640, 2, 124); } });"
],
[
"x.kind === 'book' ? ['Onwards and upwards! Your hard work is paying off.', '更上一层楼！你的努力有了回报。'] :",
"x.kind === 'level' ? ['You have reached a new level! Your English is getting better and better.', '英语水平再上新台阶！你的英语越来越棒了。'] : x.kind === 'book' ? ['Onwards and upwards! Your hard work is paying off.', '更上一层楼！你的努力有了回报。'] :"
],
[
"let wy = 812; wrap(WI[0], IW - 60).forEach(",
"let wy = 812; wrapB(WI[0], IW - 60).forEach("
],
[
"    /* header: logo left, label right, thin line",
"    const wrapB = (t, max) => { const L = wrap(t, max); if(L.length !== 2) return L;   /* two even lines, split at the sentence when it fits */\n      const ss = String(t).match(/[^.!?]+[.!?]+/g); if(ss && ss.length === 2 && ss.every(q => c.measureText(q.trim()).width <= max)) return ss.map(q => q.trim());\n      const w = String(t).split(' '); let best = L, bd = 1e9; for(let k = 1; k < w.length; k++){ const a = w.slice(0, k).join(' '), b = w.slice(k).join(' '), wa = c.measureText(a).width, wb = c.measureText(b).width; if(wa <= max && wb <= max && Math.abs(wa - wb) < bd){ bd = Math.abs(wa - wb); best = [a, b]; } } return best; };\n    /* header: logo left, label right, thin line"
]
]);
