(function(){
  // 15 Oct · Student source as colour labels (Misty: "colour labelling … what's best for the brain and eyes").
  //  Four colours only (the eye tells ~4–6 hues apart at a glance), one meaning each, always the same:
  //    indigo = partner / agent · green = student referral · teal = CupOfEnglish · coral = source not set.
  //  Soft background + dark text of the same hue (easy to read, calm), a coloured edge, and the icon too
  //  (so it still works for colour-blind eyes). A colour key above the list doubles as a filter with counts.
  const css = `
.sa-src{background:#EEEBFA;color:#3F347E;border-left:3px solid #6C5FC7;border-radius:8px;padding:2px 9px 2px 7px}
.sa-src.ref{background:#E3F4EC;color:#1C6B4C;border-left-color:#2E9E6F}
.sa-src.coe{background:#E1F4F5;color:#00666D;border-left-color:#00A3AD}
.sa-src.none{background:#FBEAE5;color:#A1452F;border-left-color:#D4705A}
#v-astudents .sk2{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px}
#v-astudents .sk2>span{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0;margin-right:2px}
#v-astudents .sk2 button{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;border:1.5px solid transparent;background:#fff;font:inherit;font-size:13px;color:#2B2253;cursor:pointer;box-shadow:0 1px 2px rgba(43,34,83,.05)}
#v-astudents .sk2 button i{width:10px;height:10px;border-radius:5px;flex:none}
#v-astudents .sk2 button b{font-weight:700}
#v-astudents .sk2 button.on{border-color:currentColor}
#v-astudents .sk2 button.pt.on{color:#3F347E;background:#EEEBFA}
#v-astudents .sk2 button.ref.on{color:#1C6B4C;background:#E3F4EC}
#v-astudents .sk2 button.coe.on{color:#00666D;background:#E1F4F5}
#v-astudents .sk2 button.none.on{color:#A1452F;background:#FBEAE5}`;
  const st = document.createElement('style'); st.id = 'sk2css'; st.textContent = css; document.head.appendChild(st);
  const K = [['pt', 'Partners', '#6C5FC7', s => !s.classList.contains('ref') && !s.classList.contains('coe') && !s.classList.contains('none')],
    ['ref', 'Referrals', '#2E9E6F', s => s.classList.contains('ref')], ['coe', 'CupOfEnglish', '#00A3AD', s => s.classList.contains('coe')], ['none', 'Not set', '#D4705A', s => s.classList.contains('none')]];
  let F = '';
  window.skF = function(k){ F = F === k ? '' : k; renderAStudents(); };
  const _r = window.renderAStudents;
  window.renderAStudents = function(){ const r = _r.apply(this, arguments);
    try{ const v = $('v-astudents'); if(!v) return r; const rows = [...v.querySelectorAll('.li[onclick^="openStudent"]')]; if(!rows.length) return r;
      const kind = li => { const s = li.querySelector('.sa-src'); if(!s) return ''; const k = K.find(x => x[3](s)); return k ? k[0] : ''; };
      const n = {}; rows.forEach(li => { const k = kind(li); n[k] = (n[k] || 0) + 1; if(F && k !== F) li.style.display = 'none'; });
      if(!Object.keys(n).some(k => k)) return r;
      const at = v.querySelector('.sa-h') || rows[0];
      at.insertAdjacentHTML('beforebegin', `<div class="sk2"><span>Source</span>${K.map(([k, l, c]) => `<button class="${k} ${F === k ? 'on' : ''}" onclick="skF('${k}')" title="${F === k ? 'Show all' : 'Show only ' + l.toLowerCase()}"><i style="background:${c}"></i>${l} <b>${n[k] || 0}</b></button>`).join('')}</div>`);
    }catch(e){ console.warn('source key', e); }
    return r; };
  try{ if(VIEW === 'astudents') renderAStudents(); }catch(e){}
})();
