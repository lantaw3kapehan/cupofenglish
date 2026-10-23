// 658: (Misty) a class cancelled because the teacher is on leave no longer shows "Open · Teacher is free · Book this time":
// teachers on Approved or Pending leave (whole day, or the hours of a part-day leave) are not offered as free, and the cancelled card says
// "Teacher Pam on leave · 23–25 Oct". Uses the Leave list the app already keeps (LV, saved on the device).
require('../tools/lib.js')(process.argv[2], [
[
"function freed(e){ if(!e || !e.cancelled || !SC) return false; const s = +new Date(e.start), en = +new Date(e.end); if(s < Date.now()) return false;",
"function freed(e){ if(!e || !e.cancelled || !SC) return false; const s = +new Date(e.start), en = +new Date(e.end); if(s < Date.now()) return false;\n    if(window.lvOn && lvOn(e.teacher, e.start, e.end)) return false;   /* 658: on leave = not free */"
],
[
"window.scFreed = freed;",
"window.scFreed = freed;\n  /* 658 · the teacher's leave (Approved or Pending) covering this class: whole days, or the hours of a part-day leave */\n  window.lvOn = (t, s, en) => { try{ let L = (typeof LV !== 'undefined' && LV && LV.rows) || null; if(!L){ try{ L = (JSON.parse(localStorage.getItem('coe.m.leave') || 'null') || {}).rows || null; }catch(x){} }
    if(!window._lv658 && typeof loadLeave === 'function'){ window._lv658 = 1; Promise.resolve(loadLeave(true)).then(() => { try{ if(VIEW === 'schedule') renderSchedule(); }catch(x){} }); }   /* fresh leave list once per open */
    if(!L) return null;\n    const day = ymdLocal(new Date(s)), a = tm(s), b = tm(en);\n    return L.find(r => /^(Approved|Pending)$/.test(r.status) && key(typeof tName === 'function' ? tName(r.teacher) : r.teacher) === key(t) && r.from <= day && r.to >= day && (() => { const w = typeof lvWin === 'function' ? lvWin(r) : []; return !w.length || (w[0] < b && w[1] > a); })()) || null; }catch(x){ return null; } };"
],
[
"v.querySelectorAll('.cls.x').forEach(c => { const m = /classEdit\\((\\d+)/.exec(c.getAttribute('onclick') || ''), e = m && SC.events[+m[1]]; if(!e || !freed(e) || c.querySelector('.cxo')) return;",
"v.querySelectorAll('.cls.x').forEach(c => { const m = /classEdit\\((\\d+)/.exec(c.getAttribute('onclick') || ''), e = m && SC.events[+m[1]];\n        try{ const lv = e && +new Date(e.end) > Date.now() - 864e5 && lvOn(e.teacher, e.start, e.end), g0 = c.querySelector('.grow'); if(lv && g0 && !c.querySelector('.cxl')){ const f = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });\n          g0.insertAdjacentHTML('beforeend', `<div class=\"cxo cxl\" style=\"background:#F4F3F8;color:#5B5675\"><i style=\"background:#8A86A0\"></i><span class=\"grow\">Teacher ${esc(e.teacher)} on ${esc(String(lv.type || 'leave').toLowerCase())}${lv.status === 'Pending' ? ' (waiting for approval)' : ''} · ${esc(lv.from === lv.to ? f(lv.from) : f(lv.from) + '–' + f(lv.to))}</span></div>`); } }catch(x){}\n        if(!e || !freed(e) || c.querySelector('.cxo')) return;"
]
]);
