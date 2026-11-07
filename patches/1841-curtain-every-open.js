// 1841: (Misty 7 Nov flickering, follow-up to 1840) checked live with Teacher Pam's login after 1840: the loading card never came on
//   when the app was reopened (it only started while the page was still loading, and by the time it checked, loading was over).
//   · The loading card now starts at once whenever someone is signed in (management and teachers), and lifts when the screen is still.
//     If the sign-in has expired and the sign-in page shows, the card lifts at once.
//   · The Teacher Excellence cards on Today are put back in the same moment the screen redraws (they used to come back 60 ms later,
//     so they blinked on every redraw).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  window.__curtain1320 = engage;\n})();\n</script>",
   "  window.__curtain1320 = engage;\n})();\n</script>\n<script>\n/* 1841 · loading card on every open while signed in; never over the sign-in page */\n"
   + "(function(){ try{ if(!localStorage.getItem('coe.token') || !window.__curtain1320) return; document.documentElement.classList.add('cur1320');\n"
   + "  const go = () => { try{ window.__curtain1320(); }catch(e){} }; if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go, { once: true }); else go();\n"
   + "  let n = 0; const t = setInterval(() => { n++; try{ const L = document.getElementById('login'), h = document.documentElement;\n"
   + "    if(!h.classList.contains('cur1320') || n > 150){ clearInterval(t); return; }\n"
   + "    if(L && !L.classList.contains('hide') && getComputedStyle(L).display !== 'none'){ h.classList.remove('cur1320'); const c = document.getElementById('cur1320'); if(c) c.remove(); clearInterval(t); } }catch(e){} }, 100);\n"
   + "}catch(e){} })();\n</script>"],
  ["const _r = window.render; if(_r) window.render = function(){ const x = _r.apply(this, arguments); setTimeout(() => { try{ if(window._KX) kxCommend(window._KX); }catch(e){} }, 60); return x; };",
   "const _r = window.render; if(_r) window.render = function(){ const x = _r.apply(this, arguments); try{ if(window._KX) kxCommend(window._KX); }catch(e){} /* 1841: same moment, no blink */ setTimeout(() => { try{ if(window._KX) kxCommend(window._KX); }catch(e){} }, 60); return x; };"]]);
