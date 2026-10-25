// 826: Payroll 12-month chart still collapsed: the laptop rule "flex: 1" (column flex box) beat the height. flex:none + 104px.
// Also the Payroll header matches the other Finance views (26px title, standard 34px buttons).
require('../tools/lib.js')(process.argv[2], [
  ["'#v-payroll.p824 .bd63 .pm60 .cs,#v-payroll .pm60 .cs{height:104px!important;", "'#v-payroll.p824 .py-top h1{font-size:26px!important;color:#2f2752}#v-payroll.p824 .py-act .btn{height:34px;padding:0 14px;font-size:13px;min-height:0}#v-payroll.p824 .py-top{margin-bottom:10px!important}#v-payroll.p824 .bd63 .pm60 .cs,#v-payroll .pm60 .cs{flex:none!important;height:104px!important;"]
]);
