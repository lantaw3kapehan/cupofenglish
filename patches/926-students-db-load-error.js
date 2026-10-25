// 926 (D2 · Students, Database sheet): a failed first load no longer leaves a bare grey line.
// Found in this audit (preview, Operations role, where the sample has no student/DATABASE data — same code path as a
// real network failure): Students showed only "Could not load students." and Database only "Could not load DATABASE."
// — no page title, no explanation, no way to retry except the top ↻ button.
// Change: same treatment as 921 — page title stays, an error card says what failed, that nothing was changed, and offers
// "Try again" (calls the existing loader). Loaders, caching and data are unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 926 · Students / Database: clear error state on a failed load */
(function(){ if(window.__926) return; window.__926 = 1;
  const card = (title, what, fn) => '<div class="lead"><h1>' + title + '</h1></div><div class="ui-card" role="alert" style="margin-top:12px"><b style="font-size:15px">Could not load ' + what + '.</b>' +
    '<div class="ui-sub" style="margin:4px 0 12px">Check the internet connection and try again. Nothing was changed.</div><button type="button" class="btn teal sm" onclick="' + fn + '">Try again</button></div>';
  function fix(id, re, title, what, fn){ const el = document.getElementById(id); if(!el) return; const e = [...el.querySelectorAll('.empty')].find(x => re.test(x.textContent)); if(!e) return;
    const box = document.createElement('div'); box.id = id + '926'; box.innerHTML = card(title, what, fn); e.replaceWith(box); }
  const wrap = (name, after) => { const f0 = window[name]; if(typeof f0 !== 'function') return; window[name] = async function(){ let r; try{ r = await f0.apply(this, arguments); }finally{ try{ after(); }catch(e){} } return r; }; };
  wrap('loadStudents', () => fix('v-astudents', /^Could not load students\.$/, 'Students', 'the student list', 'stu926Retry()'));
  wrap('loadDb', () => fix('v-db', /^Could not load DATABASE\.$/, 'Database', 'the DATABASE sheet', 'db926Retry()'));
  const busy = id => { const b = document.getElementById(id); if(b) b.innerHTML = '<div class="sk"></div><div class="sk"></div>'; };
  window.stu926Retry = function(){ busy('v-astudents926'); return window.loadStudents(); };
  window.db926Retry = function(){ busy('v-db926'); return window.loadDb(); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
