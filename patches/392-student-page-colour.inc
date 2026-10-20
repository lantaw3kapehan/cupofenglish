/* 20 Oct · 392 · Student page: colour that guides the eye, labels that guide the brain (Misty).
   Colour means something, and only one thing:  teal = send to the parent · navy = manage / you are here ·
   green = fine · amber = soon · coral = act now. Everything else stays white and grey.
   · Lessons left: green, amber at 8 or fewer ("Renew soon"), coral at 3 or fewer ("Renew now"); latest score coloured by band.
   · A status pill beside the name (Active · Trial · Not active), the same word as the Status box.
   · Action bar: "Send to parent" tinted teal with icons; "Manage" plain. Shorter button words.
   · Tabs with icons; the next class in the schedule is marked "Next". */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#sheetBody.stu2{--ok:#2E9B6A;--okT:#E8F6EE;--soon:#B7791F;--soonT:#FDF4E3;--now:#C0533D;--nowT:#FBECE8;--send:#00737B;--sendT:#F1FAF9;--nav:#2B2253}
#sheetBody.stu2 .shero h1{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
#sheetBody.stu2 .stp{font-size:12px;font-weight:700;line-height:1;font-family:inherit;padding:6px 10px;border-radius:999px;letter-spacing:.02em}
#sheetBody.stu2 .stp.ok{background:var(--okT);color:var(--ok)} #sheetBody.stu2 .stp.soon{background:var(--soonT);color:var(--soon)} #sheetBody.stu2 .stp.now{background:var(--nowT);color:var(--now)} #sheetBody.stu2 .stp.off{background:#F1F0F6;color:#6F6B85}
#sheetBody.stu2 .kpis>div{position:relative}
#sheetBody.stu2 .kpis>div.k-ok b{color:var(--ok)} #sheetBody.stu2 .kpis>div.k-soon{background:var(--soonT);border-color:#F2DDB0} #sheetBody.stu2 .kpis>div.k-soon b{color:var(--soon)}
#sheetBody.stu2 .kpis>div.k-now{background:var(--nowT);border-color:#F0C9BF} #sheetBody.stu2 .kpis>div.k-now b{color:var(--now)}
#sheetBody.stu2 .kpis>div em{display:block;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.04em;margin-top:2px}
#sheetBody.stu2 .kpis>div.k-soon em{color:var(--soon)} #sheetBody.stu2 .kpis>div.k-now em{color:var(--now)}
.stu-bar .grp.g-send{background:var(--sendT,#F1FAF9);border-color:#BFE6E3}
.stu-bar .grp.g-send>span{color:#00737B}
.stu-bar .grp.g-send .btn{border-color:#BFE6E3!important;color:#00626A!important}
.stu-bar .grp.g-send .btn:hover{background:#00737B!important;color:#fff!important;border-color:#00737B!important}
.stu-bar .btn .ic{margin-right:5px;opacity:.85}
.stu-tabs button .ti{margin-right:5px}
#sheetBody.stu2 .cls.nx{background:#F1FAF9;border-radius:14px}
#sheetBody.stu2 .nxb{font-size:10.5px;font-weight:700;line-height:1;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:#00737B;border-radius:999px;padding:4px 7px;margin-left:6px}
#sheetBody.stu2 section.sec>h2{color:var(--nav)}
#sheetBody.stu2 .tl4 .tl4-r:not(.next) .tl4-a .btn.teal{background:#fff!important;color:#2B2253!important;border:1px solid #E3E1EC!important;box-shadow:none!important}`;
  document.head.appendChild(css);
  const LBL = [[/^Print/i, '🖨️', 'Print / PDF'], [/Lessons left/i, '🧾', 'Lessons left'], [/^Class notice/i, '📢', 'Class notice'], [/^Lesson summary/i, '📋', 'Lesson summary'], [/^Progress report/i, '📈', 'Progress report'],
    [/^Edit details/i, '', 'Edit details'], [/^Agreement/i, '📝', 'Agreement'], [/^Change book/i, '📚', 'Change book'], [/^Change teacher/i, '🔁', 'Teacher / schedule']];
  const TI = { Overview: '🏠', Progress: '📈', Notes: '🗒️', Profile: '👤' };
  function paint(){ const body = $('sheetBody'); if(!body || !body.classList.contains('stu2') || typeof STU === 'undefined' || !STU) return;
    /* status pill */
    const ch = body.querySelector('#stuStat h2 .chip'), lb = ch ? ch.textContent.trim() : '', h1 = body.querySelector('.shero h1');
    if(h1){ let p = h1.querySelector('.stp'); const left = Number(STU.s && STU.s.left);
      const k = /^Active$/i.test(lb) ? (left <= 3 ? 'now' : left <= 8 ? 'soon' : 'ok') : /^Trial$/i.test(lb) ? 'soon' : lb ? 'off' : '';
      const t = /^Active$/i.test(lb) ? (left <= 3 ? 'Active · renew now' : left <= 8 ? 'Active · renew soon' : 'Active') : lb;
      if(k){ if(!p){ h1.insertAdjacentHTML('beforeend', '<span class="stp"></span>'); p = h1.querySelector('.stp'); } if(p.className !== 'stp ' + k) p.className = 'stp ' + k; if(p.textContent !== t) p.textContent = t; } else if(p) p.remove(); }
    /* numbers */
    const K = [...body.querySelectorAll('.shero .kpis>div')];
    if(K[0]){ const n = Number(STU.s && STU.s.left); K[0].classList.remove('k-ok', 'k-soon', 'k-now'); let em = K[0].querySelector('em');
      if(!isNaN(n) && STU.s && STU.s.left != null && STU.s.left !== ''){ const k = n <= 3 ? 'now' : n <= 8 ? 'soon' : 'ok'; K[0].classList.add('k-' + k);
        const tx = k === 'now' ? 'Renew now' : k === 'soon' ? 'Renew soon' : ''; if(tx){ if(!em){ K[0].insertAdjacentHTML('beforeend', '<em></em>'); em = K[0].querySelector('em'); } if(em.textContent !== tx) em.textContent = tx; } else if(em) em.remove(); } }
    if(K[2]){ const v = Number((K[2].querySelector('b') || {}).textContent); K[2].classList.remove('k-ok', 'k-soon', 'k-now'); if(!isNaN(v) && v > 0) K[2].classList.add(v >= 70 ? 'k-ok' : v >= 50 ? 'k-soon' : 'k-now'); }
    /* action bar */
    const gs = body.querySelectorAll('.stu-bar .grp'); if(gs[0] && D && D.mgr) gs[0].classList.add('g-send');
    body.querySelectorAll('.stu-bar .btn').forEach(b => { if(b.dataset.lb) return; const t = b.textContent.trim(), hit = LBL.find(x => x[0].test(t)); if(!hit) return; b.dataset.lb = 1;
      const svg = b.querySelector('svg'); b.innerHTML = ''; if(svg) b.appendChild(svg); else if(hit[1]) b.insertAdjacentHTML('beforeend', '<span class="ic">' + hit[1] + '</span>'); b.insertAdjacentText('beforeend', hit[2]); b.title = t; });
    /* tab icons */
    body.querySelectorAll('.stu-tabs button').forEach(b => { if(b.querySelector('.ti')) return; const k = b.childNodes[0] && b.childNodes[0].textContent; if(TI[k]) b.insertAdjacentHTML('afterbegin', '<span class="ti">' + TI[k] + '</span>'); });
    /* next class */
    const first = body.querySelector('#stuSch .cls:not(.x)'); if(first && !first.classList.contains('nx')){ first.classList.add('nx'); const nm = first.querySelector('.nm'); if(nm && !first.querySelector('.nxb')) nm.insertAdjacentHTML('afterend', '<span class="nxb">Next</span>'); }
  }
  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); setTimeout(paint, 60); setTimeout(paint, 400); return r; };
  const t0 = window.stuTab; if(t0) window.stuTab = function(){ const r = t0.apply(this, arguments); paint(); return r; };
  try{ const sb = $('sheetBody'); let t = 0; if(sb) new MutationObserver(() => { clearTimeout(t); t = setTimeout(paint, 80); }).observe(sb, { childList: true, subtree: true }); }catch(e){}
})();
