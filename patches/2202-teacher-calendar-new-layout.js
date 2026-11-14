// 2202 (14 Nov · Misty: "not showing on teacher's access"): the teacher Schedule uses the newer layout (day cards .dy501 in .dl501),
// which 2195 and 2201 did not look for. Now:
// · Calendar replaces the day cards (and the small week/month count bars above them) with the week grid or month calendar; List brings them back.
// · China dates: the "China dates in this period" note goes under the summary card, and each day card gets its label next to the day name.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["    const st = v.querySelector('.stats'); if(st && L.length) st.insertAdjacentHTML('afterend', box('China dates in this period', L));",
  "    const st = v.querySelector('section.sm501') || v.querySelector('.stats'); if(st && L.length) st.insertAdjacentHTML('afterend', box('China dates in this period', L));\n" +
  "    v.querySelectorAll('section.dy501[id^=\"tsd-\"]').forEach(d => { if(d.querySelector('.cn95t')) return; const x = on(d.id.slice(4))[0]; const s = d.querySelector('.hd501 .dw');\n" +
  "      if(x && s) s.insertAdjacentHTML('beforeend', ' <span class=\"cn95t k-' + x.k + '\" style=\"display:inline-block;font-size:11.5px;font-weight:600;border-radius:6px;padding:2px 6px;margin-left:4px\">' + E(x.n) + '</span>'); });"],
 ["  window.c01Set = m => { MODE = m;", "  window.c01Set = m => { MODE = m; try{ const v = document.getElementById('v-tsched'); if(v) delete v.dataset.k501; }catch(e){}"],
 ["    const secs = [...v.querySelectorAll('section.sec')].filter(s => s.querySelector('.sv-day, .sv-none')); if(!secs.length) return;",
  "    v.querySelectorAll('.c01wrap').forEach(x => x.remove()); v.querySelectorAll('.c01sw button').forEach((b, i) => b.classList.toggle('on', (i === 1) === (MODE === 'cal')));\n" +
  "    const dl = v.querySelector('.dl501'); if(dl){ v.querySelectorAll('.wk501, .mo501').forEach(x => x.style.display = 'none');\n" +
  "      const key0 = '<div class=\"c01k\"><span><i style=\"background:#E6F6F7;box-shadow:0 0 0 2px #00A3AD\"></i>on now</span><span><i style=\"background:repeating-linear-gradient(135deg,#F4F3F8 0 4px,#FBFBFD 4px 8px);border:1px solid #DDD\"></i>cancelled</span><span><i style=\"background:#FFF3EF\"></i>China holiday</span><span><i style=\"background:#F4F2FC\"></i>school exams</span><span>Colour = course book</span></div>';\n" +
  "      dl.insertAdjacentHTML('beforebegin', '<div class=\"c01wrap\">' + key0 + (t.days > 7 ? month(t) : week(t)) + '</div>'); dl.style.display = 'none'; return; }\n" +
  "    const secs = [...v.querySelectorAll('section.sec')].filter(s => s.querySelector('.sv-day, .sv-none')); if(!secs.length) return;"]
]);
