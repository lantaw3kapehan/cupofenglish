/* 20 Oct · 388 · Names copied from another student (Misty: "why do similar problems keep appearing"). Google's enrolment makes the new
   ACTIVE row by copying the top student row, and name cells holding a formula keep the OTHER student's name (Elsa ST-2024-028 → "Eric /
   Sun Yuchen", Lissy ST-2022-059 → "Esther"). coe-trials `names` finds every ACTIVE row whose name belongs to a different student in
   DATABASE; the app then shows the DATABASE name everywhere (lists, forms, pictures) and To do shows a red card until the sheet is fixed. */
(function(){
  window.NAMEFIX = window.NAMEFIX || {}; let BAD = [], at = 0;
  const up = s => String(s || '').toUpperCase();
  async function load(){ if(!D || !D.mgr || !TOKEN || Date.now() - at < 5 * 6e4) return; at = Date.now();
    try{ const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, names: true }) }).then(x => x.json());
      if(!r || !r.ok || !Array.isArray(r.bad)) return; BAD = r.bad;
      BAD.forEach(b => { const c = up(b.code); NAMEFIX[c] = b.db.en; NAMEFIX['cn:' + c] = b.db.cn || ''; });
      fixAll(); card(); }catch(e){} }
  /* put the right name into what the app already holds */
  function fixObj(o){ if(!o || typeof o !== 'object') return; const c = up(o.code); if(c && NAMEFIX[c]){ if('name' in o) o.name = NAMEFIX[c]; if('student' in o && typeof o.student === 'string' && !/-/.test(o.student)) o.student = NAMEFIX[c]; if('cn' in o) o.cn = NAMEFIX['cn:' + c] || ''; } }
  function fixAny(v){ try{ if(Array.isArray(v)) v.forEach(fixObj); else if(v && typeof v === 'object'){ fixObj(v); ['students', 'list', 'rows'].forEach(k => { if(Array.isArray(v[k]) && v[k].length && !Array.isArray(v[k][0])) v[k].forEach(fixObj); });
      if(Array.isArray(v.cols) && Array.isArray(v.rows)){ const ci = v.cols.indexOf('code'), ni = v.cols.indexOf('name'), cn = v.cols.indexOf('cn'); if(ci > -1 && ni > -1) v.rows.forEach(r => { const c = up(r[ci]); if(NAMEFIX[c]){ r[ni] = NAMEFIX[c]; if(cn > -1) r[cn] = NAMEFIX['cn:' + c] || ''; } }); } } }catch(e){} return v; }
  function fixAll(){ try{ if(typeof SL !== 'undefined') fixAny(SL); }catch(e){} try{ if(typeof MS !== 'undefined') fixAny(MS); }catch(e){} try{ if(typeof AT !== 'undefined') fixAny(AT); }catch(e){} try{ if(typeof STU !== 'undefined' && STU) fixObj(STU.s); }catch(e){} }
  const baseApi = window.api;
  window.api = async function(fn){ const r = await baseApi.apply(this, arguments); try{ if(Object.keys(NAMEFIX).length && /^(schedLists|mgmtStudents|mgmtActive|mgmtStudent|mgmtDatabase|dbLists)$/.test(fn)) fixAny(r); }catch(e){} if(D && D.mgr) load(); return r; };
  /* red card at the top of To do until the sheet is fixed */
  function card(){ const v = $('v-mtoday'); if(!v) return; let el = $('nmBad'); if(!BAD.length){ if(el) el.remove(); return; }
    const html = '<div class="card" id="nmBad" style="margin:0 0 14px;background:#FFF5F2;border:1px solid #E9B8AC"><b style="color:#9A3B22">⚠️ Wrong name in ACTIVE (copied from another student)</b>' +
      '<div class="small" style="margin-top:6px;line-height:1.6">' + BAD.map(b => 'Row ' + b.row + ' · ' + esc(b.code) + ' shows <b>' + esc(b.active.en) + (b.active.cn ? ' / ' + esc(b.active.cn) : '') + '</b> (that is ' + esc(b.from) + ') · should be <b>' + esc(b.db.en) + (b.db.cn ? ' / ' + esc(b.db.cn) : '') + '</b>').join('<br>') +
      '</div><div class="small mute" style="margin-top:6px">The app already shows the right name. Fix columns B and C of these rows in Excel Daily, and type over any formula there with plain text, so the next enrolment does not copy it again.</div></div>';
    if(el) el.outerHTML = html; else v.insertAdjacentHTML('afterbegin', html); }
  const rt = window.renderMToday; if(rt) window.renderMToday = function(){ const r = rt.apply(this, arguments); try{ card(); }catch(e){} return r; };
  setTimeout(load, 3000); setInterval(() => { at = 0; load(); }, 15 * 6e4);
})();
