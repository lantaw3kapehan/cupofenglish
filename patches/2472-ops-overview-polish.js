// 2472 (Misty 19:13 "yes go ahead and make those live now" · approved mock of Celine's Overview and To do)
//   Overview: progress dots "7 of 17 done today" in the header · End-of-shift report in the header
//   · tiles say their period (Today / November) · today's found · solved, fixed from her day
//   · Management card only when it has something (new answer, end of shift due, waiting) · empty "Coming up in China" hidden for her
//   · failed saves in plain words. To do: "updates every 20 seconds" · "Not a problem" not underlined.
const file = process.argv[2];
const CSS = `<style id="u2472">#om2344 .tile em{display:block;font-style:normal;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0;margin-bottom:2px}
#om2344 .ov-hero .dt2471{margin-top:10px}#v-home:has(#om2344) .cn95[data-h="h"]{display:none}
#v-mtoday button[data-x1101]{text-decoration:none!important}</style>
`;
require('../tools/lib.js')(file, [
  // header: dots + End-of-shift
  ["<div class=\"ov-tag\">Operations · your work today, your duties this month, and what to watch out for.</div></div>'",
   "<div class=\"ov-tag\">Operations · your work today, your duties this month, and what to watch out for.</div>' + (function(){ var t = window.__dt2472; if(!t && window.od2472) window.od2472(); return t && window.dots2471 ? window.dots2471(t[0], t[1], 'done today') : ''; })() + '</div>'"],
  ["'<a class=\"ov-cap ghost\" onclick=\"od2341Report && od2341Report()\"><span><b>Report to Management</b><small>decision, concern, problem or update</small></span></a></div></section>'",
   "'<a class=\"ov-cap ghost\" onclick=\"od2341Report && od2341Report()\"><span><b>Report to Management</b><small>decision, concern, problem or update</small></span></a>' + (window.eod2360 ? '<a class=\"ov-cap ghost\" onclick=\"eod2360()\"><span><b>End-of-shift report</b><small>before you clock out</small></span></a>' : '') + '</div></section>'"],
  // tiles with their period
  ["h += '<div class=\"tiles\"><div class=\"tile\"><b>' + (d.done || 0) + '</b><span>done today</span></div><div class=\"tile\"><b style=\"color:#A2462C\">' + (m.found7 || 0) + '</b><span>problems you found this week</span></div><div class=\"tile\"><b style=\"color:#1E7A4F\">' + (m.fixed7 || 0) + '</b><span>problems you fixed this week</span></div>' +",
   "h += '<div class=\"tiles\"><div class=\"tile\"><em>Today</em><b>' + (d.done || 0) + '</b><span>done</span></div><div class=\"tile\"><em>Today</em><b style=\"color:#A2462C\">' + (d.found || 0) + '</b><span>problem' + ((d.found || 0) === 1 ? '' : 's') + ' found' + ((d.solved || 0) ? ' · <b style=\"display:inline;font:600 13.5px Inter,sans-serif;color:#1E7A4F\">' + d.solved + ' solved</b>' : '') + '</span></div><div class=\"tile\"><em>Today</em><b style=\"color:#1E7A4F\">' + (d.fixed || 0) + '</b><span>fixed</span></div>' +"],
  ["'<div class=\"tile\"><b>' + (ti.ontime || 0) + '<span style=\"font-size:15px;color:#6B7280\"> on time</span></b><span>time-ins in ' + E(String(m.month || '').split(' ')[0])",
   "'<div class=\"tile\"><em>' + E(String(m.month || '').split(' ')[0]) + '</em><b>' + (ti.ontime || 0) + '</b><span>on-time time-ins'"],
  // failed saves in plain words
  ["mgmtFix: 'Data fix', mgmtEnrolShared: 'Shared package', addSale: 'Sale', addExpense: 'Expense', editClass: 'Class change', addClass: 'New class', mgmtRenewal: 'Renewal status' };", "mgmtFix: 'Data fix', mgmtEnrolShared: 'Shared package', addSale: 'Sale', addExpense: 'Expense', editClass: 'Class change', addClass: 'New class', mgmtRenewal: 'Renewal status', mgmtTaskStatus: 'Mark a task done' };"],
  ["return '<div class=\"er\"><b>' + E(FN[x.fn] || x.fn) + '</b> <span class=\"mute small\">' + E(x.at) + '</span><div>' + E(x.error) + '</div></div>';",
   "return '<div class=\"er\"><b>' + E(FN[x.fn] || x.fn) + '</b> <span class=\"mute small\">' + E(x.at) + '</span><div>' + E(x.fn === 'mgmtTaskStatus' && /^not found/i.test(String(x.error)) ? 'That task was no longer there (already done or removed), so there was nothing to save.' : x.error) + '</div></div>';"],
  // Management card only when it has something
  ["h += '<div class=\"bb\" style=\"margin-top:10px;display:flex;gap:8px;flex-wrap:wrap\"><button class=\"btn ghost sm\" onclick=\"od2341Report()\">Report to Management</button>'",
   "if(!un.length && !eodDue && !open.length) return '<div class=\"c2360\" id=\"my2360\" hidden></div>'; h += '<div class=\"bb\" style=\"margin-top:10px;display:flex;gap:8px;flex-wrap:wrap\"><button class=\"btn ghost sm\" onclick=\"od2341Report()\">Report to Management</button>'"],
  // Ops Desk wording + share the day's progress with the Overview
  ["'checked again every minute", "'updates every 20 seconds"],
  ["+ (window.dots2471 ? window.dots2471(d.done || 0, (d.done || 0) + tasks, 'done today') : '')", "+ (window.__dt2472 = [d.done || 0, (d.done || 0) + tasks], window.dots2471 ? window.dots2471(d.done || 0, (d.done || 0) + tasks, 'done today') : '')"],
  ["}, 20e3);   /* 2467: every 20 s */", "}, 20e3);   /* 2467: every 20 s */\n  window.od2472 = function(){ if(window.__od2472 && Date.now() - window.__od2472 < 60e3) return; window.__od2472 = Date.now(); load().then(function(){ try{ html(); if(typeof VIEW !== 'undefined' && VIEW === 'home' && window.renderHome) window.renderHome(); }catch(e){} }); };"],
  ['<script id="b2278">', CSS + '<script id="b2278">']
]);
