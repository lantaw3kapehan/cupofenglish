// To do › Renewals: a student renewed in the last 30 days ("Renewed · 30+3 paid · Oct 13, 2026 · …" in ACTIVE › RENEWAL STATUS)
// leaves the act-now / this-month lists right away and shows under "Renewed ✓" until the TODAY sheet's next refresh drops them.
// (The TODAY sheet is a snapshot rebuilt on a timer, so it still showed Ellery with 2 left after her renewal.)
require('../tools/lib.js')(process.argv[2], [
[
"function renSt(code){ const t = String((REN||{})[String(code||'').toUpperCase()] || ''); if(!t) return { k:'' };",
"function renDone(t){ const m = /^Renewed\\b.*?([A-Z][a-z]{2} \\d{1,2}, \\d{4})/.exec(String(t || '')); if(!m) return false; const d = new Date(m[1] + ' 12:00'); return !isNaN(d) && Date.now() - d.getTime() < 30 * 864e5; }   /* renewed in the last 30 days */\n" +
"function renSt(code){ const t = String((REN||{})[String(code||'').toUpperCase()] || ''); if(!t) return { k:'' };\nif(renDone(t)) return { k:'done', c:'green', label: t.split(' · ').slice(0, 3).join(' · '), t };"
],
[
"const nNow = ren.filter(x => x.lv === 'now' && !/^(Not renewing|Paused|Renewing)/.test((REN||{})[String(x.r[1]).toUpperCase()]||'')).length,",
"const nNow = ren.filter(x => x.lv === 'now' && !/^(Not renewing|Paused|Renewing)/.test((REN||{})[String(x.r[1]).toUpperCase()]||'') && !renDone((REN||{})[String(x.r[1]).toUpperCase()])).length,"
],
[
"const isClosed = x => /^(Not renewing|Paused|Renewing)/.test((REN||{})[String(x.r[1]).toUpperCase()]||''),",
"const isClosed = x => /^(Not renewing|Paused|Renewing)/.test((REN||{})[String(x.r[1]).toUpperCase()]||'') || renDone((REN||{})[String(x.r[1]).toUpperCase()]),"
],
[
"const closed = c => /^(Not renewing|Paused|Renewing)/.test((REN||{})[String(c||'').toUpperCase()] || '');",
"const closed = c => /^(Not renewing|Paused|Renewing)/.test((REN||{})[String(c||'').toUpperCase()] || '') || renDone((REN||{})[String(c||'').toUpperCase()]);"
],
[
"if(s.k === 'no' || s.k === 'pause') x.lv = 'closed'; else if(s.k === 'yes') x.lv = 'yes';",
"if(s.k === 'no' || s.k === 'pause') x.lv = 'closed'; else if(s.k === 'yes') x.lv = 'yes'; else if(s.k === 'done') x.lv = 'done';"
],
[
"again = ag >= 3 && x.lv !== 'closed' && x.lv !== 'yes',",
"again = ag >= 3 && x.lv !== 'closed' && x.lv !== 'yes' && x.lv !== 'done',"
],
[
"<div class=\"tdb\">${x.rem && x.lv !== 'closed' && x.lv !== 'yes' ?",
"<div class=\"tdb\">${x.rem && x.lv !== 'closed' && x.lv !== 'yes' && x.lv !== 'done' ?"
],
[
"+ grp('closed','Paused or not renewing','no reminder needed · also marked in ACTIVE')",
"+ grp('closed','Paused or not renewing','no reminder needed · also marked in ACTIVE') + grp('done','Renewed ✓','paid · leaves this list when the TODAY sheet next updates')"
]
]);
