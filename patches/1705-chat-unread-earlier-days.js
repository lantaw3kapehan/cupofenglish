// 1705: (Misty, 2 Nov 10:43, Team Chat › Time-in) "I already opened it yet it's still showing 1" · the badge counts every message you
//   haven't seen, but opening a group only marks today's messages as seen. The 1 was Rose's time-in from yesterday (1 Nov), which the
//   "Today" view never shows. Now, when a group still has unread messages after today's are marked, the app also marks the unseen
//   messages of the last 7 days that have messages in that group, and the badge goes to 0.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    if(ids.length) post('seen', { ids: ids }).then(function(){ var g = (S.init.groups || []).find(function(x){ return x.id === S.gid; }); if(g){ g.unread = 0; g.tagged = 0; } paintSide(); paintHdr(); }).catch(function(){}); }",
   "    if(ids.length) post('seen', { ids: ids }).then(function(){ var g = (S.init.groups || []).find(function(x){ return x.id === S.gid; }); if(g){ g.unread = 0; g.tagged = 0; } paintSide(); paintHdr(); }).catch(function(){});\n" +
   "    try{ var g0 = (S.init.groups || []).find(function(x){ return x.id === S.gid; }); if(g0 && (g0.unread || 0) > ids.length && (S.day || S.init.today) === S.init.today) earlier1705(S.gid); }catch(e){} }\n" +
   "  /* 1705 · unread messages from earlier days (not on the Today view) are marked seen too when the group is opened */\n" +
   "  var E1705 = {};\n" +
   "  async function earlier1705(gid){ if(E1705[gid] && Date.now() - E1705[gid] < 6e4) return; E1705[gid] = Date.now();\n" +
   "    try{ var d = await post('days', { gid: gid }); var L = ((d && d.days) || []).map(function(x){ return x.day; }).filter(function(x){ return x >= new Date(Date.parse(S.init.today + 'T12:00:00+08:00') - 7 * 864e5).toISOString().slice(0, 10); }).slice(0, 7), ids = [];\n" +
   "      for(var i = 0; i < L.length; i++){ var r = await post('list', { gid: gid, day: L[i] }); ((r && r.msgs) || []).forEach(function(m){ if(m.mine && !m.mine.seen) ids.push(m.id); }); }\n" +
   "      if(ids.length) await post('seen', { ids: ids });\n" +
   "      var g = (S.init.groups || []).find(function(x){ return x.id === gid; }); if(g && S.gid === gid){ g.unread = 0; g.tagged = 0; } paintSide(); paintHdr(); }catch(e){} }"]
]);
