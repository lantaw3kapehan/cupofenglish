// 2720 (Misty 22 Nov 19:07, mock approved): Teacher Today class cards, cleaner ·
//   the four status pills become a progress bar (In · Homework · Note · Video) at the right of the name, green = done, coral = to do, grey = later, with "3 of 4" / "All done ✓"
//   · the green "Class video uploaded" box folds into the bar (only what is left keeps a box) · Check homework, Give homework and
//   Writing correction under one "Homework ▾" button · the I'm in time and the internet speed as small grey text.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`  const pill = (st, lab, on, tip) => '<span class="' + st + '" title="' + esc(tip || '') + '"' + (on && st === 'n' ? ' onclick="' + on + '"' : '') + '><i>' + (st === 'd' ? '✓' : st === 'n' ? '!' : '') + '</i>' + lab + '</span>';`,
   `  const pill = (st, lab, on, tip) => '<span class="' + st + '" title="' + esc(tip || '') + '"' + (on && st === 'n' ? ' onclick="' + on + '"' : '') + '><i>' + (st === 'd' ? '✓' : st === 'n' ? '!' : '') + '</i><b>' + lab + '</b></span>';
  /* 2720: the pills drawn as a progress bar (CSS below) · the count after it */
  const css20 = document.createElement('style'); css20.textContent = \`
#v-today .cls .row:has(> .cs93){flex-wrap:wrap}
#v-today .cs93.p20{margin:0 0 0 auto;display:grid;grid-template-columns:repeat(4,minmax(48px,64px)) auto;column-gap:4px;row-gap:3px;align-items:center}
#v-today .cs93.p20 span{display:flex;flex-direction:column;align-items:center;gap:4px;padding:0;background:none!important;border-radius:0;font-size:11px;font-weight:600;line-height:1.1}
#v-today .cs93.p20 span i{display:none}
#v-today .cs93.p20 span::before{content:'';display:block;width:100%;height:8px;border-radius:4px;background:#E6E4EE}
#v-today .cs93.p20 .d::before{background:#1D9E75} #v-today .cs93.p20 .d{color:#0F6E56} #v-today .cs93.p20 .d b::after{content:' ✓'}
#v-today .cs93.p20 .n::before{background:#F0997B} #v-today .cs93.p20 .n{color:#993C1D}
#v-today .cs93.p20 .l{color:#8A879C}
#v-today .cs93.p20 b{font-weight:600;white-space:nowrap;max-width:96px;overflow:hidden;text-overflow:ellipsis}
#v-today .cs93.p20 em{grid-row:1 / span 2;font-style:normal;font-size:12px;color:#6C6786;white-space:nowrap;margin-left:6px;align-self:start}
#v-today .cs93.p20 em.ok{color:#0F6E56;font-weight:700}
#v-today .cls.f93 .hw[style*="#BFE3D2"]{display:none}
#v-today .cls.f93 .cact .chip:not(.red):not(.coral){background:none!important;border:0!important;padding:0 2px!important;font-size:11.5px!important;font-weight:500!important;color:#8A879C!important}
#v-today .cls.f93 .cact .chip.red,#v-today .cls.f93 .cact .chip.coral{font-size:11.5px!important}
#v-today .hg20{position:relative;display:inline-block}
#v-today .hg20 > .btn::after{content:' ▾';font-size:10px}
#v-today .hg20 .m20{display:none;position:absolute;z-index:30;top:100%;left:6px;margin-top:4px;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 8px 24px rgba(30,26,60,.14);padding:6px;flex-direction:column;gap:2px;min-width:190px}
#v-today .hg20.on .m20{display:flex}
#v-today .hg20 .m20 .btn{margin:0!important;width:100%;justify-content:flex-start;text-align:left;border:0;background:transparent}
#v-today .hg20 .m20 .btn:hover{background:#F4F3F8}
@media(max-width:700px){#v-today .cs93.p20{margin:6px 0 0 0;width:100%}}\`; document.head.appendChild(css20);
  window.hg2720 = function(el, ev){ if(ev) ev.stopPropagation(); const w = el.closest('.hg20'); const on = !w.classList.contains('on'); document.querySelectorAll('#v-today .hg20.on').forEach(x => x.classList.remove('on')); if(on) w.classList.add('on'); };
  document.addEventListener('pointerdown', e => { if(!e.target.closest || !e.target.closest('.hg20')) document.querySelectorAll('#v-today .hg20.on').forEach(x => x.classList.remove('on')); }, true);
  function group20(){ const v = document.getElementById('v-today'); if(!v || !D || D.mgr) return;
    v.querySelectorAll('.cls').forEach(card => { if(card.querySelector('.hg20')) return; const act = card.querySelector('.cact'); if(!act) return;
      const B = [...card.querySelectorAll('button')].filter(b => /^(Check homework|Give homework|Writing correction)$/.test(b.textContent.trim()) && !b.closest('.hg20')); if(B.length < 2) return;
      const w = document.createElement('span'); w.className = 'hg20'; w.innerHTML = '<button type="button" class="btn ghost sm" style="margin:8px 0 0 6px" onclick="hg2720(this, event)">Homework</button><div class="m20"></div>';
      B[0].parentNode.insertBefore(w, B[0]); const m = w.querySelector('.m20'); B.forEach(b => { m.appendChild(b); b.addEventListener('click', () => w.classList.remove('on')); }); }); }
  window.group2720 = group20;`],
  [`      const top = card.querySelector('.grow > .small.mute') || card.querySelector('.grow > .row'); if(top) top.insertAdjacentHTML('afterend', html)`,
   `      const nd20 = [inSt, hwSt, noteSt, vSt].filter(x => x === 'd').length, html20 = html.replace('<div class="cs93">', '<div class="cs93 p20">').replace(/<\\/div>$/, '<em class="' + (nd20 === 4 ? 'ok' : '') + '">' + (nd20 === 4 ? 'All done ✓' : nd20 + ' of 4') + '</em></div>');
      const row20 = card.querySelector('.grow > .row'); if(row20){ row20.insertAdjacentHTML('beforeend', html20); card.classList.add('f93'); return; }
      const top = card.querySelector('.grow > .small.mute') || card.querySelector('.grow > .row'); if(top) top.insertAdjacentHTML('afterend', html)`],
  [`  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ paint(); }catch(e){ console.warn('cs93', e); } setTimeout(() => { try{ paint(); }catch(e){} }, 300); return r; };`,
   `  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ paint(); }catch(e){ console.warn('cs93', e); } setTimeout(() => { try{ paint(); window.group2720 && group2720(); }catch(e){} }, 300); setTimeout(() => { try{ window.group2720 && group2720(); }catch(e){} }, 1200); return r; };`],
]);
