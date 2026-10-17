// 17 Oct · Misty: a late time-in can't be "fixed", so it shouldn't nag all week. In the teacher's To do (and "Management is waiting"),
// an item that is only lateness (Late time-in, late video/homework "after 23:59") leaves the list once the teacher opens it (My growth).
// Things that can still be done (missing note, video, homework, proof) stay until done. My growth keeps the full 7-day record.
require('../tools/lib.js')(process.argv[2], [
["const fx = D.fix || [];\nif(fx.length) todo.push(`<div class=\"li\" onclick=\"go('growth')\">",
 "const fxLate = i => /^Late|late|after 23|after/i.test(String(i)), fxKey = x => [x.d, x.at, x.code || x.student].join('|');\n" +
 "let fxSeen = {}; try{ fxSeen = JSON.parse(store('get', 'coe.fixSeen') || '{}') || {}; }catch(e){}\n" +
 "window.fxSeenAll = () => { try{ const S = {}; Object.keys(fxSeen).forEach(k => { if(Date.now() - fxSeen[k] < 10 * 864e5) S[k] = fxSeen[k]; }); (D.fix || []).forEach(x => { if((x.items || []).every(fxLate)) S[fxKey(x)] = Date.now(); }); store('set', 'coe.fixSeen', JSON.stringify(S)); }catch(e){} };\n" +
 "const fx = (D.fix || []).filter(x => !((x.items || []).length && (x.items || []).every(fxLate) && fxSeen[fxKey(x)]));\n" +
 "if(fx.length) todo.push(`<div class=\"li\" onclick=\"fxSeenAll();go('growth')\">"],
]);
