// 1097: (21:59 "and negative colours": down = red, up = green, same = grey; skills show +2 / −1)
// 1097: (Misty, 25 Oct 21:59) "compare from last month too so they can see it, using arrows up and down, positive colours".
//      The parent picture now compares with the month before (when there is one):
//      · under the total: "▲ 7 points from September · 比9月提高7分" in green (or "▼ … · 比9月低…分" in warm amber,
//        or "Same as September · 与9月持平");
//      · the 20 skills: ▲ / ▼ next to a rating that went up / down since then (none when it stayed the same);
//      · each skill: ▲ 2 green / ▼ 1 amber / = grey next to its /25.
//      The month before = the latest earlier feedback month of this student (the same history as the chart).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [["try{ var hs = (r.hist || [])", "try{ window.__r1097 = window.__r1097 || {}; __r1097[k] = r.hist || []; }catch(e){}\n    try{ var hs = (r.hist || [])"]]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1097 · compared with last month on the parent picture */
(function(){
  if(window.__1097) return; window.__1097 = 1;
  var _h = window.rpPicHtml; if(typeof _h !== 'function') return;
  var EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var num = function(v){ var n = parseFloat(v); return isNaN(n) ? null : n; };
  window.rpPicHtml = function(){ var h = _h.apply(this, arguments); try{
    var x = RPD.report, f = RPD.fb, H = (window.__r1097 || {})[x.code + '|' + x.month]; if(!h || !H || !f) return h;
    var pv = H.filter(function(y){ return y.month < x.month && num(y.total) != null; }).sort(function(a, b){ return String(a.month).localeCompare(String(b.month)); }).pop(); if(!pv) return h;
    var c = String(window.fbClsKey ? fbClsKey(pv.month) : pv.month), mi = (+c.slice(5, 7)) - 1, pen = EN[mi] || c, pzh = (mi + 1) + '月';
    var d = Math.round(((num(f.total) || 0) - num(pv.total)) * 10) / 10;
    var t = d > 0 ? '<span style="color:#1E8E5A">▲ ' + d + ' point' + (d === 1 ? '' : 's') + ' from ' + pen + ' · 比' + pzh + '提高' + d + '分</span>'
      : d < 0 ? '<span style="color:#C2483A">▼ ' + (-d) + ' point' + (d === -1 ? '' : 's') + ' from ' + pen + ' · 比' + pzh + '低' + (-d) + '分</span>'
      : '<span style="color:#5E5A76">Same as ' + pen + ' · 与' + pzh + '持平</span>';
    var badge = '<div style="margin-top:18px;font-size:28px;font-weight:600;background:#fff;border-radius:999px;padding:10px 22px;display:inline-block">' + t + '</div>';
    var bar = h.indexOf('<div style="margin-top:22px;height:22px;border-radius:11px;background:#fff;overflow:hidden">');
    if(bar > -1){ var be = h.indexOf('</div></div></div>', bar); if(be > -1) h = h.slice(0, be + 12) + badge + h.slice(be + 12); }
    var K = ['l', 's', 'r', 'w'], n = 0;
    h = h.replace(/\/25<\/span><\/div><\/div>/g, function(m){ var k = K[n++], a = num(f[k]), b = num(pv[k]); if(a == null || b == null) return m;
      var dd = Math.round((a - b) * 10) / 10, z = dd > 0 ? '<span style="color:#1E8E5A">▲ +' + dd + '</span>' : dd < 0 ? '<span style="color:#C2483A">▼ −' + (-dd) + '</span>' : '<span style="color:#8A879C">= same</span>';
      return '/25</span><div style="font-size:24px;font-weight:700;margin-top:4px;white-space:nowrap">' + z + '</div></div></div>'; });
    try{ var pi = [].concat.apply([], (pv.items || []).map(function(a){ return (a || []).map(Number); })), ci = 0, any = 0;
      if(pi.length >= 20) h = h.replace(/<div style="width:36px;text-align:right;font-size:30px;font-weight:700;color:#2B2450">([^<]*)<\/div><\/div>/g, function(m, v){ var b = pi[ci++], a = num(v), z = '';
        if(a != null && b) { if(a > b){ z = '<span style="color:#1E8E5A;font-size:24px;margin-right:6px">▲</span>'; any = 1; } else if(a < b){ z = '<span style="color:#C2483A;font-size:24px;margin-right:6px">▼</span>'; any = 1; } }
        return '<div style="width:80px;text-align:right;font-size:30px;font-weight:700;color:#2B2450;white-space:nowrap">' + z + v + '</div></div>'; });
      if(any) h = h.replace('Each skill rated 1–5 · 每项1–5分', 'Each skill rated 1–5 · 每项1–5分 · <span style="color:#1E8E5A">▲</span> <span style="color:#C2483A">▼</span> compared with ' + pen + ' · 与' + pzh + '相比'); }catch(e){}
    return h; }catch(e){ return h; } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
