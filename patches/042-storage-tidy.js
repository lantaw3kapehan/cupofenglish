// Keep the phone's saved data from growing forever (sustainability pass).
// Once a day at start-up: drop saved days older than a week (schedules, monitor marks, reminder ticks, weekly summaries),
// and student profiles / class lists not opened for 30 days (they reload from the server the next time they are opened).
require('../tools/lib.js')(process.argv[2], [
[
"await idbDo('readonly', s => { const c = s.openCursor(); c.onsuccess = () => { const x = c.result; if(x){ MEM[x.key] = x.value; x.continue(); } }; });\n",
"await idbDo('readonly', s => { const c = s.openCursor(); c.onsuccess = () => { const x = c.result; if(x){ MEM[x.key] = x.value; x.continue(); } }; });\ntry{ storeTidy(); }catch(e){ console.warn('tidy', e); }\n"
],
[
"function store(op, k, v){\n",
`/* Storage tidy: runs once a day. LRU stamps (day numbers) for per-student saves live in coe.lru. */
let LRU = null, LRU_T = 0;
function lruTouch(k){ if(!/^coe\\.(cls|stu)\\./.test(k)) return; try{ if(!LRU) LRU = JSON.parse(localStorage.getItem('coe.lru') || '{}'); const d = Math.floor(Date.now() / 864e5); if(LRU[k] === d) return; LRU[k] = d; clearTimeout(LRU_T); LRU_T = setTimeout(() => { try{ localStorage.setItem('coe.lru', JSON.stringify(LRU)); }catch(e){} }, 3000); }catch(e){} }
function storeTidy(){
const day = new Date().toDateString(); if(localStorage.getItem('coe.tidy') === day) return;
const ago = n => { const x = new Date(); x.setDate(x.getDate() - n); return new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); }, t7 = ago(7), t14 = ago(14), t2 = ago(2), fut = ago(-28), now = Math.floor(Date.now() / 864e5);
const lru = JSON.parse(localStorage.getItem('coe.lru') || '{}'), del = [];
Object.keys(MEM).forEach(k => { let m = k.match(/^coe\\.(m\\.sched|m\\.ng|ts\\.week|doc\\.trf)\\.(\\d{4}-\\d{2}-\\d{2})$/); if(m){ if(m[2] < t7 || m[2] > fut) del.push(k); return; }
if(/^coe\\.(cls|stu)\\./.test(k)){ if(!lru[k]) lru[k] = now; else if(now - lru[k] > 30){ del.push(k); delete lru[k]; } } });
Object.keys(lru).forEach(k => { if(!(k in MEM)) delete lru[k]; });
if(del.length){ del.forEach(k => delete MEM[k]); idbDo('readwrite', s => del.forEach(k => s.delete(k))); }
const ls = []; for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i), a = k.match(/^coeRem:(\\d{4}-\\d{2}-\\d{2})/), b = k.match(/^coe\\.(mon|ws)\\.(\\d{4}-\\d{2}-\\d{2})$/); if((a && a[1] < t2) || (b && b[2] < t14)) ls.push(k); }
ls.forEach(k => localStorage.removeItem(k));
LRU = lru; localStorage.setItem('coe.lru', JSON.stringify(lru)); localStorage.setItem('coe.tidy', day);
if(del.length || ls.length) console.log('tidy: removed ' + del.length + ' saved items and ' + ls.length + ' old marks');
}
function store(op, k, v){
`
],
[
"if(op==='set'){ MEM[k] = v; idbDo('readwrite', s => s.put(v, k)); } else {",
"if(op==='set'){ MEM[k] = v; lruTouch(k); idbDo('readwrite', s => s.put(v, k)); } else {"
]
]);
