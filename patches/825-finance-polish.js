// 825: Finance Overview / Transactions polish after checking on screen:
// · table cells keep left alignment (an older "td.n" rule pushed names to the right); amounts stay right-aligned
// · the trend's month labels are drawn as text under the chart (they were squeezed by the stretched drawing)
// · Payroll: the 12-month chart had collapsed to nothing on wide screens (an older laptop rule); now 104px high
// · Transactions header shorter ("Last synced …")
// · "Not paid yet / All paid" tags stay small inline tags in the Payroll card; the chart title no longer wraps
require('../tools/lib.js')(process.argv[2], [
  ["'.fx-note{font-family:'", "'.fx td{text-align:left!important}.fx td.r,.fx th.r{text-align:right!important}.fx-pr small .fx-tag{display:inline-block;text-transform:none;letter-spacing:0;font-size:11px}.fx-tr .ax{display:flex;justify-content:space-between;font-family:' + SANS + ';font-size:11px;color:#9A96AE;margin-top:4px}.fx-tr .ax b{color:#2f2752}.fx-tr svg{height:120px}',\n    '.fx-note{font-family:'"],
  ["'<text x=\"' + X(j).toFixed(1) + '\" y=\"' + (H - 6) + '\" text-anchor=\"' + (j === 0 ? 'start' : j === P.length - 1 ? 'end' : 'middle') + '\" font-size=\"10.5\" fill=\"' + (x.m === OM ? '#2f2752' : '#9A96AE') + '\" font-weight=\"' + (x.m === OM ? '700' : '400') + '\" font-family=\"' + SANS.replace(/\"/g, '') + '\">' + mL(x.m, 1) + '</text></g>').join('') + '</svg>'; }",
   "'</g>').join('') + '</svg><div class=\"ax\">' + P.map(x => x.m === OM ? '<b>' + mL(x.m, 1) + '</b>' : '<span>' + mL(x.m, 1) + '</span>').join('') + '</div>'; }"],
  ["'#v-payroll .pm60 .cs{height:96px!important;min-height:0!important;", "'#v-payroll.p824 .bd63 .pm60 .cs,#v-payroll .pm60 .cs{height:104px!important;min-height:0!important;"],
  ["const W = 600, H = 130, pl = 6, pr = 6, pt = 10, pb = 22,", "const W = 600, H = 120, pl = 6, pr = 6, pt = 8, pb = 6,"],
  ["<span class=\"fx-sub\">Sales and expenses · database copy ' + syncAt(X.at) + '</span>", "<span class=\"fx-sub\">Last synced ' + syncAt(X.at) + '</span>"],
  ["<h2>Sales and costs</h2><span class=\"fx-sub\">last 12 months · tap a month</span>", "<h2>Sales and costs</h2><span class=\"fx-sub\">12 months</span>"]
]);
