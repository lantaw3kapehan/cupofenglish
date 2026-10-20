// 20 Oct · Overview = glance, To do = act (Misty: "each screen should not repeat the same task").
// The "Decide now" and "Waiting on teachers" lists leave the Overview (they live in To do); in their place one
// "To do" card: how many things wait for you / for teachers, the first few named, one button to open To do.
// "Needs you" in the header opens To do too.
require('../tools/lib.js')(process.argv[2], [
  ["onclick=\"document.getElementById('ovDecide').scrollIntoView({behavior:'smooth'})\"><span>Needs you</span>", "onclick=\"go('mtoday')\"><span>Needs you</span>"],
  ["    h += `<div class=\"o2-mid ${wait ? '' : 'solo'}\">${dec}${wait}</div>`;",
   "    void dec; void wait;   /* 403: the lists themselves are on To do */\n" +
   "    { const nQ = Q.length, nW = W.length, names = Q.slice(0, 3).map(x => x.t).concat(W.slice(0, 2).map(x => x.t));\n" +
   "      h += `<a class=\"o2-todo ${nQ ? 'hot' : ''}\" onclick=\"go('mtoday')\"><div class=\"o2-tl\"><span>To do</span><b>${nQ ? nQ + ' need' + (nQ === 1 ? 's' : '') + ' you' : '✓ Nothing urgent'}</b>${nW ? `<small>${nW} waiting on teachers</small>` : ''}</div>` +\n" +
   "        `<div class=\"o2-tn\">${names.length ? names.map(t => `<span>${esc(t)}</span>`).join('') : '<span class=\"ok\">All clear</span>'}</div><em>Open To do ›</em></a>`; }"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n(function(){ const s = document.createElement('style'); s.textContent = `" +
   ".ov2 .o2-todo{display:flex;align-items:center;gap:18px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:16px 20px;cursor:pointer;color:var(--ink)!important;text-decoration:none}" +
   ".ov2 .o2-todo:hover{box-shadow:0 0 0 1px var(--teal) inset,var(--sh1)}" +
   ".ov2 .o2-todo.hot{border-left:4px solid #D4705A}" +
   ".ov2 .o2-tl{display:flex;flex-direction:column;gap:2px;min-width:180px}.ov2 .o2-tl span{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;font-weight:600}" +
   ".ov2 .o2-tl b{font-family:var(--brand);font-weight:400;font-size:22px;color:var(--ink)}.ov2 .o2-todo.hot .o2-tl b{color:#B4513B}.ov2 .o2-tl small{font-size:12.5px;color:#8A86A0}" +
   ".ov2 .o2-tn{flex:1;display:flex;flex-wrap:wrap;gap:6px;min-width:0}.ov2 .o2-tn span{font-size:13px;padding:5px 11px;border-radius:999px;background:var(--soft);color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px}.ov2 .o2-tn span.ok{background:var(--tint);color:#00737B}" +
   ".ov2 .o2-todo em{font-style:normal;font-weight:700;color:var(--teal);white-space:nowrap}" +
   "`; document.head.appendChild(s); })();\n</script>\n\n</body>"]]);
