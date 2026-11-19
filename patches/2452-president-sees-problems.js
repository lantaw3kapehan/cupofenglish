// 2452 (Misty 17:05 "the problems she found, it would also auto appear on President, right?") · until now the President's
//   "From Operations" card only counted them ("1 found"); a problem showed in full only if Celine also pressed "Report a problem".
//   Now each problem she marks on her desk today (Problem found / Not cleared yet) is listed there by itself: time, label, what, her note.
const file = process.argv[2];
const ADD = "(function(){ var P = ((d.log) || []).filter(function(l){ return l.kind === 'problem' || l.kind === 'still'; });   /* 2452 */\n" +
"      if(P.length) h += '<div class=\"p2452\"><b>Problems ' + E(who) + ' found today · ' + P.length + '</b>' + P.map(function(l){ return '<div class=\"pr\"><span class=\"t\">' + E(l.at) + '</span><span><span class=\"lb\">' + (l.kind === 'still' ? 'Not cleared yet' : 'Problem found') + '</span>' + E(l.title || '') + (l.note ? '<div class=\"small mute\" style=\"margin-top:2px\">' + E(l.note) + '</div>' : '') + '</span></div>'; }).join('') + '</div>'; })();\n    ";
require('../tools/lib.js')(file, [
  ["R.forEach(function(x){ var last = x.answers[x.answers.length - 1];", ADD + "R.forEach(function(x){ var last = x.answers[x.answers.length - 1];"],
  ['<script id="b2278">', `<style id="u2452">.p2452{margin-top:10px;padding-top:10px;border-top:1px solid #F1F0F6}.p2452>b{font-size:14px;color:#2B2253}.p2452 .pr{display:grid;grid-template-columns:48px 1fr;gap:10px;padding:8px 0;border-top:1px solid #F6F5F9;font-size:14px}.p2452 .pr:first-of-type{border-top:0}.p2452 .t{color:#6B6880;font-variant-numeric:tabular-nums}.p2452 .lb{display:inline-block;border-radius:6px;padding:1px 8px;font-size:12px;font-weight:700;margin-right:6px;background:#FCEDE8;color:#B5432C}</style>
<script id="b2278">`]
]);
