// 925 (D2 · design): Trials and Enquiries details on top of 924 (Finance Overview look).
// · Enquiries funnel tiles: label --fs-label (12px)/700 caps, figure --fs-kpi (22px)/700 system font with tabular numerals (was 28px brand
//   font); the month chart box and the funnel box use the 14px card radius. The "Pictures & messages" cards lose the
//   3px teal top stripe (stage is already shown by the numbered 1·2·3 headings) and get the 1px line border;
//   the Kids/Adults form cards keep their coloured badge and left colour edge; no hover shadow.
// · Trials: status tabs sit in the same pill style; the 45-day summary strip uses system-font figures; booked-trial
//   date blocks use the 10px radius.
// · Phone: the funnel sits above the month chart and its four tiles go 2 × 2 (they were four 40px-wide columns
//   squeezed beside the chart because patch 897's 520px rule split the outer box). No text, counts or handlers change.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 925 · Trials / Enquiries details */
(function(){ if(window.__925) return; window.__925 = 1;
  var css = [
    '#v-enquiry .fn31 .fl,#v-enquiry .fn31 .mo{border-color:var(--ui-line);border-radius:var(--ui-r)}',
    '#v-enquiry .fn31 .st em{font-family:var(--ui-font);font-size:var(--fs-label,12px);font-weight:700;letter-spacing:.04em;color:var(--ui-mute)}',
    '#v-enquiry .fn31 .st b{font-family:var(--ui-font);font-size:var(--fs-kpi,22px);line-height:1.25;font-weight:700;font-variant-numeric:tabular-nums;display:block;margin-top:3px}',
    '#v-enquiry .fn31 .mo .h{font-family:var(--ui-font);font-size:var(--fs-label,12px);font-weight:700;letter-spacing:.04em;color:var(--ui-mute)}',
    '#v-enquiry .eq2-g[class][class] .eq2-t{border:1px solid var(--ui-line)!important;border-top:1px solid var(--ui-line)!important;border-radius:var(--ui-r)!important}',
    '#v-enquiry .eq2-g[class][class] .eq2-t:not(.au-k):not(.au-a),#v-enquiry .eq2-t:not(.au-k):not(.au-a):hover{box-shadow:none!important}',
    '#v-enquiry > h2,#v-enquiry .eq2-g > h3{font-family:var(--ui-font);font-weight:700;color:var(--ui-ink)}',
    '#v-enquiry > h2{font-size:var(--fs-h2,17px)}#v-enquiry .eq2-g > h3{font-size:var(--fs-h2,15px)}',
    '#v-trials .tp2{border-color:var(--ui-line);border-radius:var(--ui-r);box-shadow:none}',
    '#v-trials .tp2 b{font-family:var(--ui-font);font-size:var(--fs-kpi,20px);font-weight:700;font-variant-numeric:tabular-nums}',
    '#v-trials #tpTabs .seg{background:none;border:0;box-shadow:none;padding:0;border-radius:0}',
    '#v-trials .tpb-d{border-radius:10px}',
    '#v-trials #tpAt{font-size:var(--fs-small,12px);color:var(--ui-mute)}',
    /* phone: funnel above the month chart, tiles 2 × 2 (897's 520px rule split the outer box instead of the tiles) */
    '@media(max-width:860px){#v-enquiry .fn31.fn31{grid-template-columns:minmax(0,1fr)!important}}',
    '@media(max-width:520px){#v-enquiry .fn31 .fl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}#v-enquiry .fn31 .fl > .st:nth-child(3){border-left:0}#v-enquiry .fn31 .fl > .st:nth-child(n+3){border-top:1px solid var(--ui-line)}#v-enquiry .fn31 .st.ar:nth-child(2):after{display:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'ui925'; st.textContent = css; document.head.appendChild(st);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
