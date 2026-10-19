  try{ if(!document.getElementById("kxCss")){ const st = document.createElement("style"); st.id = "kxCss"; st.textContent = "#kxCard{--kxc:2}@media (max-width:640px){#kxCard{--kxc:1}}"; document.head.appendChild(st); } }catch(e){}
  // 296 · on a laptop (wide side menu) the live summary sits in the side menu under Pay, instead of the header line
  const sideOn = () => { const n = document.querySelector('nav'); return !!(n && n.offsetWidth >= 200 && isT()); };
  function side(){ const nav = $('navIn'); if(!nav) return; let box = $('kxSide'); const m = cur();
    if(!sideOn() || !K || !K.on || !m){ if(box) box.remove(); return; }
    const me = m.me || {}, t = Number(me.total), LC = { Developing: '#9aa5b1', Bronze: '#c98a4b', Silver: '#8f9bab', Gold: '#d4a017' }, pos = v => Math.max(0, Math.min(100, v));
    const at = new Date(Kat || Date.now()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const H = K.months.filter(x => x.me && x.me.total != null).slice(-6), W = 180, HH = 44, lo = 40, px = i => H.length < 2 ? W / 2 : 8 + i * (W - 16) / (H.length - 1), py = v => 6 + (100 - Math.max(lo, Math.min(100, v))) / (100 - lo) * (HH - 12);
    const spark = H.length ? `<svg viewBox="0 0 ${W} ${HH}" style="width:100%;height:${HH}px;display:block;margin-top:8px">${[[55, 'Bronze'], [70, 'Silver'], [85, 'Gold']].map(l => `<line x1="0" x2="${W}" y1="${py(l[0])}" y2="${py(l[0])}" stroke="${LC[l[1]]}" stroke-dasharray="2 3" opacity=".7"/>`).join('')}${H.length > 1 ? `<polyline fill="none" stroke="var(--ink)" stroke-width="1.6" opacity=".5" points="${H.map((x, i) => px(i) + ',' + py(x.me.total)).join(' ')}"/>` : ''}${H.map((x, i) => `<circle cx="${px(i)}" cy="${py(x.me.total)}" r="4.5" fill="${LC[x.me.level] || '#bbb'}" stroke="#fff" stroke-width="1.5"><title>${esc(x.label)} · ${x.me.total}</title></circle>`).join('')}</svg><div class="row" style="justify-content:space-between;font-size:10px;color:#999">${H.map(x => `<span>${esc(mShort(x.month).slice(0, 3))}${x.final ? '' : '*'}</span>`).join('')}</div>` : '';
    const html = `<div style="font-size:10px;letter-spacing:.12em;color:#9a9aae;text-transform:uppercase">Excellence · this month</div>
<div style="display:flex;align-items:center;gap:8px;margin-top:6px"><span style="font-size:26px;line-height:1">${me.rank ? (MED[me.level] || '') : '🌱'}</span><div><b style="font-size:16px">${me.rank ? esc(me.level) : 'Not ranked yet'}</b><div class="small mute">${esc(mShort(m.month))}${m.final ? '' : ' so far'}${me.rank ? ' · ' + ord(me.rank) + ' place' : ''}</div></div></div>
${me.rank && t >= 0 ? `<div style="position:relative;height:6px;border-radius:4px;overflow:hidden;background:#eef0f2;margin-top:10px">${[[0, 55, 'Developing'], [55, 70, 'Bronze'], [70, 85, 'Silver'], [85, 100, 'Gold']].map(s => `<div style="position:absolute;left:${s[0]}%;width:${s[1] - s[0]}%;top:0;bottom:0;background:${LC[s[2]]};opacity:${me.level === s[2] ? 1 : .3}"></div>`).join('')}<div style="position:absolute;left:${pos(t)}%;top:-1px;width:8px;height:8px;border-radius:50%;background:var(--ink);transform:translateX(-50%)"></div></div>
<div class="small" style="color:#2a9d8f;font-weight:700;margin-top:6px">${gap(me)}</div>` : ''}
${spark}
<div style="font-size:11px;color:#2a9d8f;margin-top:6px"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#2a9d8f;margin-right:4px;vertical-align:middle"></span>${m.final ? 'Final' : 'Live · updated ' + at}</div>`;
    if(!box){ box = document.createElement('div'); box.id = 'kxSide'; box.title = 'Teacher Excellence · tap for details';
      box.style.cssText = 'margin:16px 4px 8px;padding:12px 12px 10px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,#fbfaf7,#fff);cursor:pointer';
      box.onclick = () => { try{ go('growth'); setTimeout(() => { const c = $('kxCard'); if(c) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250); }catch(e){} }; }
    if(box.innerHTML !== html) box.innerHTML = html;
    if(box.parentNode !== nav || nav.lastElementChild !== box) nav.appendChild(box); }
  addEventListener('resize', () => { try{ side(); badge(); }catch(e){} });
  const _bn = window.buildNav; if(_bn) window.buildNav = function(){ const x = _bn.apply(this, arguments); try{ side(); }catch(e){} return x; };
