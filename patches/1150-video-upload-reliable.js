// 1150: (Misty, 26 Oct 15:15) "class notes, homework, video dragging as upload — check and fix for the teachers' convenience".
//      Real data (coe_activity, 25 Oct): Julia's Annie video reached Drive at 21:40 but the app said "Class video not uploaded ·
//      This upload is too old", then retried the last step 6 times until 22:30 (same message each time); Ara saw it at 18:53.
//      Kat's 25 Oct upload went to her 31 Oct class (the week strip offers Upload for future classes).
// · The video is in Drive once Google confirms the file: a failed last step ("too old" / weak signal) now says so honestly —
//   "✓ In the school Drive · finishing the record" — and the class shows its video; the record is finished in the background.
// · That background finish (784) keeps trying for 2 days instead of 5 hours, at most 8 times, 10 minutes apart (no burst of retries).
// · During a class or while offline, a weak connection no longer stops the upload after 10 tries: it waits for the signal and goes
//   on (the limit counts only failures outside class time with internet, raised to 25 with back-off up to 30 s).
// · One video at a time is kept, but a second video is QUEUED instead of refused ("Another class video is still uploading"):
//   drag or choose it now, it starts by itself when the first one finishes; the queue shows as pills ("Waiting · Mia 16:00").
// · The whole class card is the drop zone on laptops (not only the small video box), with a clear label while dragging:
//   "Drop to upload the video for Mia · 16:00".
// · A teacher cannot upload a video for a class that has not started (more than 15 min ahead) — management still can.
// · Activity log: the last step is logged as "Video upload · last step" (it said "Video uploaded and linked" even when it failed).
// · Two identical saves within 3 seconds (double click) are sent once (notes, homework, flags, acknowledgements, I'm in …).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["CH = Math.max(CH0, CH / 2); if(++fails > 10) throw",
   "CH = Math.max(CH0, CH / 2); if(navigator.onLine === false){ show('<b>No internet · the upload waits</b><div class=\"small\" style=\"opacity:.8\">' + who + ' · ' + Math.floor(off / N * 100) + '% sent · continues when the signal is back · nothing is lost</div>', 'wait'); await new Promise(z => { const h = () => { removeEventListener('online', h); z(); }; addEventListener('online', h); setTimeout(h, 60000); }); } if(!(window.vidBusy && vidBusy(c)) && navigator.onLine !== false && ++fails > 25) throw"],
  ["if(d && !d.ok) throw new Error(d.msg || 'The video uploaded but was not linked. Tell Ops.');",
   "if(d && !d.ok && fileId && /too old|again/i.test(String(d.msg || ''))){ s.pend = 1; s.dn = 0; s.t = Date.now(); o = get(); o[id] = s; put(o); note = 'In the school Drive · the record is finished by itself when you open the app again'; d = null; }\n      if(d && !d.ok) throw new Error(d.msg || 'The video uploaded but was not linked. Tell Ops.');"],
  ["for(const id of Object.keys(o)){ const s = o[id]; if(!s || !s.fid || s.done || !s.key || Date.now() - (s.t || 0) > 5 * 36e5) continue;",
   "for(const id of Object.keys(o)){ const s = o[id]; if(!s || !s.fid || s.done || !s.key || Date.now() - (s.t || 0) > (s.pend ? 48 : 5) * 36e5) continue; if((s.dn || 0) >= 8 || Date.now() - (s.dt || 0) < 10 * 6e4) continue; s.dn = (s.dn || 0) + 1; s.dt = Date.now(); try{ const o1 = JSON.parse(localStorage.getItem(LS) || '{}') || {}; if(o1[id]){ o1[id].dn = s.dn; o1[id].dt = s.dt; localStorage.setItem(LS, JSON.stringify(o1)); } }catch(e){}"],
  ["const zoneOf = el => { const z = el && el.closest && el.closest('.hw'); if(!z) return null;",
   "const zoneOf = el => { let z = el && el.closest && el.closest('.hw'); if(!z){ const cc = el && el.closest && el.closest('.cls'); if(cc && cc.querySelector('.hw button[onclick*=\"vidUp(\"]')) z = cc; } if(!z) return null;"],
  ["if(on !== k.z){ clear(); on = k.z; on.classList.add('vdrop'); }",
   "if(on !== k.z){ clear(); on = k.z; on.classList.add('vdrop'); try{ const c = ((typeof D !== 'undefined' && D && D.schedule) || []).find(x => x.id === k.id); on.setAttribute('data-vdl', 'Drop to upload the video for ' + (c ? (c.student || c.title || 'this class') + ' · ' + new Date(c.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }) : 'this class')); }catch(x){} }"],
  ["tVidDone: a => [window.actStu ? actStu({ key: a[1] }) : '', 'Video uploaded and linked'].filter(Boolean).join(' · '),",
   "tVidDone: a => [window.actStu ? actStu({ key: a[1] }) : '', 'Video upload · last step'].filter(Boolean).join(' · '),"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="d1150">.cls.vdrop{outline:3px dashed #00707A!important;outline-offset:3px;background:#EAF7F8!important}.vdrop{position:relative}.vdrop::after{content:attr(data-vdl);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#00707A;color:#fff;padding:9px 16px;border-radius:999px;font-weight:700;font-size:14px;pointer-events:none;z-index:6;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.18)}</style>
<script>
/* 1150 · video queue, future-class guard, double-click guard */
(function(){
  if(window.__1150) return; window.__1150 = 1;
  var Q = [], tm = function(c){ try{ return new Date(c.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  var cls = function(id){ return ((typeof D !== 'undefined' && D && D.schedule) || []).find(function(x){ return x.id === id; }) || (window.VL_LIST || []).find(function(x){ return x.id === id; }); };
  var V0 = window.vidUp;
  if(typeof V0 === 'function'){
    var enq = function(id, f){ var c = cls(id) || {}; if(Q.some(function(q){ return q.id === id; })) return toast('This class is already waiting in the upload queue');
      var q = { id: id, f: f, pid: null }; q.pid = svPill(null, '<b>Waiting · ' + esc(c.student || c.title || 'class') + ' ' + esc(tm(c)) + '</b><div class="small" style="opacity:.8">' + esc(f.name) + ' · starts by itself after the video that is uploading now</div>', 'wait'); Q.push(q);
      toast('Queued · it uploads right after the current video'); };
    window.vidUp = function(id){
      var c = cls(id), mgr = typeof D !== 'undefined' && D && D.mgr;
      if(c && !mgr && new Date(c.start).getTime() - Date.now() > 15 * 6e4){ window.__vidDrop = null; return toast('This class has not started yet · upload its video after the class'); }
      if(window._vupBusy && !((D.vids || {})[id] && D.vids[id].url)){
        var dp = window.__vidDrop; window.__vidDrop = null;
        if(dp && dp.id === id && Date.now() - dp.t < 3 * 6e4) return enq(id, dp.f);
        var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'video/*,image/*,.mp4,.mov,.m4v,.mkv,.webm,.jpg,.jpeg,.png,.heic'; inp.style.display = 'none'; document.body.appendChild(inp);
        inp.onchange = function(){ var f = inp.files && inp.files[0]; inp.remove(); if(f) enq(id, f); }; inp.click(); return;
      }
      return V0.apply(this, arguments);
    };
    setInterval(function(){ if(window._vupBusy || !Q.length) return; var q = Q.shift(); try{ var el = q.pid && document.getElementById(q.pid); if(el) el.remove(); }catch(e){} window.__vidDrop = { f: q.f, id: q.id, t: Date.now() }; try{ V0(q.id); }catch(e){} }, 2500);
    window.addEventListener('beforeunload', function(e){ if(Q.length){ e.preventDefault(); e.returnValue = ''; return ''; } });
  }
  /* double click: the same save twice within 3 s is sent once */
  var W = /^(saveNote|markHomework|tNoteTag|tHwFlag|tMsgAck|tMsgSeen|tVisitAck|tSetMeet|tGoalsSave|classIn|timeIn|timeOut|tPayVerify|tLeaveRequest|tMsgSend|tFbSubmit|tPcSubmit|tTrialSubmit|tPeerSubmit)$/, R = {};
  var A0 = api;
  api = function(fn){ if(!W.test(fn)) return A0.apply(this, arguments);
    var k = ''; try{ k = fn + '|' + JSON.stringify([].slice.call(arguments, 2)); }catch(e){ return A0.apply(this, arguments); }
    var r = R[k]; if(r && Date.now() - r.t < 3000) return r.p;
    var p = A0.apply(this, arguments); R[k] = { p: p, t: Date.now() }; setTimeout(function(){ if(R[k] && R[k].p === p) delete R[k]; }, 3500); return p; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
