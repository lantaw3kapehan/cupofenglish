/* 16 Oct · Misty: Jennie's parent says she should be A2 now, but her curriculum is A1.
   Level-up check: management asks the teacher from the student page (one tap, the message is written for you);
   the teacher fills the usual progress check (9 skills, book, progress, next focus) plus a decision:
   Ready / Almost / Not yet, and why. The answer comes back to the student page at once (database: docs mgmt:lvreq,
   triggers writes_levelup / writes_levelup_err). Nothing new to type twice: the progress check is still the parent's report. */
(function(){
  const LVS = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const rubric = t => t <= 10 ? 'Pre-A1' : t <= 15 ? 'A1' : t <= 20 ? 'A2' : t <= 25 ? 'B1' : t <= 30 ? 'B2' : t <= 35 ? 'C1' : 'C2';
  const fd = s => { const x = new Date(String(s || '').slice(0, 10) + 'T12:00:00'); return isNaN(x) ? String(s || '') : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
  const tn = s => String(s || '').replace(/^teacher\s+/i, '').trim();
  const DEC = { ready: ['✓ Ready', '#1E7A55', '#EAF7F1'], almost: ['Almost', '#A86A00', '#FFF4DE'], notyet: ['Not yet', '#5C6B73', '#F2F4F5'] };
  document.head.insertAdjacentHTML('beforeend', '<style>' +
    '.luc{margin-top:14px;border:1.5px solid #CFE6E5;background:#F5FBFB;border-radius:16px;padding:12px 14px}.luc h3{margin:0;font-size:15px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
    '.luc .lur{border-radius:12px;padding:8px 12px;margin-top:8px;font-size:14px}.luc .btn{margin-top:8px}' +
    '.lud{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.lud button{flex:1;min-width:120px;border:2px solid #DCE3E8;background:#fff;border-radius:12px;padding:10px 8px;font:inherit;font-weight:800;cursor:pointer;color:#33424B}' +
    '.lud button.on{border-color:#00737B;background:#00737B;color:#fff}.lud button small{display:block;font-weight:400;font-size:12px;opacity:.85}' +
    '.lut{border:2px solid #7FC4C1;background:#F2FAFA;border-radius:14px;padding:12px 14px;margin-top:12px}' +
    '.luo{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}.luo button{border:1.5px solid #DCE3E8;background:#fff;border-radius:99px;padding:6px 12px;font:inherit;cursor:pointer}.luo button.on{border-color:#00737B;background:#00737B;color:#fff;font-weight:800}' +
    '</style>');

  /* ───────── management: the student page ───────── */
  let LVR = null, LVAT = 0, LVQ = null;
  const luLoad = async force => { if(!force && LVR && Date.now() - LVAT < 60000) return LVR; if(LVQ) return LVQ;
    LVQ = fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['mgmt:lvreq'] }) }).then(x => x.json())
      .then(r => { const d = r && r.ok && r.docs && r.docs['mgmt:lvreq']; if(d && d.data && typeof d.data === 'object'){ LVR = Object.assign(LVR || {}, d.data); LVAT = Date.now(); } return LVR || {}; })
      .catch(() => LVR || {}).finally(() => { LVQ = null; }); return LVQ; };
  const curLv = () => { try{ const c = window._CJ; if(c && c.M && c.M[c.nowK]) return c.M[c.nowK][0]; }catch(e){} return ''; };
  const teacherOf = () => { const s = (STU && STU.s) || {}, t = [].concat(s.teachers || s.teacher || []).map(tn).filter(Boolean)[0] || '';
    const T = (window.MSG && MSG.teachers) || []; return T.find(n => String(n).toLowerCase() === t.toLowerCase()) || t; };
  const nameOf = () => { const s = (STU && STU.s) || {}; return String(s.name && s.name !== STU.code ? s.name : (window._CJ && _CJ.who && _CJ.who.student) || STU.code).split(/\s+/)[0]; };
  function luCard(){ if(!(D && D.mgr && STU)) return; const code = STU.code, b = $('sheetBody'); if(!b || !$('stuSch')) return;
    let box = $('luBox'); if(!box){ const at = b.querySelector('section.sec.cj') || $('stuPkg') || $('stuSch'); if(!at) return; at.insertAdjacentHTML('afterend', '<section class="sec noprint" id="luBox"></section>'); box = $('luBox'); }
    const q = LVR && LVR[code], res = q && q.res, now = curLv(), nx = LVS[Math.min(LVS.length - 1, Math.max(0, LVS.indexOf(now)) + 1)];
    let h = '';
    if(!q) h = '<div class="row" style="gap:10px;align-items:center"><div class="grow small"><b>Ready for the next level?</b> <span class="mute">' + (now ? esc(now) + ' now · ' : '') + 'ask the teacher to test it in class</span></div><button class="btn sm teal" onclick="luAsk()">Level-up check</button></div>';
    else { const to = q.to || nx, who = 'Teacher ' + tn(q.teacher || '');
      h = '<div class="luc"><h3>Level-up check · ' + esc(q.from || now || '') + ' → ' + esc(to) + '<span class="small mute" style="font-weight:400">asked ' + esc(fd(q.at)) + ' · ' + esc(who) + '</span></h3>' + (q.why ? '<div class="small mute" style="margin-top:2px">' + esc(q.why) + '</div>' : '');
      if(res && res.refused) h += '<div class="lur" style="background:#FDECEA;color:#8E1F12"><b>Not saved by Google</b> · ' + esc(res.refused) + '<div class="small">Ask ' + esc(who) + ' to open it again and send it.</div></div>';
      else if(res){ const c = DEC[res.d] || DEC.notyet;
        h += '<div class="lur" style="background:' + c[2] + ';color:' + c[1] + '"><b>' + esc(res.d === 'ready' ? '✓ Ready for ' + to : res.d === 'almost' ? 'Almost ready for ' + to : 'Not yet · stay on ' + (q.from || now || 'this level')) + '</b> · ' + esc(who) + ' · ' + esc(fd(res.at)) + (res.total ? ' · ' + res.total + '/36 · ' + esc(res.cefr || rubric(res.total)) : '') + (res.book ? ' · ' + esc(res.book) : '') +
          (res.why ? '<div style="color:#33424B;margin-top:4px">' + esc(res.why) + '</div>' : '') + '</div>' +
          '<div class="row" style="gap:8px;flex-wrap:wrap">' + (window.prPic ? '<button class="btn sm teal" onclick="prPic(\'' + esc(code) + '\', this)">Progress report picture</button>' : '') + '<button class="btn sm" onclick="luAsk()">Ask again</button></div>' +
          (res.d === 'ready' ? '<div class="small mute" style="margin-top:6px">Next: tell the parent, then change the book / level in Edit student.</div>' : ''); }
      else h += '<div class="lur" style="background:#FFF4DE;color:#8A5A00"><b>Waiting for ' + esc(who) + '</b> · she fills the progress check with a Ready / Almost / Not yet decision</div><button class="btn sm" onclick="luAsk()">Ask again</button>';
      h += '</div>'; }
    if(box.dataset.h !== h){ box.dataset.h = h; box.innerHTML = h; } }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments);
    try{ if(D && D.mgr && STU){ luCard(); const code = STU.code; luLoad().then(() => { if(STU && STU.code === code) luCard(); }); } }catch(e){ console.warn('lv', e); } return r; };

  let LA = null;
  const luText = () => { const n = LA.name, he = LA.she, why = LA.why === 'parent' ? 'Her parent asks if ' + he + ' is ready for ' + LA.to + '.' : LA.why === 'teacher' ? 'You mentioned ' + he + ' may be ready for ' + LA.to + '. Let\'s check it properly.' : 'We would like to see if ' + he + ' is ready for ' + LA.to + '.';
    return 'Hi, Teacher ' + LA.t + '! 😊\n\nCould you please do ' + n + '\'s progress check (' + LA.code + ') as a level-up test this week?\n\n' + n + ' is on ' + LA.from + ' now. ' + (LA.who === 'he' ? why.replace(/\bHer\b/, 'His') : why) +
      '\n\nPlease test ' + (LA.who === 'he' ? 'him' : 'her') + ' at ' + LA.to + ' level in class (' + LA.to + ' questions and a short ' + LA.to + ' reading), then send the progress check form with your decision: Ready, Almost or Not yet.' + (LA.note.trim() ? '\n\n' + LA.note.trim() : '') + '\n\nThank you! 🙏'; };
  window.luAsk = function(){ if(!STU) return; const now = curLv() || 'A1', i = Math.max(0, LVS.indexOf(now));
    LA = { code: STU.code, name: nameOf(), t: teacherOf(), from: now, to: LVS[Math.min(LVS.length - 1, i + 1)], why: 'parent', who: 'she', she: 'she', note: '' }; luPaint(); };
  window.luSet = function(k, v){ LA[k] = v; if(k === 'who') LA.she = v; luPaint(); };
  function luPaint(){ const o = (k, list) => '<div class="luo">' + list.map(([v, l]) => '<button type="button" class="' + (LA[k] === v ? 'on' : '') + '" onclick="luSet(\'' + k + '\',\'' + v + '\')">' + esc(l) + '</button>').join('') + '</div>';
    openSheet('<h1>Level-up check</h1><div class="mute small">' + esc(LA.name) + ' · ' + esc(LA.code) + ' · Teacher ' + esc(LA.t || '?') + ' tests it in class and sends the progress check with a decision · you see the answer here</div>' +
      '<label>Ready for</label>' + o('to', LVS.slice(Math.max(1, LVS.indexOf(LA.from) + 1)).map(l => [l, l])) +
      '<label>Why we ask</label>' + o('why', [['parent', 'Parent asks'], ['teacher', 'Teacher thinks so'], ['us', 'Our own review']]) +
      '<label>Student</label>' + o('who', [['she', 'she / her'], ['he', 'he / him']]) +
      '<label>Note for the teacher (optional)</label><textarea id="luN" class="in-t" rows="2" placeholder="e.g. The parent says she reads A2 storybooks at home." oninput="LUA_N(this.value)">' + esc(LA.note) + '</textarea>' +
      '<label>Message</label><div id="luM" class="small" style="white-space:pre-wrap;background:#F6F7F9;border-radius:12px;padding:10px 12px">' + esc(luText()) + '</div>' +
      '<button class="btn teal block" style="margin-top:12px" onclick="luSend()"' + (LA.t ? '' : ' disabled') + '>Send to Teacher ' + esc(LA.t || '?') + '</button>'); }
  window.LUA_N = v => { LA.note = v; const m = $('luM'); if(m) m.textContent = luText(); };
  window.luSend = async function(){ if(!LA || !LA.t) return; const L = Object.assign({}, LA), text = luText();
    LVR = LVR || {}; const was = LVR[L.code]; LVR[L.code] = { code: L.code, name: L.name, teacher: L.t, from: L.from, to: L.to, why: text.split('\n\n')[2].replace(/^.*? now\.\s*/, ''), at: ymdLocal(new Date()) + ' ' + new Date().toTimeString().slice(0, 5), pending: 1 };
    closeSheet(); toast('Sending to Teacher ' + L.t + '…');
    try{ const r = await api('mgmtMsgSend', TOKEN, [L.t], text, true, null); if(!r || !r.ok) throw r; toast('✓ Level-up check sent to Teacher ' + L.t); if(typeof loadMsgs === 'function') loadMsgs(true); openStudent(L.code); setTimeout(() => luLoad(true).then(luCard), 4000); }
    catch(e){ if(was) LVR[L.code] = was; else delete LVR[L.code]; toast(((e && (e.msg || e.message)) || 'Not sent') + ' · try again'); LA = L; luPaint(); } };

  /* ───────── teacher: the progress check form ───────── */
  let SENT = {}; try{ SENT = JSON.parse(store('get', 'coe.lvsent') || '{}') || {}; }catch(e){}
  let DECS = {}; try{ DECS = JSON.parse(store('get', 'coe.lvdec') || '{}') || {}; }catch(e){}
  const keep = () => { try{ store('set', 'coe.lvsent', JSON.stringify(SENT)); store('set', 'coe.lvdec', JSON.stringify(DECS)); }catch(e){} };
  window.luOf = function(code){ try{ if(!code || (D && D.mgr)) return null; let best = null;
    ((window.TMSG && TMSG.threads) || []).forEach(t => { const x = String((t.root && t.root.text) || ''); if(t.root.role !== 'mgmt' || !/level-up test/i.test(x)) return; const m = x.match(/progress check\s*\((ST-\d{4}-\d{3})\)/i); if(!m || m[1].toUpperCase() !== code) return;
      if(!best || String(t.root.at) > best.at) best = { at: String(t.root.at || ''), to: (x.match(/ready for (Pre-A1|A1|A2|B1|B2|C1|C2)/i) || [])[1] || '', from: (x.match(/is on (Pre-A1|A1|A2|B1|B2|C1|C2) now/i) || [])[1] || '', why: (x.match(/now\.\s*([^\n]+)/i) || [])[1] || '', name: (x.match(/do\s+(.+?)'s progress check/i) || [])[1] || code }; });
    if(best) best.k = code + '|' + best.at; return best; }catch(e){ return null; } };
  const fresh = () => { try{ if(!window.PCDONE) return; let ch = 0; Object.keys(PCDONE).forEach(c => { const q = luOf(c); if(q && !SENT[q.k]){ delete PCDONE[c]; ch = 1; } }); if(ch) store('set', 'coe.pcdone', JSON.stringify(PCDONE)); }catch(e){} };
  window.luSkipDone = function(code, done){ const q = luOf(code); if(!q || SENT[q.k]) return false; return String((done && done.date) || '').slice(0, 10) < q.at.slice(0, 10); };
  window.luBody = function(code, picks){ const q = luOf(code), d = q && DECS[q.k]; if(!q || !d) return undefined; const tot = (picks || []).reduce((a, x) => a + (+x || 0), 0); return { to: q.to, d: d.d, why: String(d.why || '').slice(0, 800), cefr: rubric(tot) }; };
  let CUR = '';
  const _pf = window.pcForm; if(_pf) window.pcForm = function(code){ CUR = code; fresh(); return _pf.apply(this, arguments); };
  window.luPick = function(v){ const q = luOf(CUR); if(!q) return; DECS[q.k] = Object.assign(DECS[q.k] || {}, { d: v }); keep(); paintLv(); };
  window.luWhy = function(v){ const q = luOf(CUR); if(!q) return; DECS[q.k] = Object.assign(DECS[q.k] || {}, { why: v }); keep(); };
  function paintLv(){ const q = luOf(CUR), b = $('sheetBody'); if(!q || !b || !$('pcGo')) return; const d = DECS[q.k] || {}, n = q.name, from = q.from || 'this level', to = q.to || 'the next level';
    const h1 = b.querySelector('h1'); if(h1 && !/Level-up/.test(h1.textContent)) h1.textContent = 'Level-up test · progress check';
    const html = '<b style="color:#00737B">Level-up test · is ' + esc(n) + ' ready for ' + esc(to) + '?</b>' + (q.why ? '<div class="small" style="margin-top:2px">' + esc(q.why) + '</div>' : '') +
      '<div class="small mute" style="margin-top:6px">In class, use ' + esc(to) + ' material: questions, a short reading and listening at ' + esc(to) + '. Rate what ' + esc(n) + ' does <b>on their own</b>. The 9 skills below are the test, then choose:</div>' +
      '<div class="lud">' + [['ready', '✓ Ready for ' + to, 'can move up now'], ['almost', 'Almost', 'a few more weeks on ' + from], ['notyet', 'Not yet', 'stay on ' + from]].map(([v, l, s]) => '<button type="button" class="' + (d.d === v ? 'on' : '') + '" onclick="luPick(\'' + v + '\')">' + esc(l) + '<small>' + esc(s) + '</small></button>').join('') + '</div>' +
      '<label style="margin-top:10px">Why · 2–3 simple sentences (management may share it with the parent)</label><textarea id="luW" class="in-t" rows="3" oninput="luWhy(this.value)" placeholder="e.g. She answered the A2 questions in full sentences and read the A2 story alone. Her writing still needs past tense practice.">' + esc(d.why || '') + '</textarea>';
    let el = $('luT'); if(!el){ const at = b.querySelector('.pc-sec') || $('pcB'); if(!at) return; at.insertAdjacentHTML('beforebegin', '<div class="lut" id="luT"></div>'); el = $('luT'); }
    el.innerHTML = html; }
  const _pp = window.pcPaint; if(_pp) window.pcPaint = function(){ const r = _pp.apply(this, arguments); try{ paintLv(); }catch(e){ console.warn('lv paint', e); } return r; };
  const _ps = window.pcSend; if(_ps) window.pcSend = function(){ const q = luOf(CUR);
    if(q){ const d = DECS[q.k] || {}, er = $('pcErr'), stop = m => { if(er) er.textContent = m; const t = $('luT'); if(t) t.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
      if(!d.d) return stop('Choose the level-up decision: Ready, Almost or Not yet');
      if(String(d.why || '').trim().length < 40) return stop('Write why (2–3 sentences) under the level-up decision');
      SENT[q.k] = 1; keep(); }
    return _ps.apply(this, arguments); };
  const _to = window.tMsgOpen; if(_to) window.tMsgOpen = function(id){ fresh(); const r = _to.apply(this, arguments);
    try{ const t = ((window.TMSG && TMSG.threads) || []).find(x => x.root.id === id); if(t && /level-up test/i.test(String(t.root.text || ''))) document.querySelectorAll('#sheetBody button').forEach(bt => { if(/^Fill in .+'s progress check$/.test(bt.textContent)) bt.textContent = bt.textContent.replace(/progress check$/, 'level-up test'); }); }catch(e){} return r; };
  const _td = window.ncTodo; if(_td) window.ncTodo = function(){ fresh(); let L = _td.apply(this, arguments);
    try{ if(Array.isArray(L)) L = L.map(x => { const m = typeof x === 'string' && x.match(/pcForm\('(ST-\d{4}-\d{3})'\)/); if(!m || !luOf(m[1])) return x; return x.replace('<span class="chip red">Progress check</span>', '<span class="chip red">Level-up test</span>').replace('9 skills, progress and next focus', 'test the next level · Ready, Almost or Not yet'); }); }catch(e){} return L; };
})();
