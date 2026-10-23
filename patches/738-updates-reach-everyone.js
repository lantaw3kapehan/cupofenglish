// 738: (Misty) "teachers still use the old version". Updates were held back while a teacher was within 5 minutes of a class — with classes
// back to back that is the whole evening — and the installed app showed the saved copy first. Now:
//  · held back only while a class is actually running (1 min before start → end), not the 5-minute buffers;
//  · when an update is waiting, a small "New version ready · Update" pill shows at the bottom — one tap, never forced mid-task;
//  · every device now reports its version, and Online now (header) marks anyone on an old version.
//  (index.html, the frame: on opening, waits up to 2.5 s for the newest screens before showing the saved copy — edited directly.)
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("v: +(window.COE_V || 0) || null }", "v: (typeof COE_V !== 'undefined' ? COE_V : null) }");
rep("now >= new Date(c.start).getTime() - 5 * 6e4 && now <= new Date(c.end).getTime() + 5 * 6e4); }catch(e){ return false; } }",
    "now >= new Date(c.start).getTime() - 6e4 && now <= new Date(c.end).getTime()); }catch(e){ return false; } }   /* 738: only while the class is running */");
rep("function applyUpdate(){ if(newerSaved() || window._updNet){ if(busy() || updQuiet()) window._upd = 1; else location.reload(); } }",
    "function applyUpdate(){ if(newerSaved() || window._updNet){ if(busy() || updQuiet()){ window._upd = 1; updBanner(); } else location.reload(); } }\n"
  + "function updBanner(){ try{ if(document.getElementById('updBn')) return; const b = document.createElement('div'); b.id = 'updBn';\n"
  + "  b.style.cssText = 'position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:9999;display:flex;gap:10px;align-items:center;background:#2B2253;color:#fff;border-radius:999px;padding:8px 8px 8px 16px;font-size:13.5px;box-shadow:0 10px 30px -10px rgba(43,34,83,.6)';\n"
  + "  b.innerHTML = '<span>✨ New version ready</span><button type=\"button\" style=\"border:0;border-radius:999px;background:#3CC8C0;color:#10302F;font:inherit;font-weight:700;padding:6px 14px;cursor:pointer\">Update</button><button type=\"button\" aria-label=\"Later\" style=\"border:0;background:none;color:#fff;opacity:.7;font:inherit;cursor:pointer;padding:4px 6px\">✕</button>';\n"
  + "  b.children[1].onclick = () => location.reload(); b.children[2].onclick = () => b.remove(); document.body.appendChild(b); }catch(e){} }");
rep("(p.on ? p.rows.filter(on).map(x => devL(x.dev) + (x.view ? ' · ' + e(VN[x.view] || x.view) : '') + ' · since ' + hm(x.since)).join(' &nbsp;|&nbsp; ') : 'Last seen ' + hm(r.at) + ' · ' + devL(r.dev))",
    "(p.on ? p.rows.filter(on).map(x => devL(x.dev) + (x.view ? ' · ' + e(VN[x.view] || x.view) : '') + ' · since ' + hm(x.since) + vTag(x.v)).join(' &nbsp;|&nbsp; ') : 'Last seen ' + hm(r.at) + ' · ' + devL(r.dev) + vTag(r.v))");
rep("  window.onlOpen = function(keep){", "  const vTag = v => !v || v < COE_V ? ' · <b style=\"color:#B4532F\">old version' + (v ? ' ' + v : '') + '</b>' : ' · <span style=\"color:#2E9E6F\">up to date</span>';\n  window.onlOpen = function(keep){");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
