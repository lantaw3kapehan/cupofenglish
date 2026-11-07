// 1852: (Misty 7 Nov "yes go ahead") the peer reviews on a teacher's Growth page came only from Google's Form copy, so a review
//   answered in the database (e.g. a self-review) would not show. The list now comes from the database (coe-peer given:
//   coe_peer_answers, which holds every review Google's form had, 77 of them, plus every review sent in the app); anything only in
//   Google's copy is kept as well (matched by reviewer, teacher and class date).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  setTimeout(peer1851, 1500); setInterval(peer1851, 120000);\n",
   "  setTimeout(peer1851, 1500); setInterval(peer1851, 120000);\n"
   + "  const TITLES1852 = ['CRITICAL THINKING', 'COMMUNICATION', 'COLLABORATION', 'CREATIVITY', 'PROFESSIONALISM'];\n"
   + "  const k1852 = x => [String(x.evaluator || '').trim().toLowerCase(), String(x.t || x.teacher || '').trim().toLowerCase().replace(/^(teacher|tchr|tr|t)\\b\\.?\\s*/, ''), String(x.date || '')].join('|');\n"
   + "  const b1852 = window.api; if(typeof b1852 === 'function' && !b1852.__1852){\n"
   + "    const w2 = function(fn){ const a = Array.prototype.slice.call(arguments, 1), p = b1852.apply(this, arguments);\n"
   + "      if(fn !== 'tGrowth' && fn !== 'mgmtGrowth') return p;\n"
   + "      const name = fn === 'mgmtGrowth' ? a[1] : '';\n"
   + "      return Promise.all([p, call(name ? { action: 'given', name: name } : { action: 'given' }).catch(() => null)]).then(([g, r]) => {\n"
   + "        try{ if(g && r && r.ok && Array.isArray(r.list)){ const P = g.peer || (g.peer = { titles: [], list: [], visits: [] }); const L = r.list.slice(), seen = {}; L.forEach(x => seen[k1852(x)] = 1);\n"
   + "          (Array.isArray(P.list) ? P.list : []).forEach(x => { if(!seen[k1852(x)]) L.push(x); });\n"
   + "          L.sort((x, y) => String(y.at || '').localeCompare(String(x.at || ''))); P.list = L; if(!(P.titles && P.titles.length)) P.titles = TITLES1852; P.db1852 = true; } }catch(e){}\n"
   + "        return g; }); };\n"
   + "    w2.__1852 = 1; Object.keys(b1852).forEach(k => { try{ w2[k] = b1852[k]; }catch(e){} }); window.api = w2; try{ api = w2; }catch(e){}\n"
   + "  }\n"]]);
