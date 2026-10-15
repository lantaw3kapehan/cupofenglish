(function(){
  // Last time = the last progress check (per skill when known) and the last monthly feedback (Speaking/Listening/Reading /25).
  const SECS = [[0, 5, 20, 'Speaking', 's', 'speaking'], [5, 7, 8, 'Listening', 'l', 'listening'], [7, 9, 8, 'Reading', 'r', 'reading']];
  const LV = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const rubric = t => t <= 10 ? 'Pre-A1' : t <= 15 ? 'A1' : t <= 20 ? 'A2' : t <= 25 ? 'B1' : t <= 30 ? 'B2' : t <= 35 ? 'C1' : 'C2';
  const fd = d => { const x = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(x) ? String(d || '') : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
  const monName = m => { const x = new Date(String(m).slice(0, 7) + '-01T12:00:00'); return isNaN(x) ? String(m || '') : x.toLocaleDateString('en-GB', { month: 'long' }); };
  const picks = () => [...Array(9)].map((_, i) => { const b = document.querySelector('#pci' + i + ' .pc-o button.on b'); return b ? +b.textContent : 0; });
  const sum = (R, a, b) => R.slice(a, b).reduce((x, y) => x + y, 0);
  let CODE = '', BASE = null;
  function baseOf(s){
    if(!s) return null; const today = (D && D.today) || '', me = String((D.me || {}).name || '').toLowerCase();
    const chk = (s.checks || []).filter(c => c && c.date && c.date < today).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
    const F = (Array.isArray(s.feedback) ? s.feedback : []).filter(f => f && f.s != null && f.month).sort((a, b) => String(b.month).localeCompare(String(a.month)));
    const top = F.length ? F.filter(f => f.month === F[0].month) : [], fb = top.find(f => String(f.teacher || '').toLowerCase().split(' ')[0] === me) || top[0] || null;
    return chk || fb ? { chk, fb } : null; }
  function load(code){ let s = null; try{ s = JSON.parse(store('get', 'coe.stu.' + code) || 'null'); }catch(e){} BASE = baseOf(s);
    api('tStudent', TOKEN, code).then(x => { if(!x || CODE !== code) return; try{ store('set', 'coe.stu.' + code, JSON.stringify(x)); }catch(e){} const b = baseOf(x); if(JSON.stringify(b) !== JSON.stringify(BASE)){ BASE = b; inject(); } }).catch(() => {}); }
  const chip = (t, k) => '<span class="pc-lt' + (k ? ' ' + k : '') + '">' + t + '</span>';
  function marks(){ const R = picks(), B = BASE;
    document.querySelectorAll('#sheetBody .pc-sec[data-lt]').forEach(el => { const [a, b, mx, nm, k, ck] = SECS[+el.dataset.lt], now = sum(R, a, b), full = R.slice(a, b).every(Boolean);
      const was = B && B.chk && B.chk[ck] ? +B.chk[ck] : null, f = B && B.fb && B.fb[k] != null ? Math.round(+B.fb[k] / 25 * 100) : null;
      let h = ''; if(was != null) h += chip('Last check ' + was + '/' + mx); if(f != null) h += chip(monName(B.fb.month) + ' feedback ' + f + '%', 'fb');
      if(full){ const d = was != null ? now - was : null; h += chip('Now ' + now + '/' + mx + (d == null ? '' : d > 0 ? ' ▲+' + d : d < 0 ? ' ▼' + d : ' ='), d != null && d >= Math.ceil(mx / 4) ? 'hi' : 'now'); }
      const box = el.querySelector('.pc-ltb'); if(box) box.innerHTML = h; }); }
  function inject(){
    const body = $('sheetBody'); if(!body || !document.getElementById('pci0')) return; const B = BASE;
    if(!document.getElementById('ltCss')) document.head.insertAdjacentHTML('beforeend', '<style id="ltCss">.pc-lt{display:inline-block;background:#EEF4FB;color:#2B5C9E;border:1px solid #C9DAF0;border-radius:99px;padding:2px 10px;font-weight:800;font-size:12px;margin:2px 4px 2px 0;letter-spacing:0;text-transform:none}.pc-lt.fb{background:#F3F0FA;color:#5B3E96;border-color:#D8CDEE}.pc-lt.now{background:#EAF7F1;color:#1E7A55;border-color:#BFE3D2}.pc-lt.hi{background:#FDECEA;color:#C0392B;border-color:#F2B8A8}.pc-ltb{display:block;margin-top:4px}.pc-lt.sk{margin:0;align-self:center;white-space:nowrap}#ltCard .small{margin-top:3px}</style>');
    const old = $('ltCard'); if(old) old.remove();
    if(B){ const c = B.chk, f = B.fb;
      const card = '<div class="card" id="ltCard" style="margin-top:12px;background:#F5F8FD;border:1.5px solid #C9DAF0;border-left:5px solid #2B5C9E"><b style="color:#2B5C9E">Last time · compare with now</b>' +
        (c ? '<div class="small"><b>Last progress check</b> · ' + esc(fd(c.date)) + ' · ' + esc(tName(c.teacher)) + ' · Speaking ' + c.speaking + '/20 · Listening ' + c.listening + '/8 · Reading ' + c.reading + '/8 · <b>Total ' + c.total + '/36 · ' + esc(c.cefr || '') + '</b></div>' : '') +
        (f ? '<div class="small"><b>' + esc(monName(f.month)) + ' monthly feedback</b> · ' + esc(tName(f.teacher)) + ' · Speaking ' + f.s + '/25 · Listening ' + f.l + '/25 · Reading ' + f.r + '/25' + (f.w != null ? ' · Writing ' + f.w + '/25' : '') + (f.total ? ' · <b>' + f.total + '/100</b>' : '') + '</div>' : '') +
        '<div class="small mute">Rate what the student does <b>on their own today</b>. A big jump since last time needs a short reason before sending.</div></div>';
      const at = body.querySelector('details.card') || body.querySelector('.pc-sec'); if(at) at.insertAdjacentHTML('beforebegin', card); }
    body.querySelectorAll('.pc-sec').forEach(el => { const nx = el.nextElementSibling; if(!nx || !nx.classList.contains('pc-it')) return; const i = SECS.findIndex(s => el.textContent.trim().indexOf(s[3]) === 0); if(i < 0) return;
      el.dataset.lt = i; if(!el.querySelector('.pc-ltb')) el.insertAdjacentHTML('beforeend', '<span class="pc-ltb"></span>'); });
    const r9 = B && B.chk && Array.isArray(B.chk.r) && B.chk.r.length === 9 && B.chk.r.some(Boolean) ? B.chk.r : null;
    for(let i = 0; i < 9; i++){ const it = $('pci' + i); if(!it) continue; const row = it.querySelector('.row'); const o = it.querySelector('.pc-lt.sk'); if(o) o.remove();
      if(r9 && r9[i] && row) row.insertAdjacentHTML('beforeend', '<span class="pc-lt sk">Last check ' + r9[i] + '</span>'); }
    marks(); }
  const _iss = window.pcIssues;
  window.pcIssues = function(){ const out = _iss ? _iss() : []; try{
    const R = picks(); if(R.some(x => !x)) return out; const B = BASE, tot = R.reduce((a, b) => a + b, 0);
    if(R.every(x => x === R[0]) && R[0] !== 4) out.push('Every skill has the same score (' + R[0] + ') · look at each skill on its own');
    const n4 = R.filter(x => x === 4).length; if(n4 >= 6 && n4 < 9) out.push(n4 + ' of 9 skills are rated Excellent (4)');
    if(B && B.chk){ const days = (Date.parse(D.today) - Date.parse(B.chk.date)) / 864e5;
      if(days <= 120) SECS.forEach(([a, b, mx, nm, k, ck]) => { const now = sum(R, a, b), was = +B.chk[ck] || 0; if(was && now - was >= Math.ceil(mx / 4)) out.push(nm + ' went up ' + (now - was) + ' points since the last progress check (' + fd(B.chk.date) + ': ' + was + '/' + mx + ' → ' + now + '/' + mx + ')'); });
      const l0 = LV.indexOf(B.chk.cefr), l1 = LV.indexOf(rubric(tot)); if(days <= 90 && l0 > -1 && l1 > l0) out.push('Up ' + (l1 - l0) + ' CEFR level' + (l1 - l0 > 1 ? 's' : '') + ' since the last progress check ' + Math.round(days) + ' days ago (' + B.chk.cefr + ' → ' + LV[l1] + ')'); }
    if(B && B.fb) SECS.forEach(([a, b, mx, nm, k]) => { const now = Math.round(sum(R, a, b) / mx * 100), f = Math.round(+B.fb[k] / 25 * 100); if(f && now - f >= 25) out.push(nm + ' is ' + now + '% now but ' + f + '% in the ' + monName(B.fb.month) + ' monthly feedback'); });
  }catch(e){} return out; };
  const _pf = window.pcForm; window.pcForm = function(code){ CODE = code; BASE = null; try{ load(code); }catch(e){} return _pf.apply(this, arguments); };
  const _pp = window.pcPaint; window.pcPaint = function(){ const r = _pp.apply(this, arguments); try{ inject(); }catch(e){ console.warn('last time', e); } return r; };
  const _pk = window.pcPick; window.pcPick = function(){ const r = _pk.apply(this, arguments); try{ marks(); }catch(e){} return r; };
})();
