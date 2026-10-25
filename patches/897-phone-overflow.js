// 897: (audit, lead) Phone (390 px) screens that scrolled sideways, found by the preview check:
// · Teachers › Performance: rank chips ("₱200 · 2,001+ units") forced one line → they wrap.
// · Students / Packages: the partner chip could run past the edge (one record shows a date in its partner field — a data issue, flagged) → capped to the screen.
// · Trials › Enquiries: the four funnel tiles stayed in one row → two per row on phones.
// CSS only.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
(function(){ if(window.__897) return; window.__897 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>@media(max-width:520px){#v-perf .py-t span{white-space:normal!important}#v-perf .py-t{min-width:0;flex-wrap:wrap}.sa-src{max-width:calc(100vw - 130px)!important}#v-enquiry .fn31{grid-template-columns:repeat(2,minmax(0,1fr))!important}#v-enquiry .fn31>div{min-width:0}}</style>');
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
