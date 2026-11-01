// 1696: (Misty, 1 Nov 22:08, Kat's Today: Dario 20:30 shows "Class video uploaded") · 1694 only undid links the app had found in
//   the folder, but this one comes with Today itself: Google gives the video link per student per day, so both of Dario's classes
//   got the 18:00 file. Now on Today one file counts for one class only: when two of today's classes carry the same link, only the
//   earliest keeps it, unless the later class was itself uploaded on this phone/laptop. The later class shows Upload video again.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      var L = JSON.parse(localStorage.getItem('coe.vid.mine') || 'null'); if(!Array.isArray(L) || !L.length) return 0; D.vids = D.vids || {};",
   "      var L = JSON.parse(localStorage.getItem('coe.vid.mine') || 'null'); if(!Array.isArray(L)) L = []; D.vids = D.vids || {};   /* 1696: the one-file-one-class check runs even with no folder list */"],
  ["      var seen1694 = {}; D.schedule.filter(function(c){ return c && c.id && c.day === D.today && D.vids[c.id] && D.vids[c.id].found; })",
   "      var mine1696 = {}; try{ var o1696 = JSON.parse(localStorage.getItem('coe.vup') || '{}') || {}; for(var k1696 in o1696) if(o1696[k1696] && o1696[k1696].done) mine1696[k1696] = 1; }catch(e){}\n" +
   "      var seen1694 = {}; D.schedule.filter(function(c){ return c && c.id && c.day === D.today && D.vids[c.id] && D.vids[c.id].url && !mine1696[c.id]; })"]
]);
