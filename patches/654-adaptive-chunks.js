// 654: faster uploads on good internet — the piece size adapts: starts at 8 MB, doubles (up to 64 MB) while a piece takes under 4 s,
// halves (down to 8 MB) when one is slow or fails. Fewer pauses between pieces on fast lines; weak lines still lose little on a drop.
require('../tools/lib.js')(process.argv[2], [
[
"const N = f.size, CH = s.chunk || 8388608; let off = 0, fileId = '', fails = 0;",
"const N = f.size, CH0 = s.chunk || 8388608; let CH = CH0, off = 0, fileId = '', fails = 0, t1 = 0;"
],
[
"const r = await fetch(s.url, { method: 'PUT', headers: { 'Content-Range': 'bytes ' + off + '-' + (end - 1) + '/' + N }, body: f.slice(off, end) });",
"t1 = Date.now(); const r = await fetch(s.url, { method: 'PUT', headers: { 'Content-Range': 'bytes ' + off + '-' + (end - 1) + '/' + N }, body: f.slice(off, end) });"
],
[
"else if(r.status === 308){ const g = r.headers.get('Range'); off = g ? +g.split('-')[1] + 1 : 0; fails = 0; }",
"else if(r.status === 308){ const g = r.headers.get('Range'); off = g ? +g.split('-')[1] + 1 : 0; fails = 0; const ms = Date.now() - t1; CH = ms < 4000 ? Math.min(CH * 2, 8 * CH0) : ms > 12000 ? Math.max(CH0, CH / 2) : CH; }"
],
[
"if(++fails > 10) throw new Error(",
"CH = Math.max(CH0, CH / 2); if(++fails > 10) throw new Error("
]
]);
