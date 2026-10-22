// 22 Oct · Misty: management is told too. Phone alerts come from the database (a teacher signs → President, "ready for your
// countersign"; a question or "do not agree" → President and Operations). In the app, More › Contracts shows how many wait
// for a countersign and how many questions/declines need a reply, and a dot appears on More.
require('../tools/lib.js')(process.argv[2], [
[`li.innerHTML = '<div class="av">' + DOCI + '</div><div class="grow"><b>Contracts</b>`,
 `setTimeout(ctCount, 50); li.innerHTML = '<div class="av">' + DOCI + '</div><div class="grow"><b>Contracts</b> <span class="chip ct-cnt hide" style="margin-left:6px"></span>`],
["  const _rm = window.renderMore;",
 `  let CNT = null, CNTT = 0;
  async function ctCount(){ if(!isMgmt()) return; try{ if(!CNT || Date.now() - CNTT > 5 * 60e3){ const L = await call('list'); const P = L.pres;
      const w = (L.rows || []).filter(r => r.status === 'signed' && !r.pres_at).length, q = (L.rows || []).filter(r => /^(question|declined)$/.test(r.status) && !r.reply).length;
      CNT = { n: (P ? w : 0) + q, txt: [P && w ? w + ' to countersign' : '', q ? q + ' to reply' : ''].filter(Boolean).join(' · ') }; CNTT = Date.now(); }
    document.querySelectorAll('.ct-cnt').forEach(el => { el.textContent = CNT.txt; el.classList.toggle('hide', !CNT.n); });
    const b = document.querySelector('nav button[data-v="more"]'); if(b){ let d = b.querySelector('.ct-dot'); if(!d){ d = document.createElement('i'); d.className = 'dot ct-dot'; b.appendChild(d); } d.classList.toggle('hide', !CNT.n); } }catch(x){} }
  setTimeout(function w(){ if(typeof D !== 'undefined' && D){ if(D.mgr){ ctCount(); setInterval(() => { if(document.visibilityState === 'visible'){ CNTT = 0; ctCount(); } }, 10 * 60e3); } } else setTimeout(w, 2000); }, 4000);
  const _rm = window.renderMore;`],
["  async function refresh(t){ AD = await call('list'); ctTeacher(t); }", "  async function refresh(t){ AD = await call('list'); CNTT = 0; ctCount(); ctTeacher(t); }"],
]);
