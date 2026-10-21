// 21 Oct · Teacher Today redraw loop: when the class-reminder list could not load, Today asked again and redrew immediately, again and again (flicker + server calls).
require('../tools/lib.js')(process.argv[2], [
["async function tRemLoad(){ if(!D || D.mgr || REM.busy) return; REM.busy = 1; try{ const d = ymdLocal(new Date()), r = await api('tReminders', TOKEN, d); if(r && r.ok){ REM.day = d; REM.map = r.rem || {}; } }catch(x){} REM.busy = 0; }",
 "async function tRemLoad(){ if(!D || D.mgr || REM.busy) return false; REM.busy = 1; REM.tried = Date.now(); let ok = false; try{ const d = ymdLocal(new Date()), r = await api('tReminders', TOKEN, d); if(r && r.ok){ REM.day = d; REM.map = r.rem || {}; ok = true; } }catch(x){} REM.busy = 0; return ok; }   /* 498: reports success; REM.tried paces retries */"],
["if(REM.day !== ymdLocal(new Date()) && !REM.busy) setTimeout(() => tRemLoad().then(() => { if(VIEW === 'today') renderToday(); }), 0);",
 "if(REM.day !== ymdLocal(new Date()) && !REM.busy && Date.now() - (REM.tried || 0) > 120000) setTimeout(() => tRemLoad().then(ok => { if(ok && VIEW === 'today') renderToday(); }), 0);   /* 498: at most one try every 2 minutes, redraw only when it loaded (was: a redraw loop when it failed) */"]
]);
