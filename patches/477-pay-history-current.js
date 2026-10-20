// 20 Oct · Pay / My pay: this month's row leaves History (it showed a second, different October figure next to the estimate).
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 477 · Teacher Pay showed "Estimated October ₱13,350" and, in History, "Oct 2026 · ₱13,260 · Pending" — two numbers for the
   same month. The month in progress is the estimate at the top; History keeps the finished months only (the row is still one tap away
   through "This month's filed row" under the table, for Ops checking). */
(function(){
  const now = new Date(), M = now.toLocaleDateString('en-US', { month: 'long' }), S = now.toLocaleDateString('en-US', { month: 'short' }), Y = String(now.getFullYear());
  const isCur = t => { t = String(t || '').trim(); return (t.indexOf(M) === 0 || t.indexOf(S + ' ') === 0) && t.indexOf(Y) > -1; };
  function tidy(id){ const v = document.getElementById(id); if(!v) return; const tb = v.querySelector('table'); if(!tb || tb.dataset.p77) return; tb.dataset.p77 = 1;
    const rows = [...tb.querySelectorAll('tr')].filter(r => r.querySelector('td') && isCur(r.querySelector('td').textContent)); if(!rows.length) return;
    rows.forEach(r => r.style.display = 'none');
    tb.insertAdjacentHTML('afterend', '<div class="small mute" style="margin-top:6px">' + esc(M) + ' is the estimate at the top until it is final. <a href="javascript:void 0" style="color:var(--teal);font-weight:700;text-decoration:none" onclick="this.parentNode.previousElementSibling.querySelectorAll(\\'tr\\').forEach(r => r.style.display = \\'\\');this.parentNode.remove()">Show ' + esc(M) + '\\'s filed row</a></div>'); }
  const _a = window.renderPay; if(_a) window.renderPay = function(){ const r = _a.apply(this, arguments); try{ tidy('v-pay'); }catch(e){} return r; };
  const _b = window.renderMyPay; if(_b) window.renderMyPay = function(){ const r = _b.apply(this, arguments); try{ tidy('v-mypay'); }catch(e){} return r; };
})();
` + "</script>\n\n</body>"]]);
