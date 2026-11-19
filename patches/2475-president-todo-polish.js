// 2475 (Misty 19:59 "yes go ahead and make it live" · approved mock of the President's To do and From Operations)
//   Meeting ID missing: when every teacher is reminded, the list closes to one line with "Show list" (opens again when one is not reminded)
//   Class videos: teachers with nothing to decide on one "All in yesterday" line; rows only for missing / late / a fee to waive
//   From Operations: idle in hours and minutes · Her week numbers under their labels.
const file = process.argv[2];
const CSS = `<style id="u2475">#pd2360 .wk2474{width:auto!important}#pd2360 .wk2474 td:not(:first-child),#pd2360 .wk2474 th{text-align:right!important;padding:5px 0 5px 22px!important;min-width:44px}
#pd2360 .wk2474 td:first-child{padding-right:6px!important}
.mt2475>summary{cursor:pointer;display:inline-block;margin-top:8px;border:1px solid #CFCBDD;border-radius:999px;padding:3px 12px;font-size:13px;color:#2B2253;list-style:none}.mt2475>summary::-webkit-details-marker{display:none}
.vd2475{padding:8px 0;border-top:1px solid #EFEDF4;font-size:14px;line-height:1.6}.vd2475 a{cursor:pointer;color:#2B2253;font-weight:600}.vd2475 small{color:#8A86A0}</style>
`;
require('../tools/lib.js')(file, [
  ["(window.mt2225Top ? window.mt2225Top(L) : '') +\n          L.slice(0, 6).map(row).join('') + (n > 6 ? '<details><summary>Show ' + (n - 6) + ' more</summary>' + L.slice(6).map(row).join('') + '</details>' : '') + '</div>'; }",
   "(window.mt2225Top ? window.mt2225Top(L) : '') +\n          (window.mt2225Top && /All teachers reminded/.test(window.mt2225Top(L)) ? '<details class=\"mt2475\"><summary>Show list · ' + n + '</summary>' + L.map(row).join('') + '</details>' :\n          L.slice(0, 6).map(row).join('') + (n > 6 ? '<details><summary>Show ' + (n - 6) + ' more</summary>' + L.slice(6).map(row).join('') + '</details>' : '')) + '</div>'; }"],
  ["+ L.map(row).join('') + '<div class=\"small mute\" style=\"margin-top:6px\">Missing = class held",
   "+ (function(){ const lc = x => { try{ return lateCases(x.teacher, ym) || ''; }catch(e){ return ''; } }, keep = x => x.missing || x.late || lc(x), A = L.filter(x => !keep(x)), K = L.filter(keep);   /* 2475 */\n        return (A.length ? '<div class=\"vd2475\"><span style=\"color:#0E6B5C;font-weight:600\">All in yesterday</span> · ' + A.map(x => '<a onclick=\"vid1939Open(\\'' + esc(String(x.teacher)).replace(/'/g, '') + '\\',\\'' + ym + '\\')\">' + esc(x.teacher) + '</a>' + ((+x.monthMissing || +x.monthLate) ? ' <small>(' + [x.monthMissing ? x.monthMissing + ' missing' : '', x.monthLate ? x.monthLate + ' late' : ''].filter(Boolean).join(', ') + ' in ' + esc(mon) + ')</small>' : '')).join(', ') + '</div>' : '') + K.map(row).join(''); })() + '<div class=\"small mute\" style=\"margin-top:6px\">Missing = class held"],
  ["' · idle ' + (d.idle || 0) + ' min · <a class=\"link\" href=\"#\" onclick=\"return pd2469(\\'all\\')\">all she did</a>'",
   "' · idle ' + ((d.idle || 0) >= 60 ? Math.floor(d.idle / 60) + ' h ' + (d.idle % 60) + ' min' : (d.idle || 0) + ' min') + ' · <a class=\"link\" href=\"#\" onclick=\"return pd2469(\\'all\\')\">all she did</a>'"],
  ['<script id="b2278">', CSS + '<script id="b2278">']
]);
