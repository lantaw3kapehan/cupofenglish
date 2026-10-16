// 16 Oct · Teacher Today: calmer class cards (book chip by the name, one action row with the book's unit, short one-line tasks).
const inc = require('fs').readFileSync(require('path').join(__dirname, '253-today-cards-calm.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
[
"<div class=\"grow\"><div class=\"row\" style=\"gap:8px\"><span class=\"nm ell\" ${c.code?`style=\"cursor:pointer\" onpointerdown=\"stuPre('${esc(c.code)}')\" onclick=\"openStudent('${esc(c.code)}')\"`:''}>${esc(c.student || c.title)}${c.code?' <span class=\"mute\" style=\"font-size:13px\">›</span>':''}</span>${typ}</div>",
"<div class=\"grow\"><div class=\"row\" style=\"gap:8px\"><span class=\"nm ell\" ${c.code?`style=\"cursor:pointer\" onpointerdown=\"stuPre('${esc(c.code)}')\" onclick=\"openStudent('${esc(c.code)}')\"`:''}>${esc(c.student || c.title)}${c.code?' <span class=\"mute\" style=\"font-size:13px\">›</span>':''}</span>${!D.mgr && c.code && !c.cancelled && (c.book || s.book) ? `<span class=\"bkchip\" style=\"--c:${bookCol(c.book || s.book)}\" onclick=\"bookSheet('${esc(c.code)}','${esc(c.id)}')\" title=\"Course book\">${esc(String(c.book || s.book).replace(/\\s*,\\s*/g, ' · '))}</span>` : ''}${typ}</div>"
],
[
"<div class=\"small mute ell\">${esc([c.code, c.book || s.book].filter(Boolean).join(' · ') || c.title)}${c.meet?` · <a class=\"link\" onclick=\"copyId('${esc(c.meet)}')\">${esc(c.meet)}</a>`:''}${!D.mgr && c.code && !c.cancelled && window.bkCard ? bkCard(c, s) : ''}${!D.mgr && c.code && !c.cancelled ? ` · <a class=\"link\" onclick=\"meetSheet('${esc(c.id)}')\">${c.meet?'Edit ID':'+ Meeting ID'}</a>` : ''}</div>",
"<div class=\"small mute ell\">${esc((D.mgr ? [c.code, c.book || s.book] : [c.code]).filter(Boolean).join(' · ') || c.title)}${c.meet?` · <a class=\"link\" onclick=\"copyId('${esc(c.meet)}')\">${esc(c.meet)}</a>`:''}${!D.mgr && c.code && !c.cancelled ? ` · <a class=\"link\" onclick=\"meetSheet('${esc(c.id)}')\">${c.meet?'Edit ID':'+ Meeting ID'}</a>` : ''}</div>"
],
[
"${c.cancelled ? (c.why ? `<div class=\"cxw\">Why cancelled: ${cxWhy(c.why)}</div>` : `<div class=\"cxw\" style=\"opacity:.75;font-style:italic\">No reason given</div>`) : ''}${n?`<div class=\"note\">Last: <b>${esc(n.ended)}</b>${n.next?` · Next: ${esc(n.next)}`:''}</div>`:''}",
"${c.cancelled ? (c.why ? `<div class=\"cxw\">Why cancelled: ${cxWhy(c.why)}</div>` : `<div class=\"cxw\" style=\"opacity:.75;font-style:italic\">No reason given</div>`) : ''}${n?`<div class=\"note\">Last class: <b>${esc(n.ended)}</b>${n.next && !(/^continue( from)?/i.test(n.next) && String(n.next).toLowerCase().replace(/[^a-z0-9]/g,'').indexOf(String(n.ended).toLowerCase().replace(/[^a-z0-9]/g,'')) > -1) ? ` · Next: ${esc(n.next)}` : ''}</div>`:''}"
],
[
"${!c.cancelled && c.code ? `<button class=\"btn sm\" style=\"margin-top:8px\" onpointerdown=\"stuPre('${esc(c.code)}')\" onclick=\"classBrief('${esc(c.id)}')\">Class brief</button><button class=\"btn ghost sm\" style=\"margin:8px 0 0 6px\" onclick=\"noteSheet('${esc(c.code)}','${esc(c.id)}','${c.day}')\">Class note</button>`:''}",
"<div class=\"cact\">${!c.cancelled && c.code ? `<button class=\"btn sm\" style=\"margin-top:8px\" onpointerdown=\"stuPre('${esc(c.code)}')\" onclick=\"classBrief('${esc(c.id)}')\">Class brief</button><button class=\"btn ghost sm\" style=\"margin:8px 0 0 6px\" onclick=\"noteSheet('${esc(c.code)}','${esc(c.id)}','${c.day}')\">Class note</button>${!D.mgr && window.bkBtn ? bkBtn(c, s) : ''}`:''}"
],
[
"${!c.cancelled && c.type==='Trial' ? `<button class=\"btn ${now && now > st ? 'teal' : 'ghost'} sm\" style=\"margin:8px 0 0 6px\" onclick=\"trialSheet(${trQ({code:c.code,student:c.student||c.title,date:c.day,time:tm(c.start)})})\">Trial report</button>`:''}${inBtn}${hwH}${vidH}",
"${!c.cancelled && c.type==='Trial' ? `<button class=\"btn ${now && now > st ? 'teal' : 'ghost'} sm\" style=\"margin:8px 0 0 6px\" onclick=\"trialSheet(${trQ({code:c.code,student:c.student||c.title,date:c.day,time:tm(c.start)})})\">Trial report</button>`:''}${inBtn}</div>${hwH}${vidH}"
],
[
"<div class=\"grow\"><b>Class note not saved yet</b><div class=\"small mute\">What you noticed today · tap to write it · it helps you write the monthly feedback</div></div><div class=\"hb\"><button class=\"btn teal sm\">Add note</button></div>",
"<div class=\"grow ell\"><b>Add today's class note</b> <span class=\"mute\">· what you noticed · it becomes your monthly feedback</span></div><div class=\"hb\"><button class=\"btn teal sm\">Add note</button></div>"
],
[
"<div class=\"grow\"><b>Upload the class video</b><div class=\"small mute\">",
"<div class=\"grow ell\"><b>Upload the class video</b> <span class=\"mute\">· "
]
].concat([["Into ${esc(c.student||c.code)}'s folder (name it like ", "name it "], [") · it shows here within 10 minutes</div></div>", "</span></div>"]], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]));
