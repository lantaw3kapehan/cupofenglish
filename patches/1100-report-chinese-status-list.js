// 1100: (Misty, 25 Oct 22:10) Parent reports list shows whether the Chinese translation has been reviewed — in English,
//      so Operations can read it: "Chinese reviewed" (green) / "Chinese not reviewed yet" (amber) on each report that is
//      not sent yet, and a filter "Chinese not reviewed · N". The report window label is in English too.
//      One database read for the whole list (docs fbcn:<code>|<cycle>), refreshed when the list is drawn again.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
[["中文 · reviewed for parents</div>", "Chinese translation · reviewed for parents</div>"], ["中文 · machine translation, not reviewed yet</div>", "Chinese translation · machine translation, not reviewed yet — wait before sending</div>"]]
  .forEach(([a, b]) => { if(s.split(a).length !== 2) throw new Error('1100 ' + a); s = s.split(a).join(b); });
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="d1100">.cn1100{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:999px;font-size:.75rem;font-weight:600;vertical-align:1px}.cn1100.ok{background:#E3F4EC;color:#1E7A55}.cn1100.no{background:#FBF0DD;color:#8A5300}</style>
<script>
/* 1100 · Chinese translation status in the Parent reports list */
(function(){
  if(window.__1100) return; window.__1100 = 1;
  var busy = 0, at = 0;
  function rows(){ return (typeof RP !== 'undefined' && RP && RP.rows) ? RP.rows.filter(function(x){ return !/^Sent/.test(x.status); }) : []; }
  function mo(){ return RP.month || RP.current; }
  async function load(force){
    var R = rows(), m = mo(), need = R.filter(function(x){ return force || !((x.code + '|' + m) in (window.__fbcn || {})); }); if(!need.length || busy) return false;
    busy = 1; try{ window.__fbcn = window.__fbcn || {};
      for(var j = 0; j < need.length; j += 60){ var part = need.slice(j, j + 60), keys = part.map(function(x){ return 'fbcn:' + x.code + '|' + m; });
        var r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: keys }) }).then(function(y){ return y.json(); });
        if(!r || !r.ok) return false;
        part.forEach(function(x, n){ var d = r.docs && r.docs[keys[n]]; __fbcn[x.code + '|' + m] = d && d.data ? { strengths: d.data.strengths || '', areas: d.data.areas || '', next: d.data.next || '', _by: d.data.by || '' } : null; }); }
      at = Date.now(); return true; }catch(e){ return false; } finally{ busy = 0; } }
  function paint(){ try{ var v = document.getElementById('v-reports'); if(!v || typeof RP === 'undefined' || !RP) return; var m = mo(), C = window.__fbcn || {}, R = rows(), known = R.filter(function(x){ return (x.code + '|' + m) in C; }), nNo = known.filter(function(x){ return !C[x.code + '|' + m]; }).length;
    var segs = v.querySelectorAll('.seg'), sg = segs[segs.length - 1];
    if(sg && !sg.querySelector('.f1100')){ var b = document.createElement('button'); b.className = 'f1100' + (RP_F === 'cnx' ? ' on' : ''); b.textContent = 'Chinese not reviewed · ' + (known.length ? nNo : '…'); b.onclick = function(){ RP_F = 'cnx'; renderReports(); }; sg.appendChild(b); }
    if(RP_F === 'cnx') segs.forEach(function(s2){ s2.querySelectorAll('button.on').forEach(function(x){ if(!x.classList.contains('f1100') && /reports ·/.test(x.textContent)) x.classList.remove('on'); }); });
    var map = {}; (RP.rows || []).forEach(function(x){ map[x.key] = x; });
    v.querySelectorAll('.rp-row[onclick^="rpOpen("]').forEach(function(el){ var k = (el.getAttribute('onclick').match(/rpOpen\('(.*)'\)/) || [])[1], x = k && map[k.replace(/&amp;/g, '&').replace(/&#39;/g, "'")]; if(!x) return;
      if(RP_F === 'cnx' && (/^Sent/.test(x.status) || C[x.code + '|' + m] || !((x.code + '|' + m) in C))){ el.style.display = 'none'; return; }
      if(/^Sent/.test(x.status) || el.querySelector('.cn1100') || !((x.code + '|' + m) in C)) return;
      var line = el.querySelector('.grow .small.mute'); if(line) line.insertAdjacentHTML('beforeend', C[x.code + '|' + m] ? '<span class="cn1100 ok">Chinese reviewed</span>' : '<span class="cn1100 no">Chinese not reviewed yet</span>'); });
    if(RP_F === 'cnx' && !v.querySelector('.rp-row:not([style*="display: none"])')){ var sec = v.querySelector('section.sec'); if(sec && !sec.querySelector('.e1100')) sec.insertAdjacentHTML('beforeend', '<div class="empty e1100">' + (known.length ? 'Every report waiting to be sent has reviewed Chinese.' : 'Checking the Chinese translations…') + '</div>'); }
  }catch(e){} }
  var _rr = window.renderReports;
  if(typeof _rr === 'function') window.renderReports = function(){ var r = _rr.apply(this, arguments); paint(); if(Date.now() - at > 60000) load(Date.now() - at > 60000 && at > 0).then(function(ch){ if(ch && typeof VIEW !== 'undefined' && VIEW === 'reports'){ var f = window.renderReports; f(); } }); else load(false).then(function(ch){ if(ch) window.renderReports(); }); return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
