// 827: Payroll KPI strip: "Not paid yet / All paid" stay small inline tags (not capitals); chart legend colour matches the calmer bars.
require('../tools/lib.js')(process.argv[2], [
  ["'#v-payroll .t824{display:inline-block;", "'#v-payroll .k824 small .t824{text-transform:none;letter-spacing:0;font-size:11px;display:inline-block;margin-top:0}#v-payroll .pm60 .ky i:first-child,#v-payroll .pm60 [class*=key] i{filter:saturate(.45) brightness(1.25)}#v-payroll .t824{display:inline-block;"]
]);
