// 811: (Misty) "GO AHEAD AND DO ALL" — management screens minimal, no repeats, interconnected.
// · Overview: the long "Today, teacher by teacher" timeline (the same as Monitor) is replaced by one small "Teachers today" card:
//   Late time-in · No "I'm in" · No video · No homework · No class note (classes ended so far) — each opens Monitor showing only those.
//   "Teachers on time" opens Monitor.
// · Parent reports: "Trial classes" was a second copy of the Trials screen → it now opens Trials.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["onclick=\"RP_K='trial';renderReports()\">Trial classes", "onclick=\"go('trials')\">Trial classes ›"],
  ["onclick=\"go('team')\"><div class=\"ov-th\"><b>Teachers on time", "onclick=\"go('monitor')\"><div class=\"ov-th\"><b>Teachers on time"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 811 · Overview: one small Monitor card instead of the repeated timeline */
(function(){
  if(window.__811) return; window.__811 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>.ov-mon .ov-mb{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}.ov-mon .ov-mb button{border:0;border-radius:12px;padding:10px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;background:#FDECEA;color:#B4442F}.ov-mon .ov-mb button.ok{background:#E8F6EE;color:#1C7A55}</style>');
  const ATT = [['late', 'Late time-in'], ['ci', 'No “I’m in”'], ['vid', 'No video'], ['hw', 'No homework'], ['note', 'No class note']];
  function counts(){ let d = null; try{ d = JSON.parse(localStorage.getItem('coe.mon') || 'null'); d = d && d.data; }catch(e){} if(!d || d.day !== d.today) return null;
    const now = Date.now(), a = { late: 0, ci: 0, vid: 0, hw: 0, note: 0, teachers: (d.teachers || []).length, at: d.now };
    (d.teachers || []).forEach(t => { if(t.timeIn && /late/i.test(t.timeIn.status || '')) a.late++;
      t.classes.forEach(c => { if(c.cancelled) return; const st = Date.parse(c.start) <= now, en = Date.parse(c.end) <= now, nd = c.code && c.type !== 'Trial';
        if(st && !c.ci) a.ci++; if(en){ if(c.code && !c.vid && now - Date.parse(c.end) > 15 * 6e4) a.vid++; if(nd && !c.hw) a.hw++; if(nd && !c.note) a.note++; } }); });
    return a; }
  window.ovMon = k => { go('monitor'); setTimeout(() => { try{ if(k && window.moAtt) moAtt(k); }catch(e){} }, 60); };
  function card(){ const a = counts(), bad = a ? ATT.filter(([k]) => a[k]) : [];
    return '<section class="ov-sec ov-card ov-mon" id="ovMon"><div class="ov-hd"><h2>Teachers today</h2><a class="lk" onclick="ovMon(\'\')">Monitor ›</a></div>' +
      (!a ? '<div class="small mute">Open Monitor to see every teacher’s classes, videos, homework and notes.</div>' :
        '<div class="ov-mb">' + (bad.length ? bad.map(([k, l]) => '<button onclick="ovMon(\'' + k + '\')">' + l + ' · ' + a[k] + '</button>').join('') : '<button class="ok" onclick="ovMon(\'\')">✓ Nothing missing so far · ' + a.teachers + ' teachers</button>') + '</div>' +
        '<div class="small mute" style="margin-top:8px">Classes ended so far · updated ' + esc(a.at || '') + '</div>') + '</section>'; }
  function fix(){ const v = $('v-home'); if(!v) return;
    const h2 = [...v.querySelectorAll('h2')].find(x => /^Today, teacher by teacher/.test(x.textContent.trim())), sec = h2 && h2.closest('section');
    const old = $('ovMon'), html = card();
    if(sec){ sec.insertAdjacentHTML('beforebegin', html); sec.remove(); if(old) old.remove(); return; }
    if(old){ if(old.outerHTML !== html) old.outerHTML = html; return; }
    const dec = $('ovDecide'); if(dec) dec.insertAdjacentHTML('afterend', html); }
  const _rh = window.renderHome; if(typeof _rh === 'function') window.renderHome = function(){ const r = _rh.apply(this, arguments); try{ fix(); }catch(e){} return r; };
  new MutationObserver(() => { try{ const v = $('v-home'); if(v && !v.classList.contains('hide') && [...v.querySelectorAll('h2')].some(x => /^Today, teacher by teacher/.test(x.textContent.trim()))) fix(); }catch(e){} }).observe(document.body, { childList: true, subtree: true });
  // keep the card fresh: Monitor's data is loaded in the background on Overview too
  setInterval(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'home' && !document.hidden && window.moLoad){ moLoad(); setTimeout(fix, 2500); } }catch(e){} }, 120000);
  setTimeout(() => { try{ if(window.moLoad && typeof D !== 'undefined' && D && D.mgr){ moLoad(); setTimeout(fix, 3000); } }catch(e){} }, 4000);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
