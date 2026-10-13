// Trials › trial report: "Set class schedule" opens New class already filled for this student:
// regular class (not a trial), the trial teacher, Weekly package ticked, starting next Monday. Pick the days, time, length and number of classes.
require('../tools/lib.js')(process.argv[2], [
[
"function tlBtns(){\n",
"async function tlSched(){ const x = TLD; if(!x) return; if(!x.code) return toast('Add the student code first (DATABASE) · then set the schedule');\n" +
"await classForm(x.code); if(!$('cS')) return;\n" +
"try{ classKind(''); }catch(e){}   /* a regular class, even if the student was added as a trial */\n" +
"const t = $('cT'); if(t && x.teacher && [...t.options].some(o => o.value === x.teacher)) t.value = x.teacher;\n" +
"const d = new Date(); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); const dd = $('cD'); if(dd) dd.value = ymdLocal(d);   /* next Monday */\n" +
"const r = $('cR'); if(r && !r.checked){ r.checked = true; classRep(); } document.querySelectorAll('#cDays button.on').forEach(b => b.classList.remove('on'));   /* the parent's days are picked by hand */\n" +
"const h = $('sheetBody').querySelector('h1'); if(h) h.insertAdjacentHTML('afterend', '<div class=\"mini\" style=\"margin-top:8px\"><b>' + esc(x.student) + ' · first schedule after the trial</b><div class=\"small\">Tap the days (e.g. Tue + Fri), the time and the length (25 or 50 min), then the number of classes in the package. The parent picture comes up after you add them.</div></div>');\n" +
"try{ classPrev(); }catch(e){} }\n" +
"function tlBtns(){\n"
],
[
"<button class=\"btn ghost\" onclick=\"tlCopy()\">Copy message</button>`;",
"<button class=\"btn ghost\" onclick=\"tlCopy()\">Copy message</button>` + (D && D.mgr && TLD.code ? `<button class=\"btn teal\" onclick=\"tlSched()\">Set class schedule</button>` : '');"
]
]);
