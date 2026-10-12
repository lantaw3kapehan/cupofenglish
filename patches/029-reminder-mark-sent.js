// Reminders due box: "✓ Sent" per class and "✓ Mark all sent" clear reminders already sent in WeChat (logged as "marked sent" with who + time).
require('../tools/lib.js')(process.argv[2], [
[
"<button class=\"btn sm teal\" onclick=\"scRemind(${i},1)\">Copy</button></div>`; }).join('') + `</div>`;",
"<button class=\"btn sm ghost\" title=\"Already sent in WeChat · clear it\" onclick=\"scRemDone([${i}])\">✓ Sent</button><button class=\"btn sm teal\" onclick=\"scRemind(${i},1)\">Copy</button></div>`; }).join('') + (due.length > 1 ? `<div style=\"text-align:right;margin-top:10px\"><button class=\"btn sm ghost\" onclick=\"if(confirm('Mark all ${due.length} as sent? Use this when they were already reminded in WeChat.'))scRemDone([${due.map(e => SC.events.indexOf(e)).join(',')}])\">✓ Mark all ${due.length} sent</button></div>` : '') + `</div>`;"
],
[
"function scRemindText(e){\n",
"async function scRemDone(ix){\nconst L = ix.map(i => SC.events[i]).filter(Boolean).map(e => ({ e, st: scStage(e) })).filter(x => x.st); if(!L.length) return;\nL.forEach(x => { try{ localStorage.setItem(scRemKey(x.e, x.st), '1'); }catch(y){} }); renderSchedule();\nlet bad = 0; for(const x of L){ try{ const r = await api('mgmtRemindLog', TOKEN, { key: scRemKey(x.e, x.st), day: ymdLocal(new Date(x.e.start)), start: tm(x.e.start), code: x.e.code || '', student: x.e.student || x.e.title || '', teacher: x.e.teacher || '', stage: (x.st === '10m' ? '10-min' : 'Early') + ' · marked sent' }); if(r && r.ok){ REM.map = r.rem || REM.map; REM.day = ymdLocal(new Date()); } else bad++; }catch(y){ bad++; } }\nrenderSchedule(); toast(bad ? bad + ' not saved · try again' : (L.length > 1 ? L.length + ' reminders' : 'Reminder') + ' marked sent');\n}\nfunction scRemindText(e){\n"
]
]);
