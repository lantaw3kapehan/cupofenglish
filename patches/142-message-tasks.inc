(function(){
  const PFX = '📌 Task · ';
  const isTask = r => !!r && r.role === 'mgmt' && r.kind !== 'memo' && /^📌\s*Task/.test(String(r.text || ''));
  const isDone = r => /^✅/.test(String(r && r.react || ''));
  const body = r => String(r.text || '').replace(/^📌\s*Task\s*[·:-]?\s*/, '');
  const sd = s => { const x = String(s || '').slice(0, 10), d = new Date(x + 'T12:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
  window.msgIsTask = isTask;

  // ── Management · New message: how should they answer? (reply · task · just read)
  const _mn = window.msgNew; window.msgNew = function(){ const r = _mn.apply(this, arguments);
    try{ const a = $('mnA'), lab = a && a.closest('label'); if(!lab || $('mnHow')) return r; lab.style.display = 'none';
      lab.insertAdjacentHTML('afterend', '<div id="mnHow" style="margin-top:12px"><div class="small mute" style="margin-bottom:6px">What should they do?</div>' +
        [['reply', 'Reply with one tap', '✓ Got it · 👍 On it · ⏰ Today · ✅ Done · 🙋 Question'], ['task', '📌 A task to do', 'Stays on their To do and pops up until they tap ✅ Done · you see who has not done it'], ['read', 'Just for reading', 'Leaves their To do once they open it']]
        .map(([k, t, s], i) => '<label class="check" style="margin-top:6px"><input type="radio" name="mnHow" value="' + k + '"' + (i === 0 ? ' checked' : '') + ' onchange="mnHow(this.value)"><div><b>' + t + '</b><div class="small mute">' + s + '</div></div></label>').join('') + '</div>');
      window._mnTask = false;
    }catch(e){ console.warn('task compose', e); } return r; };
  window.mnHow = v => { window._mnTask = v === 'task'; const a = $('mnA'); if(a) a.checked = v !== 'read'; const m = $('mnM'); if(m && m.checked && v === 'task'){ m.checked = false; if(window.memoToggle) memoToggle(); } };
  const _ms = window.msgSend; window.msgSend = function(){ try{ const T = $('mnT'); if(window._mnTask && T && !($('mnM') || {}).checked && T.value.trim() && !/^📌\s*Task/.test(T.value)) T.value = PFX + T.value.trim(); }catch(e){} return _ms.apply(this, arguments); };

  // ── Management · counts on a notice: for a task, ✓ = done, "seen" = opened or answered but not done yet
  const _ta = window.msgTally; window.msgTally = function(g){ if(!g || !g.length || !isTask(g[0].root)) return _ta(g);
    const a = g.filter(t => isDone(t.root)).length, q = g.filter(t => /^🙋/.test(t.root.react || '')).length, s = g.filter(t => !isDone(t.root) && (t.root.seen || t.root.ack)).length; return { a, q, s, n: g.length - a - s }; };
  const _go = window.msgGroupOpen; window.msgGroupOpen = function(gi){ const r = _go.apply(this, arguments);
    try{ const g = MSG_G[gi]; if(!g || !isTask(g[0].root)) return r; const b = $('sheetBody'), pend = g.filter(t => !isDone(t.root));
      const old = [...b.querySelectorAll('button')].find(x => /Remind the/.test(x.textContent)); if(old) old.remove();
      const h = b.querySelector('h1 + .mute.small'); if(h) h.textContent = '📌 Task · ' + (g.length - pend.length) + ' of ' + g.length + ' done';
      if(pend.length){ const at = b.querySelector('.msgs'); if(at) at.insertAdjacentHTML('afterend', '<button class="btn ghost block" style="margin-top:10px" onclick="msgRemindTask(' + gi + ')">🔔 Remind the ' + pend.length + ' who have not done it · ' + esc(pend.map(t => t.teacher).slice(0, 5).join(', ')) + (pend.length > 5 ? '…' : '') + '</button>'); }
    }catch(e){} return r; };
  window.msgRemindTask = function(gi){ const g = MSG_G[gi]; if(!g) return; const pend = g.filter(t => !isDone(t.root)).map(t => t.teacher); msgNew(pend);
    setTimeout(() => { const T = $('mnT'); if(T) T.value = 'Reminder 😊 Please do this and tap ✅ Done in the app:\n\n' + body(g[0].root); const t = document.querySelector('#mnHow input[value="task"]'); if(t){ t.checked = true; mnHow('task'); } }, 30); };
  // ── Management · Messages page: tasks still open, by person
  const _rm = window.renderMsgs; window.renderMsgs = function(){ const r = _rm.apply(this, arguments);
    try{ if(!MSG || !(MSG.threads || []).length) return r; const open = MSG.threads.filter(t => isTask(t.root) && !isDone(t.root)); if(!open.length) return r;
      const by = {}; open.forEach(t => (by[t.teacher] = by[t.teacher] || []).push(t));
      const lead = document.querySelector('#v-msgs .lead'); if(!lead) return r;
      lead.insertAdjacentHTML('afterend', '<div class="card" style="margin-top:12px;border-left:5px solid #E4846B"><b>📌 Tasks not done yet · ' + open.length + '</b><div class="small mute">Each stays on the teacher’s To do until they tap ✅ Done</div>' +
        Object.keys(by).sort().map(n => '<div class="li" style="cursor:pointer" onclick="msgOpen(\'' + by[n][0].root.id + '\')"><div class="grow" style="min-width:0"><b>' + esc(msgWho ? msgWho(n) : n) + '</b><div class="small mute ell">' + by[n].map(t => esc(body(t.root).slice(0, 70)) + ' · since ' + esc(sd(t.root.at)) + (t.root.react ? ' · ' + esc(t.root.react) : t.root.seen ? ' · seen' : ' · not seen yet')).join(' | ') + '</div></div><span class="mute">›</span></div>').join('') + '</div>');
    }catch(e){ console.warn('tasks card', e); } return r; };

  // ── Teacher · To do: a task stays until ✅ Done
  window.tMsgTodo = function(){ if(!TMSG) return []; const T = TMSG.threads || [];
    return T.filter(t => [t.root].concat(t.replies).some(r => r.role === 'mgmt' && !r.seen) || (t.root.role === 'mgmt' && t.root.need && !t.root.ack) || (isTask(t.root) && !isDone(t.root))).slice(0, 8).map(t => {
      const r = [t.root].concat(t.replies).filter(x => x.role === 'mgmt').pop() || t.root, memo = t.root.kind === 'memo', task = isTask(t.root);
      if(task) return '<div class="li" onclick="tMsgOpen(\'' + t.root.id + '\')"><span class="chip red">Task</span><div class="grow" style="min-width:0"><div class="ell"><b>From ' + esc(t.root.from) + '</b> · since ' + esc(sd(t.root.at)) + (t.root.react ? ' · you said ' + esc(t.root.react) : '') + '</div><div class="small mute ell">' + esc(body(t.root)) + '</div></div><span class="mute">›</span></div>';
      return '<div class="li" onclick="tMsgOpen(\'' + t.root.id + '\')"><span class="chip red">' + (memo ? 'Memorandum' : 'Message') + '</span><div class="grow" style="min-width:0"><div class="ell"><b>' + (memo ? esc(t.root.subject) : 'From ' + esc(r.from)) + '</b></div><div class="small mute ell">' + (memo ? esc(t.root.memoNo) + ' · please read and acknowledge' : esc(r.text)) + '</div></div><span class="mute">›</span></div>'; }); };
  // ── Teacher · the task itself: one big ✅ Done
  const _to = window.tMsgOpen; window.tMsgOpen = function(id){ const r = _to.apply(this, arguments);
    try{ const t = ((TMSG && TMSG.threads) || []).find(x => x.root.id === id); if(!t || !isTask(t.root)) return r; const b = $('sheetBody'), x = t.root;
      b.querySelectorAll('.reacts').forEach(e => { const p = e.previousElementSibling; if(p && /Tap one to reply/.test(p.textContent)) p.remove(); e.remove(); });
      const box = isDone(x) ? '<div class="fbdone" style="margin-top:12px">✅ Done' + (x.ack && x.ack !== 'now' ? ' · ' + esc(msgAt(x.ack)) : '') + ' · management sees it</div>'
        : '<div class="card" style="margin-top:12px;border:2px solid #E4846B;background:#FFF6F2"><b>📌 A task from ' + esc(x.from) + '</b><div class="small mute">It stays on your To do until you tap Done' + (x.react ? ' · you said ' + esc(x.react) : '') + '</div>' +
          '<button class="btn teal block" style="margin-top:10px" onclick="tMsgAck(\'' + esc(id) + '\',3,this)">✅ Done · I did it</button><div class="row" style="gap:8px;margin-top:8px"><button class="btn ghost sm grow" onclick="tMsgAck(\'' + esc(id) + '\',1,this)">👍 On it</button><button class="btn ghost sm grow" onclick="tMsgAck(\'' + esc(id) + '\',4,this)">🙋 I have a question</button></div></div>';
      const m = b.querySelector('.msgs'); if(m) m.insertAdjacentHTML('afterend', box);
    }catch(e){ console.warn('task open', e); } return r; };
})();
