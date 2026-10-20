// 20 Oct · Teacher card: "With us 1 year, 5 months" and a journey line (Hired → rank since → Today), like the student page.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 449 · Misty: "add also the timeline of the teacher, length with us, years and months, like with the students".
   Under the header: "With us 1 year, 5 months · since 4 Oct 2025" and a line Hired → <rank> since … → Today, with lifetime units.
   The hire date comes from the TEACHERS sheet card (loaded in the background the first time, then kept). */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
.t46 .jy49{border:1px solid var(--line);border-radius:14px;background:#fff;padding:10px 16px 6px;margin-top:10px}
.t46 .jy49 .top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.t46 .jy49 .top b{font-family:var(--brand);font-weight:400;font-size:20px;color:var(--ink)}
.t46 .jy49 .top span{font-size:12.5px;color:#8A86A0}
.t46 .jy49 .ln{position:relative;height:58px;margin:4px 6px 0}
.t46 .jy49 .ln:before{content:'';position:absolute;left:0;right:0;top:16px;height:4px;border-radius:2px;background:linear-gradient(90deg,#CDE7E9,var(--rc))}
.t46 .jy49 .ms{position:absolute;top:0;text-align:center;transform:translateX(-50%);white-space:nowrap}
.t46 .jy49 .ms.f{transform:none;text-align:left}.t46 .jy49 .ms.l{transform:translateX(-100%);text-align:right}
.t46 .jy49 .ms i{display:block;width:14px;height:14px;border-radius:7px;margin:11px auto 4px;background:#fff;box-shadow:inset 0 0 0 4px var(--c)}
.t46 .jy49 .ms.f i{margin-left:0}.t46 .jy49 .ms.l i{margin-right:0}
.t46 .jy49 .ms b{font-size:12px;color:var(--ink)}
.t46 .jy49 .ms span{font-size:11.5px;color:#8A86A0;margin-left:5px}\`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pd = v => { if(!v) return null; const s = String(v).trim(); let m = s.match(/^(\\d{4})-(\\d{2})-(\\d{2})/); if(m) return new Date(+m[1], +m[2] - 1, +m[3]); const d = new Date(s); return isNaN(d) ? null : d; };
  const fd = d => d.getDate() + ' ' + MN[d.getMonth()] + ' ' + d.getFullYear();
  const len = (a, b) => { let mo = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(); if(b.getDate() < a.getDate()) mo--; mo = Math.max(0, mo); const y = Math.floor(mo / 12), m = mo % 12;
    if(!y && !m) return Math.max(1, Math.round((b - a) / 864e5)) + ' days'; return [y ? y + ' year' + (y > 1 ? 's' : '') : '', m ? m + ' month' + (m > 1 ? 's' : '') : ''].filter(Boolean).join(', '); };
  const asked = {};
  function html(name, me, card){ const f = (card && card.profile) || {}, cm = (card && card.me) || {}, hired = pd(f.hired), rk = pd(me.rankDate || cm.rankDate), now = new Date(); if(!hired) return '';
    const M = [[hired, 'Hired', '#9ED9DD', f.type || '']];
    if(rk && rk > hired && rk < now) M.push([rk, (me.rank || cm.rank || 'Rank') , 'var(--rc)', 'since']);
    M.push([now, 'Today', '#2B2253', (me.lifetime || 0).toLocaleString() + ' units']);
    const a = +M[0][0], sp = Math.max(1, now - a);
    return '<div class="jy49"><div class="top"><b>With us ' + len(hired, now) + '</b><span>since ' + fd(hired) + (f.status ? ' · ' + esc(f.status) : '') + '</span></div><div class="ln">' +
      M.map((x, i) => '<div class="ms' + (i === 0 ? ' f' : i === M.length - 1 ? ' l' : '') + '" style="left:' + Math.min(100, Math.max(0, (x[0] - a) / sp * 100)) + '%;--c:' + x[2] + '"><i></i><b>' + esc(x[1]) + '</b><span>' + (i === M.length - 1 ? esc(x[3]) : fd(x[0]) + (x[3] && i ? '' : '')) + '</span></div>').join('') + '</div></div>'; }
  function fill(name, me){ const el = document.getElementById('jy49'); if(!el) return; const c = (typeof TTC !== 'undefined' && (TTC[name] || TTC[String(name).replace(/^teacher\\s+/i, '')])) || null;
    if(c){ el.outerHTML = html(name, me, c) || ''; return; }
    if(asked[name]) return; asked[name] = 1;
    api('mgmtTeacherCard', TOKEN, name, false).then(r => { if(r && r.name){ try{ TTC[r.name] = r; }catch(e){} const e2 = document.getElementById('jy49'); if(e2 && e2.dataset.n === name) e2.outerHTML = html(name, me, r) || ''; } }).catch(() => 0); }
  const _t = window.tchHtml; if(!_t) return;
  window.tchHtml = function(name, p){ let h = _t.apply(this, arguments);
    try{ const me = (p && p.me) || {}, a = h.indexOf('<div class="kp">'); if(a < 0) return h;
      h = h.slice(0, a) + '<div id="jy49" data-n="' + esc(name) + '"></div>' + h.slice(a);
      setTimeout(() => fill(name, me), 0); }catch(e){ console.warn('jy49', e); }
    return h; };
})();
` + "</script>\n\n</body>"]]);
