(function(){
  // 15 Oct · Trials show the student's source too, same colour labels as Students (Misty: "the source that we do in
  // students screen"): indigo partner · green referral · teal CupOfEnglish (incl. WeChat, 小红书, website) · coral not set.
  // Source = ACTIVE › SOURCE when the student is enrolled, otherwise DATABASE › SOURCE (filled when the trial is booked).
  // A colour key with counts above the list filters by source.
  const ic = p => '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const I = { pt: ic('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>'),
    ref: ic('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18.5 14.3A6.5 6.5 0 0 1 21.5 20"/>'),
    coe: ic('<path d="M4 9h13v4a7 7 0 0 1-7 7h1a7 7 0 0 1-7-7z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H16.5"/><path d="M8 3.5v2.5M12 3.5v2.5"/>'),
    none: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>') };
  const up = s => String(s || '').trim().toUpperCase();
  window.coeSrcKind = function(v){ v = String(v || '').trim(); if(!v || /^n\/?a$|^-$/i.test(v)) return 'none'; if(/^ST-\d{4}-\d{3}/i.test(v) || /^student\b/i.test(v)) return 'ref';
    if(/^(COE|CupOfEnglish|WeChat|微信|小红书|Xiaohongshu|RED|Website|Web|Facebook|FB|Douyin|抖音|Other)\b/i.test(v)) return 'coe'; return 'pt'; };
  window.coeSrcTag = function(v){ v = String(v || '').trim(); const k = coeSrcKind(v);
    if(k === 'none') return '<span class="sa-src none" title="Add the source in DATABASE › SOURCE">' + I.none + 'Source not set</span>';
    if(k === 'ref'){ const m = v.match(/^(ST-\d{4}-\d{3})\s*[–-]?\s*(.*)$/i); return '<span class="sa-src ref" title="Student referral">' + I.ref + 'Referred by ' + (m ? esc(m[2] || m[1]) + (m[2] ? ' (' + esc(m[1].toUpperCase()) + ')' : '') : esc(v.replace(/^student\s*(referral)?\s*[–:-]?\s*/i, ''))) + '</span>'; }
    if(k === 'coe') return '<span class="sa-src coe" title="Came to CupOfEnglish directly">' + I.coe + esc(/^COE\b/i.test(v) ? v.replace(/^COE\b/i, 'CupOfEnglish') : /^CupOfEnglish/i.test(v) ? v : 'CupOfEnglish · ' + v) + '</span>';
    return '<span class="sa-src" title="Partner / agent">' + I.pt + esc(v.replace(/^Partner\s*[–:-]\s*/i, '')) + '</span>'; };
  function srcMap(){ const out = {};
    try{ if(typeof DB !== 'undefined' && DB && DB.rows){ const H = (DB.head || []).map(h => String(h || '').trim().toUpperCase()); let j = H.indexOf('SOURCE'); if(j < 0) j = 22;
      DB.rows.forEach(r => { const k = up(r[0]); if(/^ST-/.test(k) && !(k in out)) out[k] = String(r[j] || '').trim(); }); } }catch(e){}
    try{ if(typeof AT !== 'undefined' && AT && AT.cols){ const C = {}; AT.cols.forEach((c, i) => C[c] = i);
      if(C.source != null) (AT.rows || []).forEach(r => { const k = up(r[C.code]), v = String(r[C.source] || '').trim(); if(/^ST-/.test(k) && v && (r[C.active] || !out[k])) out[k] = v; }); } }catch(e){}
    return out; }
  const css = `#v-trials .sk2{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px}
#v-trials .sk2>span{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0;margin-right:2px}
#v-trials .sk2 button{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;border:1.5px solid transparent;background:#fff;font:inherit;font-size:13px;color:#2B2253;cursor:pointer;box-shadow:0 1px 2px rgba(43,34,83,.05)}
#v-trials .sk2 button i{width:10px;height:10px;border-radius:5px;flex:none}
#v-trials .sk2 button b{font-weight:700}
#v-trials .sk2 button.on{border-color:currentColor}
#v-trials .sk2 button.pt.on{color:#3F347E;background:#EEEBFA}#v-trials .sk2 button.ref.on{color:#1C6B4C;background:#E3F4EC}
#v-trials .sk2 button.coe.on{color:#00666D;background:#E1F4F5}#v-trials .sk2 button.none.on{color:#A1452F;background:#FBEAE5}
#v-trials .rp-row .sa-src{margin-top:5px}
.sa-src svg{flex:none;opacity:.85}`;
  const st = document.createElement('style'); st.id = 'tpsrc'; st.textContent = css; document.head.appendChild(st);
  const K = [['pt', 'Partners', '#6C5FC7'], ['ref', 'Referrals', '#2E9E6F'], ['coe', 'CupOfEnglish', '#00A3AD'], ['none', 'Not set', '#D4705A']];
  let F = '', asked = 0;
  window.tpSrcF = function(k){ F = F === k ? '' : k; renderTP(); };
  const _r = window.renderTP;
  window.renderTP = function(){ const r = _r.apply(this, arguments);
    try{ const list = $('tpList'), tabs = $('tpTabs'); if(!list) return r;
      if(typeof DB !== 'undefined' && !DB && !asked && typeof loadDb === 'function'){ asked = 1; loadDb(true).then(() => { if(VIEW === 'trials') renderTP(); }).catch(() => 0); }
      const S = srcMap(); if(!Object.keys(S).length) return r;
      const n = {}; let any = 0;
      list.querySelectorAll('.rp-row').forEach(row => { const m = (row.textContent || '').match(/ST-\d{4}-\d{3}/i); if(!m) return; const code = up(m[0]); if(!(code in S)) return; any = 1;
        const k = coeSrcKind(S[code]); n[k] = (n[k] || 0) + 1; const g = row.querySelector('.grow');
        if(g && !g.querySelector('.sa-src')) g.insertAdjacentHTML('beforeend', '<div>' + coeSrcTag(S[code]) + '</div>');
        row.style.display = F && k !== F ? 'none' : ''; });
      const old = $('tpSrcK'); if(old) old.remove();
      if(any && tabs) tabs.insertAdjacentHTML('beforeend', '<div class="sk2" id="tpSrcK"><span>Source</span>' + K.map(([k, l, c]) => '<button class="' + k + (F === k ? ' on' : '') + '" onclick="tpSrcF(\'' + k + '\')"><i style="background:' + c + '"></i>' + l + ' <b>' + (n[k] || 0) + '</b></button>').join('') + '</div>');
    }catch(e){ console.warn('trial source', e); }
    return r; };
  try{ if(VIEW === 'trials') renderTP(); }catch(e){}
})();
