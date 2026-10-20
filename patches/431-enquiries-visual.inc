/* 20 Oct · 431 · Enquiries screen (Misty: "Now, let's go to ENQUIRIES SCREEN").
   · Top of the Enquiries card: the funnel in one row · Logged → Trial booked (x%) → Enrolled (y%) · Not now; each number opens that list.
     Next to it: enquiries per month for 6 months, coloured by what happened (enrolled · trial booked · still open · not now). Click a month for Results.
   · Pictures & messages: numbered stages (1 Before the trial · 2 Trial booked · 3 Enrolling); cards are shorter (2-line description)
     and the buttons are soft tinted instead of heavy filled. Same buttons, same pictures. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-enquiry .fn31{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:12px;margin:10px 0 6px}
#v-enquiry .fn31 .fl{display:flex;align-items:stretch;gap:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
#v-enquiry .fn31 .st{flex:1;padding:12px 14px;cursor:pointer;position:relative;min-width:0}
#v-enquiry .fn31 .st:hover{background:#F6FAFA}
#v-enquiry .fn31 .st+.st{border-left:1px solid var(--line)}
#v-enquiry .fn31 .st em{display:block;font-style:normal;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-enquiry .fn31 .st b{font-family:var(--brand);font-weight:400;font-size:28px;color:var(--c);line-height:1.15}
#v-enquiry .fn31 .st small{font-size:12px;color:#8A86A0;margin-left:4px}
#v-enquiry .fn31 .st i{display:block;height:5px;border-radius:3px;background:var(--soft);margin-top:6px;overflow:hidden}
#v-enquiry .fn31 .st i:after{content:'';display:block;height:100%;width:var(--w);background:var(--c);border-radius:3px}
#v-enquiry .fn31 .st.ar:after{content:'›';position:absolute;right:-7px;top:50%;transform:translateY(-50%);width:14px;height:14px;border-radius:7px;background:#fff;border:1px solid var(--line);font-size:11px;line-height:12px;text-align:center;color:#8A86A0;z-index:1}
#v-enquiry .fn31 .mo{border:1px solid var(--line);border-radius:14px;background:#fff;padding:10px 14px 8px}
#v-enquiry .fn31 .mo .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0}
#v-enquiry .fn31 .bs{display:flex;align-items:flex-end;gap:8px;height:66px;margin-top:6px}
#v-enquiry .fn31 .bs>div{flex:1;display:flex;flex-direction:column-reverse;gap:2px;height:100%;cursor:pointer;position:relative}
#v-enquiry .fn31 .bs>div:hover{background:#F6FAFA;border-radius:4px}
#v-enquiry .fn31 .bs i{display:block;border-radius:2px}
#v-enquiry .fn31 .bs i:last-of-type{border-radius:3px 3px 0 0}
#v-enquiry .fn31 .bs b{position:absolute;left:0;right:0;text-align:center;font-size:10.5px;color:var(--ink)}
#v-enquiry .fn31 .ax{display:flex;gap:8px;font-size:10.5px;color:#8A86A0;margin-top:3px}
#v-enquiry .fn31 .ax span{flex:1;text-align:center}
#v-enquiry .fn31 .lg{display:flex;flex-wrap:wrap;gap:2px 10px;font-size:11px;color:#8A86A0;margin-top:4px}
#v-enquiry .fn31 .lg span{display:inline-flex;align-items:center;gap:4px}#v-enquiry .fn31 .lg i{width:8px;height:8px;border-radius:2px;display:inline-block}
#v-enquiry .eq2-g>h3 .n31{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:12px;background:var(--c);color:#fff;font-family:inherit;font-size:13px;font-weight:700;align-self:center}
#v-enquiry .eq2-g.s1{--c:#00A3AD}#v-enquiry .eq2-g.s2{--c:#D9962B}#v-enquiry .eq2-g.s3{--c:#2E9E6F}
#v-enquiry .eq2-grid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr))!important;gap:10px!important}
#v-enquiry .eq2-t{padding:12px 14px!important;gap:6px!important}
#v-enquiry .eq2-t b{font-size:15px}
#v-enquiry .eq2-t .small.mute{-webkit-line-clamp:2!important;font-size:13px}
#v-enquiry .eq2-t>button{min-height:34px!important;background:color-mix(in srgb,var(--c,#00A3AD) 12%,#fff)!important;color:color-mix(in srgb,var(--c,#00A3AD) 75%,#1E1A3A)!important;border:0!important;box-shadow:none!important;font-size:13.5px!important}
#v-enquiry .eq2-t>button:hover{background:var(--c,#00A3AD)!important;color:#fff!important}
@media(max-width:860px){#v-enquiry .fn31{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const list = () => { try{ return (JSON.parse(localStorage.getItem('coe.enq') || '[]') || []).filter(Boolean); }catch(e){ return []; } };
  function funnel(){ const L = list(); if(!L.length) return '';
    const tb = L.filter(e => e.st === 'Trial booked' || e.st === 'Enrolled' || e.trial).length, en = L.filter(e => e.st === 'Enrolled').length, no = L.filter(e => e.st === 'Not now').length, n = L.length;
    const pc = x => n ? Math.round(x / n * 100) : 0;
    const st = (k, l, v, c, sub, ar) => '<div class="st' + (ar ? ' ar' : '') + '" style="--c:' + c + ';--w:' + pc(v) + '%" onclick="enqF(\'' + k + '\')" title="Open: ' + l + '"><em>' + l + '</em><b>' + v + '</b><small>' + sub + '</small><i></i></div>';
    /* 6 months */
    const now = new Date(), M = []; for(let k = 5; k >= 0; k--){ const d = new Date(now.getFullYear(), now.getMonth() - k, 1); M.push({ k: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), l: MN[d.getMonth()], en: 0, tb: 0, op: 0, no: 0 }); }
    L.forEach(e => { const m = M.find(x => x.k === String(e.at || '').slice(0, 7)); if(!m) return; if(e.st === 'Enrolled') m.en++; else if(e.st === 'Not now') m.no++; else if(e.st === 'Trial booked' || e.trial) m.tb++; else m.op++; });
    const mx = Math.max(1, ...M.map(m => m.en + m.tb + m.op + m.no)), px = v => Math.round(v / mx * 50);
    const seg = (v, c) => v ? '<i style="height:' + px(v) + 'px;background:' + c + '"></i>' : '';
    const tot = M.reduce((a, m) => a + m.en + m.tb + m.op + m.no, 0);
    return '<div class="fn31"><div class="fl">' + st('all', 'Logged', n, '#2B2253', 'enquiries', 1) + st('trial', 'Trial booked', tb, '#00A3AD', pc(tb) + '%', 1) + st('enrolled', 'Enrolled', en, '#2E9E6F', pc(en) + '%', 0) + st('not', 'Not now', no, '#B0ADC0', pc(no) + '%', 0) + '</div>' +
      '<div class="mo"><div class="h"><span>Enquiries per month</span><span>' + tot + ' in 6 months</span></div><div class="bs">' +
      M.map(m => { const t = m.en + m.tb + m.op + m.no; return '<div onclick="enqF(\'results\')" title="' + m.l + ': ' + t + ' · enrolled ' + m.en + ' · trial ' + m.tb + ' · open ' + m.op + ' · not now ' + m.no + '">' + seg(m.en, '#2E9E6F') + seg(m.tb, '#00A3AD') + seg(m.op, '#E0A030') + seg(m.no, '#D6D3E0') + (t ? '<b style="bottom:' + (px(t) + 4) + 'px">' + t + '</b>' : '') + '</div>'; }).join('') +
      '</div><div class="ax">' + M.map(m => '<span>' + m.l + '</span>').join('') + '</div><div class="lg"><span><i style="background:#2E9E6F"></i>enrolled</span><span><i style="background:#00A3AD"></i>trial</span><span><i style="background:#E0A030"></i>open</span><span><i style="background:#D6D3E0"></i>not now</span></div></div></div>'; }
  function paint(){ const el = $('v-enquiry'); if(!el) return; const box = $('enqBox');
    if(box && !box.querySelector('.fn31')){ const h = funnel(), seg = box.querySelector('.seg'); if(h && seg) seg.insertAdjacentHTML('beforebegin', h); }
    el.querySelectorAll('.eq2-g').forEach(g => { const h3 = g.querySelector('h3'); if(!h3 || h3.querySelector('.n31')) return; const n = g.classList.contains('s1') ? 1 : g.classList.contains('s2') ? 2 : g.classList.contains('s3') ? 3 : 0; if(n) h3.insertAdjacentHTML('afterbegin', '<span class="n31">' + n + '</span>'); }); }
  const _r = window.renderEnq; if(_r) window.renderEnq = function(){ const r = _r.apply(this, arguments); try{ paint(); }catch(e){ console.warn('eq31', e); } return r; };
  const _l = window.enqLoad; if(_l) window.enqLoad = function(){ const p = _l.apply(this, arguments); Promise.resolve(p).then(() => { try{ const b = $('enqBox'); const f = b && b.querySelector('.fn31'); if(f){ f.remove(); paint(); } }catch(e){} }); return p; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') renderEnq(); }catch(e){}
})();
