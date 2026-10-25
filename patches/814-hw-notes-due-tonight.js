// 814: (Misty) "Yes go ahead" — homework and class notes are due by 23:59 like videos.
// · Monitor (today): a class without homework / note yet is grey "due tonight", not red, and is not in Needs attention.
//   The board shows those counts in grey. Yesterday (and any past day): still missing = red, in Needs attention.
// · Overview "Teachers today": homework / notes no longer counted during the day.
require('../tools/lib.js')(process.argv[2], [
  ["if(need(c) && !c.hw) o.hw = 1; if(need(c) && !c.note) o.note = 1;", "if(!isToday()){ if(need(c) && !c.hw) o.hw = 1; if(need(c) && !c.note) o.note = 1; }"],
  ["function cell(n, d, cls){ return d ? '<span class=\"' + (n < d ? 'bad' : 'ok') + ' ' + (cls || '') + '\">'",
   "function cell(n, d, cls, soft){ return d ? '<span class=\"' + (n < d ? (soft ? 'mu' : 'bad') : 'ok') + ' ' + (cls || '') + '\"' + (soft && n < d ? ' title=\"due by 23:59\"' : '') + '>'"],
  ["cell(hwN.filter(c => c.hw).length, hwN.length, 'm-hw') + cell(hwN.filter(c => c.note).length, hwN.length, 'm-nt')",
   "cell(hwN.filter(c => c.hw).length, hwN.length, 'm-hw', isToday()) + cell(hwN.filter(c => c.note).length, hwN.length, 'm-nt', isToday())"],
  ["if(nd && !c.hw) a.hw++; if(nd && !c.note) a.note++;", ""]
]);
