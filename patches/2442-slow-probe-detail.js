// 2442 · slow-frame probe (2417) also records the script file, the total frozen time of the frame and the time spent on layout,
//   so the cause of Pam's / Dezza's 1.2–1.5 s pauses can be found from the reports.
const file = process.argv[2];
require('../tools/lib.js')(file, [[
  "fn: ('slow:' + (s.sourceFunctionName || s.invoker || '?') + '@' + s.sourceCharPosition + ' ' + String(s.invoker || '')).slice(0, 80)",
  "fn: ('slow:' + (s.sourceFunctionName || s.invoker || '?') + '@' + s.sourceCharPosition + ' ' + String(s.sourceURL || '').split('/').pop().split('?')[0].slice(0, 24) + ' f' + Math.round(e.duration) + ' l' + Math.round(s.forcedStyleAndLayoutDuration || 0) + ' b' + Math.round(e.blockingDuration || 0)).slice(0, 120)"
]]);
