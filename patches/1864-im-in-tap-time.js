// 1864: (Misty 7 Nov "yes do both") "I'm in" counts from the TAP, not from when the screen share finishes. The app sends tapAgo (ms
//   between the tap and the send; no device clock) and the database works out the tap time, status and minutes (writes_classin_tap and
//   the T-TIMEIN copy, log_timein_tap; up to 15 minutes). The teacher's own screen shows the tap time at once.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["async function classInGo(id, share){\nconst c = (D.schedule||[]).find(x=>x.id===id); if(!c) return; const b = $('ciGo');",
   "async function classInGo(id, share){\nconst T0 = Date.now();   /* 1864: the tap */\nconst c = (D.schedule||[]).find(x=>x.id===id); if(!c) return; const b = $('ciGo');"],
  ["const now = Date.now(), mins = Math.round((new Date(c.start).getTime() - now) / 60000), prev = (D.classIns||{})[id];",
   "const now = T0, mins = Math.round((new Date(c.start).getTime() - now) / 60000), prev = (D.classIns||{})[id];"],
  ["try{ r = await api('classIn', TOKEN, cc, dv); if(r && r.ok) break; }catch(e){ r = e; }",
   "try{ dv.tapAgo = Date.now() - T0; r = await api('classIn', TOKEN, cc, dv); if(r && r.ok) break; }catch(e){ r = e; }"]]);
