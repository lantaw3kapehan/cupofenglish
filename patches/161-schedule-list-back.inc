(function(){
  // 15 Oct · Schedule: back to the previous class list (one row per class, time on the left, Finished below), as Misty
  // preferred, keeping the week strip and the one-line summary on top (from 155). The strip/summary styles stay in 155.
  const DW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function weekStrip(){
    const base = new Date(); base.setHours(12, 0, 0, 0);
    const start = SC_OFF - 3, out = [];
    for(let o = start; o < start + 7; o++){
      const d = new Date(base); d.setDate(d.getDate() + o); const k = ymdLocal(d), c = SCC[k] || null;
      const n = o === SC_OFF && SC ? SC.events.filter(e => !e.cancelled).length : c && c.events ? c.events.filter(e => !e.cancelled).length : null;
      out.push(`<a class="s2-d ${o === SC_OFF ? 'on' : ''} ${o === 0 ? 'td' : ''}" onclick="${o === SC_OFF ? '' : 'loadSchedule(' + (o - SC_OFF) + ')'}"><span>${o === 0 ? 'Today' : DW[d.getDay()]}</span><b>${d.getDate()}</b><em>${n == null ? '·' : n + '<s> class' + (n === 1 ? '' : 'es') + '</s>'}</em></a>`);
    }
    return `<div class="s2-top"><button class="s2-ar" title="Day before" onclick="loadSchedule(-1)">‹</button><div class="s2-wk">${out.join('')}</div><button class="s2-ar" title="Next day" onclick="loadSchedule(1)">›</button></div>`;
  }
  window.renderSchedule = function(){
    if(!SC) return; try{ SC_SIG = scSig(); }catch(x){}
    const E = SC.events, live = E.filter(e => !e.cancelled), T = [...new Set(E.map(e => e.teacher))].sort();
    const L = SC_T ? E.filter(e => e.teacher === SC_T) : E, now = Date.now();
    const nx = live.filter(e => new Date(e.start) > now).sort((a, b) => new Date(a.start) - new Date(b.start))[0];
    const onNow = live.filter(e => now >= new Date(e.start) && now < new Date(e.end)).length;
    const dl = new Date(SC.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });
    let h = `<div class="lead row"><div class="grow"><h1>Schedule</h1><div class="mute small">${esc(dl)} · all teachers · Google Calendar</div></div>${SC_OFF ? `<button class="btn sm ghost" onclick="SC_OFF=0;loadSchedule(0)">Today</button>` : ''}<button class="btn sm teal" onclick="classForm()">+ Class</button></div>
<div class="sch-s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="scQ" class="search" placeholder="Search a teacher or a student…" autocomplete="off" oninput="scSug()" onfocus="scSug()" onkeydown="scKey(event)" onblur="setTimeout(()=>{const l=$('scL');if(l)l.remove();},180)"></div>
${weekStrip()}<b id="scDay" class="hide">${esc(dayLabel(SC.date))}</b>
<div class="s2-sum"><span><b>${live.length}</b>classes</span>${E.length - live.length ? `<span><b class="minus">${E.length - live.length}</b>cancelled</span>` : ''}<span><b>${new Set(live.map(e => e.teacher)).size}</b>teachers</span>${onNow ? `<span><b style="color:#00A3AD">${onNow}</b>live now</span>` : ''}${!SC_OFF && nx ? `<span class="nx">Next ${tm(nx.start)} · ${esc(nx.student || nx.title || '')} · ${esc(tName(nx.teacher || ''))}</span>` : ''}</div>
<div class="seg"><button class="${SC_BY === 'time' ? 'on' : ''}" onclick="SC_BY='time';renderSchedule()">By time</button><button class="${SC_BY === 'teacher' ? 'on' : ''}" onclick="SC_BY='teacher';renderSchedule()">By teacher</button></div>
${scDueBox()}${bookKey()}<div class="fl"><span class="lbl">Teacher</span><button class="${!SC_T ? 'on' : ''}" onclick="SC_T='';renderSchedule()">All</button>${T.map(t => `<button class="${SC_T === t ? 'on' : ''}" onclick="SC_T='${esc(t)}';renderSchedule()">${esc(t)}</button>`).join('')}</div>`;
    const row = (e, who) => { const on = now >= new Date(e.start) && now < new Date(e.end);
const mon = e.cancelled ? '' : monChips(e, now);
return `<div class="cls ${e.cancelled?'x':''} ${e.type==='Trial'?'trial':e.type==='Sub'?'sub':''} ${on?'now':''}" style="cursor:pointer;--c:${bookCol(e.book)}" onclick="classEdit(${SC.events.indexOf(e)})"><div class="t"><b>${tm(e.start)}</b><span>${tm(e.end)}</span></div><div class="bar"></div>
<div class="grow"><div class="row" style="gap:6px"><span class="nm ell">${esc(e.student||e.title)}</span>${e.type?`<span class="chip ${e.type==='Trial'?'coral':''}">${e.type}</span>`:''}${e.cancelled?'<span class="chip red">Cancelled</span>':''}${on?'<span class="live-b"><i></i>Live</span>':''}</div>${e.cancelled && e.why ? `<div class="cxw">Why: ${cxWhy(e.why)}</div>` : ''}${e.cancelled ? `<button class="cxbtn" onclick="event.stopPropagation();cxProof(${SC.events.indexOf(e)})">Proof for the parent</button>` : ''}
<div class="small mute ell">${[who?`<b style="color:var(--ink2)">${esc(e.teacher)}</b>`:'', esc([e.code,e.book,e.meet].filter(Boolean).join(' · '))].filter(Boolean).join(' · ')}</div>${mon}${scRemChips(e)}${(st => st && !scSent(e, st))(scStage(e)) ? `<button class="cxbtn" onclick="event.stopPropagation();scRemind(${SC.events.indexOf(e)})">🔔 Remind · copy message</button>` : ''}</div></div>`; };
    if(!L.length) h += `<div class="empty">No classes on the calendar.</div>`;
    else if(SC_BY==='teacher'){ const by = {}; L.forEach(e => (by[e.teacher]=by[e.teacher]||[]).push(e));
      h += Object.keys(by).sort().map(t => `<h2>${esc(t)} <span class="c">${by[t].filter(e=>!e.cancelled).length} classes${by[t].some(e=>e.cancelled)?' · '+by[t].filter(e=>e.cancelled).length+' cancelled':''}</span></h2>` + svNowFirst(by[t]).map(e=>row(e,false)).join('')).join(''); }
    else { const n = Date.now(), up = L.filter(e => new Date(e.end) >= n), fin = L.filter(e => new Date(e.end) < n);
      h += `<div style="margin-top:8px">${up.map(e=>row(e,true)).join('') || (fin.length ? '<div class="empty">All classes for this day are finished.</div>' : '')}</div>`
      + (fin.length ? `<h2>Finished <span class="c">${fin.filter(e=>!e.cancelled).length} classes</span></h2><div style="opacity:.6">${fin.map(e=>row(e,true)).join('')}</div>` : ''); }
    $('v-schedule').innerHTML = h;
  };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'schedule') renderSchedule(); }catch(e){}
})();
