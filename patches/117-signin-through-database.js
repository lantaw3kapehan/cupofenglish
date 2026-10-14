// 14 Oct night · Step 4 (Misty: "WE CAN DO THIS NOW", 20:26): sign-in is checked by the database first (≈ 0.5 s).
// If the database says no or does not answer within 4 s, the app asks Google exactly as before, so wrong passwords,
// new passwords and everything else behave as today, and nobody can be locked out by the database.
require('../tools/lib.js')(process.argv[2], [
["const r = await api('passwordLogin', em, pw, MODE).catch(()=>({ok:false,msg:'No connection. Check your internet and try again.'})); LG_BUSY = false;",
 "let r0 = null; try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 4000) : 0;\n" +
 "  r0 = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'login', email: em, pw: pw, mode: MODE }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); }catch(e){ r0 = null; }\n" +
 "const r = r0 && r0.ok && r0.token ? r0 : await api('passwordLogin', em, pw, MODE).catch(()=>({ok:false,msg:'No connection. Check your internet and try again.'})); LG_BUSY = false;   /* 14 Oct night: database first, Google decides otherwise */"],
]);
