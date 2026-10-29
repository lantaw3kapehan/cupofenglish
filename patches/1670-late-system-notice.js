// 1670: (Misty 19:14, 29 Oct: "ensure language is standard and policy-based") System notice for a recorded late.
// When a Late time-in or Late to class is recorded, the teacher sees a neutral, automatic notice in her own app, on Today and on
// Pay › Punctuality (it replaces the red "pending review" line). It is clearly from the system: header "System notice · automatic".
// Facts: the class (student first name, start time), the "I'm in" / time-in time, minutes late, the device and internet at that
// moment, her own screen picture from the moment she tapped; the POLICY rule; the outcome with the real POLICY amount for her rank
// (New / Regular) and the demerit points for her tier; the decision when there is one (Excused / Unexcused / Waived, amount, case ID).
// One button, "Submit proof or reason": reason (required, up to 500 characters) and an optional picture. One submission per late;
// after that the notice shows "Submitted · waiting for management". Saved in the database (Supabase function coe-late, table
// late_explain, private bucket late-proof), never in Google. A teacher sees only her own notices (the server checks the token).
// Drawn at the source (the existing 1484 paint after renderToday / renderPay, from the saved copy first): no extra observers, no
// Google calls. Policy, amounts, decideLate and autoLateUnexcused are unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "  async function loadLates(){ try{ const r = await call('lates');", B = "  function paintLates(){ if(typeof D === 'undefined' || !D || D.mgr) return;";
if (s.split(A).length !== 2 || s.split(B).length !== 2) { console.error('1670: late module anchors not found once'); process.exit(1); }
const i = s.indexOf(A), j = s.indexOf(B);
if (j < i) { console.error('1670: anchors out of order'); process.exit(1); }
const NEW = String.raw`  /* 1670 · System notice for a recorded late (database: coe-late; falls back to coe-train lates) */
  const LX_URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-late';
  const lxCall = async (action, o) => { const r = await fetch(LX_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, action }, o || {})) });
    let j = null; try{ j = await r.json(); }catch(x){} if(!j || !j.ok){ const er = new Error((j && j.error) || 'Could not reach the server. Try again.'); er.dup = !!(j && j.dup); throw er; } return j; };
  const lxMe = () => String((typeof D !== 'undefined' && D && D.me && D.me.name) || '').trim().toLowerCase();
  const lxKey = r => r.key || (lxMe() + '|' + r.at);
  const lxDec = r => { if(r.dec !== undefined) return r.dec; const n = String(r.note || ''), d0 = n.split(' · ')[0].trim(); if(!/^(Waived|Excused|Unexcused)$/.test(d0)) return null;
    const a = (n.match(/₱\s?([\d,]+)/) || [])[1]; return { cond: d0, amount: a ? +a.replace(/,/g, '') : 0, caseId: (n.match(/\bOAR-\d{4}-\d+\b/) || [])[0] || '', auto: false }; };
  async function loadLates(){ try{ let r = null; try{ r = await lxCall('mine'); }catch(x){ r = await call('lates'); }
      if(r && r.ok){ const old = (LT && LT.ex) || {}, now = Date.now();
        Object.keys(r.ex || {}).forEach(k => { const o = old[k], n = r.ex[k]; if(o && o.img && n.hasImg && o.imgAt && now - o.imgAt < 45 * 6e4) { n.img = o.img; n.imgAt = o.imgAt; } else n.imgAt = now; });   /* same picture link for 45 min: no redraw */
        LT = r; LTT = now; try{ if(window.ft1484){ const c = JSON.parse(JSON.stringify(r)); Object.keys(c.ex || {}).forEach(k => { if(/^data:/.test(String(c.ex[k].img || ''))) c.ex[k].img = null; }); ft1484.put('lt', JSON.stringify(c)); } }catch(y){} paintLates(); } }catch(x){} }
  function ltStatus(){ if(LT && LT.status) return LT.status; const rk = (typeof D !== 'undefined' && D && D.me && D.me.rank) || ''; return /newly hired|starting/i.test(rk) ? 'New' : 'Regular'; }
  function ltAmt(kind, cond){ const tier = ltStatus(), subj = kind === 'Late' ? 'Teacher Late Time-in' : 'Teacher Late to Class';
    const p = ((LT && LT.policy) || []).find(x => x.subject === subj && x.condition === (cond || 'Unexcused') && (x.tier === tier || x.tier === 'All')); return p ? p.amount : 0; }
  const lxHM = s => String(s || '').slice(11, 16);
  const lxDay = s => { try{ return new Date(String(s).slice(0, 10) + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }); }catch(x){ return ''; } };
  const lxDue = r => { const t = Date.parse(r.at + '+08:00') + 864e5; return { t, s: new Date(t).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }) }; };
  const lxLateMin = r => { const m = r.mins === '' || r.mins == null || isNaN(+r.mins) ? null : +r.mins, at = Date.parse(r.at + '+08:00'), f = r.first ? Date.parse(r.first + '+08:00') : NaN;
    if(r.kind === 'Late'){ if(m != null) return Math.max(1, 30 - m); return isNaN(f) ? null : Math.max(1, Math.round((at - (f - 30 * 6e4)) / 6e4)); }
    if(m != null) return Math.max(1, Math.abs(m)); return isNaN(f) ? null : Math.max(1, Math.round((at - f) / 6e4)); };
  const lxIco = { sys: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    rule: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5a2.5 2.5 0 0 0 0 5H20"/></svg>',
    out: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    ok: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
    img: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/></svg>' };
  const lxDrive = u => { const m = String(u || '').match(/\/d\/([\w-]{20,})/) || String(u || '').match(/[?&]id=([\w-]{20,})/); return m ? m[1] : ''; };
  function lxFacts(r){ const f = [], late = lxLateMin(r), first = lxHM(r.first);
    if(r.kind === 'Late'){ f.push(['First class', (r.student ? r.student + ' · ' : '') + (first || '—')]); f.push(['Time-in', lxHM(r.at)]); }
    else { f.push(['Class', (r.student ? r.student + ' · ' : '') + (first || '—')]); f.push(['"I\'m in"', lxHM(r.at)]); }
    f.push(['Minutes late', late == null ? '—' : String(late)]);
    if(r.device) f.push(['Device', r.device]);
    const sp = String(r.speed || '').split(' · ').filter(x => !/^jitter/i.test(x)).join(' · '); if(r.net || sp) f.push(['Internet', [r.net, sp].filter(Boolean).join(' · ')]);
    return '<dl class="lxn-f">' + f.map(x => '<div' + (/^(Device|Internet)$/.test(x[0]) ? ' class="w"' : '') + '><dt>' + e(x[0]) + '</dt><dd>' + e(x[1]) + '</dd></div>').join('') + '</dl>'; }
  function lxProof(r){ if(!r.proof) return ''; const id = lxDrive(r.proof);
    return '<a class="lxn-pf" href="' + e(r.proof) + '" target="_blank" rel="noopener"><span class="lxn-th">' + lxIco.img + (id ? '<img alt="" loading="lazy" src="https://drive.google.com/thumbnail?id=' + e(id) + '&amp;sz=w240" onerror="this.remove()">' : '') + '</span><span>Your screen at ' + e(lxHM(r.at)) + '<small>Recorded when you tapped · open</small></span></a>'; }
  function lxOutcome(r, d){ const due = lxDue(r), un = ltAmt(r.kind, 'Unexcused'), dm = +((LT && LT.demerit) || 0);
    if(d){ const amt = d.cond === 'Waived' ? 0 : (d.amount || 0);
      return '<p class="lxn-o done">' + lxIco.out + '<span><b>Decision: ' + e(d.cond) + '</b>' + (d.auto ? ' (not excused within 24 hours)' : '') + ' · ' + (amt ? '−₱' + e(amt) : 'no deduction') + (d.caseId ? ' · Case ' + e(d.caseId) : '') + '</span></p>'; }
    const tail = 'Unexcused · −₱' + e(un) + (dm ? ' and ' + dm + ' demerit points' : '') + '.';
    if(Date.now() > due.t) return '<p class="lxn-o">' + lxIco.out + '<span>Not excused within 24 hours. At the next hourly check this is recorded as ' + tail + '</span></p>';
    return '<p class="lxn-o">' + lxIco.out + '<span>If not excused within 24 hours this becomes ' + tail + ' <small>Deadline: ' + e(due.s) + '</small></span></p>'; }
  function lxReply(x, mine){ if(!x) return ''; const t = x.at ? new Date(x.at).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }) : '';
    return '<div class="lxn-y"><div class="lxn-yh">' + (mine ? 'Your reply' : 'Reply') + (t ? ' · submitted ' + e(t) : '') + '</div><div class="lxn-yq">' + e(x.reason) + '</div>'
      + (x.img ? '<a class="lxn-yi" href="' + e(x.img) + '" target="_blank" rel="noopener"><img alt="Your proof picture" src="' + e(x.img) + '"></a>' : x.hasImg ? '<span class="lxn-yi">' + lxIco.img + '</span>' : '') + '</div>'; }
  function lxCard(r){ const d = lxDec(r), k = lxKey(r), x = ((LT && LT.ex) || {})[k], cls = r.kind === 'Late' ? 'Late time-in' : 'Late to Class';
    const rule = r.kind === 'Late' ? 'Policy: time in at least 30 minutes before your first class.' : 'Policy: tap "I\'m in" by the class start. No grace period.';
    const act = d ? '' : x ? '<div class="lxn-s">' + lxIco.ok + 'Submitted · waiting for management</div>' : '<button type="button" class="btn sm teal lxn-b" onclick="lxOpen1670(\'' + e(encodeURIComponent(k)) + '\')">Submit proof or reason</button>';
    return '<article class="lxn' + (d ? ' is-d' : x ? ' is-s' : '') + '" data-lx="' + e(k) + '"><div class="lxn-h">' + lxIco.sys + '<span>System notice · automatic</span><span class="lxn-t">' + e(lxDay(r.at)) + ' · ' + e(lxHM(r.at)) + '</span></div>'
      + '<h3>' + e(cls) + ' · recorded by the system</h3>' + lxFacts(r) + lxProof(r)
      + '<p class="lxn-r">' + lxIco.rule + '<span>' + e(rule) + '</span></p>' + lxOutcome(r, d) + lxReply(x, true) + act + '</article>'; }
  function lxRow(r){ const d = lxDec(r), late = lxLateMin(r);
    const st = !d ? '<b class="lt-p">Pending · −₱' + ltAmt(r.kind) + ' unless excused by ' + e(lxDue(r).s) + '</b>' : d.cond === 'Waived' ? '<b class="lt-w">Waived</b>' : '<b class="lt-d">' + e(d.cond) + (d.amount ? ' · −₱' + e(d.amount) : '') + '</b>';
    return '<span class="lt-it"><span class="grow"><b>' + e(r.kind === 'Late' ? 'Late time-in' : 'Late to class') + '</b>' + (late != null ? ' · ' + late + ' min' : '') + '<small>' + e(lxDay(r.at)) + ' · ' + e(lxHM(r.at)) + (r.first ? ' · class ' + e(lxHM(r.first)) : '') + '</small></span>' + st + '</span>'; }
  window.lxOpen1670 = function(ek){ const k = decodeURIComponent(ek), r = ((LT && LT.rows) || []).find(x => lxKey(x) === k); if(!r) return;
    if(lxDec(r)) return toast('This late has already been decided.'); if(((LT && LT.ex) || {})[k]) return toast('Already submitted · waiting for management');
    window._lx1670 = { k, img: '' };
    openSheet('<div class="lxf"><div class="lxn-h">' + lxIco.sys + '<span>System notice · automatic</span></div><h1>Submit proof or reason</h1>'
      + '<div class="small mute">' + e(r.kind === 'Late' ? 'Late time-in' : 'Late to Class') + ' · ' + e(lxDay(r.at)) + (r.first ? ' · class ' + e(lxHM(r.first)) : '') + ' · ' + (r.kind === 'Late' ? 'time-in ' : '"I\'m in" ') + e(lxHM(r.at)) + '</div>'
      + '<label for="lxR">Reason <span>(required)</span></label><textarea id="lxR" rows="4" maxlength="500" placeholder="State what happened, with times if possible." oninput="lxCnt1670()"></textarea><div class="lxf-c"><span id="lxC">0 / 500</span></div>'
      + '<label for="lxF">Proof picture <span>(optional, recommended)</span></label><div class="small mute">For example, a screenshot that shows the time, or a notice of a power or internet outage.</div>'
      + '<label class="lxf-p" id="lxP">' + lxIco.img + '<span>Choose a picture</span><input id="lxF" type="file" accept="image/*" onchange="lxPick1670(this)"></label>'
      + '<p class="small mute">You can submit once. Management reviews it with the system record and decides: Excused, Unexcused or Waived.</p>'
      + '<div id="lxE" class="lxf-e" role="alert"></div><button type="button" class="btn block teal" id="lxGo" onclick="lxSend1670()">Submit</button><button type="button" class="btn ghost block" style="margin-top:8px" onclick="closeSheet()">Cancel</button></div>'); };
  window.lxCnt1670 = function(){ const t = $('lxR'), c = $('lxC'); if(t && c) c.textContent = t.value.length + ' / 500'; };
  async function lxShrink(f){ const u = URL.createObjectURL(f); try{ const im = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('This picture could not be read. Choose another one.')); i.src = u; });
      let sc = Math.min(1, 1400 / Math.max(im.naturalWidth || 1, im.naturalHeight || 1)), d = '';
      for(let n = 0; n < 4; n++){ const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.naturalWidth * sc)); c.height = Math.max(1, Math.round(im.naturalHeight * sc));
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
        for(let q = .82; q >= .42; q -= .1){ d = c.toDataURL('image/jpeg', q); if(d.length * .75 < 380000) return d; } sc *= .7; }
      throw new Error('This picture is too large. Choose a smaller one.'); } finally{ URL.revokeObjectURL(u); } }
  window.lxPick1670 = async function(inp){ const f = inp.files && inp.files[0], p = $('lxP'), E = $('lxE'); if(!f || !window._lx1670) return; if(E) E.textContent = '';
    try{ const d = await lxShrink(f); window._lx1670.img = d; if(p){ p.classList.add('has'); const sp = p.querySelector('span'); if(sp) sp.textContent = 'Change picture'; let im = p.querySelector('img'); if(!im){ im = document.createElement('img'); im.alt = 'Selected picture'; p.prepend(im); } im.src = d; } }
    catch(x){ window._lx1670.img = ''; if(E) E.textContent = x.message; } };
  window.lxSend1670 = async function(){ const S = window._lx1670, t = $('lxR'), E = $('lxE'), b = $('lxGo'); if(!S || !t || !b) return; const reason = t.value.trim();
    if(!reason){ if(E) E.textContent = 'Write the reason.'; t.focus(); return; } if(reason.length > 500){ if(E) E.textContent = 'The reason is longer than 500 characters.'; return; }
    b.disabled = true; b.textContent = 'Sending…'; if(E) E.textContent = '';
    try{ const j = await lxCall('submit', { key: S.k, reason, img: S.img || undefined, dev: (typeof deviceInfo === 'function' ? String(deviceInfo()).slice(0, 40) : '') });
      LT.ex = LT.ex || {}; LT.ex[S.k] = { reason, at: j.at || new Date().toISOString(), img: S.img || null, hasImg: !!S.img, imgAt: Date.now() }; window._lx1670 = null;
      closeSheet(); paintLates(); toast('Submitted · waiting for management'); setTimeout(loadLates, 1500); }
    catch(x){ if(x.dup){ window._lx1670 = null; closeSheet(); toast('Already submitted · waiting for management'); loadLates(); return; } b.disabled = false; b.textContent = 'Submit'; if(E) E.textContent = x.message; } };
  /* the open late in Needs your action (Today) opens the form; the notice itself is drawn right under it */
  (window.q1106Extra = window.q1106Extra || []).push(function(){ if(typeof D === 'undefined' || !D || D.mgr) return [];
    return ((LT && LT.rows) || []).filter(r => !lxDec(r) && !(((LT && LT.ex) || {})[lxKey(r)])).map(r => ({ sev: 1, kind: 'Late', red: true, title: (r.kind === 'Late' ? 'Late time-in' : 'Late to Class') + ' · recorded by the system',
      sub: lxDay(r.at) + ' · ' + lxHM(r.at) + ' · if not excused within 24 hours this becomes Unexcused', verb: 'Submit proof or reason', due: { d: 0, txt: 'Within 24 h' }, act: function(){ window.lxOpen1670(encodeURIComponent(lxKey(r))); } })); });
  function ltHtml(full){ const R = (LT && LT.rows) || []; if(!R.length) return '';
    if(!full){ const recent = Date.now() - 2 * 864e5, L = R.filter(r => !lxDec(r) || Date.parse(r.at + '+08:00') > recent); if(!L.length) return '';
      return '<section id="lxNote" class="lxn-w" aria-label="System notices">' + L.map(r => lxDec(r) ? '<details class="lxn-d"><summary>' + lxRow(r) + '</summary>' + lxCard(r) + '</details>' : lxCard(r)).join('') + '</section>'; }
    const pend = R.filter(r => !lxDec(r)), done = R.filter(r => lxDec(r));
    return '<section id="txLate" class="sec lt"><h2>Punctuality <span class="c">late time-ins · last 40 days · POLICY</span></h2>' + pend.map(lxCard).join('')
      + done.map(r => '<details class="lxn-d"><summary>' + lxRow(r) + '</summary>' + lxCard(r) + '</details>').join('')
      + '<div class="small mute" style="margin-top:8px">Time in opens 40 minutes before your first class · on time until 30 minutes before. "I\'m in" opens 5 minutes before each class (e.g. :25 for a :30 class) · on time until the class starts. A late not excused or waived within 24 hours becomes Unexcused (−₱' + ltAmt('Late') + ' ' + ltStatus() + ' rate).</div></section>'; }
  function ltPut(id, full){ const v = $(id); if(!v) return; if(!LT && window.ft1484){ try{ const c = ft1484.take('lt'); if(c) LT = JSON.parse(c); }catch(y){} }
    const sel = full ? '#txLate' : '#lxNote', h = ltHtml(full), c = v.querySelector(sel); if(!full){ const old = v.querySelector('#txLate'); if(old) old.remove(); }
    if(!h){ if(c) c.remove(); return; } if(c && c._h === h) return;
    const w = document.createElement('div'); w.innerHTML = h; const n = w.firstElementChild; n._h = h;
    if(c){ const open = [].map.call(c.querySelectorAll('details[open]'), x => x.querySelector('[data-lx]') && x.querySelector('[data-lx]').getAttribute('data-lx')); open.forEach(k => { const a = n.querySelector('[data-lx="' + (window.CSS && CSS.escape ? CSS.escape(k) : k) + '"]'); if(a && a.closest('details')) a.closest('details').open = true; }); c.replaceWith(n); return; }   /* in place: same spot, open details kept */
    const ld = v.querySelector(':scope > .lead'); if(ld) ld.after(n); else v.prepend(n); }
`;
s = s.slice(0, i) + NEW + s.slice(j);
fs.writeFileSync(file, s);
const CSS = "'.lxn{background:#fff;border:1px solid var(--line,#E7E5EE);border-left:4px solid #E2A33A;border-radius:14px;padding:12px 14px;margin:10px 0;font-size:var(--fs-meta,14px);color:var(--ink,#2B2253)}.lxn.is-s{border-left-color:#8A86A0}.lxn.is-d{border-left-color:#C9C6D6}"
  + ".lxn-h{display:flex;align-items:center;gap:6px;font-size:var(--fs-label,12px);font-weight:600;color:#5E5A75;letter-spacing:.01em}.lxn-h svg{flex:none}.lxn-t{margin-left:auto;font-weight:500;color:#77738C}"
  + ".lxn h3{margin:6px 0 8px;font:700 var(--fs-lead,16px)/1.3 Inter,system-ui,sans-serif;color:var(--ink,#2B2253)}"
  + ".lxn-f{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px 14px;margin:0 0 10px}.lxn-f div{min-width:0}.lxn-f dt{font-size:var(--fs-label,12px);color:#77738C;margin:0}.lxn-f dd{margin:1px 0 0;font-weight:600;overflow-wrap:anywhere}"
  + ".lxn-pf{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit;margin:0 0 10px}.lxn-pf small{display:block;font-size:var(--fs-label,12px);color:#77738C;font-weight:400}.lxn-pf>span:last-child{font-weight:600;color:#00737B}"
  + ".lxn-th{position:relative;flex:none;width:96px;height:60px;border-radius:8px;background:#F3F2F7;border:1px solid var(--line,#E7E5EE);display:flex;align-items:center;justify-content:center;color:#8A86A0;overflow:hidden}.lxn-th img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}"
  + ".lxn-r,.lxn-o{display:flex;gap:8px;align-items:flex-start;margin:6px 0;line-height:1.45}.lxn-r svg,.lxn-o svg{flex:none;margin-top:2px;color:#5E5A75}.lxn-o small{display:block;font-size:var(--fs-label,12px);color:#77738C}.lxn-o.done b{color:var(--ink,#2B2253)}"
  + ".lxn-b{margin-top:8px}.lxn-s{display:flex;align-items:center;gap:6px;margin-top:8px;font-weight:600;color:#5E5A75}"
  + ".lxn-y{margin-top:8px;padding:8px 10px;border-radius:10px;background:#F7F6FA}.lxn-yh{font-size:var(--fs-label,12px);color:#77738C}.lxn-yq{margin-top:2px;white-space:pre-wrap;overflow-wrap:anywhere}.lxn-yi{display:flex;align-items:center;justify-content:center;color:#8A86A0;background:#F3F2F7;width:120px;height:80px;margin-top:6px;border-radius:8px;overflow:hidden;border:1px solid var(--line,#E7E5EE)}.lxn-yi img{width:100%;height:100%;object-fit:cover}"
  + ".lxn-d{margin:0;border-bottom:1px solid #F0EFF5}.lxn-d>summary{list-style:none;cursor:pointer}.lxn-d>summary::-webkit-details-marker{display:none}.lxn-d>summary .lt-it{border-bottom:0}.lxn-d[open]>summary{border-bottom:0}"
  + "#lxNote{margin:12px 0}#lxNote>.lxn-d{background:#fff;border:1px solid var(--line,#E7E5EE);border-radius:14px;padding:0 14px;margin:8px 0}"
  + ".lxf h1{margin:6px 0 2px}.lxf label{display:block;font-size:var(--fs-small,13px);font-weight:700;margin:14px 0 4px}.lxf label span{font-weight:400;color:#77738C}.lxf textarea{width:100%;box-sizing:border-box;font:inherit;font-size:var(--fs-text,16px);border:1.5px solid var(--line,#E7E5EE);border-radius:12px;padding:10px 12px;resize:vertical;min-height:96px}"
  + ".lxf-c{text-align:right;font-size:var(--fs-label,12px);color:#77738C;margin-top:2px}.lxf-p{position:relative;display:flex!important;align-items:center;justify-content:center;gap:8px;height:150px;border:1.5px dashed #C9C6D6;border-radius:12px;color:#5E5A75;font-weight:600!important;cursor:pointer;overflow:hidden;margin-top:8px!important}"
  + ".lxf-p input{position:absolute;inset:0;opacity:0;cursor:pointer}.lxf-p img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#F3F2F7}.lxf-p.has span{position:relative;z-index:1;background:rgba(255,255,255,.92);padding:4px 10px;border-radius:99px}.lxf-p.has svg{display:none}"
  + ".lxf-e{min-height:18px;color:#B42318;font-size:var(--fs-small,13px);font-weight:600;margin:4px 0 6px}@media(max-width:620px){.lxn-f{grid-template-columns:1fr 1fr}.lxn-f .w{grid-column:1/-1}}'";
require('../tools/lib.js')(file, [
  [".lt-bn b{color:#8A3B22}@media(max-width:620px){.lt-it{flex-wrap:wrap}.lt-it > b{white-space:normal}}';",
   ".lt-bn b{color:#8A3B22}@media(max-width:620px){.lt-it{flex-wrap:wrap}.lt-it > b{white-space:normal}}'\n      + " + CSS + ";   /* 1670 */"]
]);
