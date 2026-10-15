// 15 Oct · Schedule: a move / cancel that did not reach Google Calendar is said clearly (Misty moved Jun to 17:30 but it
// stayed at 16:00: the save failed while Google was overloaded and only a short toast said so). Now a card stays on
// screen: "Not saved · Jun is still at 16:00 Thu 15 Oct · the calendar was not changed" with Try again.
// (With SERVER-CALNOW the database's copy of the day is updated in the same save, so a saved move shows at once.)
require('../tools/lib.js')(process.argv[2], [
["paint(); toast((x&&x.msg)||'Not saved — the calendar was not changed. Try again.'); }",
 "paint(); toast((x&&x.msg)||'Not saved — the calendar was not changed. Try again.');\n" +
 "  try{ window._seRetry = async () => { closeSheet(); toast('Saving again…'); try{ const r2 = await api('editClass', TOKEN, e.id, f); if(!r2 || !r2.ok) throw r2; toast('✓ ' + (r2.note || 'Saved')); Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); if(code){ delete CLSM[code]; openStudent(code); } else loadSchedule(0, true); }catch(z){ toast(((z && z.msg) || 'Still not saved') + ' · check your internet and try once more'); } }; const nm = esc(before.student || before.title || 'This class'), when = esc(svDate(ymdLocal(new Date(before.start)), { weekday: 'short', day: 'numeric', month: 'short' })) + ' ' + esc(tm(before.start));\n" +
 "    setTimeout(() => openSheet('<h1>Not saved</h1><div class=\"fbfix\" style=\"margin-top:10px;border-left:4px solid #C0392B\"><b style=\"color:#B23A22\">' + nm + ' is still at ' + when + '</b><div class=\"small\">' + esc((x && x.msg) || 'Google did not answer in time · the calendar was not changed.') + '</div></div>' +\n" +
 "      (action === 'move' ? '<div class=\"small mute\" style=\"margin-top:8px\">You wanted: ' + esc(f.date) + ' ' + esc(f.time) + (f.teacher ? ' · Teacher ' + esc(f.teacher) : '') + '</div>' : '') + '<button class=\"btn teal block\" style=\"margin-top:12px\" onclick=\"_seRetry()\">Try again</button>'), 400); }catch(y){} }"],
]);
