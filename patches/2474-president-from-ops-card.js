// 2474 (Misty 19:37 "Yes go ahead now" · approved mock of the President's "From Operations" card)
//   White aligned card (no navy border) · four tiles you can click: done · found (· solved) · fixed · waiting for you
//   · dots "7 of 17 her list today" (coe-ops v16 deskday.todo, counted as on her Ops Desk) · "Her week" as a short table, the rest under More.
const file = process.argv[2];
const CSS = `<style id="u2474">#pd2360{border:1px solid #ECEAF2!important;border-radius:18px!important;background:#fff!important;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16)!important}
#pd2360 .k2474{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}
#pd2360 .k2474>div{background:#F7F6FA;border-radius:12px;padding:10px 12px;cursor:pointer;min-width:0}#pd2360 .k2474>div:hover{background:#EFEDF5}
#pd2360 .k2474 b{display:block;font-size:24px;font-weight:600;color:#2B2253;line-height:1.15;font-variant-numeric:tabular-nums}#pd2360 .k2474 span{font-size:13px;color:#6B6880}
#pd2360 .k2474 b.r{color:#A2462C}#pd2360 .k2474 b.g{color:#1E7A4F}
#pd2360 .wk2474{border-collapse:collapse;font-size:13.5px;margin-top:6px;width:100%;max-width:520px}#pd2360 .wk2474 td,#pd2360 .wk2474 th{padding:5px 10px 5px 0;text-align:left;font-variant-numeric:tabular-nums}
#pd2360 .wk2474 th{font-weight:500;color:#8A86A0;font-size:12px}#pd2360 .wk2474 td:first-child{font-weight:600;color:#2B2253}
@media(max-width:760px){#pd2360 .k2474{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>
`;
const OLDHEAD = `</h3><span class="small mute">' + (d.timein ? 'Timed in ' + E(d.timein) : 'Not timed in yet') + ' · ' + (window.__pd2469 = d, '') + '<a class="link" href="#" onclick="return pd2469(\\'done\\')">' + (d.done || 0) + ' done</a> · <a class="link" href="#" onclick="return pd2469(\\'found\\')">' + (d.found || 0) + ' found</a> · <a class="link" href="#" onclick="return pd2469(\\'fixed\\')">' + (d.fixed || 0) + ' fixed</a> · <a class="link" href="#" onclick="return pd2469(\\'all\\')">all she did</a> · idle ' + (d.idle || 0) + ' min</span></div>';`;
const NEWHEAD = `</h3><span class="small mute">' + (d.timein ? 'Timed in ' + E(d.timein) : 'Not timed in yet') + ' · idle ' + (d.idle || 0) + ' min · <a class="link" href="#" onclick="return pd2469(\\'all\\')">all she did</a>' + (window.__pd2469 = d, '') + '</span></div>'
      + '<div class="k2474"><div role="button" tabindex="0" onclick="pd2469(\\'done\\')"><b>' + (d.done || 0) + '</b><span>done ›</span></div>'
      + '<div role="button" tabindex="0" onclick="pd2469(\\'found\\')"><b class="r">' + (d.found || 0) + '</b><span>found' + ((d.solved || 0) ? ' · ' + d.solved + ' solved' : '') + ' ›</span></div>'
      + '<div role="button" tabindex="0" onclick="pd2469(\\'fixed\\')"><b class="g">' + (d.fixed || 0) + '</b><span>fixed ›</span></div>'
      + '<div role="button" tabindex="0" onclick="var r=document.querySelector(\\'#pd2360 .r2360 textarea, #pd2360 .p2452\\');if(r)r.scrollIntoView({behavior:\\'smooth\\',block:\\'center\\'})"><b' + (R.length ? ' class="r"' : '') + '>' + R.length + '</b><span>waiting for you' + (dec ? ' · ' + dec + ' decision' + (dec > 1 ? 's' : '') : '') + '</span></div></div>'
      + (PD.todo != null && window.dots2471 ? window.dots2471(d.done || 0, (d.done || 0) + (+PD.todo || 0), 'her list today') : '');`;
require('../tools/lib.js')(file, [
  [`var h = '<div class="c2360" id="pd2360" style="border:2px solid #2B2253">`, `var h = '<div class="c2360" id="pd2360">`],
  [OLDHEAD, NEWHEAD],
  [`h += '<div class="small" style="margin-top:4px;color:#4B5563">' + (R.length ? '<b style="color:#7A2E17">' + R.length + ' waiting for you</b>' + (dec ? ' · ' + dec + ' need a decision' : '') : 'Nothing waiting for you from Operations.') + '</div>';`, ``],
  [`h += '<div class="p2452"><b>Problems ' + E(who) + ' found today · ' + P.length + '</b>'`, `h += '<div class="p2452"><b>Problems ' + E(who) + ' found today · waiting for your answer · ' + P.length + '</b>'`],
  [`var WK = PD.week; if(WK && WK.this){ var row = function(w, lab){`, `var WK = PD.week; if(WK && WK.this){ var r2 = function(w, lab){ if(!w) return ''; return '<tr><td>' + lab + '</td><td>' + w.done + '</td><td>' + w.found + '</td><td>' + w.fixed + '</td><td>' + (w.late ? '<b style="color:#C2412D">' + w.late + '</b>' : '0') + '</td></tr>'; };
      h += '<div class="r2360"><b>Her week</b><table class="wk2474"><tr><th></th><th>done</th><th>found</th><th>fixed</th><th>late</th></tr>' + r2(WK.this, 'This week') + r2(WK.last, 'Last week') + '</table></div>';
      var row = function(w, lab){`],
  [`<summary style="cursor:pointer"><b>Her week</b> <span class="small mute">this week and last week</span></summary>`, `<summary style="cursor:pointer"><b>More about her week</b> <span class="small mute">days, saves, idle time, reports, end-of-shift</span></summary>`],
  ['<script id="b2278">', CSS + '<script id="b2278">']
]);
