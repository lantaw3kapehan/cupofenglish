// 2383 (Misty 18 Nov 18:58: "Celine's access on phone is lagging and loading"). Her phone sent 100–145 requests a minute after opening:
// the management start-up loads (prefetchMgmt) plus the warm-up of up to 30 students' pages (2 requests each) all start within seconds,
// so on a phone connection the screen she is looking at waits behind them, and every reopen starts it again.
// On a phone (narrow screen or phone browser): the background loads wait 12 s (the open screen goes first), the student warm-up waits 25 s,
// takes at most 8 students, and skips entirely on "data saver" / slow 2G–3G. Laptops are unchanged.
const file = process.argv[2];
const inc = `<script id="b2383">
(function(){ if(window.__b2383) return; window.__b2383 = 1;
  const phone = () => { try{ return matchMedia('(max-width: 760px)').matches || /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent); }catch(e){ return false; } };
  const slow = () => { try{ const c = navigator.connection; return !!(c && (c.saveData || /(^|-)2g|3g/.test(String(c.effectiveType || '')))); }catch(e){ return false; } };
  const pf = window.prefetchMgmt; if(typeof pf === 'function'){ let q = 0; const w = function(){ if(!phone()) return pf.apply(this, arguments); if(q) return; q = 1; const a = arguments, s = this; setTimeout(() => pf.apply(s, a), 12000); };
    try{ prefetchMgmt = w; }catch(e){} window.prefetchMgmt = w; }
  const wp = window.warmProfiles; if(typeof wp === 'function'){ let t = 0; const w = function(codes, always){ if(!phone()) return wp.apply(this, arguments); if(slow() || t) return Promise.resolve(); t = 1;
      const c = [...new Set(codes || [])].filter(Boolean).slice(0, 8), al = (always || []).slice(0, 8);
      return new Promise(ok => setTimeout(() => { t = 0; Promise.resolve(wp(c, al)).then(ok, ok); }, 25000)); };
    try{ warmProfiles = w; }catch(e){} window.warmProfiles = w; }
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', inc + '<script id="b2278">']]);
