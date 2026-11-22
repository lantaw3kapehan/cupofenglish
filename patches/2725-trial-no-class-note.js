// 2725 (Misty 22 Nov 19:26): a trial class has no class note to write · its card keeps the trial report (and the class brief), not "Class note"
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`onclick="classBrief('\${esc(c.id)}')">Class brief</button><button class="btn ghost sm" style="margin:8px 0 0 6px" onclick="noteSheet('\${esc(c.code)}','\${esc(c.id)}','\${c.day}')">Class note</button>`,
   `onclick="classBrief('\${esc(c.id)}')">Class brief</button>\${c.type === 'Trial' ? '' : \`<button class="btn ghost sm" style="margin:8px 0 0 6px" onclick="noteSheet('\${esc(c.code)}','\${esc(c.id)}','\${c.day}')">Class note</button>\`}`],
]);
