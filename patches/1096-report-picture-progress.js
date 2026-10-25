// 1096: (Misty, 25 Oct 21:57) "do we also put progress over the months?" — yes: the parent picture shows the last
//      months' totals under the total score (up to 6 months, this month dark teal), labelled with the month of the
//      classes (Sep · Oct …, like the PDF since 1093). Shown only when there are at least two months.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [["if(it) C[k] = it.map(function(a){ return (a || []).map(Number); }); };",
  "if(it) C[k] = it.map(function(a){ return (a || []).map(Number); });\n    try{ var hs = (r.hist || []).filter(function(y){ return y.month <= x.month && y.total != null && y.total !== ''; }).sort(function(a, b){ return String(a.month).localeCompare(String(b.month)); }).map(function(y){ return { m: y.month, t: +y.total }; });\n      if(!hs.some(function(y){ return y.m === x.month; }) && RPD.fb && RPD.fb.total != null) hs.push({ m: x.month, t: +RPD.fb.total }); window.__h1096 = window.__h1096 || {}; __h1096[k] = hs.slice(-6); }catch(e){} };"]]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1096 · progress over the months on the parent picture */
(function(){
  if(window.__1096) return; window.__1096 = 1;
  var _h = window.rpPicHtml; if(typeof _h !== 'function') return;
  window.rpPicHtml = function(){ var h = _h.apply(this, arguments); try{
    var x = RPD.report, hs = (window.__h1096 || {})[x.code + '|' + x.month]; if(!h || !hs || hs.length < 2) return h;
    var lab = function(m){ var c = window.fbClsKey ? fbClsKey(m) : m; return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][(+String(c).slice(5, 7)) - 1] || c; };
    var zh = function(m){ var c = String(window.fbClsKey ? fbClsKey(m) : m); return (+c.slice(5, 7)) + '月'; };
    var bars = hs.map(function(y){ var cur = y.m === x.month, hh = Math.max(12, Math.round(Math.max(0, Math.min(100, y.t)) / 100 * 170));
      return '<div style="flex:1;max-width:130px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end"><div style="font-size:30px;font-weight:700;color:#2B2450;margin-bottom:8px">' + y.t + '</div><div style="width:100%;height:' + hh + 'px;border-radius:16px;background:' + (cur ? '#2E8F96' : '#CDEBE8') + '"></div><div style="font-size:26px;color:' + (cur ? '#2B2450' : '#5E5A76') + ';font-weight:' + (cur ? 700 : 500) + ';margin-top:10px">' + lab(y.m) + '</div><div style="font-size:22px;color:#5E5A76">' + zh(y.m) + '</div></div>'; }).join('');
    var part = '<div style="margin-top:36px"><div style="font-size:34px;font-weight:700;color:#2B2450">Progress over the months <span style="color:#2E8F96">历月总分</span></div><div style="display:flex;gap:28px;align-items:flex-end;margin-top:22px;height:290px">' + bars + '</div></div>';
    var mk = '<div style="margin-top:30px">', j = h.indexOf(mk); if(j < 0) return h; return h.slice(0, j) + part + h.slice(j); }catch(e){ return h; } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
