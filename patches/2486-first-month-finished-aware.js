// 2486 (Misty 10:00–10:01: Penny "Correct to 0"; Chenyu "8 + 33 − 21.5 ≠ 18.5" — 2483 moved completed but not remaining on a stale copy)
// 2486, Penny "Correct to 0"): the list now checks the package's completed count too.
//   fix   = completed includes the lessons from before the start → Correct to N (remaining goes up by those lessons)
//   shown = completed is already right; only the month history shows the earlier lessons → not listed as a correction (counted in the header)
//   hand  = numbers do not add up → Open and check by hand.   (coe_firstmonth_check returns `kind`.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function html(){ var L = (R || []).filter(function(x){ return !done[x.code + '|' + x.ym]; }); if(!L.length) return '';",
   "function html(){ var A = (R || []).filter(function(x){ return !done[x.code + '|' + x.ym]; }), SH = A.filter(function(x){ return x.kind === 'shown'; }).length, L = A.filter(function(x){ return x.kind !== 'shown'; }); if(!L.length) return '';"],
  ["<span class=\"small mute\">' + C + ' ready to correct · ' + (L.length - C) + ' to check by hand</span></div>'",
   "<span class=\"small mute\">' + C + ' ready to correct · ' + (L.length - C) + ' to check by hand' + (SH ? ' · ' + SH + ' already right (only the month history shows the earlier lessons)' : '') + '</span></div>'"],
  ["+ '<div class=\"small mute\" style=\"margin:4px 0 6px\">The package started after the 1st, but its first month also counts lessons from before the start date. Those belong to the previous package.</div>'",
   "+ '<div class=\"small mute\" style=\"margin:4px 0 6px\">The package started after the 1st, and its completed lessons also count lessons from before the start date. Those belong to the previous package, so the lessons remaining are too low.</div>'"],
  ["(x.clear ? '<span class=\"k c\">Records match</span>' : '<span class=\"k u\">Check by hand</span>')",
   "(x.clear ? '<span class=\"k c\">Remaining ' + x.before + ' too low</span>' : '<span class=\"k u\">Check by hand</span>')"],
  ["</b> · class records: ' + x.before + ' before the start, ' + x['from'] + ' from the start</small></div>'",
   "</b> · class records: ' + x.before + ' before the start, ' + x['from'] + ' from the start' + (x.finished != null ? ' · completed now ' + x.finished : '') + '</small></div>'"],
  ["R.forEach(function(r, i){ var d = Math.round((sum(r) - before[i]) * 10) / 10; if(d && C.finished != null && r[C.finished] !== '' && r[C.finished] != null) r[C.finished] = Math.round((+r[C.finished] + d) * 10) / 10; });",
   "var tot = {}; R.forEach(function(r, i){ var d = Math.round((sum(r) - before[i]) * 10) / 10, cd = String(r[C.code] || '').toUpperCase(); tot[cd] = (tot[cd] || 0) + d; if(d && C.finished != null && r[C.finished] !== '' && r[C.finished] != null) r[C.finished] = Math.round((+r[C.finished] + d) * 10) / 10; });   /* 2486: remaining moves the other way, on the package row (as the server does) */\n    if(C.available != null) R.forEach(function(r){ var cd = String(r[C.code] || '').toUpperCase(), t = tot[cd]; if(t && r[C.available] !== '' && r[C.available] != null && !isNaN(+r[C.available])){ r[C.available] = Math.round((+r[C.available] - t) * 10) / 10; tot[cd] = 0; } });"],
  ["+ dl(x.start) + ' count for this package. You can undo it in the Lesson Summary.')) return;",
   "+ dl(x.start) + ' count for this package: completed goes down by ' + x.before + ' and remaining goes up by ' + x.before + '. You can undo it in the Lesson Summary.')) return;"]
]);
