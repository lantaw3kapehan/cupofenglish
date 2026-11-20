// 2529 (Misty 15:54 "it comes in and off · not stable"): the Ops Desk redraws itself every 20 s and took the "not safe to share" list with it
//   until the next 4-second check put it back. The list now sits right after the Ops Desk (not inside it) and is put back at once if the
//   To do screen is redrawn; it is only redrawn when its own content changes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(!c){ c = document.createElement('div'); c.id = 'ns2526'; od.insertBefore(c, od.children[1] || null); }",
   "if(!c){ c = document.createElement('div'); c.id = 'ns2526'; }\n      if(c.parentElement !== od.parentElement || c.previousElementSibling !== od) od.after(c);\n      if(!window.__mo2529 && od.parentElement){ window.__mo2529 = new MutationObserver(() => { const o = document.getElementById('od2341'), n = document.getElementById('ns2526'); if(o && !n && window.__ns2529){ o.after(window.__ns2529); } else if(o && n && n.previousElementSibling !== o){ o.after(n); } }); window.__mo2529.observe(od.parentElement, { childList: true }); }\n      window.__ns2529 = c;"],
  ["#ns2526{background:#fff;border:1.5px solid #F0D29A;border-radius:16px;padding:14px 16px}",
   "#ns2526{background:#fff;border:1.5px solid #F0D29A;border-radius:16px;padding:14px 16px;margin:12px 0}"]
]);
