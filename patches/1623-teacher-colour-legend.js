// 1623: design system · labelled colours on teacher screens. The class colours on the teacher's day strip (Today) and on the
// Schedule's class bars are the course-book colours from the CupOfEnglish calendar (RAZ red, WK orange, Phonics yellow, RE green,
// Free talk blue, OD indigo, other grey, trial teal), but only management's Schedule had a key. Now a one-line key sits at the
// bottom of the teacher's "day at a glance" card (Today) and above the day-by-day class list (Schedule): "Colours = course book".
// · Same colours and names as management's key (BOOKC), plus Trial. Drawn in the same step as the card (MutationObserver
//   callback, before the browser paints), fixed height, so nothing moves. Display only.
// · Schedule class list: the "Trial" chip was red → teal (as everywhere since 1621).
// · Leave bar: "N upcoming or waiting" was red → amber (waiting is amber; red is for problems).
const fs = require('fs'), lib = require('../tools/lib.js'), file = process.argv[2];
{ let s = fs.readFileSync(file, 'utf8'); const a = "<span class=\"chip ${e.type === 'Trial' ? 'coral' : ''}\">", c = s.split(a).length - 1;
  if (c !== 2) { console.error('Expected 2 matches, found ' + c + ' for: ' + a); process.exit(1); }
  fs.writeFileSync(file, s.split(a).join("<span class=\"chip ${e.type === 'Trial' ? 'teal' : ''}\">")); }
lib(file, [
  ['<b style="color:#B5533F">${now.length} upcoming or waiting</b>', '<b style="color:var(--coe-warn-fg,#7A4A00)">${now.length} upcoming or waiting</b>'],
  ["</script>\n</body>\n</html>",
   `</script>
<style id="css1623">
.k1623{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;margin:10px 0 0;min-height:18px;font:500 var(--coe-fs-12,12px)/18px var(--coe-font,Inter,sans-serif);color:var(--coe-mute,#5E5A76)}
.k1623>b{font-weight:600;color:var(--coe-text,#3A3556)}
.k1623>span{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
#v-tsched>.k1623{margin:14px 4px 10px}
.k1623 i{width:8px;height:8px;border-radius:50%;display:inline-block;flex:none}
</style>
<script>
/* 1623 · course-book colour key on the teacher's Today strip and Schedule week card */
(function(){
  if(window.__1623) return; window.__1623 = 1;
  function key(){
    var L = []; try{ if(typeof BOOKC !== 'undefined') BOOKC.forEach(function(x){ L.push([x[0] === 'Freetalk' ? 'Free talk' : x[0], x[2]]); }); }catch(e){}
    if(!L.length) return '';
    L.push(['Other', '#9A98A8'], ['Trial', '#5FB8BE']);
    return '<div class="k1623" role="note" aria-label="Class colours show the course book"><b>Colours = course book</b>' + L.map(function(x){ return '<span><i style="background:' + x[1] + '"></i>' + x[0] + '</span>'; }).join('') + '</div>';
  }
  function place(){
    try{
      if(typeof D !== 'undefined' && D && D.mgr) return;
      var h = null;
      var box = document.querySelector('#v-today section.yd92');
      if(box && !box.querySelector(':scope>.k1623')){ h = key(); if(h) box.insertAdjacentHTML('beforeend', h); }
      var v = document.getElementById('v-tsched'), d1 = v && v.querySelector(':scope>.dl501');
      if(d1 && !v.querySelector(':scope>.k1623')){ h = h == null ? key() : h; if(h) d1.insertAdjacentHTML('beforebegin', h.replace('class="k1623"', 'class="k1623 ts1623"')); }
    }catch(e){}
  }
  ['v-today', 'v-tsched'].forEach(function(id){ var v = document.getElementById(id); if(v) new MutationObserver(place).observe(v, { childList: true, subtree: true }); });
  place();
})();
</script>
</body>
</html>`],
]);
