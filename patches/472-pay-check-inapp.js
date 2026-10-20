// 20 Oct · Payroll: the in-app "ask to check" is the main button ("Send to N in the app · check your pay"); Copy for WeChat becomes a small secondary link.
const A = String.raw;
require('../tools/lib.js')(process.argv[2], [
  [A`'<button class="btn sm teal" onclick="pay71Copy()" title="A message with a link to their Pay screen">Copy for WeChat</button>'`, A`'<a class="link small" style="margin-left:8px" onclick="pay71Copy()" title="A message with a link to their Pay screen">or copy for WeChat</a>'`],
  ["  function run(){ document.querySelectorAll('#v-payroll .mini').forEach(m => {", "  function run(){ document.querySelectorAll('#v-payroll button').forEach(b => { const m = b.textContent.match(/^Ask (\\\\d+) to check their pay$/); if(m){ b.textContent = 'Send to ' + m[1] + ' in the app · check your pay'; b.classList.remove('ghost'); b.classList.add('teal'); } });   /* 472 */\n    document.querySelectorAll('#v-payroll .mini').forEach(m => {"]]);
