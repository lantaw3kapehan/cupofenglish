// 801: (Misty) "can these be very fast since this is trial … so it treats instantly"
// · Learner type on a trial: tapping it now changes the report AT ONCE. The app makes the new PDF itself in a few seconds
//   (same template, new roadmap and wording) and it is ready to Copy picture / Send. Google saves the choice and makes its own
//   copy of the PDF behind, as before. No "are you sure" box.
// · The old Google PDF is never shown again for that trial (the database copy of the list can lag a few minutes).
// · When Google's PDF is not on this device yet, the app's own PDF is made after 2 s (was 6 s).
const fs = require('fs'), file = process.argv[2];
const lib = require('../tools/lib.js');
lib(file, [
  ["group = r.pick || group || t.group || '';", "group = t._g || r.pick || group || t.group || '';"],
  ["else setTimeout(go, 6000);", "else setTimeout(go, 2000);"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 801 · learner type → new report at once */
(function(){
  if(window.__801 || typeof window.tlGrp !== 'function' || typeof TL_GRPS === 'undefined') return; window.__801 = 1;
  const K = l => 'coe.trgrp.' + l;
  const ov = x => { try{ const o = JSON.parse(localStorage.getItem(K(x.label)) || 'null'); if(!o || Date.now() - o.at > 6 * 3600e3) return null; return o; }catch(e){ return null; } };
  // Apply a learner type changed on this device until Google's list has caught up.
  function apply(x){ if(!x || !x.label) return; const o = ov(x); if(!o) return; if(x.group === o.g && x.pdf !== o.old){ try{ localStorage.removeItem(K(x.label)); }catch(e){} return; }
    x.group = o.g; x._g = o.g; if(x.pdf && x.pdf === o.old){ x.pdf = ''; if(x.status !== 'Sent') x.status = 'Making PDF'; } }
  const _to = window.tlOpen; if(typeof _to === 'function') window.tlOpen = function(i){ try{ apply(((typeof TRL !== 'undefined' && TRL && TRL.rows) || [])[i]); }catch(e){} return _to.apply(this, arguments); };
  window.tlGrp = async function(i){ const x = TLD, g = TL_GRPS[i] && TL_GRPS[i][0]; if(!x || !g || x.group === g) return;
    const old = x.pdf || '', prev = x.group;
    try{ localStorage.setItem(K(x.label), JSON.stringify({ g, old, at: Date.now() })); }catch(e){}
    x.group = g; x._g = g; if(old){ x.pdf = ''; if(x.status !== 'Sent') x.status = 'Making PDF'; } TLB = null;
    try{ tlPaint(); }catch(e){}
    toast('Learner type · ' + TL_GRPS[i][1] + ' · making the new report…');
    try{ const r = await api('mgmtTrialGroup', TOKEN, x.date, x.student, g); if(!r || !r.ok) throw r; }
    catch(e){ toast(((e && e.msg) || 'Google did not save the learner type') + ' · try again'); x.group = prev; x._g = prev || ''; try{ localStorage.removeItem(K(x.label)); }catch(e2){} if(TLD === x){ TLB = null; try{ tlPaint(); }catch(e3){} } } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
