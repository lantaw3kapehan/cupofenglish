// 942: (audit 25 Oct, phase 2 · D4) Finance states and signs, display only.
// · Sales & costs "Could not load MONEY." was the only error state, with no way to retry, and Operations saw it too (in the preview
//   the MONEY copy exists for the President only, and the Overview tab already tells Operations "Sales, costs and net are for the
//   President"). The failed state now says what failed and offers "Try again" (loadMoney() again); for Operations it adds that these
//   figures are kept for the President and points to Payroll and Transactions. Nothing is hidden that loaded before: this only
//   replaces the error box after a failed load.
// · Negative pesos written with a hyphen ("-₱3,540", from the shared peso() helper, e.g. Payroll history "November 2026 · only
//   deductions") show with the minus sign used everywhere else ("−₱3,540"), inside the Finance views and Finance dialogs only.
//   The value, its sign and every stored figure are unchanged (patch 832 already did this for "+−₱" / "₱-" forms).
// · Payroll › teacher row (payRow): a zero bonus / deduction / gov line showed "+₱0" / "−₱0"; it now shows "₱0" (no sign on zero).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 942 · Finance: retryable MONEY error, "−₱" minus sign */
(function(){ if(window.__942) return; window.__942 = 1;
  function moneyErr(){ var v = document.getElementById('v-money'); if(!v) return; var e = v.querySelector(':scope > .empty');
    if(!e || !/Could not load MONEY/.test(e.textContent) || e.dataset.e942) return;
    var pres = typeof isPres === 'function' && isPres();
    e.dataset.e942 = '1'; e.setAttribute('role', 'alert');
    e.innerHTML = '<b>Sales &amp; costs could not load.</b><br>The MONEY tab did not answer' + (pres ? ' · check the connection and try again.' : '. These figures are kept for the President; Payroll and Transactions are in the tabs above.') +
      '<div style="margin-top:10px"><button class="btn ghost sm" onclick="this.disabled=true;this.textContent=\'Loading…\';loadMoney()">Try again</button></div>'; }
  var _lm = window.loadMoney;
  if(typeof _lm === 'function') window.loadMoney = loadMoney = function(){ var r = _lm.apply(this, arguments); Promise.resolve(r).then(moneyErr, moneyErr); return r; };

  var RX = /(^|[^\w.,−+-])-₱(?=\d)/g, ROOTS = ['v-payroll', 'v-money', 'v-wallets', 'v-finov', 'v-expenses', 'sheet'];
  function fixNode(n){ var t = n.nodeValue; if(t && t.indexOf('-₱') > -1){ var o = t.replace(RX, '$1−₱'); if(o !== t) n.nodeValue = o; } }
  function walk(root){ if(!root) return; if(root.nodeType === 3){ fixNode(root); return; } if(root.nodeType !== 1 || root.nodeName === 'SCRIPT' || root.nodeName === 'STYLE' || root.nodeName === 'TEXTAREA') return;
    if((root.textContent || '').indexOf('-₱') < 0) return; var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, L = []; while((n = w.nextNode())) L.push(n); L.forEach(fixNode); }
  function watch(){ ROOTS.forEach(function(id){ var el = document.getElementById(id); if(!el || el.__942) return; el.__942 = 1; walk(el);
    new MutationObserver(function(M){ M.forEach(function(m){ if(m.type === 'characterData') fixNode(m.target); else m.addedNodes.forEach(walk); }); }).observe(el, { childList: true, subtree: true, characterData: true }); }); }
  watch(); setTimeout(watch, 4000);   /* v-finov / v-wallets are created by later scripts */
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ['<tr><td>Bonus</td><td class="num plus">+${peso(x.bonus)}</td></tr>', '<tr><td>Bonus</td><td class="num${+x.bonus ? \' plus\' : \'\'}">${+x.bonus ? \'+\' : \'\'}${peso(x.bonus)}</td></tr>'],
  ['<tr><td>Deductions</td><td class="num minus">−${peso(x.deduct)}</td></tr><tr><td>Gov</td><td class="num minus">−${peso(x.gov)}</td></tr>',
   '<tr><td>Deductions</td><td class="num${+x.deduct ? \' minus\' : \'\'}">${+x.deduct ? \'−\' : \'\'}${peso(x.deduct)}</td></tr><tr><td>Gov</td><td class="num${+x.gov ? \' minus\' : \'\'}">${+x.gov ? \'−\' : \'\'}${peso(x.gov)}</td></tr>']
]);
