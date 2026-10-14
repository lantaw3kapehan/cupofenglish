// 14 Oct · CEFR journey (Misty, Gaby ST-2023-087): the ladder starts from the TRIAL CLASS level in DATABASE (e.g. A1 · OD1, Dec 2023)
// and climbs to the current level in ENROLLMENT › CEFR & BOOKS (e.g. A2 · REF); books show under Start and the latest step.
// The lesson total uses ENROLLMENT › TOTAL from DATABASE when it is higher than what the app has recorded month by month.
require('../tools/lib.js')(process.argv[2], [
["const chain = String(col(/CEFR\\s*&\\s*BOOKS/i) || '').split(/→|->/).map(cjLv).filter(i => i >= 0);",
 "const cbTxt = String(col(/CEFR\\s*&\\s*BOOKS/i) || ''), chain0 = cbTxt.split(/→|->/).map(cjLv).filter(i => i >= 0), dbTr = cjLv(col(/TRIAL CLASS\\s*·\\s*CEFR/i)), curBk = (cbTxt.split(/→|->/).pop().split(',')[1] || '').trim();\n" +
 "const chain = dbTr >= 0 && (!chain0.length || dbTr < chain0[0]) ? [dbTr].concat(chain0) : chain0;   /* 14 Oct: start from the trial level in DATABASE, then the levels since */"],
["tr = r.trial && cjLv(r.trial.cefr) >= 0 ? r.trial : null, T = [];",
 "tr = r.trial && cjLv(r.trial.cefr) >= 0 ? r.trial : (dbTr >= 0 && cjDay(col(/TRIAL CLASS\\s*·\\s*DATE/i)) ? { date: col(/TRIAL CLASS\\s*·\\s*DATE/i), cefr: col(/TRIAL CLASS\\s*·\\s*CEFR/i) } : null), T = [];"],
["i: chain[0], en: 'Started with us', zh: '入学起点', start: 1 });",
 "i: chain[0], en: 'Started with us', zh: '入学起点', start: 1, bk: dbTr >= 0 && chain[0] === dbTr ? String(col(/TRIAL CLASS\\s*·\\s*BOOK/i) || '').trim() : (chain.length === 1 ? curBk : '') });"],
["chain.slice(1).forEach(i => T.push({ d: '', i, en: 'Levelled up', zh: '升级' }));",
 "chain.slice(1).forEach((i, k, a) => T.push({ d: '', i, en: 'Levelled up', zh: '升级', bk: k === a.length - 1 ? curBk : '' }));"],
["tot = rd(MO.reduce((a, x) => a + U(x), 0));",
 "tot0 = rd(MO.reduce((a, x) => a + U(x), 0)), tot = Math.max(tot0, Number(String(col(/ENROLLMENT\\s*·\\s*TOTAL/i) || '').replace(/[^\\d.]/g, '')) || 0);   /* 14 Oct: DATABASE total when higher */"],
["'<br><em>' + ev(x) + '</em>' + (x.u > 0",
 "'<br><em>' + ev(x) + '</em>' + (x.bk ? '<br><small><b>' + esc(x.bk) + '</b></small>' : '') + (x.u > 0"],
["<div class=\"mute\" style=\"margin-top:2px\">By book 按教材: ",
 "<div class=\"mute\" style=\"margin-top:2px\">' + (tot > tot0 ? 'Since ' + esc(mon(MO.map(x => x.m).sort()[0] + '-01')) + ' in the app · ' : '') + 'By book 按教材: "],
["const EV = x => x.start ? '入学 Start' : /^Renew/.test(x.en) ? '续费 Renewed' : /^Trial/.test(x.en) ? '试听 Trial' : /^Level/.test(x.en) ? '升级 Up' : '测评 Check';",
 "const EV0 = x => x.start ? '入学 Start' : /^Renew/.test(x.en) ? '续费 Renewed' : /^Trial/.test(x.en) ? '试听 Trial' : /^Level/.test(x.en) ? '升级 Up' : '测评 Check', EV = x => EV0(x) + (x.bk ? ' · ' + x.bk : '');"],
]);
