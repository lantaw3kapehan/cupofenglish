// 1735: (Misty 4 Nov 13:12, after a remittance was recorded from Alipay instead of CCB: "if we made a mistake, I hope we can easily
//   make edit on the app") Wallet activity › every entry has "Edit" next to "Undo": the same form opens filled in (account, to, amount,
//   charge, pesos, date, note); Save records the corrected entry and then undoes the old one (it stays in the history, struck through).
//   Entries are still never changed in place (the database refuses edits), so every correction is visible.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ['<button class="btn ghost sm" onclick="wlUndo(${x.id})">Undo</button>',
   '<button class="btn ghost sm" onclick="wlEdit(${x.id})">Edit</button> <button class="btn ghost sm" onclick="wlUndo(${x.id})">Undo</button>'],
  ["in: 'Record other money in or out' }[k];",
   "in: 'Record other money in or out' }[k] + (F.edit ? ' · correcting an entry' : '');"],
  ["ST && (ST.wallets = r.wallets); close_();",
   "if(F.edit){ try{ const u = await call('undo', { id: F.edit }); if(u && u.wallets) r.wallets = u.wallets; }catch(u){ alert('The corrected entry is saved, but the old one could not be undone. Undo it in Wallet activity.'); } }   /* 1735 */\n    ST && (ST.wallets = r.wallets); close_();"],
  ["window.wlUndo = async id => {",
   "window.wlEdit = id => { const x = (ST.entries || []).find(y => y.id === id); if(!x || x.void_at) return;   /* 1735 */\n  F = { kind: x.kind, wallet: x.wallet, to: x.to_wallet || undefined, wlA: String(+x.cny), wlFee: +x.fee ? String(+x.fee) : (x.kind === 'remit' ? '0' : ''), wlP: x.php ? String(+x.php) : '', wlD: x.day, wlN: x.note || '', edit: id, focused: 1 };\n  close_(); draw(); };\nwindow.wlUndo = async id => {"],
  ['<button id="wlGo" class="btn teal block" onclick="wlSave()">${',
   '${F.edit ? \'<div class="small" style="margin:-4px 0 8px;color:#8A5A00">Saving records the corrected entry and undoes the old one (the preview above still counts the old one).</div>\' : \'\'}<button id="wlGo" class="btn teal block" onclick="wlSave()">${F.edit ? \'Save correction\' : '],
]);
