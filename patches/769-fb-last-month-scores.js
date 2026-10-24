// 769: (Misty) monthly feedback scoring · "will they see last month's score to compare? more convenient".
// · Every 1–5 line shows last month's score on its button (a small "last" mark under it), and a ▲ / ▼ / = beside the line once rated.
// · Each skill heading already says "Last month 21 / 25"; it now also says who rated it if it was another teacher.
// · "Start from last month's scores" (one tap) fills every line with last month's score, so the teacher only changes what is different.
// · Sending with every line exactly as last month asks once: "Nothing changed since last month?"
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 769 · last month's scores on the feedback form */
(function(){
  if(typeof fbPaint !== 'function' || window.__769) return; window.__769 = 1;
  const css = document.createElement('style'); css.textContent = '.fbpick button.lm{position:relative;border-color:#F2B544;box-shadow:inset 0 0 0 1px #F2B544}.fbpick button.lm:after{content:"last";position:absolute;left:50%;bottom:-13px;transform:translateX(-50%);font-size:9px;font-weight:800;color:#A86A00;letter-spacing:.02em}'
    + '.fbrow{padding-bottom:6px}.fb-dl{font-size:11px;font-weight:800;margin-left:6px}.fb-lm{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#FFF8E8;border:1px solid #F2DDA8;border-radius:12px;padding:9px 12px;margin-top:12px;font-size:13px}'
    + '.fb-lm button{border:0;background:#A86A00;color:#fff;border-radius:99px;padding:6px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}';
  document.head.appendChild(css);
  const L = () => (typeof FBF !== 'undefined' && FBF && FBF.last && Array.isArray(FBF.last.items)) ? FBF.last : null;
  const lm = (gi, ri) => { const l = L(); return l && l.items[gi] ? +l.items[gi][ri] || 0 : 0; };
  function dl(gi, ri){ const a = lm(gi, ri), v = FBS && FBS.scores[gi] ? FBS.scores[gi][ri] : 0; if(!a || !v) return ''; const d = v - a;
    return d > 0 ? '<span class="fb-dl" style="color:#1E7A55">▲ +' + d + '</span>' : d < 0 ? '<span class="fb-dl" style="color:#C0392B">▼ ' + d + '</span>' : '<span class="fb-dl" style="color:#A86A00">= same</span>'; }
  function marks(){ const l = L(); if(!l || !FBF.form) return;
    FBF.form.grids.forEach((g, gi) => g.rows.forEach((r, ri) => { const box = $('fbp' + gi + '_' + ri); if(!box) return; const a = lm(gi, ri);
      box.querySelectorAll('button').forEach((b, k) => b.classList.toggle('lm', a === k + 1));
      const row = box.closest('.fbrow'), nm = row && row.querySelector('b'); if(nm){ let s2 = row.querySelector('.fb-dlw'); if(!s2){ nm.insertAdjacentHTML('afterend', '<span class="fb-dlw"></span>'); s2 = row.querySelector('.fb-dlw'); } s2.innerHTML = dl(gi, ri); } })); }
  const _paint = window.fbPaint;
  window.fbPaint = function(){ const r = _paint.apply(this, arguments);
    try{ const l = L(), b = $('sheetBody'); if(l && b){ marks();
        const first = b.querySelector('section.fbsk'); if(first && !b.querySelector('.fb-lm')){ const who = l.teacher && l.teacher !== ((D.me || {}).name) ? ' · rated by ' + esc(tName(l.teacher)) : '';
          first.insertAdjacentHTML('beforebegin', '<div class="fb-lm"><span class="grow">📊 <b>Last month: ' + (l.total || '?') + ' / 100</b>' + esc(/^\d{4}-\d{2}$/.test(String(l.month || '')) ? ' · ' + new Date(l.month + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) + ' feedback' : '') + who + ' · the yellow ring on each line is last month\'s score</span><button type="button" onclick="fbUseLast()">Start from last month\'s scores</button></div>'); } } }catch(e){ console.warn('769', e); }
    return r; };
  const _set = window.fbSet;
  window.fbSet = function(gi, ri, v){ const r = _set.apply(this, arguments); try{ marks(); }catch(e){} return r; };
  window.fbUseLast = function(){ const l = L(); if(!l) return; const has = FBS.scores.some(rw => rw.some(x => x));
    if(has && !confirm('Replace the scores you already chose with last month\'s?')) return;
    FBF.form.grids.forEach((g, gi) => g.rows.forEach((x, ri) => { const a = lm(gi, ri); if(a) FBS.scores[gi][ri] = a; }));
    try{ fbSave(); }catch(e){} fbPaint(); toast('Last month\'s scores filled in · change the lines that are different now'); };
  const _send = window.fbSend;
  window.fbSend = function(){ try{ const l = L(); if(l && !FBS._ok769){ let all = true, any = false; FBF.form.grids.forEach((g, gi) => g.rows.forEach((x, ri) => { const a = lm(gi, ri); if(!a) return; any = true; if(FBS.scores[gi][ri] !== a) all = false; }));
        if(any && all){ if(!confirm('Every score is exactly the same as last month.\n\nNothing changed at all for ' + (FBF.student || 'this student') + '?\nOK = send as it is · Cancel = let me check')) return; FBS._ok769 = 1; } } }catch(e){}
    return _send.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
