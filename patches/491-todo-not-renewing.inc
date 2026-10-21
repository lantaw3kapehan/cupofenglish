/* 21 Oct · 491 · To do › "Paused or not renewing" (Misty: "it's still showing ACTIVE there… since they are not renewing, what best way
   to deal with this part"). Nothing is sent to these families, so the rows become one quiet line each:
   · name · teacher · where the package stands ("Package finished" / "Last lesson ~Nov 20") · the status ("Not renewing · Oct 9");
     the parent's message is in the tooltip (tap the status to read it). Progress check, report picture, PDF and validity chips are
     left out here — they are about renewing.
   · If ACTIVE still has the student ticked (the untick did not go through), a coral "Still ticked in ACTIVE · Untick" button
     saves "Not renewing" again, which unticks ACTIVE and ends the student in DATABASE, as the Change sheet says.
   · The group reads "Paused or not renewing · 3 · nothing to send" and stays folded. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-mtoday .nr91{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:center;padding:10px 12px;border-top:1px solid #F1F0F5}
#v-mtoday .nr91:first-of-type{border-top:0}
#v-mtoday .nr91 .a{min-width:0;font-size:13.5px;color:#55526E}
#v-mtoday .nr91 .a b{color:var(--ink);cursor:pointer} #v-mtoday .nr91 .a .mute{font-size:12px}
#v-mtoday .nr91 .s{display:inline-block;margin-top:3px;font-size:12px;padding:2px 9px;border-radius:999px;background:#F1F0F5;color:#55526E;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}
#v-mtoday .nr91 .s.open{white-space:normal}
#v-mtoday .nr91 .s.p{background:#FCF6EA;color:#8A5A0F}
#v-mtoday .nr91 .k{display:flex;gap:6px;align-items:center}
#v-mtoday .nr91 .u{border:0;border-radius:999px;padding:5px 11px;font:inherit;font-size:12px;font-weight:700;background:#FBE7E1;color:#9A3B26;cursor:pointer}`;
  document.head.appendChild(css);
  const up = s => String(s || '').trim().toUpperCase();
  function ticked(code){ try{ if(!(AT && AT.cols && AT.rows)) return false; const C = {}; AT.cols.forEach((c, i) => C[c] = i); if(C.active == null) return false;
    return AT.rows.some(r => up(r[C.code]) === up(code) && (r[C.active] === true || r[C.active] === 'TRUE')); }catch(e){ return false; } }
  window.nr91Untick = async function(code, name, b){ const t = String((REN || {})[up(code)] || ''), note = t.split(' · ').slice(3).join(' · ');
    if(b){ b.disabled = true; b.textContent = 'Unticking…'; }
    try{ const r = await api('mgmtRenewal', TOKEN, code, 'Not renewing', note, ''); if(!r || !r.ok) throw r; if(r.status) REN[up(code)] = r.status; try{ localStorage.setItem('coe.ren', JSON.stringify(REN)); }catch(e){}
      AT = null; toast('✓ ' + name + ' · ' + (r.note || 'unticked in ACTIVE')); renderMToday(); }
    catch(e){ toast((e && e.msg) || 'Not saved. Try again.'); if(b){ b.disabled = false; b.textContent = 'Untick'; } } };
  function tidy(){ const R = document.querySelector('#v-mtoday #td-renew'); if(!R) return; const g = R.querySelector('.tdg.closed'); if(!g) return;
    const box = g.closest('details') || R; if(box.dataset.nr91) return; box.dataset.nr91 = 1;
    const rows = [...box.querySelectorAll(':scope > .tdr')]; if(!rows.length) return;
    const c = g.querySelector('.c'); if(c) c.textContent = rows.length + ' · nothing to send';
    rows.forEach(row => {
      const nmA = row.querySelector('a.nm'), name = nmA ? nmA.textContent.trim() : '', code = (row.textContent.match(/ST-\d{4}-\d{3}/) || [''])[0];
      const line = row.querySelector('.grow > .small'), sub = line ? line.textContent.replace(/\s+/g, ' ').trim() : '';
      const left = (row.querySelector('.tdn b') || {}).textContent || '';
      const st = renSt(code), full = st.t || '', parts = full.split(' · '), when = parts[1] ? parts[1].replace(/,\s*\d{4}$/, '') : '', msg = parts.slice(3).join(' · ');
      const label = st.k === 'pause' ? st.label : 'Not renewing' + (when ? ' · ' + when : '');
      const still = st.k === 'no' && ticked(code);
      const ch = row.querySelector('.tdb button[onclick^="renSheet"]'), chOn = ch ? ch.getAttribute('onclick') : '';
      const d = document.createElement('div'); d.className = 'nr91';
      d.innerHTML = '<div class="a"><b onclick="openStudent(\'' + esc(code) + '\')">' + esc(name) + '</b> <span class="mute">' + esc(code) + '</span> · ' + esc(sub.replace(/\s*·\s*[\d.]+ lessons a month/, '')) + (left && +left > 0 ? ' · ' + esc(left) + ' left' : '') +
        '<br><span class="s ' + (st.k === 'pause' ? 'p' : '') + '" title="' + esc(full) + '" onclick="this.classList.toggle(\'open\')">' + esc(label) + (msg ? ' · ' + esc(msg) : '') + '</span></div>' +
        '<div class="k">' + (still ? '<button class="u" title="ACTIVE still has ' + esc(name) + ' ticked" onclick="nr91Untick(\'' + esc(code) + '\',\'' + esc(name).replace(/'/g, '') + '\',this)">Still ticked in ACTIVE · Untick</button>' : '') +
        (chOn ? '<button class="btn ghost sm" onclick="' + chOn.replace(/"/g, '&quot;') + '">Change</button>' : '') + '</div>';
      row.replaceWith(d); }); }
  const base = window.renderMToday; if(base) window.renderMToday = function(){ const r = base.apply(this, arguments); try{ tidy(); }catch(e){ console.warn('nr91', e); } setTimeout(() => { try{ tidy(); }catch(e){} }, 400); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') renderMToday(); }catch(e){}
})();
