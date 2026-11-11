/* 2105: a sibling must share the first TWO characters of the Chinese name (family name + generation name, e.g. 刘常悦 / 刘常乐), not only
   the family name: 刘 alone matched three Jinan students.
   2103: the lists the check needs (packages, student records) are loaded first when the screen has not loaded them yet.
   2102 (11 Nov 21:40, Misty: "where is the shared package with Andy option?"). The share option was a small link under the Enrolled · paid
   title. Now, when the student looks like a sibling of an enrolled student (same Chinese family name and the same referral / partner),
   Enrolled · paid opens with a clear card: "Andrew looks like Andy's sibling … Shares Andy's package →", and that form opens with Andy chosen. */
(function(){
  if(window.__sib2102) return; window.__sib2102 = 1;
  const up = s => String(s == null ? '' : s).trim().toUpperCase(), E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  function me(code){ try{ const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).filter(x => up(x[0]) === up(code)).pop(); if(r) return { cn: String(r[1] || '').trim(), src: String(r[22] || '').trim() }; }catch(e){} return null; }
  function sibs(code){ const m = me(code); if(!m || !m.cn || /#ERROR/.test(m.cn)) return [];
    try{ const C = {}; (AT.cols || []).forEach((c, i) => C[c] = i); const fam = m.cn.length >= 3 ? m.cn.slice(0, 2) : '', norm = s => String(s || '').replace(/^Partner\s*[–-]\s*/i, '').trim();
      const out = {}; (AT.rows || []).forEach(r => { const c = up(r[C.code]); if(!c || c === up(code) || r[C.enrolled] === '' || r[C.enrolled] == null) return;
        const cn = String(r[C.cn] || '').trim(); if(!fam || !cn || cn.length < 3 || cn.slice(0, 2) !== fam || cn === m.cn) return; if(m.src && norm(r[C.source]) && norm(r[C.source]) !== norm(m.src)) return;
        out[c] = { code: c, name: String(r[C.name] || ''), cn }; });
      return Object.values(out).slice(0, 3); }catch(e){ return []; } }
  const en0 = window.enSheet;
  if(typeof en0 === 'function') window.enSheet = async function(code, name, teacher){ const r = await en0.apply(this, arguments);
    try{ if(document.getElementById('sib2102')) return r;
      try{ if(typeof AT === 'undefined' || !AT || !AT.rows) await loadActive(true); }catch(e){}
      try{ if((typeof DB === 'undefined' || !DB || !DB.rows) && typeof loadDb === 'function') await loadDb(true); }catch(e){}
      if(typeof ENS === 'undefined' || !ENS || up(ENS.code) !== up(code) || document.getElementById('sib2102')) return r;
      const S = sibs(code); if(!S.length) return r; const btn = document.getElementById('enSh1715'), h = document.querySelector('#sheet h1'); if(!h) return r;
      const nm = String(name || '').replace(/'/g, ''), tc = String(teacher || '').replace(/'/g, '');
      const html = '<div id="sib2102" class="card" style="margin-top:10px;background:#F1FAF9;border-color:#BFE6E3"><b>' + E(name) + ' looks like ' + S.map(s => E(s.name) + ' ' + E(s.cn)).join(' or ') + '\'s sibling</b>' +
        '<div class="small" style="margin-top:4px">Same family name and the same referral. If the family pays one package for both children, use it here: no payment, the lessons come off the sibling\'s package.</div>' +
        '<div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">' + S.map(s => '<button type="button" class="btn teal sm" onclick="sib2102(\'' + E(code) + '\',\'' + E(nm) + '\',\'' + E(tc) + '\',\'' + E(s.code) + '\',\'' + E(String(s.name).replace(/'/g, '')) + '\')">Shares ' + E(s.name) + '\'s package →</button>').join('') + '</div></div>';
      (btn || h.nextElementSibling || h).insertAdjacentHTML('afterend', html); }catch(e){}
    return r; };
  window.sib2102 = async function(code, name, teacher, owner, oname){ if(typeof enShSheet !== 'function') return; await enShSheet(code, name, teacher);
    try{ const w = document.getElementById('esW'); if(w && !w.value) w.value = owner + ' · ' + oname; }catch(e){} };
})();
