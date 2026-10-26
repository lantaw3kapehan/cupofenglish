// 1091: (Misty, 25 Oct 21:36) "I cannot click Return and slow" — Parent reports › Return to teacher.
// · The button now shows "Returning…" at once and is locked while Google saves it (Google takes 10–30 s); a second tap
//   no longer sends it twice. If Google does not answer the button comes back with a clear message.
// · The PDF finishing its download while the return box is open no longer wipes the box (and what you typed).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["function rpBtns(){\nconst el = $('rpAct'); if(!el || !RPD) return;",
   "function rpBtns(force){\nconst el = $('rpAct'); if(!el || !RPD) return; if(!force && el.querySelector('#rpNote')) return;"],
  ["<button class=\"btn ghost\" onclick=\"rpBtns()\">Cancel</button><button class=\"btn teal grow\" onclick=\"rpReturnGo()\">Return to teacher</button>",
   "<button class=\"btn ghost\" id=\"rpRetX\" onclick=\"rpBtns(1)\">Cancel</button><button class=\"btn teal grow\" id=\"rpRetB\" onclick=\"rpReturnGo()\">Return to teacher</button>"],
  ["const x = RPD.report, note = $('rpNote').value.trim(); if(note.length < 5) return toast('Write what to fix');\ntry{ const r = await api('mgmtReportReturn', TOKEN, x.key, note); if(!r.ok) return toast(r.msg || 'Not saved');",
   "const x = RPD.report, note = $('rpNote').value.trim(); if(note.length < 5) return toast('Write what to fix');\nconst b = $('rpRetB'), bx = $('rpRetX'); if(b && b.disabled) return; const busy = on => { if(b){ b.disabled = on; b.textContent = on ? 'Returning… (Google takes up to 30 s)' : 'Return to teacher'; } if(bx) bx.disabled = on; };\nbusy(true);\ntry{ const r = await api('mgmtReportReturn', TOKEN, x.key, note); if(!r.ok){ busy(false); return toast(r.msg || 'Not saved'); }"],
  ["catch(e){ toast('Not saved. Check your internet and try again.'); }\n}\n\nlet AT = null",
   "catch(e){ busy(false); toast('Not saved. Check your internet and try again.'); }\n}\n\nlet AT = null"]
]);
