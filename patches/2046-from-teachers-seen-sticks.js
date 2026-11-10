// 2046 (10 Nov 10:14, Misty: "on Overview, even though it has been marked seen, it still shows, since this has been done"):
//   · "Seen" was kept only in one browser's storage, so another device, a refreshed copy or a cleared cache showed them as new again.
//     It is now also kept in the database for each person (coe-seen), merged on every device.
//   · A notice of unavailability that management already decided (Approved, Declined, Cancelled) is not "new" any more.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 ["function fd1806new(x, s){ return !(s.all && x.at <= s.all) && !(s.o && s.o[x.id]); }",
  "function fd1806new(x, s){ if(x && x.k === 'leave' && /^(Approved|Declined|Cancelled)/i.test(String(x.st || ''))) return false;   /* 2046: already decided */\n  return !(s.all && x.at <= s.all) && !(s.o && s.o[x.id]); }\n" +
  "const SEEN2046 = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-seen';\n" +
  "function fd1806sync(){ try{ if(fd1806sync._at && Date.now() - fd1806sync._at < 60000) return; fd1806sync._at = Date.now();\n" +
  "  fetch(SEEN2046, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'get', box: 'fd1806' }) }).then(r => r.json()).then(j => { if(!j || !j.ok || !j.data) return;\n" +
  "    const a = fd1806seen(), b = j.data, m = { all: [a.all, b.all].filter(Boolean).sort().pop() || '', o: Object.assign({}, b.o || {}, a.o || {}) };\n" +
  "    try{ localStorage.setItem('fd1806', JSON.stringify(m)); }catch(e){} if(JSON.stringify(m) !== JSON.stringify(a)) try{ fd1806paint(); }catch(e){} }).catch(() => {}); }catch(e){} }"],
 ["function fd1806save(s){ try{ localStorage.setItem('fd1806', JSON.stringify(s)); }catch(e){} }",
  "function fd1806save(s){ try{ localStorage.setItem('fd1806', JSON.stringify(s)); }catch(e){}\n  try{ const o = s.o || {}, k = Object.keys(o); if(k.length > 300) k.slice(0, k.length - 300).forEach(x => delete o[x]);   /* 2046: kept in the database too */\n    fetch(SEEN2046, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'set', box: 'fd1806', data: { all: s.all || '', o } }) }).catch(() => {}); }catch(e){} }"],
 ["function fd1806paint(){ const v = $('v-home'); if(!v || !(typeof D !== 'undefined' && D && D.mgr)) return; const L = FD1806.items; if(!L) return;",
  "function fd1806paint(){ const v = $('v-home'); if(!v || !(typeof D !== 'undefined' && D && D.mgr)) return; const L = FD1806.items; if(!L) return; fd1806sync();"]
]);
