// 16 Oct · Misty: reminders Celine already sent still showed as due on her Schedule. The list of sent reminders came from
// Google's copy (refreshed slowly); it now comes from the database copy of REMINDERS (sent within seconds of the tap), Google as fallback.
require('../tools/lib.js')(process.argv[2], [
["async function remLoad(){ if(REM.busy) return; REM.busy = 1; try{ const d = ymdLocal(new Date()), r = await api('mgmtReminders', TOKEN, d);",
 "async function remLoad(){ if(REM.busy) return; REM.busy = 1; try{ const d = ymdLocal(new Date()); let r = null; try{ const x = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'calc', token: TOKEN, fn: 'tReminders', args: [d] }) }).then(z => z.json()); if(x && x.ok && x.data && x.data.ok && x.data.rem) r = x.data; }catch(z){} if(!r) r = await api('mgmtReminders', TOKEN, d);"],
]);
