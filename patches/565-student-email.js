// 22 Oct · Misty: the student's email in Edit student / New student (Trials, Students, everywhere the student form opens),
// management only. One place for it: the billing profile (coe_bill_profiles, the same one Payment Confirmation fills from and
// updates when it is issued), so the email always shows up in Make payment confirmation. Server: coe-invoice v8 contact / contact_set.
require('../tools/lib.js')(process.argv[2], [
["const ob = new MutationObserver(() => { try{ addBtns(); }catch(x){} });",
`/* 565 · the student's email (for payment confirmations) in the student form; one place: the billing profile */
const EM = {}; let PEND = null;
const okMail = m => !m || /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(m);
function addMail(){
  const b = document.getElementById('sheetBody'); if(!b || !b.querySelector('#sEn') || !b.querySelector('#sSrc') || b.querySelector('#sMail')) return;
  try{ if(!(D && D.mgr)) return; }catch(x){ return; }
  const sub = [...b.querySelectorAll('.mute.small')].find(x => /DATABASE/.test(x.textContent)), m = sub && /saves into this row|New row for/.test(sub.textContent) ? sub.textContent.match(/ST-\\d{4}-\\d{3}/) : null, code = m ? m[0] : '';
  const at = b.querySelector('#sSrcL') || b.querySelector('#sSrc');
  at.insertAdjacentHTML('afterend', '<label>Email <span class="zh">邮箱</span> <span class="mute small">· parent or student · used for payment confirmations</span></label><input id="sMail" class="in-t" type="email" inputmode="email" autocomplete="off" placeholder="e.g. parent@qq.com">');
  const el = b.querySelector('#sMail'); el.dataset.code = code; el.addEventListener('input', () => { el.dataset.t = 1; });
  if(!code) return;
  const put = v => { el.dataset.o = v || ''; if(!el.dataset.t) el.value = v || ''; };
  if(EM[code] != null) put(EM[code]);
  call('contact', { code }).then(r => { EM[code] = r.email || ''; if(document.body.contains(el)) put(EM[code]); }).catch(() => {}); }
(function(){ const _s = window.sendStu; if(typeof _s !== 'function') return;
  window.sendStu = function(row, code){ const el = document.getElementById('sMail');
    if(el){ const v = el.value.trim().toLowerCase(); if(!okMail(v)){ el.focus(); return tst('The email address looks wrong.'); } PEND = { email: v, o: String(el.dataset.o || '').toLowerCase(), code: code || el.dataset.code || '' }; }
    return _s.apply(this, arguments); }; })();
(function(){ const _a = window.api; if(typeof _a !== 'function') return;
  window.api = function(fn, ...a){ const p = _a.apply(this, [fn, ...a]);
    if(fn === 'saveStudent' && PEND){ const P = PEND; PEND = null;
      Promise.resolve(p).then(r => { if(!r || !r.ok) return; const code = String((a[1] && a[1].code) || r.code || P.code || '').trim(); if(!/^ST-\\d{4}-\\d{3}$/.test(code) || P.email === P.o) return;
        call('contact_set', { code, email: P.email }).then(() => { EM[code] = P.email; delete BC[code]; }).catch(err => tst('Email not saved: ' + err.message)); }).catch(() => {}); }
    return p; }; })();
const ob = new MutationObserver(() => { try{ addBtns(); }catch(x){} try{ addMail(); }catch(x){} });`],
]);
