// 15 Oct · Teacher cards, calmer (Misty: "too crowded"): one number (units), one bar (completion), rank as a small
// coloured dot + plain text, students / late as one quiet line, more white space; 4 per row on wide screens.
const css = `<style id="tc3css">
body #v-teachers .tc2-g{grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;margin-top:16px}
body #v-teachers .tc2{padding:18px 18px 16px;gap:12px;border-radius:20px;box-shadow:none}
body #v-teachers .tc2-av{width:38px;height:38px;border-radius:19px;font-size:14px}
body #v-teachers .tc2-nm b{font-size:15.5px}
body #v-teachers .tc2-rk{display:flex;align-items:center;gap:6px;margin-top:2px;padding:0;background:none!important;color:#8A87A0!important;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body #v-teachers .tc2-rk:before{content:'';width:8px;height:8px;border-radius:4px;background:var(--rc);flex:none}
body #v-teachers .tc2-u b{font-size:28px}
body #v-teachers .tc2-u span{font-size:11px;letter-spacing:.04em;text-transform:uppercase}
body #v-teachers .tc2-line{font-size:12px;color:#8A87A0;gap:10px}
body #v-teachers .tc2-line>span:first-child{display:none}
body #v-teachers .tc2-line .pg{height:5px;border-radius:3px}
body #v-teachers .tc2-line b{font-size:12.5px;min-width:0!important}
body #v-teachers .tc2-f{gap:0;font-size:12.5px;color:#8A87A0}
body #v-teachers .tc2-f span{padding:0;background:none!important;color:#8A87A0}
body #v-teachers .tc2-f span+span:before{content:'·';margin:0 7px;color:#C9CCD8}
body #v-teachers .tc2-f .late{color:#A1452F!important}body #v-teachers .tc2-f .off{color:#8A5A00!important}
</style>`;
require('../tools/lib.js')(process.argv[2], [
["<div class=\"tc2-line\"><span style=\"width:62px\">Units</span><span class=\"pg\"><i style=\"width:${Math.round((+x.units || 0) / mx * 100)}%;background:var(--rc)\"></i></span></div>\n", ""],
["<b>${esc(String(x.units))}</b><span>units this month</span>", "<b>${esc(String(x.units))}</b><span>units</span>"],
["<div class=\"tc2-line\"><span style=\"width:62px\">Completion</span>", "<div class=\"tc2-line\" title=\"Classes completed this month\"><span style=\"width:62px\">Completion</span>"],
["${x.students} students</span>", "${x.students} students</span><span>${c == null ? 'no classes yet' : c + '% completed'}</span>"],
["<b style=\"color:${col};min-width:38px;text-align:right\">${c == null ? '—' : c + '%'}</b>", ""],
["</head>", css + "\n</head>"],
]);
