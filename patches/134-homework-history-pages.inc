(function(){
  const wbOf = s => { const m = /(?:WB|work\s*book)\s*(?:p\.?|pages?)?\s*(\d+)(?:\s*[-–]\s*(\d+))?/i.exec(String(s || '')); return m ? +(m[2] || m[1]) : null; };
  const sbOf = s => { const m = /(?:SB|student'?s?\s*book)\s*(?:p\.?|pages?)?\s*(\d+)/i.exec(String(s || '')) || /(?:^|[^A-Za-z])(?:p\.?|pages?)\s*(\d+)/i.exec(String(s || '').replace(/(?:WB|work\s*book)\s*(?:p\.?|pages?)?\s*\d+(?:\s*[-–]\s*\d+)?/ig, '')); return m ? +m[1] : null; };
  const unitOf = s => { const m = /unit\s*(\d+)/i.exec(String(s || '')); return m ? +m[1] : null; };
  const fmt = d => { const x = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(x) ? String(d || '') : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
  async function history(code){ let n = null; try{ const k = JSON.parse(store('get', 'coe.stu.' + code) || 'null'); if(k && k.notes && k.notes.length) n = k.notes; }catch(e){}
    if(!n){ try{ const x = await api('tStudent', TOKEN, code); if(x && x.notes) n = x.notes; }catch(e){} } return n || []; }
  function paintHw(code, notes){ const box = $('hwPrev'); if(!box) return; const today = D.today;
    const L = notes.filter(n => n.homework && String(n.date).slice(0, 10) !== today && !/^no homework/i.test(n.homework)).slice(0, 3);
    let wb = null; for(const n of notes){ if(String(n.date).slice(0, 10) === today) continue; const w = wbOf(n.homework); if(w != null){ wb = w; break; } }
    const st = (D.students || []).find(x => x.code === code) || {}, bk = String(st.book || '').split(/\s*,\s*/).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p))[0] || '';
    const next = wb != null ? wb + 1 : null, ins = t => '<button type="button" onclick="gxIns(\'nH\',\'' + t + '\')">' + t + '</button>';
    const eh = $('epHw'); if(eh && next != null) eh.style.display = 'none';
    box.innerHTML = (L.length ? '<div class="small" style="margin:8px 0 4px"><b>Homework given before</b></div>' + L.map(n => '<div class="small" style="padding:3px 0;border-bottom:1px dashed #E3E8EC"><span class="mute">' + esc(fmt(n.date)) + (n.teacher ? ' · ' + esc(tName(n.teacher)) : '') + '</span> · ' + esc(n.homework) + '</div>').join('') : '') +
      (next != null ? '<div class="small" style="margin:8px 0 4px"><b>Next pages</b> <span class="mute">· the last workbook page given was ' + wb + '</span></div><div class="gx-c">' + [next + '', next + '–' + (next + 1), next + '–' + (next + 2)].map(p => ins((bk ? bk + ' ' : '') + 'Workbook p. ' + p)).join('') + '</div>' : ''); }
  const _ns = window.noteSheet; window.noteSheet = function(code, eventId, day){ const r = _ns.apply(this, arguments);
    try{ const h1 = $('nH'); if(!h1 || $('hwPrev')) return r;
      const lastBox = [...document.querySelectorAll('#sheetBody .small, #sheetBody div')].find(x => /^📚\s*Last homework/.test((x.textContent || '').trim()));
      (lastBox || h1).insertAdjacentHTML('afterend', '<div id="hwPrev"></div>'); if(lastBox) lastBox.style.display = 'none';
      history(code).then(n => { if($('hwPrev')) paintHw(code, n); });
    }catch(e){ console.warn('hw history', e); } return r; };
})();
