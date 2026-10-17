// 17 Oct · Move/cancel a class: (1) when Google refuses because of the teacher's hours or a clash, the "Not saved" card offers
// "Save anyway" (sends it with the override) instead of a "Try again" that can only fail the same way; (2) the same banner as Add class
// stays until Google answers ("⏳ Moving … " → "✓ Saved in Google Calendar"), so nobody has to refresh or redo it to know.
require('../tools/lib.js')(process.argv[2], [
["toast(action==='cancel' ? 'Cancelled · updating calendar…' : action==='restore' ? 'Restored · updating calendar…' : f.forward ? 'Moving this and the later classes…' : 'Moved · updating calendar…');",
 "const epk = svPill(null, '⏳ ' + (action==='cancel' ? 'Cancelling' : action==='restore' ? 'Restoring' : f.forward ? 'Moving this and the later classes of' : 'Moving') + ' <b>' + esc(before.student || before.title || 'the class') + '</b> in Google Calendar…', 'wait');"],
["try{ const r = await api('editClass', TOKEN, e.id, f); if(!r.ok) throw r; toast(r.note);",
 "try{ const r = await api('editClass', TOKEN, e.id, f); if(!r.ok) throw r; svPill(epk, '✓ <b>Saved in Google Calendar</b>' + (r.note ? ' · ' + esc(r.note) : ''), 'ok'); try{ ding('msg'); }catch(y){}"],
["toast((x&&x.msg)||'Not saved — the calendar was not changed. Try again.');",
 "try{ const q = document.getElementById(epk); if(q) q.remove(); }catch(y){}"],
["window._seRetry = async () => { closeSheet(); toast('Saving again…');",
 "const isC = !!(x && (x.conflict || /save anyway|outside .*hours|clash|already has|overlap/i.test(String(x.msg || '')))); window._seRetry = async (force) => { if(force) f.force = true; closeSheet(); const pk = svPill(null, '⏳ Saving <b>' + esc(before.student || before.title || 'the class') + '</b> in Google Calendar…', 'wait');"],
["toast('✓ ' + (r2.note || 'Saved'));",
 "svPill(pk, '✓ <b>Saved in Google Calendar</b>' + (r2.note ? ' · ' + esc(r2.note) : ''), 'ok'); try{ ding('msg'); }catch(y){}"],
["toast(((z && z.msg) || 'Still not saved') + ' · check your internet and try once more');",
 "svPill(pk, '✕ <b>Still not saved</b> · ' + esc((z && z.msg) || 'check your internet and try once more'), 'bad');"],
["'<button class=\"btn teal block\" style=\"margin-top:12px\" onclick=\"_seRetry()\">Try again</button>'",
 "(isC ? '<button class=\"btn teal block\" style=\"margin-top:12px\" onclick=\"_seRetry(1)\">Save anyway</button><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"closeSheet()\">Keep the old time</button>' : '<button class=\"btn teal block\" style=\"margin-top:12px\" onclick=\"_seRetry()\">Try again</button>')"],
]);
