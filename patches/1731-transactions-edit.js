// 1731: (Misty 4 Nov 11:27, "go ahead" · database-first plan, stage 2) Finance › Transactions: tap a line › "✎ Edit" corrects the sale
//   (date, invoice name, lessons, free, partner, method, RMB, PHP) or the expense (date, description, category, amount) straight in the
//   database, with a reason, history and Undo, like ✎ Fix on the student card. Google's sheet follows within a minute.
//   Also fixes a clash from 1726: "✎ Fix" took the name fxOpen, which the Transactions list used to open a line, so tapping a line
//   showed "No student code". The list now uses fxRow.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  // the Transactions list: its own name for opening a line
  ["window.fxOpen = k => { OPEN = OPEN === k ? '' : k; rp(); };", "window.fxRow = k => { OPEN = OPEN === k ? '' : k; rp(); };   /* 1731: was fxOpen (clashed with ✎ Fix) */"],
  ["onclick=\"fxOpen(\\'' + esc(key)", "onclick=\"fxRow(\\'' + esc(key)"],
  // each line keeps its record key
  ["const E = ((src || F).rows || []).map(r => ({ k: 'out', d: r.d, t: r.t || '—', c: r.c || 'Other', a: r.a, q: r.q, ref: '' }));",
   "const E = ((src || F).rows || []).map(r => ({ k: 'out', d: r.d, t: r.t || '—', c: r.c || 'Other', a: r.a, q: r.q, ref: '', key: r.key }));"],
  ["rmb: r.rmb }));", "rmb: r.rmb, key: r.key }));"],
  // the Edit button in the opened line
  ["it('Record', r.q ? 'Saving to COE DATABASE › EXPENSES' : 'COE DATABASE › EXPENSES')) + '</div></td></tr>';",
   "it('Record', r.q ? 'Saving to COE DATABASE › EXPENSES' : 'COE DATABASE › EXPENSES')) + '</div>' + (r.key && typeof fxTx === 'function' ? '<button class=\"btn sm\" style=\"margin:8px 0 2px\" onclick=\"event.stopPropagation();fxTx(\\'' + (r.k === 'in' ? 'sale' : 'expense') + '\\',\\'' + encodeURIComponent(r.key).replace(/'/g, '%27') + '\\')\">✎ Edit</button>' : r.q ? '<div class=\"small mute\" style=\"margin-top:6px\">Can be edited once Google has saved it (about a minute)</div>' : '') + '</td></tr>';"],
  // ✎ Fix sheet: opened from Transactions → Back closes, Save refreshes the list
  ["openSheet('<button class=\"btn ghost sm\" onclick=\"fxOpen()\">‹ Back</button><h1 style=\"margin-top:8px\">' + H(r.label) + '</h1>'",
   "openSheet('<button class=\"btn ghost sm\" onclick=\"fxBack()\">‹ Back</button><h1 style=\"margin-top:8px\">' + H(r.label) + '</h1>' + (r.same > 1 ? '<div class=\"small\" style=\"color:#B7791F;margin:4px 0\">' + r.same + ' identical lines (same date, description and amount) · a change applies to all of them</div>' : '')"],
  ["setTimeout(() => { try{ if(code) openStudent(code); }catch(e){} }, 400); };",
   "setTimeout(() => { try{ if(FX && FX.tx){ closeSheet(); txRefresh(); } else if(code) openStudent(code); }catch(e){} }, 400); };"],
  ["  window.fxUndo = async function(id){",
   "  /* 1731 · Finance › Transactions */\n" +
   "  const txRefresh = async () => { try{ const r = await fetch(FAST_URL + '-expenses', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(x => x.json());\n" +
   "    if(r && r.ok){ try{ localStorage.setItem('coe.exp', JSON.stringify({ rows: r.rows, sales: r.sales || [], at: r.at })); }catch(e){} const X = window.__exX; if(X){ X.rows = r.rows; X.sales = r.sales || []; X.at = r.at; if(VIEW === 'expenses' && window.exPaint2) exPaint2(X); } } }catch(e){} };\n" +
   "  window.fxTx = function(kind, key){ FX = { code: '', tx: 1 }; return fxRec(kind, key); };\n" +
   "  window.fxBack = function(){ if(FX && FX.tx) return closeSheet(); return fxOpen(); };\n" +
   "  window.fxUndo = async function(id){"],
  ["toast('✓ Undone'); fresh(); const R = FX && FX.rec;", "toast('✓ Undone'); fresh(); if(FX && FX.tx) txRefresh(); const R = FX && FX.rec;"],
]);
