// 2432 · fix for 2425: teachers only receive approved topics (without a status field), so the Today card stayed hidden for them.
const file = process.argv[2];
const s = require('fs').readFileSync(file, 'utf8');
const A = "function teacherCard(){ var A = (T.topics || []).filter(function(t){ return t.status === 'approved'; });";
require('../tools/lib.js')(file, [[A, "function teacherCard(){ var A = (T.topics || []).filter(function(t){ return t.status !== 'draft' && t.status !== 'retired'; });"]]);
