// 1862: (Misty 7 Nov "we can do all now") · Schedule › + Class › Book / course: KET and PET are always quick-pick buttons (a KET / PET
//   trial opens the Cambridge assessment). · Teachers' assessment screen: "‹ All" reads "‹ Back" (it goes back to Today).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["    const all = Object.keys(name).sort((a, b) => name[a].localeCompare(name[b]));\n    return { mine: mine.slice(0, 4), top, all, name }; }",
   "    ['KET', 'PET'].forEach(b => { const k = K(b); if(!k) return; name[k] = name[k] || b; if(mine.indexOf(k) < 0 && top.indexOf(k) < 0) top.push(k); });   /* 1862 */\n    const all = Object.keys(name).sort((a, b) => name[a].localeCompare(name[b]));\n    return { mine: mine.slice(0, 4), top, all, name }; }"],
  ["'<div class=\"as-h\"><button class=\"btn ghost sm\" onclick=\"as1778.back()\">‹ All</button>",
   "'<div class=\"as-h\"><button class=\"btn ghost sm\" onclick=\"as1778.back()\">' + (typeof D !== 'undefined' && D && !D.mgr ? '‹ Back' : '‹ All') + '</button>"]]);
