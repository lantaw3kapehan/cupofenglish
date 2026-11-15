// 2253 (Misty on her phone, 15 Nov 21:35): the Christmas card was not visible on a teacher's Today on the phone. It was put inside
// ".ov" / after "#fd1806", which on the teacher's phone screen is not the visible top. For teachers it now goes first on Today
// (right under the title), on phone and laptop; management keeps its place on the Overview.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "if(!host) return; const fd = host.querySelector('#fd1806'); if(fd) fd.insertAdjacentHTML('afterend', h); else { const ov = host.querySelector('.ov') || host; ov.insertAdjacentHTML('afterbegin', h); } }",
 "if(!host) return; if(!(typeof D !== 'undefined' && D && D.mgr)){ host.insertAdjacentHTML('afterbegin', h); const c0 = document.getElementById('x21c'); if(c0){ c0.style.margin = '0 0 12px'; } return; } const fd = host.querySelector('#fd1806'); if(fd) fd.insertAdjacentHTML('afterend', h); else { const ov = host.querySelector('.ov') || host; ov.insertAdjacentHTML('afterbegin', h); } }"
]]);
