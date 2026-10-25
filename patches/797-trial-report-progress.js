// 797: (Misty) "once I filled the trial report, it should show progress and not to click it again, otherwise, this would make teachers carelessly fill it
//       knowing maybe they havent done it yet?"
// · Once a trial report is sent, the class card's "Trial report" button becomes a green "✓ Report sent · 17/36 · A2".
// · Tapping it (or any other way into that trial's report) opens the PROGRESS, not the form:
//     1 Report sent (when, score, CEFR) · 2 Parent PDF ready · 3 Sent to the parent (by Ops) · 4 The family's answer (enrolled / follow-up).
//   A report cannot be sent twice from the app; changes go through management.
// · Progress comes from coe-trials v9 (TR-DATA copy + reports sent in the app); a report just sent shows at once from this device.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 797 · trial report sent → progress, not the form again */
(function(){
  if(window.__797 || typeof window.trialSheet !== 'function') return; window.__797 = 1;
  const LK = 'coe.trprog', MK = 'coe.trsent';
  const low = x => String(x || '').trim().toLowerCase(), up = x => String(x || '').trim().toUpperCase();
  let P = null; try{ P = JSON.parse(localStorage.getItem(LK) || 'null'); }catch(e){}
  const mine = () => { try{ return JSON.parse(localStorage.getItem(MK) || '{}') || {}; }catch(e){ return {}; } };
  const kOf = q => String(q.date || '').slice(0, 10) + '|' + low(q.student);
  let BUSY = 0;
  async function load(force){
    if(typeof D === 'undefined' || !D || !TOKEN || BUSY) return; if(!force && P && P.who === low((D.me || {}).name) && Date.now() - P.at < 2 * 6e4) return; BUSY = 1;
    try{ const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, as: (D.me && D.me.name) || '' }) }).then(x => x.json());
      if(r && r.ok && Array.isArray(r.list)){ P = { at: Date.now(), who: low((D.me || {}).name), list: r.list }; try{ localStorage.setItem(LK, JSON.stringify(P)); }catch(e){} paint(); if($('trPg')) prog(); } }catch(e){}
    BUSY = 0; }
  // The report for this trial (same day, same student or code), best row first (Google's copy beats "just sent").
  function find(q){ if(!q) return null; const d = String(q.date || '').slice(0, 10), sl = low(q.student), c = up(q.code);
    const L = ((P && P.list) || []).filter(x => x.d === d && ((sl && x.s === sl) || (c && x.c === c))).sort((a, b) => (a.q ? 1 : 0) - (b.q ? 1 : 0));
    if(L.length) return L[0];
    const m = mine()[kOf(q)]; if(m) return Object.assign({ q: 1 }, m);
    return null; }
  window.trSentOf = find;
  // Remember a report the moment Google/the database accepts it (this device).
  const _api = window.api; if(_api) window.api = function(fn, tok, ctx, body){ const p = _api.apply(this, arguments);
    if(fn === 'tTrialSubmit' && ctx && body){ Promise.resolve(p).then(r => { if(r && r.ok){ try{ const M = mine(), T = window.trTot ? trTot() : null;
      const now = new Date(Date.now() + 8 * 3600e3).toISOString().replace('T', ' ').slice(0, 16);
      M[kOf(ctx)] = { d: String(ctx.date).slice(0, 10), s: low(ctx.student), c: up(ctx.code), at: now, t: r.total || (T && T.all ? T.t : ''), cefr: r.cefr || (T && T.all && typeof trRub === 'function' ? trRub(T.t) : '') };
      Object.keys(M).forEach(k => { if(k.slice(0, 10) < new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10)) delete M[k]; });
      localStorage.setItem(MK, JSON.stringify(M)); }catch(e){} setTimeout(paint, 50); setTimeout(() => load(true), 4000); } }).catch(() => {}); }
    return p; };
  // Class cards: "Trial report" → "✓ Report sent".
  function paint(){ try{ document.querySelectorAll('button[onclick^="trialSheet("]').forEach(b => { const n = +(String(b.getAttribute('onclick')).match(/\d+/) || [-1])[0], q = TRQS[n], x = find(q);
    if(!x) return;
    b.className = 'btn sm'; b.style.cssText = 'margin:8px 0 0 6px;background:#E6F4EC;color:#1F7A4F;border:1px solid #BFE3D2;box-shadow:none';
    b.textContent = '✓ Report sent' + (x.t ? ' · ' + x.t + '/36' : '') + (x.cefr ? ' · ' + x.cefr : ''); b.title = 'See its progress'; }); }catch(e){} }
  // Progress card.
  let Q = null;
  const step = (ok, now, t, s) => '<div style="display:flex;gap:12px;padding:10px 0;border-top:1px dashed #E3E8EC"><span style="flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;'
    + (ok ? 'background:#2E9E6F;color:#fff">✓' : now ? 'background:#FFF1E6;color:#C0533F;border:2px solid #E4846B">…' : 'background:#EEF1F4;color:#9AA5AE">·') + '</span><div class="grow"><b' + (ok || now ? '' : ' class="mute"') + '>' + t + '</b>' + (s ? '<div class="small mute">' + s + '</div>' : '') + '</div></div>';
  function prog(){ const q = Q, x = find(q); if(!q || !x) return;
    const sent = !!x.sent, pdf = !!x.pdf, enr = /^enrolled/i.test(x.enr || ''), fu = x.fu || '', fmt = d => { const z = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(z) ? d : z.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
    const h = '<div id="trPg"><h1>Trial report · sent</h1><div class="mute small">' + esc(q.student) + (q.code ? ' · ' + esc(q.code) : '') + ' · ' + esc(fmt(q.date)) + (q.time ? ' · ' + esc(q.time) : '') + '</div>'
      + '<div style="margin:14px 0 4px;padding:12px 14px;border-radius:14px;background:#F3FAF6;border:1px solid #BFE3D2"><b style="color:#1F7A4F">✓ Your report is in.</b> <span class="small">You don’t need to fill it in again. Here is where it is now.</span></div>'
      + step(true, false, 'Report sent', esc(x.at || '') + (x.t ? ' · ' + esc(x.t) + '/36' : '') + (x.cefr ? ' · CEFR ' + esc(x.cefr) : '') + (x.q ? ' · Google is adding it to the trial list' : ''))
      + step(pdf, !pdf, 'Parent report (PDF)', pdf ? 'Ready · <a class="link" href="' + esc(x.pdf) + '" target="_blank">Open the PDF</a>' : 'Being made from your answers · usually a few minutes')
      + step(sent, pdf && !sent, 'Sent to the family', sent ? esc(x.sent.replace(/^Report sent to parent\s*/i, '').replace(/^·\s*/, '')) : 'Ops sends it to the family on WeChat')
      + step(enr, sent && !enr, 'The family’s answer', enr ? 'Enrolled' + (x.fc ? ' · first class ' + esc(fmt(x.fc)) : '') + ' 🎉' : fu ? esc(fu) : sent ? 'Ops is following up with the family' : 'After the report is sent')
      + '<div class="small mute" style="margin-top:14px">Need to change something in this report? Message management. A report can only be sent once, so the family never gets two.</div>'
      + '</div>';
    if($('trPg')) $('trPg').outerHTML = h; else $('sheetBody').innerHTML = h; }
  const _ts = window.trialSheet;
  window.trialSheet = function(i){ const q = TRQS[i], x = find(q);
    if(!x) return _ts.apply(this, arguments);
    Q = q; openSheet('<div id="trPg"></div>'); prog(); load(true); };
  const hook = n => { const f0 = window[n]; if(typeof f0 !== 'function') return; window[n] = function(){ const r = f0.apply(this, arguments); setTimeout(paint, 0); try{ if(D && (D.schedule || []).some(c => c.type === 'Trial')) load(); }catch(e){} return r; }; };
  hook('render'); hook('renderToday');
  setTimeout(() => { paint(); load(); }, 1500);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
