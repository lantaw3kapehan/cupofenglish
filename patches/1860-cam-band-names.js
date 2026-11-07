// 1860: KET / PET band line read "Band 3 · Band 3 — …"; the band names now say what the band means.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["  const CB = ['Below band 1', 'Band 1', 'Between bands 1 and 3', 'Band 3', 'Between bands 3 and 5', 'Band 5'];",
  "  const CB = ['Below band 1', 'Lower', 'Developing', 'At the level', 'Good', 'Strong'];"]]);
