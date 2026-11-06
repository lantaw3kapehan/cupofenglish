// 1804: (Misty 6 Nov 15:53 "teachers may dispute that if wrong") So every charge can be checked:
//   1. The leave card (management) and the teacher's notice form get "Read the clauses": the exact words of Addendum No. 1
//      v1.0, Clauses 2.9, 4.1 (definitions and the cancellation row), 5.1 and 5.2.
//   2. The management card shows whether the teacher has signed Addendum No. 1 (coe-contract list). Clause 1.4: it applies only
//      from both signatures; if not signed (e.g. Julia declined; Martin, Virgo, Lovely not yet), the card says the old terms apply.
const lib = require('../tools/lib.js'), file = process.argv[2];
const FN = "function lv1804clauses(){ const q = (n, t) => '<div style=\"margin-top:6px\"><b>Clause ' + n + '</b> · ' + t + '</div>';   /* 1804: exact text, Addendum No. 1 v1.0 */\n"
  + "  return '<details class=\"lv95x\" style=\"margin-top:8px;font-size:12.5px;line-height:1.5\"><summary style=\"cursor:pointer;font-weight:600;color:#1F6E6A\">Read the clauses (Addendum No. 1)</summary>'\n"
  + "    + q('2.9 Notice of unavailability', '“If the Teacher cannot deliver an accepted lesson, the Teacher files a notice of unavailability in the App, with proof where available, at least four (4) hours before the lesson. Operations reviews it, and the President confirms any reassignment of the lesson.”')\n"
  + "    + q('4.1 Service credits', '“When a requirement in Section 2 or 3 is not met and the case is verified under Clause 5.1, the amount below is credited back to the Company from the Teacher’s next service fee. “Excused” means Operations was notified in advance with a valid reason; “unexcused” means it was not. “New” means the Teacher’s first sixty (60) days of service; “regular” means from day sixty-one (61).” · Cancelled, missed or absent lesson: excused ₱100 new / ₱300 regular · unexcused ₱300 new / ₱500 regular.')\n"
  + "    + q('5.1 Procedure', '“Before any service credit, pause or termination for cause, the Company: sends the Teacher a notice of breach in the App, stating the rule, the record and what may follow; gives the Teacher five (5) calendar days from receipt of the notice to explain in writing, with any proof…; decides in writing in the App, stating the reasons…”')\n"
  + "    + q('5.2 Pause in lesson offers', 'After Clause 5.1, lesson offers may be paused up to 30 days for “a third case of the same kind (lateness, cancellation, absence or missed lesson) in one calendar month”.')\n"
  + "    + q('1.4 Effectivity', '“This Addendum takes effect when the Teacher has signed it in the App and the President has countersigned it, and applies only from that date.”')\n"
  + "    + '</details>'; }\n"
  + "const LVCT1804 = { at: 0, d: null, p: null };\n"
  + "function lv1804signed(t, day){ if(!LVCT1804.d && !LVCT1804.p && Date.now() - LVCT1804.at > 6e4){ LVCT1804.at = Date.now();\n"
  + "    LVCT1804.p = fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-contract', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'list' }) }).then(r => r.json()).then(j => { LVCT1804.d = j && j.rows ? j : null; }).catch(() => {})\n"
  + "      .finally(() => { LVCT1804.p = null; try{ const b = document.querySelector('.lv95box'), x = b && LVF && LVF.id && LV && LV.rows.find(r => r.id === LVF.id); if(x){ const h = lvc1795(x); if(h) b.outerHTML = h; } }catch(e){} }); }\n"
  + "  const D = LVCT1804.d; if(!D) return null; const doc = (D.docs || []).find(d => d.kind === 'addendum'); if(!doc) return null;\n"
  + "  const r = (D.rows || []).find(r => r.doc_id === doc.id && !r.void_at && String(r.teacher || '').toLowerCase() === String(t || '').toLowerCase());\n"
  + "  const on = r && ((r.status === 'signed' && r.pres_at) || r.status === 'paper'), when = r && String(r.pres_at || r.paper_date || r.signed_at || '').slice(0, 10);\n"
  + "  if(on && (!day || when <= String(day).slice(0, 10))) return lv1795line('ok', '✓ Addendum No. 1 signed by both · ' + esc(when) + ' · these clauses apply');\n"
  + "  if(on) return lv1795line('bad', 'Addendum No. 1 signed ' + esc(when) + ', after this notice · Clause 1.4: it applies only from that date · use the old terms');\n"
  + "  return lv1795line('bad', 'Addendum No. 1 not signed (' + esc(r ? r.status : 'not sent') + ') · Clause 1.4: these clauses do not apply · the old terms (Agreement, Part A) apply until it is signed'); }\n";
lib(file, [
  ["function lv1795count(rows, teacher, upto){", FN + "function lv1795count(rows, teacher, upto){"],
  ["    + '<div class=\"lv95t\">' + rows + '</div>'\n", "    + (lv1804signed(x.teacher, x.from) || '')   /* 1804 */\n    + '<div class=\"lv95t\">' + rows + '</div>'\n"],
  ["\n    + '</div>'; }\n", "\n    + lv1804clauses() + '</div>'; }\n"],
  ["  TLV1795.needAck = n > 0 && h0 < 4;", "  out += lv1804clauses();   /* 1804 */\n  TLV1795.needAck = n > 0 && h0 < 4;"],
]);
