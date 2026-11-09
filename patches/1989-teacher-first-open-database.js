// 1989: (found 9 Nov while checking Pam's screens) A teacher's first open after signing in (nothing saved on the device yet) waited for
//   Google's start data: 32.6 s for Pam today. It now asks the database: who is signed in (op ping, about 0.2 s), then her home screen
//   (docs '<name>:getBootstrap|[]', worked out from the tables, about 0.4 s). Google only if the database has no answer.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["async function reload(force){",
   "async function fastBoot1989(){ try{ if(typeof D !== 'undefined' && D) return null; if(typeof FAST_URL === 'undefined' || !TOKEN) return null;   /* 1989: first open of a teacher from the database */\n  const post = b => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 5000) : 0; return fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };\n  const p = await post({ op: 'ping' }); if(!p || !p.ok || !p.name || p.mode === 'mgmt') return null;\n  const k = String(p.name).trim().toLowerCase() + ':getBootstrap|[]', r = await post({ op: 'docs', keys: [k] }); const d = r && r.ok && r.docs && r.docs[k] && r.docs[k].data;\n  return d && d.me && d.me.name && !d.mgr ? d : null; }catch(e){ return null; } }\nasync function reload(force){"],
  ["(window.__bootSkip1609 = 0, await api('getBootstrap', TOKEN))", "(window.__bootSkip1609 = 0, (await fastBoot1989()) || await api('getBootstrap', TOKEN))"],
]);
