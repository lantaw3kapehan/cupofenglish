// 1732: (Misty 4 Nov 11:57, "ensure that management can easily edit, correct, and remove if we needed to") ✎ Edit on a sale or an
//   expense line now has "Remove this line": with a one-line reason the line is marked REMOVED and its lessons / amounts set to 0, so it
//   leaves every total, list and partner page at once (database first); nothing is erased and Undo in the history brings it back exactly.
//   The Google sheet (backup) keeps the line, marked REMOVED.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["onclick=\"fxSave()\">Save</button>",
   "onclick=\"fxSave()\">Save</button>' + (r.kind === 'sale' || r.kind === 'expense' ? '<button class=\"btn ghost block\" style=\"margin-top:8px;color:#B4513B;border-color:#E8B4A8\" onclick=\"fxRemove()\">Remove this line</button><div class=\"small mute\" style=\"margin-top:4px\">Removed lines leave every total and list; Undo below brings them back.</div>' : '') + '"],
  ["  window.fxTx = function(kind, key){",
   "  window.fxRemove = async function(){ const R = FX && FX.rec; if(!R) return; const why = ((document.getElementById('fx_why') || {}).value || '').trim(); if(!why){ toast('Write why (one line)'); const w = document.getElementById('fx_why'); if(w) w.focus(); return; }\n" +
   "    if(!confirm('Remove this line?\\n\\n' + R.label + '\\n\\nIt leaves every total and list. Undo brings it back.')) return;\n" +
   "    let r; try{ r = await call('remove', { kind: R.kind, key: R.key, reason: why }); }catch(e){ r = { ok: false, error: 'No connection · not removed' }; }\n" +
   "    if(!r || !r.ok) return toast((r && r.error) || 'Not removed'); toast('✓ Removed · Undo is in the history'); fresh();\n" +
   "    setTimeout(() => { try{ if(FX && FX.tx){ closeSheet(); txRefresh(); } else if(FX && FX.code) openStudent(FX.code); else closeSheet(); }catch(e){} }, 400); };\n" +
   "  window.fxTx = function(kind, key){"],
]);
