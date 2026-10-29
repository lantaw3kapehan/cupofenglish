// 1594: (Misty 11:19, live: "opening a student still flickers and adjusts") reproduced in the preview with her conditions: browser storage
// full (no kept copy of the student, every save refused), answers arriving 1–6 s apart in random order, 4x CPU. Shifts found:
//  · when the class list came after the page: the Every week row (45 px) was added to the header later → toolbar, tabs, Status, Changes and
//    Schedule all moved down 73 px (0.217 in one run); the Schedule box grew from its 2 loading bars (128 px) to the calendar (707 px).
//  · the learner chip was added to the name line when DATABASE arrived (could wrap the line on a phone).
//  · the Course Books button was moved into the toolbar on a timer: Edit details jumped sideways.
// Fix: the Every week row is drawn at once with a hidden pill (same height) and "Loading the schedule…"; "No weekly schedule yet" keeps the
// same height; the Schedule box keeps the space it had last time for this student (else 700 px) while loading; the learner chip keeps an
// invisible placeholder until DATABASE is there.
// Storage: when this device's storage is full, the app now frees the oldest kept student / class copies and tries again; if it still can't,
// it keeps the copy in memory for this session, so reopening a student is instant and does not redraw.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["'<section class=\"sec\"><h2>Schedule <span class=\"c\">Google Calendar</span></h2><div class=\"sk\"></div><div class=\"sk\"></div></section>'",
   "'<section class=\"sec\" style=\"min-height:' + (((window.__schH1594 || {})[code]) || (innerWidth < 620 ? 1260 : 710)) + 'px\"><h2>Schedule <span class=\"c\">Google Calendar</span></h2><div class=\"sk\"></div><div class=\"sk\"></div></section>'"],
  ["if(!STU.cls){ return; }",
   "if(!STU.cls){ if(!hero.querySelector('.shwk')) hero.insertAdjacentHTML('beforeend', '<div class=\"shwk ld1594\"><span class=\"lb\">Every week</span><span class=\"sl\" aria-hidden=\"true\" style=\"visibility:hidden\"><b>Mon</b>00:00</span><span class=\"mt\">Loading the schedule…</span><span class=\"nx\" aria-hidden=\"true\" style=\"visibility:hidden\">Next · Tue, 26 Oct 18:30</span></div>'); return; }   /* 1594: same height before the classes arrive */"],
  ["Every week</span><span class=\"mt\">No weekly schedule yet'",
   "Every week</span><span class=\"sl\" aria-hidden=\"true\" style=\"visibility:hidden;width:0;padding-left:0;padding-right:0;overflow:hidden\"><b></b>&nbsp;</span><span class=\"mt\">No weekly schedule yet'"],
  ["function card(){ if(!dbReady() || typeof STU === 'undefined' || !STU || !STU.code) return;",
   "function card(){ if(typeof STU === 'undefined' || !STU || !STU.code) return; if(!dbReady()){ const h0 = document.querySelector('#sheetBody .shero h1'); if(h0 && !h0.querySelector('.lt1588')) h0.insertAdjacentHTML('beforeend', '<span class=\"lt1588 unk\" aria-hidden=\"true\" style=\"visibility:hidden\">Young Learners</span>'); return; }   /* 1594: space kept */"],
  ["</body>\n</html>",
   `<script>
/* 1594 · remember each student's schedule height; full browser storage: free old copies, else keep them in memory */
(function(){
  if(window.__1594) return; window.__1594 = 1;
  window.__schH1594 = {};
  try{ const st = document.createElement('style'); st.id = 'css1594'; st.textContent = '@media(max-width:620px){#sheetBody .shwk.ld1594 .mt{flex-basis:100%}}'; document.head.appendChild(st); }catch(e){}
  const r0 = window.stuRender; if(typeof r0 === 'function') window.stuRender = function(){ const r = r0.apply(this, arguments);
    try{ const bb = document.getElementById('bbBtn'), g = document.querySelector('#sheetBody .stu-bar .grp'); if(bb && g && bb.parentNode !== g){ const pr = [...g.querySelectorAll('.btn')].find(x => /Print/i.test(x.textContent)); g.insertBefore(bb, pr || null); } }catch(e){}   /* Course Books in its place in the same frame (was a timer: Edit details jumped) */
    try{ if(typeof STU !== 'undefined' && STU && STU.cls){ const el = document.getElementById('stuSch'); if(el){ const h = el.offsetHeight; if(h > 200) __schH1594[STU.code] = h; } } }catch(e){} return r; };
  const MEM = window.__mem1594 = {}, KEEP = /^coe\\.(stu|cls)\\.(?!@)/;
  function evict(){ let at = {}; try{ at = JSON.parse(localStorage.getItem('coe.stu.@at') || '{}') || {}; }catch(e){}
    const K = []; try{ for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(KEEP.test(k)) K.push(k); } }catch(e){}
    K.sort((a, b) => (at[a.replace(/^coe\\.(stu|cls)\\./, '')] || 0) - (at[b.replace(/^coe\\.(stu|cls)\\./, '')] || 0)); K.slice(0, 12).forEach(k => { try{ localStorage.removeItem(k); }catch(e){} }); return K.length; }
  const s0 = window.store; if(typeof s0 !== 'function') return;
  window.store = function(op, k, v){ const r = s0.apply(this, arguments);
    try{ if(typeof k !== 'string') return r;
      if(op === 'get'){ return r == null && Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : r; }
      if(op === 'set'){ let ok = false; try{ ok = localStorage.getItem(k) === String(v); }catch(e){}
        if(!ok){ let n = 0; try{ n = evict(); }catch(e){} if(n){ try{ localStorage.setItem(k, v); ok = localStorage.getItem(k) === String(v); }catch(e){} } }
        if(ok) delete MEM[k]; else MEM[k] = String(v); }
      else delete MEM[k]; }catch(e){}
    return r; };
})();
</script>
</body>
</html>`]
]);
