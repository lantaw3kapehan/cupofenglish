// 952 (D5 · Teacher role): phone layout fixes found in the teacher preview (390 px).
//      · Pay › Punctuality: each late row ("Late to class · 3 min … Pending · −₱30 unless excused by 26 Oct, 13:03") squeezed the
//        left part to one word per line (the rule wraps the row on phones but the text block could shrink to its narrowest
//        word). Now on phones the text block takes the full row and the status goes under it. Wording and amounts unchanged.
//      · Payslip sheet and Pay figures showed a sign on zero ("Bonus +₱0", "Deductions −₱0", "Gov −₱0"), which reads as a charge.
//        A zero is now shown as plain "₱0" (muted). Only exact zeros change; every non-zero amount keeps its sign and colour.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 952 · teacher phone layout fixes */
(function(){ if(window.__952) return; window.__952 = 1;
  var css = '@media(max-width:620px){.lt-it{flex-wrap:wrap;row-gap:4px}.lt-it > .grow{flex:1 1 100%!important;min-width:0}.lt-it > b{white-space:normal}}';
  css += '.z952{color:#6B6782!important}';
  var st = document.createElement('style'); st.id = 's952'; st.textContent = css; document.head.appendChild(st);
  function zero(root){ try{ if(!root) return; root.querySelectorAll('.plus,.minus').forEach(function(el){ if(el.children.length) return; var t = String(el.textContent).trim();
      if(/^[+−-]₱0(\.00)?$/.test(t)){ el.textContent = '₱0'; el.classList.remove('plus', 'minus'); el.classList.add('z952'); } }); }catch(e){} }
  var isT = function(){ return typeof D !== 'undefined' && D && !D.mgr; };
  var _ps = window.paySheet; if(typeof _ps === 'function') window.paySheet = function(){ var r = _ps.apply(this, arguments); if(isT()) zero(document.getElementById('sheetBody')); return r; };
  var _rp = window.renderPay; if(typeof _rp === 'function') window.renderPay = function(){ var r = _rp.apply(this, arguments); if(isT()) zero(document.getElementById('v-pay')); return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
