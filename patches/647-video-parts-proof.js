// 647: (Misty) a class may have 2 recordings, and when a class was not recorded a screen proof is accepted.
// · "+ Add part" after the first upload (server names it …-PART2, -PART3) · the picker also takes pictures (server names it …-SCREENPROOF).
require('../tools/lib.js')(process.argv[2], [
[
"vidH = v && v.url ? `<div class=\"hw ok\"><span class=\"ic\">✓</span><div class=\"grow ell\">Class video uploaded${v.at?' · '+esc(v.at):''}</div><a class=\"btn ghost sm\" href=\"${esc(v.url)}\" target=\"_blank\">Open</a></div>`",
"vidH = v && v.url ? `<div class=\"hw\" style=\"border-color:#BFE3D2;background:#F3FAF6\"><span class=\"ic\" style=\"background:#2E9E6F;color:#fff\">✓</span><div class=\"grow ell\">Class video uploaded${v.at?' · '+esc(v.at):''}</div><a class=\"btn ghost sm\" href=\"${esc(v.url)}\" target=\"_blank\">Open</a><button class=\"btn ghost sm\" onclick=\"vidUp('${esc(c.id)}')\" title=\"A second recording of the same class\">+ Add part</button></div>`"
],
[
"<b>Upload the class video</b> <span class=\"mute\">· here in the app · saved to the school Drive, not your storage · named and filed for you</span>",
"<b>Upload the class video</b> <span class=\"mute\">· here in the app · saved to the school Drive, not your storage · named and filed for you · not recorded? upload a screen proof instead</span>"
],
[
"inp.accept = 'video/*,.mp4,.mov,.m4v,.mkv,.webm';",
"inp.accept = 'video/*,image/*,.mp4,.mov,.m4v,.mkv,.webm,.jpg,.jpeg,.png,.heic';"
],
[
"if(!/^video\\//.test(f.type || '') && !/\\.(mp4|mov|m4v|mkv|webm|avi)$/i.test(f.name))",
"if(!/^(video|image)\\//.test(f.type || '') && !/\\.(mp4|mov|m4v|mkv|webm|avi|jpe?g|png|heic|heif|webp)$/i.test(f.name))"
],
[
"return toast('Choose the class video (MP4, MOV…)');",
"return toast('Choose the class video (MP4, MOV…) or a screen proof picture');"
],
[
"' · <a href=\"' + esc(url) + '\" target=\"_blank\" style=\"color:inherit\">Open</a></div>', 'ok');",
"' · <a href=\"' + esc(url) + '\" target=\"_blank\" style=\"color:inherit\">Open</a> · <a href=\"#\" onclick=\"vidUp(\\'' + esc(id) + '\\');return false\" style=\"color:inherit\">+ Add another part</a></div>', 'ok');"
]
]);
