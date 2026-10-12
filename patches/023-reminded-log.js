// Class reminders: shared "Reminded" log. Copy logs who + time to the REMINDERS tab (server mgmtRemindLog);
// every management device sees it (chip on the class: "🔔 Early reminder · Celine 15:34") and the Reminders due box hides it.
require('../tools/lib.js')(process.argv[2], [
[
"function scSent(e, st){ try{ return localStorage.getItem(scRemKey(e, st)) === '1'; }catch(x){ return false; } }",
"let REM = { day: '', map: {}, busy: 0 };\nasync function remLoad(){ if(REM.busy) return; REM.busy = 1; try{ const d = ymdLocal(new Date()), r = await api('mgmtReminders', TOKEN, d); if(r && r.ok){ REM.day = d; REM.map = r.rem || {}; } }catch(x){} REM.busy = 0; try{ const v = $('v-schedule'); const a = document.activeElement; if(SC && v && v.offsetParent && !(a && a.id === 'scQ')) renderSchedule(); }catch(x){} }\nfunction scSent(e, st){ if(REM.map[scRemKey(e, st)]) return true; try{ return localStorage.getItem(scRemKey(e, st)) === '1'; }catch(x){ return false; } }\nfunction scRemChips(e){ const c = ['2h', '10m'].map(st => { const r = REM.map[scRemKey(e, st)]; return r ? `<span class=\"chip teal\">🔔 ${st === '10m' ? '10-min' : 'Early'} reminder · ${esc(r.by)} ${esc(r.at)}</span>` : ''; }).filter(Boolean); return c.length ? `<div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:6px\">${c.join('')}</div>` : ''; }"
],
[
"if(!SC || SC_OFF) return ''; const due =",
"if(!SC || SC_OFF) return ''; if(REM.day !== ymdLocal(new Date()) && !REM.busy) setTimeout(remLoad, 0); const due ="
],
[
"</div>${mon}${!e.cancelled && now < new Date(e.end).getTime() ?",
"</div>${mon}${scRemChips(e)}${!e.cancelled && now < new Date(e.end).getTime() ?"
],
[
"const ok = () => { if(st){ try{ localStorage.setItem(scRemKey(e, st), '1'); }catch(x){} }",
"const ok = () => { if(st){ try{ localStorage.setItem(scRemKey(e, st), '1'); }catch(x){} api('mgmtRemindLog', TOKEN, { key: scRemKey(e, st), day: ymdLocal(new Date(e.start)), start: tm(e.start), code: e.code || '', student: e.student || e.title || '', teacher: e.teacher || '', stage: st === '10m' ? '10-minute' : 'Early' }).then(r => { if(r && r.ok){ REM.map = r.rem || REM.map; REM.day = ymdLocal(new Date()); renderSchedule(); } else toast('Copied, but the Reminded log did not save'); }).catch(() => toast('Copied, but the Reminded log did not save')); }"
],
[
"if(a && a.id === 'scQ') return; renderSchedule(); }catch(x){} }, 60000);",
"if(a && a.id === 'scQ') return; renderSchedule(); remLoad(); }catch(x){} }, 60000);"
]
]);
