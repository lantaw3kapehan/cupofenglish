// 1363 · Night report from the database (Misty approved 27 Oct 23:27).
//   Management › Night report (mgmtNight) is answered by the edge function coe-night, a port of Google's night_ / recDay_
//   reading the database: classes, time-ins, homework, class notes, Google's own video check (coe_vid_log) and app uploads.
//   Switch: docs 'sys:nightdb' {"on": true|false}. Off, or any error → Google exactly as before.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</script>\n<script>\n/* 1361 · Growth from the database (coe-growth); switched by docs sys:growthdb; Google when off or on any error */",
   "</script>\n<script>\n/* 1363 · Night report from the database (coe-night); switched by docs sys:nightdb; Google when off or on any error */\n(function(){\n  const base = window.api; if(!base || base.__1363) return;\n  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-night';\n  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a));\n    if(fn === 'mgmtNight' && typeof LIVE !== 'undefined' && LIVE && a[0]){\n      return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'night', token: a[0], ds: a[1] || '' }) })\n        .then(x => x.json()).then(r => (r && r.ok && r.data) ? r.data : go(), go); }\n    return base.apply(this, arguments); };\n  w.__1363 = 1; window.api = w;\n})();\n</script>\n<script>\n/* 1361 · Growth from the database (coe-growth); switched by docs sys:growthdb; Google when off or on any error */"],
]);
