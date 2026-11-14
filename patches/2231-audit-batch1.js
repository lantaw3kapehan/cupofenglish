// 2231 (14 Nov · Misty: "screen to screen, buttons per buttons … redundancy, repetitive information"): first batch from the audit.
// · To do › Students at risk: the "Next: Message the parent in WeChat this week." line under every student is gone (the group
//   heading already says it).
// · Dates without a year now show the year when it is not this year ("Validity ended Sep 22, 2025"), "1 lesson a month" (not "lessons").
// · Overview footer: Phone alerts › and App check › on one line; an App check message (only when something fails) below them.
// · My pay: a quiet refresh keeps the saved figures for 30 minutes at most (was 6 hours), so a correction shows the same day.
// · Student page › Changes step 4: says when more classes are booked than lessons are left ("1.5 more than the lessons left"),
//   instead of "all booked".
// · Student page › Package: "Bought 33 · done 36.5 · 2.5 left", and the bar reads "36.5 done · 2.5 left of 39" (bought + carried + free).
// · Student page › Schedule: the "cancelled" number counts the last 45 days only, like the list under it.
// · Finance › Government: no "Paid on" date on a month that is not paid.
// · Phone: Finance tabs (Overview, Payroll, Transactions, Government) fit on one line.
const lib = require("../tools/lib.js"), file = process.argv[2];
const CSS = String.raw`
<style id="css2231">
.c-foot{align-items:center}.c-foot>span{order:3}
@media (max-width:430px){.mo-tabs{gap:2px!important}.mo-tabs button,.mo-tabs a{padding:8px 8px!important;font-size:13.5px!important}}
</style>
`;
lib(file, [
 ["chips = r0.split(' · ').map(cap); }", "chips = r0.split(' · ').map(cap); step = ''; }   /* 2231: the group heading says it */"],
 ["const tdDate = s => { const t = new Date(String(s||'').slice(0,10) + 'T00:00:00'); return isNaN(t) ? esc(s||'') : t.toLocaleDateString('en-US', { month:'short', day:'numeric' }); };",
  "const tdDate = s => { const t = new Date(String(s||'').slice(0,10) + 'T00:00:00'); return isNaN(t) ? esc(s||'') : t.toLocaleDateString('en-US', Object.assign({ month:'short', day:'numeric' }, t.getFullYear() !== new Date().getFullYear() ? { year:'numeric' } : {})); };   /* 2231: year when not this year */"],
 ["x.pm ? ' <span class=\"mute\">· ' + esc(x.pm) + ' lessons a month</span>' : ''", "x.pm ? ' <span class=\"mute\">· ' + esc(x.pm) + (+x.pm === 1 ? ' lesson' : ' lessons') + ' a month</span>' : ''"],
 ["(quiet ? 360 : 30) * 6e4", "30 * 6e4"],
 ["s: I.left != null ? I.left + ' lesson' + (I.left === 1 ? '' : 's') + ' left · ' + I.booked + ' booked'", "s: I.left != null ? I.left + ' lesson' + (I.left === 1 ? '' : 's') + ' left · ' + I.booked + ' booked' + (I.booked > I.left + 0.01 ? ' (' + (Math.round((I.booked - I.left) * 10) / 10) + ' more than the lessons left)' : '')"],
 ["'<div class=\"small mute\" style=\"margin-top:4px\">Lessons ' + esc(r[C.enrolled]) + ' · done '", "'<div class=\"small mute\" style=\"margin-top:4px\">Bought ' + esc(r[C.enrolled]) + ' · done '"],
 ["const x = t.textContent.match(/Lessons ([\\d.]+) · done", "const x = t.textContent.match(/(?:Lessons|Bought) ([\\d.]+) · done"],
 ["const tot = num(x[1]), done = num(x[2]), left = num(x[3]); if(!tot) return;", "const done = num(x[2]), left = num(x[3]), tot = Math.round((done + left) * 10) / 10; if(!tot) return;   /* 2231: bought + carried + free */"],
 ["<b class=\"num ${cx.length?'minus':''}\">${cx.length}</b><span>cancelled</span>", "<b class=\"num ${cx.filter(e=>new Date(e.end)<now).length?'minus':''}\">${cx.filter(e=>new Date(e.end)<now).length}</b><span>cancelled · 45 days</span>"],
 ["(g.paid_on ? esc(dShort(g.paid_on)) : '<span class=\"small mute\">—</span>')", "(g.paid_on && isPaid(g) ? esc(dShort(g.paid_on)) : '<span class=\"small mute\">—</span>')"],
 ["\n</body>\n</html>", "\n" + CSS.trim() + "\n</body>\n</html>"]
]);
