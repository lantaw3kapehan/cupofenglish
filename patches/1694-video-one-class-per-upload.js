// 1694: (Misty, 1 Nov 21:57) "Kat has 2 classes with Dario but now she can't upload the video for 20:30 because she has 18:00"
//   · After an upload, vmFound marked every class of that student on that day as "video found" with the same file, and the class
//     card (1480) then showed the 20:30 class as uploaded and Upload video refused it ("This class already has its video").
//   · Now an upload marks only its own class (same start time); and one file never counts for two classes of the same day: when
//     two classes would share a link, only the earliest keeps it, so the later class shows Upload video again (repairs Kat's phone).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["window.vmFound = (code, day, url, name) => { let hit = 0; (V || []).forEach(x => { if(String(x.code).toUpperCase() === String(code).toUpperCase() && String(x.day).slice(0, 10) === day && !x.found){",
   "window.vmFound = (code, day, url, name, start) => { let hit = 0; const t1694 = start ? Date.parse(start) : NaN; (V || []).forEach(x => { if(!hit && String(x.code).toUpperCase() === String(code).toUpperCase() && String(x.day).slice(0, 10) === day && !x.found && (isNaN(t1694) || Date.parse(x.start) === t1694)){"],
  ["vmFound(c.code, c.day, url, (d && d.name) || s.name || '');",
   "vmFound(c.code, c.day, url, (d && d.name) || s.name || '', c.start);"],
  ["        if(x){ D.vids[c.id] = { url: x.url, at: hm(x.uploaded || x.foundAt), found: 1 }; n++; } });",
   "        if(x){ var dup1694 = D.schedule.some(function(o){ return o && o !== c && o.id && D.vids[o.id] && D.vids[o.id].url === x.url; }) || L.some(function(v){ return v && v !== x && v.found && v.url === x.url && String(v.code || '').toUpperCase() === String(c.code).toUpperCase() && Date.parse(v.start) < t; });\n" +
   "          if(!dup1694){ D.vids[c.id] = { url: x.url, at: hm(x.uploaded || x.foundAt), found: 1 }; n++; } } });   /* 1694: one file = one class */\n" +
   "      /* 1694: a link already given to two classes of the same student today (old vmFound) stays only on the earliest */\n" +
   "      var seen1694 = {}; D.schedule.filter(function(c){ return c && c.id && c.day === D.today && D.vids[c.id] && D.vids[c.id].found; }).sort(function(a, b){ return String(a.start).localeCompare(String(b.start)); })\n" +
   "        .forEach(function(c){ var u = D.vids[c.id].url; if(seen1694[u]) delete D.vids[c.id]; else seen1694[u] = 1; });"]
]);
