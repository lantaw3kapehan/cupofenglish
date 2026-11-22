// 2660 (Misty 22 Nov 09:49 "opening / logging in on the app is a bit slow today?" · 09:53 "do it now, ensure this improves our use")
//   When a screen had no database copy yet (or an old one), the app asked Google, which this morning took 33 s – 5 min
//   (a teacher's start-up, My visits, Schedule day list). Now it asks the database first (coe op "fresh", ~1 s) and only
//   uses Google if the database cannot answer within 8 s. Teachers: their own start-up, My visits, comments, leave, feedback list;
//   management: Schedule day list (Monitor), Payroll, Leave, Actions.
require('../tools/lib.js')(process.argv[2], [
  ["const go = () => apiNow(fn, ...args);",
   "const go = () => (typeof window.fresh2660 === 'function' && FRESH2660.test(fn)) ? window.fresh2660(fn, args).then(x => x !== undefined ? x : apiNow(fn, ...args), () => apiNow(fn, ...args)) : apiNow(fn, ...args);   /* 2660 */"],
  ["function api(fn, ...args){",
   "const FRESH2660 = /^(getBootstrap|tMyVisits|tMyComments|tLeave|tFbStatus|mgmtMonDay|mgmtPayroll|mgmtLeave|mgmtActions)$/;\nwindow.fresh2660 = async function(fn, args){ try{\n  if(typeof D === 'undefined' || !D || typeof TOKEN === 'undefined' || !TOKEN) return undefined;\n  const T = /^(getBootstrap|t[A-Z])/.test(fn); if(T === !!D.mgr) return undefined;   /* teachers: their screens · management: theirs */\n  const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 8000) : 0, t0 = performance.now();\n  const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'fresh', token: TOKEN, fn: fn, args: args.slice(1), scope: D.pres ? 'pres' : 'mgmt' }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid));\n  const d = r && r.ok && r.data; if(!d || d.ok === false || d.error || (fn === 'getBootstrap' && !d.me)) return undefined;\n  try{ (window.__fr2660 = window.__fr2660 || []).push({ fn: fn, ms: Math.round(performance.now() - t0) }); }catch(e){}\n  return d; }catch(e){ return undefined; } };\nfunction api(fn, ...args){"],
]);
