// 1251: (Misty, 26 Oct night: "all should be reading straight from Supabase") Trial report form opens from the database.
//   New read-only edge function coe-trf gives Google's tTrialForm answer (questions, "Already sent", family details) from the database.
//   It switches on by itself once Misty has run the Google paste SERVER-TRIALPROPS27 (it copies the form questions and the
//   "report sent / returned for redo" notes that only Google keeps); until then coe-trf says "fallback" and the form opens exactly as before.
//   With the database answer, Google is asked once a day per trial in the background; a difference is logged (coe_activity
//   tTrialFormCheck) and Google's answer is shown (only if "Already sent" or the family details differ — the same repaint as before).
require('../tools/lib.js')(process.argv[2], [
  ["const g376 = api('tTrialForm', TOKEN, TRC).then(r => { if(r && r.ok){",
   "let db1251 = null; try{ db1251 = await trDb1251(TRC); if(db1251) c376 = db1251; }catch(e){}\n" +
   "const g376 = (!db1251 || trChk1251(ck376) ? api('tTrialForm', TOKEN, TRC) : Promise.resolve(null)).then(r => { try{ if(db1251 && r && r.ok) trCmp1251(db1251, r, TRC); }catch(e){} if(r && r.ok){"],
  ["const trKey = () => 'coe.trd.' + TRC.date + '|' + String(TRC.student||'').toLowerCase();",
   "const trKey = () => 'coe.trd.' + TRC.date + '|' + String(TRC.student||'').toLowerCase();\n" +
   "/* 1251 · trial form from the database (coe-trf); null → the old way */\n" +
   "async function trDb1251(c){ if(typeof FAST_URL === 'undefined' || !TOKEN || (D && D.mgr)) return null; const ac = new AbortController(), t = setTimeout(() => ac.abort(), 2500);\n" +
   "  try{ const r = await fetch(FAST_URL + '-trf', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, c: { date: c.date, student: c.student, code: c.code || '' } }), signal: ac.signal }).then(x => x.json());\n" +
   "    return r && r.ok && r.form && Array.isArray(r.form.rate) ? Object.assign({}, r, { _db: 1 }) : null; }catch(e){ return null; } finally{ clearTimeout(t); } }\n" +
   "function trChk1251(k){ const d = new Date().toISOString().slice(0, 10), kk = 'coe.trfchk.' + k; try{ if(localStorage.getItem(kk) === d) return false; localStorage.setItem(kk, d); }catch(e){} return true; }\n" +
   "function trCmp1251(a, g, c){ const pick = x => JSON.stringify([x.done || null, x.family || null, (x.form && x.form.rate || []).map(q => [q.id, q.title, q.choices]), (x.form && x.form.text || []).map(q => q.id)]);\n" +
   "  if(pick(a) === pick(g)) return; try{ fetch(FAST_URL + '-trf', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, diff: { c: c, db: { done: a.done || null, family: a.family || null }, google: { done: g.done || null, family: g.family || null }, form: pick(Object.assign({}, a, { done: 0, family: 0 })) !== pick(Object.assign({}, g, { done: 0, family: 0 })) } }) }).catch(() => {}); }catch(e){} }"]]);
