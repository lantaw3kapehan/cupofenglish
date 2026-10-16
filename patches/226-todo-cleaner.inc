/* 16 Oct · Misty: "To do · how to make this way better" + "Trials & enrolment should be in Overview".
   To do is now only things to act on:
   · Trials & enrolment (and the month-so-far line) moved to Overview;
   · Renewals: "Coming up", "Paused or not renewing" and "Renewed ✓" fold into one line each (tap to open), so
     "Act now" and "This month" are what you see first;
   · one validity chip per student ("Validity ended 7 Jul · extended 101 days") instead of two;
   · student codes no longer break over two lines; "2 a month" reads "2 lessons a month". */
(function(){
  document.head.insertAdjacentHTML('beforeend', `<style>
  #v-mtoday .tdr .mute.small{white-space:nowrap}
  #v-mtoday details.tdgx{margin-top:6px}
  #v-mtoday details.tdgx>summary{list-style:none;cursor:pointer;border-radius:12px}
  #v-mtoday details.tdgx>summary::-webkit-details-marker{display:none}
  #v-mtoday details.tdgx>summary .tdg{margin:10px 0 4px}
  #v-mtoday details.tdgx>summary:hover .tdgm{color:var(--teal,#00A3AD)}
  #v-mtoday .tdgm{margin-left:auto;font-size:12.5px;font-weight:700;letter-spacing:0;text-transform:none;color:var(--mute)}
  #v-mtoday details.tdgx[open] .tdgm::before{content:"Hide"}#v-mtoday details.tdgx:not([open]) .tdgm::before{content:"Show"}
  #v-mtoday .chip.vend{background:#FBEFE3;color:#9A4E12;font-weight:700;opacity:1}
  </style>`);
  const OPEN = new Set();
  function fold(){ const R = document.querySelector('#v-mtoday #td-renew'); if(!R) return;
    R.querySelectorAll(':scope > .tdg.later, :scope > .tdg.closed, :scope > .tdg.done').forEach(g => {
      const lv = ['later', 'closed', 'done'].find(c => g.classList.contains(c)), rows = []; let n = g.nextElementSibling;
      while(n && !n.classList.contains('tdg') && n.tagName !== 'DETAILS'){ rows.push(n); n = n.nextElementSibling; }
      const d = document.createElement('details'); d.className = 'tdgx'; if(OPEN.has(lv)) d.open = true;
      d.addEventListener('toggle', () => { d.open ? OPEN.add(lv) : OPEN.delete(lv); });
      g.parentNode.insertBefore(d, g); const s = document.createElement('summary'); s.appendChild(g); g.insertAdjacentHTML('beforeend', '<span class="tdgm"> ›</span>'); d.appendChild(s); rows.forEach(r => d.appendChild(r)); }); }
  const base = window.renderMToday;
  window.renderMToday = function(){ const r = base.apply(this, arguments); try{ fold(); }catch(e){ console.warn('todo fold', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') renderMToday(); }catch(e){}

  // ── Overview › Trials & enrolment (from the TODAY tab, the same numbers that were on To do)
  document.head.insertAdjacentHTML('beforeend', `<style>
  .ov-te{margin-top:18px}.ov-te .tdp{margin-top:6px;border:0;background:var(--tint,#F2FAF9)}
  .ov-te .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
  .ov-te .stat{padding:12px 14px;border-radius:14px;border:1px solid var(--line,#E4E2EC);background:#fff}
  .ov-te .stat b{display:block;font-family:var(--brand);font-size:26px;color:var(--ink,#2B2253)}.ov-te .stat span{font-size:12.5px;color:var(--mute)}
  .ov-te h3{font-size:13px;margin:14px 0 4px;color:var(--ink2)}
  .ov-te details{margin-top:10px}.ov-te details>summary{cursor:pointer;font-weight:700;font-size:13.5px;color:var(--ink2);list-style:none}
  .ov-te details>summary::-webkit-details-marker{display:none}.ov-te details>summary::after{content:" ›"}
  @media(max-width:640px){.ov-te .stats{grid-template-columns:1fr}}
  </style>`);
  let OPN = false;
  function teHtml(){ if(!isPres() && !(D && D.mgr)) return ''; if(typeof TD === 'undefined' || !TD || !TD.rows) return ''; let S = null; try{ S = tdParse(TD.rows); }catch(e){ return ''; } if(!S) return '';
    const T = S.sec.trend, C = S.sec.conv, B = S.sec.byt, PL = S.sec.plans; let h = '';
    if(S.pulseH && S.pulse){ const H = S.pulseH, V = S.pulse, tiles = []; let vs = '';
      H.forEach((x, j) => { if(!x || /^vs/i.test(x)) return; const dl = /^vs/i.test(H[j + 1] || '') ? V[j + 1] : '', up = /▲/.test(dl), dn = /▼/.test(dl); if(dl && !vs) vs = String(H[j + 1]).replace(/^vs\s*/i, '');
        tiles.push(`<span class="tdp-i"><b class="num">${esc(V[j] || '—')}</b> ${esc(x.toLowerCase())}${dl ? ` <em class="${up ? 'up' : dn ? 'dn' : ''}">${esc(dl)}</em>` : ''}</span>`); });
      h += `<div class="tdp"><span class="tdp-l">${esc(/so far/i.test(V[0] || '') ? V[0] : (V[0] || 'This month') + ' so far')}</span>${tiles.join('')}${vs ? `<span class="tdp-vs">▲▼ vs ${esc(vs.charAt(0).toUpperCase() + vs.slice(1))}</span>` : ''}</div>`; }
    if(C && C.rows.length) h += `<div class="stats">${C.rows.slice(0, 3).map(r => `<div class="stat"><b class="num">${esc(r[3] || '—')}</b><span>${esc(r[0])} · ${esc(r[2])} of ${esc(r[1])} enrolled</span></div>`).join('')}</div>`;
    if(T && T.rows.length){ const mx = Math.max(1, ...T.rows.map(r => +r[1] || 0));
      h += `<h3>Monthly trend</h3><div class="tdbars">${T.rows.slice().reverse().map(r => `<div title="${esc(r[0])}: ${esc(r[1])} trials, ${esc(r[2])} enrolled (${esc(r[3] || '')})"><div class="bw"><i style="height:${Math.round((+r[1] || 0) / mx * 100)}%"></i><i class="e" style="height:${Math.round((+r[2] || 0) / mx * 100)}%"></i></div><span>${esc(String(r[0]).slice(0, 3))}</span></div>`).join('')}</div>
<div class="small mute" style="margin-top:4px"><span class="tdk"></span> trials <span class="tdk e"></span> enrolled</div>`; }
    let more = '';
    if(B && B.rows.length) more += `<h3>By teacher · last 12 months</h3>` + grid([B.head.map(x => x.charAt(0) + x.slice(1).toLowerCase())].concat(B.rows.map(r => [tName(r[0])].concat(r.slice(1)))));
    if(PL && PL.rows.length) more += `<h3>Plans chosen vs ★ suggested</h3>` + grid([PL.head].concat(PL.rows)) + (PL.note ? `<div class="small mute">${esc(PL.note)}</div>` : '');
    if(more) h += `<details ${OPN ? 'open' : ''} ontoggle="window._ovTeO=this.open">${'<summary>By teacher and plans</summary>'}${more}</details>`;
    return h ? `<section class="ov-card ov-te"><div class="ov-hd"><h2>Trials &amp; enrolment</h2><a class="lk" onclick="go('mtoday');setTimeout(()=>tdJump('follow'),80)">Trial follow-ups ›</a></div>${h}</section>` : ''; }
  const bh = window.renderHome;
  window.renderHome = function(){ const r = bh.apply(this, arguments);
    try{ OPN = !!window._ovTeO; const v = $('v-home'), ov = v && v.querySelector('.ov2'); if(ov && !ov.querySelector('.ov-te')){ const x = teHtml(); if(x){ const f = ov.querySelector('.o2-foot'); f ? f.insertAdjacentHTML('beforebegin', x) : ov.insertAdjacentHTML('beforeend', x); } } }catch(e){ console.warn('ov trials', e); }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); }catch(e){}
})();
