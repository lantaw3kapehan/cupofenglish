/* 20 Oct · 384 · Renewal step by step on the student page (Misty: "when they renew, the same steps and process as the trial, so it's easier to follow").
   Status box › "Renewal · step by step": 1 Parent's answer → 2 Renewed · paid → 3 Renewal picture → 4 Class schedule (book the rest,
   days and times copied from the current schedule) → 5 Class notice → 6 Agreement. Each ✓ once done; the next one is teal.
   The same list shows after "Save renewal" and on "already renewed". Sheets opened from a step have "‹ Back to X's page". */
(function(){
  const up = s => String(s || '').toUpperCase();
  const KEY = c => 'coe.rn4.' + up(c);
  const got = c => { try{ return JSON.parse(localStorage.getItem(KEY(c)) || '{}') || {}; }catch(e){ return {}; } };
  const mark = (c, k) => { try{ const o = got(c); o[k] = Date.now(); localStorage.setItem(KEY(c), JSON.stringify(o)); }catch(e){} };
  const paidAt = c => { const t = String((REN || {})[up(c)] || ''); const m = /^Renewed\b.*?([A-Z][a-z]{2} \d{1,2}, \d{4})/.exec(t); const d = m ? new Date(m[1] + ' 00:00').getTime() : 0; return isNaN(d) ? 0 : d; };
  const fdt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Manila' });
  const isReg = e => !e.cancelled && !/(^|-)\s*(TC|SC)\s*$/i.test(String(e.title || '').replace(/\s+X$/i, '')) && !/trial/i.test(e.title || '');
  function info(code){ const c = up(code), stu = (typeof STU !== 'undefined' && STU && up(STU.code) === c) ? STU : null;
    const s = (stu && stu.s) || ((typeof MS !== 'undefined' && MS) || []).find(x => up(x.code) === c) || ((typeof SL !== 'undefined' && SL && SL.students) || []).find(x => up(x.code) === c) || {};
    const L = (stu && stu.cls) || ((typeof CLSM !== 'undefined' && CLSM) || {})[c] || [];
    const now = Date.now(), ahead = (Array.isArray(L) ? L : []).filter(e => isReg(e) && new Date(e.start).getTime() >= now).sort((a, b) => String(a.start).localeCompare(String(b.start)));
    const booked = ahead.reduce((a, e) => a + ((new Date(e.end) - new Date(e.start)) / 6e4 <= 30 ? 0.5 : 1), 0);
    let left = s.left != null && s.left !== '' ? +s.left : null; if(left != null && isNaN(left)) left = null;
    return { s, L: Array.isArray(L) ? L : [], ahead, booked, left, name: String(s.name || (stu && stu.r && stu.r.name) || code).replace(/-/g, ' '), teacher: String((s.teachers || [])[0] || (ahead[0] && ahead[0].teacher) || '') }; }

  window.rnStepsHtml = function(code, opts){ opts = opts || {};
    const c = up(code), I = info(c), st = renSt(c), pa = paidAt(c), M = got(c), since = pa ? pa - 864e5 : Date.now() - 14 * 864e5, ok = k => M[k] && M[k] > since;
    const nm = esc(I.name.replace(/'/g, '')), tc = esc(I.teacher.replace(/'/g, '')), cd = esc(c);
    const ag = (typeof agrOf === 'function') ? agrOf(c) : null, agOn = !!(ag && ag.how !== 'Sent');
    const S = [];
    S.push({ k: 'ask', done: st.k === 'yes' || st.k === 'done', t: 'Parent’s answer', s: st.k && st.k !== 'done' ? esc(st.label) : st.k === 'done' ? 'Renewing' : 'Ask the parent and note what they said',
      b: '<button class="btn ghost" onclick="rnGo(\'ask\',\'' + cd + '\')">' + (st.k ? 'Update' : 'Note the answer') + '</button>' });
    S.push({ k: 'paid', done: st.k === 'done', t: 'Renewed · paid', s: st.k === 'done' ? esc(st.label) : 'The new package in SALES, ACTIVE and DATABASE in one save',
      b: st.k === 'done' ? '<button class="btn ghost" onclick="rnGo(\'paid\',\'' + cd + '\',\'' + nm + '\',\'' + tc + '\')">View</button>' : '<button class="btn teal" onclick="rnGo(\'paid\',\'' + cd + '\',\'' + nm + '\',\'' + tc + '\')">Renewed · paid</button>' });
    S.push({ k: 'pic', done: ok('pic'), t: 'Renewal picture', s: 'Renewal confirmed · 续费成功 for the parent', b: '<button class="btn ghost" onclick="rnGo(\'pic\',\'' + cd + '\')">Make the picture</button>' });
    const all = I.left != null && I.booked >= I.left - 0.01, last = I.ahead.length ? I.ahead[I.ahead.length - 1].start : '';
    S.push({ k: 'sched', done: (all && pa) || ok('sched'), t: 'Class schedule', s: I.left != null ? I.left + ' lesson' + (I.left === 1 ? '' : 's') + ' left · ' + I.booked + ' booked' + (last ? ' to ' + fdt(last) : '') + (all ? ' · all booked' : '') : (I.ahead.length ? I.ahead.length + ' classes booked' + (last ? ' to ' + fdt(last) : '') : 'No classes booked ahead'),
      b: '<button class="btn ghost" onclick="rnGo(\'sched\',\'' + cd + '\')">' + (all ? 'Add classes' : 'Book the rest') + '</button>' });
    S.push({ k: 'notice', done: ok('notice'), t: 'Class notice', s: 'The schedule picture for the parent', b: '<button class="btn ghost" onclick="rnGo(\'notice\',\'' + cd + '\')">Class notice</button>' });
    S.push({ k: 'agree', done: agOn || ok('agree'), t: 'Agreement', s: agOn ? 'On file' : 'Service agreement · send it if not on file', b: '<button class="btn ghost" onclick="rnGo(\'agree\',\'' + cd + '\')">' + (agOn ? 'View' : 'Agreement') + '</button>' });
    let nx = S.findIndex(x => !x.done);
    const rows = S.map((x, i) => '<div class="tl4-r' + (x.done ? ' done' : i === nx ? ' next' : '') + '"><div class="tl4-n">' + (x.done ? '✓' : i + 1) + '</div><div class="tl4-t"><b>' + x.t + '</b><span>' + x.s + '</span></div><div class="tl4-a">' + x.b + '</div></div>').join('');
    const n = S.filter(x => x.done).length, open = opts.open || st.k === 'sent' || st.k === 'yes' || st.k === 'done' || (I.left != null && I.left <= 6);
    return '<details class="rn4"' + (open ? ' open' : '') + '><summary><b>Renewal · step by step</b><span class="small mute"> · ' + n + ' of ' + S.length + ' done</span></summary><div class="tl4"><div class="tl4-card">' + rows + '</div></div></details>'; };

  window.rnGo = async function(k, code, name, teacher){ code = up(code); const I = info(code); name = name || I.name; teacher = teacher || I.teacher;
    try{ window._tlRet = null; }catch(e){} window._stRet = { code, name, at: Date.now() };
    if(k !== 'ask' && k !== 'paid') mark(code, k);
    if(k === 'ask'){ if(typeof STU !== 'undefined' && STU && up(STU.code) === code && window.stOpen) return stOpen(); renSheet(code, name); try{ RNS.back = () => openStudent(code); }catch(e){} return; }
    if(k === 'paid') return renPaidSheet(code, name, teacher);
    if(k === 'pic') return cxBalance(null, code);
    if(k === 'notice') return cnOpen(code);
    if(k === 'agree') return agrOpen({ code });
    if(k === 'sched') return rnBook(code);
  };

  /* Book the rest: Add class with the weekly package ticked, the days and times of the current schedule, from the day after the last booked class */
  window.rnBook = async function(code){ code = up(code); const I = info(code);
    await classForm(code); if(!$('cS')) return;
    try{ classKind(''); }catch(e){}
    const src = I.ahead.length ? I.ahead.slice(0, 12) : I.L.filter(isReg).slice(-12), W = {}, lens = {}, books = {};
    const dw = e => +new Date(new Date(e.start).toLocaleString('en-US', { timeZone: 'Asia/Manila' })).getDay(), hm = e => new Date(e.start).toLocaleTimeString('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' });
    src.forEach(e => { const k = dw(e) + '|' + hm(e); W[k] = (W[k] || 0) + 1; const m = Math.round((new Date(e.end) - new Date(e.start)) / 6e4); lens[m] = (lens[m] || 0) + 1; if(e.book) books[e.book] = (books[e.book] || 0) + 1; });
    let keys = Object.keys(W).filter(k => W[k] > 1); if(!keys.length) keys = Object.keys(W).slice(0, 1);
    const top = o => Object.keys(o).sort((a, b) => o[b] - o[a])[0];
    try{ const t = $('cT'), tc = (I.ahead[0] && I.ahead[0].teacher) || I.teacher; if(t && tc && [...t.options].some(o => o.value === tc)) t.value = tc; }catch(e){}
    try{ const b = top(books); if(b && $('cB') && !$('cB').value) $('cB').value = b; }catch(e){}
    try{ const m = top(lens), sel = $('cM'); if(m && sel && [...sel.options].some(o => o.value === String(m))) sel.value = String(m); }catch(e){}
    const st = I.ahead.length ? new Date(new Date(I.ahead[I.ahead.length - 1].start).getTime() + 864e5) : new Date(Date.now() + 864e5);
    try{ $('cD').value = ymdLocal(new Date(st.toLocaleString('en-US', { timeZone: 'Asia/Manila' }))); }catch(e){}
    const P = keys.map(k => { const [d, t] = k.split('|'); return { d: +d, t }; }).sort((a, b) => ((a.d + 6) % 7) - ((b.d + 6) % 7) || a.t.localeCompare(b.t));
    try{ const tt = P.length ? top(P.reduce((o, p) => (o[p.t] = (o[p.t] || 0) + 1, o), {})) : ''; const h = $('cH'); if(h && tt){ if(![...h.options].some(o => o.value === tt)) h.insertAdjacentHTML('beforeend', '<option value="' + tt + '">' + tt + '</option>'); h.value = tt; } }catch(e){}
    const r = $('cR'); if(r && !r.checked){ r.checked = true; classRep(); }
    document.querySelectorAll('#cDays button.on').forEach(b => b.classList.remove('on'));
    [...new Set(P.map(p => p.d))].forEach(d => { const b = document.querySelector('#cDays button[data-d="' + d + '"]'); if(b) b.classList.add('on'); });
    try{ classPrev(); }catch(e){}
    try{ const byD = {}; P.forEach(p => { (byD[p.d] = byD[p.d] || []).push(p.t); });
      Object.keys(byD).forEach(d => { const T = byD[d]; for(let i = 1; i < T.length; i++) classSlotAdd(+d);
        const R = [...document.querySelectorAll('#cSlots .sl[data-d="' + d + '"]')];
        R.forEach((row, i) => { const s = row.querySelector('select'); if(!s || !T[i]) return; if(![...s.options].some(o => o.value === T[i])) s.insertAdjacentHTML('beforeend', '<option value="' + T[i] + '">' + T[i] + '</option>'); s.value = T[i]; row.dataset.own = '1'; }); });
      classPrev(); }catch(e){}
    try{ const R = classRest(); if(R && R.rest > 0) classFill(R.rest); }catch(e){}
    const h1 = $('sheetBody').querySelector('h1'); if(h1) h1.insertAdjacentHTML('afterend', '<div class="mini" style="margin-top:8px"><b>' + esc(I.name) + ' · book the rest of the package</b><div class="small">' +
      (P.length ? 'The days and times are copied from the current schedule (' + esc(P.map(p => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][p.d] + ' ' + p.t).join(', ')) + '), starting the day after the last booked class.' : 'No schedule to copy · tap the days and times.') + ' Change anything before adding.</div></div>');
  };

  /* the card on the student page, under Status */
  function paint(){ try{ if(!D || !D.mgr || typeof STU === 'undefined' || !STU) return; const box = $('stuStat'); if(!box) return;
    const chip = box.querySelector('h2 .chip'), lb = chip ? chip.textContent.trim() : ''; let el = $('stuRn');
    if(/^(Trial|No package)$/.test(lb)){ if(el) el.remove(); return; }
    const was = el && el.querySelector('details') ? el.querySelector('details').open : null;
    if(!el){ box.insertAdjacentHTML('afterend', '<section class="sec noprint" id="stuRn"></section>'); el = $('stuRn'); }
    el.innerHTML = rnStepsHtml(STU.code); if(was != null){ const d = el.querySelector('details'); if(d) d.open = was; } }catch(e){} }
  window.rnPaint = paint;
  ['stuRender', 'renderActive', 'renderMToday'].forEach(fn => { const o = window[fn]; if(typeof o !== 'function') return; window[fn] = function(){ const r = o.apply(this, arguments); setTimeout(paint, 0); return r; }; });
  const css = document.createElement('style'); css.textContent = '.rn4{margin-top:4px}.rn4>summary{cursor:pointer;list-style:none;padding:10px 2px;font-size:15px}.rn4>summary::-webkit-details-marker{display:none}.rn4>summary::before{content:"› ";display:inline-block;transition:transform .15s;color:#00737B}.rn4[open]>summary::before{transform:rotate(90deg)}.rn4 .tl4{margin-top:4px}';
  document.head.appendChild(css);

  /* ‹ Back to X's page on the sheets opened from a step */
  const baseOpen = window.openSheet;
  window.openSheet = function(html){ const r = baseOpen.apply(this, arguments);
    try{ const R = window._stRet; if(R && Date.now() - R.at < 30 * 6e4 && !/class="paper/.test(String(html || '')) && !$('rnBack'))
      $('sheetBody').insertAdjacentHTML('afterbegin', '<button type="button" id="rnBack" class="btn ghost sm" style="margin:0 0 10px" onclick="window._stRet=null;openStudent(\'' + esc(R.code) + '\')">‹ Back to ' + esc(R.name || 'the student') + '’s page</button>'); }catch(e){}
    return r; };
})();
