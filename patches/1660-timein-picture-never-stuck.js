// 1660: (Pam 16:21, Windows · Edge) "Send to Time-in" stayed off with "No screen proof" and "kept on the laptop you timed in on",
// although she was on that laptop. Cause: the time-in screen picture was kept in page memory only. Pam timed in at 16:21 on
// v1473; release 1475 reloaded the app at 16:22, so the picture was gone and Send could never turn on (coe_speed shows v1473
// up to 16:21, v1475 from 16:22). Nothing was wrong with Edge's capture: the time-in itself needs the picture and it saved.
// Fix:
//  A · the picture is also kept on this laptop (browser database; old pictures are removed first; if the database is full the
//      old ones are cleared and it tries again; then a small local copy; then memory for the session). Restored after a refresh
//      or an app update for the same teacher and day (same 3-hour rule as before).
//  B · never stuck: when the picture is missing on this laptop, the main button is "Retake screen picture" (the same capture);
//      once taken, "Send to Time-in" turns on. A second choice, "Send without screen proof", posts the card exactly as drawn
//      (red "No screen proof" visible for management), with the same one-per-day key (ti:day:name), so never a duplicate.
//  C · "kept on the laptop you timed in on" is said only when this device is not the time-in laptop.
//  D · (Misty 16:26, macOS · Safari) "Internet · not measured": Safari turns cache:'no-store' into extra request headers, so
//      speed.cloudflare.com refuses the request (CORS) and every reading fails. On Safari the address is made unique instead.
//      Thresholds and the test itself are unchanged.
const lib = require('../tools/lib.js'), file = process.argv[2];
const SAF = `<script id="s1660">
/* 1660 · Safari (WebKit): no cache:'no-store' on the internet check (it adds headers that speed.cloudflare.com refuses) · a unique address instead */
(function(){ var ua = navigator.userAgent || ''; if(!/AppleWebKit/.test(ua) || /Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua)) return;
  window.cfU1660 = function(u){ u = String(u); return /[?&]r=/.test(u) ? u : u + (u.indexOf('?') < 0 ? '?' : '&') + 'r=' + Math.random().toString(36).slice(2); };
  window.cfO1660 = function(){ return {}; }; })();
</script>`;
const HELP = `window.__pic1270 = picture; window.__card1270 = card;
  /* 1660 · the time-in screen picture is kept on this laptop, so a refresh or an app update never loses it */
  var HERE1660 = 'coe.tihere1660', SKL1660 = 'coe.tishot1660', HEREM1660 = '', RT1660 = 0;
  function db1660(){ return new Promise(function(z){ try{ var q = indexedDB.open('coe-tishot', 1); q.onupgradeneeded = function(){ try{ q.result.createObjectStore('p'); }catch(e){} }; q.onsuccess = function(){ z(q.result); }; q.onerror = q.onblocked = function(){ z(null); }; }catch(e){ z(null); } }); }
  function tx1660(db, fn){ return new Promise(function(z){ try{ var t = db.transaction('p', 'readwrite'); fn(t.objectStore('p')); t.oncomplete = function(){ z(true); }; t.onerror = t.onabort = function(){ z(false); }; }catch(e){ z(false); } }); }
  function keep1660(sh){ if(!sh || !sh.b64) return; var rec = { b64: sh.b64, at: sh.at || Date.now(), day: today(), who: me() };
    db1660().then(function(db){ if(!db) return false;
      return tx1660(db, function(s){ s.clear(); s.put(rec, 'shot'); }).then(function(ok){ if(ok) return true;   /* full: remove the old pictures, then try once more */
        return tx1660(db, function(s){ s.clear(); }).then(function(){ return tx1660(db, function(s){ s.put(rec, 'shot'); }); }); }); })
    .then(function(ok){ if(ok){ try{ localStorage.removeItem(SKL1660); }catch(e){} return; }
      try{ localStorage.removeItem(SKL1660); localStorage.setItem(SKL1660, JSON.stringify(rec)); }catch(e){ try{ localStorage.removeItem(SKL1660); }catch(x){} } })   /* last: the session memory (SH) */
    .catch(function(){}); }
  function load1660(){ var ok = function(r){ return r && r.b64 && r.day === today() && r.who === me() ? r : null; };
    return db1660().then(function(db){ if(!db) return null; return new Promise(function(z){ try{ var q = db.transaction('p').objectStore('p').get('shot'); q.onsuccess = function(){ z(q.result || null); }; q.onerror = function(){ z(null); }; }catch(e){ z(null); } }); })
      .then(function(r){ if(ok(r)) return r; try{ return ok(JSON.parse(localStorage.getItem(SKL1660) || 'null')); }catch(e){ return null; } }, function(){ return null; }); }
  function here1660(){ HEREM1660 = today() + '|' + me(); try{ localStorage.setItem(HERE1660, HEREM1660); }catch(e){} }
  function canCap1660(){ try{ return /^Laptop/.test(deviceInfo()) && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia); }catch(e){ return false; } }
  function other1660(){ var k = today() + '|' + me(); if(HEREM1660 === k) return false; try{ if(localStorage.getItem(HERE1660) === k) return false; }catch(e){}
    var cut = function(s){ return String(s || '').replace(/ · \\d+×\\d+$/, ''); }, td = cut(((typeof D !== 'undefined' && D && D.timeIn) || {}).device), dv = ''; try{ dv = cut(deviceInfo()); }catch(e){}
    return !!(td && dv && td !== dv); }
  function noShotMsg1660(){ return other1660() ? 'Your screen picture is kept on the laptop you timed in on · open Today there to send it, or tap Send without screen proof'
    : canCap1660() ? 'Your screen picture didn\\'t save · tap Retake screen picture' : 'No screen picture on this device · tap Send without screen proof'; }
  function ui1660(st, x){ if(!st || !x || st.redo) return; var miss = !x.shot && !x.measuring && !!x.time && !!x.status, cap = canCap1660() && !other1660(), sent = !!posted() || !!st.npSent;
    var s = document.getElementById('wcSend'), rm = document.getElementById('wcRetake1660'), np = document.getElementById('wcNoProof1660');
    if(rm){ rm.hidden = !(miss && cap); rm.disabled = !!RT1660 || !!st.busy; } if(s) s.hidden = !!(miss && cap); if(np){ np.hidden = !miss || sent; np.disabled = !!st.busy; } }
  window.wcNoProof1660 = async function(){ var st = STEP; if(!st || st.busy || !PIC || !st.x || st.x.shot) return; st.noProof = 1; await window.wcSend1496();
    if(STEP === st){ var t = document.getElementById('wcTick'); if(t && /\\bok\\b/.test(t.className)) st.npSent = 1; ui1660(st, st.x); } };`;
lib(file, [
  ['\n<script id="b1506">', '\n' + SAF + '\n<script id="b1506">'],
  ["setTimeout(() => a.abort(), ms); return fetch(u, Object.assign({ signal: a.signal, cache: 'no-store' }, o || {})); };",
   "setTimeout(() => a.abort(), ms); return fetch(window.cfU1660 ? cfU1660(u) : u, Object.assign({ signal: a.signal }, window.cfO1660 ? cfO1660() : { cache: 'no-store' }, o || {})); };"],
  ["setTimeout(function(){ a.abort(); }, ms); return fetch(u, Object.assign({ signal: a.signal, cache: 'no-store' }, o || {})); };",
   "setTimeout(function(){ a.abort(); }, ms); return fetch(window.cfU1660 ? cfU1660(u) : u, Object.assign({ signal: a.signal }, window.cfO1660 ? cfO1660() : { cache: 'no-store' }, o || {})); };"],
  ["if(r && r.b64) SH = { b64: r.b64, at: Date.now() };", "if(r && r.b64){ SH = { b64: r.b64, at: Date.now() }; keep1660(SH); }"],
  ["D.timeIn.day1270 = today();", "D.timeIn.day1270 = today(); here1660();"],
  ["    var place = redo ? '' : (ti.place || ''), b64 = shot ||",
   "    if(!redo && !shot && !SH.b64){ var rs1660 = await race(load1660(), 2500, null); if(rs1660 && rs1660.b64 && !SH.b64) SH = { b64: rs1660.b64, at: rs1660.at || 0 }; }   /* 1660: after a refresh or an app update */\n    var place = redo ? '' : (ti.place || ''), b64 = shot ||"],
  ["if(rb) rb.hidden = !x.self;", "if(rb) rb.hidden = !x.self; ui1660(st, x);"],
  ["!x.shot ? 'Your screen picture is kept on the laptop you timed in on · open Today there to send it'", "!x.shot ? noShotMsg1660()"],
  ["if(x.measuring || !x.shot || !x.time || !x.status){", "if(x.measuring || (!x.shot && !st.noProof) || !x.time || !x.status){"],
  ['<div class="wc-btns"><button class="btn teal" id="wcSend"', '<div class="wc-btns"><button class="btn teal" id="wcRetake1660" onclick="wcRetake1497()" hidden>Retake screen picture</button><button class="btn teal" id="wcSend"'],
  ['onclick="wcRetake1497()" hidden>Retake screen picture</button></div>', 'onclick="wcRetake1497()" hidden>Retake screen picture</button><button type="button" id="wcNoProof1660" onclick="wcNoProof1660()" hidden>Send without screen proof</button></div>'],
  ["if(r && r.b64){ STEP.shot = r.b64; STEP.self = null; STEP.selfFor = null; PIC = null; var pv = document.getElementById('wcPrev'); if(pv) pv.innerHTML = '<div class=\"wc-wait\">Making the picture…</div>'; render(); } };",
   "if(r && r.b64){ RT1660 = 0; STEP.shot = r.b64; STEP.self = null; STEP.selfFor = null; PIC = null; var pv = document.getElementById('wcPrev'); if(pv) pv.innerHTML = '<div class=\"wc-wait\">Making the picture…</div>'; render(); }\n    else { RT1660 = 0; var nm = document.getElementById('wcNet'); if(nm) nm.textContent = r && r.err === 'blocked' ? 'This laptop blocked the screen picture · allow screen recording for this browser, then tap Retake screen picture' : 'No screen picture taken · tap Retake screen picture and choose Entire screen'; if(STEP && STEP.x) ui1660(STEP, STEP.x); } };"],
  ["window.wcRetake1497 = async function(){ if(!STEP || typeof window.grabScreen !== 'function') return; var r = await window.grabScreen();",
   "window.wcRetake1497 = async function(){ if(!STEP || typeof window.grabScreen !== 'function' || RT1660) return; RT1660 = 1; var rb1660 = document.getElementById('wcRetake1660'); if(rb1660) rb1660.disabled = true; var r; try{ r = await window.grabScreen(); }catch(e){ r = { err: 'share failed' }; }"],
  ["window.__pic1270 = picture; window.__card1270 = card;", HELP],
  ['.wc70 .wc-btns #wcSend{min-width:200px}', '.wc70 .wc-btns #wcSend,.wc70 .wc-btns #wcRetake1660{min-width:200px}.wc70 .wc-alt{min-height:25px}'],
]);
