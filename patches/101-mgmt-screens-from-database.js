// 14 Oct pm · Management screens open from the database (Misty: "To do … all these are used actively, make this fast and
// migrate it to Supabase as we are doing now"). Every management screen the server makes is copied to Supabase (docs, within a
// minute · server paste SERVER-MIRROR). The app now shows that copy at once (≈ 0.3 s) and asks Google for the fresh one in the
// background; when the fresh one differs, the screen redraws by itself. Background look-ups (prefetching students, polls) use a
// copy that is under 90 s old (student pages: 20 min) instead of asking Google again, so the server is no longer flooded.
// Right after you save something, screens are read fresh from Google for 2 min (no flicker back to the old copy).
// Off on one device: localStorage coe.fastr = '0'.
require('../tools/lib.js')(process.argv[2], [
["function api(fn, ...args){\nif(!LIVE) return DEMO_API(fn, ...args);\n",
 "const SB_R = /^(mgmt(Overview|Students|Student|Schedule|Teacher|Actions|Active|Renewals|Trials|TrialFus|Reports|ReportsWait|Performance|TeacherCard|PayChecks|PayReady|AvailAll|Health|Night|Msgs|Tab|Database|Payroll|Leave|Peer|Hours|StuClasses|Urls|EnqList|MonDay|VisitCoverage|AgreeMap|Growth|Pulse)|schedLists|moneyLists|dbLists)$/;\n" +
 "const SB_SH = /^mgmt(Health|Night|PayReady|AvailAll|Performance|TeacherCard|Peer|Hours|Trials|Reports|PayChecks|Active|Renewals|Overview|Schedule|Teacher)$/;   /* the same for all management (server SHARED_TTL) */\n" +
 "const SB_BGAGE = { mgmtStudent: 20 * 6e4, mgmtStuClasses: 20 * 6e4, mgmtMsgs: 0, mgmtPulse: 0, mgmtHealth: 0 };\n" +
 "let SB_LASTW = 0; const SB_FRESH = {}, SB_WANT = {}; let SB_T = 0;\n" +
 "function sbOn(){ try{ if(localStorage.getItem('coe.fastr') === '0') return false; }catch(e){} return !!(D && D.mgr && TOKEN); }\n" +
 "function sbKey(fn, args){ return (SB_SH.test(fn) || !D.pres ? 'mgmt' : 'pres') + ':' + fn + '|' + JSON.stringify(args.slice(1)); }\n" +
 "function sbDoc(key){ return new Promise(res => { (SB_WANT[key] = SB_WANT[key] || []).push(res); if(SB_T) return; SB_T = setTimeout(async () => { const W = Object.assign({}, SB_WANT); Object.keys(SB_WANT).forEach(k => delete SB_WANT[k]); SB_T = 0;\n" +
 "  let docs = {}; try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 2500) : 0;\n" +
 "    const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: Object.keys(W) }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid));\n" +
 "    if(r && r.ok) docs = r.docs || {}; }catch(e){}\n" +
 "  Object.keys(W).forEach(k => W[k].forEach(f => f(docs[k] || null))); }, 25); }); }\n" +
 "let SB_RD = 0;\n" +
 "function sbRedraw(fn, args, data){ try{\n" +
 "  if(fn === 'mgmtStudent'){ const code = args[1]; try{ store('set', 'coe.stu.' + code, JSON.stringify(data)); }catch(e){} if(window._stuOpen === code && STU && STU.code === code && $('sheet').classList.contains('on') && $('stuSch')){ STU.r = data; stuRender(); } return; }\n" +
 "  if(fn === 'mgmtStuClasses'){ const code = args[1]; CLSM[code] = data; if(STU && STU.code === code){ STU.cls = data; const el = $('stuSch'); if(el) el.innerHTML = stuSched(data); } return; }\n" +
 "  clearTimeout(SB_RD); SB_RD = setTimeout(() => bg(() => { try{ if(VIEW === 'astudents') loadStudents(); else if(VIEW === 'schedule') loadSchedule(0, true); else { const S = SCREENS[VIEW]; if(S) S[2](true); } }catch(e){} }), 300);\n" +
 "}catch(e){} }\n" +
 "async function sbRead(fn, args, real, ui){\n" +
 "  const key = sbKey(fn, args), f = SB_FRESH[key]; if(f && Date.now() - f.t < 20000) return f.data;\n" +
 "  const age = d => d ? Date.now() - Date.parse(d.at) : Infinity, mx = fn in SB_BGAGE ? SB_BGAGE[fn] : 90000;\n" +
 "  if(!ui){ const d = await sbDoc(key); if(d && age(d) < mx) return d.data; return real(); }\n" +
 "  const rp = real(), d = await Promise.race([sbDoc(key), rp.then(() => null, () => null)]);\n" +
 "  if(!d || age(d) > 6 * 3600e3) return rp;\n" +
 "  rp.then(x => { if(JSON.stringify(x) !== JSON.stringify(d.data)){ SB_FRESH[key] = { data: x, t: Date.now() }; sbRedraw(fn, args, x); } }).catch(() => {});\n" +
 "  return d.data; }\n" +
 "function api(fn, ...args){\nif(!LIVE) return DEMO_API(fn, ...args);\n" +
 "if(!API_READ.test(fn) && !API_BG.test(fn) && !/Seen|Ack|Pulse|Nudge/.test(fn)) SB_LASTW = Date.now();   /* a save: read fresh for 2 min */\n"],
["const k = fn + '|' + JSON.stringify(args); if(API_FLY[k]) return API_FLY[k];\nconst go = () => apiNow(fn, ...args);\n",
 "const k = fn + '|' + JSON.stringify(args); if(API_FLY[k]) return API_FLY[k];\nconst go = () => apiNow(fn, ...args);\n" +
 "if(SB_R.test(fn) && sbOn() && Date.now() - SB_LASTW > 120000){ const ui = Date.now() - (window._ui || 0) < 1500;   /* 14 Oct pm: database copy first */\n" +
 "  const real = () => ui || /^(mgmtOverview|mgmtRenewals|mgmtTrialFus)$/.test(fn) ? go() : new Promise((res, rej) => { API_Q.push(() => go().then(res, rej)); apiPump(); });\n" +
 "  const sp = sbRead(fn, args, real, ui); API_FLY[k] = sp; sp.then(() => delete API_FLY[k], () => delete API_FLY[k]); return sp; }\n"],
]);
