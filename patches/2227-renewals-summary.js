// 2227 (14 Nov · Misty: "we can do all now"): To do › Renewals due gets a summary line at the top instead of a separate board
// (the list already has the reminders): how many families are due, how many are not reminded yet, waiting for a reply, or said
// they are renewing, and the money expected if all renew, from each family's last payment (coe-cal renewExp).
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2227">
#td-renew .rx27{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:8px 0 14px}
#td-renew .rx27 div{background:#F7F6FB;border-radius:14px;padding:10px 14px;display:flex;flex-direction:column;gap:1px;min-width:0}
#td-renew .rx27 span{font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#6F6B85}
#td-renew .rx27 b{font-size:22px;font-weight:700;color:#2B2253;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#td-renew .rx27 em{font-style:normal;font-size:12px;color:#6F6B85}
#td-renew .rx27 .m{background:#EEF8F3}#td-renew .rx27 .m b{color:#1F6E4E}
#td-renew .rx27 .w b{color:#A6432E}
@media (max-width:700px){#td-renew .rx27{grid-template-columns:repeat(2,minmax(0,1fr))}#td-renew .rx27 b{font-size:18px}}
</style>
<script id="x2227">
(function(){
  if(window.__x2227) return; window.__x2227 = 1;
  const EXP = {}; let busy = 0;
  const fmt = (n, c) => (c === 'PHP' ? '₱' : '¥') + Math.round(n).toLocaleString('en-US');
  function paint(){
    const sec = document.getElementById('td-renew'); if(!sec) return;
    const rows = [...sec.querySelectorAll('.tdr')]; if(!rows.length){ const o = sec.querySelector('.rx27'); if(o) o.remove(); return; }
    const codes = [], st = { not: 0, wait: 0, yes: 0 };
    rows.forEach(r => { const m = (r.innerHTML.match(/ST-\d{4}-\d{3}/) || [])[0]; if(m) codes.push(m);
      const t = r.textContent || ''; if(/\bRenewing\b|said renewing/i.test(t)) st.yes++; else if(/Copy reminder again|Reminder sent/i.test(t)) st.wait++; else st.not++; });
    const need = codes.filter(c => !(c in EXP));
    if(need.length && !busy && typeof TOKEN !== 'undefined' && TOKEN){ busy = 1;
      fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-cal', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'renewExp', codes: need }) })
        .then(x => x.json()).then(r => { busy = 0; need.forEach(c => EXP[c] = (r && r.ok && r.by && r.by[c]) || null); paint(); }).catch(() => { busy = 0; }); }
    const sum = {}; let known = 0; codes.forEach(c => { const x = EXP[c]; if(x && x.amt){ known++; sum[x.cur] = (sum[x.cur] || 0) + Number(x.amt); } });
    const money = Object.keys(sum).sort((a, b) => a === 'PHP' ? -1 : 1).map(c => fmt(sum[c], c)).join(' + ');
    const h = '<div><span>Families due</span><b>' + rows.length + '</b><em>5 or fewer lessons left</em></div>' +
      '<div class="w"><span>Not reminded yet</span><b>' + st.not + '</b><em>copy the reminder below</em></div>' +
      '<div><span>Waiting for a reply</span><b>' + st.wait + '</b><em>' + (st.yes ? st.yes + ' said renewing' : 'reminder sent') + '</em></div>' +
      '<div class="m"><span>Expected if all renew</span><b>' + (money || (need.length ? '…' : '—')) + '</b><em>' + (known ? 'last payment of ' + known + ' of ' + codes.length + ' famil' + (codes.length === 1 ? 'y' : 'ies') : 'no past payment found') + '</em></div>';
    let box = sec.querySelector('.rx27'); if(!box){ box = document.createElement('div'); box.className = 'rx27'; const hd = sec.querySelector('h2'); if(hd) hd.insertAdjacentElement('afterend', box); else sec.prepend(box); }
    if(box.innerHTML !== h) box.innerHTML = h;
  }
  let q = 0; const kick = () => { if(q) return; q = 1; setTimeout(() => { q = 0; try{ paint(); }catch(e){} }, 250); };
  (function hook(){ const v = document.getElementById('v-mtoday'); if(!v) return setTimeout(hook, 800); new MutationObserver(m => { if(m.some(x => !(x.target.closest && x.target.closest('.rx27')))) kick(); }).observe(v, { childList: true, subtree: true }); kick(); })();
})();
</script>
`;
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
