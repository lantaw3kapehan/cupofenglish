// 2526 (Misty 15:37 "these are issues… so she could correct them early on… and the same problem won't happen again once corrected"):
//   Operations' Ops Desk gets "Lesson summaries not safe to share": every active student's summary is built in the background with the same check
//   as 2524 (completed + remaining = package total · the months add up to the total · the total = completed · nothing counted in a month still to come).
//   Each one leaves the list by itself once it agrees (a correction is kept and applied every time, so it stays fixed).
//   Also 2524: an "Earlier records" row counts toward the months.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(/^Other-teacher/.test(first)){ sum += v; return; }", "if(/^(Other-teacher|Earlier records)/.test(first)){ sum += v; return; }"],
  ['<script id="b2278">', `<style id="s2526">
#ns2526{background:#fff;border:1.5px solid #F0D29A;border-radius:16px;padding:14px 16px}
#ns2526.ok{border:1px solid #B9DEC2;background:#F3FAF5}
#ns2526 h3{margin:0 0 4px;font-size:17px;color:#2B2253}#ns2526 .s{font-size:13px;color:#6B6884}
#ns2526 .q{display:flex;gap:12px;align-items:center;padding:9px 0;border-top:1px solid #F0EEF5;flex-wrap:wrap}
#ns2526 .q:first-of-type{border-top:0}#ns2526 .q b{color:#2B2253}#ns2526 .q .w{flex:1;min-width:220px;font-size:13.5px;color:#6B4400}
</style>
<script id="b2526">
(function(){
  const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const nn = s => { const v = parseFloat(String(s).replace(/[^\\d.\\-]/g, '')); return isFinite(v) ? v : NaN; }, r1 = x => Math.round(x * 10) / 10, far = (a, b) => Math.abs(a - b) > 0.05;
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let CACHE = null, AT0 = null, T0 = 0;
  function one(code){ let h = ''; try{ h = lsHtml(code) || ''; }catch(x){ return null; } if(!h) return null;
    const div = document.createElement('div'); div.innerHTML = h; const txt = div.textContent.replace(/\\s+/g, ' ');
    const hold = txt.match(/Numbers don.t agree yet: [^.]*?now/); if(hold) return [hold[0].replace(/^Numbers don.t agree yet: /, '')];
    const sm = txt.match(/completed ([\\d.]+) of ([\\d.]+) lessons.*?with ([\\d.]+) lessons? remaining/); if(!sm) return null;
    const X = +sm[1], Y = +sm[2], Z = +sm[3], now = new Date(Date.now() + 8 * 3600e3), cur = now.getUTCFullYear() * 12 + now.getUTCMonth(); let sum = 0, total = NaN; const fut = [];
    div.querySelectorAll('tr').forEach(tr => { const c = [...tr.cells]; if(c.length < 2) return; const f = c[0].textContent.trim(), nums = c.slice(1).map(x => nn(x.textContent)).filter(x => !isNaN(x)); if(!nums.length) return;
      const v = nums.length > 1 ? nums[nums.length - 1] : nums[0];
      if(/^Total/.test(f)) total = v; else if(/^(Other-teacher|Earlier records)/.test(f)) sum += v;
      else { const m = f.match(new RegExp('^(' + MN.join('|') + ')[\\\\s\\\\S]*?(\\\\d{4})')); if(m){ sum += v; if(+m[2] * 12 + MN.indexOf(m[1]) > cur && v > 0) fut.push(m[1] + ' ' + m[2]); } } });
    const p = [];
    if(far(X + Z, Y)) p.push(r1(X) + ' completed + ' + r1(Z) + ' remaining = ' + r1(X + Z) + ', but the package total is ' + r1(Y));
    if(!isNaN(total) && far(sum, total)) p.push('the months add up to ' + r1(sum) + ', but the Total says ' + r1(total));
    if(!isNaN(total) && far(total, X)) p.push('the Total is ' + r1(total) + ', but completed says ' + r1(X));
    if(fut.length) p.push('lessons counted in ' + fut.join(', ') + ', which has not come yet');
    return p; }
  window.scan2526 = function(force){ try{ if(typeof AT === 'undefined' || !AT || !AT.cols || typeof lsHtml !== 'function') return CACHE;
      if(!force && CACHE && AT0 === AT && Date.now() - T0 < 120000) return CACHE;
      const C = {}; AT.cols.forEach((c, i) => C[c] = i); const seen = {}, L = [];
      AT.rows.forEach(r => { const code = String(r[C.code] || '').toUpperCase(); if(!r[C.active] || r[C.enrolled] === '' || seen[code]) return; seen[code] = 1;
        const p = one(code); if(p && p.length) L.push({ code, name: r[C.name] || code, why: p }); });
      CACHE = { L, n: Object.keys(seen).length, at: new Date() }; AT0 = AT; T0 = Date.now(); return CACHE; }catch(x){ console.warn('2526', x); return CACHE; } };
  function paint(){ try{ if(!(typeof D !== 'undefined' && D && D.mgr)) return; const od = document.getElementById('od2341'); if(!od) return;
      const S = window.scan2526(false); if(!S) return; let c = document.getElementById('ns2526');
      const h = S.L.length ? '<h3>Lesson summaries not safe to share · ' + S.L.length + '</h3><div class="s">Fix these before a parent asks. Each one leaves this list by itself once the numbers agree.</div>'
          + S.L.map(x => '<div class="q"><b>' + e(x.name) + ' <span class="s">' + e(x.code) + '</span></b><span class="w">' + e(x.why.join(' · ')) + '</span><button class="btn sm" type="button" onclick="shSummary(\\'' + e(x.code) + '\\')">Open</button></div>').join('')
        : '<h3 style="font-size:15px">Lesson summaries · all ' + S.n + ' agree</h3><div class="s">Checked ' + String(S.at.getHours()).padStart(2, '0') + ':' + String(S.at.getMinutes()).padStart(2, '0') + ' · safe to share</div>';
      if(!c){ c = document.createElement('div'); c.id = 'ns2526'; od.insertBefore(c, od.children[1] || null); }
      c.className = S.L.length ? '' : 'ok'; if(c.dataset.h !== h){ c.innerHTML = h; c.dataset.h = h; } }catch(x){ console.warn('2526', x); } }
  setInterval(() => { if(!document.hidden) paint(); }, 4000);
  const lf = window.lf2456; if(typeof lf === 'function') window.lf2456 = async function(){ const r = await lf.apply(this, arguments); setTimeout(() => { window.scan2526(true); paint(); }, 1500); return r; };
})();
</script>
<script id="b2278">`]
]);
