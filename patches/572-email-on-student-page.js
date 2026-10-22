// 22 Oct · Misty: "I'm editing emails but where is it showing?" The saved email (billing profile) now shows on the student
// page header for management as a ✉ chip (tap to copy), and in the student form. Teachers never see it.
require('../tools/lib.js')(process.argv[2], [
["const ob = new MutationObserver(() => { try{ addBtns(); }catch(x){} try{ addMail(); }catch(x){} try{ essentials(); }catch(x){} });",
`/* 572 · the email on the student page (management) */
function mailChip(){
  try{ if(!(D && D.mgr) || typeof STU === 'undefined' || !STU || !STU.code) return; }catch(x){ return; }
  const b = document.getElementById('sheetBody'), row = b && b.querySelector('.shero .row'); if(!row) return;
  const code = STU.code, put = v => { const old = row.querySelector('.em-chip'); if(!v){ if(old) old.remove(); return; } const h = '<span class="chip em-chip" title="Email for payment confirmations · tap to copy" style="cursor:pointer" onclick="event.stopPropagation();navigator.clipboard&&navigator.clipboard.writeText(\\'' + e(v) + '\\').then(()=>tst(\\'Email copied\\'))">\\u2709 ' + e(v) + '</span>'; if(old){ if(old.outerHTML !== h) old.outerHTML = h; } else row.insertAdjacentHTML('beforeend', h); };
  if(EM[code] != null) put(EM[code]);
  if(!mailChip.at || mailChip.code !== code || Date.now() - mailChip.at > 6e4){ mailChip.code = code; mailChip.at = Date.now();
    call('contact', { code }).then(r => { EM[code] = r.email || ''; if(STU && STU.code === code) put(EM[code]); }).catch(() => {}); } }
(function(){ const _r = window.stuRender; if(typeof _r === 'function') window.stuRender = function(){ const r = _r.apply(this, arguments); try{ mailChip(); }catch(x){} return r; }; })();
const ob = new MutationObserver(() => { try{ addBtns(); }catch(x){} try{ addMail(); }catch(x){} try{ essentials(); }catch(x){} });`],
["call('contact_set', { code, email: P.email }).then(() => { EM[code] = P.email; delete BC[code]; })", "call('contact_set', { code, email: P.email }).then(() => { EM[code] = P.email; delete BC[code]; try{ mailChip.at = 0; mailChip(); }catch(x){} })"],
]);
