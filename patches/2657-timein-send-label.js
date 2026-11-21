// 2657 (Misty 18:22 OK, after classes): Time-in picture · a greyed-out "Send to Time-in" looked broken.
//   While it is off, the button now says why: "Retake first · pick your VooV window" (the screen proof shows this app),
//   "Checking internet…", "Screen picture needed" or "Saving your time-in…". It reads "Send to Time-in" again once it can send.
//   "Send this picture anyway" stays as it is.
require('../tools/lib.js')(process.argv[2], [
  ["['wcSend', 'wcCopy', 'wcSave'].forEach(function(id){ var b = document.getElementById(id); if(b) b.disabled = id === 'wcSend' ? (!rdy || !!st.busy) : !!x.measuring; });",
   "['wcSend', 'wcCopy', 'wcSave'].forEach(function(id){ var b = document.getElementById(id); if(b) b.disabled = id === 'wcSend' ? (!rdy || !!st.busy) : !!x.measuring; });\n      try{ var sb57 = document.getElementById('wcSend'); if(sb57 && !st.busy){ if(!sb57.dataset.l57) sb57.dataset.l57 = sb57.textContent; var t57 = rdy ? sb57.dataset.l57 : x.self ? 'Retake first · pick your VooV window' : x.measuring ? 'Checking internet…' : !x.shot ? 'Screen picture needed' : 'Saving your time-in…'; if(sb57.textContent !== t57) sb57.textContent = t57; } }catch(e57){}   /* 2657 */"],
]);
