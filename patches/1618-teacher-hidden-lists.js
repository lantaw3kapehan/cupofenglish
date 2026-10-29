// 1618 · teachers: the Students list and Pay are drawn when they are opened, not on every refresh of Today.
//   Teachers' long-frame numbers (1617, 18:25–19:20): the longest frames came right after a save or a refresh answer
//   (0.6–2.3 s on April's, Dezza's and Julia's laptops). Each one redrew Today, the Students list and Pay together, although
//   only Today was on screen. Preview at 4x slower CPU: Students list 380–630 ms, Today 200–450 ms, Pay 10–50 ms.
//   Now, in teacher mode, a redraw of Students or Pay while another screen is showing only marks it "to draw"; it is drawn
//   just before it is shown (before the screen appears, so nothing changes in front of her). Management is unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1618 · teacher Students list and Pay drawn when opened */\n(function(){\n" +
   "  if(window.__1618) return; window.__1618 = 1;\n" +
   "  const isT = () => { try{ return typeof D !== 'undefined' && D && !D.mgr && !!D.me; }catch(e){ return false; } };\n" +
   "  const MAP = { renderStudents: 'students', renderPay: 'pay' }, DIRTY = {}, F = {}; let now = 0;\n" +
   "  Object.keys(MAP).forEach(n => { const f = window[n]; if(typeof f !== 'function') return; const v = MAP[n]; F[v] = n;\n" +
   "    const w = function(){ try{ if(!now && isT() && typeof VIEW !== 'undefined' && VIEW !== v && !document.querySelector('#sheet.on #v-' + v)){ DIRTY[v] = 1; return; } }catch(e){}\n" +
   "      delete DIRTY[v]; return f.apply(this, arguments); };\n" +
   "    for(const k in f) try{ w[k] = f[k]; }catch(e){} window[n] = w; });\n" +
   "  const g0 = window.go; if(typeof g0 === 'function') window.go = function(v){\n" +
   "    try{ if(DIRTY[v] && F[v] && isT()){ now = 1; try{ window[F[v]](); }finally{ now = 0; } } }catch(e){}\n" +
   "    return g0.apply(this, arguments); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
