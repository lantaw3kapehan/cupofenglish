// 895: (audit, lead) Payroll › "October so far" two-column list: names were cut to "Teacher …" because the name column got
// 81px while the amount and status columns took 140px + 150px. The name column now takes the free space; amount and status fit their text.
// CSS only. Same rows, same click → payslip.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
(function(){ if(window.__895) return; window.__895 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>#v-payroll .py-cur .py-row,#v-payroll .py-done .py-row{grid-template-columns:40px minmax(0,1fr) auto auto!important;column-gap:12px!important}#v-payroll .py-cur .py-n b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}#v-payroll .py-cur .py-st{min-width:0!important}</style>');
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
