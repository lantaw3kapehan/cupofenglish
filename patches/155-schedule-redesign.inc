(function(){
  // 15 Oct · Management Schedule, redesigned for speed (Misty: "how about the SCHEDULE screen now").
  //  · a week strip: 7 days with their class counts, tap a day to jump (‹ › still move one day, Today comes back);
  //  · one summary line instead of three big tiles;
  //  · By time: classes grouped by start time, classes at the same time side by side as cards (about a third of the
  //    scrolling); finished classes folded into one line you can open;
  //  · By teacher: each teacher's classes as cards too.
  //  Every action stays: tap a class (move / cancel / details), 🔔 Remind, Proof for the parent, check-in chips, search.
  const css = `
#v-schedule .s2-top{display:flex;align-items:center;gap:8px;margin-top:12px}
#v-schedule .s2-wk{flex:1;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
#v-schedule .s2-d{display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 4px;border-radius:14px;background:#fff;border:1px solid #EEF0F4;cursor:pointer;color:#2B2253;transition:background .15s,border-color .15s;min-width:0}
#v-schedule .s2-d:hover{border-color:#BFE6E3}
#v-schedule .s2-d span{font-size:11.5px;color:#8A87A0;letter-spacing:.04em}
#v-schedule .s2-d b{font-family:var(--brand);font-weight:400;font-size:20px;line-height:1.1}
#v-schedule .s2-d em{font-style:normal;font-size:11.5px;color:#6F6B85;white-space:nowrap}
#v-schedule .s2-d em s{text-decoration:none}
#v-schedule .s2-d.td span{color:#00808A;font-weight:700}
#v-schedule .s2-d.on{background:#2B2253;border-color:#2B2253;color:#fff}
#v-schedule .s2-d.on span,#v-schedule .s2-d.on em{color:#CFCBE6}
#v-schedule .s2-ar{width:38px;height:38px;flex:none;border-radius:12px;border:1px solid #E3E5EC;background:#fff;color:#2B2253;font-size:20px;cursor:pointer}
#v-schedule .s2-sum{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;margin-top:12px;padding:10px 16px;border-radius:14px;background:#fff;border:1px solid #EEF0F4;font-size:14px;color:#4C4868}
#v-schedule .s2-sum b{font-family:var(--brand);font-weight:400;font-size:20px;color:#2B2253;margin-right:4px}
#v-schedule .s2-sum .minus{color:#B4513B}
#v-schedule .s2-sum .nx{margin-left:auto;color:#00737B}
#v-schedule .s2-slot{display:flex;align-items:baseline;gap:10px;margin:18px 2px 8px}
#v-schedule .s2-slot b{font-family:var(--brand);font-weight:400;font-size:20px;color:#2B2253}
#v-schedule .s2-slot span{font-size:13px;color:#8A87A0}
#v-schedule .s2-slot.now b{color:#00808A}
#v-schedule .s2-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px}
#v-schedule .s2-g .cls{background:#fff;border:1px solid #EEF0F4;border-radius:16px;padding:12px 14px 12px 12px;gap:10px;margin:0;box-shadow:0 1px 2px rgba(43,34,83,.04);border-bottom:1px solid #EEF0F4}
#v-schedule .s2-g .cls:hover{box-shadow:0 8px 20px rgba(43,34,83,.08)}
#v-schedule .s2-g .cls .t{display:none}
#v-schedule .s2-g .cls .bar{width:4px;border-radius:4px}
#v-schedule .s2-g .cls .nm{font-size:15.5px}
#v-schedule .s2-g .cls .small.mute.ell{white-space:normal;overflow:visible}
#v-schedule .s2-g .cls .s2-tm{font-size:12px;color:#8A87A0;margin-left:auto;white-space:nowrap}
#v-schedule .s2-g .cls.now{box-shadow:inset 0 0 0 1.5px rgba(0,163,173,.45);background:linear-gradient(90deg,#EAF7F7,#fff 70%)}
#v-schedule details.s2-fin{margin-top:18px;border-radius:16px;background:#fff;border:1px solid #EEF0F4;padding:0 14px}
#v-schedule details.s2-fin summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;min-height:52px;font-size:15px;color:#4C4868}
#v-schedule details.s2-fin summary::-webkit-details-marker{display:none}
#v-schedule details.s2-fin summary b{font-family:var(--brand);font-weight:400;font-size:18px;color:#2B2253}
#v-schedule details.s2-fin summary em{margin-left:auto;font-style:normal;font-size:20px;color:#B9B7C6;transition:transform .15s}
#v-schedule details.s2-fin[open] summary em{transform:rotate(90deg)}
#v-schedule details.s2-fin[open]{padding-bottom:14px}
#v-schedule details.s2-fin .s2-g{opacity:.7}
#v-schedule .s2-th{display:flex;align-items:baseline;gap:10px;margin:20px 2px 8px}
#v-schedule .s2-th b{font-family:var(--brand);font-weight:400;font-size:19px;color:#2B2253}
#v-schedule .s2-th span{font-size:13px;color:#8A87A0}
@media(max-width:720px){
  #v-schedule .s2-wk{gap:4px}
  #v-schedule .s2-d{padding:6px 2px;border-radius:12px}
  #v-schedule .s2-d b{font-size:17px}
  #v-schedule .s2-d em{font-size:11px}
  #v-schedule .s2-d em s{display:none}
  #v-schedule .s2-d span{font-size:10px;letter-spacing:0}
  #v-schedule .s2-ar{width:30px;height:30px;font-size:16px;border-radius:10px}
  #v-schedule .s2-g{grid-template-columns:minmax(0,1fr)}
  #v-schedule .s2-sum .nx{margin-left:0}
}`;
  const st = document.createElement('style'); st.id = 's2css'; st.textContent = css; document.head.appendChild(st);

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
    const card = (e, who) => { const on = now >= new Date(e.start) && now < new Date(e.end), i = SC.events.indexOf(e), mon = e.cancelled ? '' : monChips(e, now);
      return `<div class="cls ${e.cancelled ? 'x' : ''} ${e.type === 'Trial' ? 'trial' : e.type === 'Sub' ? 'sub' : ''} ${on ? 'now' : ''}" style="cursor:pointer;--c:${bookCol(e.book)}" onclick="classEdit(${i})"><div class="t"><b>${tm(e.start)}</b><span>${tm(e.end)}</span></div><div class="bar"></div>
<div class="grow" style="min-width:0"><div class="row" style="gap:6px;align-items:center"><span class="nm ell">${esc(e.student || e.title)}</span>${e.type ? `<span class="chip ${e.type === 'Trial' ? 'coral' : ''}">${e.type}</span>` : ''}${e.cancelled ? '<span class="chip red">Cancelled</span>' : ''}${on ? '<span class="live-b"><i></i>Live</span>' : ''}<span class="s2-tm">${tm(e.start)}–${tm(e.end)}</span></div>${e.cancelled && e.why ? `<div class="cxw">Why: ${cxWhy(e.why)}</div>` : ''}${e.cancelled ? `<button class="cxbtn" onclick="event.stopPropagation();cxProof(${i})">Proof for the parent</button>` : ''}
<div class="small mute ell">${[who ? `<b style="color:var(--ink2)">${esc(e.teacher)}</b>` : '', esc([e.code, e.book, e.meet].filter(Boolean).join(' · '))].filter(Boolean).join(' · ')}</div>${mon}${scRemChips(e)}${(s => s && !scSent(e, s))(scStage(e)) ? `<button class="cxbtn" onclick="event.stopPropagation();scRemind(${i})">🔔 Remind · copy message</button>` : ''}</div></div>`; };
    const slots = (list, who) => { const by = {}, order = []; list.forEach(e => { const k = tm(e.start); if(!by[k]){ by[k] = []; order.push(k); } by[k].push(e); });
      return order.map(k => { const g = by[k], on = g.some(e => now >= new Date(e.start) && now < new Date(e.end)), n = g.filter(e => !e.cancelled).length;
        return `<div class="s2-slot ${on ? 'now' : ''}"><b>${k}</b><span>${n} class${n === 1 ? '' : 'es'}${g.length - n ? ' · ' + (g.length - n) + ' cancelled' : ''}${on ? ' · live now' : ''}</span></div><div class="s2-g">${g.map(e => card(e, who)).join('')}</div>`; }).join(''); };
    if(!L.length) h += `<div class="empty">No classes on the calendar.</div>`;
    else if(SC_BY === 'teacher'){ const by = {}; L.forEach(e => (by[e.teacher] = by[e.teacher] || []).push(e));
      h += Object.keys(by).sort().map(t => `<div class="s2-th"><b>${esc(tName(t))}</b><span>${by[t].filter(e => !e.cancelled).length} classes${by[t].some(e => e.cancelled) ? ' · ' + by[t].filter(e => e.cancelled).length + ' cancelled' : ''}</span></div><div class="s2-g">${svNowFirst(by[t]).map(e => card(e, false)).join('')}</div>`).join(''); }
    else { const sorted = L.slice().sort((a, b) => new Date(a.start) - new Date(b.start)), up = sorted.filter(e => new Date(e.end) >= now), fin = sorted.filter(e => new Date(e.end) < now);
      h += up.length ? slots(up, true) : (fin.length ? '<div class="empty">All classes for this day are finished.</div>' : '');
      if(fin.length) h += `<details class="s2-fin"${up.length ? '' : ' open'}><summary><b>Finished</b> ${fin.filter(e => !e.cancelled).length} classes${fin.some(e => e.cancelled) ? ' · ' + fin.filter(e => e.cancelled).length + ' cancelled' : ''}<em>›</em></summary>${slots(fin, true)}</details>`; }
    $('v-schedule').innerHTML = h;
  };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'schedule') renderSchedule(); }catch(e){}
})();
