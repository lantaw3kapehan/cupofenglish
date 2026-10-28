// 1467 · President QA follow-up (D12, keyboard). Shared shell, all roles.
//   · Tab walked header → the whole screen → the sidebar (the menu came last, no way to jump). Now:
//     a "Skip to main content" button is the first stop (visible only when focused), and the sidebar / bottom bar comes right after
//     the header in Tab order (its markup moves before <main>; it is position:fixed, so nothing on screen moves).
//   · When a screen repaints (Overview refreshes, lists re-render), the focused button was replaced and keyboard focus fell to the
//     page body. Now focus goes back to the same control in the new markup (same id, or same action and label), without scrolling.
//     Only when focus was really lost (nothing else has focus after a repaint); any mouse or touch press clears it, so a click is never overridden.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</main>\n\n<nav><div class=\"in\" id=\"navIn\"></div></nav>\n</section>", "</main>\n</section>"],
  ["<main class=\"wrap\">",
   "<nav><div class=\"in\" id=\"navIn\"></div></nav>\n<main class=\"wrap\" id=\"main1467\">"],
  ["<section id=\"app\" class=\"hide\">",
   "<button type=\"button\" class=\"skip1467\" style=\"position:fixed;left:12px;top:-80px;z-index:100001\" onclick=\"var m = document.getElementById('main1467'); if(!m) return; m.setAttribute('tabindex', '-1'); m.addEventListener('blur', function(){ m.removeAttribute('tabindex'); }, { once: true }); try{ m.focus({ preventScroll: false }); }catch(e){}\">Skip to main content</button>\n<section id=\"app\" class=\"hide\">"],
  ["</body>\n</html>",
   "<style id=\"css1467\">.skip1467{position:fixed;left:12px;top:-80px;z-index:100001;padding:10px 16px;border-radius:10px;border:0;background:#2f2752;color:#fff;font:600 15px Inter,system-ui,sans-serif;cursor:pointer}.skip1467:focus{top:12px!important;outline:3px solid #00A3AD;outline-offset:2px}#main1467:focus{outline:none}</style>\n" +
   "<script>\n/* 1467 · keyboard focus survives a repaint of the screen */\n(function(){\n" +
   "  if(window.__1467) return; window.__1467 = 1;\n" +
   "  var last = null;\n" +
   "  document.addEventListener('focusin', function(e){ var t = e.target; if(!t || !t.closest) return; var v = t.closest('#main1467 > [id^=\"v-\"]');\n" +
   "    last = v ? { el: t, view: v.id, id: t.id, tag: t.tagName, oc: t.getAttribute('onclick'), tx: (t.textContent || '').trim().slice(0, 60) } : null; }, true);\n" +
   "  document.addEventListener('pointerdown', function(){ last = null; }, true);   /* a click decides focus itself */\n" +
   "  function vis(x){ return !!(x && x.isConnected && (x.offsetParent || x.getClientRects().length)); }\n" +
   "  function back(){ var L = last; if(!L) return; var a = document.activeElement; if(a && a !== document.body && a !== document.documentElement){ if(a !== L.el) last = null; return; }\n" +
   "    var v = document.getElementById(L.view); if(!v || v.classList.contains('hide')) return; var c = vis(L.el) ? L.el : (L.id ? document.getElementById(L.id) : null);\n" +
   "    if(!c){ var C = [].slice.call(v.querySelectorAll(L.tag)); c = C.find(function(x){ return x.getAttribute('onclick') === L.oc && (x.textContent || '').trim().slice(0, 60) === L.tx; })\n" +
   "      || (L.oc ? C.find(function(x){ return x.getAttribute('onclick') === L.oc; }) : null) || (L.tx ? C.find(function(x){ return (x.textContent || '').trim().slice(0, 60) === L.tx; }) : null); }\n" +
   "    if(vis(c)){ try{ c.focus({ preventScroll: true }); }catch(e){} } }\n" +
   "  function hook(){ var m = document.getElementById('main1467'); if(!m) return setTimeout(hook, 1000); new MutationObserver(back).observe(m, { childList: true, subtree: true }); }\n" +
   "  hook();\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
