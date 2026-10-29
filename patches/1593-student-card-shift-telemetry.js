// 1593: (Misty 11:19, "opening a student still flickers and adjusts" on her laptop) live measurement of the student card.
// For 10 s after a student page is opened (management only), every layout shift inside the card is recorded with its source (short label:
// the element's id or first class, and its section), its size and the time since open; plus one summary row (total, kept copy or not,
// number of content changes, whether this device's storage accepts writes). Sent once per open as a few rows to coe_speed via coe-notice
// "speed": fn "cls:student", view = "<source>|<shift × 10000>" (30 characters), ms = time since open. Nothing is shown; nothing else changes.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["</body>\n</html>",
   `<script>
/* 1593 · student card shift recorder */
(function(){
  if(window.__1593 || typeof window.openStudent !== 'function' || typeof PerformanceObserver === 'undefined') return; window.__1593 = 1;
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-notice';
  let run = null;
  const lab = n => { try{ if(!n || n.nodeType !== 1) return '?'; const own = n.id || (String(n.className && n.className.baseVal != null ? n.className.baseVal : n.className || '').trim().split(/\\s+/)[0]) || n.tagName.toLowerCase();
      const sec = n.closest && n.closest('#sheetBody > [id], #sheetBody > section, .shero, .stu-bar, .stu-tabs'); const s = sec && sec !== n ? (sec.id || String(sec.className).split(' ')[0]) : '';
      return (s && s !== own ? s + '>' : '') + own; }catch(e){ return '?'; } };
  const storeOk = () => { try{ localStorage.setItem('coe.t1593', '1'); localStorage.removeItem('coe.t1593'); return 1; }catch(e){ return 0; } };
  new PerformanceObserver(l => { if(!run) return; l.getEntries().forEach(e => { if(e.hadRecentInput || !run) return; const t = performance.now() - run.t0; if(t > 10000) return;
      const sb = document.getElementById('sheet'); const S = (e.sources || []).filter(x => x.node && sb && sb.contains(x.node)); if(!S.length) return;
      run.cls += e.value; run.sh.push([Math.round(t), e.value, S.slice(0, 2).map(x => lab(x.node)).join('+')]); }); }).observe({ type: 'layout-shift', buffered: false });
  function send(R){ try{ if(typeof TOKEN === 'undefined' || !TOKEN || !(typeof D !== 'undefined' && D && D.mgr)) return;
      const v = typeof COE_V !== 'undefined' ? COE_V : 0, dev = (innerWidth || 0) < 900 ? 'phone' : 'laptop', at = new Date().toISOString();
      const rows = [{ fn: 'cls:student', ms: 10000, ui: false, view: ('TOTAL ' + (R.kept ? 'k' : 'n') + ' m' + R.mut + ' s' + R.st + '|' + Math.round(R.cls * 1e4)).slice(0, 30), v, dev, at }]
        .concat(R.sh.sort((a, b) => b[1] - a[1]).slice(0, 8).map(x => ({ fn: 'cls:student', ms: x[0], ui: false, view: (String(x[2]).slice(0, 22) + '|' + Math.round(x[1] * 1e4)).slice(0, 30), v, dev, at })));
      fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'speed', rows }), keepalive: true }).catch(() => {}); }catch(e){} }
  const o0 = window.openStudent;
  window.openStudent = function(code){ try{ if(typeof D !== 'undefined' && D && D.mgr){ if(run && run.mo) run.mo.disconnect(); clearTimeout(run && run.tm);
        let kept = false; try{ kept = !!localStorage.getItem('coe.stu.' + code); }catch(e){}
        const R = run = { t0: performance.now(), cls: 0, sh: [], mut: 0, kept, st: storeOk(), code };
        const sbd = document.getElementById('sheetBody'); let q = 0; R.mo = new MutationObserver(() => { if(q) return; q = 1; requestAnimationFrame(() => { q = 0; R.mut++; }); }); if(sbd) R.mo.observe(sbd, { childList: true, subtree: true, characterData: true });
        R.tm = setTimeout(() => { try{ R.mo.disconnect(); }catch(e){} if(run === R){ run = null; send(R); } }, 10000); } }catch(e){}
    return o0.apply(this, arguments); };
})();
</script>
</body>
</html>`]
]);
