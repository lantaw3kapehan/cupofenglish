(function(){
  // Follow-through: management's comments that are ignored (no answer) or "seen but nothing changed".
  //  Level 1 · Reminder  — the orange To do box (already there).
  //  Level 2 · Warning   — something is 2+ days overdue, or a point from the last QA visit was still "Not yet".
  //  Level 3 · Final     — 5+ days overdue, 3+ overdue, or the same problem was not fixed twice in 30 days.
  //  At level 2–3 the teacher writes what she changed / will do by when; it goes to management as a message.
  //  Nothing is deducted automatically: management decides (memorandum, case) from its own list.
  const DAY = 864e5, now = () => Date.now();
  const tms = s => { s = String(s || ''); const m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/); if(!m) return 0; return Date.parse(m[1] + 'T' + (m[2] || '12:00') + ':00+08:00'); };
  const sd = t => t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
  const age = t => t ? Math.floor((now() - t) / DAY) : 0;
  const isTask = r => !!r && r.role === 'mgmt' && r.kind !== 'memo' && /^📌\s*Task/.test(String(r.text || ''));
  const pcOf = r => { const m = String((r && r.text) || '').match(/progress check\s*\((ST-\d{4}-\d{3})\)/i); return m ? m[1].toUpperCase() : ''; };
  const short = s => { s = String(s || '').replace(/^📌\s*Task\s*[·:-]?\s*/, '').replace(/\s+/g, ' ').trim(); return s.length > 80 ? s.slice(0, 78) + '…' : s; };
  // → { level, items: [{ kind, text, days, weight }] }
  window.ftCheck = function(visits, threads, opt){ opt = opt || {}; const items = [], acked = opt.acked || {}, done = opt.pcDone || {};
    (threads || []).forEach(t => { const r = t.root; if(!r || r.role !== 'mgmt') return; const a = age(tms(r.at));
      if(isTask(r) && !/^✅/.test(r.react || '') && a >= 2) items.push({ kind: 'Task', text: 'Task from ' + r.from + ' not done since ' + sd(tms(r.at)) + ' · ' + short(r.text), days: a, overdue: 1 });
      else if(r.kind === 'memo' && !r.ack && a >= 1) items.push({ kind: 'Memorandum', text: 'Memorandum ' + (r.memoNo || '') + ' not acknowledged since ' + sd(tms(r.at)), days: a, overdue: 1 });
      else if(!isTask(r) && r.kind !== 'memo' && pcOf(r) && !done[pcOf(r)] && !(t.replies || []).some(x => x.role !== 'mgmt' && /sent|done/i.test(x.text)) && a >= 3) items.push({ kind: 'Progress check', text: 'Progress check (' + pcOf(r) + ') asked ' + sd(tms(r.at)) + ', not sent yet', days: a, overdue: 1 });
      else if(!isTask(r) && r.kind !== 'memo' && !pcOf(r) && r.need && !r.ack && a >= 2) items.push({ kind: 'Message', text: 'Message from ' + r.from + ' not answered since ' + sd(tms(r.at)) + ' · ' + short(r.text), days: a, overdue: 1 }); });
    const V = (visits || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    V.forEach(v => { const t = tms(v.date + ' ' + (v.time || '')), a = age(t); if(!v.ack && !acked[v.id] && a >= 2) items.push({ kind: 'QA visit', text: 'Class visit ' + sd(t) + (v.student ? ' (' + v.student + ')' : '') + ' not read · tap Got it', days: a, overdue: 1 }); });
    let repeat = 0; const since = now() - 30 * DAY;
    V.forEach(v => { const t = tms(v.date); if(t < since) return; const m = String(v.note || '').match(/Follow-up on (\S+)\s*\(([\s\S]*?)\):\s*(Not yet|Partly)\b/);
      if(m){ const w = m[3] === 'Not yet' ? 1 : 0.5; repeat += w; items.push({ kind: 'Not fixed', text: '“' + short(m[2]) + '” · raised ' + sd(tms(m[1])) + ', still ' + m[3].toLowerCase() + ' on ' + sd(t), days: age(tms(m[1])), weight: w }); } });
    const area = {}; V.filter(v => tms(v.date) >= since).slice(0, 4).forEach(v => String(v.checks || '').split(' · ').forEach(c => { const m = c.match(/^(.*?):\s*(Needs work|Not yet)$/); if(m) (area[m[1]] = area[m[1]] || []).push(v.date); }));
    Object.keys(area).forEach(k => { if(area[k].length >= 2){ repeat += 1; items.push({ kind: 'Same issue', text: k + ' marked “Needs work” on ' + area[k].map(d => sd(tms(d))).join(' and '), days: age(tms(area[k][area[k].length - 1])), weight: 1 }); } });
    const od = items.filter(x => x.overdue), maxd = od.reduce((m, x) => Math.max(m, x.days), 0);
    const level = (repeat >= 2 || maxd >= 5 || od.length >= 3) ? 3 : (od.length || repeat >= 1) ? 2 : 0;
    return { level, items, repeat }; };

  // ── Teacher · Today: the warning card
  let MYV = null, MYV_AT = 0;
  async function myVisits(){ if(Date.now() - MYV_AT < 10 * 6e4 && MYV) return MYV; MYV_AT = Date.now(); try{ const r = await api('tMyVisits', TOKEN); if(r && r.ok){ MYV = r.visits || []; if(VIEW === 'today') renderToday(); } }catch(e){} return MYV; }
  const planKey = () => 'coe.ftplan.' + String((D.me || {}).name || '').toLowerCase();
  window.ftSend = async function(){ const v = (($('ftP') || {}).value || '').trim(); if(v.length < 30) return toast('Write a little more: what you changed, or what you will do and by when');
    const R = window._FT || { items: [] }, txt = '⚠ My follow-up plan\n' + R.items.map(x => '· ' + x.text).join('\n') + '\n\n' + v;
    const b = $('ftB'); if(b){ b.disabled = true; b.textContent = 'Sending…'; }
    try{ const r = await api('tMsgSend', TOKEN, txt, '', false); if(!r || !r.ok) throw r; try{ localStorage.setItem(planKey(), JSON.stringify({ sig: R.sig, at: Date.now() })); }catch(e){} toast('✓ Sent to management'); renderToday(); }
    catch(e){ if(b){ b.disabled = false; b.textContent = 'Send my plan to management'; } toast((e && (e.msg || e.message)) || 'Not sent · try again'); } };
  function paint(){ if(!D || D.mgr) return; const root = $('v-today'); if(!root) return; if(!MYV) myVisits();
    let acked = {}; try{ acked = JSON.parse(store('get', 'coe.vack') || '{}'); }catch(e){}
    const R = ftCheck(MYV || [], (TMSG && TMSG.threads) || [], { acked, pcDone: window.PCDONE || {} }); R.sig = R.items.map(x => x.kind + x.text).join('|'); window._FT = R;
    const old = $('ftBox'); if(old) old.remove(); if(R.level < 2) return;
    let plan = null; try{ plan = JSON.parse(localStorage.getItem(planKey()) || 'null'); }catch(e){} const sent = plan && plan.sig === R.sig && Date.now() - plan.at < 3 * DAY;
    if(!document.getElementById('ftCss')) document.head.insertAdjacentHTML('beforeend', '<style id="ftCss">#ftBox{border:2px solid #C0392B;background:#FDECEA;border-radius:18px;padding:14px 16px;margin:14px 0 6px}#ftBox h3{margin:0;font-size:17px;color:#8E1F12}#ftBox ul{margin:8px 0 0 18px;padding:0}#ftBox li{margin:3px 0}</style>');
    const head = R.level >= 3 ? '⛔ Final warning · management has been told' : '⚠ Warning · management’s comments need action';
    const sub = R.level >= 3 ? 'These were raised more than once or have waited too long. Management may send a memorandum.' : 'These have waited 2 days or more, or were not fixed after the last class visit.';
    const box = '<div id="ftBox"><h3>' + head + '</h3><div class="small" style="color:#8E1F12;margin-top:2px">' + sub + '</div><ul>' + R.items.map(x => '<li class="small"><b>' + esc(x.kind) + '</b> · ' + esc(x.text) + (x.overdue && x.days >= 2 ? ' · ' + x.days + ' days' : '') + '</li>').join('') + '</ul>' +
      (sent ? '<div class="small" style="margin-top:10px;color:#1E7A55"><b>✓ Your plan was sent ' + esc(sd(plan.at)) + '.</b> This stays until the items above are done or fixed at the next visit.</div>'
        : '<label style="margin-top:10px">What did you change, or what will you do and by when?</label><textarea id="ftP" class="in-t" rows="2" placeholder="e.g. I moved my camera back and checked it with a test call. From today I will…"></textarea><button class="btn teal block" id="ftB" style="margin-top:8px" onclick="ftSend()">Send my plan to management</button>') + '</div>';
    const lead = root.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', box); else root.insertAdjacentHTML('afterbegin', box); }
  const _rt = window.renderToday; window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ paint(); }catch(e){ console.warn('follow-through', e); } return r; };
  setTimeout(() => { try{ if(D && !D.mgr && TOKEN) myVisits(); }catch(e){} }, 4000);

  // ── Management · Messages: who is not acting on feedback
  let FTM = null, FTM_BUSY = 0;
  async function ftLoad(){ if(FTM_BUSY || !MSG) return; let c = null; try{ c = JSON.parse(localStorage.getItem('coe.ftm') || 'null'); }catch(e){} if(c && Date.now() - c.at < 30 * 6e4){ FTM = c.v; return; }
    FTM_BUSY = 1; const out = {}; try{ for(const t of (MSG.teachers || [])){ try{ const r = await api('mgmtTeacherVisits', TOKEN, t); if(r && r.ok) out[t] = r.visits || []; }catch(e){} await new Promise(z => setTimeout(z, 250)); }
      FTM = out; try{ localStorage.setItem('coe.ftm', JSON.stringify({ at: Date.now(), v: out })); }catch(e){} if(VIEW === 'msgs') renderMsgs(); } finally{ FTM_BUSY = 0; } }
  window.ftMemo = function(name){ const R = (window._FTM || {})[name]; if(!R) return; msgNew([name]);
    setTimeout(() => { const m = $('mnM'); if(m){ m.checked = true; if(window.memoToggle) memoToggle(); }
      setTimeout(() => { const s = $('mnS'); if(s && !s.value) s.value = 'Notice on Non-Compliance with Management Feedback'; const T = $('mnT'); if(T) T.value = 'This memorandum is issued because the following feedback from management has not been acted on:\n\n' + R.items.map((x, i) => (i + 1) + '. ' + x.text).join('\n') + '\n\nPlease act on each item and reply in the app with what you have changed. Further non-compliance will be formally documented.\n\nFor strict compliance.'; }, 700); }, 50); };
  const _rm = window.renderMsgs; window.renderMsgs = function(){ const r = _rm.apply(this, arguments);
    try{ if(!MSG) return r; if(!FTM){ setTimeout(ftLoad, 800); return r; } const lead = document.querySelector('#v-msgs .lead'); if(!lead) return r;
      const by = {}; (MSG.threads || []).forEach(t => (by[t.teacher] = by[t.teacher] || []).push(t)); window._FTM = {};
      const L = Object.keys(FTM).map(n => { const R = ftCheck(FTM[n], by[n] || [], {}); window._FTM[n] = R; return { n, R }; }).filter(x => x.R.level >= 2).sort((a, b) => b.R.level - a.R.level || b.R.items.length - a.R.items.length);
      if(!L.length) return r;
      const plans = n => (by[n] || []).filter(t => t.root.role === 'teacher' && /^⚠ My follow-up plan/.test(t.root.text || '')).sort((a, b) => String(b.root.at).localeCompare(String(a.root.at)))[0];
      lead.insertAdjacentHTML('afterend', '<div class="card" style="margin-top:12px;border-left:5px solid #C0392B"><b>⚠ Not acting on feedback · ' + L.length + '</b><div class="small mute">From class visits, tasks, memos and progress checks · the teacher sees the same warning and must send a plan · nothing is deducted automatically</div>' +
        L.map(({ n, R }) => { const p = plans(n); return '<div class="li"><div class="grow" style="min-width:0"><b>' + esc(msgWho ? msgWho(n) : n) + '</b> <span class="chip ' + (R.level >= 3 ? 'red' : 'coral') + '">' + (R.level >= 3 ? 'Final warning' : 'Warning') + '</span>' + (p ? ' <span class="chip teal">Plan sent ' + esc(msgAt(p.root.at)) + '</span>' : '') +
          '<div class="small mute">' + R.items.slice(0, 4).map(x => esc(x.text)).join('<br>') + (R.items.length > 4 ? '<br>+' + (R.items.length - 4) + ' more' : '') + '</div></div><div style="display:flex;flex-direction:column;gap:6px">' + (p ? '<button class="btn ghost sm" onclick="msgOpen(\'' + p.root.id + '\')">Read plan</button>' : '') + '<button class="btn ghost sm" onclick="ftMemo(\'' + esc(n).replace(/'/g, "\\'") + '\')">Memorandum</button></div></div>'; }).join('') + '</div>');
    }catch(e){ console.warn('follow-through mgmt', e); } return r; };
})();
