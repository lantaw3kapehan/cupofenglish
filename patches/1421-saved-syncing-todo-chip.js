// 1421: (Misty, 28 Oct 10:38) Finance › Transactions: a new expense sat greyed out as "Saving…" — "in every transaction saving
// like that it's slow too". The expense is saved in the database the moment Add is tapped (FAST_M addExpense / addSale since
// 16 Oct); only Google's copy follows (its minute job, typically 20–80 s). The row now shows as saved at once, at full strength,
// with a small "Saved · syncing" tag until Google's copy arrives (a refused save still gets the "Not saved" notice as before).
// Also (Misty, 10:48) To do summary tiles: the "Needs you" chip overlapped "1 now" / "1 not followed up" — an older rule moved it
// up 11 px (transform). It now sits below the line in normal flow.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["(r.q ? ' <span class=\"fx-tag mu\">Saving…</span>' : '')",
   "(r.q ? ' <span class=\"fx-tag mu sync21\" title=\"Saved · Google copy follows within a minute\">Saved · syncing</span>' : '')"],
  ["#v-expenses tr.q td{opacity:.65}", "#v-expenses tr.q td{opacity:1}#v-expenses tr.q td:nth-child(2)::after{content:\"Saved · syncing\";margin-left:8px;font-size:11.5px;font-weight:600;color:#00707A;background:#E6F3F4;border-radius:999px;padding:1px 8px;white-space:nowrap}"],
  ["#v-expenses .e2-r.q{opacity:.6}", "#v-expenses .e2-r.q{opacity:1}#v-expenses .e2-r.q .d b::after{content:\"Saved · syncing\";margin-left:8px;font-size:11.5px;font-weight:600;color:#00707A;background:#E6F3F4;border-radius:999px;padding:1px 8px;white-space:nowrap}"],
  [".fx tr.q td{opacity:.6}", ".fx tr.q td{opacity:1}.fx .sync21{color:#00707A!important;background:#E6F3F4!important}.fx .sync21::before{content:\"\";display:inline-block;width:6px;height:6px;border-radius:50%;background:#00707A;margin-right:5px;vertical-align:1px;animation:sync21 1.4s ease-in-out infinite}@keyframes sync21{50%{opacity:.3}}"],
  ["'#v-mtoday .tdsum a.hot:after{position:static!important;display:inline-block;margin-top:6px;",
   "'#v-mtoday .tdsum a.hot:after{position:static!important;display:inline-block!important;transform:none!important;translate:none!important;top:auto!important;right:auto!important;margin-top:8px!important;"]
]);
