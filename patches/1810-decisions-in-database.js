// 1810: (Misty 6 Nov 16:20 "go ahead") The leave card's charge decision is saved in the database first and is the same on every
//   device: table coe_leave_credit via the server function coe-lvc (management only), published with the feed doc
//   (mgmt:feed1806 → dec). "No charge" no longer lives only on one phone. Charging: the decision (lessons, amounts) is saved
//   first with state "saving", then one case per lesson is created (Google ACTIONS, which writes the case into the database at
//   once), then the decision is updated with the case numbers ("done", or "partial" if some failed). If the database save fails,
//   nothing is charged and the card says so.
const fs = require('fs'), file = process.argv[2]; let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { const c = s.split(a).length - 1; if(c !== 1) throw new Error('Expected 1 got ' + c + ' for ' + a.slice(0, 80)); s = s.replace(a, () => b); };
const A = s.indexOf('async function lvCredit1795(id, k){'), Bend = 'lvSheet(id); try{ AC = null; }catch(e){} }\n', B = s.indexOf(Bend, A);
if(A < 0 || B < 0) throw new Error('lvCredit1795 not found');
const NEW = "const LV1810_URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-lvc';\n"
  + "async function lv1810post(b){ try{ const r = await fetch(LV1810_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, op: 'set' }, b)) }).then(r => r.json()); return r && r.ok ? r : null; }catch(e){ return null; } }\n"
  + "function lv1810local(id, o){ try{ FD1806.dec = FD1806.dec || {}; FD1806.dec[id] = Object.assign({ by: String((D && D.me && D.me.name) || ''), at: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Manila', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }, o); }catch(e){} }\n"
  + "function lv1810done(x){ lv1808att(x.id); const d = typeof FD1806 !== 'undefined' && FD1806.dec ? FD1806.dec[x.id] : null;\n"
  + "  if(d) return { k: d.k + (+d.total ? ' · ₱' + (+d.total).toLocaleString() : '') + (d.state === 'saving' ? ' · cases not created yet' : d.state === 'partial' ? ' · some cases missing, check Cases' : ''), at: (d.at || '') + (d.by ? ' by ' + d.by : ''), ids: d.ids || '' };\n"
  + "  try{ const o = JSON.parse(localStorage.getItem('lv1795:' + x.id) || 'null'); if(o) o.at = o.at + ' (this device only, before 6 Nov 16:30)'; return o; }catch(e){ return null; } }\n"
  + "async function lvCredit1795(id, k){ const x = LV && LV.rows.find(r => r.id === id); if(!x) return; const tier = lv1800tier(x); if(!tier) return toast('Checking the teacher’s rank · try again in a moment');\n"
  + "  if(k === 'none'){ toast('Saving…'); const r = await lv1810post({ leave_id: id, teacher: x.teacher, decision: 'No charge', total: 0, tier: tier, state: 'done' });\n"
  + "    if(!r) return toast('Not saved · check the connection and try again'); lv1810local(id, { k: 'No charge', total: 0, state: 'done', ids: '' }); toast('✓ No charge recorded for ' + tName(x.teacher)); lvSheet(id); return; }\n"
  + "  const plan = lv1795plan(x).map(p => k === 'plan' || !p.ch ? p : Object.assign({}, p, { k: k })).filter(p => p.ch && (p.k === 'Excused' || p.k === 'Unexcused'));\n"
  + "  if(!plan.length) return toast('Nothing to charge');\n"
  + "  const total = plan.reduce((a, p) => a + LV1795_RATE[p.k][tier], 0), dec = k === 'plan' ? 'Suggested' : k === 'Excused' ? 'All excused' : 'All unexcused';\n"
  + "  if(!confirm(plan.map(p => p.md + ' ' + p.hm + ' ' + p.name + ' · ' + p.k + ' ₱' + LV1795_RATE[p.k][tier]).join('\\n') + '\\n\\nTotal ₱' + total.toLocaleString() + ' for ' + tName(x.teacher) + ' · one Teacher Class Cancellation case per lesson?\\n\\nClause 5.1: then send the notice of breach for each case (Cases › the case) before the credit is taken.')) return;\n"
  + "  toast('Saving the decision…'); const r0 = await lv1810post({ leave_id: id, teacher: x.teacher, decision: dec, tier: tier, total: total, state: 'saving', lessons: plan.map(p => ({ md: p.md, hm: p.hm, name: p.name, k: p.k, amount: LV1795_RATE[p.k][tier] })) });   /* 1810: database first */\n"
  + "  if(!r0) return toast('Not saved · nothing was charged · check the connection and try again');\n"
  + "  lv1810local(id, { k: dec, total: total, state: 'saving', ids: '' }); toast('Creating ' + plan.length + ' case' + (plan.length === 1 ? '' : 's') + '…'); const ids = [];\n"
  + "  for(const c of plan){ const amt = LV1795_RATE[c.k][tier]; try{ const r = await api('addCase', TOKEN, { subject: 'Teacher Class Cancellation', source: 'Teacher', assigned: 'Operations', type: 'Attendance', employee: x.teacher, student: c.name, condition: c.k, status: tier, amount: amt, done: true,\n"
  + "      action: 'Notice of unavailability ' + id + ' · ' + lv1795h(c.h) + ' notice · lesson ' + c.md + ' ' + c.hm + ' · ' + (/^Declined/i.test(x.status || '') ? 'missed after the notice was declined · Clause 2.10 / 4.1' : 'Clause 2.9 / 4.1') }); if(r && r.ok) ids.push(r.caseId); }catch(e){} }\n"
  + "  const st = ids.length === plan.length ? 'done' : 'partial'; await lv1810post({ id: r0.id, state: st, case_ids: ids }); lv1810local(id, { k: dec, total: total, state: st, ids: ids.join(', ') });\n"
  + "  toast(st === 'done' ? '✓ ' + ids.length + ' case' + (ids.length === 1 ? '' : 's') + ' saved · ' + ids.join(', ') : ids.length + ' of ' + plan.length + ' cases saved · check Cases'); lvSheet(id); try{ AC = null; }catch(e){} }\n";
s = s.slice(0, A) + NEW + s.slice(B + Bend.length);
rep("FD1806.att = d.data.att || {}; FD1806.at = Date.now();", "FD1806.att = d.data.att || {}; FD1806.dec = d.data.dec || {}; FD1806.at = Date.now();");
rep("FD1806.att = d.data.att || {}; if(!FD1806.items)", "FD1806.att = d.data.att || {}; FD1806.dec = Object.assign({}, d.data.dec || {}, FD1806.dec && FD1806.decKeep ? FD1806.dec : {}); if(!FD1806.items)");
rep("done = (() => { try{ return JSON.parse(localStorage.getItem('lv1795:' + x.id) || 'null'); }catch(e){ return null; } })()", "done = lv1810done(x)");
rep("✓ Recorded on this device: <b>", "✓ Recorded: <b>");
const m = s.match(/const COE_V = (\d+);/); s = s.replace(m[0], 'const COE_V = ' + (+m[1] + 1) + ';'); console.log('COE_V ' + m[1] + ' → ' + (+m[1] + 1));
fs.writeFileSync(file, s);
