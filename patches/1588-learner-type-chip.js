// 1588: (Misty 09:26) learner type at a glance: YLE / Teens / Adults on the Students list rows and the student card header.
// · From coeLearner (1580): the trial report's learner type → course → age / grade → student list. Young learner → YLE, Teen → Teens,
//   every adult type → Adults (hover: "Adults · business", where it came from). IELTS course → "… · IELTS". PH learner (Market = Philippines)
//   → a small "PH" mark. Not known → a muted "Type?" (never guessed) and one App health line listing those active students.
// · Drawn before the screen paints (microtask after the list / card is built), in the first line of the row (no new line), own class
//   (not .chip, so no extra icon), fixed height. Nothing is saved.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>",
   `</script>
<style id="css1588">
.lt1588{display:inline-flex;align-items:center;gap:4px;height:20px;padding:0 8px;border-radius:999px;font:600 11px/20px Inter,system-ui,sans-serif;letter-spacing:.02em;white-space:nowrap;flex:none;vertical-align:middle;box-sizing:border-box}
.lt1588.yle{background:#EAF1FC;color:#2B5BA8}.lt1588.teen{background:#E4F4F1;color:#0F6A64}.lt1588.adult{background:#F3ECF9;color:#6A3A92}
.lt1588.unk{background:transparent;color:#8A86A0;box-shadow:inset 0 0 0 1px #E2E0EA;font-weight:500}
.lt1588 .ph{display:inline-block;padding:0 4px;border-radius:4px;background:#fff;color:#00737B;font-size:10px;line-height:14px;box-shadow:inset 0 0 0 1px #BFE6E3}
#sheetBody .shero h1 .lt1588{margin-left:8px;transform:translateY(-2px)}
</style>
<script>
/* 1588 · YLE / Teens / Adults chip */
(function(){
  if(window.__1588 || !window.coeLearner) return; window.__1588 = 1;
  const up = s => String(s || '').trim().toUpperCase(), E = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const dbReady = () => { try{ return !!(typeof DB !== 'undefined' && DB && DB.rows && DB.rows.length); }catch(e){ return false; } };
  window.learnerTag1588 = function(code){ const L = coeLearner(code), ie = L.exam === 'ielts';
    const k = L.kind === 'kid' ? 'yle' : L.kind === 'teen' ? 'teen' : L.kind === 'adult' ? 'adult' : 'unk';
    const t = k === 'yle' ? 'YLE' : k === 'teen' ? 'Teens' : k === 'adult' ? 'Adults' : 'Type?';
    const sub = k === 'adult' && L.goal !== 'daily' ? ' · ' + L.goal : '';
    const title = k === 'unk' ? 'Learner type not known yet: set it on the trial report, or add the age / course on DATABASE' : t + (ie ? ' · IELTS' : sub) + ' · from the ' + (L.from || 'records');
    return { k, html: '<span class="lt1588 ' + k + '" data-lt="' + E(up(code)) + '" title="' + E(title) + '">' + t + (ie && k !== 'unk' ? ' · IELTS' : '') + (L.market === 'ph' ? ' <i class="ph">PH</i>' : '') + '</span>' }; };
  function rows(){ if(!dbReady()) return; document.querySelectorAll('#v-astudents a.li.sa[href^="#student="]').forEach(a => { const code = up(a.getAttribute('href').slice(9)), line = a.querySelector('.grow > .row'); if(!line) return;
      const T = learnerTag1588(code), old = line.querySelector('.lt1588'); if(old && old.outerHTML === T.html) return; if(old) old.outerHTML = T.html; else line.insertAdjacentHTML('beforeend', T.html); }); }
  function card(){ if(!dbReady() || typeof STU === 'undefined' || !STU || !STU.code) return; const h = document.querySelector('#sheetBody .shero h1'); if(!h) return;
    const T = learnerTag1588(STU.code), old = h.querySelector('.lt1588'); if(old && old.outerHTML === T.html) return; if(old) old.outerHTML = T.html; else h.insertAdjacentHTML('beforeend', T.html); }
  let q = 0; const run = () => { if(q) return; q = 1; Promise.resolve().then(() => { q = 0; try{ rows(); }catch(e){} try{ card(); }catch(e){} try{ const s = document.getElementById('sheet'); if(s && s.style.minHeight && !document.getElementById('stuLoad')) s.style.minHeight = ''; }catch(e){} }); };   /* + 1587 follow-up: a failed load does not keep the full-height loading card */   /* microtask: before the frame is painted */
  const ob = id => { const el = document.getElementById(id); if(el) new MutationObserver(run).observe(el, { childList: true, subtree: true }); };
  ob('v-astudents'); ob('sheetBody');
  ['renderAStudents', 'stuRender'].forEach(n => { const f = window[n]; if(typeof f === 'function') window[n] = function(){ const r = f.apply(this, arguments); try{ rows(); card(); }catch(e){} return r; }; });
  const ld = window.loadDb; if(typeof ld === 'function') window.loadDb = function(){ const p = ld.apply(this, arguments); Promise.resolve(p).then(run, run); return p; };
  run();
  /* App health: active students whose learner type is not known */
  const lh = window.loadHealth; if(typeof lh === 'function') window.loadHealth = async function(){ const r = await lh.apply(this, arguments);
    try{ if(dbReady() && Array.isArray(MS) && typeof HL !== 'undefined' && HL){ const U = MS.filter(s => /^ST-/.test(up(s.code)) && coeLearner(s.code).kind === '').map(s => s.name + ' ' + up(s.code));
        HL.issues = (HL.issues || []).filter(s => !/^Learner type /.test(String(s)));
        if(U.length) HL.issues.push('Learner type not known (YLE / Teens / Adults) · ' + U.length + ' student' + (U.length === 1 ? '' : 's') + ': ' + U.slice(0, 15).join(', ') + (U.length > 15 ? ' +' + (U.length - 15) + ' more' : '') + ' · set it on the trial report or add the age / course on DATABASE');
        const b = document.getElementById('hlBox'); if(b && window.hlHtml) b.innerHTML = hlHtml(); } }catch(e){}
    return r; };
})();
</script>
</body>
</html>`]
]);
