// 1697: (Misty, 1 Nov 22:17, Kat's laptop 22:15: Dario 20:30 still "Class video uploaded") · Google keeps one video link per student
//   per day and gives it to the student's LAST class that day, so the 18:00 upload showed on the 20:30 card (1696 only removed a link
//   repeated on two classes). Now, for each student with several classes today, the links (not uploaded on this device) are given to
//   the classes in time order: the first video goes to the first class. Dario: 18:00 shows the uploaded video, 20:30 shows Upload video.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  [".forEach(function(c){ var u = D.vids[c.id].url; if(seen1694[u]) delete D.vids[c.id]; else seen1694[u] = 1; });",
   ".forEach(function(c){ var u = D.vids[c.id].url; if(seen1694[u]) delete D.vids[c.id]; else seen1694[u] = 1; });\n" +
   "      /* 1697: per student today, the videos go to the classes in time order (Google gives the day's link to the last class) */\n" +
   "      var by1697 = {}; D.schedule.forEach(function(c){ if(c && c.id && c.code && !c.cancelled && c.day === D.today && !mine1696[c.id]) (by1697[String(c.code).toUpperCase()] = by1697[String(c.code).toUpperCase()] || []).push(c); });\n" +
   "      Object.keys(by1697).forEach(function(k){ var C = by1697[k]; if(C.length < 2) return; C.sort(function(a, b){ return String(a.start).localeCompare(String(b.start)); });\n" +
   "        var V = C.filter(function(c){ return D.vids[c.id] && D.vids[c.id].url; }).map(function(c){ return D.vids[c.id]; }); if(!V.length) return;\n" +
   "        C.forEach(function(c){ delete D.vids[c.id]; }); V.forEach(function(v, i){ D.vids[C[i].id] = v; }); });"]
]);
