// 2484 (Misty 21:03 "yes go ahead"): To do (Operations and President) lists packages whose first month also counts lessons from before the
//   start (payment) date, like Chenyu. Each row: the month in the sheet, the lessons before / from the start date (class records),
//   and, when the records explain the sheet exactly, "Correct to N" (saved as a lesson correction with a note; undo in the Lesson Summary).
//   Rows where the records do not match the sheet are listed with "Open" to check by hand. Nothing is changed without a click.
const file = process.argv[2];
const JS = String.raw`<style id="u2484">#fm2484{order:3;background:#fff;border:1px solid #ECEAF2;border-radius:16px;padding:14px 18px;margin:0 0 14px}
#fm2484 h3{margin:0;font-size:17px;color:#2B2253}#fm2484 .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 12px;align-items:center;padding:9px 0;border-top:1px solid #F1F0F6;font-size:13.5px}
#fm2484 .r:first-of-type{border-top:0}#fm2484 .n b{color:#2B2253}#fm2484 .n small{display:block;color:#6B6880;font-size:12.5px;margin-top:1px}#fm2484 .bb{display:flex;gap:6px}
#fm2484 .k{display:inline-block;border-radius:6px;padding:0 6px;font-size:11.5px;font-weight:600}#fm2484 .k.c{background:#E4F4F1;color:#1E6F5C}#fm2484 .k.u{background:#FFF1D6;color:#8A5A00}</style>
<script id="b2484">
(function(){ var R = null, at = 0, busy = 0, open = 0, done = {};
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var OPS = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-ops';
  var mgr = function(){ try{ return typeof D !== 'undefined' && D && D.mgr; }catch(e){ return false; } };
  var dl = function(d){ var x = new Date(d + 'T12:00:00'); return isNaN(x) ? d : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  var ml = function(ym){ var x = new Date(ym + '-15T12:00:00'); return isNaN(x) ? ym : x.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); };
  function load(f){ if(!mgr() || busy || (!f && R && Date.now() - at < 5 * 6e4)) return; busy = 1;
    fetch(OPS, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'firstmonth' }) }).then(function(r){ return r.json(); })
      .then(function(r){ busy = 0; if(r && r.ok){ R = r.rows || []; at = Date.now(); paint(); } }).catch(function(){ busy = 0; }); }
  function html(){ var L = (R || []).filter(function(x){ return !done[x.code + '|' + x.ym]; }); if(!L.length) return '';
    var C = L.filter(function(x){ return x.clear; }).length, S = open ? L : L.slice(0, 6);
    return '<section id="fm2484"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap"><h3>First month to check · ' + L.length + '</h3><span class="small mute">' + C + ' ready to correct · ' + (L.length - C) + ' to check by hand</span></div>'
      + '<div class="small mute" style="margin:4px 0 6px">The package started after the 1st, but its first month also counts lessons from before the start date. Those belong to the previous package.</div>'
      + S.map(function(x){ var k = x.code + '|' + x.ym;
        return '<div class="r"><div class="n"><b>' + E(x.name) + '</b> <span class="mute small">' + E(x.code) + ' · ' + E(x.teachers) + '</span> ' + (x.clear ? '<span class="k c">Records match</span>' : '<span class="k u">Check by hand</span>')
          + '<small>Started ' + E(dl(x.start)) + ' · ' + E(ml(x.ym)) + ' counts <b>' + x.sheet + '</b> · class records: ' + x.before + ' before the start, ' + x['from'] + ' from the start</small></div>'
          + '<div class="bb">' + (x.clear ? '<button class="btn teal sm" onclick="fm2484Fix(\'' + E(k) + '\')">Correct to ' + x.suggest + '</button>' : '') + '<button class="btn ghost sm" onclick="openStudent(\'' + E(x.code) + '\')">Open</button></div></div>'; }).join('')
      + (L.length > S.length ? '<div style="padding-top:8px"><button class="btn ghost sm" onclick="fm2484All()">Show all ' + L.length + '</button></div>' : '') + '</section>'; }
  function paint(){ var v = document.getElementById('v-mtoday'); if(!v) return; var o = document.getElementById('fm2484'), h = html();
    if(!h){ if(o) o.remove(); return; } if(o){ if(o.outerHTML !== h) o.outerHTML = h; } else v.insertAdjacentHTML('beforeend', h); }
  window.fm2484All = function(){ open = 1; paint(); };
  window.fm2484Fix = function(k){ var x = (R || []).find(function(y){ return y.code + '|' + y.ym === k; }); if(!x || !x.clear) return;
    if(!confirm(x.name + ' · ' + ml(x.ym) + ': change ' + x.sheet + ' to ' + x.suggest + '?\n\nOnly the lessons from ' + dl(x.start) + ' count for this package. You can undo it in the Lesson Summary.')) return;
    fetch(OPS, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'lessonfix', code: x.code, ym: x.ym, v: x.suggest, was: x.sheet, note: 'First month counted from the start date ' + dl(x.start) + ' (earlier lessons belong to the previous package)' }) })
      .then(function(r){ return r.json(); }).then(function(r){ if(r && r.ok){ done[k] = 1; paint(); try{ toast('Saved · ' + x.name + ' ' + ml(x.ym) + ' = ' + x.suggest); }catch(e){} setTimeout(function(){ load(1); }, 1500); } else { try{ toast((r && r.error) || 'Not saved. Try again.'); }catch(e){} } })
      .catch(function(){ try{ toast('Not saved. Try again.'); }catch(e){} }); };
  setInterval(function(){ try{ if(mgr() && typeof VIEW !== 'undefined' && VIEW === 'mtoday'){ load(); if(R) paint(); } }catch(e){} }, 3000);
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', JS + '<script id="b2278">']]);
