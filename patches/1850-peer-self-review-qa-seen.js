// 1850: (Misty 7 Nov "for April the peer feedback since it's her this month, she should still give feedback to herself" ·
//        "ensure everything is directly to database not google" · QA evaluation "New" still showing on another device)
//   · Assign a peer review: the teacher being reviewed is on the reviewers list too, as "Self-review" (ticked like the others).
//   · Opening a peer review reads it from the database first (coe-peer › coe_peer + the form kept in the database); Google only
//     if the database does not answer. A submitted review is saved in the database at once (trigger coe_peer_submit).
//   · Teacher's list: a self-review reads "Your own class with … · self-review".
//   · QA evaluation "New": once opened on any device it is remembered in the database (coe-peer qaseen) and leaves every device.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  // reviewers list: include the teacher herself as "Self-review"
  ["const L = T.filter(x => x !== t), n = L.filter(x => PME[x] !== false).length;",
   "const L = t ? [t].concat(T.filter(x => x !== t)) : T.slice(), n = L.filter(x => PME[x] !== false).length;   /* 1850: self-review first */"],
  ["${L.map(x => `<button type=\"button\" class=\"${PME[x]!==false?'on':''}\" onclick=\"PME['${esc(x)}']=PME['${esc(x)}']===false;pmEvs()\">${esc(tName(x))}</button>`).join('')}",
   "${L.map(x => `<button type=\"button\" class=\"${PME[x]!==false?'on':''}\" onclick=\"PME['${esc(x)}']=PME['${esc(x)}']===false;pmEvs()\">${x === t ? 'Self-review · ' + esc(tName(x)) : esc(tName(x))}</button>`).join('')}"],
  ["function pmMiss(){ const t = ($('pmT')||{}).value || '', n = ((PM && PM.teachers) || []).filter(x => x !== t && PME[x] !== false).length;",
   "function pmMiss(){ const t = ($('pmT')||{}).value || '', n = ((PM && PM.teachers) || []).filter(x => PME[x] !== false).length;   /* 1850: self-review counts */"],
  ["evs = ((PM && PM.teachers) || []).filter(x => x !== t && PME[x] !== false);",
   "evs = ((PM && PM.teachers) || []).filter(x => PME[x] !== false);   /* 1850: the teacher herself too (self-review) */"],
  // teacher's list: self-review wording
  ["<div class=\"grow ell\">${esc(tName(x.teacher))}'s class${x.student?' with '+esc(x.student):''} · ${esc((window.d1481 ? d1481(x.date) : x.date))}</div>",
   "<div class=\"grow ell\">${String(x.teacher||'').toLowerCase() === String((D.me && D.me.name) || D.name || '').toLowerCase() ? 'Your own class' : esc(tName(x.teacher)) + '\\'s class'}${x.student?' with '+esc(x.student):''}${String(x.teacher||'').toLowerCase() === String((D.me && D.me.name) || D.name || '').toLowerCase() ? ' · self-review' : ''} · ${esc((window.d1481 ? d1481(x.date) : x.date))}</div>"],
  // QA "New": remember opened in the database
  ["todo.push(`<div class=\"li\" onclick=\"store('set','coe.qaseen','${e.ts}');go('qa')\">",
   "todo.push(`<div class=\"li\" onclick=\"store('set','coe.qaseen','${e.ts}');try{window.qaSeen1850&&qaSeen1850(${+e.ts||0})}catch(x){};go('qa')\">"],
  ["\n</body>", "\n<script>\n/* 1850 · peer review form from the database first · QA evaluation \"opened\" kept in the database */\n(function(){\n"
   + "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-peer';\n"
   + "  const call = b => fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: (typeof TOKEN !== 'undefined' && TOKEN) || '' }, b)) }).then(r => r.json());\n"
   + "  const base = window.api; if(typeof base === 'function' && !base.__1850){\n"
   + "    const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a));\n"
   + "      if(fn === 'tPeerForm' && a[1]) return call({ action: 'form', id: String(a[1]) }).then(r => (r && (r.ok || (r.msg && !r.fallback))) ? r : go(), go);\n"
   + "      return base.apply(this, arguments); };\n"
   + "    w.__1850 = 1; Object.keys(base).forEach(k => { try{ w[k] = base[k]; }catch(e){} }); window.api = w; try{ api = w; }catch(e){}\n"
   + "  }\n"
   + "  window.qaSeen1850 = function(ts){ if(!ts) return; call({ action: 'qaseen', ts: ts }).catch(() => {}); };\n"
   + "  let done = 0; function pull(){ if(done || typeof TOKEN === 'undefined' || !TOKEN || typeof D === 'undefined' || !D || D.mgr) return; done = 1;\n"
   + "    call({ action: 'qaseen' }).then(r => { if(!(r && r.ok && r.ts)) return; let cur = 0; try{ cur = +(store('get', 'coe.qaseen') || 0); }catch(e){}\n"
   + "      if(+r.ts > cur){ try{ store('set', 'coe.qaseen', String(r.ts)); }catch(e){} try{ if(typeof renderToday === 'function') renderToday(); }catch(e){} } }).catch(() => { done = 0; }); }\n"
   + "  setTimeout(pull, 2500); setInterval(pull, 60000);\n"
   + "})();\n</script>\n</body>"]]);
