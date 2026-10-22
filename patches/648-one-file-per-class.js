// 648: (Misty) one file per class — "+ Add part" removed from the class card and the saved pill (server also refuses a second upload).
require('../tools/lib.js')(process.argv[2], [
[
"<a class=\"btn ghost sm\" href=\"${esc(v.url)}\" target=\"_blank\">Open</a><button class=\"btn ghost sm\" onclick=\"vidUp('${esc(c.id)}')\" title=\"A second recording of the same class\">+ Add part</button></div>`",
"<a class=\"btn ghost sm\" href=\"${esc(v.url)}\" target=\"_blank\">Open</a></div>`"
],
[
"' · <a href=\"' + esc(url) + '\" target=\"_blank\" style=\"color:inherit\">Open</a> · <a href=\"#\" onclick=\"vidUp(\\'' + esc(id) + '\\');return false\" style=\"color:inherit\">+ Add another part</a></div>', 'ok');",
"' · <a href=\"' + esc(url) + '\" target=\"_blank\" style=\"color:inherit\">Open</a></div>', 'ok');"
],
[
"window.vidUp = id => {\n    if(BUSY)",
"window.vidUp = id => {\n    if(((typeof D !== 'undefined' && D && D.vids) || {})[id] && D.vids[id].url) return toast('This class already has its video · one file per class');\n    if(BUSY)"
]
]);
