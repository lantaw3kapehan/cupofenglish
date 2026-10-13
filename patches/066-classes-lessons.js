// Eric's parent read "15 classes · until 8 December" as the end of a 15-lesson package (25-min classes = 30 classes).
// Class picture: "N classes (= X lessons)" for classes under 50 min, and "last class …" / 最后一节课 instead of "until".
// New class › Weekly package: tap 15 / 30 + 3 / 60 + 8 lessons → number of classes from the length; preview shows "= X lessons".
require('../tools/lib.js')(process.argv[2], [
[
"CXP.pkg = { en: ds.length + ' classes · every ' + dd.map(d => W[d]).join(' & ') + ' · until ' + last.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),",
"const lu = Math.round(ds.length * mins / 50 * 10) / 10;   /* 25-min class = half a lesson: the parent sees the lessons too, and the last class is not read as the package end */\nCXP.pkg = { en: ds.length + ' classes' + (mins < 50 ? ' (= ' + lu + ' lessons)' : '') + ' · every ' + dd.map(d => W[d]).join(' & ') + ' · last class ' + last.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),"
],
[
"zh: '共' + ds.length + '节课 · 每周' + dd.map(d => WZ[d]).join('、') + ' · 至' + (last.getMonth() + 1) + '月' + last.getDate() + '日' }; }",
"zh: '共' + ds.length + '节课' + (mins < 50 ? '（' + lu + '课时）' : '') + ' · 每周' + dd.map(d => WZ[d]).join('、') + ' · 最后一节课 ' + (last.getMonth() + 1) + '月' + last.getDate() + '日' }; }"
],
[
"<label>Number of classes</label><input id=\"cN\" class=\"in-t\" type=\"number\" min=\"2\" max=\"60\" value=\"12\" oninput=\"classPrev()\">",
"<label>Number of classes</label><input id=\"cN\" class=\"in-t\" type=\"number\" min=\"2\" max=\"60\" value=\"12\" oninput=\"classPrev()\"><div class=\"skc\" style=\"margin-top:6px\">${[[15,'15'],[33,'30 + 3'],[68,'60 + 8']].map(([u, l]) => `<button type=\"button\" onclick=\"classFill(${u})\">${l} lessons</button>`).join('')}</div><div class=\"small mute\" style=\"margin-top:4px\">Tap the package and the number of classes is worked out from the length · a 25-min class is half a lesson (15 lessons = 30 × 25 min)</div>"
],
[
"`<b>${D.length} classes</b>, ${esc(fd(D[0]))}",
"`<b>${D.length} classes</b>${(+$('cM').value || 50) < 50 ? ' = <b>' + Math.round(D.length * (+$('cM').value || 50) / 50 * 10) / 10 + ' lessons</b>' : ''}, ${esc(fd(D[0]))}"
],
[
"function classRep(){",
"function classFill(u){ const m = +(($('cM') || {}).value) || 50, n = $('cN'); if(n) n.value = Math.min(60, Math.round(u * 50 / m)); if(u * 50 / m > 60) toast('More than 60 classes · add the rest in a second batch'); classPrev(); }\nfunction classRep(){"
]
]);
