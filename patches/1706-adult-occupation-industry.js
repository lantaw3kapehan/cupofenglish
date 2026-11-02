// 1706: (Misty, 2 Nov 10:32 + 10:43) "for adult can we put on their profile their occupation and industry? like for Mr David, he is in
//   Clothing Industry" · "yes add". On the student page of an adult (18+, or age not known), a "Work" line shows Occupation · Industry;
//   management taps Edit, types both and saves (kept in the database, coe-stuext › docs mgmt:stuext; the sheet is not changed).
//   Teachers see the same line on their student's page, so they can pick topics for the person's work. Children's pages are unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.swMine1676 = ",
   "  /* 1706 · adults: occupation and industry on the student page */\n" +
   "  try{ const SX1706 = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-stuext', XC1706 = {};\n" +
   "    const xget = (code, force) => { const k = String(code || '').toUpperCase(); if(!force && XC1706[k] && Date.now() - XC1706[k].t < 6e4) return XC1706[k].p;\n" +
   "      const p = fetch(SX1706, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: k }) }).then(r => r.json()).then(j => j && j.ok ? (j.x || null) : null).catch(() => null); XC1706[k] = { t: Date.now(), p }; return p; };\n" +
   "    const adult = code => { try{ const a = window.coeAge ? coeAge(code) : null; return !(a && a.age != null && a.age !== '' && +a.age < 18); }catch(e){ return true; } };\n" +
   "    const paint = (code, x, edit) => { const b = document.getElementById('sheetBody'); if(!b || !STU || String(STU.code).toUpperCase() !== String(code).toUpperCase()) return; let el = document.getElementById('occ1706');\n" +
   "      const mg = typeof D !== 'undefined' && D && D.mgr; if(!x && !mg) { if(el) el.remove(); return; }\n" +
   "      if(!el){ const at = document.getElementById('wxG') || b.querySelector('h1'); if(!at) return; at.insertAdjacentHTML('afterend', '<div id=\"occ1706\" class=\"small\" style=\"margin:2px 0 8px;color:#5E5A75\"></div>'); el = document.getElementById('occ1706'); }\n" +
   "      const o = (x && x.occ) || '', i = (x && x.ind) || '';\n" +
   "      el.innerHTML = edit ? '<div style=\"display:flex;gap:8px;flex-wrap:wrap;align-items:center\"><b style=\"color:#2B2253\">Work</b><input id=\"occO\" class=\"in-t\" style=\"flex:1;min-width:150px;padding:6px 10px\" placeholder=\"Occupation · e.g. Sales manager\" maxlength=\"80\" value=\"' + esc(o) + '\"><input id=\"occI\" class=\"in-t\" style=\"flex:1;min-width:150px;padding:6px 10px\" placeholder=\"Industry · e.g. Clothing\" maxlength=\"80\" value=\"' + esc(i) + '\"><button type=\"button\" class=\"btn teal sm\" onclick=\"occSave1706(\\'' + esc(code) + '\\')\">Save</button><button type=\"button\" class=\"btn ghost sm\" onclick=\"occShow1706(\\'' + esc(code) + '\\')\">Cancel</button></div>'\n" +
   "        : 'Work: <b style=\"color:#2B2253\">' + (o || i ? esc([o, i ? i + (/industry/i.test(i) ? '' : ' industry') : ''].filter(Boolean).join(' · ')) : '<span style=\"font-weight:400;color:#8A86A0\">occupation and industry not added</span>') + '</b>' + (mg ? ' <button type=\"button\" class=\"btn ghost sm\" style=\"padding:3px 10px\" onclick=\"occEdit1706(\\'' + esc(code) + '\\')\">' + (o || i ? 'Edit' : 'Add') + '</button>' : ''); };\n" +
   "    window.occShow1706 = code => xget(code).then(x => paint(code, x, false));\n" +
   "    window.occEdit1706 = code => xget(code).then(x => { paint(code, x, true); try{ document.getElementById('occO').focus(); }catch(e){} });\n" +
   "    window.occSave1706 = async code => { const occ = (document.getElementById('occO') || {}).value || '', ind = (document.getElementById('occI') || {}).value || '';\n" +
   "      try{ const j = await fetch(SX1706, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: code, set: { occ, ind } }) }).then(r => r.json());\n" +
   "        if(!j || !j.ok) throw new Error((j && (j.msg || j.error)) || 'not saved'); XC1706[String(code).toUpperCase()] = { t: Date.now(), p: Promise.resolve(j.x || null) }; paint(code, j.x || null, false); toast('Saved · work details'); }catch(e){ toast('Not saved · ' + e.message); } };\n" +
   "    const _sr1706 = window.stuRender; if(typeof _sr1706 === 'function') window.stuRender = function(){ const r = _sr1706.apply(this, arguments);\n" +
   "      try{ if(STU && STU.code && adult(STU.code) && !document.getElementById('occ1706')){ const c = STU.code; xget(c).then(x => paint(c, x, false)); } }catch(e){} return r; };\n" +
   "  }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
