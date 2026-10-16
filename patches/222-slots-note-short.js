// 16 Oct · Open slots note kept short (minimal): the reasons stay in each time's tooltip.
require('../tools/lib.js')(process.argv[2], [
["${all.length} open${nb ? ' · <b style=\"color:#0E9F95\">★ best fit</b> = right next to her classes, no gap (' + Object.keys(bm).map(Number).sort((a, b) => a - b).map(t => avT(t) + ' ' + esc(bm[t])).join(' · ') + ')' : ''} · teaching hours ${esc(String(x.hours).replace(/,/g, ', '))} · tap a time to book it",
 "${all.length} open${nb ? ' · <b style=\"color:#0E9F95\">★ best fit</b>: next to her classes or freed by a cancellation, no gap' : ''} · tap a time to book it"],
]);
