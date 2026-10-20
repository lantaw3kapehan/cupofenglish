/* 20 Oct · 423 · Messages: how many are not opened yet (Misty).
   · The Messages menu item shows a number bubble = conversations with something new for you (teal; coral when 5+).
   · On the screen: "3 not opened yet" beside the title, an "Unread" pill first in the tabs (shows only those), and
     every new row has a teal "new" dot. Tabs stay on one line (scroll sideways on small screens).
   · Group notices: "✓ 8 seen · 2 got it · 4 not seen" spaced as separate labels. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#dMsg{display:inline-flex!important;align-items:center;justify-content:center;min-width:22px;height:20px;padding:0 7px;border-radius:10px;background:#00A3AD!important;color:#fff!important;font-size:11.5px;font-weight:700;margin-left:auto}
#dMsg.hide{display:none!important}#dMsg.many{background:#D4705A!important}
#v-msgs .tb22{flex-wrap:nowrap!important;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}
#v-msgs .tb22 button{flex:none;padding:6px 12px!important;font-size:13px!important}
#v-msgs .tb22 button.un23{border-color:#BFE6E3!important;color:#00737B!important}
#v-msgs .tb22 button.un23.teal{background:#00A3AD!important;border-color:#00A3AD!important;color:#fff!important}
#v-msgs .tb22 button.un23 b{background:#E3F6F6;color:#00737B!important}
#v-msgs .nb23{display:inline-flex;align-items:center;gap:6px;margin-left:10px;font-family:var(--f);font-size:13px;font-weight:600;color:#00737B;background:#E3F6F6;border-radius:999px;padding:4px 12px;vertical-align:middle}
#v-msgs .nb23:before{content:'';width:8px;height:8px;border-radius:4px;background:#00A3AD}
#v-msgs .ib22 .chip.nw23{background:#00A3AD!important;color:#fff!important;border:0!important;font-size:11px!important;font-weight:700!important;padding:2px 8px!important;margin-left:6px}
#v-msgs .ib22 .li>div:last-child>.chip+.chip,#v-msgs .ib22 .li>div:last-child>span+span{margin-left:10px}
#v-msgs .ib22.only23 .li:not(.new),#v-msgs .ib22.only23 .dh22{display:none}`;
  document.head.appendChild(css);
  const unreadT = () => ((MSG && MSG.threads) || []).filter(t => [t.root].concat(t.replies || []).some(x => typeof msgNewM === 'function' && msgNewM(x))).length;
  const b0 = window.msgBadge; window.msgBadge = function(){ const r = b0 ? b0.apply(this, arguments) : null;
    try{ const n = unreadT(), d = $('dMsg'); if(d){ d.textContent = n ? String(n) : ''; d.classList.toggle('hide', !n); d.classList.toggle('many', n >= 5); d.title = n + ' not opened yet'; } }catch(e){} return r; };
  let ONLY = false; window.msg23Only = () => { ONLY = !ONLY; renderMsgs(); };
  function paint(){ const v = $('v-msgs'); if(!v) return; const n = v.querySelectorAll('.ib22 .li.new').length;
    const h1 = v.querySelector('.lead h1'); if(h1){ let b = h1.querySelector('.nb23'); if(n){ if(!b){ h1.insertAdjacentHTML('beforeend', '<span class="nb23"></span>'); b = h1.querySelector('.nb23'); } b.textContent = n + ' not opened yet'; } else if(b) b.remove(); }
    const tb = v.querySelector('.tb22'); if(tb && !tb.querySelector('.un23')){ tb.insertAdjacentHTML('afterbegin', '<button type="button" class="chip un23 ' + (ONLY ? 'teal' : '') + '" onclick="msg23Only()">Unread <b>' + n + '</b></button>'); if(ONLY) tb.querySelectorAll('button:not(.un23)').forEach(x => x.classList.remove('teal')); }
    v.querySelectorAll('.ib22 .li .grow>.chip.red').forEach(c => { if(/^\d+ new$/.test(c.textContent.trim())) c.classList.add('nw23'); });
    const ib = v.querySelector('.ib22'); if(ib) ib.classList.toggle('only23', ONLY);
    try{ msgBadge(); }catch(e){} }
  const r0 = window.renderMsgs; window.renderMsgs = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){ console.warn('msg23', e); } return r; };
  const t0 = window.MSF; Object.defineProperty(window, 'MSF', { configurable: true, get(){ return this._msf23 || t0 || 'all'; }, set(v){ this._msf23 = v; ONLY = false; } });
  setInterval(() => { try{ msgBadge(); }catch(e){} }, 20000);
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'msgs') renderMsgs(); else msgBadge(); }catch(e){}
})();
