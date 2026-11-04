// 1728: (Misty, 4 Nov 10:28 "also the incentive") ✎ Fix › Referral incentive: the students this student referred, whether each one
//   counts now (free lesson set, Date recommended on/after the current package start), the incentive the sheet counts, and "+ Add a referral"
//   (sets the referred student's Source to this student, Date recommended = their first class, free lesson = 1). All through coe-edit (database first).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      '<h3 style=\"margin:14px 0 4px\">Changes</h3>' + hist(r.history)); };",
   "      incHtml(r) + '<h3 style=\"margin:14px 0 4px\">Changes</h3>' + hist(r.history)); };\n" +
   "  const incHtml = r => { const I = r.incentive; if(!I) return ''; const fd = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';\n" +
   "    return '<h3 style=\"margin:14px 0 4px\">Referral incentive <span class=\"chip green\" style=\"font-size:11px\">' + (+I.now || 0) + ' counted</span></h3><p class=\"small mute\" style=\"margin:0 0 6px\">One free lesson per referred student who enrolled on or after this package started' + (I.start ? ' (' + fd(I.start) + ')' : '') + '.</p>' +\n" +
   "      (I.refs.length ? I.refs.map(x => '<div class=\"row\" style=\"justify-content:space-between;gap:8px;padding:8px 0;border-top:1px solid var(--line)\"><div><b>' + H(x.name || x.code) + (x.cn ? ' ' + H(x.cn) : '') + '</b><div class=\"small mute\">' + H(x.code) + ' · recommended ' + fd(x.recommended) + ' · free lesson ' + (x.free || 0) + '</div>' +\n" +
   "        '<div class=\"small\" style=\"color:' + (x.counted ? '#00737B' : '#B4513B') + '\">' + (x.counted ? '✓ counts' : !x.free ? 'not counted · free lesson is 0' : !x.recommended ? 'not counted · no Date recommended' : 'not counted · before this package started') + '</div></div><button class=\"btn sm\" onclick=\"fxRec(\\'student\\',\\'' + encodeURIComponent(x.code) + '\\')\">Edit</button></div>').join('') : '<div class=\"small mute\">No referred students yet.</div>') +\n" +
   "      '<div class=\"row\" style=\"gap:8px;margin-top:8px\"><input id=\"fxRefC\" class=\"in-t\" placeholder=\"Referred student code, e.g. ST-2026-135\" style=\"flex:1\"><button class=\"btn sm teal\" onclick=\"fxAddRef()\">+ Add a referral</button></div>'; };\n" +
   "  window.fxAddRef = async function(){ const L = FX && FX.list; if(!L || !L.incentive) return; const rc = String((document.getElementById('fxRefC') || {}).value || '').trim().toUpperCase();\n" +
   "    if(!/^ST-\\d{4}-\\d{3}$/.test(rc)) return toast('Type the referred student\\'s code'); if(rc === FX.code) return toast('A student can\\'t refer themselves');\n" +
   "    let R; try{ R = await call('rec', { kind: 'student', key: rc }); }catch(e){} if(!R || !R.ok) return toast((R && R.error) || 'Student not found');\n" +
   "    const v = f => (R.fields.find(x => x.f === f) || {}).value || '', first = v('firstClass'), d0 = new Date(), today = d0.getFullYear() + '-' + ('0' + (d0.getMonth() + 1)).slice(-2) + '-' + ('0' + d0.getDate()).slice(-2);\n" +
   "    const ch = { source: L.incentive.me, recommended: v('recommended') || first || today, free: String(+v('free') > 0 ? v('free') : 1) };\n" +
   "    if(!confirm(R.label + '\\nreferred by ' + L.incentive.me + '\\nDate recommended ' + ch.recommended + ' · free lesson ' + ch.free + '\\n\\nSave?')) return;\n" +
   "    let r; try{ r = await call('save', { kind: 'student', key: rc, changes: ch, reason: 'Referral: referred by ' + FX.code }); }catch(e){ r = { ok: false, error: 'No connection' }; }\n" +
   "    if(!r || !r.ok) return toast((r && r.error) || 'Not saved'); toast('✓ Referral saved · the incentive shows after the sheet recalculates (1–2 min)'); fresh(); fxOpen(FX.code); };"]
]);
