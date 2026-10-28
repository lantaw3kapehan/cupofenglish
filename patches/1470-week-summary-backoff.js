// 1470 · Operations QA 28 Oct (Misty: "screens must be as fast as possible"; failure recovery).
//   Overview asks for last week's summary (wsLoad → mgmtWeekSum). When that answer fails, the fallback asks Google for 7 days of
//   schedule + 7 days of reminders (14 calls), and if those fail too nothing is remembered — the next Overview repaint starts all
//   14 calls again. In the Operations preview with no week data this fired about 12 times per day in under a minute (84 calls),
//   all queueing on Google behind real work. Now, after a failed try, the summary waits 5 minutes before trying again
//   (an explicit refresh — wsLoad(true), e.g. "Last week" — still tries at once). A successful load is unchanged.
//   Display and timing only: no data, permission or calculation changes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1470 · last week's summary: wait 5 minutes after a failed load instead of retrying on every Overview repaint */\n" +
   "(function(){\n" +
   "  if(window.__1470) return; window.__1470 = 1;\n" +
   "  var base = window.wsLoad; if(typeof base !== 'function') return; var failAt = 0;\n" +
   "  window.wsLoad = async function(force){\n" +
   "    var busy = 0; try{ busy = WS_BUSY; }catch(e){}\n" +
   "    if(!force && !busy && failAt && Date.now() - failAt < 300000) return;\n" +
   "    var r = await base.apply(this, arguments);\n" +
   "    if(!busy) try{ var L = wsWeek(); failAt = (WS && WS.week === L[0]) ? 0 : Date.now(); }catch(e){}\n" +
   "    return r; };\n" +
   "})();\n" +
   "</script>\n</body>\n</html>"]
]);
