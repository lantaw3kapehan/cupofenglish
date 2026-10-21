// 21 Oct · To do "✓ Enrolled" chip: the package as parents know it (30 + 3 lessons), the ACTIVE row only in the tooltip.
require('../tools/lib.js')(process.argv[2], [["      if(P){ const txt = '✓ Enrolled · ' + P.n + ' lessons' + (P.row ? ' · ACTIVE row ' + P.row : '');",
"      if(P){ const PK = { 33: '30 + 3', 68: '60 + 8' }, txt = '✓ Enrolled · ' + (PK[+P.n] || P.n) + ' lessons';   /* 488: no sheet row on the chip; it is in the tooltip */"],
["        if(chip){ chip.textContent = txt; chip.className = 'chip green'; }",
 "        if(chip){ chip.textContent = txt; chip.className = 'chip green'; chip.title = P.row ? 'ACTIVE row ' + P.row : ''; }"]]);
