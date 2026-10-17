// 17 Oct · Add class: a banner that stays until it is really in Google Calendar ("⏳ Adding … " → "✓ Saved in Google Calendar"), or says plainly that it was not added.
require('../tools/lib.js')(process.argv[2], [
["closeSheet(); toast('Adding ' + (s.name || s.code) + (f.count > 1 ? ' · ' + f.count + ' classes' : '') + '…');",
 "closeSheet(); const pk = svPill(null, '⏳ Adding <b>' + esc(s.name || s.code) + '</b> · ' + esc(svPillWhen(f)) + ' to Google Calendar…', 'wait');"],
["toast('✓ Added · ' + r.note + (r.ref || ''));",
 "svPill(pk, '✓ <b>Saved in Google Calendar</b> · ' + esc(s.name || s.code) + ' · ' + esc(svPillWhen(f)) + (r.note ? '<div class=\"small\" style=\"opacity:.85\">' + esc(r.note + (r.ref || '')) + '</div>' : ''), 'ok'); try{ ding('msg'); }catch(y){}"],
["toast(msg + ' · your details are back in the form');",
 "svPill(pk, '✕ <b>Not added</b> · ' + esc(msg) + '<div class=\"small\" style=\"opacity:.85\">Nothing was saved · your details are back in the form</div>', 'bad');"],
]);
