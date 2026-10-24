// 755: (Misty) "just click it and tell them if it worked" — the header button is now one tap, with a clear result:
//  · Teacher Time in / I'm in on the class laptop: tap → the browser's share window opens straight away (pick Entire screen → Share).
//    No sheet, no checkbox. Then a big result card: ✓ green "Time-in saved · 18:02 · On time" (closes by itself), or
//    ✕ red "Not saved" with the reason and one "Try again" button. Success also offers "Copy picture for WeChat"
//    (the same screen picture, so posting it in the WeChat corner is one paste).
//  · Not on the class laptop, or before time-in opens: the sheet explains, as before.
//  · Management: Time in = one tap (no Confirm sheet). Time out = tap "In 09:02" → the pill turns "Tap again to time out"
//    for 4 seconds → second tap saves (no sheet, can't happen by accident). Same result card.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
const R = String.raw;
rep('b.onclick = () => timeInSheet(); return; }', 'b.onclick = () => tapTimeIn(); return; }');
rep('b.onclick = () => classIn(due.id); return; }', 'b.onclick = () => tapClassIn(due.id); return; }');
rep('      b.onclick = () => timeInSheet();', '      b.onclick = () => tapTimeIn();');
rep('b.onclick = () => timeOutSheet(); }', 'b.onclick = () => tapTimeOut(b); }');
rep('  window.tinNag = paint; setInterval(paint, 5000); setTimeout(paint, 800);', R`  /* 755 · one tap, clear result */
  let SHOT = null, BUSY = 0, OUT_ARM = 0, MACP = 0;
  const _grab = window.grabScreen; if(_grab) window.grabScreen = async function(){ const r = await _grab.apply(this, arguments); SHOT = r && r.b64 ? r.b64 : null; return r; };
  const _mac = window.macPerm; if(_mac) window.macPerm = function(){ MACP = 1; return _mac.apply(this, arguments); };
  const cs = document.createElement('style'); cs.textContent = '#tapRes{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(43,34,83,.28);padding:16px}'
    + '#tapRes .tr-c{background:#fff;border-radius:24px;padding:26px 24px 20px;width:100%;max-width:360px;text-align:center;box-shadow:0 20px 50px -20px rgba(43,34,83,.45);animation:trIn .18s ease-out}'
    + '#tapRes .tr-i{width:64px;height:64px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:#fff}#tapRes .tr-i svg{width:34px;height:34px}'
    + '#tapRes .ok .tr-i{background:#1F9D6B}#tapRes .no .tr-i{background:#C2483A}#tapRes .wait .tr-i{background:#00A3AD}'
    + '#tapRes h2{margin:0;padding:0;border:0;font-size:21px;line-height:1.25;color:#2B2253;display:block;text-align:center}#tapRes h2:before,#tapRes h2:after{content:none!important;display:none!important}#tapRes .tr-s{margin-top:6px;font-size:14px;color:#6E6A85;line-height:1.45}#tapRes .tr-b{display:flex;flex-direction:column;gap:8px;margin-top:16px}'
    + '#tapRes .wait .tr-i svg{animation:trSp 1s linear infinite}@keyframes trIn{from{transform:scale(.94);opacity:0}}@keyframes trSp{to{transform:rotate(360deg)}}'
    + '#tinNag.arm{display:inline-flex;background:#C27A22;color:#fff;animation:none}';
  document.head.appendChild(cs);
  const ICO = { ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    no: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    wait: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/></svg>' };
  let RES_T = 0;
  function res(kind, title, sub, btns){ clearTimeout(RES_T); let w = document.getElementById('tapRes'); if(!w){ w = document.createElement('div'); w.id = 'tapRes'; document.body.appendChild(w); }
    w.onclick = ev => { if(ev.target === w && kind !== 'wait') w.remove(); };
    w.innerHTML = '<div class="tr-c ' + kind + '"><div class="tr-i">' + ICO[kind] + '</div><h2>' + title + '</h2>' + (sub ? '<div class="tr-s">' + sub + '</div>' : '') + '<div class="tr-b">' + (btns || '') + (kind === 'wait' ? '' : '<button class="btn ghost block" onclick="tapResClose()">' + (kind === 'ok' ? 'Done' : 'Close') + '</button>') + '</div></div>';
    if(kind === 'ok') RES_T = setTimeout(tapResClose, 6000); }
  window.tapResClose = () => { clearTimeout(RES_T); const w = document.getElementById('tapRes'); if(w) w.remove(); };
  window.tapCopyShot = async function(){ try{ if(!SHOT || !window.ClipboardItem) throw 0;
      const img = new Image(); img.src = 'data:image/jpeg;base64,' + SHOT; await img.decode(); const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight; cv.getContext('2d').drawImage(img, 0, 0);
      const blob = await new Promise(z => cv.toBlob(z, 'image/png')); await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast('Picture copied · paste it in the WeChat corner'); }catch(e){ toast('Copy did not work here · take a screenshot instead'); } };
  const hmNow = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const isLap = () => /^Laptop/.test(deviceInfo()) && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  const why = () => { const m = Array.from(document.querySelectorAll('.toast,#toast')).map(x => x.textContent).filter(Boolean).pop(); return m ? String(m) : ''; };
  function hdr(t){ const b = document.getElementById('tinNag'); if(b){ b.className = 'on'; b.style.background = ''; b.innerHTML = IC + t; } }
  window.tapTimeIn = function(){ if(BUSY) return; const DD = D, mgr = !!DD.shift;
    if(!mgr){ const fl = (DD.schedule || []).filter(x => x.day === DD.today && !x.cancelled).sort((a, c) => String(a.start).localeCompare(String(c.start)))[0];
      if(!fl || !isLap() || Date.now() < new Date(fl.start).getTime() - 40 * 6e4) return timeInSheet(); }
    NET = netCheck(true); LOC = getLoc(true); SHOT = null; MACP = 0;
    openSheet('<h1>Time in</h1>' + (mgr ? '<div class="mute small" style="margin-top:6px">Saving…</div>' : '<div class="fbfix" style="margin-top:12px"><b>Pick “Entire screen”, then Share</b>That is all · one picture is taken and sharing stops by itself.</div>')
      + '<input type="checkbox" id="wcOk" checked hidden><button id="tiGo" hidden></button>');
    BUSY = 1; hdr('Saving…'); const p = sendTimeIn();
    Promise.resolve(p).then(() => {}, () => {}).then(() => { BUSY = 0; try{ tinNag(); }catch(e){}
      const ti = D.timeIn; if(MACP) return;
      if(ti && !ti.pending){         res('ok', 'Time-in saved · ' + (ti.time || hmNow()), (ti.status ? ti.status : '') + (ti.flag ? ' · ' + ti.flag : '') + (mgr ? '' : '<br>Post the same picture in the WeChat corner.'),
          !mgr && SHOT ? '<button class="btn teal block" onclick="tapCopyShot()">Copy picture for WeChat</button>' : ''); return; }
      try{ closeSheet(); }catch(e){}
      res('no', 'Not timed in yet', (why() || 'It did not save.') + '<br>Tap Try again · pick <b>Entire screen</b>.', '<button class="btn teal block" onclick="tapResClose();tapTimeIn()">Try again</button>'); }); };
  window.tapClassIn = function(id){ if(BUSY) return; const c = (D.schedule || []).find(x => x.id === id); if(!c) return;
    if(!isLap()) return classIn(id);
    CI_PRE = Promise.all([netCheck('lite'), getLoc(false)]); SHOT = null; MACP = 0; BUSY = 1; hdr('Saving…');
    const nm = c.student || c.code || 'class', p = classInGo(id, true);
    Promise.resolve(p).then(() => {}, () => {}).then(() => { BUSY = 0; try{ tinNag(); }catch(e){}
      if(MACP) return; const x = (D.classIns || {})[id];
      if(x && !x.pending){         res('ok', "I'm in · " + esc(nm), (x.time || hmNow()) + ' · ' + (x.status || 'saved') + (x.flag ? ' · ' + esc(x.flag) : '') + (x.proof || SHOT ? ' · screen proof saved' : '')); return; }
      res('no', "“I'm in” not saved", (why() || 'It did not save.') + '<br>Tap Try again · pick <b>Entire screen</b>.', '<button class="btn teal block" onclick="tapResClose();tapClassIn(\'' + esc(id) + '\')">Try again</button>'); }); };
  window.tapTimeOut = function(b){ if(BUSY) return;
    if(Date.now() - OUT_ARM > 4000){ OUT_ARM = Date.now(); b.className = 'arm'; b.innerHTML = IC + 'Tap again to time out'; setTimeout(() => { if(Date.now() - OUT_ARM >= 3900) try{ tinNag(); }catch(e){} }, 4000); return; }
    OUT_ARM = 0; NET = netCheck(false); BUSY = 1; hdr('Saving…'); res('wait', 'Timing out…', 'One moment');
    Promise.resolve(sendTimeOut()).then(() => {}, () => {}).then(() => { BUSY = 0; try{ tinNag(); }catch(e){}
      const ti = D.timeIn || {};
      if(ti.out && ti.hours != null) res('ok', 'Time-out saved · ' + ti.out, (ti.hours !== '' ? (+ti.hours).toFixed(1) + ' h today · ' : '') + 'timed in ' + (ti.time || ''));
      else if(ti.out) res('ok', 'Timed out · ' + ti.out, 'Saved');
      else res('no', 'Time-out not saved', (why() || 'It did not save.'), '<button class="btn teal block" onclick="tapResClose();OUT_ARM_GO()">Try again</button>'); }); };
  window.OUT_ARM_GO = () => { const b = document.getElementById('tinNag'); if(b){ OUT_ARM = Date.now(); tapTimeOut(b); } };
  window.tinNag = paint; setInterval(() => { if(!BUSY && Date.now() - OUT_ARM > 4000) paint(); }, 5000); setTimeout(paint, 800);`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
