// 651: management sees how each class video arrived — "Video ✓ · app" or "Video ✓ · Drive" on Schedule, "Uploaded in the app / by the
// teacher in Drive" in the class panel, and "N via app" per teacher in the night check (server: vapp:<day> list, mgmtSchedule vid.app, night_ vapp).
require('../tools/lib.js')(process.argv[2], [
[
"if(v && v.url) out.push(`<span class=\"chip teal\">Video ✓</span>`);",
"if(v && v.url) out.push(v.app ? `<span class=\"chip teal\">Video ✓ · app</span>` : `<span class=\"chip amber\" title=\"Uploaded by the teacher in Drive, not in the app\">Video ✓ · Drive</span>`);"
],
[
"<div class=\"small mute\">${v.by!=='daily'?'Uploaded to Drive'+(v.at?' · '+esc(v.at):''):'Linked in '+esc(new Date(e.start).toLocaleDateString('en-GB',{month:'long'}).toUpperCase())+'-DAILY'}</div>",
"<div class=\"small mute\">${v.app?'Uploaded in the app':'Uploaded by the teacher in Drive (not the app)'}${v.at?' · '+esc(v.at):''}${v.by==='daily'?' · linked in '+esc(new Date(e.start).toLocaleDateString('en-GB',{month:'long'}).toUpperCase())+'-DAILY':''}</div>"
],
[
"· video ${f(x.vid,x.vidNeed)} · homework",
"· video ${f(x.vid,x.vidNeed)}${x.vid ? ` <span style=\"color:${(x.vapp||0) < x.vid ? '#B03A2E' : '#1E7A55'}\">(${x.vapp||0} via app)</span>` : ''} · homework"
]
]);
