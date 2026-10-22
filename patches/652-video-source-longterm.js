// 652: app/Drive label only where it is known (server sends app:true/false for the last 59 days from 22 Oct); older classes show plain "Video ✓".
require('../tools/lib.js')(process.argv[2], [
[
"if(v && v.url) out.push(v.app ? `<span class=\"chip teal\">Video ✓ · app</span>` : `<span class=\"chip amber\" title=\"Uploaded by the teacher in Drive, not in the app\">Video ✓ · Drive</span>`);",
"if(v && v.url) out.push(v.app === true ? `<span class=\"chip teal\">Video ✓ · app</span>` : v.app === false ? `<span class=\"chip amber\" title=\"Uploaded by the teacher in Drive, not in the app\">Video ✓ · Drive</span>` : `<span class=\"chip teal\">Video ✓</span>`);"
],
[
"${v.app?'Uploaded in the app':'Uploaded by the teacher in Drive (not the app)'}",
"${v.app === true ? 'Uploaded in the app' : v.app === false ? 'Uploaded by the teacher in Drive (not the app)' : 'Video found'}"
]
]);
