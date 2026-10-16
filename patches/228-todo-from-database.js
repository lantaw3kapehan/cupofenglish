// 16 Oct · To do worked out by the database (edge function coe-today, every 3 min, identical to Google's TODAY 111/111 rows).
// Used when docs 'sys:todaylive' says on and the database's copy is under 10 minutes old; otherwise Google's TODAY as before.
require('../tools/lib.js')(process.argv[2], [
["try{ await swr('mtoday', () => api('mgmtTab', TOKEN, 'TODAY'), v => TD = v, renderMToday); }",
 "try{ await swr('mtoday', () => tdDbGet().then(d => d || api('mgmtTab', TOKEN, 'TODAY')), v => TD = v, renderMToday); }"],
["async function loadMToday(quiet){ urls();",
 "async function tdDbGet(){ try{ if(!TOKEN || !(D && D.mgr)) return null; const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 4000) : 0;\n  const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:todaydb', 'sys:todaylive'] }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid));\n  const d = r && r.ok && r.docs && r.docs['sys:todaydb'], on = r && r.ok && r.docs && r.docs['sys:todaylive'];\n  if(!d || !on || !on.data || !on.data.on || !d.data || !Array.isArray(d.data.rows) || Date.now() - Date.parse(d.at) > 10 * 6e4) return null;\n  return { rows: d.data.rows, db: true }; }catch(e){ return null; } }\nasync function loadMToday(quiet){ urls();"],
["${upd ? 'Updated ' + esc(upd) + ' · ' : ''}from the TODAY tab${sheetLink('TODAY')}", "${upd ? 'Updated ' + esc(upd) + ' · ' : ''}${TD && TD.db ? 'worked out live by the database' : 'from the TODAY tab'}${sheetLink('TODAY')}"],
]);
