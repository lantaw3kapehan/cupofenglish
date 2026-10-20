/* 20 Oct · 368 · The commendation / "leading" message also sits in the header, beside the teacher's name, on every screen (Misty: "so they always see it").
   Priority: Teacher of the Month (last month, hers) → Gold Excellence (last month, hers) → Gold so far → leading the team so far → within reach this month. Tap → My growth. */
(function(){
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);
  const prevYm = () => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  const mon = ym => { try{ return new Date(ym + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long' }); }catch(e){ return ''; } };
  function msg(K){ if(!K || !K.on) return null; const L = K.months || [], F = L.filter(x => x.final), f = F[F.length - 1], lv = L[L.length - 1];
    if(f && f.month === prevYm() && f.me && f.me.rank){ const w = f.top && f.top[0];
      if(f.me.rank === 1 && w && (w.level === 'Silver' || w.level === 'Gold')) return { c: 'g', t: '🏆 Teacher of the Month · ' + mon(f.month), s: '🏆 Teacher of the Month' };
      if(f.me.level === 'Gold') return { c: 'g', t: '🥇 Gold Excellence · ' + mon(f.month), s: '🥇 Gold Excellence' }; }
    if(lv && !lv.final && lv.me && lv.me.rank){ const me = lv.me, t = Number(me.total), nx = t < 65 ? ['Bronze', 65] : t < 78 ? ['Silver', 78] : t < 88 ? ['Gold', 88] : null, pts = nx ? Math.round((nx[1] - t) * 10) / 10 : 0;
      if(me.level === 'Gold') return { c: 'g', t: '✨ Gold standard so far · hold it to the end of ' + mon(lv.month), s: '✨ Gold so far' };
      if(me.rank === 1) return { c: '', t: '🥇 Leading the team this month · ' + ((me.level === 'Silver') ? 'finish strong to be Teacher of the Month' : 'reach Silver to be Teacher of the Month'), s: '🥇 Leading the team' };
      if(nx && pts <= 3) return { c: '', t: '⭐ ' + pts + ' points to ' + nx[0] + ' · within reach this month', s: '⭐ ' + pts + ' to ' + nx[0] }; }
    return null; }
  function head(K){ try{ const sp = document.querySelector('header .hd .sp'); if(!sp) return; let el = $('cmHead');
    const m = isT() ? msg(K) : null; if(!m){ if(el) el.remove(); return; }
    if(!$('cmHeadCss')){ const s = document.createElement('style'); s.id = 'cmHeadCss'; s.textContent = 'header .hd .sp{display:flex;justify-content:center;align-items:center;min-width:0}' +
      '#cmHead{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:7px 14px;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#eef7f5;color:#1e6b61;border:1px solid #bfe3dc}' +
      '#cmHead.g{background:linear-gradient(135deg,#fff8dc,#f6d77a);color:#5a3d00;border-color:#d4a017}#cmHead .s{display:none}' +
      '@media(max-width:820px){#cmHead .l{display:none}#cmHead .s{display:inline}#cmHead{font-size:12px;padding:5px 10px}}' +
      '#cmHead .i{display:none}@media(max-width:520px){#cmHead .s{display:none}#cmHead .i{display:inline;font-size:18px}#cmHead{padding:4px 8px}}';
      document.head.appendChild(s); }
    if(!el){ el = document.createElement('span'); el.id = 'cmHead'; el.title = 'Teacher Excellence · tap for details'; el.onclick = () => { try{ go('growth'); }catch(e){} }; sp.appendChild(el); }
    el.className = m.c; const h = '<span class="l">' + esc(m.t) + '</span><span class="s">' + esc(m.s) + '</span><span class="i">' + esc(m.s.split(' ')[0]) + '</span>'; if(el.innerHTML !== h) el.innerHTML = h; }catch(e){} }
  const k0 = window.kxCommend; window.kxCommend = function(K){ const r = k0 ? k0.apply(this, arguments) : undefined; head(K); return r; };
})();
