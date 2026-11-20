// 2527 (Misty 15:42): "Correct a month" in plain words · the month list shows the same number as the summary (a first month counts from the
//   package start; the whole calendar month is shown beside it, and what is typed is the summary number) · "Safe to share" only when the
//   months from October 2026 (every class is in the app since then) also match the class records, unless that month was corrected.
//   Ops Desk list (2526) includes the same records check (refreshed every 10 minutes).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["opts.map(function(x){ return '<option value=\"' + x.ym + '\" data-v=\"' + x.v + '\">' + E(nice(x.ym)) + ' · now ' + x.v + '</option>'; }).join('')",
   "opts.map(function(x){ var sv = (window.sv2527 || {})[x.ym], off = sv != null && Math.abs(sv - x.v) > 0.05 ? Math.round((x.v - sv) * 10) / 10 : 0; return '<option value=\"' + x.ym + '\" data-v=\"' + x.v + '\" data-off=\"' + off + '\">' + E(nice(x.ym)) + ' · now ' + (off ? sv + ' in the summary (whole month ' + x.v + ')' : x.v) + '</option>'; }).join('')"],
  ["These lessons were never counted anywhere (missing classes): also take them off Lessons left",
   "Tick if these classes happened but were missing from the records (Lessons remaining goes down too). Leave it off if the lessons were only in the wrong month."],
  ["if(note.length < 4) return toast('Write why, so the parent question is clear later'); }",
   "if(note.length < 4) return toast('Write why, so the parent question is clear later'); v = String(Math.round(((+v) + (o ? +o.getAttribute('data-off') || 0 : 0)) * 10) / 10); }"],
  ["var opts = (AT.months || []).map(function(lab, i){",
   "window.sv2527 = (function(){ var SV = {}; try{ if(!/SHARED LESSON SUMMARY/.test(sb.textContent)) sb.querySelectorAll('tr').forEach(function(tr){ var c = tr.cells; if(!c || c.length < 2) return; var m = c[0].textContent.trim().match(new RegExp('^(' + ML.join('|') + ')[\\\\s\\\\S]*?(\\\\d{4})')); if(!m) return; var v = parseFloat(c[1].textContent); if(!isNaN(v)) SV[m[2] + '-' + ('0' + (ML.indexOf(m[1]) + 1)).slice(-2)] = v; }); }catch(e){} return SV; })();\n    var opts = (AT.months || []).map(function(lab, i){"],
  ['<script id="b2278">', `<script id="b2527">
(function(){
  const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'], FROM = '2026-10';
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const nice = ym => MN[+ym.slice(5, 7) - 1] + ' ' + ym.slice(0, 4);
  function fixes(code){ try{ const ls = JSON.parse(localStorage.getItem('coe.lf2483') || 'null'); return (ls && ls.length ? ls : ((typeof AT !== 'undefined' && AT && AT.fixes) || [])).filter(f => String(f.code).toUpperCase() === code); }catch(x){ return []; } }
  /* months from October 2026 where the summary differs from the class records (that teacher's classes, from the package start, trials and substitutes apart) */
  window.rec2527 = async function(code, el){ code = String(code).toUpperCase(); const txt = el.textContent || ''; if(/SHARED LESSON SUMMARY/.test(txt)) return null;
    const S = typeof lsRows === 'function' ? lsRows(code) : null; if(!S) return null; const C = S.C;
    const TS = new Set(((S.G && S.G.members) || [S.r]).filter(x => String(x[C.code]).toUpperCase() === code).map(x => String(x[C.teacher] || '').trim().toLowerCase()));
    const st = (txt.match(/Package Starts: (\\w+ \\d+, \\d{4})/) || [])[1], sd = st ? new Date(st + ' 00:00') : null;
    const SV = {}; el.querySelectorAll('tr').forEach(tr => { const c = tr.cells; if(!c || c.length < 2) return; const m = c[0].textContent.trim().match(new RegExp('^(' + MN.join('|') + ')[\\\\s\\\\S]*?(\\\\d{4})')); if(!m) return; const v = parseFloat(c[1].textContent); if(!isNaN(v)) SV[m[2] + '-' + String(MN.indexOf(m[1]) + 1).padStart(2, '0')] = v; });
    let r = null; try{ r = await lvPre1879(code); }catch(x){} if(!r || !r.ok) return null;
    const RV = {}; (r.rows || []).forEach(x => { if(x.kind === 'trial' || x.kind === 'sub') return; if(!TS.has(String(x.teacher || '').trim().toLowerCase())) return; const d = new Date(String(x.start).slice(0, 10) + 'T12:00:00'); if(sd && d < sd) return; const k = String(x.start).slice(0, 7); RV[k] = Math.round(((RV[k] || 0) + (+x.u || 0)) * 10) / 10; });
    const F = fixes(code).map(f => f.ym), out = [];
    Object.keys(SV).filter(k => k >= FROM && F.indexOf(k) < 0).forEach(k => { if(Math.abs((SV[k] || 0) - (RV[k] || 0)) > 0.05) out.push(nice(k) + ' shows ' + SV[k] + ', the class records have ' + (RV[k] || 0)); });
    return { bad: out, months: Object.keys(SV).filter(k => k >= FROM).length }; };
  /* the summary's own check (2524): add the records line, and hold sharing when they differ */
  const _s = window.shSummary; if(typeof _s === 'function') window.shSummary = async function(code){ const r = await _s.apply(this, arguments);
    setTimeout(async () => { try{ const p = document.getElementById('sc2524'), sb = document.getElementById('sheetBody'); if(!p || !sb) return; const R = await window.rec2527(code, sb); if(!R) return;
      const q = document.getElementById('sc2524'); if(!q) return; const add = (ok, t) => q.querySelector('.m').insertAdjacentHTML('beforebegin', '<div class="r"><i>' + (ok ? '✓' : '!') + '</i><span>' + e(t) + '</span></div>');
      if(!R.months) return;
      if(!R.bad.length){ add(true, 'Months from October 2026 match the class records'); return; }
      R.bad.forEach(t => add(false, t + ' · correct it in Correct a month, or confirm the summary number there'));
      q.className = 'noprint bad'; q.querySelector('b').textContent = 'Not safe to share yet · please check'; const m = q.querySelector('.m'); if(m) m.textContent = 'Copy, Save and PDF stay off until it is corrected or confirmed in Correct a month.';
      sb.querySelectorAll('button[onclick^="docPic"],button[onclick^="docPrint"]').forEach(b => { b.disabled = true; }); try{ if(window.__sc2524) window.__sc2524.ok = false; }catch(x){} }catch(x){ console.warn('2527', x); } }, 200);
    return r; };
  /* Ops Desk (2526): add the records check, refreshed every 10 minutes */
  let REC = {}, RT = 0, busy = false;
  async function recScan(){ if(busy || Date.now() - RT < 600000 || typeof AT === 'undefined' || !AT || !AT.cols) return; busy = true;
    try{ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const seen = {}, L = [];
      AT.rows.forEach(r => { const code = String(r[C.code] || '').toUpperCase(); if(r[C.active] && r[C.enrolled] !== '' && !seen[code]){ seen[code] = 1; L.push(code); } });
      const N = {}; for(let i = 0; i < L.length; i += 12){ await Promise.all(L.slice(i, i + 12).map(async code => { try{ const div = document.createElement('div'); div.innerHTML = lsHtml(code) || ''; const R = await window.rec2527(code, div); if(R && R.bad.length) N[code] = R.bad; }catch(x){} })); }
      REC = N; RT = Date.now(); }catch(x){} busy = false; }
  const _sc = window.scan2526; if(typeof _sc === 'function') window.scan2526 = function(force){ const S = _sc.apply(this, arguments); if(!S) return S; recScan();
    const L = S.L.map(x => Object.assign({}, x, { why: x.why.concat(REC[x.code] || []) }));
    Object.keys(REC).forEach(code => { if(!L.some(x => x.code === code)){ let name = code; try{ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const r = AT.rows.find(y => String(y[C.code]).toUpperCase() === code); if(r) name = r[C.name] || code; }catch(x){} L.push({ code, name, why: REC[code] }); } });
    return Object.assign({}, S, { L }); };
})();
</script>
<script id="b2278">`]
]);
