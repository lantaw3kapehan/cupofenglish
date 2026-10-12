// Schedule: the screen redraws only when something on it changed (class status, a reminder due or sent) instead of every minute,
// so the Reminders due box no longer blinks on and off.
require('../tools/lib.js')(process.argv[2], [
[
"if(a && a.id === 'scQ') return; renderSchedule(); remLoad(); }catch(x){} }, 60000);",
"if(a && a.id === 'scQ') return; scRefresh(); remLoad(); }catch(x){} }, 60000);"
],
[
"REM.busy = 0; try{ const v = $('v-schedule'); const a = document.activeElement; if(SC && v && v.offsetParent && !(a && a.id === 'scQ')) renderSchedule(); }catch(x){} }",
"REM.busy = 0; try{ const v = $('v-schedule'); const a = document.activeElement; if(SC && v && v.offsetParent && !(a && a.id === 'scQ')) scRefresh(); }catch(x){} }\n/* Redraw the Schedule only when something on it changed (class status, a reminder due or sent), so the screen does not blink every minute. */\nfunction scSig(){ if(!SC) return ''; const n = Date.now(); return SC.date + '|' + SC.events.map(e => { const s = +new Date(e.start), en = +new Date(e.end), st = scStage(e); return (n >= s - 30 * 6e4 ? 1 : 0) + '' + (n >= s + 2 * 6e4 ? 1 : 0) + (n >= en ? 1 : 0) + (n >= en + 15 * 6e4 ? 1 : 0) + (st || '-') + (st && scSent(e, st) ? 'y' : 'n') + (REM.map[scRemKey(e, '2h')] ? 'a' : '') + (REM.map[scRemKey(e, '10m')] ? 'b' : ''); }).join(','); }\nlet SC_SIG = '';\nfunction scRefresh(){ const g = scSig(); if(g === SC_SIG) return; renderSchedule(); }"
],
[
"function renderSchedule(){\nif(!SC) return;",
"function renderSchedule(){\nif(!SC) return; try{ SC_SIG = scSig(); }catch(x){}"
]
]);
