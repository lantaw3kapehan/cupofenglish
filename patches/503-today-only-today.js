// 21 Oct · Teacher Today shows only what is about today (Misty: "I want in TODAY to be anything related to TODAY").
//  · Messages card off Today: new or unacknowledged messages still appear in Today's To do; all messages are on Messages; Request leave is on Schedule.
//  · My open times moves from Today to Schedule (the times parents can book are about the coming days).
//  · My class videos: today's classes, plus yesterday only while a video is still missing there.
require('../tools/lib.js')(process.argv[2], [
["if(!D.mgr) h += tMsgHtml();",
 "if(!D.mgr && false) h += tMsgHtml();   /* 503 · 21 Oct: Messages live on Messages; new ones show in To do */"],
["if(D && !D.mgr){ const v = $('v-today'); if(v && !v.querySelector('#tAvCard')){",
 "if(D && !D.mgr){ const v = $('v-today'); if(false && v && !v.querySelector('#tAvCard')){   /* 503: My open times is on Schedule now */"],
["days = [...new Set(V.map(x => String(x.day).slice(0, 10)))].sort().reverse();",
 "days = [...new Set(V.map(x => String(x.day).slice(0, 10)))].sort().reverse().filter(d => d === t || V.some(x => String(x.day).slice(0, 10) === d && !x.found));   /* 503: yesterday only while something is missing */\n    if(!days.length){ if(box) box.remove(); return; }"],
["    if(!lvBusy) h += lvH;",
 "    if(typeof tAvOpen === 'function') h += `<section class=\"sm501 av501\" onclick=\"tAvOpen()\" style=\"cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 16px\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"#00939D\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"flex:none\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2.5\"/><path d=\"M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4\"/></svg><span style=\"flex:1;min-width:0\"><b style=\"color:#2B2253\">My open times</b><span class=\"small mute\" style=\"display:block\">The times parents can book with you · your teaching hours</span></span><span class=\"mute\" style=\"font-size:18px\">›</span></section>`;   /* 503: moved here from Today */\n    if(!lvBusy) h += lvH;"]
]);
// 503b · the class sound / reminders card goes last in the side column (it used to sit after Messages).
require('../tools/lib.js')(process.argv[2], [
["    if(ps && mh && !ps.dataset.m96){ let t = mh.nextElementSibling; if(t){ ps.dataset.m96 = 1; t.after(ps); } } }",
 "    if(ps && mh && !ps.dataset.m96){ let t = mh.nextElementSibling; if(t){ ps.dataset.m96 = 1; t.after(ps); } }\n    else if(ps && !mh && ps.nextElementSibling && ps.parentNode) ps.parentNode.appendChild(ps); }   /* 503: no Messages on Today, so last */"]]);
