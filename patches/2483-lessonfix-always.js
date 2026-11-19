// 2483 (Misty 20:52, phone: Chenyu's Lesson Summary still showed March 2.5): a corrected month is applied when the summary is drawn,
//   from the saved corrections (docs sys:lessonfix, kept on the device too), whatever copy of the package list the device has.
//   Same rule as the server (2456): the month is set for the whole student; "completed" moves by the same amount. Applying twice changes nothing.
const file = process.argv[2];
const JS = String.raw`<script id="b2483">
(function(){ var K = 'coe.lf2483', F = null; try{ F = JSON.parse(localStorage.getItem(K) || 'null'); }catch(e){}
  function conv(fix){ return Object.keys(fix || {}).map(function(k){ var p = k.split('|'), x = fix[k] || {}; return { code: String(p[0] || '').toUpperCase(), ym: p[1], v: x.v, was: x.was }; }).filter(function(f){ return typeof f.v === 'number' && /^\d{4}-\d{2}$/.test(f.ym); }); }
  function load(){ try{ if(!(typeof D !== 'undefined' && D && D.mgr && typeof TOKEN !== 'undefined' && TOKEN)) return;
    fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:lessonfix'] }) }).then(function(r){ return r.json(); })
      .then(function(r){ var d = r && r.ok && r.docs && r.docs['sys:lessonfix']; if(r && r.ok){ F = d && d.data ? conv(d.data.fix) : []; try{ localStorage.setItem(K, JSON.stringify(F)); }catch(e){} } }).catch(function(){}); }catch(e){} }
  function fixAT(){ try{ if(typeof AT === 'undefined' || !AT || !Array.isArray(AT.cols) || !Array.isArray(AT.rows) || !window.lf2466) return; var L = F && F.length ? F : (AT.fixes || []); if(!L.length) return;
    var C = {}; AT.cols.forEach(function(c, i){ C[c] = i; }); if(C.months == null || C.code == null) return;
    var codes = {}; L.forEach(function(f){ codes[f.code] = 1; }); var R = AT.rows.filter(function(r){ return codes[String(r[C.code] || '').toUpperCase()]; });
    var sum = function(r){ return (r[C.months] || []).reduce(function(a, x){ return a + (+x || 0); }, 0); }, before = R.map(sum), keep = AT.fixes;
    AT.fixes = L; window.lf2466(AT); AT.fixes = keep && keep.length ? keep : L;
    R.forEach(function(r, i){ var d = Math.round((sum(r) - before[i]) * 10) / 10; if(d && C.finished != null && r[C.finished] !== '' && r[C.finished] != null) r[C.finished] = Math.round((+r[C.finished] + d) * 10) / 10; }); }catch(e){ console.warn('2483', e); } }
  ['lsHtml', 'shHtml'].forEach(function(n){ var f = window[n]; if(typeof f === 'function') window[n] = function(){ fixAT(); return f.apply(this, arguments); }; });
  var s0 = window.lf2456; if(typeof s0 === 'function') window.lf2456 = function(){ var p = s0.apply(this, arguments); try{ Promise.resolve(p).then(function(){ setTimeout(load, 1500); }); }catch(e){} return p; };
  setTimeout(load, 3000); setInterval(load, 10 * 6e4);
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', JS + '<script id="b2278">']]);
