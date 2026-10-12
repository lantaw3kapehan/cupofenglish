// Schedule: WeChat class reminders for the parents' group (English + Chinese).
// Every reminder carries the class's Tencent Meeting ID (recurring meeting, also in the parent's Tencent Meeting history).
// Two reminders per class: ~2 hours before ("Heads up! Class starts at 18:30 today") and ~10 minutes before ("starts in N minutes").
// A "Reminders due" box at the top of today's Schedule fills in by itself (checked every minute); Copy marks it sent on this device.
// Every upcoming class card also has a "Remind" button (wording follows the time left; tomorrow / later dates too).
require('../tools/lib.js')(process.argv[2], [
["</div>${mon}</div></div>`; };",
 "</div>${mon}${!e.cancelled && now < new Date(e.end).getTime() ? `<button class=\"cxbtn\" onclick=\"event.stopPropagation();scRemind(${SC.events.indexOf(e)})\">🔔 Remind · copy message</button>` : ''}</div></div>`; };"],
["${bookKey()}<div class=\"fl\"><span class=\"lbl\">Teacher</span>",
 "${scDueBox()}${bookKey()}<div class=\"fl\"><span class=\"lbl\">Teacher</span>"],
["function renderSchedule(){\n",
 "function scStage(e){ if(!e || e.cancelled) return ''; const m = (new Date(e.start) - Date.now()) / 6e4; if(ymdLocal(new Date(e.start)) !== ymdLocal(new Date())) return ''; return m > 20 && m <= 150 ? '2h' : m > -5 && m <= 20 ? '10m' : ''; }\n" +
 "function scRemKey(e, st){ return 'coeRem:' + ymdLocal(new Date(e.start)) + ':' + e.start + ':' + (e.code || e.student || e.title) + ':' + st; }\n" +
 "function scSent(e, st){ try{ return localStorage.getItem(scRemKey(e, st)) === '1'; }catch(x){ return false; } }\n" +
 "function scDueBox(){\n" +
 "if(!SC || SC_OFF) return ''; const due = SC.events.filter(e => { const st = scStage(e); return st && !scSent(e, st); }).sort((a, b) => a.start.localeCompare(b.start));\n" +
 "const sent = SC.events.filter(e => { const st = scStage(e); return st && scSent(e, st); }).length;\n" +
 "if(!due.length) return sent ? `<div class=\"small mute\" style=\"margin-top:10px\">🔔 Reminders due: all sent ✓ (${sent})</div>` : '';\n" +
 "return `<div class=\"card\" style=\"margin-top:12px;border:1.5px solid #00A3AD\"><b>🔔 Reminders due · ${due.length}</b><div class=\"small mute\">Copy, then paste in the class WeChat group (type @ to tag the teacher and parent)${sent ? ' · ' + sent + ' sent' : ''}</div>` +\n" +
 "due.map(e => { const st = scStage(e), i = SC.events.indexOf(e); return `<div class=\"row\" style=\"gap:8px;margin-top:8px;align-items:center\"><div class=\"grow\"><b>${tm(e.start)}</b> ${esc(e.student || e.title)} <span class=\"small mute\">· ${esc(tName(e.teacher || ''))}</span><div class=\"small\" style=\"color:${st === '10m' ? '#C0392B' : '#00737B'}\">${st === '10m' ? '10-minute reminder' : '2-hour reminder'}</div></div><button class=\"btn sm teal\" onclick=\"scRemind(${i},1)\">Copy</button></div>`; }).join('') + `</div>`;\n" +
 "}\n" +
 "function scRemindText(e){\n" +
 "const s = new Date(e.start), n = Date.now(), t = tm(e.start), mins = Math.round((s - n) / 6e4), today = ymdLocal(s) === ymdLocal(new Date()), tmw = ymdLocal(s) === ymdLocal(new Date(n + 864e5));\n" +
 "const md = (s.getMonth() + 1) + '月' + s.getDate() + '日', vo = e.meet ? '\\n\\nTencent Meeting ID 腾讯会议号: ' + e.meet + '\\n(Same meeting every class · 每次上课都是同一个会议号，也可以在腾讯会议的历史记录里找到哦)' : '';\n" +
 "if(today && mins <= 0) return 'Class has started (' + t + '). Teacher ' + tName(e.teacher || '') + ' is waiting for you! 🙂\\n已经开始上课啦（' + t + '），老师在等你哦！' + vo;\n" +
 "if(today && mins <= 20) return 'Class starts in ' + mins + ' minute' + (mins === 1 ? '' : 's') + ' (' + t + ')! Please get ready ✊\\n还有' + mins + '分钟上课（' + t + '），请准备好哦！' + vo;\n" +
 "if(today) return 'Heads up! Class starts at ' + t + ' today! ✊\\n提醒：今天' + t + '上课哦！' + vo;\n" +
 "if(tmw) return 'Reminder: class tomorrow at ' + t + '! ✊\\n提醒：明天' + t + '上课哦！' + vo;\n" +
 "return 'Reminder: class on ' + s.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' }) + ' at ' + t + '! ✊\\n提醒：' + md + ' ' + t + '上课哦！' + vo;\n" +
 "}\n" +
 "function scRemind(i, fromBox){\n" +
 "const e = SC.events[i]; if(!e) return; const msg = scRemindText(e), who = 'Teacher ' + tName(e.teacher || ''), st = scStage(e);\n" +
 "const show = () => openSheet('<h1>Reminder</h1><p class=\"small\" style=\"white-space:pre-line\">' + esc(msg) + '</p>');\n" +
 "const ok = () => { if(st){ try{ localStorage.setItem(scRemKey(e, st), '1'); }catch(x){} } toast('Copied · in the WeChat group type @ to tag ' + who + ' and the parent, then paste'); if(st) renderSchedule(); };\n" +
 "try{ navigator.clipboard.writeText(msg).then(ok, show); }catch(x){ show(); }\n" +
 "}\n" +
 "setInterval(() => { try{ const v = $('v-schedule'); if(!SC || SC_OFF || !v || !v.offsetParent) return; const a = document.activeElement; if(a && a.id === 'scQ') return; renderSchedule(); }catch(x){} }, 60000);\n" +
 "function renderSchedule(){\n"]
]);
