(function(){
  const up = s => String(s || '').trim().toUpperCase();
  const head = (n, title, sub, done) => '<div class="small" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:14px;padding-top:10px;border-top:1px solid #EEF0F4"><span style="display:inline-flex;width:22px;height:22px;border-radius:11px;align-items:center;justify-content:center;font-weight:700;font-size:12px;' + (done ? 'background:#2E9B6A;color:#fff' : 'background:#E6F4F4;color:#00737B') + '">' + (done ? '✓' : n) + '</span><b>' + title + '</b>' + (sub ? '<span class="mute">' + sub + '</span>' : '') + '</div>';
  function pkg(code){ try{ if(!(AT && AT.cols && AT.rows)) return null; const C = {}; AT.cols.forEach((c, i) => C[c] = i); const R = AT.rows.filter(r => up(r[C.code]) === up(code) && r[C.enrolled] !== ''); if(!R.length) return null; const r = R.find(x => x[C.active] === true) || R[0]; return { left: r[C.available], dl: r[C.deadline], teacher: r[C.teacher], row: r[C.row] }; }catch(e){ return null; } }
  const _rn = window.renSheet; window.renSheet = function(code, name){ const r = _rn.apply(this, arguments);
    try{ const b = $('sheetBody'); if(!b) return r; const st = renSt(code), k = st.k || '', nm = esc(String(name || '').replace(/'/g, '')), cd = esc(code), P = pkg(code);
      const opts = b.querySelector('.rnl'), rnU = $('rnU'), note = $('rnN'), noteL = note && note.previousElementSibling && note.previousElementSibling.tagName === 'LABEL' ? note.previousElementSibling : null;
      const btns = [...b.querySelectorAll('button')], find = re => btns.find(x => re.test(x.textContent.trim()));
      const save = find(/^Save$/), noteOnly = $('stNo'), clear = find(/^Clear status$/), paid = find(/Renewed · paid/), foot = [...b.querySelectorAll('p.small.mute')].pop();
      const histH = [...b.querySelectorAll('h3')].find(h => /History/.test(h.textContent)), hist = $('stLog');
      const rem = (window.REMC || {})[up(code)];
      if(!opts) return r;
      const wrap = document.createElement('div');
      const answered = /^(yes|pause|no|done)$/.test(k), paidDone = k === 'done';
      // 1 · remind
      wrap.insertAdjacentHTML('beforeend', head(1, 'Remind the parent', P ? ' · ' + (P.left === '' ? 'shared package' : esc(P.left) + ' lessons left') + (P.dl ? ' · deadline ' + esc(P.dl) : '') : '', !!k));
      const r1 = document.createElement('div'); r1.className = 'row'; r1.style.cssText = 'gap:8px;flex-wrap:wrap;margin-top:8px';
      r1.innerHTML = (rem ? '<button class="btn ' + (k ? 'ghost' : 'teal') + ' sm" id="rnCp">Copy reminder</button>' : '') + (k ? '<span class="small mute" style="align-self:center">' + esc(st.label) + '</span>' : '<button class="btn ghost sm" onclick="renQuick(\'' + cd + '\',\'' + nm + '\')">✓ Reminder sent</button>');
      wrap.appendChild(r1);
      // 2 · answer
      wrap.insertAdjacentHTML('beforeend', head(2, 'What did the parent say?', answered ? ' · ' + esc(st.label) : '', answered));
      [...opts.querySelectorAll('[data-k]')].forEach(o => { if(o.dataset.k === 'Reminder sent') o.remove(); });
      opts.style.marginTop = '8px'; wrap.appendChild(opts); if(rnU) wrap.appendChild(rnU); if(noteL) wrap.appendChild(noteL); if(note) wrap.appendChild(note);
      const r2 = document.createElement('div'); [save, noteOnly, clear].filter(Boolean).forEach(x => r2.appendChild(x)); wrap.appendChild(r2);
      // 3 · payment
      wrap.insertAdjacentHTML('beforeend', head(3, 'Record the payment', paidDone ? '' : ' · when the parent has paid', paidDone));
      if(paidDone) wrap.insertAdjacentHTML('beforeend', '<div class="card" style="margin-top:8px;padding:10px 12px;background:#F1FAF9;border-color:#BFE6E3"><b style="color:#00737B">✓ ' + esc(st.label) + '</b><div class="small mute">Recorded in SALES and ACTIVE · a second payment only if the parent paid again.</div></div>');
      if(paid){ paid.style.margin = '8px 0 0'; if(paidDone){ paid.className = 'btn ghost sm'; paid.textContent = 'Record another payment'; } wrap.appendChild(paid); }
      // 4 · get started
      wrap.insertAdjacentHTML('beforeend', head(4, 'Send the parent the new package', ' · after payment', false));
      wrap.insertAdjacentHTML('beforeend', '<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn ghost sm" onclick="cxBalance(null,\'' + cd + '\')">Renewal picture · 续费成功</button><button class="btn ghost sm" onclick="cnOpen(\'' + cd + '\')">Class notice</button><button class="btn ghost sm" onclick="agrOpen({code:\'' + cd + '\'})">Agreement</button></div>');
      if(foot) wrap.appendChild(foot); if(histH) wrap.appendChild(histH); if(hist) wrap.appendChild(hist);
      const sub = b.querySelector('.mute.small'); if(sub) sub.insertAdjacentElement('afterend', wrap); else b.appendChild(wrap);
      const cp = $('rnCp'); if(cp) cp.onclick = () => { try{ navigator.clipboard.writeText(rem); toast('Reminder copied · paste it in WeChat, then tap ✓ Reminder sent'); }catch(e){ openSheet('<h1>Reminder</h1><p class="small" style="white-space:pre-line">' + esc(rem) + '</p>'); } };
      if(!(AT && AT.rows) && !window._rnAT){ window._rnAT = 1; loadActive(true).then(() => { window._rnAT = 0; }).catch(() => { window._rnAT = 0; }); }
    }catch(e){ console.warn('renewal steps', e); } return r; };
})();
