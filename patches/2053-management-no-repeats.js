// 2053 (10 Nov 11:27, Misty: "go screen per screen on Management, President and Operations ... remove repetitive buttons or information,
//   user-friendly, one click to what we need"). Display only; no data, saves or permissions change.
//   · Menu: Contracts and Notices of breach were in the menu and also as tabs inside Teachers → tabs only.
//   · Overview: the "<month> pay · 11 of 17 paid" bar repeated "Teachers to pay" in Needs you → removed; the grey helper line
//     under Needs you ("Checking data fixes…" / "Same items as To do") → removed; Last week's "Renew soon" tile repeated the renewals
//     on To do and the Packages card (with a different number) → removed.
//   · To do: the Class videos card sat above the To do title → now under it; the extra "✓ All clear" line repeated the tiles →
//     removed; "Package deadlines · no action needed" is not a to-do → it stays in Students › Package check; "Updated" shows the time only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
[
"${(() => { const o = S.out.filter(r => !wsHandled(r[WS.C.code])).length, l = S.low.filter(r => !wsHandled(r[WS.C.code])).length; return tile(o + l, 'Renew soon', o + ' ran out · ' + l + ' with 1–2 left', o ? '#C0392B' : '#D9962B'); })()}",
""
],
[
"without a video.</div></div>';\n    if(el) el.outerHTML = html; else v.insertAdjacentHTML('afterbegin', html); }",
"without a video.</div></div>';\n    if(el) el.outerHTML = html; else { const ld2053 = v.querySelector(':scope > .lead'); if(ld2053) ld2053.insertAdjacentHTML('afterend', html); else v.insertAdjacentHTML('afterbegin', html); } }   /* 2053: under the To do title */"
],
[
"${upd ? 'Updated ' + esc(String(upd).replace(/(\\d{1,2}:\\d{2})H\\b/, '$1')) : ''}",
"${upd ? 'Updated ' + esc(((String(upd).match(/(\\d{1,2}:\\d{2})/) || [])[1]) || String(upd)) : ''}"
],
[
"<script id=\"mo2025\">",
"<style id=\"st2053\">/* 2053 (10 Nov, final QA): no repeated buttons or information (see patches/2053) */#navIn .sb-rec{display:none!important}#v-home .x-pay{display:none!important}#nd37 .nd-chk,#nd37 .nd-sc{display:none!important}#v-mtoday .td2-ok{display:none!important}#v-mtoday #td-ref{display:none!important}</style>\n<script id=\"mo2025\">"
]
]);
