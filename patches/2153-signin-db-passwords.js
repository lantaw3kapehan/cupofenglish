// 2153 (13 Nov, step 2.1 · Misty "go"): passwords set in the app stay in the database (trigger coe_auth_pw_guard), and
// (a) sign-in: when the database said "no" and this person's password was set in the app, the app does NOT ask Google
//     (Google only knows the OLD password); coe-pw › check gives the same message Google would. Other people: Google as before.
// (b) Access off: after Google's mgmtAccessOff, coe-pw › off also removes the app-set password and every database session.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["const r = r0 && r0.ok && r0.token ? r0 : await api('passwordLogin', em, pw, MODE)",
   "let r1 = null; if(r0 && !r0.ok && r0.fallback){ try{ const ac1 = window.AbortController ? new AbortController() : null, t1 = ac1 ? setTimeout(() => ac1.abort(), 4000) : 0; r1 = await fetch(FAST_URL + '-pw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'check', email: em, mode: MODE }), signal: ac1 ? ac1.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(t1)); }catch(e){ r1 = null; } }   /* 2153 */\n  const r = r0 && r0.ok && r0.token ? r0 : r1 && r1.final ? { ok: false, msg: r1.msg } : await api('passwordLogin', em, pw, MODE)"],
  ["if(!r || !r.ok) return toast(r && r.msg || 'Not removed');\n$('sheetBody').innerHTML = `<h1>Access removed",
   "if(!r || !r.ok) return toast(r && r.msg || 'Not removed');\nlet dbOff = null; try{ dbOff = await fetch(FAST_URL + '-pw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'off', token: TOKEN, name: name }) }).then(x => x.json()); }catch(e){ dbOff = null; }   /* 2153 */\n  if(!dbOff || !dbOff.ok) alert('Google removed the access, but the database did not answer.\\n\\nPlease tap Remove access again so the app password is removed too.');\n$('sheetBody').innerHTML = `<h1>Access removed"],
]);
