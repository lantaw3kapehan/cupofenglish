// 832: (audit 25 Oct, finding 17) Number and period display, display only — no stored value, sign or calculation changes.
// · Periods kept in the sheets as "September//2026" (PAYROLL MONTH, PAYSLIP period cell, payslip period list) show as "September 2026"
//   everywhere on screen, in documents (on screen, picture, PDF/print) and in lists. A dropdown keeps the stored value it sends.
// · A refund line (a sale with a negative amount, e.g. SALES row 33) showed as "+−₱3,675.00" in Transactions and Overview;
//   it now shows "−₱3,675.00" and its lessons as "refund · 7 + 3 lessons". Generic "+₱-…" / "+-₱…" / "₱-…" text shows as "−₱…".
// · Zero change: "▲ 0%", "▲ ₱0", "▲ 0 pts" show "No change" (muted, not green); Overview's "vs last month" says "No change" when the
//   figures are equal and "▲ <1%" when the change rounds to 0%. The Payroll chart's "+0%" under a month shows "0%".
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  // payslip "Pay period": show "October 2026", keep the stored "October//2026" as the option value
  ["${opts(per.map(x=>x), def)}",
   "${per.map(o => `<option value=\"${esc(o)}\"${String(o)===String(def)?' selected':''}>${esc(String(o).split(SL2).join(' '))}</option>`).join('')}"],
  // 823 · signed amounts: the sign follows the amount (a refund sale is −₱…, a negative expense is +₱…)
  ["(r.k === 'in' ? '+' : '−') + P2(r.a) + '</td></tr>';", "((r.k === 'in') === (+r.a >= 0) ? '+' : '−') + P2(Math.abs(+r.a || 0)) + '</td></tr>';"],
  ["(r.k === 'in' ? '+' : '−') + P2(r.a) + '</td></tr>').join('')", "((r.k === 'in') === (+r.a >= 0) ? '+' : '−') + P2(Math.abs(+r.a || 0)) + '</td></tr>').join('')"],
  ["const pkg = r => { const n = Number(r.pkg) || 0, f = Number(r.free) || 0; return n ? n + (f ? ' + ' + f : '') + ' lessons' : ''; };",
   "const pkg = r => { const n = Number(r.pkg) || 0, f = Number(r.free) || 0; if(n < 0 || f < 0) return 'refund · ' + Math.abs(n) + (f ? ' + ' + Math.abs(f) : '') + ' lessons'; return n ? n + (f ? ' + ' + f : '') + ' lessons' : ''; };"],
  // 823 Overview · "vs last month": equal → No change; rounds to 0 → <1%
  ["const vs = (a, b) => b ? '<span class=\"' + (a >= b ? 'in' : 'out') + '\">' + (a >= b ? '▲ ' : '▼ ') + Math.abs(Math.round((a - b) / Math.abs(b) * 100)) + '%</span> vs ' + mL(pv.m, 1) : '';",
   "const vs = (a, b) => { if(!b) return ''; if(a === b) return '<span>No change</span> vs ' + mL(pv.m, 1); const pc = Math.abs(Math.round((a - b) / Math.abs(b) * 100)); return '<span class=\"' + (a > b ? 'in' : 'out') + '\">' + (a > b ? '▲ ' : '▼ ') + (pc ? pc : '<1') + '%</span> vs ' + mL(pv.m, 1); };"],
  // Payroll 12-month chart axis
  ["(d >= 0 ? '+' : '') + d + '%</em>'", "(d > 0 ? '+' : '') + d + '%</em>'"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 832 · display tidy: periods "Month//YYYY", refund signs, zero change (text only, nothing stored changes) */
(function(){
  if(window.__832) return; window.__832 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>.nc832{color:#7C7893!important;font-weight:600}</style>');
  const MON = '(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)';
  const RX = [
    [new RegExp('\\b' + MON + '\\/\\/(\\d{4})\\b', 'g'), '$1 $2'],
    [/\+\s?[−-]\s?₱/g, '−₱'], [/\+₱\s?[−-]\s?(?=\d)/g, '−₱'], [/(^|[^\w+−-])₱-(?=\d)/g, '$1−₱'],
    [/[▲▼]\s*\+?₱?0(?:\.0+)?(?:%| pts?\b| units?\b)?(?!\d|[.,]\d)/g, 'No change']
  ];
  const TEST = /\/\/|₱\s?[−-]|[−-]\s?₱|[▲▼]/;
  const fix = t => { if(!t || !TEST.test(t)) return t; let o = t; RX.forEach(([a, b]) => { o = o.replace(a, b); }); return o; };
  window.coeTidy = fix;
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, NOSCRIPT: 1 };
  function node(n){ const p = n.parentNode; if(!p || SKIP[p.nodeName] || p.isContentEditable) return; const t = n.nodeValue, o = fix(t); if(o === t) return;
    if(p.nodeName === 'OPTION' && !p.hasAttribute('value')) p.setAttribute('value', p.textContent);   /* the option keeps sending what it sent before */
    n.nodeValue = o; if(/No change/.test(o) && p.nodeType === 1 && /^\s*No change/.test(p.textContent)) p.classList.add('nc832'); }
  function walk(root){ if(!root) return; if(root.nodeType === 3){ node(root); return; } if(root.nodeType !== 1 || SKIP[root.nodeName]) return;
    if(!TEST.test(root.textContent || '')) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), L = []; let n; while((n = w.nextNode())) if(TEST.test(n.nodeValue)) L.push(n); L.forEach(node); }
  try{ new MutationObserver(M => { for(const m of M){ if(m.type === 'characterData') node(m.target); else m.addedNodes.forEach(walk); } })
    .observe(document.documentElement, { childList: true, subtree: true, characterData: true }); }catch(e){ console.warn('832', e); }
  try{ walk(document.body); }catch(e){}
  /* documents: the picture (html2canvas) and print copies are built from docHtml, so tidy its text too */
  try{ const dh = window.docHtml; if(typeof dh === 'function') window.docHtml = function(){ const h = dh.apply(this, arguments); try{ return String(h).replace(/>([^<]+)</g, (m, t) => '>' + fix(t) + '<'); }catch(e){ return h; } }; }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
