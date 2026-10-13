// App audit (13 Oct): fewer server calls from management screens, quiet updates for everyone, long saves that don't give up too early,
// and the phone's save queue never drops anything silently. Pairs with the server changes in AUDIT-2026-10-13 (ridRun_ / STALE_OK / warm-up).
require('../tools/lib.js')(process.argv[2], [
// A1 · Overview refreshes every 10 minutes (was 2), and the 13-second health check at most every 30 minutes unless pulled down.
["if(!force && Date.now() - HM_AT < 90000) return; HM_AT = Date.now();",
 "if(!force && Date.now() - HM_AT < 540000) return; HM_AT = Date.now();   /* audit 13 Oct: was 90 s */"],
["bg(() => { loadMgmt(true); loadHealth(); loadReady();",
 "bg(() => { loadMgmt(true); if(force || Date.now() - (window._hlAt || 0) > 30 * 60000){ window._hlAt = Date.now(); loadHealth(); } loadReady();"],
["setInterval(() => { if(D && D.mgr && VIEW === 'home' && !document.hidden) hmLoad(); }, 120000);",
 "setInterval(() => { if(D && D.mgr && VIEW === 'home' && !document.hidden) hmLoad(); }, 600000);   /* audit 13 Oct: was 2 min; the live feed already refreshes what changed */"],
// A2 · Schedule screen re-reads the day every 5 minutes (was 2); schedule changes still arrive at once through the live feed.
["setInterval(() => { if(D && D.mgr && VIEW === 'schedule' && !document.hidden && SC) loadSchedule(0, true); }, 120000);",
 "setInterval(() => { if(D && D.mgr && VIEW === 'schedule' && !document.hidden && SC) loadSchedule(0, true); }, 300000);"],
// A3 · Students (management): prepare only the students with a class today or tomorrow (was every student, two calls each).
["if(!window._wpM){ window._wpM = 1; setTimeout(() => warmProfiles((MS||[]).map(s => s.code)), 4000); }",
 "if(!window._wpM){ window._wpM = 1; setTimeout(() => { const d0 = ymdLocal(new Date()), d1 = ymdLocal(new Date(Date.now() + 864e5)); Promise.all([d0, d1].map(k => schedGet(k).catch(() => null))).then(L => { const codes = []; L.forEach(v => ((v && v.events) || []).forEach(e => { if(e.code && !e.cancelled && codes.indexOf(e.code) < 0) codes.push(e.code); })); if(codes.length) warmProfiles(codes.slice(0, 30)); }).catch(() => 0); }, 4000); }   /* audit 13 Oct */"],
// B · Updates wait until after 22:00 for management too (16:00–22:00 is class time).
["if(typeof D === 'undefined' || !D || D.mgr || performance.now() < 15000) return false;",
 "if(typeof D === 'undefined' || !D || performance.now() < 15000) return false;   /* audit 13 Oct: management too */"],
// D · Class moves, new classes and enrolments can take minutes on Google: wait up to 4 minutes, and never call a dropped connection "not saved".
["let r; try{ r = await apiOnce(fn, args, safe ? 45000 : 0, rid); net = false; }",
 "let r; try{ r = await apiOnce(fn, args, safe ? (/^(editClass|addClass|mgmtEnrolPaid|mgmtRenewPaid|classCheck)$/.test(fn) ? 240000 : 45000) : 0, rid); net = false; }"],
["throw last || new Error('Weak signal · not saved'); };",
 "throw net && /^(editClass|addClass|mgmtEnrolPaid|mgmtRenewPaid)$/.test(fn) ? new Error('Connection dropped · it may still have saved. Refresh before trying again.') : (last || new Error('Weak signal · not saved')); };"],
// F · Saved-on-phone items are never dropped: after 5 refusals they are retried every 10 minutes and the person is told once per open.
["q.push({ fn: fn, args: args, rid: rid, at: Date.now(), n: 0 }); return put(q.slice(-30)); };",
 "q.push({ fn: fn, args: args, rid: rid, at: Date.now(), n: 0 }); return put(q.slice(-60)); };"],
["for(const it of q){ try{ const a = (it.args || []).slice();",
 "for(const it of q){ if((it.n || 0) >= 5 && Date.now() - (it.last || 0) < 10 * 60000){ left.push(it); continue; } it.last = Date.now(); try{ const a = (it.args || []).slice();"],
["it.n = (it.n || 0) + 1; if(it.n < 5) left.push(it); }",
 "it.n = (it.n || 0) + 1; it.err = String((r && (r.error || r.msg)) || '').slice(0, 120); left.push(it); }"],
["put(left); busy = 0; if(sent){",
 "put(left); busy = 0; { const bad = left.filter(x => (x.n || 0) >= 5); if(bad.length && !window._wqWarn){ window._wqWarn = 1; try{ toast('⚠ ' + bad.length + ' item' + (bad.length === 1 ? '' : 's') + ' saved on this phone could not be sent yet' + (bad[0].err ? ' (' + bad[0].err + ')' : '') + '. Please tell Ops.'); }catch(e){} } } if(sent){"]
]);
