// 2462 (Misty 18:25 · Dezza: "I cannot send the screenshot of my time-in, it goes back to home when I touch the VooV meeting") ·
//   her app reloaded itself at 18:22 to take a new version (the page was hidden behind VooV), which closed the time-in picture step.
//   Teachers: a new version is never applied by itself from 40 minutes before the first class to 30 minutes after the last class of the
//   day · the "update" notice in the header stays, so she can refresh when she chooses · management is unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  function calm(){ try{ return !(typeof busy === 'function' && busy()) && !(typeof updQuiet === 'function' && updQuiet()); }catch(e){ return false; } }",
   "  function inClass2462(){ try{ if(typeof D === 'undefined' || !D || D.mgr) return false; var now = Date.now(), L = (D.schedule || []).filter(function(c){ return c.day === D.today && !c.cancelled; }); if(!L.length) return false;\n" +
   "    var a = Math.min.apply(null, L.map(function(c){ return Date.parse(c.start); })), b = Math.max.apply(null, L.map(function(c){ return Date.parse(c.end || c.start); })); return now >= a - 40 * 6e4 && now <= b + 30 * 6e4; }catch(e){ return false; } }   /* 2462 */\n" +
   "  function calm(){ try{ return !(typeof busy === 'function' && busy()) && !(typeof updQuiet === 'function' && updQuiet()) && !inClass2462(); }catch(e){ return false; } }"]
]);
