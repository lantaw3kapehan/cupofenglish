/* 16 Oct · Misty: Sheren was added as a trial class in Schedule (Mon 19 Oct) but the Trials screen did not show her —
   it only listed trials whose report was in. Trials now starts with "Booked trial classes": every trial class in the
   calendar (…-TC) from 4 days back to 30 days ahead that has no report yet, straight from Schedule, so nothing is typed
   twice. Coming classes show "Booked" (and "moved from …"); a class that has passed shows "Report not in yet". */
(function(){
  document.head.insertAdjacentHTML('beforeend', `<style>
  #tpBk{margin-top:14px}#tpBk h2{display:flex;align-items:baseline;gap:10px;margin:0 0 6px;font-size:18px}
  #tpBk .tpb{display:flex;align-items:center;gap:14px;padding:10px;border-radius:14px;cursor:pointer}
  #tpBk .tpb:hover{background:#F7F9FA}
  #tpBk .tpb-d{width:52px;flex:none;text-align:center;border-radius:12px;background:#EEF7F8;padding:6px 0;color:#00666D}
  #tpBk .tpb-d b{display:block;font-family:var(--brand);font-size:20px;line-height:1.1}#tpBk .tpb-d span{font-size:11px;font-weight:700;text-transform:uppercase}
  #tpBk .tpb.past .tpb-d{background:#FFF4E5;color:#9A5B12}
  </style>`);
  let TPA = null, TPA_AT = 0, busy = false;
  const up = s => String(s || '').trim().toUpperCase();
  function load(){ if(busy || (TPA && Date.now() - TPA_AT < 2 * 6e4) || !TOKEN || !(D && D.mgr)) return; busy = true;
    fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'trialsAhead', token: TOKEN }) }).then(x => x.json())
      .then(r => { if(r && r.ok){ TPA = r.rows || []; TPA_AT = Date.now(); if(VIEW === 'trials') renderTP(); } }).catch(() => {}).finally(() => { busy = false; }); }
  function hasReport(x){ const R = (typeof TRL !== 'undefined' && TRL && TRL.rows) || [], c = up(x.code), d0 = ymdLocal(new Date(new Date(x.moved || x.start).getTime() - 3 * 864e5)), f = typeof tfuFirst === 'function' ? tfuFirst(x.student) : String(x.student || '').toLowerCase();
    return R.some(r => String(r.date || '') >= d0 && ((/^ST-/.test(c) && up(r.code) === c) || (typeof tfuFirst === 'function' && tfuFirst(r.student) === f))); }
  function html(){ if(!TPA) return ''; const q = String((typeof TPQ !== 'undefined' && TPQ) || '').trim().toLowerCase(), now = Date.now();
    const L = TPA.filter(x => !hasReport(x)).filter(x => !q || [x.student, x.code, x.teacher, x.book].join(' ').toLowerCase().indexOf(q) > -1);
    if(!L.length) return q ? '' : '';
    const dw = d => d.toLocaleDateString('en-GB', { weekday: 'short' }), dd = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    return `<section class="sec" id="tpBk"><h2>Booked trial classes <span class="c">${L.length} · from Schedule · tap to open the student</span></h2>${L.map(x => { const s = new Date(x.start), past = new Date(x.end || x.start).getTime() < now, today = ymdLocal(s) === ymdLocal(new Date());
      const chip = past ? '<span class="chip amber">Report not in yet</span>' : today ? '<span class="chip teal">Today ' + tm(x.start) + '</span>' : '<span class="chip teal">Booked</span>';
      return `<div class="tpb ${past ? 'past' : ''}" onclick="${x.code ? `openStudent('${esc(x.code)}')` : ''}"><div class="tpb-d"><b>${s.getDate()}</b><span>${dw(s)}</span></div>
<div class="grow" style="min-width:0"><div><b>${esc(x.student || '—')}</b> <span class="mute small">${esc(x.code || 'no code yet')}</span></div>
<div class="small">${tm(x.start)} · Teacher ${esc(tName ? String(tName(x.teacher)).replace(/^Teacher\s+/, '') : x.teacher)}${x.book ? ' · ' + esc(x.book) : ''}${x.moved ? ' · <span class="mute">moved from ' + esc(dd(new Date(x.moved))) + '</span>' : ''}</div></div>${chip}</div>`; }).join('')}</section>`; }
  const base = window.renderTP;
  window.renderTP = function(){ const r = base.apply(this, arguments);
    try{ load(); const old = $('tpBk'); if(old) old.remove(); const tabs = $('tpTabs'), h = html(); if(tabs && h) tabs.insertAdjacentHTML('beforebegin', h); }catch(e){ console.warn('trials booked', e); }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}
})();
