// 2595 (audit QA-36, 21 Nov): "2 late tag", "1 teachers", "needs a nudge", "all she did", "her list today", and the Trials all-time tile
// "7 years" (it counts calendar years with trials since 2020, not years of operation). Wording only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["'<b style=\"color:#AE5041\">' + tag + ' late tag</b>'", "'<b style=\"color:#AE5041\">' + tag + ' late tag' + (tag === 1 ? '' : 's') + '</b>'"],
  ["(r.top === 'r' ? 'overdue' : r.top === 'a' ? 'needs a nudge' : 'not due yet')", "(r.top === 'r' ? 'overdue' : r.top === 'a' ? 'reminder due' : 'not due yet')"],
  ["onclick=\"return pd2469(\\'all\\')\">all she did</a>", "onclick=\"return pd2469(\\'all\\')\">full activity log</a>"],
  ["(d.done || 0) + (+PD.todo || 0), 'her list today')", "(d.done || 0) + (+PD.todo || 0), 'today\\'s list')"],
  ["n, e, A ? ys.length + ' years' : '',", "n, e, A ? ys.length + ' calendar year' + (ys.length === 1 ? '' : 's') + ' with trials' : '',"],
  ["latest evaluation of ' + E.length + ' teachers'", "latest evaluation of ' + E.length + ' teacher' + (E.length === 1 ? '' : 's')"],
  ["' · ' + m.n + ' teachers' + (m.k === cur", "' · ' + m.n + ' teacher' + (m.n === 1 ? '' : 's') + (m.k === cur"],
]);
