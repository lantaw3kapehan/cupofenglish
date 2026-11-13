// 2186 (13 Nov · Misty): management's My pay shows "Total earned with CupOfEnglish" (every paid month, by year), like the teachers' My pay.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["h += (window.att2180 ? att2180(p) : '') + `<h2>History</h2>`",
  "h += (window.at2186 ? at2186(p) : '') + (window.att2180 ? att2180(p) : '') + `<h2>History</h2>`"],
 ["window.att2180 = function(p){ try{",
  "window.at2186 = function(p){ try{ const a = p && p.allTime; if(!a || !+a.months) return '';\n" +
  "    const ml = k => new Date(+k.slice(0, 4), +k.slice(5) - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }), Y = Object.keys(a.byYear || {}).sort(), mx = Math.max(1, ...Y.map(y => +a.byYear[y] || 0));\n" +
  "    const sh = x => x >= 1000 ? '₱' + (x / 1000).toFixed(x >= 100000 ? 0 : 1) + 'k' : '₱' + Math.round(x);\n" +
  "    if(!document.getElementById('css2186')) document.head.insertAdjacentHTML('beforeend', '<style id=\"css2186\">#v-mypay .at2186{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:12px;padding:16px 18px;background:linear-gradient(135deg,#F1FAF5,#fff 65%)!important}#v-mypay .at2186 .tx{flex:1;min-width:200px}#v-mypay .at2186 .tx span{display:block;font-size:12.5px;color:#477467;font-weight:700;letter-spacing:.02em}#v-mypay .at2186 .tx b{display:block;font-size:30px;color:#1E6B4A;font-variant-numeric:tabular-nums;margin:2px 0}#v-mypay .at2186 .tx em{display:block;font-style:normal;font-size:12.5px;color:#6B6884}#v-mypay .at2186 .bs{display:flex;align-items:flex-end;gap:12px;height:78px;padding-top:16px}#v-mypay .at2186 .bs>div{position:relative;width:46px;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}#v-mypay .at2186 .bs i{display:block;width:30px;border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,#5FB98E,#2E8B63)}#v-mypay .at2186 .bs s{text-decoration:none;font-size:11px;font-weight:700;color:#2E6B52;margin-bottom:3px}#v-mypay .at2186 .bs span{font-size:11px;color:#8A87A0;margin-top:4px}</style>');\n" +
  "    return '<div class=\"card at2186\"><div class=\"tx\"><span>Total earned with CupOfEnglish</span><b>' + esc(peso(+a.net || 0)) + '</b><em>Net pay, all time. ' + (+a.months) + ' paid month' + (+a.months === 1 ? '' : 's') + ', ' + esc(ml(a.first)) + ' to ' + esc(ml(a.last)) + '.</em></div>'\n" +
  "      + (Y.length ? '<div class=\"bs\">' + Y.map(y => '<div title=\"' + esc(y) + ': ' + esc(peso(+a.byYear[y] || 0)) + '\"><s>' + esc(sh(+a.byYear[y] || 0)) + '</s><i style=\"height:' + Math.max(6, Math.round((+a.byYear[y] || 0) / mx * 44)) + 'px\"></i><span>' + esc(y) + '</span></div>').join('') + '</div>' : '') + '</div>';\n" +
  "  }catch(e){ return ''; } };\nwindow.att2180 = function(p){ try{"]
]);
