// 2107 (11 Nov 22:07, Misty: Jim and Keke share one package · "their shared notice to paste on WeChat"). The Class notice of a child on a
//   shared package names every child on it and says it is one shared package:
//   "Jim 朱泓政 · ST-2023-013 & Keke 朱泓柯 · ST-2026-077 / Shared package 共享课程包". The schedule and lessons stay as before.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["cnUse(0);\n}catch(e){ openSheet('<h1>Class notice</h1><div class=\"empty\">Could not load '",
   "try{ const g = typeof shGroup === 'function' ? shGroup(code) : null; CN.sib = [];   /* 2107: the other children on a shared package */\n" +
   "  if(g){ const up2 = s => String(s || '').trim().toUpperCase(), seen = {}; seen[up2(code)] = 1; g.G.members.forEach(m => { const cd = up2(m[g.C.code]); if(!cd || seen[cd]) return; seen[cd] = 1; CN.sib.push({ code: cd, name: String(m[g.C.name] || cd).trim(), cn: String(m[g.C.cn] || '').trim() }); }); } }catch(e){}\n" +
   "cnUse(0);\n}catch(e){ openSheet('<h1>Class notice</h1><div class=\"empty\">Could not load '"],
  ["'\\n\\n' + x.name + (x.cn ? ' ' + x.cn : '') + ' · ' + x.code +",
   "'\\n\\n' + x.name + (x.cn ? ' ' + x.cn : '') + ' · ' + x.code + (x.sib && x.sib.length ? x.sib.map(s => '\\n& ' + s.name + (s.cn ? ' ' + s.cn : '') + ' · ' + s.code).join('') + '\\nShared package 共享课程包' : '') +   /* 2107 */"]
]);
