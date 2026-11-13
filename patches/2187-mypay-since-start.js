// 2187 (13 Nov · Misty: "show since when she started with us up to date"): the Total earned card runs from her first month to today,
// adding this month so far (estimate) to the total and to this year's bar, and says how long she has been with CupOfEnglish.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["window.at2186 = function(p){ try{ const a = p && p.allTime; if(!a || !+a.months) return '';\n    const ml = k => new Date(+k.slice(0, 4), +k.slice(5) - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }), Y = Object.keys(a.byYear || {}).sort(), mx = Math.max(1, ...Y.map(y => +a.byYear[y] || 0));",
  "window.at2186 = function(p){ try{ const a = p && p.allTime; if(!a || !+a.months) return '';\n" +
  "    const ml = k => new Date(+k.slice(0, 4), +k.slice(5) - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), mo = k => new Date(+k.slice(0, 4), +k.slice(5) - 1, 1).toLocaleDateString('en-GB', { month: 'long' });\n" +
  "    const cm = String(p.month || ''), cu = (p.pay || []).find(x => x.m === cm && x.status !== 'Paid'), so = cu ? Math.max(0, +cu.net || 0) : 0, by = Object.assign({}, a.byYear || {}); if(so) by[cm.slice(0, 4)] = (+by[cm.slice(0, 4)] || 0) + so;\n" +
  "    const tot = (+a.net || 0) + so, Y = Object.keys(by).sort(), mx = Math.max(1, ...Y.map(y => +by[y] || 0));\n" +
  "    const nm = cm ? (+cm.slice(0, 4) * 12 + +cm.slice(5)) - (+a.first.slice(0, 4) * 12 + +a.first.slice(5)) : 0, yy = Math.floor(nm / 12), mm = nm % 12;\n" +
  "    const dur = nm < 1 ? 'less than a month' : [yy ? yy + ' year' + (yy === 1 ? '' : 's') : '', mm ? mm + ' month' + (mm === 1 ? '' : 's') : ''].filter(Boolean).join(' and ');\n" +
  "    a.byYear = by;"],
 ["'<div class=\"card at2186\"><div class=\"tx\"><span>Total earned with CupOfEnglish</span><b>' + esc(peso(+a.net || 0)) + '</b><em>Net pay, all time. ' + (+a.months) + ' paid month' + (+a.months === 1 ? '' : 's') + ', ' + esc(ml(a.first)) + ' to ' + esc(ml(a.last)) + '.</em></div>'",
  "'<div class=\"card at2186\"><div class=\"tx\"><span>Total earned with CupOfEnglish since ' + esc(ml(a.first)) + '</span><b>' + esc(peso(tot)) + '</b><em>With us for ' + dur + ', from ' + esc(ml(a.first)) + ' to today. ' + esc(peso(+a.net || 0)) + ' paid over ' + (+a.months) + ' month' + (+a.months === 1 ? '' : 's') + (so ? ', plus ' + esc(peso(so)) + ' so far in ' + esc(mo(cm)) + ' (an estimate until it is paid)' : '') + '.</em></div>'"]
]);
