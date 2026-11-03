// 1716: (Misty, 3 Nov 11:35) "the red means their monthly report isn't saved?" — No. "Fb plus check" is the feedback helper's background
//   double-check (database suggestions vs Google's); when they differ the teacher is given Google's copy and nothing is lost.
//   Monitor › Everything done in the app now shows it in grey as "Feedback helper · used Google's copy (database copy behind: mine)"
//   instead of red "not saved". Real failed saves stay red.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<span class=\"kd\">' + E(window.actLabel ? actLabel(x.kind, x.fn) : x.kind) + '</span><span class=\"grow\"><b>' + E(x.who) + '</b>' + (x.student ? ' · ' + E(x.student) : '') + (x.status === 'error' ?",
   "<span class=\"kd\">' + (x.fn === 'tFbPlusCheck' ? 'Feedback helper' : E(window.actLabel ? actLabel(x.kind, x.fn) : x.kind)) + '</span><span class=\"grow\"><b>' + E(x.who) + '</b>' + (x.fn === 'tFbPlusCheck' ? ' · ' + E(String(x.student || x.error || '').replace(/ differs: (.*)$/, '')) + ' <span class=\"mute small\">· used Google\\'s copy (database copy behind' + (/differs: (.+)$/.test(String(x.error || x.student || '')) ? ': ' + E(String(x.error || x.student || '').replace(/^.*differs: /, '')) : '') + ') · nothing lost</span>' : (x.student ? ' · ' + E(x.student) : '') + (x.status === 'error' ?"],
  [": x.status === 'new' ? ' <span class=\"mute small\">· saving…</span>' : '') + '</span></div>').join(''); }",
   ": x.status === 'new' ? ' <span class=\"mute small\">· saving…</span>' : '')) + '</span></div>').join(''); }"]
]);
