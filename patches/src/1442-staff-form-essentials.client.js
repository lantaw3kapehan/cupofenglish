/* 1442 · Add / Edit teacher form: essentials first (Misty 12:04 "no need for Chinese name, just relevant details").
   Top: App name, Role, Start date, Pay + amount, App email + password, In Team Chat. Everything else from MASTERLIST sits in a
   collapsed "More details (MASTERLIST)" (opened in Edit when something is missing). Sheet-worked-out columns (BIRTHDAY STATUS,
   LENGTH) and untitled columns are not shown; leaving dates only for people who left. The write-back to MASTERLIST is unchanged:
   every column still goes back exactly as before (hidden fields keep their current values). */
(function(){
  const S = window.AS40; if(!S || S.v42) return; S.v42 = 1;
  const css = document.createElement('style'); css.id = 'st1442';
  css.textContent = '.as42-more{margin-top:18px;border:1px solid var(--line);border-radius:12px;padding:0 14px}.as42-more>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;min-height:48px;font:400 15px "Fredoka One",var(--f);color:var(--ink)}' +
    '.as42-more>summary::-webkit-details-marker{display:none}.as42-more>summary small{font:600 11px Inter,var(--f);color:var(--mute);letter-spacing:.04em;text-transform:uppercase}.as42-more>summary:after{content:"";margin-left:auto;width:8px;height:8px;border-right:2px solid var(--mute);border-bottom:2px solid var(--mute);transform:rotate(45deg);transition:transform .15s}' +
    '.as42-more[open]>summary:after{transform:rotate(-135deg)}.as42-more[open]{padding-bottom:14px}.as42-more h3:first-of-type{margin-top:4px}.as42-hide{display:none!important}';
  document.head.appendChild(css);
  const lab = el => el && el.closest('label');
  const _form = S.form;
  S.form = async function(id){
    await _form.apply(this, arguments);
    const f = document.getElementById('as40F'); if(!f) return;
    const p = id && S.L ? S.L.find(x => x.id === id) : null, H = S.head || [];
    const q = s => f.querySelector(s), ml = i => q('[data-ml="' + i + '"]');
    /* Chinese name: not asked any more (the portal's "X老师" is made from the app name automatically) */
    const cn = lab(q('#as40cn')); if(cn) cn.classList.add('as42-hide');
    /* columns that are not for the form: worked out by the sheet, untitled, leaving details for someone still active */
    const skip = [5, 9].concat(H.map((h, i) => String(h).trim() ? -1 : i).filter(i => i >= 0)).concat(!p || p.status === 'active' ? [11, 12, 13] : []);
    f.querySelectorAll('[data-ml]').forEach(x => { if(skip.includes(+x.dataset.ml)) { const l = lab(x); if(l) l.classList.add('as42-hide'); } });
    f.querySelectorAll('label').forEach(l => { if(/^BIRTHDAY STATUS|^LENGTH/i.test(l.textContent.trim()) && l.querySelector('input[readonly]')) l.classList.add('as42-hide'); });
    /* essentials grid */
    const top = q('#as40n') && q('#as40n').closest('.as40-g'); if(!top) return;
    const hTop = top.previousElementSibling; if(hTop && hTop.tagName === 'H3') hTop.textContent = 'Essentials';
    const payNote = q('#as40pa') && q('#as40pa').closest('.as40-g').querySelector('.as40-note');
    const start = ml(8); if(start){ const l = lab(start); l.firstChild.textContent = 'Start date'; top.appendChild(l); }
    const pt = lab(q('#as40pt')), pa = lab(q('#as40pa')), pf = lab(q('#as40pf')); [pt, pa, pf].forEach(l => l && top.appendChild(l));
    if(pf) pf.firstChild.textContent = 'Pay starts';
    if(pt) pt.firstChild.textContent = 'Pay type';
    if(pa) pa.firstChild.textContent = 'Rate per lesson or monthly amount (₱)';
    const si = q('#as40si'), em = lab(q('#as40em')), pw = q('.as40-pw');
    if(em){ em.firstChild.textContent = 'App email (sign-in)'; top.appendChild(em); } if(pw) top.appendChild(pw);
    const chat = lab(q('#as40ch')); if(chat){ chat.style.alignSelf = 'end'; top.appendChild(chat); }
    const rn = q('#as40rn'); if(rn) top.after(rn);
    if(payNote){ payNote.style.gridColumn = '1 / -1'; payNote.style.marginTop = '0'; (rn || top).after(payNote); }
    /* the old Pay and sign-in blocks are now empty */
    f.querySelectorAll('h3').forEach(h => { const g = h.nextElementSibling; if(g && g.classList.contains('as40-g') && !g.querySelector('label:not(.as42-hide),.as40-pw')) { h.remove(); g.remove(); } });
    if(si){ const h = si.querySelector('h3'), g = si.querySelector('.as40-g'); if(g && !g.children.length){ if(h) h.remove(); g.remove(); } }
    /* role note follows the moved sign-in fields: hide email/password for staff with no app */
    const roleCh = () => { const r = q('#as40r') && q('#as40r').value; [em, pw].forEach(x => x && x.classList.toggle('as42-hide', r === 'staff')); };
    if(q('#as40r')) q('#as40r').addEventListener('change', roleCh); roleCh();
    /* everything else: one collapsed section */
    const more = document.createElement('details'); more.className = 'as42-more'; more.id = 'as42More';
    more.innerHTML = '<summary>More details <small>MASTERLIST</small></summary>';
    const stop = q('.as40-err');
    let n = (rn || top).nextElementSibling; if(payNote) n = payNote.nextElementSibling;
    const moving = []; while(n && n !== stop){ moving.push(n); n = n.nextElementSibling; }
    moving.forEach(x => more.appendChild(x));
    stop.before(more);
    /* onboarding / offboarding checklist (1441) comes after the essentials */
    const obH = [...f.querySelectorAll('h3')].find(h => /^(On|Off)boarding/.test(h.textContent)); if(obH && obH.parentElement !== f) more.before(obH.parentElement);
    if(q('#as40pa')) q('#as40pa').placeholder = p ? 'Leave empty to keep the current amount' : '';
    const pc = p && S.pct ? S.pct(p) : null;
    if(p && pc != null && pc < 100) more.open = true;
    const meter = f.querySelector('h2 .as41-m'); if(meter){ meter.style.cursor = 'pointer'; meter.title = 'Fill in the missing details'; meter.onclick = () => { more.open = true; more.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; }
  };
})();
