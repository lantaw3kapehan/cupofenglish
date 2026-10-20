// 20 Oct · Teacher card: coloured labels — tiles with a colour, an icon and a label; units on pace vs last month; feedback countdown; today's classes with done / now / next chips and book pills; pay chart legend.
const A = String.raw;
require('../tools/lib.js')(process.argv[2], [
  [A`h += '<div class="kp"><div><b>' + units + (prev ? '<em style="color:#8A86A0;font-weight:400">' + esc(String(prev.month).split(' ')[0]) + ' ' + num(prev.units) + '</em>' : '') + '</b><span>units this month</span></div>' +`,
   A`const pace = (() => { const d = new Date(), dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); return d.getDate() > 2 ? Math.round(units / d.getDate() * dim) : null; })(), pu = prev ? num(prev.units) : null;   /* 450 */
    h += '<div class="kp"><div class="k50 ku"><small>Units · ' + MN[new Date().getMonth()] + '</small><b>' + units + '</b><span>' + (pace != null && pu ? 'pace ~' + pace + ' <em style="color:' + (pace >= pu ? '#1E8A5E' : '#C0563F') + ';font-style:normal;font-weight:700">' + (pace >= pu ? '▲' : '▼') + '</em> ' + esc(String(prev.month).split(' ')[0]) + ' ' + pu : 'units this month') + '</span></div>' +`],
  [A`'<div><b>' + peso(nowPayOf(me)`, A`'<div class="k50 kpay"><small>Pay so far</small><b>' + peso(nowPayOf(me)`],
  [A`'<div><b>' + S.length + '</b><span>students</span></div>' +`, A`'<div class="k50 kst"><small>Students</small><b>' + S.length + '</b><span>' + S.filter(s => s.left != null && s.left <= 5).length + ' with 5 or fewer lessons</span></div>' +`],
  [A`'<div><b style="color:' + (tp == null`, A`'<div class="k50 ktime"><small>Time-ins</small><b style="color:' + (tp == null`],
  [A`'<div><b style="color:#8A86A0">25th</b><span>monthly feedback opens · ' + (25 - new Date().getDate()) + ' day' + (25 - new Date().getDate() === 1 ? '' : 's') + ' to go</span></div></div>'`,
   A`'<div class="k50 kfb"><small>Monthly feedback</small><b>' + (25 - new Date().getDate()) + ' day' + (25 - new Date().getDate() === 1 ? '' : 's') + '</b><span>until it opens on the 25th</span></div></div>'`],
  [A`(FBO ? '<div><b style="color:' + (fb ? '#C0563F' : '#1E8A5E') + '">' + fb + '</b><span>monthly feedback due</span></div></div>'`, A`(FBO ? '<div class="k50 kfb"><small>Monthly feedback</small><b style="color:' + (fb ? '#C0563F' : '#1E8A5E') + '">' + fb + '</b><span>due now</span></div></div>'`],
  [A`'<div class="r' + (c.cancelled ? ' x' : '') + (past ? ' past' : '') + '" style="--c:' + (c.cancelled ? '#C9C6D6' : bookCol(c.book)) + '"><b>' + tm(c.start) + '</b><i></i><span class="ell">' + esc(c.student || c.title) + (c.book ? ' <span class="mute">· ' + esc(c.book) + '</span>' : '') + '</span>'`,
   A`'<div class="r' + (c.cancelled ? ' x' : '') + (past ? ' past' : '') + '" style="--c:' + (c.cancelled ? '#C9C6D6' : bookCol(c.book)) + '"><b>' + tm(c.start) + '</b><i></i><span class="ell">' + esc(c.student || c.title) + (c.book ? ' <span class="bk50">' + esc(c.book) + '</span>' : '') + (c.cancelled ? ' <span class="st50 sx">cancelled</span>' : past ? ' <span class="st50 sd">done</span>' : new Date(c.start) <= now ? ' <span class="st50 sn">now</span>' : '') + '</span>'`],
  [A`<span>green = paid</span></h3>'`, A`<span class="lg50"><i style="background:#2E9E6F"></i>paid <i style="background:#00A3AD"></i>this month <i style="background:#9ED9DD"></i>pending</span></h3>'`],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 450 · teacher card colours (Misty: "can it be better visually, especially colour labels?") */
(function(){ const css = document.createElement('style'); css.textContent = \`
.t46 .kp .k50{position:relative;padding:10px 12px 10px 14px!important;background:var(--bg50)!important;border-left:4px solid var(--c50)}
.t46 .kp .k50 small{display:flex;align-items:center;gap:6px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--c50);font-weight:700}
.t46 .kp .k50 small:before{content:'';width:8px;height:8px;border-radius:4px;background:var(--c50)}
.t46 .kp .k50 b{margin-top:2px}
.t46 .kp .k50 span{font-size:12px!important}
.t46 .kp .ku{--c50:#00A3AD;--bg50:#EEF8F9}
.t46 .kp .kpay{--c50:#2E9E6F;--bg50:#EEF8F3}
.t46 .kp .kst{--c50:#6C5FC7;--bg50:#F2F0FB}
.t46 .kp .ktime{--c50:#3B82B5;--bg50:#EEF4FA}
.t46 .kp .kfb{--c50:#D9962B;--bg50:#FCF6EA}
.t46 .td46 .r .bk50{display:inline-block;font-size:11.5px;padding:1px 8px;border-radius:999px;margin-left:4px;background:color-mix(in srgb,var(--c) 14%,#fff);color:color-mix(in srgb,var(--c) 80%,#1E1A3A)}
.t46 .td46 .r .st50{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:.04em;padding:1px 7px;border-radius:999px;margin-left:6px;text-decoration:none}
.t46 .td46 .r .sd{background:#F1F0F6;color:#8A86A0}.t46 .td46 .r .sn{background:#00A3AD;color:#fff}.t46 .td46 .r .sx{background:#FDF1EE;color:#C0563F}
.t46 .td46 .r.past .bk50{opacity:.6}
.t46 .lg50{display:inline-flex;align-items:center;gap:5px;letter-spacing:0;text-transform:none}
.t46 .lg50 i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-left:6px}
.t46 .pc .cs>div:not(.pd):not(.cur) i{background:#9ED9DD}
.t46 .jy49 .ms:nth-child(2) i{box-shadow:inset 0 0 0 4px var(--rc)}
.t46 .jy49 .ms:nth-child(2) b{color:var(--rt)}\`; document.head.appendChild(css); })();
` + "</script>\n\n</body>"]]);
