// 16 Oct · System health counted only the warm-up (1 h) as Google's daily time; the every-minute job (about 3.5 h today)
// was missing. The gauge now adds both (docs sys:budget2, written by Google every 10 min).
require('../tools/lib.js')(process.argv[2], [
["async function loadHealth(){ try{ HL = await api('mgmtHealth', TOKEN);",
 "async function hlBudget(){ try{ const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:budget2'] }) }).then(x => x.json());\n  const b = r && r.ok && r.docs && r.docs['sys:budget2'] && r.docs['sys:budget2'].data; if(!b || b.day !== ymdLocal(new Date()) || !HL || !HL.today) return;\n  const dr = (+b.drainAllSec || 0) / 3600, wm = (+b.warmSec || 0) / 3600; HL.today.drain = Math.round(dr * 10) / 10; HL.today.warm = Math.round(wm * 10) / 10; HL.today.hours = Math.round((dr + wm) * 10) / 10; }catch(e){} }\nasync function loadHealth(){ try{ HL = await api('mgmtHealth', TOKEN); await hlBudget();"],
["<div>Background time today: ${HL.today.hours} h of about ${HL.today.budget} h · ${HL.today.runs} runs</div>",
 "<div>Background time today: ${HL.today.hours} h of about ${HL.today.budget} h${HL.today.drain != null ? ' · every-minute job ' + HL.today.drain + ' h + warm-up ' + HL.today.warm + ' h' : ' · ' + HL.today.runs + ' runs'}</div>"],
]);
