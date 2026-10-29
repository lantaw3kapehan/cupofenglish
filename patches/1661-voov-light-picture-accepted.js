// 1661: (April 17:21, Windows · Chrome, v1477) her real VooV picture (a light grey/white meeting window, her video tile, the taskbar)
// was refused as "Your screen picture shows this app", and Retake gave the same answer, so Send to Time-in stayed off.
// Cause: the 1497 check refused any picture that was 80% light with 30% of it near the cover grey (#F3F6F7 ±10), which a light
// VooV window also is. Fix:
//  A · refuse only our own blank cover: 70% or more of the picture within ±3 of the cover's exact colour #F3F6F7
//      (the cover fills the whole browser page while the picture is taken; browser bar and taskbar are the rest).
//  B · never stuck: when the picture still looks like this app, "Retake screen picture" is the main button and
//      "Send this picture anyway" posts the picture as taken, with the same one-per-day key (ti:day:name), for management to judge.
//      A picture taken while VooV was in front (this app had lost focus or was hidden) is never refused.
//  C · the duplicate small "Retake screen picture" link is gone in the time-in sheet (one Retake button only).
// A picture saved on the laptop by 1660 is checked again after a refresh, so April's 17:21 picture is accepted.
const lib = require('../tools/lib.js'), file = process.argv[2];
const AWAY = `
/* 1661 · a picture taken while this app was not in front (VooV clicked) cannot be the app's cover */
(function(){ var g = window.grabScreen; if(typeof g !== 'function' || g.__1661) return; window.AWAY1661 = {};
  var w = function(){ return Promise.resolve(g.apply(this, arguments)).then(function(r){ try{ if(r && r.b64 && (document.visibilityState === 'hidden' || !document.hasFocus())) AWAY1661[r.b64.length + ':' + r.b64.slice(-48)] = 1; }catch(e){} return r; }); };
  w.__1661 = 1; window.grabScreen = w; })();
</script>`;
lib(file, [
  ["window.selfShot1497 = function(b64){ return new Promise(function(z){ if(!b64) return z(false);",
   "window.selfShot1497 = function(b64){ return new Promise(function(z){ if(!b64) return z(false); try{ if(window.AWAY1661 && AWAY1661[b64.length + ':' + b64.slice(-48)]) return z(false); }catch(e){}"],
  ["im.src = 'data:image/jpeg;base64,' + b64; }); };\n</script>", "im.src = 'data:image/jpeg;base64,' + b64; }); };" + AWAY],
  ["if(r > 225 && gg > 225 && bb > 225) lt++; if(Math.abs(r - 243) < 10 && Math.abs(gg - 246) < 10 && Math.abs(bb - 247) < 10) cov++; }\n    z(lt / n > 0.8 && cov / n > 0.3);",
   "if(r > 225 && gg > 225 && bb > 225) lt++; if(Math.abs(r - 243) <= 3 && Math.abs(gg - 246) <= 3 && Math.abs(bb - 247) <= 3) cov++; }\n    z(cov / n >= 0.7);   /* 1661: only our own blank cover (exact colour over almost all of it) · a light VooV window is accepted */"],
  ["function ui1660(st, x){ if(!st || !x || st.redo) return; var miss = !x.shot && !x.measuring && !!x.time && !!x.status, cap = canCap1660() && !other1660(), sent = !!posted() || !!st.npSent;",
   "function ui1660(st, x){ if(!st || !x || st.redo) return; var self = !!(x.shot && x.self) && !x.measuring && !!x.time && !!x.status, miss = !x.shot && !x.measuring && !!x.time && !!x.status, cap = canCap1660() && !other1660(), sent = !!posted() || !!st.npSent;\n    var lk = document.getElementById('wcRetake'); if(lk) lk.hidden = true;   /* 1661: one Retake button only */"],
  ["if(rm){ rm.hidden = !(miss && cap); rm.disabled = !!RT1660 || !!st.busy; } if(s) s.hidden = !!(miss && cap); if(np){ np.hidden = !miss || sent; np.disabled = !!st.busy; } }",
   "if(rm){ rm.hidden = !((miss && cap) || self); rm.disabled = !!RT1660 || !!st.busy; } if(s) s.hidden = !!((miss && cap) || self);\n    if(np){ var nt = self ? 'Send this picture anyway' : 'Send without screen proof'; if(np.textContent !== nt) np.textContent = nt; np.hidden = !(miss || self) || sent; np.disabled = !!st.busy; } }"],
  ["window.wcNoProof1660 = async function(){ var st = STEP; if(!st || st.busy || !PIC || !st.x || st.x.shot) return;",
   "window.wcNoProof1660 = async function(){ var st = STEP; if(!st || st.busy || !PIC || !st.x || (st.x.shot && !st.x.self)) return;"],
  ["'Your screen picture shows this app, not your class · tap Retake screen picture, Share, then click your VooV window'",
   "'Your screen picture may show this app, not your class · tap Retake screen picture, Share, then click your VooV window · or tap Send this picture anyway'"],
]);
