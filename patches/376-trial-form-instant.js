// 20 Oct · The teacher's trial form opened only after Google answered (skeleton for many seconds). The questions are the same for every trial, so the form
// opens at once from the questions kept on the device (or from the database copy, coe-trials v2), with "Already sent" from the database's report list;
// Google's own answer still comes in the background and fills the family's notes / "Already sent" if it adds anything.
require('../tools/lib.js')(process.argv[2], [
  ["try{ TRF = await fastGet('coe.doc.trf.' + TRC.date + '|' + String(TRC.student||'').toLowerCase(), () => api('tTrialForm', TOKEN, TRC)); }catch(e){ TRF = { ok:false, msg:'Could not open the trial form. Check your internet.' }; }",
   "const ck376 = 'coe.doc.trf.' + TRC.date + '|' + String(TRC.student||'').toLowerCase(), Q376 = TRC; let c376 = null; try{ c376 = JSON.parse(store('get', ck376) || 'null'); }catch(e){}\n" +
   "if(!(c376 && c376.ok)){ try{ const t = JSON.parse(store('get', 'coe.trf.tpl') || 'null'); if(t && t.ok && t.form) c376 = Object.assign({}, t, { done: null, family: null, _tpl: 1 }); }catch(e){} }\n" +
   "const g376 = api('tTrialForm', TOKEN, TRC).then(r => { if(r && r.ok){ r._at = Date.now(); try{ store('set', ck376, JSON.stringify(r)); store('set', 'coe.trf.tpl', JSON.stringify({ ok: true, form: r.form, levels: r.levels || null })); }catch(e){} } return r; });\n" +
   "if(!(c376 && c376.ok)){ try{ const d = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, as: (D.me && D.me.name) || '', form: true }) }).then(x => x.json());\n" +
   "  if(d && d.ok && d.form && d.form.form){ c376 = Object.assign({}, d.form, { _tpl: 1 }); const lo = new Date(Date.parse(TRC.date + 'T00:00:00Z') - 3 * 864e5).toISOString().slice(0, 10), s0 = String(TRC.student || '').trim().toLowerCase(), k0 = String(TRC.code || '').trim().toUpperCase();\n" +
   "    const hit = (d.list || []).find(x => x.d >= lo && ((k0 && x.c === k0) || x.s === s0)); if(hit) c376.done = { at: hit.d }; try{ store('set', 'coe.trf.tpl', JSON.stringify({ ok: true, form: d.form.form, levels: d.form.levels || null })); }catch(e){} } }catch(e){} }\n" +
   "if(c376 && c376.ok){ TRF = c376; g376.then(r => { try{ if(!(r && r.ok) || TRC !== Q376 || !$('sheet').classList.contains('on')) return; const ch = JSON.stringify([r.done, r.family]) !== JSON.stringify([TRF.done, TRF.family]) && (r.done || r.family); TRF = r; if(ch) trPaint(); }catch(e){} }).catch(() => {}); }\n" +
   "else { try{ TRF = await g376; }catch(e){ TRF = { ok:false, msg:'Could not open the trial form. Check your internet.' }; } }"]
]);
