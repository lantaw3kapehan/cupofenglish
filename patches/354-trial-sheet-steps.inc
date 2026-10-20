/* 20 Oct · 354 · Trial report sheet, calmer and in Misty's order ("polish the design, organized well, and not overwhelming").
   "Send to the student" is one short numbered list, done in this order:
     1 Trial report (the PDF shows the child's performance · the picture is the quick backup while the PDF loads)
     2 Course plan (the book roadmap) · 3 CEFR picture (what the level means) · 4 Price
   Each line has one button; the next one to send is the teal one, a sent one gets ✓ (kept on this device per report).
   "After sending": follow-up chips, Enrol, then class schedule and agreement, smaller.
   Level and "ask the teacher to redo" move into "More" at the bottom. Every button keeps what it did before. */
(function(){
  const css = document.createElement('style'); css.textContent = `
#tlAct.tl4{display:block!important;margin-top:14px}
.tl4 .tl4-h{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#8A86A0;margin:18px 2px 8px}
.tl4 .tl4-card{border:1px solid #EEEDF3;border-radius:18px;padding:2px 16px;background:#fff}
.tl4 .tl4-r{display:grid;grid-template-columns:30px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-top:1px solid #F2F1F6}
.tl4 .tl4-r:first-child{border-top:0}
.tl4 .tl4-n{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:#F1F0F6;color:#6F6B85}
.tl4 .tl4-r.next .tl4-n{background:#E3F4F2;color:#00737B}
.tl4 .tl4-r.done .tl4-n{background:#2E9B6A;color:#fff}
.tl4 .tl4-t b{display:block;font-size:15px}
.tl4 .tl4-t span{font-size:12.5px;color:#7A768F;line-height:1.4}
.tl4 .tl4-r.done .tl4-t b{color:#5C5876}
.tl4 .tl4-a{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
.tl4 .tl4-a .btn{white-space:nowrap;padding:8px 14px;font-size:13.5px;min-height:0;width:auto;flex:none}
.tl4 .tl4-a .btn:not(.teal){background:#fff;border:1px solid #E3E1EC;color:#2B2253;box-shadow:none}
.tl4 .tl4-links{grid-column:2/-1;display:flex;gap:14px;flex-wrap:wrap;margin-top:-4px}
.tl4 .tl4-links button{background:none;border:0;padding:0;font:inherit;font-size:12.5px;color:#00737B;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.tl4 .tl4-links button:disabled{color:#A9A6B8;text-decoration:none;cursor:default}
.tl4 .tl4-fu{display:flex;gap:6px;flex-wrap:wrap}
.tl4 .tl4-fu .btn{padding:6px 12px;font-size:13px;min-height:0;width:auto;flex:none;background:#fff;border:1px solid #E3E1EC;color:#2B2253;box-shadow:none}
.tl4 .tl4-fu .btn.on,.tl4 .tl4-fu .btn.teal{background:#2B2253;color:#fff;border-color:#2B2253}
.tl4 details.tl4-more{margin-top:16px;border-top:1px solid #F2F1F6;padding-top:10px}
.tl4 details.tl4-more summary{cursor:pointer;font-size:13px;color:#7A768F;list-style:none}
.tl4 details.tl4-more summary::-webkit-details-marker{display:none}
.tl4 details.tl4-more summary::before{content:"› ";display:inline-block;transition:transform .15s}
.tl4 details.tl4-more[open] summary::before{transform:rotate(90deg)}
.tl4 .tl4-r.next .tl4-a>.btn:first-child:not(:disabled){background:linear-gradient(135deg,#2BB3AA,#1F8F96);color:#fff;border:0}
.tl4 details.tl4-more summary{padding-left:2px}
@media(max-width:620px){.tl4 .tl4-r{gap:10px}.tl4 .tl4-r.tl4-w,.tl4 .tl4-r.tl4-f{grid-template-columns:26px 1fr}.tl4 .tl4-r.tl4-w .tl4-a,.tl4 .tl4-r.tl4-f .tl4-fu{grid-column:2/-1;justify-content:flex-start}.tl4 .tl4-t span{display:none}.tl4 .tl4-r.tl4-w .tl4-t span{display:block}}`;
  document.head.appendChild(css);
  const key = t => 'coe.tl4.' + String(t.label || (t.date + '|' + t.student));
  const got = t => { try{ return JSON.parse(localStorage.getItem(key(t)) || '{}') || {}; }catch(e){ return {}; } };
  const mark = (t, k) => { try{ const o = got(t); o[k] = Date.now(); localStorage.setItem(key(t), JSON.stringify(o)); }catch(e){} };
  function build(){ const el = $('tlAct'), t = (typeof TLD !== 'undefined') ? TLD : null; if(!el || !t || el.dataset.tl4 === '1') return;
    const all = [...el.querySelectorAll('button, a.btn')], used = new Set();
    const one = re => { const b = all.find(x => !used.has(x) && re.test(x.textContent.trim())); if(b) used.add(b); return b || null; };
    const many = re => all.filter(x => !used.has(x) && re.test(x.textContent.trim())).map(x => (used.add(x), x));
    const pdfSend = one(/^(Send on WeChat|Send again on WeChat|Save PDF)/), pdfOpen = one(/^Open PDF/), loading = one(/^Loading PDF/);
    const pic = one(/^Copy picture/), picSave = one(/^(Share \/ save picture|Save picture)/), markB = one(/^(Mark as sent|Already sent)/), msg = one(/^Copy message/);
    const plan = one(/^Course plan/), cefr = one(/^CEFR picture/), price = one(/^Price picture/);
    const fu = many(/^(Following up|Thinking it over|Unreachable|Not now)$/), enrol = one(/^Enrolled · paid/), enrolT = one(/^Enrol$/), sched = one(/^Set class schedule/), agree = one(/^Agreement/);
    if(!pdfSend && !loading && !pic && !plan && !pdfOpen) return;   /* nothing we know yet */
    const rest = [...el.children];   /* the old step sections (now emptied) are dropped; anything else goes to More */
    const S = got(t), sent = t.status === 'Sent' || !!S.report;
    const steps = [
      { k: 'report', n: 1, title: 'Trial report', sub: pdfSend ? 'The PDF shows ' + esc(t.student) + '’s performance' : loading ? 'PDF loading · the picture works as soon as it is ready' : pdfOpen ? 'The PDF could not load here · open it from Drive' : 'The PDF is being made', main: pdfSend || pdfOpen || loading, links: [pic, picSave, msg].filter(Boolean), done: sent },
      { k: 'plan', n: 2, title: 'Course plan', sub: 'The book roadmap for the level', main: plan, done: !!S.plan },
      { k: 'cefr', n: 3, title: 'CEFR picture', sub: 'What the level means', main: cefr, done: !!S.cefr },
      { k: 'price', n: 4, title: 'Price', sub: 'The packages, when they are ready to decide', main: price, done: !!S.price }
    ].filter(s => s.main);
    const next = (steps.find(s => !s.done) || {}).k;
    const wrap = document.createElement('div'); wrap.className = 'tl4';
    wrap.innerHTML = '<div class="tl4-h">Send to the student · in this order</div><div class="tl4-card" id="tl4S"></div>' +
      '<div class="tl4-h">After sending</div><div class="tl4-card" id="tl4A"></div>';
    const card = wrap.querySelector('#tl4S');
    steps.forEach(s => { const r = document.createElement('div'); r.className = 'tl4-r' + (s.done ? ' done' : s.k === next ? ' next' : '');
      r.innerHTML = '<div class="tl4-n">' + (s.done ? '✓' : s.n) + '</div><div class="tl4-t"><b>' + s.title + '</b><span>' + s.sub + '</span></div><div class="tl4-a"></div>';
      const a = r.querySelector('.tl4-a'); s.main.classList.remove('grow', 'block', 'teal'); if(s.k !== 'report'){ s.main.textContent = 'Open'; } else r.classList.add('tl4-w'); a.appendChild(s.main);
      if(s.k === 'report' && markB && !sent){ markB.classList.remove('teal', 'grow'); a.appendChild(markB); }
      if(s.k !== 'report') s.main.addEventListener('click', () => { mark(t, s.k); setTimeout(() => { const o = $('tlAct'); if(o){ o.dataset.tl4 = ''; } }, 0); }, true);
      if(s.k === 'report'){ [markB, pdfSend].filter(Boolean).forEach(b => b.addEventListener('click', () => mark(t, 'report'), true)); }
      card.appendChild(r);
      if(s.links && s.links.length){ const l = document.createElement('div'); l.className = 'tl4-links';
        s.links.forEach(b => { const x = document.createElement('button'); x.type = 'button'; x.textContent = b === pic ? 'Copy picture instead' : b.textContent.trim(); x.disabled = b.disabled; x.onclick = ev => { ev.preventDefault(); b.click(); }; l.appendChild(x); b.style.display = 'none'; l.appendChild(b); });
        r.appendChild(l); } });
    const A = wrap.querySelector('#tl4A');
    const fr = document.createElement('div'); fr.className = 'tl4-r tl4-f';
    fr.innerHTML = '<div class="tl4-n">·</div><div class="tl4-t"><b>Follow up</b><span>' + esc((el.querySelector('.tlStep:nth-child(3) .mute') || {}).textContent || '').replace(/^\s*·\s*/, '') + '</span></div><div class="tl4-fu"></div>';
    fu.forEach(b => { b.classList.remove('grow', 'block'); fr.querySelector('.tl4-fu').appendChild(b); }); if(fu.length) A.appendChild(fr);
    const en = enrol || enrolT; if(en){ const r = document.createElement('div'); r.className = 'tl4-r';
      r.innerHTML = '<div class="tl4-n">·</div><div class="tl4-t"><b>Enrol</b><span>When the student has paid, or lessons are transferred</span></div><div class="tl4-a"></div>';
      en.classList.remove('grow', 'block', 'teal'); en.textContent = en.textContent.replace(/\s*·\s*record the first package/, ''); r.querySelector('.tl4-a').appendChild(en); A.appendChild(r); }
    if(sched || agree){ const r = document.createElement('div'); r.className = 'tl4-r';
      r.innerHTML = '<div class="tl4-n">·</div><div class="tl4-t"><b>Get started</b><span>After enrolling</span></div><div class="tl4-a"></div>';
      r.classList.add('tl4-w'); [sched, agree].filter(Boolean).forEach(b => { b.classList.remove('grow', 'block', 'teal'); r.querySelector('.tl4-a').appendChild(b); }); A.appendChild(r); }
    const left = all.filter(x => !used.has(x));
    el.innerHTML = ''; el.appendChild(wrap); left.forEach(b => wrap.querySelector('#tl4A').lastChild ? wrap.querySelector('#tl4A').lastChild.querySelector('.tl4-a, .tl4-fu').appendChild(b) : 0);
    el.classList.add('tl4'); el.dataset.tl4 = '1';
    /* Level + redo (they sit right after the actions) → More */
    try{ const sb = $('sheetBody'), more = document.createElement('details'); more.className = 'tl4-more'; more.innerHTML = '<summary>More · level on the report, ask the teacher to redo</summary>';
      let n = el.nextElementSibling; const mv = []; while(n){ mv.push(n); n = n.nextElementSibling; } mv.forEach(x => more.appendChild(x)); if(mv.length) wrap.appendChild(more); }catch(e){} }
  const _tb = window.tlBtns; if(_tb) window.tlBtns = function(){ const o = $('tlAct'); if(o) o.dataset.tl4 = ''; const r = _tb.apply(this, arguments); try{ build(); }catch(e){ console.warn('tl4', e); } return r; };
})();
