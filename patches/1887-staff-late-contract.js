// 1887: (Misty 8 Nov 10:30–10:37 "Celine's late time in should be counted penalty now … ensure that her pay is counted accurately" ·
//   "if she's late, she can attach proof why she's late" · "timing in exactly 10:00 or 13:00 should be considered late" · contract Annex A
//   "Late Arrival: PHP 50 deduction per hour" → ₱50 per started hour)
//   Office staff (management mode, staff role not teacher): Overview › "My late time-ins" card (coe-late mine, now open to office staff):
//   each late with time-in, shift start, minutes, the contract deduction or the President's decision, and "Submit proof or reason"
//   (reason + optional picture, once). Lates to decide: one's own late shows "The President decides" instead of the buttons.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["/* 1883 · Release check (payroll) */",
   `/* 1887 · office staff: my late time-ins (contract) */
(function(){
  const U = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-late';
  let R = null, at = 0, busy = false, IMG = '';
  const call = (action, o) => fetch(U, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, action }, o || {})) }).then(x => x.json());
  const hm = s => String(s || '').slice(11, 16), day = s => { try{ return new Date(String(s).slice(0, 10) + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }); }catch(x){ return ''; } };
  async function load(force){ if(busy || !TOKEN || !(typeof D !== 'undefined' && D && D.mgr) || (!force && Date.now() - at < 5 * 6e4)) return; busy = true;
    try{ const r = await call('mine'); if(r && r.ok){ R = r; at = Date.now(); paint(); } }catch(e){} finally{ busy = false; } }
  function paint(){ const v = $('v-home'); if(!v) return; let el = $('slt1887');
    const L = (R && R.staff && R.rows || []).filter(x => x.kind === 'Late' && x.day >= '2026-11-08');
    if(!L.length){ if(el) el.remove(); return; }
    const row = x => { const d = x.dec, ex = (R.ex || {})[x.key], w = d && d.cond === 'Waived';
      const st = w ? '<b style="color:#1E7A55">Waived by the President · no deduction</b>' : d ? '<b style="color:#B03A2E">' + esc(d.cond) + ' · −₱' + (x.contract || d.amount || 0) + ' (contract)</b>' : '<b style="color:#B54708">−₱' + (x.contract || 50) + ' per contract unless the President waives it</b>';
      return '<div style="padding:8px 0;border-top:1px solid #F3E3BF"><div class="row" style="gap:8px;align-items:baseline"><b class="grow">' + esc(day(x.at)) + ' · time-in ' + esc(hm(x.at)) + '</b><span class="small mute">shift start ' + esc(hm(x.first)) + ' · ' + (x.lateMins || '') + ' min late</span></div><div class="small">' + st + '</div>'
        + (ex ? '<div class="small mute">Your reply: ' + esc(ex.reason) + (ex.img ? ' · <a class="link" href="' + esc(ex.img) + '" target="_blank" rel="noopener">picture</a>' : '') + ' · waiting for the President</div>'
              : !d ? '<button class="btn sm teal" style="margin-top:6px" onclick="slt1887Open(\\'' + esc(encodeURIComponent(x.key)) + '\\')">Submit proof or reason</button>' : '') + '</div>'; };
    const html = '<div id="slt1887" style="border:1.5px solid #F0D29A;background:#FFFBF2;border-radius:16px;padding:14px 16px;margin:0 0 16px"><b>My late time-ins</b><div class="small mute" style="margin:2px 0 4px">' + esc((R.contract && R.contract.text) || 'Contract: ₱50 per started hour late.') + ' On time = timed in before the shift start (13:00:00 or 10:00:00 is late).</div>' + L.map(row).join('') + '</div>';
    if(el) el.outerHTML = html; else v.insertAdjacentHTML('afterbegin', html); }
  window.slt1887Open = ek => { const k = decodeURIComponent(ek), x = ((R && R.rows) || []).find(y => y.key === k); if(!x) return; IMG = '';
    openSheet('<h1>Submit proof or reason</h1><div class="small mute">Late time-in · ' + esc(day(x.at)) + ' · time-in ' + esc(hm(x.at)) + ' · shift start ' + esc(hm(x.first)) + '</div>'
      + '<label style="margin-top:10px;display:block">Reason <span class="mute">(required)</span></label><textarea id="sltR" class="in-t" rows="4" maxlength="500" style="width:100%" placeholder="State what happened, with times if possible."></textarea>'
      + '<label style="margin-top:10px;display:block">Proof picture <span class="mute">(optional, recommended)</span></label><input id="sltF" type="file" accept="image/*" onchange="slt1887Pick(this)"><div id="sltP" class="small mute"></div>'
      + '<p class="small mute">You can submit once. The President reviews it with the time-in record and decides: deduction per contract, or Waived.</p>'
      + '<button class="btn teal block" id="sltGo" onclick="slt1887Send(\\'' + esc(encodeURIComponent(k)) + '\\')">Submit</button><button class="btn ghost block" style="margin-top:8px" onclick="closeSheet()">Cancel</button>'); };
  window.slt1887Pick = inp => { const f = inp.files && inp.files[0]; IMG = ''; if(!f) return; const img = new Image(), u = URL.createObjectURL(f);
    img.onload = () => { try{ let w = img.width, h = img.height; const m = 1400; if(Math.max(w, h) > m){ const s = m / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
        const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h); let q = 0.82, d = c.toDataURL('image/jpeg', q);
        while(d.length > 520000 && q > 0.4){ q -= 0.1; d = c.toDataURL('image/jpeg', q); } IMG = d; $('sltP').textContent = 'Picture ready ✓'; }catch(e){ $('sltP').textContent = 'The picture could not be read.'; } URL.revokeObjectURL(u); };
    img.src = u; };
  window.slt1887Send = async ek => { const k = decodeURIComponent(ek), reason = (($('sltR') || {}).value || '').trim(), b = $('sltGo'); if(!reason) return toast('Write the reason.');
    if(b){ b.disabled = true; b.textContent = 'Sending…'; }
    let r = null; try{ r = await call('submit', { key: k, reason, img: IMG || undefined, dev: (navigator.userAgent || '').slice(0, 40) }); }catch(e){}
    if(!r || !r.ok){ if(b){ b.disabled = false; b.textContent = 'Submit'; } return toast((r && r.error) || 'Not sent · try again'); }
    closeSheet(); toast('Sent ✓ · the President decides'); load(true); };
  const rh = window.renderHome; if(typeof rh === 'function') window.renderHome = function(){ const r = rh.apply(this, arguments); try{ paint(); load(); }catch(e){} return r; };
  try{ const hv = $('v-home'); if(hv) new MutationObserver(() => { if(R && R.staff && !$('slt1887')) paint(); }).observe(hv, { childList: true }); }catch(e){}
  setTimeout(() => load(true), 5000); setInterval(() => load(true), 15 * 6e4);
})();
/* 1883 · Release check (payroll) */`],
]);
