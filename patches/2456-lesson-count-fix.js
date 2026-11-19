// 2456 (Misty 17:40 "maybe there's also an edit for us to edit the lesson count … Chenyu should be 1.5 for March" · "before renewal
//   payment was counted in March") · under the lesson summary (management only, never on the parent picture): "Correct a month" ·
//   pick the month, type the right count and why · saved in the database (coe-ops lessonfix) and applied by the server to every copy of
//   ACTIVE, so the month, lessons done and lessons remaining all change together (also on the Students list) · each correction is listed
//   with who / why and can be undone.
const file = process.argv[2];
const JS = String.raw`<script id="b2456">
(function(){
  var OPS = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-ops', MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], ML = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ymOf = function(lab){ var m = String(lab).match(/^([A-Za-z]{3})\w* (\d{2})$/); if(!m) return ''; var k = MON.indexOf(m[1].slice(0, 1).toUpperCase() + m[1].slice(1, 3).toLowerCase()); return k < 0 ? '' : '20' + m[2] + '-' + ('0' + (k + 1)).slice(-2); };
  var nice = function(ym){ var p = String(ym).split('-'); return ML[(+p[1] || 1) - 1] + ' ' + p[0]; };
  function box(code){ if(!(typeof D !== 'undefined' && D && D.mgr) || !(AT && AT.cols)) return; var sb = $('sheetBody'); if(!sb || $('lf2456')) return;
    var C = {}; AT.cols.forEach(function(c, i){ C[c] = i; }); var up = function(s){ return String(s || '').trim().toUpperCase(); }, U = up(code);
    var RR = AT.rows.filter(function(x){ return up(x[C.code]) === U; }); if(!RR.length) return;   /* the month for the whole student · all her teachers' rows, as on the summary */
    var r = ((typeof lsRows === 'function' && lsRows(code)) || {}).r || RR[0], M = (AT.months || []).map(function(_, i){ return Math.round(RR.reduce(function(a, x){ return a + (+((x[C.months] || [])[i]) || 0); }, 0) * 10) / 10; });
    var st = String(r[C.start] || '').slice(0, 7), F = (AT.fixes || []).filter(function(f){ return f.code === U; });
    var opts = (AT.months || []).map(function(lab, i){ return { ym: ymOf(lab), v: +M[i] || 0 }; }).filter(function(x){ return x.ym && (x.v > 0 || F.some(function(f){ return f.ym === x.ym; })) && (!st || x.ym >= st); }).reverse();
    var h = '<div id="lf2456" class="noprint" style="margin-top:14px;border:1px solid #ECEAF2;border-radius:14px;padding:12px 14px;background:#fff"><div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><b style="color:#2B2253">Correct a month</b><span class="small mute">management only · not on the parent picture · done and remaining change with it</span></div>'
      + (F.length ? F.map(function(f){ return '<div class="small" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px;padding:8px 10px;border-radius:10px;background:#F7F6FA"><b>' + E(nice(f.ym)) + ': ' + E(f.v) + '</b><span class="mute">was ' + E(f.was) + ' · ' + E(f.by) + (f.at ? ' · ' + E(String(f.at).slice(0, 10)) : '') + '</span><span style="flex:1;min-width:140px">' + E(f.note) + '</span><button class="btn ghost sm" onclick="lf2456(\'' + E(U) + '\',\'' + E(f.ym) + '\',null)">Undo</button></div>'; }).join('') : '')
      + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px"><select id="lfM" style="min-height:36px;border-radius:10px;border:1px solid #DDD9E8;padding:0 10px">' + opts.map(function(x){ return '<option value="' + x.ym + '" data-v="' + x.v + '">' + E(nice(x.ym)) + ' · now ' + x.v + '</option>'; }).join('') + '</select>'
      + '<input id="lfV" type="number" min="0" max="60" step="0.5" placeholder="Right count" style="width:120px;min-height:36px;border-radius:10px;border:1px solid #DDD9E8;padding:0 10px">'
      + '<input id="lfN" type="text" maxlength="300" placeholder="Why (e.g. only count from 21 Mar, after the renewal payment)" style="flex:1;min-width:220px;min-height:36px;border-radius:10px;border:1px solid #DDD9E8;padding:0 10px">'
      + '<button class="btn teal sm" onclick="lf2456(\'' + E(U) + '\')">Save</button></div></div>';
    sb.insertAdjacentHTML('beforeend', h); }
  window.lf2456 = async function(code, ym, v){ var undo = v === null, sel = $('lfM'), o = sel && sel.options[sel.selectedIndex];
    if(!undo){ ym = sel && sel.value; v = (($('lfV') || {}).value || '').trim(); var note = (($('lfN') || {}).value || '').trim(); if(!ym) return toast('Pick the month'); if(v === '' || isNaN(+v)) return toast('Type the right count, e.g. 1.5'); if(note.length < 4) return toast('Write why, so the parent question is clear later'); }
    else if(!confirm('Undo this correction?\n\nThe month goes back to the count from the class records.')) return;
    var f = (AT.fixes || []).find(function(x){ return x.code === code && x.ym === ym; }), was = f ? f.was : (o ? +o.getAttribute('data-v') || 0 : 0);
    try{ var r = await fetch(OPS, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'lessonfix', code: code, ym: ym, v: undo ? null : +v, was: was, note: undo ? 'undo' : note }) }).then(function(y){ return y.json(); });
      if(!r || !r.ok) return toast((r && r.error) || 'Not saved. Try again.');
      toast(undo ? 'Back to the class records' : 'Saved · ' + nice(ym) + ' is now ' + v); await loadActive(true); shSummary(code, false, 1); }catch(e){ toast('Not saved. Try again.'); } };
  var _s = shSummary; shSummary = async function(code){ var r = await _s.apply(this, arguments); try{ box(code); }catch(e){ console.warn('2456', e); } return r; };
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', JS + '<script id="b2278">']]);
