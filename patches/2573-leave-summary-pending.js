// 2573 (audit QA-13, verified 21 Nov): Leave said "All clear … nothing waiting for your approval" while Dezza's request for 22 Nov was
// still with Operations. The line now names the requests at the Operations stage and only says "All clear" when there are none.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      if(n.length && n.every(x => !x)){ S.outerHTML = '<div class=\"lv2-ok\"><b>✓ All clear</b> · nobody on leave today · none coming up · nothing waiting for your approval</div>';",
   "      const wo2573 = ((window.LV && LV.rows) || []).filter(x => x.status === 'Pending' && !x.ops), st2573 = [...new Set(wo2573.map(x => lvStage(x)))];   /* 2573 */\n      if(n.length && n.every(x => !x)){ S.outerHTML = wo2573.length\n        ? '<div class=\"lv2-ok\" style=\"background:#FFF4E0;color:#8A5A12\"><b>' + wo2573.length + ' request' + (wo2573.length === 1 ? '' : 's') + ' with Operations</b> · ' + esc(st2573.join(' · ')) + ' · none waiting for your approval yet · nobody on leave today · no approved leave coming up</div>'\n        : '<div class=\"lv2-ok\"><b>✓ All clear</b> · nobody on leave today · no approved leave coming up · no requests waiting</div>';"],
]);
