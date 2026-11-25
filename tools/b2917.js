<script id="b2917">
/* 2917 (Misty 25 Nov 16:51 "since Pec wanted Tuesday and Thursday now … when they show like that, it also shows on the teacher … the best workaround")
   A stopped weekly class is many cancelled classes on the calendar. On the student's calendar (management and teacher), the teacher's
   Schedule and the teacher week, cancelled classes are now left out when the class is after today AND it is part of a stopped or changed
   schedule: the reason says "stopped from", it was cancelled on an earlier day than the class, or the same weekday and time is cancelled
   three or more times. Today's cancellations always stay (they matter that day). Nothing is deleted: one quiet line says what is hidden,
   with "Show". Same rule as the Schedule screen since 20 Oct (block 359). */
(function(){
  let SHOW = false;
  const MON = 'janfebmaraprmayjunjulaugsepoctnovdec', WD = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
  const ph = iso => new Date(new Date(iso).getTime() + 8 * 3600e3);
  const dayOf = e => ph(e.start).toISOString().slice(0, 10), hmOf = e => ph(e.start).toISOString().slice(11, 16), wdOf = e => ph(e.start).getUTCDay();
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  function early(e){ const m = String(e.why || '').match(/·\s*([A-Za-z]{3})[a-z]*\s+(\d{1,2})\s*$/); if(!m) return false;
    const M = MON.indexOf(m[1].toLowerCase()) / 3 + 1; if(M < 1) return false; const d = dayOf(e), y = +d.slice(0, 4), cm = +d.slice(5, 7);
    const cy = M > cm + 1 ? y - 1 : y, c = cy + '-' + String(M).padStart(2, '0') + '-' + String(+m[2]).padStart(2, '0'); return c < d; }
  function hidden(L){ const t = today(), slot = {}, key = e => (e.code || e.student || '') + '|' + wdOf(e) + '|' + hmOf(e);
    L.forEach(e => { if(e && e.cancelled && dayOf(e) > t) slot[key(e)] = (slot[key(e)] || 0) + 1; });
    return L.filter(e => e && e.cancelled && dayOf(e) > t && (/stopped from/i.test(String(e.why || '')) || early(e) || slot[key(e)] >= 3)); }
  window.hid2917List = L => hidden(L || []);   /* also used by the parent's class calendar picture */
  function prep(X){ if(!X || !Array.isArray(X.events)) return; if(X.events !== X._f2917) X._all2917 = X.events;
    const H = hidden(X._all2917), hs = new Set(H); X._hid2917 = H; const keep = SHOW ? X._all2917 : X._all2917.filter(e => !hs.has(e)); X._f2917 = keep; X.events = keep; }
  function summary(H){ const g = {}; H.forEach(e => { const k = (e.student || e.code || '') + '|' + wdOf(e) + '|' + hmOf(e); (g[k] = g[k] || []).push(e); });
    return Object.keys(g).map(k => { const [n, w, t] = k.split('|'), L = g[k].sort((a, b) => String(a.start).localeCompare(String(b.start))), f = ph(L[0].start);
      return (n ? n + ': ' : '') + WD[+w] + ' ' + t + ' stopped from ' + f.getUTCDate() + ' ' + MON.substr(f.getUTCMonth() * 3, 3).replace(/^./, c => c.toUpperCase()) + (L.length > 1 ? ' (' + L.length + ' classes)' : ''); }); }
  function note(X, el){ try{ if(!X || !el) return; const old = el.querySelector(':scope > .hid2917'); if(old) old.remove(); const H = X._hid2917 || []; if(!H.length) return;
    const S = summary(H), more = S.length > 3 ? ' and ' + (S.length - 3) + ' more' : '';
    el.insertAdjacentHTML('beforeend', '<div class="hid2917 small mute" style="margin:14px 2px 6px;line-height:1.5">' + (SHOW ? 'Showing ' : 'Hidden: ') + H.length + ' cancelled ' + (H.length === 1 ? 'class' : 'classes') + ' from stopped or changed schedules. ' + S.slice(0, 3).map(x => (typeof esc === 'function' ? esc(x) : x)).join('. ') + more + '. <a href="#" onclick="hid2917Toggle();return false">' + (SHOW ? 'Hide them' : 'Show them') + '</a></div>'); }catch(e){} }
  const W = [['swPaint', () => SW, () => document.getElementById('sheetBody')], ['twPaint', () => TW, () => document.getElementById('sheetBody')],
             ['tsPaint', () => TS, () => (typeof VIEW !== 'undefined' && VIEW === 'tsched') ? document.getElementById('v-tsched') : document.getElementById('sheetBody')]];
  window.hid2917Toggle = () => { SHOW = !SHOW; W.forEach(([n, get, box]) => { try{ const X = get(), el = box(); if(X && X.events && el && el.querySelector(':scope > .hid2917') && (n !== 'swPaint' || (el.dataset.sw && SW && el.dataset.sw === SW.code))) window[n](); }catch(e){} }); };
  function wrap(){ let all = true;
    W.forEach(([n, get, box]) => { const f = window[n]; if(typeof f !== 'function'){ all = false; return; } if(f.__w2917) return;
      const w = function(){ try{ prep(get()); }catch(e){} const r = f.apply(this, arguments); try{ note(get(), box()); }catch(e){} return r; };
      w.__w2917 = 1; window[n] = w; try{ if(n === 'swPaint') swPaint = w; else if(n === 'twPaint') twPaint = w; else tsPaint = w; }catch(e){} });
    if(!all) setTimeout(wrap, 400); }
  wrap(); setTimeout(wrap, 1500); setTimeout(wrap, 5000);
})();
</script>
