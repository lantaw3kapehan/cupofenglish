// 1463 · President QA 28 Oct (Misty's priority 2: "keep statuses consistent across screens").
//   Overview showed three different numbers for the same work: the Overview badge said 20, the Home banner said
//   "1 thing needs you · 2 waiting on teachers" (it counted groups, not items), and To do said "Do next · 10 things".
//   · Home banner now counts items the same way as the badge: "20 items need you now" (the badge's own sum of urgent items),
//     plus "· N more to look at" for non-urgent items, and names each group with its count
//     (e.g. "Renewals to act on now 5 · Trials not followed up 3 · …"). Teachers' side reads
//     "Waiting on teachers: Notices without “Got it” 24 · Monthly feedback not in yet 122".
//   · To do › Do next says what its number is: "10 to act on now · the full lists are below".
//   · Trial follow-up button "✓ Message sent" reads "Mark as sent", like every other mark-as-sent button (same action, same behaviour).
//   Calculations, sources and the badge are unchanged. Display only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["'<a class=\"x-todo ' + (hotN ? 'warm' : '') + '\" onclick=\"go(\\'mtoday\\')\"><i></i><b>' + (Q.length ? Q.length + (Q.length === 1 ? ' thing needs' : ' things need') + ' you' : 'Nothing needs you right now') + (W.length ? ' · ' + W.length + ' waiting on teachers' : '') + '</b><span>' + esc(names.slice(0, 4).join(' · ')) + '</span><em>To do ›</em></a></section>';",
   "'<a class=\"x-todo ' + (hotN ? 'warm' : '') + '\" onclick=\"go(\\'mtoday\\')\"><i></i><b>' + (function(){ /* 1463: items, the same sum as the Overview badge */\n" +
   "          const sum = L => L.reduce((a, x) => a + (+x.n || 0), 0), nh = sum(Q.filter(x => x.tone === 'hot')), no = sum(Q.filter(x => x.tone !== 'hot'));\n" +
   "          const t = (nh ? nh + (nh === 1 ? ' item needs' : ' items need') + ' you now' : '') + (no ? (nh ? ' · ' : '') + no + ' more to look at' : '');\n" +
   "          return t || 'Nothing needs you right now'; })() + '</b><span>' + esc(Q.map(x => x.t === 'Waiting in To do' && x.s ? x.s : x.t + ' ' + x.n).concat(W.length ? ['Waiting on teachers: ' + W.map(x => x.t + ' ' + x.n).join(' · ')] : []).join(' · ')) + '</span><em>To do ›</em></a></section>';"],
  ["const h2 = box.querySelector('h2'); if(h2) h2.innerHTML = `Do next <span class=\"c\">in this order · ${src.length} thing${src.length === 1 ? '' : 's'} · act right here, or tap a line for details</span>`;",
   "const h2 = box.querySelector('h2'); if(h2) h2.innerHTML = `Do next <span class=\"c\">in this order · ${src.length} to act on now · act right here, or tap a line · the full lists are below</span>`;   /* 1463 */"],
  [">✓ Message sent</button>`; }",
   ">Mark as sent</button>`; }"],
]);
