// 1526 · teacher cards that people waited for show this device's last copy at once (coe_speed 28 Oct: tFbStatus 3–11 s,
//   tMyVisits 3–22 s, tPeerForm 8 s, all after a tap). The normal read (database first, Google when needed) runs behind;
//   the card redraws only if the answer changed. Kept per person on this device under coe.m.q:<name>:… (cleared by the
//   1366 owner check when someone else signs in on the device). Copies older than 3 days are not shown.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(baseApi) window.api = function(fn){ const t0 = performance.now(), ui = Date.now() - (window._ui || 0) < 1500, p = baseApi.apply(this, arguments);",
   "if(baseApi) window.api = function(fn){ const t0 = performance.now(), ui = Date.now() - (window._ui || 0) < 1500 && !(window.__quick && Date.now() - (window.__quick[fn] || 0) < 8000), p = baseApi.apply(this, arguments);   /* 1526: a read answered from the last copy is not a wait */"],
  ["</script>\n<script>\n/* 1525 · background Google cuts",
   "</script>\n<script>\n/* 1526 · teacher cards from this device's last copy, read behind */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1526) return;\n" +
   "  const QUICK = /^(tFbStatus|tMyVisits|tPeerForm)$/, MAX = 3 * 864e5;\n" +
   "  const w = function(fn){ const args = Array.prototype.slice.call(arguments, 1), self = this;\n" +
   "    try{\n" +
   "      if(QUICK.test(fn) && typeof LIVE !== 'undefined' && LIVE && typeof D !== 'undefined' && D && !D.mgr && D.me && D.me.name && typeof sbKey === 'function' && args[0] === TOKEN){\n" +
   "        const lk = 'coe.m.q:' + sbKey(fn, args); let L = null; try{ L = JSON.parse(localStorage.getItem(lk) || 'null'); }catch(e){}\n" +
   "        const quick = !!(L && L.data != null && Date.now() - L.t < MAX); if(quick) (window.__quick = window.__quick || {})[fn] = Date.now();\n" +
   "        const p = Promise.resolve(base.apply(self, [fn].concat(args)));\n" +
   "        p.then(x => { try{ if(x == null || (x && x.ok === false)) return; const s = JSON.stringify(x); if(s.length < 150000) localStorage.setItem(lk, JSON.stringify({ t: Date.now(), data: x }));\n" +
   "          if(L && JSON.stringify(L.data) !== s && typeof sbRedraw === 'function') sbRedraw(fn, args, x); }catch(e){} }, () => {});\n" +
   "        if(quick) return Promise.resolve(L.data);\n" +
   "        return p; }\n" +
   "    }catch(e){}\n" +
   "    return base.apply(this, arguments); };\n" +
   "  w.__1526 = 1; for(const k in base) try{ w[k] = base[k]; }catch(e){} window.api = w;\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1525 · background Google cuts"],
]);
