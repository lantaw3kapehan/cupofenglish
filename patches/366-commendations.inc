/* 20 Oct · 366 · Commendations (Misty: "being first place despite being silver, can there be a commendable message too … gold should deserve the gold commendation and wordings")
   Two separate recognitions, from the final month (Teacher Excellence):
   · Teacher of the Month: the final 1st place, when at least Silver (and ranked = taught the minimum classes). Everyone sees it on Today for the first 7 days of the next month.
   · Gold Excellence: every teacher who finished Gold (88+), her own commendation. A Gold winner gets both.
   The teacher's own commendation stays on My growth for the whole next month. During the month: gentle "leading so far" / "Gold so far" lines (places change daily). */
(function(){
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);
  const T = n => { try{ return 'Teacher ' + tName(n); }catch(e){ return 'Teacher ' + n; } };
  const UP = { Silver: 1, Gold: 1 };
  const lastFinal = K => { const L = (K && K.months || []).filter(x => x.final); return L[L.length - 1] || null; };
  const live = K => { const L = (K && K.months || []); const m = L[L.length - 1]; return m && !m.final ? m : null; };
  const prevYm = () => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  const css = () => { if($('cmCss')) return; const s = document.createElement('style'); s.id = 'cmCss'; s.textContent =
    '.cm-card{border-radius:20px;padding:18px 74px 18px 20px;margin:0 0 14px;position:relative;overflow:hidden}' +
    '.cm-gold{background:linear-gradient(135deg,#fff8dc,#f9e08b 55%,#e9c046);border:2px solid #d4a017;color:#3b2400}' +
    '.cm-totm{background:linear-gradient(135deg,#f5fbfa,#e3f3f0);border:2px solid #2a9d8f;color:#123c37}' +
    '.cm-card .cm-k{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;opacity:.75}' +
    '.cm-card h3{font:800 24px/1.15 var(--brand,inherit);margin:4px 0 6px}' +
    '.cm-card p{margin:0;font-size:15px;line-height:1.5}' +
    '.cm-card .cm-sig{margin-top:10px;font-size:12px;opacity:.75}' +
    '.cm-card .cm-ic{position:absolute;right:14px;top:10px;font-size:46px;opacity:.9}' +
    '.cm-line{border-radius:14px;padding:10px 14px;margin:0 0 12px;font-size:14px;background:#f5fbfa;border:1px dashed #2a9d8f;color:#1e5e56}' +
    '.cm-line.g{background:#fffaf0;border-color:#d4a017;color:#6b4a00}';
    document.head.appendChild(s); };
  function goldHtml(m){ return `<section class="cm-card cm-gold" data-cm="1"><span class="cm-ic">🥇</span><div class="cm-k">Gold Excellence · ${esc(m.label)}</div>
<h3>You reached Gold, our highest standard.</h3><p>A score of ${esc(String(m.me.total))} puts you among the very best teachers at CupOfEnglish. Gold is earned, not given: excellent lessons, being there on time for every student, and students who truly grow with you. Thank you for setting the standard for the whole team.</p>
<div class="cm-sig">With pride and gratitude · CupOfEnglish management</div></section>`; }
  function totmHtml(m, mine){ const w = m.top[0], gold = w.level === 'Gold';
    return mine ? `<section class="cm-card cm-totm" data-cm="1"><span class="cm-ic">🏆</span><div class="cm-k">Teacher of the Month · ${esc(m.label)}</div>
<h3>Congratulations · you are our Teacher of the Month!</h3><p>First place among all our teachers${gold ? ', at Gold' : ''}. Your care, consistency and the progress of your students made the difference this month. Thank you for leading by example.</p>
<div class="cm-sig">With thanks · CupOfEnglish management</div></section>`
    : `<section class="cm-card cm-totm" data-cm="1"><span class="cm-ic">🏆</span><div class="cm-k">Teacher of the Month · ${esc(m.label)}</div>
<h3>Congratulations, ${esc(T(w.name))}!</h3><p>First place among all our teachers${gold ? ', at Gold' : ''}. Thank you for the care and consistency you brought to every class.</p>
<div class="cm-sig">${m.top.map((t, i) => ['1st', '2nd', '3rd'][i] + ' · ' + esc(T(t.name)) + (t.level ? ' (' + esc(t.level) + ')' : '')).join(' · ')}</div>
<button class="btn sm ghost" style="margin-top:10px" onclick="go('growth')">See my month</button></section>`; }
  function liveLine(m){ const me = m.me || {}; if(!me.rank) return '';
    const end = (() => { try{ return new Date(m.month + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long' }); }catch(e){ return 'the month'; } })();
    if(me.level === 'Gold') return `<div class="cm-line g" data-cm="1">✨ <b>Gold standard so far.</b> Hold it to the end of ${esc(end)} for the Gold Excellence commendation${me.rank === 1 ? ', and you are leading the team too' : ''}.</div>`;
    if(me.rank === 1) return `<div class="cm-line" data-cm="1">🥇 <b>You are leading the team this month.</b> ${UP[me.level] ? 'Finish strong to be Teacher of the Month for ' + esc(end) + '.' : 'Reach Silver (78) by the end of ' + esc(end) + ' to be Teacher of the Month.'}</div>`;
    return ''; }
  const put = (el, html) => { const t = document.createElement('div'); t.innerHTML = html; const lead = el.querySelector('.lead'); [...t.children].reverse().forEach(c => { if(lead && lead.nextSibling) el.insertBefore(c, lead.nextSibling); else el.insertBefore(c, el.firstChild); }); };
  window.kxCommend = function(K){ try{
    document.querySelectorAll('[data-cm]').forEach(x => x.remove()); const o = $('kxTotm'); if(o) o.remove();
    if(!isT() || !K || !K.on) return; css();
    const f = lastFinal(K), recent = f && f.month === prevYm(), me = (f && f.me) || {}, w = f && f.top && f.top[0];
    const isTotm = !!(w && w.rank === 1 && UP[w.level]), mineTotm = isTotm && me.rank === 1, mineGold = !!(f && me.rank && me.level === 'Gold');
    if(typeof VIEW !== 'undefined' && VIEW === 'today'){ const el = $('v-today'); if(el && recent && new Date().getDate() <= 7){ let h = '';
      if(isTotm) h += totmHtml(f, mineTotm); if(mineGold) h += goldHtml(f); if(h) put(el, h); } }
    if(typeof VIEW !== 'undefined' && VIEW === 'growth'){ const el = $('v-growth'); if(el){ let h = ''; const l = live(K); if(l) h += liveLine(l);
      if(recent){ if(mineTotm) h += totmHtml(f, true); if(mineGold) h += goldHtml(f); }
      if(h){ const card = $('kxCard'); if(card){ const t = document.createElement('div'); t.innerHTML = h; [...t.children].forEach(c => card.parentNode.insertBefore(c, card)); } else put(el, h); } } }
  }catch(e){ console.warn('commend', e); } };
  const _r = window.render; if(_r) window.render = function(){ const x = _r.apply(this, arguments); setTimeout(() => { try{ if(window._KX) kxCommend(window._KX); }catch(e){} }, 60); return x; };
})();
