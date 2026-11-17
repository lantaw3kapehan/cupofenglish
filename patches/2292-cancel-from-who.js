// 2292 (Misty 17 Nov 10:42): she types "- From parent" after every cancel reason so the teacher knows who asked. Now the app adds it
// from the "Who asked for this?" choice: "… · From the parent" / "From the teacher" / "From CupOfEnglish" / "Force majeure".
// A line under the box shows exactly what the teacher will read. If the reason already says "From …", nothing is added.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["    return zh(v) && EN.src === v && EN.en ? one + ' · EN: ' + EN.en.replace(/\\s*\\n+\\s*/g, ' ') : one; };",
  `    const W = { parent: 'From the parent', teacher: 'From the teacher', company: 'From CupOfEnglish', force: 'Force majeure' }[window._ceWho || ''] || '';
    const has = /(^|[\\s\\-–—·(])(from\\s+(the\\s+)?(parent|teacher|student|cupofenglish|school|management)|force majeure)/i.test(v);   /* 2292 */
    const base = zh(v) && EN.src === v && EN.en ? one + ' · EN: ' + EN.en.replace(/\\s*\\n+\\s*/g, ' ') : one;
    return W && !has ? base + ' · ' + W : base; };
  window.cxWhoLine2292 = function(){ try{ const R = document.getElementById('eR'); if(!R) return; let n = document.getElementById('eRWho');
      if(!n){ n = document.createElement('div'); n.id = 'eRWho'; n.className = 'small'; n.style.cssText = 'margin-top:4px;color:#13636B;font-weight:600';
        const after = document.getElementById('eREn') || R; after.parentNode.insertBefore(n, after.nextSibling); }
      const W = { parent: 'From the parent', teacher: 'From the teacher', company: 'From CupOfEnglish', force: 'Force majeure' }[window._ceWho || ''] || '';
      const v = String(R.value || '').trim(), has = /(^|[\\s\\-–—·(])(from\\s+(the\\s+)?(parent|teacher|student|cupofenglish|school|management)|force majeure)/i.test(v);
      n.textContent = W ? (has ? '' : 'Added for the teacher: · ' + W + ' (from "Who asked") — no need to type it') : ''; }catch(e){} };
  { const w0 = window.ceWho; if(typeof w0 === 'function') window.ceWho = function(){ const r = w0.apply(this, arguments); window.cxWhoLine2292(); return r; }; }
  document.addEventListener('input', ev => { if(ev.target && ev.target.id === 'eR') window.cxWhoLine2292(); });`],
]);
