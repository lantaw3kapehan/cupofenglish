// 1784: (Misty 5 Nov 14:27 "yes make it simple and convenient") One control for Philippine students: Market › Philippines already gives
//   the English portal (first-name sign-in, roadmap). For those students the Portal language buttons are replaced by a plain line
//   "Portal: English (Philippines) · from Market", in Student access and on the walk-in assessment's Linked student. Other students keep the
//   two buttons (for a non-PH student who wants English only). Nothing else changes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  function langSeg(x){ var en = x.locale === 'en-ph', b = P.busy['L' + x.code];",
   "  function langSeg(x){ if(x.ph) return '<div class=\"row\" style=\"gap:6px;align-items:center;margin-top:8px\"><span class=\"small mute\">Portal</span><b class=\"small\" style=\"color:#00575F\">English (Philippines)</b><span class=\"small mute\">· from Market › Philippines</span></div>';   /* 1784 */\n    var en = x.locale === 'en-ph', b = P.busy['L' + x.code];"],
  [String.raw`+ (st && st.access ? '<div class="as-row" style="align-items:center"><span class="as-m" style="margin:0">Her portal language</span>`,
   String.raw`+ (st && st.access && st.ph ? '<div class="as-row" style="align-items:center"><span class="as-m" style="margin:0">Her portal: <b style="color:#00575F">English (Philippines)</b> · from Market › Philippines</span></div>' : '') + (st && st.access && !st.ph ? '<div class="as-row" style="align-items:center"><span class="as-m" style="margin:0">Her portal language</span>`],
  [String.raw`<b>Portal language</b> (each student): <b>中文 + English</b> is the default; <b>English (Philippines)</b> shows the portal in English only, Philippine time, no WeChat wording. One tap saves; tap the other to switch back. Sign-in stays the ST code + English name.`,
   String.raw`<b>Philippine students:</b> just set <b>Market › Philippines</b> — their portal is English automatically. <b>Portal language</b> is only for other students who want English only (one tap saves; tap the other to switch back).`],
]);
