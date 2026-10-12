// Reminders due box: the student code (ST-…) shows next to the name, as on the WeChat group, so the reminder goes to the right group.
// Tapping the code copies it for WeChat search.
require('../tools/lib.js')(process.argv[2], [
[
"<b>${tm(e.start)}</b> ${esc(e.student || e.title)} <span class=\"small mute\">· ${esc(tName(e.teacher || ''))}</span>",
"<b>${tm(e.start)}</b> ${esc(e.student || e.title)}${e.code ? ` <button type=\"button\" title=\"Copy the student code to find the WeChat group\" style=\"border:1.5px solid #2B2253;background:#fff;color:#2B2253;border-radius:8px;padding:1px 8px;font:700 13px ui-monospace,Menlo,monospace;cursor:pointer;vertical-align:1px\" onclick=\"navigator.clipboard.writeText('${esc(e.code)}').then(()=>toast('${esc(e.code)} copied · paste it in WeChat search to open the right group'))\">${esc(e.code)}</button>` : ''} <span class=\"small mute\">· ${esc(tName(e.teacher || ''))}</span>"
]
]);
