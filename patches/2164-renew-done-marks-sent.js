// 2164 (13 Nov · Misty 14:16 "we can do 1 and 2 now"): To do › Fix these › Renewal · "Done today" now also records it on the student,
// the same as Renewals › Mark as sent (mgmtRenewal): "Reminder sent · today" for remind / follow-up items, "Renewing · today" for
// "said renewing · not paid yet" items. So the 3-day follow-up counts from today and Celine does not mark it twice.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["window.o2091ok = function(i, btn){ var x = (FX.items || [])[i]; if(!x) return; if(btn) btn.disabled = true;",
   "window.o2091ok = function(i, btn){ var x = (FX.items || [])[i]; if(!x) return; if(btn) btn.disabled = true;\n    if(x.kind === 'renew'){ try{ var t2164 = String(x.text || ''), c2164 = (t2164.match(/ST-\\d{4}-\\d{3}/) || [])[0], n2164 = ((t2164.match(/^Renewal · (.+?) \\(ST-/) || [])[1] || c2164 || '').trim();   /* 2164 */\n      if(c2164 && typeof window.api === 'function') window.api('mgmtRenewal', TOKEN, c2164, /Said \"renewing\"/i.test(t2164) ? 'Renewing' : 'Reminder sent', 'Done today (To do)', '').then(function(r){ try{ if(r && r.ok && r.status && typeof REN === 'object'){ REN[c2164.toUpperCase()] = r.status; localStorage.setItem('coe.ren', JSON.stringify(REN)); } }catch(e){} }).catch(function(){ try{ toast(n2164 + ' · reminder not recorded · use Mark as sent'); }catch(e){} }); }catch(e){} }"],
  ["toast(x.kind === 'renew' ? '✓ Done for today · back tomorrow if still due' : '✓ Put away. It will not come back.')",
   "toast(x.kind === 'renew' ? '✓ Recorded as done today · follow-up in 3 days if no answer' : '✓ Put away. It will not come back.')"],
]);
