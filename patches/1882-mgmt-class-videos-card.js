// 1882: (Misty 7 Nov 22:27 "let us do all now" · build 2: missing-video follow-up)
//   Management To do: a "Class videos" card from the database (coe-stuvid vidsum → coe_vid_follow 'mgmt'): yesterday's missing videos
//   (with the classes) and late uploads by teacher, and this month so far. Tap a teacher → her Lessons by student for that month.
//   Shown only when something is missing or late. Teachers also get one reminder at 22:30 for today's classes without a video (database job).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["/* 20 Oct · 390 · One \"Changes\" card on the student page,",
   `/* 1882 · Class videos card on management To do */
(function(){
  let V = null, at = 0, busy = false;
  async function load(){ if(busy || !TOKEN || !(typeof D !== 'undefined' && D && D.mgr) || Date.now() - at < 10 * 6e4) return; busy = true;
    try{ const r = await fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, vidsum: true }) }).then(x => x.json());
      if(r && r.ok){ V = r; at = Date.now(); card(); } }catch(e){} finally{ busy = false; } }
  function card(){ const v = $('v-mtoday'); if(!v) return; let el = $('vid1882'); const L = (V && V.list) || [];
    if(!L.length){ if(el) el.remove(); return; }
    const ym = String(V.day || '').slice(0, 7), mon = new Date(String(V.day) + 'T12:00:00').toLocaleDateString('en-US', { month: 'long' }), dl = new Date(String(V.day) + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    const row = x => '<div style="padding:8px 0;border-top:1px solid #EFEDF4;cursor:pointer" onclick="ps1752Lessons(\\'' + esc(String(x.teacher)).replace(/'/g, '') + '\\',\\'' + ym + '\\')"><b>' + esc(x.teacher) + '</b> '
      + (x.missing ? '<span style="color:#B42318;font-weight:600">' + x.missing + ' missing</span> <span class="small mute">' + esc(x.classes || '') + '</span>' : '<span class="small" style="color:#0E6B5C">yesterday all in</span>')
      + (x.late ? ' · <span style="color:#B54708;font-weight:600">' + x.late + ' late</span>' : '')
      + '<div class="small mute">' + esc(mon) + ' so far: ' + x.monthMissing + ' missing · ' + x.monthLate + ' late upload' + (x.monthLate === 1 ? '' : 's') + ' · tap for the lessons</div></div>';
    const html = '<div class="card" id="vid1882" style="margin:0 0 14px"><b>▶ Class videos</b> <span class="small mute">· yesterday ' + esc(dl) + ' and ' + esc(mon) + ' so far</span>'
      + L.map(row).join('') + '<div class="small mute" style="margin-top:6px">Missing = class held, no video or screen proof · late = uploaded after the class day. Teachers get a reminder at 22:30 for classes without a video.</div></div>';
    if(el) el.outerHTML = html; else v.insertAdjacentHTML('afterbegin', html); }
  const rt = window.renderMToday; if(rt) window.renderMToday = function(){ const r = rt.apply(this, arguments); try{ card(); load(); }catch(e){} return r; };
  setTimeout(load, 4000); setInterval(() => { at = 0; load(); }, 30 * 6e4);
})();
</script>
<script>
/* 20 Oct · 390 · One "Changes" card on the student page,`],
]);
