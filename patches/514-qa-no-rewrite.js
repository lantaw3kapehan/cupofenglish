// 21 Oct · QA pass on the teacher screens (Misty: "QA each screen for flickers, issues, future and potential issues, optimize it and solve").
//  · Today was torn down and rebuilt about 3 s after opening (leave, pay-ready and feedback data arriving) even when nothing on it
//    changed. Today, Pay and Growth / QA feedback now keep the screen as it is when the new drawing is identical — no rebuild,
//    no flicker risk on slower phones, and anything open (a note, a detail, a half-typed plan) stays open.
//  · Header: on scroll, the cards showed through the frosted header (it was 72% see-through) and looked doubled; now 94% solid.
const keep = (id) => `{ const _v = $('${id}'); if(!(_v._h0 === h && _v.firstElementChild && _v.firstElementChild === _v._f0 && _v.isConnected)){ _v.innerHTML = h; _v._h0 = h; _v._f0 = _v.firstElementChild; } }   /* 514: same drawing → keep the screen as it is */`;
require('../tools/lib.js')(process.argv[2], [
["\n$('v-today').innerHTML = h;\n}", "\n" + keep('v-today') + "\n}"],
["\n$('v-pay').innerHTML = h;\n}", "\n" + keep('v-pay') + "\n}"],
["function paintGrowth(){ $('v-growth').innerHTML = growthHtml(GR, 0, false, 'growth'); $('v-qa').innerHTML = growthHtml(GR, GR_I, false, 'qa'); }",
 "function paintGrowth(){ const put = (id, h) => { const _v = $(id); if(!(_v._h0 === h && _v.firstElementChild && _v.firstElementChild === _v._f0)){ _v.innerHTML = h; _v._h0 = h; _v._f0 = _v.firstElementChild; } }; put('v-growth', growthHtml(GR, 0, false, 'growth')); put('v-qa', growthHtml(GR, GR_I, false, 'qa')); }   /* 514: same drawing → keep */"],
["body:not(.mgr) header{background:rgba(255,255,255,.72)!important;", "body:not(.mgr) header{background:rgba(255,255,255,.94)!important;"]
]);
