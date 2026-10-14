(function(){
  const up = s => String(s || '').trim().toUpperCase();
  function pkgOf(code){ try{ if(!(AT && AT.cols && AT.rows)) return null; const C = {}; AT.cols.forEach((c, i) => C[c] = i);
    const R = AT.rows.filter(r => up(r[C.code]) === up(code) && r[C.enrolled] !== ''); if(!R.length) return null;
    const r = R[0]; return { row: r[C.row], left: r[C.available], teacher: r[C.teacher] }; }catch(e){ return null; } }
  function fuNow(t){ try{ return (TFU || {})[t.date + '|' + tfuFirst(t.student)] || null; }catch(e){ return null; } }
  const sec = (n, title, sub, body, done) => '<div class="tlStep" style="width:100%;margin-top:12px;padding-top:10px;border-top:1px solid #EEF0F4">' +
    '<div class="small" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span style="display:inline-flex;width:22px;height:22px;border-radius:11px;align-items:center;justify-content:center;font-weight:700;font-size:12px;' + (done ? 'background:#2E9B6A;color:#fff' : 'background:#E6F4F4;color:#00737B') + '">' + (done ? '✓' : n) + '</span><b>' + title + '</b>' + (sub ? '<span class="mute">' + sub + '</span>' : '') + '</div>' +
    '<div class="row tlRow" style="gap:8px;flex-wrap:wrap;margin-top:8px"></div>' + (body || '') + '</div>';
  const _tb = window.tlBtns; window.tlBtns = function(){ const r = _tb.apply(this, arguments);
    try{ const el = $('tlAct'), t = TLD; if(!el || !t || !(D && D.mgr)) return r;
      const all = [...el.querySelectorAll('button, a.btn')], pick = re => all.filter(b => re.test(b.textContent.trim()) && !b._used).map(b => { b._used = 1; return b; });
      const send = pick(/^(Copy picture|Share|Save picture|Send on WeChat|Send again|Save PDF|Open PDF|Loading PDF|Mark as sent|Already sent|Copy message)/);
      const decide = pick(/^(Price picture|CEFR picture|Course plan)/);
      const enrolB = pick(/^Enrolled · paid/), tpE = pick(/^Enrol$/);
      const after = pick(/^(Set class schedule|Agreement)/);
      const fu = pick(/^(Following up|Thinking it over|Unreachable|Not now)$/);
      const rest = all.filter(b => !b._used);
      const P = t.code ? pkgOf(t.code) : null, f = fuNow(t), enr = !!P || (f && f.st === 'Enrolling') || /^(yes|y|enrolled)/i.test(String(t.enrolled || ''));
      const sent = t.status === 'Sent';
      el.innerHTML = '';
      el.insertAdjacentHTML('beforeend', sec(1, 'Send the report to the parent', sent ? ' · sent' + (t.sent && t.sent.at ? ' ' + esc(t.sent.at) : '') : '', '', sent));
      el.insertAdjacentHTML('beforeend', sec(2, 'Help the parent decide', ' · pictures to send if they ask', '', false));
      el.insertAdjacentHTML('beforeend', sec(3, 'Follow up', enr ? ' · enrolled' : f && f.st ? ' · now: ' + esc(f.st) + (f.note ? ' · ' + esc(f.note) : '') : ' · not followed up yet', '', enr));
      const enrBody = enr ? '<div class="card" style="margin-top:8px;padding:10px 12px;background:#F1FAF9;border-color:#BFE6E3"><b style="color:#00737B">✓ Enrolled</b>' +
          (P ? ' · ' + (P.left === '' ? 'shared package' : esc(P.left) + ' lessons left') + ' · ' + esc(P.teacher || '') + ' · ACTIVE row ' + esc(P.row) : f && f.note ? ' · ' + esc(f.note) : '') +
          '<div class="small mute" style="margin-top:2px">Recorded in ACTIVE' + (P ? '' : ' (the app shows the row within a few minutes)') + '. A later package is "Renewed · paid" on the student page.</div>' +
          (t.code ? '<button class="btn ghost sm" style="margin-top:8px" onclick="closeSheet();openStudent(\'' + esc(t.code) + '\')">Open ' + esc(t.student) + '\'s page</button>' : '') + '</div>' : '';
      el.insertAdjacentHTML('beforeend', sec(4, 'Enrol', enr ? '' : ' · when the parent has paid (or lessons are transferred)', enrBody, enr));
      el.insertAdjacentHTML('beforeend', sec(5, 'Get started', ' · after enrolling', '', false));
      const rows = el.querySelectorAll('.tlRow'), put = (i, L) => L.forEach(b => rows[i].appendChild(b));
      put(0, send); put(1, decide);
      if(!enr){ put(2, fu); tpE.forEach(b => { b.textContent = 'Add to DATABASE first'; if(!t.code) rows[2].appendChild(b); }); }
      if(!enr){ if(enrolB.length){ enrolB.forEach(b => { b.textContent = 'Enrolled · paid · record the first package'; b.classList.add('grow'); rows[3].appendChild(b); }); }
        else rows[3].insertAdjacentHTML('beforeend', '<div class="small mute">' + (t.code ? '' : 'This trial has no student code yet · use "Add to DATABASE first" in step 3') + '</div>'); }
      put(4, after); if(t.code && enr) rows[4].insertAdjacentHTML('beforeend', '<button class="btn ghost" onclick="cnOpen(\'' + esc(t.code) + '\')">Class notice</button>');
      if(rest.length){ el.insertAdjacentHTML('beforeend', '<div class="row tlRow" style="gap:8px;flex-wrap:wrap;margin-top:10px;width:100%"></div>'); const z = el.querySelectorAll('.tlRow'); rest.forEach(b => z[z.length - 1].appendChild(b)); }
      [...el.querySelectorAll('.tlRow')].forEach(x => { if(!x.children.length) x.remove(); });
      el.querySelectorAll('div').forEach(d => { if(/^After the report/.test((d.firstChild && d.firstChild.textContent) || '') ) d.remove(); });
      if(t.code && !(AT && AT.rows) && !window._tlAT){ window._tlAT = 1; loadActive(true).then(() => { window._tlAT = 0; if(TLD === t) tlBtns(); }).catch(() => { window._tlAT = 0; }); }
    }catch(e){ console.warn('trial steps', e); } return r; };
})();
