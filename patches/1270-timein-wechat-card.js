// 1270: (Misty, 27 Oct 10:03–10:14) Time-in picture for the WeChat corner, a fuller internet test at time-in, and "Ask to redo the check".
//   makes ONE picture with everything management checks — a ✓/⚠ summary at the top (on time, class laptop, LAN cable, screen proof,
//   internet, location; the same rules the app already flags), then the details and the screen-proof picture. Steps on screen:
//   1 Copy picture · 2 paste it in the WeChat corner · 3 Send · 4 tick "Posted in WeChat". The tick before time-in is gone; the tick
//   after posting is saved in the database at once and shown to management; until ticked it stays in the teacher's Needs your action.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const lib = require('../tools/lib.js');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + fs.readFileSync(__dirname + '/1270-timein-wechat-card.inc', 'utf8') + s.slice(i);
fs.writeFileSync(file, s);
lib(file, [
  ["${D.shift?'':`<label class=\"check\" for=\"wcOk\"><input type=\"checkbox\" id=\"wcOk\"><span>I posted my first-class screenshot (my student + VooV) in our WeChat corner</span></label>",
   "${D.shift?'':`<input type=\"checkbox\" id=\"wcOk\" checked hidden><div class=\"small mute\" style=\"margin-bottom:8px\">After you time in, the app makes one picture for the WeChat corner · no speed-test screenshot needed.</div>"],
  ["Post your first-class screenshot in our WeChat corner, then time in here", "Time in here · then copy the time-in picture to our WeChat corner"],
  ["if(ti && !ti.pending){         res('ok', 'Time-in saved · ' + (ti.time || hmNow())", "if(ti && !ti.pending && !mgr && window.wcStep1270){ window.wcStep1270(SHOT); return; }\n      if(ti && !ti.pending){         res('ok', 'Time-in saved · ' + (ti.time || hmNow())"],
  // the time-in no longer waits for the internet test (it now takes ~10 s): it does not wait (the result is usually not ready yet), it is saved with the provider / IP already
  // measured; the full result follows by itself (coe-wct 'net') and is shown everywhere as the time-in's internet
  ["}, await Promise.race([NET, new Promise(z => setTimeout(() => z({}), D.shift ? 2500 : 8000))]), loc);", "}, await Promise.race([NET, new Promise(z => setTimeout(() => z(window.__netPart1270 || {}), 50))]), loc);"]]);
