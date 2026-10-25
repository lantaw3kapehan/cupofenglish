// 892: (Misty brief, navigation) specific labels and predictable page-vs-panel behaviour. Labels only — no screen, data or rule changes.
// · Students tab "Database" → "Database sheet" (it is the DATABASE sheet itself, row by row; the sidebar tooltip already said so).
// · Leave "History" → "Leave history"; teacher Pay "History" → "Pay history".
// · Monitor › Time-ins page: the folded group heading "More" → "Hours, checks & activity".
// · Phone "More" page: title "More screens", subtitle "Screens that are not in the bottom bar" (the old line said everything there
//   reads and writes COE DATABASE directly, which is not true for Contracts and Notices).
// · Enquiries pictures: leftover group "More" → "Other pictures".
// · Sidebar tooltips: Finance (it opens Finance › Overview, not only payroll), Monitor, Trials.
// · Contracts and Notices of breach open as a panel over the page (every other sidebar entry and tab opens a page): they now say so —
//   aria-haspopup="dialog", a "panel" mark, a tooltip, and in the Teachers tab bar they sit after a thin divider instead of looking like tabs.
// (aria-current on the highlighted entry is left to 881-a11y-enhancer.)
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["['reports', 'Parent reports'], ['db', 'Database']]", "['reports', 'Parent reports'], ['db', 'Database sheet']]"],
  ["h += `<h2>History</h2><input id=\"lvq\"", "h += `<h2>Leave history</h2><input id=\"lvq\""],
  ["h += `<h2>History</h2>`;", "h += `<h2>Pay history</h2>`;"],
  ["head.textContent = 'More';", "head.textContent = 'Hours, checks & activity';"],
  ["<h1>More</h1><div class=\"mute small\">Everything here reads and writes COE DATABASE directly</div>", "<h1>More screens</h1><div class=\"mute small\">Screens that are not in the bottom bar</div>"],
  ["g.innerHTML = '<h3>More</h3>", "g.innerHTML = '<h3>Other pictures</h3>"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 892 · nav: tooltips, panel openers marked */
(function(){
  if(window.__892) return; window.__892 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style id="g892css">' + [
    '.g892-p{margin-left:6px;font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--mute,#8A86A0);border:1px solid var(--line,#E4E2EC);border-radius:6px;padding:0 5px;line-height:16px;flex:none}',
    '.grp-tabs[data-g="teachers"] .x816:not(.x816 ~ .x816){margin-left:10px;position:relative}',
    '.grp-tabs[data-g="teachers"] .x816:not(.x816 ~ .x816)::before{content:"";position:absolute;left:-6px;top:20%;bottom:20%;border-left:1px solid var(--line,#E4E2EC)}'].join('') + '</style>');
  const TIP = { payroll: 'Finance: overview, payroll, transactions, sales & costs', monitor: 'Teachers today: time-ins, classes, videos, homework and notes', trials: 'Trial classes and enquiries' };
  const PANEL = 'Opens as a panel over this page';
  function mark(){ try{
    document.querySelectorAll('#navIn button[data-v]').forEach(b => { const t = TIP[b.dataset.v]; if(t && b.title !== t) b.title = t; });
    document.querySelectorAll('#navIn .sb-rec, .grp-tabs .x816').forEach(b => { if(b.getAttribute('aria-haspopup') !== 'dialog') b.setAttribute('aria-haspopup', 'dialog');
      if(!b.querySelector('.g892-p')){ const n = b.querySelector('.sb-n'); n ? n.insertAdjacentHTML('beforebegin', '<span class="g892-p" aria-hidden="true">panel</span>') : b.insertAdjacentHTML('beforeend', '<span class="g892-p" aria-hidden="true">panel</span>'); }
      if(b.classList.contains('x816') && b.title !== PANEL) b.title = PANEL; });
  }catch(e){} }
  window.nav892 = mark;
  const _go = window.go; if(typeof _go === 'function') window.go = function(){ const r = _go.apply(this, arguments); mark(); setTimeout(mark, 350); return r; };
  const _bn = window.buildNav; if(typeof _bn === 'function') window.buildNav = function(){ const r = _bn.apply(this, arguments); mark(); return r; };
  let t = 0; new MutationObserver(() => { clearTimeout(t); t = setTimeout(mark, 60); }).observe(document.body, { childList: true, subtree: true });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
