// 770: (Misty) "in their activity log, can it detect a device too … every activity they do, sending video, what time, homework, etc, goes to their My Activity Log".
// · Every save that goes through the database (class note, homework, time in, I'm in, feedback, progress check, messages, leave …) now also records
//   the device (Laptop/Phone/Tablet · system · browser · screen), the network type when the browser tells it, and the IP (taken by the server).
// · Saves that go straight to Google (class video started / uploaded / explained, WeChat reminder sent, "not my student", leave answer / cancel)
//   are now written to the activity log too, with the same device details, time and result. The log rows cannot be changed or deleted.
// · The activity log shows friendly names for all of them.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 770 · device on every activity */
(function(){
  if(window.__770 || typeof fastWrite !== 'function') return; window.__770 = 1;
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train';
  const net = () => { const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection; if(!c) return navigator.onLine === false ? 'offline' : '';
    return [c.type && c.type !== 'unknown' ? (c.type === 'wifi' ? 'Wi-Fi' : c.type === 'cellular' ? 'Mobile data' : c.type === 'ethernet' ? 'LAN cable' : c.type) : '', c.effectiveType ? c.effectiveType.toUpperCase() + ' speed' : ''].filter(Boolean).join(' · '); };
  const dev = () => { let d = ''; try{ d = typeof deviceInfo === 'function' ? deviceInfo() : ''; }catch(e){} return { device: d, net: net() }; };
  const post = b => { try{ if(typeof TOKEN === 'undefined' || !TOKEN) return; fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, keepalive: true, body: JSON.stringify(Object.assign({ token: TOKEN, dev: dev() }, b)) }).catch(() => {}); }catch(e){} };
  /* 1 · database saves: after the save is queued, send the device for that row */
  const _fw = window.fastWrite;
  window.fastWrite = async function(fn, args){ const r = await _fw.apply(this, arguments); try{ setTimeout(() => post({ action: 'devlog', fn }), 300); }catch(e){} return r; };
  /* 2 · saves that go straight to Google */
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round((n || 0) / 1024) + ' KB';
  const DET = {
    tVidStart: a => { const f = a[2] || {}; return [f.name, f.size ? kb(f.size) : '', f.dur ? Math.round(f.dur / 60) + ' min video' : ''].filter(Boolean).join(' · '); },
    tVidDone: () => 'Video uploaded and linked',
    tVidExplain: a => [a[2], a[3]].filter(Boolean).join(' · '),
    tRemindLog: a => { const o = a[1] || {}; return [o.student, o.code, o.start ? o.start + ' class' : '', o.stage].filter(Boolean).join(' · '); },
    tNotMine: a => [a[1], a[2]].filter(Boolean).join(' · '),
    tLeaveReply: a => String(a[2] || '').slice(0, 120) + (Array.isArray(a[3]) && a[3].length ? ' · ' + a[3].length + ' file(s)' : ''),
    tLeaveCancel: a => 'Request ' + (a[1] || '')
  };
  const act = (fn, args, ok, extra) => { let d = ''; try{ d = DET[fn](args); }catch(e){} post({ action: 'act', fn, ok, detail: [d, extra].filter(Boolean).join(' · ').slice(0, 300) }); };
  const wrap = name => { const f = window[name]; if(typeof f !== 'function') return;
    window[name] = function(fn){ const p = f.apply(this, arguments); if(!DET[fn]) return p; const args = [].slice.call(arguments, 1);
      Promise.resolve(p).then(r => { const ok = !(r && r.ok === false); act(fn, args, ok, ok ? '' : String((r && (r.msg || r.error)) || 'Not saved').slice(0, 120)); },
        e => { const m = String((e && (e.msg || e.message)) || 'Not saved'); act(fn, args, /saved on this device/i.test(m), m.slice(0, 120)); });
      return p; }; };
  wrap('apiNow');   /* api() hands every Google save to apiNow, so one wrapper sees each save once */
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["tHwFlag: 'Homework flag', tSetMeet: 'Meeting ID' };",
   "tHwFlag: 'Homework flag', tSetMeet: 'Meeting ID', tGoalsSave: 'Learning goals', tPayVerify: 'Pay check', tVidStart: 'Class video · upload started', tVidDone: 'Class video uploaded', tVidExplain: 'Class video · explanation', tRemindLog: 'WeChat reminder sent', tNotMine: '\"Not my student\" sent', tLeaveReply: 'Leave · answer sent', tLeaveCancel: 'Leave cancelled' };"]
]);
