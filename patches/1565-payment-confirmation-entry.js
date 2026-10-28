// 1565 · "Make payment confirmation" entry card (Add sale, Enrolled · paid, Renewed · paid) matches the 1563 flow (29 Oct 2026, from the
// Students agent's review): the line said "…emailed to the parent" (Issue no longer emails) and used a 🧾 emoji as the icon.
// Now: "Review, issue, then email it separately. The PDF is attached here." with a line receipt icon (currentColor, 20 px). Text only.
require('../tools/lib.js')(process.argv[2], [
  ["<i>🧾</i><span>Make payment confirmation 付款确认单<small>Next number, price list and 3% tax filled in. The PDF is attached here and emailed to the parent.</small></span>",
   "<i aria-hidden=\"true\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:block\"><path d=\"M6 2.5h12v19l-3-2-3 2-3-2-3 2z\"/><path d=\"M9 7.5h6M9 11h6M9 14.5h4\"/></svg></i><span>Make payment confirmation 付款确认单<small>Next number, price list and 3% tax filled in. Review, issue, then email it separately. The PDF is attached here.</small></span>"]
]);
