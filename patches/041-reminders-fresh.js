// Schedule reminders: never show a "due" list built from an old sent-list. If the sent-list is older than 2 minutes
// (e.g. coming back to Schedule after someone else reminded on another phone), show "Checking…" and refresh first,
// so already-sent reminders no longer flash on and off.
require('../tools/lib.js')(process.argv[2], [
[
"let REM = { day: '', map: {}, busy: 0 };",
"let REM = { day: '', map: {}, busy: 0, ts: 0 };\nfunction remFresh(){ return REM.day === ymdLocal(new Date()) && Date.now() - REM.ts < 12e4; }"
],
[
"r = await api('mgmtReminders', TOKEN, d); if(r && r.ok){ REM.day = d; REM.map = r.rem || {}; }",
"r = await api('mgmtReminders', TOKEN, d); if(r && r.ok){ REM.day = d; REM.map = r.rem || {}; REM.ts = Date.now(); }"
],
[
"REM.ts = Date.now(); } }catch(x){} REM.busy = 0;",
"REM.ts = Date.now(); } else if(REM.day === d) REM.ts = Date.now(); }catch(x){ if(REM.day === ymdLocal(new Date())) REM.ts = Date.now(); } REM.busy = 0;"
],
[
"function scSig(){ if(!SC) return ''; const n = Date.now(); return SC.date + '|' +",
"function scSig(){ if(!SC) return ''; const n = Date.now(); return (remFresh() ? 'F' : 'S') + SC.date + '|' +"
],
[
"if(!SC || SC_OFF) return ''; if(REM.day !== ymdLocal(new Date()) && !REM.busy) setTimeout(remLoad, 0);",
"if(!SC || SC_OFF) return ''; if(!remFresh()){ if(!REM.busy) setTimeout(remLoad, 0); return SC.events.some(e => scStage(e)) ? '<div class=\"small mute\" style=\"margin-top:10px\">🔔 Checking which reminders were already sent…</div>' : ''; }"
],
[
"if(r && r.ok){ REM.map = r.rem || REM.map; REM.day = ymdLocal(new Date()); } else bad++;",
"if(r && r.ok){ REM.map = r.rem || REM.map; REM.day = ymdLocal(new Date()); REM.ts = Date.now(); } else bad++;"
]
]);
