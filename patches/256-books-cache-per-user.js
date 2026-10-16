// 16 Oct · Books lists kept per signed-in person (a shared laptop showed Kat's books on Teacher Misty).
const fs = require('fs'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('/* 16 Oct · 244 · Course books, three places'), z = s.indexOf('</script>', a);
if (a < 0 || z < 0) { console.error('244 block not found'); process.exit(1); }
const blk = s.slice(a, z); let nb = blk;
const rep = (x, y, n) => { const c = nb.split(x).length - 1; if (c !== n) { console.error('expected ' + n + ', found ' + c + ': ' + x); process.exit(1); } nb = nb.split(x).join(y); };
rep("'coe.bk2.' + k", "'coe.bk2.' + bkU() + '.' + k", 2);
rep("'coe.bklib2'", "'coe.bklib2.' + bkU()", 2);
rep("async function loadBooks(){", "async function loadBooks(){ if(window._bkWho !== bkU()){ LIB = null; window._bkOthers = 0; window._bkWho = bkU(); }", 1);
rep("const BK = {}, BKF = {};", "const BK = {}, BKF = {}; window.bkU = () => String((D && D.me && D.me.name) || (D && D.mgr ? 'mgmt' : '') || '').toLowerCase().replace(/[^a-z0-9]/g, '');\n  const bkU0 = { u: null }; const bkFresh = () => { const u = bkU(); if(bkU0.u !== u){ Object.keys(BK).forEach(k => delete BK[k]); bkU0.u = u; } };", 1);
rep("const cached = k => { if(BK[k]) return BK[k];", "const cached = k => { bkFresh(); if(BK[k]) return BK[k];", 1);
require('../tools/lib.js')(file, [[blk, nb]]);
