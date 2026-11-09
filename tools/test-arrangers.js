// 2025 · loop check (9 Nov 2026, after teachers' apps froze: the Today arranger swapped the Christmas card and the hidden
// "Needs your action" box forever). Opens the screens in a headless browser with no network, builds teacher Today in the risky
// states, and counts how often the page rearranges itself for 3 seconds. Anything that keeps moving fails the release.
// Usage: node tools/test-arrangers.js app.html   (returns true when it FAILED, like the other checks)
const path = require('path');
module.exports = async function(file){
  let chromium; try{ ({ chromium } = require('playwright')); }catch(e){ if(process.env.CI){ console.error('Loop check could not run · playwright missing on the release machine'); return true; } console.log('Loop check skipped · playwright not installed'); return false; }
  const browser = await chromium.launch(); let failed = false;
  const shapes = [
    { name: 'card, no actions', urg: false, actions: false, card: true },
    { name: 'card + actions + urgent line', urg: true, actions: true, card: true },
    { name: 'no card, no actions', urg: false, actions: false, card: false },
    { name: 'card + urgent line, no other actions', urg: true, actions: false, card: true },
  ];
  try{
    for(const w of [1366, 390]){
      const page = await browser.newPage({ viewport: { width: w, height: 800 } });
      await page.addInitScript(() => { window.__noStop2025 = true; });   // measure the screens themselves, not the safety stop
      await page.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
      page.on('pageerror', () => {});
      let tripped = []; page.on('console', m => { if(/2025 · a page watcher was paused/.test(m.text())) tripped.push(m.text()); });   // the app's own safety stop fired = a loop
      await page.goto('file://' + path.resolve(file)); await page.waitForTimeout(2500);
      for(const s of shapes){
        const n = await page.evaluate(async (s) => {
          try{ D = { mgr: false, today: '2026-11-09', schedule: [], me: { name: 'Test' }, students: [] }; }catch(e){ window.D = { mgr: false }; }
          try{ VIEW = 'today'; }catch(e){}
          const v = document.getElementById('v-today'); if(!v) return -1; v.classList.remove('hide');
          v.innerHTML = '<div class="lead"><h1>Welcome</h1></div>'
            + (s.urg ? '<button id="urg2001">Urgent</button>' : '')
            + '<section class="nn1104"><h2>Next class</h2></section>'
            + '<section class="td1104"><h2>Needs your action</h2>' + (s.actions ? '<div id="mustBox"><h3>Management is waiting for your fix</h3></div>' : '') + '</section>'
            + (s.card ? '<div class="x21c" id="x21c">Christmas</div>' : '')
            + '<div class="yd92">The day</div><div class="tcols"><div class="tcol-main"><h2>Rest of today</h2></div></div>';
          await new Promise(r => setTimeout(r, 1500));   // let every arranger settle once
          let m = 0; const mo = new MutationObserver(l => { m += l.length; }); mo.observe(v, { childList: true, subtree: true });
          await new Promise(r => setTimeout(r, 3000)); mo.disconnect(); return m; }, s);
        const bad = n > 20 || tripped.length > 0; if(bad) failed = true;
        console.log((bad ? 'LOOP ' : 'ok   ') + w + ' px · ' + s.name + ' · ' + n + ' moves in 3 s' + (tripped.length ? ' · safety stop fired' : ''));
        tripped = [];
      }
      await page.close();
    }
  } finally { await browser.close(); }
  return failed;
};
if(require.main === module) module.exports(process.argv[2] || 'app.html').then(f => process.exit(f ? 1 : 0));
