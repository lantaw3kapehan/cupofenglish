// 1099: (Misty, 25 Oct 22:05 "yes you can do it") — the Chinese under the teacher's comments, rewritten to native-speaker,
//      professional standard for parents, is used wherever the report is shown or sent from the app.
// · Reviewed Chinese is kept in the database (docs "fbcn:<student code>|<cycle key>": strengths · areas · next, by, at).
//   It replaces the machine translation in: the report window, the parent picture (Copy picture) and the PDF made in the app.
//   The teacher's English and the scores are never changed.
// · The report window says which one it shows: "中文 · reviewed" (green) or "中文 · machine translation, not reviewed yet" (amber).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["try{ RPD = await api('mgmtReport', TOKEN, key); }catch(e){ $('sheetBody').innerHTML = '<h1>Parent report</h1><div class=\"empty\">Could not open this report.</div>'; return; }",
   "try{ RPD = await api('mgmtReport', TOKEN, key); }catch(e){ $('sheetBody').innerHTML = '<h1>Parent report</h1><div class=\"empty\">Could not open this report.</div>'; return; }\ntry{ if(window.fbcnApply) await fbcnApply(RPD); }catch(x){}"],
  ["async function make(code, month, hint){ const r = await data(code);",
   "async function make(code, month, hint){ const r = await data(code); try{ if(window.fbcnLoad) await fbcnLoad(code, month); }catch(x){}"],
  ["zh: Object.assign({}, f.cn || {})", "zh: Object.assign({}, f.cn || {}, (window.__fbcn || {})[code + '|' + month] || {})"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1099 · reviewed Chinese for parent reports */
(function(){
  if(window.__1099) return; window.__1099 = 1;
  window.__fbcn = window.__fbcn || {};
  window.fbcnLoad = async function(code, month){
    var k = code + '|' + month; if(k in __fbcn) return __fbcn[k];
    var ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(function(){ ac.abort(); }, 3000) : 0;
    try{ var r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['fbcn:' + k] }), signal: ac ? ac.signal : undefined }).then(function(y){ return y.json(); });
      var d = r && r.ok && r.docs && r.docs['fbcn:' + k]; __fbcn[k] = d && d.data ? { strengths: d.data.strengths || '', areas: d.data.areas || '', next: d.data.next || '', _by: d.data.by || '' } : null; }
    catch(e){ return null; } finally{ clearTimeout(t); }
    return __fbcn[k]; };
  window.fbcnApply = async function(R){ if(!R || !R.report || !R.fb) return; var c = await fbcnLoad(R.report.code, R.report.month); if(!c) return;
    R.fb.cn = Object.assign({}, R.fb.cn || {}); ['strengths', 'areas', 'next'].forEach(function(k){ if(c[k]) R.fb.cn[k] = c[k]; }); R.fb._cnOk = 1; };
  var _b = window.rpBtns;
  if(typeof _b === 'function') window.rpBtns = function(){ var r = _b.apply(this, arguments); try{
    if(typeof RPD === 'undefined' || !RPD || !RPD.fb) return r; var sb = document.getElementById('sheetBody'); if(!sb || sb.querySelector('.cn1099')) return r;
    var rp = sb.querySelector('.rp-tx'); if(!rp) return r;
    rp.insertAdjacentHTML('beforebegin', RPD.fb._cnOk ? '<div class="cn1099 small" style="margin-top:10px;color:#1E7A55;font-weight:600">中文 · reviewed for parents</div>' : '<div class="cn1099 small" style="margin-top:10px;color:#9A5B00;font-weight:600">中文 · machine translation, not reviewed yet</div>'); }catch(e){} return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
