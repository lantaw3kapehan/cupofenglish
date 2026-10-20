/* 20 Oct · 390 · One "Changes" card on the student page, like the trial steps (Misty: "the same procedure for active students when
   they renew, change teacher, change time slots, etc."). Three tabs, each a short list of steps with one button each, ✓ when done:
   Renewal (384) · Teacher or time (change in the calendar → class notice → tell the teachers) · Pause or stop (parent's answer →
   stop the weekly classes → tell the teacher). Every button opens at once from what the app already holds; saves run in the background. */
(function(){
  const up = s => String(s || '').toUpperCase();
  const KEY = c => 'coe.rn4.' + up(c);
  const got = c => { try{ return JSON.parse(localStorage.getItem(KEY(c)) || '{}') || {}; }catch(e){ return {}; } };
  const mark = (c, k) => { try{ const o = got(c); o[k] = Date.now(); localStorage.setItem(KEY(c), JSON.stringify(o)); }catch(e){} };
  const recent = (c, k, days) => { const t = got(c)[k]; return !!(t && Date.now() - t < (days || 14) * 864e5); };
  const isReg = e => e && !e.cancelled && !/(^|-)\s*(TC|SC)\s*$/i.test(String(e.title || '').replace(/\s+X$/i, '')) && !/trial/i.test(e.title || '');
  let TAB = {};
  function who(){ const s = (STU && STU.s) || {}; const L = (STU && STU.cls) || []; const nx = (Array.isArray(L) ? L : []).filter(e => isReg(e) && new Date(e.start).getTime() > Date.now()).sort((a, b) => String(a.start).localeCompare(String(b.start)));
    return { code: up(STU.code), name: String((window.NAMEFIX || {})[up(STU.code)] || s.name || STU.code).replace(/-/g, ' '), teacher: String((nx[0] && nx[0].teacher) || (s.teachers || [])[0] || '').replace(/^teacher\s+/i, ''), next: nx[0] || null, nAhead: nx.length, left: s.left }; }
  const row = (n, done, next, t, s, b) => '<div class="tl4-r' + (done ? ' done' : next ? ' next' : '') + '"><div class="tl4-n">' + (done ? '✓' : n) + '</div><div class="tl4-t"><b>' + t + '</b><span>' + s + '</span></div><div class="tl4-a">' + b + '</div></div>';
  function list(R){ const nx = R.findIndex(x => !x.done); return '<div class="tl4"><div class="tl4-card">' + R.map((x, i) => row(i + 1, x.done, i === nx, x.t, x.s, x.b)).join('') + '</div></div>'; }
  function ctHtml(W){ const c = esc(W.code);
    return list([
      { done: recent(W.code, 'ct'), t: 'Change in the calendar', s: 'Stop the old weekly classes from a date and book the new ones · new teacher, or the same teacher with new days and times', b: '<button class="btn teal" onclick="chGo(\'ct\',\'' + c + '\')">Change teacher or time</button>' },
      { done: recent(W.code, 'ctn'), t: 'Class notice', s: 'The new schedule picture for the parent', b: '<button class="btn ghost" onclick="chGo(\'ctn\',\'' + c + '\')">Class notice</button>' },
      { done: recent(W.code, 'ctm'), t: 'Tell the teachers', s: 'A message to the old and the new teacher', b: '<button class="btn ghost" onclick="chGo(\'ctm\',\'' + c + '\')">Message</button>' }]); }
  function psHtml(W){ const c = esc(W.code), st = renSt(W.code);
    return list([
      { done: st.k === 'pause' || st.k === 'no', t: 'Parent’s answer', s: st.k === 'pause' || st.k === 'no' ? esc(st.label) : 'Paused until a date, or not renewing', b: '<button class="btn ghost" onclick="chGo(\'psa\',\'' + c + '\')">Note the answer</button>' },
      { done: !W.nAhead, t: 'Stop the weekly classes', s: W.nAhead ? W.nAhead + ' class' + (W.nAhead === 1 ? '' : 'es') + ' still booked · cancel from the next one on (no make-up, not counted)' : 'No classes booked ahead', b: W.nAhead ? '<button class="btn ghost" onclick="chGo(\'pss\',\'' + c + '\')">Stop classes</button>' : '' },
      { done: recent(W.code, 'psm'), t: 'Tell the teacher', s: 'A message to Teacher ' + esc(W.teacher || '…'), b: '<button class="btn ghost" onclick="chGo(\'psm\',\'' + c + '\')">Message</button>' }]); }
  window.chTab = function(k){ if(!STU) return; TAB[up(STU.code)] = k; paint(true); };
  window.chGo = async function(k, code){ code = up(code); if(!STU || up(STU.code) !== code) return; const W = who();
    try{ window._tlRet = null; }catch(e){} window._stRet = { code, name: W.name, at: Date.now() };
    if(!/^ps[as]$/.test(k)) mark(code, k);
    if(k === 'ct'){ await ctOpen(code); setTimeout(() => { try{ if(W.teacher && window.csNw) csNw(W.teacher); }catch(e){} }, 60); return; }
    if(k === 'ctn') return cnOpen(code);
    if(k === 'ctm' || k === 'psm'){ const T = (MSG && MSG.teachers) || [], hit = T.find(n => String(n).toLowerCase() === W.teacher.toLowerCase()) || W.teacher; msgNew(hit ? [hit] : []);
      setTimeout(() => { const el = $('mnT'), ti = $('mnTi');
        if(ti && !ti.value) ti.value = (k === 'ctm' ? 'Schedule change · ' : 'Classes stopped · ') + W.name;
        if(el) el.value = k === 'ctm' ? 'Hi! 😊\n\n' + W.name + '’s (' + code + ') classes have changed. Please check your Today screen for the new days and times.\n\nThank you! 🙏'
          : 'Hi, Teacher ' + hit + '! 😊\n\n' + W.name + '’s (' + code + ') classes are stopped for now. The booked classes are cancelled, so you will not see them on your Today screen.\n\nThank you for teaching ' + W.name + '! 🙏'; }, 50); return; }
    if(k === 'psa'){ renSheet(code, W.name); try{ RNS.back = () => openStudent(code); }catch(e){} return; }
    if(k === 'pss'){ const L = evList('stu'), i = L.indexOf(W.next); if(i < 0) return toast('Open the next class in the list below and use Cancel class');
      await classEdit(i, 'stu'); setTimeout(() => { try{ ceOpen('ceCx'); const s = $('eStop'); if(s && !s.checked){ s.checked = true; s.dispatchEvent(new Event('change')); } const r = $('eR'); if(r && !r.value) r.value = 'Paused / stopped · parent'; }catch(e){} }, 80); return; }
  };
  function paint(force){ try{ if(!D || !D.mgr || typeof STU === 'undefined' || !STU) return; const el = $('stuRn'); if(!el) return;
    const W = who(), st = renSt(W.code), k = TAB[W.code] || (st.k === 'pause' || st.k === 'no' ? 'ps' : 'rn');
    if(!force && el.dataset.ch === k + '|' + el.innerHTML.length) return;
    const rn = (window.rnStepsHtml ? rnStepsHtml(W.code) : '').replace(/^<details[^>]*>[\s\S]*?<\/summary>/, '').replace(/<\/details>$/, '');
    const open = el.querySelector('details.rn4') ? el.querySelector('details.rn4').open : true;
    const tb = (kk, t) => '<button type="button" class="' + (k === kk ? 'on' : '') + '" onclick="chTab(\'' + kk + '\')">' + t + '</button>';
    el.innerHTML = '<details class="rn4"' + (open ? ' open' : '') + '><summary><b>Changes · step by step</b><span class="small mute"> · renewal, teacher, time, pause</span></summary>' +
      '<div class="seg chs" style="margin:6px 0 10px;flex-wrap:wrap">' + tb('rn', 'Renewal') + tb('ct', 'Teacher or time') + tb('ps', 'Pause or stop') + '</div>' +
      (k === 'rn' ? rn : k === 'ct' ? ctHtml(W) : psHtml(W)) + '</details>';
    el.dataset.ch = k + '|' + el.innerHTML.length; }catch(e){} }
  ['stuRender', 'renderActive', 'renderMToday'].forEach(fn => { const o = window[fn]; if(typeof o !== 'function') return; window[fn] = function(){ const r = o.apply(this, arguments); setTimeout(() => paint(true), 5); return r; }; });
})();
