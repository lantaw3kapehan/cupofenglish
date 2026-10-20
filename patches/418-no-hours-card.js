// 20 Oct · Time-ins: the "Office hours" chart card is gone (Management hours in Full details shows the same, day by day); the four other cards sit 2 × 2.
require('../tools/lib.js')(process.argv[2], [
  ["      if(P.length) out.push('<div class=\"c\" data-k=\"hrs\">", "      if(false && P.length) out.push('<div class=\"c\" data-k=\"hrs\">"],
  ["out.push('<div class=\"c w\" data-k=\"feed\">", "out.push('<div class=\"c\" data-k=\"feed\">"],
  ["#v-team .bd14 .two{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:18px;align-items:end}", "#v-team .bd14 .two{display:grid;grid-template-columns:1fr;gap:10px;align-items:end}"]]);
