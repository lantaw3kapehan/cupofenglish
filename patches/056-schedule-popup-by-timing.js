// Schedule class pop-up, decluttered by timing (Misty, 13 Oct).
// Before class: status + countdown, Class details picture, Move / Cancel buttons (forms open on tap). No QA, no tag, no video box.
// Under 2 hours: parent cancellations count as completed, so Cancel only offers teacher / CupOfEnglish reasons (make-up added); moving stays open.
// During class: status, LIVE bar + QA, tag. Picture / move / cancel folded behind one link. After class: status, tag, QA folded behind a link.
require('../tools/lib.js')(process.argv[2], [
[
"CE = { e, i, src };",
"CE = { e, i, src }; const nw0 = Date.now(), ph = e.cancelled ? 'cx' : nw0 < st - 5 * 6e4 ? 'pre' : nw0 <= +new Date(e.end) + 10 * 6e4 ? 'live' : 'post', late2 = !e.cancelled && st - nw0 < 2 * 36e5; window._ceLate = late2;   /* pre = before class \u00b7 live = class on now \u00b7 post = finished; late2 = under 2 h before the start (policy) */"
],
[
"${e.cancelled ? '' : `<button class=\"btn teal block\" style=\"margin-top:12px\" onclick=\"cxClassProof(${i},'${src}')\">Class details to send (picture)</button>`}\n<h2 style=\"margin-top:18px\">Change this class</h2>",
"${e.cancelled ? '' : ph === 'pre' ? `<button class=\"btn teal block\" style=\"margin-top:12px\" onclick=\"cxClassProof(${i},'${src}')\">Class details to send (picture)</button>\n<div class=\"row\" style=\"gap:8px;margin-top:10px\"><button class=\"btn ghost grow\" id=\"ceBMv\" onclick=\"ceOpen('ceMv')\">Move \u00b7 reschedule</button><button class=\"btn ghost grow\" id=\"ceBCx\" onclick=\"ceOpen('ceCx')\">${late2 ? 'Cancel \u00b7 under 2 h' : 'Cancel class'}</button></div>` : `<div class=\"small\" style=\"margin-top:14px;text-align:center\"><a class=\"link\" onclick=\"this.parentNode.remove();$('ceMore').classList.remove('hide')\">${ph === 'live' ? 'Need to change this class?' : 'Picture \u00b7 move \u00b7 cancel'}</a></div><div id=\"ceMore\" class=\"hide\"><button class=\"btn ghost block\" style=\"margin-top:12px\" onclick=\"cxClassProof(${i},'${src}')\">Class details to send (picture)</button><div class=\"row\" style=\"gap:8px;margin-top:10px\"><button class=\"btn ghost grow\" id=\"ceBMv\" onclick=\"ceOpen('ceMv')\">Move \u00b7 reschedule</button><button class=\"btn ghost grow\" id=\"ceBCx\" onclick=\"ceOpen('ceCx')\">Cancel class</button></div></div>`}\n<div id=\"ceMv\" class=\"${e.cancelled ? '' : 'hide'}\"><h2 style=\"margin-top:18px\">${e.cancelled ? 'Change this class' : 'Move \u00b7 reschedule'}</h2>"
],
[
"onclick=\"sendEdit(${i},'move','${src}')\">Save changes</button>\n",
"onclick=\"sendEdit(${i},'move','${src}')\">Save changes</button></div>\n<div id=\"ceCx\" class=\"${e.cancelled ? '' : 'hide'}\">${e.cancelled ? '' : '<h2 style=\"margin-top:18px\">Cancel class</h2>'}${late2 ? `<div class=\"mini\" style=\"margin-top:10px;background:var(--coralT);color:#9A4330\"><b>${ph === 'pre' ? 'Less than 2 hours before class.' : 'This class has started.'}</b> By policy, a parent's cancellation now counts as a completed (paid) class, so the class stays on the calendar. Cancel only when the teacher or CupOfEnglish can't hold it \u00b7 a make-up is added.</div>` : ''}\n"
],
[
"${['Parent asked','Student sick','School exam','Family trip','Holiday','Moved to another day','Student no-show','Teacher unavailable','Internet problem','Power outage'].map(",
"${(late2 ? ['Teacher unavailable','Internet problem','Power outage'] : ['Parent asked','Student sick','School exam','Family trip','Holiday','Moved to another day','Student no-show','Teacher unavailable','Internet problem','Power outage']).map("
],
[
"<label class=\"check\" style=\"margin-top:10px\"><input type=\"checkbox\" id=\"eStop\"",
"${late2 ? '' : `<label class=\"check\" style=\"margin-top:10px\"><input type=\"checkbox\" id=\"eStop\""
],
[
"(nothing deleted, no make-up)</div></div></label>`}",
"(nothing deleted, no make-up)</div></div></label>`}`}"
],
[
"${e.cancelled?'Restore class (remove X, RSVP Yes)':'Cancel class (X + RSVP No)'}</button>",
"${e.cancelled?'Restore class (remove X, RSVP Yes)':late2?'Cancel \u00b7 teacher / CupOfEnglish reason':'Cancel class (X + RSVP No)'}</button>"
],
[
"like the team does by hand.</p>`);",
"like the team does by hand.</p></div>`);"
],
[
"if(!e.cancelled) monLoad();\n}",
"if(!e.cancelled) monLoad();\n}\nfunction ceOpen(id){ ['ceMv','ceCx'].forEach(k => { const x = $(k); if(!x) return; if(k === id) x.classList.toggle('hide'); else x.classList.add('hide'); });\n[['ceBMv','ceMv'],['ceBCx','ceCx']].forEach(([b, k]) => { const B = $(b), x = $(k); if(B && x){ const on = !x.classList.contains('hide'); B.classList.toggle('teal', on); B.classList.toggle('ghost', !on); } });\nconst x = $(id); if(x && !x.classList.contains('hide')) setTimeout(() => x.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); }"
],
[
"window._cxStop = 0; if(action==='cancel' && e.cancelled",
"if(action==='cancel' && !e.cancelled && window._ceLate && !/teacher|internet|power|outage|cupofenglish/i.test(f.reason)) return toast('Under 2 hours: a parent cancellation counts as a completed class. Choose a teacher / CupOfEnglish reason.');\nwindow._cxStop = 0; if(action==='cancel' && e.cancelled"
],
[
"Starts ${tm(e.start)}${now >= st.getTime() ? ' \u00b7 ' + Math.round((now - st)/60000) + ' min ago' : ''}",
"Starts ${tm(e.start)}${now >= st.getTime() ? ' \u00b7 ' + Math.round((now - st)/60000) + ' min ago' : ' \u00b7 in ' + (m => m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + m % 60 + ' min' : '') : m + ' min')(Math.round((st - now) / 60000))}"
],
[
": `<div class=\"mon-r\"><b>${now > new Date(e.end) ? 'No class video yet'",
": now < st.getTime() ? '' : `<div class=\"mon-r\"><b>${now > new Date(e.end) ? 'No class video yet'"
],
[
"<b>Tagged</b>${esc(dec)}</div>` : `<div class=\"mon-tag\">",
"<b>Tagged</b>${esc(dec)}</div>` : now < st.getTime() ? '' : `<div class=\"mon-tag\">"
],
[
"return live ? bar + box + h : h + box;",
"return live ? bar + box + h : nw < st ? h : h + '<div class=\"small\" style=\"margin-top:12px\"><a class=\"link\" onclick=\"this.parentNode.remove();$(\\'monVisitW\\').classList.remove(\\'hide\\')\">Class visit (QA) \u00b7 add or view</a></div><div id=\"monVisitW\" class=\"hide\">' + box + '</div>';"
],
[
"open the next class \u203a Change this class \u203a Moving forward.",
"open the next class \u203a Move \u00b7 reschedule \u203a Moving forward."
]
]);
