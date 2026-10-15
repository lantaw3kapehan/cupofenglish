(function(){
  // 15 Oct · Time-ins and Messages, made quicker to read (Misty: "the TIME-IN SCREEN AND MESSAGES, all the TODAY screens").
  //  Time-ins · a teacher with no time-in yet shows her deadline ("by 16:30" = 30 min before her first class) and how long
  //             is left, instead of "— · no time-in · Not yet"; past the deadline with no time-in it turns coral;
  //             the top says "0 of 7 timed in · next due 16:30 Teacher Pam".
  //  Messages · the automatic "App health" reports get their own tab and leave All and the counts;
  //             the screen opens on "Needs you" when something is waiting; unread rows have a coral edge.
  const css = `
#v-team .ti2-bar{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;margin-top:10px;padding:10px 16px;border-radius:14px;background:#fff;border:1px solid #EEF0F4;font-size:14px;color:#4C4868}
#v-team .ti2-bar b{font-family:var(--brand);font-weight:400;font-size:20px;color:#2B2253}
#v-team .ti2-bar .pg{flex:1 1 160px;height:8px;border-radius:4px;background:#EEF1F4;overflow:hidden;min-width:120px}
#v-team .ti2-bar .pg i{display:block;height:100%;background:#00A3AD;border-radius:4px}
#v-team .ti2-bar .nx{color:#00737B}
#v-team .ti-in b.ti2-due{color:#2B2253;font-size:16px}
#v-team .ti-in span.ti2-left{color:#00808A}
#v-team .ti-in.ti2-over b,#v-team .ti-in.ti2-over span{color:#B4513B}
#v-team .ti-r.ti2-soon{background:linear-gradient(90deg,#FFF8EC,#fff 60%)}
#v-msgs .li{border-radius:14px;transition:background .15s}
#v-msgs .li:hover{background:#F7F8FB}
#v-msgs .li[style*="FFF6EE"]{box-shadow:inset 3px 0 0 #D4705A}
#v-msgs .ms2-sys{opacity:.8}`;
  const st = document.createElement('style'); st.id = 'tm2css'; st.textContent = css; document.head.appendChild(st);

  // ── Time-ins
  const dueOf = x => { const f = x && x.first ? new Date(x.first) : null; return f && !isNaN(f) ? new Date(f.getTime() - 30 * 6e4) : null; };
  const left = ms => { const m = Math.round(ms / 6e4); if(m < 60) return m + ' min'; const h = Math.floor(m / 60), r = m % 60; return h + ' h' + (r ? ' ' + r + ' min' : ''); };
  const hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  if(typeof tiRow === 'function'){
    const _row = tiRow;
    tiRow = function(x, mgmt){
      let h = _row.apply(this, arguments);
      try{
        if(mgmt || !x || x.timeIn || /^(Late|Missing|Not on app|No class)$/.test(x.status || '')) return h;
        const due = dueOf(x); if(!due) return h;
        const ms = due.getTime() - Date.now(), over = ms < 0;
        h = h.replace(/<div class="ti-in"><b class="num mute">—<\/b><span>[^<]*<\/span><\/div>/,
          `<div class="ti-in${over ? ' ti2-over' : ''}"><b class="num ti2-due">by ${hm(due)}</b><span class="${over ? '' : 'ti2-left'}">${over ? 'past the time · no time-in yet' : 'in ' + left(ms)}</span></div>`);
        if(!over && ms <= 15 * 6e4) h = h.replace('<div class="ti-r ', '<div class="ti-r ti2-soon ');
      }catch(e){}
      return h;
    };
  }
  const _rt = window.renderTeam;
  if(typeof _rt === 'function') window.renderTeam = function(){
    const r = _rt.apply(this, arguments);
    try{
      const v = $('v-team'), sum = v && v.querySelector('.ti-sum'); if(!sum) return r;
      const t = ((MO && MO.team) || D.team || []).filter(x => x.status !== 'No class'), inN = t.filter(x => x.timeIn).length;
      const nx = t.filter(x => !x.timeIn && dueOf(x) && dueOf(x).getTime() > Date.now()).sort((a, b) => dueOf(a) - dueOf(b))[0];
      if(t.length) sum.insertAdjacentHTML('afterend', `<div class="ti2-bar"><span><b>${inN}</b> of ${t.length} teachers timed in</span><span class="pg"><i style="width:${Math.round(inN / t.length * 100)}%"></i></span>${nx ? `<span class="nx">Next due ${hm(dueOf(nx))} · ${esc(tName(nx.name))}</span>` : ''}</div>`);
    }catch(e){}
    return r;
  };
  // the deadline text counts down while the screen is open
  setInterval(() => { try{ if(VIEW === 'team' && !document.hidden && D && D.mgr && !$('sheet').classList.contains('on')) renderTeam(); }catch(e){} }, 60000);

  // ── Messages
  const isSys = t => !!t && t.root && /^App health$/i.test(String(t.root.from || '')) ;
  if(typeof window.msgCats === 'function'){
    const _mc = window.msgCats;
    window.msgCats = function(t){ if(isSys(t)) return ['sys']; return _mc.apply(this, arguments); };
  }
  if(typeof window.msgTabs === 'function'){
    const _mt = window.msgTabs;
    window.msgTabs = function(TA){ const sys = ((window.__msgAll || (MSG && MSG.threads)) || []).filter(isSys).length, F = window.MSF || 'all';
      const args = [].slice.call(arguments); args[0] = (TA || []).filter(t => !isSys(t)); let h = _mt.apply(this, args);
      if(sys) h = h.replace(/<\/div>$/, '<button type="button" class="chip ' + (F === 'sys' ? 'teal' : '') + '" style="cursor:pointer;padding:7px 12px;' + (F === 'sys' ? 'font-weight:800' : '') + '" onclick="MSF=\'sys\';renderMsgs()">App health <b>' + sys + '</b></button></div>');
      return h; };
  }
  let first = true;
  const _rm = window.renderMsgs;
  window.renderMsgs = function(){
    if(!MSG) return _rm.apply(this, arguments);
    const unread = t => [t.root].concat(t.replies).filter(msgNewM).length;
    if(first){ first = false; try{ if(!window.MSF || window.MSF === 'all'){ const n = (MSG.threads || []).filter(t => !isSys(t) && msgCats(t, unread).indexOf('needs') > -1).length; if(n) window.MSF = 'needs'; } }catch(e){} }
    if((window.MSF || 'all') !== 'all') return _rm.apply(this, arguments);
    const all = MSG.threads; window.__msgAll = all; MSG.threads = (all || []).filter(t => !isSys(t));
    try{ return _rm.apply(this, arguments); } finally { MSG.threads = all; window.__msgAll = null; }
  };
  try{ if(VIEW === 'team') renderTeam(); if(VIEW === 'msgs') renderMsgs(); }catch(e){}
})();
