// 16 Oct · a new student is saved through the database at once: the database hands out the next code (coe-mgmt › newCode,
// never twice) and the record shows on DATABASE at once; Google adds the sheet row within a minute (same checks as before).
// A new student linked to a trial report still goes to Google directly.
require('../tools/lib.js')(process.argv[2], [
["!(fn === 'saveStudent' && (!Number(args[2]) || !args[1] || args[1].linkTrial))",
 "!(fn === 'saveStudent' && (!args[1] || args[1].linkTrial || (!Number(args[2]) && !/^ST-\\d{4}-\\d{3}$/.test(String(args[1].code || '').trim()))))"],
["try{ const r = await api('saveStudent', TOKEN, f, row || 0); if(!r.ok) throw r; toast(r.note);",
 "try{ if(!row && !f.linkTrial && !/^ST-\\d{4}-\\d{3}$/.test(String(f.code || '').trim())){ try{ const nc = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'newCode', token: TOKEN }) }).then(x => x.json()); if(nc && nc.ok && nc.code) f.code = nc.code; }catch(e){} }   /* 16 Oct: the database hands out the code, so the save is instant */\nconst r = await api('saveStudent', TOKEN, f, row || 0); if(!r.ok) throw r; toast(r.note);"],
["return { ok: true, queued: true, code: c, row: Number(args[2]) || 0, linked: 0, note: 'Saved ' + c + ' · ' + who }; }",
 "return { ok: true, queued: true, code: c, row: Number(args[2]) || 0, linked: 0, note: (Number(args[2]) ? 'Saved ' : 'Added ') + c + ' · ' + who }; }"],
]);
