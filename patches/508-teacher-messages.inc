/* 21 Oct · 508 · Teacher Messages, same visual language as Today / Schedule / Students (Misty: "Now, let's improve the messages screen").
   · Header: New message and Request leave beside the title; refresh is a small round icon.
   · A status card: unread · waiting for your reply · saved, each with its symbol and colour; tap one to filter.
   · "Needs you" first (unread or waiting for your reply), then the rest grouped by day: Today, Yesterday, This week, Earlier.
   · Each message is one tidy row: a coloured symbol for its kind (📢 notice teal, memo coral, progress check amber,
     class QA violet, your message grey), the kind and time, two lines of the text, its status pill and replies; ☆ to save.
   Unread, waiting for your reply and saved are the three tiles (tap to filter), so the chips below keep only the kinds.
   Same search, saving and opening as before. Nothing removed. */
(function(){
  const css = document.createElement('style'); css.textContent = `
#v-tinbox .hd508{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
#v-tinbox .hd508 .ac{display:flex;gap:8px;align-items:center}
#v-tinbox .hd508 .rf{width:40px;height:40px;padding:0!important;display:grid;place-items:center;border-radius:50%!important}
#v-tinbox .hd508 .rf svg{width:18px;height:18px}
#v-tinbox .st508{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}
#v-tinbox .st508 a{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:16px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 8px 22px -16px rgba(43,34,83,.16);cursor:pointer;text-decoration:none;color:#4A4766;transition:border-color .15s}
#v-tinbox .st508 a.on{border-color:var(--c);box-shadow:0 0 0 1px var(--c) inset}
#v-tinbox .st508 a i{flex:none;width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 13%,#fff);color:var(--c);font-style:normal;font-weight:700;font-size:16px}
#v-tinbox .st508 a b{display:block;font-size:20px;color:#2B2253;line-height:1.1;font-variant-numeric:tabular-nums}
#v-tinbox .st508 a span{font-size:12.5px}
#v-tinbox .st508 a.z b{color:#A3A0B5}
#v-tinbox .q508{width:100%;margin-top:14px}
#v-tinbox .seg{margin-top:10px;flex-wrap:wrap}
#v-tinbox .g508{margin:18px 2px 6px;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#8A87A0;font-weight:700;display:flex;align-items:center;gap:8px}
#v-tinbox .g508.nd{color:#B5533F}
#v-tinbox .g508 em{font-style:normal;font-weight:600;letter-spacing:0;text-transform:none;color:#A3A0B5}
#v-tinbox .ls508{background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -18px rgba(43,34,83,.16);padding:4px 6px}
#v-tinbox .ls508.nd{border-color:rgba(224,122,98,.35)}
#v-tinbox .m508{display:flex;align-items:flex-start;gap:12px;padding:12px 10px;border-radius:14px;cursor:pointer;position:relative}
#v-tinbox .m508+.m508{border-top:1px solid #F1F0F5}
#v-tinbox .m508:hover{background:#FAFAFC}
#v-tinbox .m508 .ic{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--k) 13%,#fff);color:var(--k)}
#v-tinbox .m508 .ic svg{width:19px;height:19px}
#v-tinbox .m508 .bd{flex:1;min-width:0}
#v-tinbox .m508 .tp{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;color:#8A87A0}
#v-tinbox .m508 .tp b{color:var(--k);font-size:12px;letter-spacing:.02em}
#v-tinbox .m508 .tx{margin-top:3px;font-size:14.5px;line-height:1.45;color:#3B3858;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}
#v-tinbox .m508.u .tx{color:#2B2253;font-weight:700}
#v-tinbox .m508.u:before{content:'';position:absolute;left:-1px;top:20px;width:7px;height:7px;border-radius:50%;background:#00A3AD}
#v-tinbox .m508 .rp{margin-top:4px;font-size:12.5px;color:#8A87A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-tinbox .m508 .pl{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:999px;font-size:11.5px;font-weight:700}
#v-tinbox .m508 .pl.ok{background:#E8F5EF;color:#1E7A55}#v-tinbox .m508 .pl.wt{background:#FCEDE8;color:#B5533F}#v-tinbox .m508 .pl.am{background:#FFF4DE;color:#8A5A00}
#v-tinbox .m508 .sv{flex:none;width:34px;height:34px;border-radius:50%;border:1px solid transparent;background:none;cursor:pointer;font-size:16px;color:#B9B6CC;display:grid;place-items:center}
#v-tinbox .m508 .sv:hover{border-color:#E3E1EC;color:#D9A21B}#v-tinbox .m508 .sv.on{color:#D9A21B}
#v-tinbox .e508{padding:22px 14px;text-align:center;color:#8A87A0;font-size:14px}
@media(max-width:620px){#v-tinbox .st508{gap:6px}#v-tinbox .st508 a{flex-direction:column;align-items:flex-start;gap:6px;padding:10px}#v-tinbox .st508 a i{width:30px;height:30px;font-size:14px}
  #v-tinbox .m508{gap:10px;padding:11px 6px}#v-tinbox .m508 .ic{width:34px;height:34px}#v-tinbox .hd508 .ac{width:100%}#v-tinbox .hd508 .ac .btn{flex:1;white-space:nowrap;padding-left:10px!important;padding-right:10px!important}#v-tinbox .hd508 .ac .rf{flex:none}}`;
  document.head.appendChild(css);
  const SV = {
    notice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/></svg>',
    memo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    pc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16"/><path d="M6 15l4-4 3 3 5-6"/></svg>',
    qa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    mg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 12h7"/></svg>',
    rf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>' };
  const kind = t => { const r = t.root, C = window.msgCats ? msgCats(t, tUnread, 1) : [];
    if(r.kind === 'memo') return ['memo', 'Memo', '#D4705A'];
    if(C.indexOf('pc') > -1) return ['pc', 'Progress check', '#C98A16'];
    if(C.indexOf('qa') > -1) return ['qa', 'Class QA', '#7B5CC4'];
    if(r.role === 'mgmt' && (r.need || r.kind === 'notice')) return ['notice', 'Notice', '#00939D'];
    if(r.role === 'mgmt') return ['mg', 'Management', '#3F51B5'];
    return ['msg', 'You', '#8A87A0']; };
  const when = s => { const d = new Date(s); if(isNaN(d)) return msgAt(s); const t = ymdLocal(new Date()), y = ymdLocal(d), hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    return y === t ? 'Today ' + hm : y === ymdLocal(new Date(Date.now() - 864e5)) ? 'Yesterday ' + hm : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + hm; };
  const grp = s => { const d = new Date(s); if(isNaN(d)) return 'Earlier'; const t = ymdLocal(new Date()), y = ymdLocal(d); if(y === t) return 'Today'; if(y === ymdLocal(new Date(Date.now() - 864e5))) return 'Yesterday'; return Date.now() - d.getTime() < 7 * 864e5 ? 'This week' : 'Earlier'; };
  const waits = t => t.root.role === 'mgmt' && t.root.need && !t.root.ack;
  function draw(){ const v = $('v-tinbox'); if(!v || !D || D.mgr) return false;
    const T = (TMSG && TMSG.threads) || [], st = tStars(), q = TIF.q.trim().toLowerCase();
    const isNote = t => t.root.role === 'mgmt' && (t.root.kind === 'memo' || t.root.kind === 'notice' || t.root.need);
    let L = T.slice();
    if(TIF.f === 'unread') L = L.filter(t => tUnread(t)); else if(TIF.f === 'notes') L = L.filter(isNote); else if(window.msgCats && /^(reply|pc|qa)$/.test(TIF.f)) L = L.filter(t => msgCats(t, tUnread, 1).indexOf(TIF.f) > -1); else if(TIF.f === 'saved') L = L.filter(t => st[t.root.id]);
    if(q) L = L.filter(t => [t.root].concat(t.replies).some(r => String(r.text || '').toLowerCase().includes(q) || String(r.memoNo || '').toLowerCase().includes(q)));
    L.sort((a, b) => String(b.lastAt).localeCompare(String(a.lastAt)));
    const nU = T.filter(t => tUnread(t)).length, nW = T.filter(waits).length, nS = T.filter(t => st[t.root.id]).length, nN = T.filter(isNote).length;
    const cN = k => window.msgCats ? T.filter(t => msgCats(t, tUnread, 1).indexOf(k) > -1).length : 0;
    const seg = [['all', 'All', T.length], ['pc', 'Progress checks', cN('pc')], ['qa', 'Class QA', cN('qa')], ['notes', 'Notices & memos', nN]].map(([k, l, n]) => `<button type="button" class="${TIF.f === k ? 'on' : ''}" onclick="TIF.f='${k}';renderTInbox()">${l}${n ? ' · ' + n : ''}</button>`).join('');
    const tile = (k, n, lab, sym, c) => `<a class="${TIF.f === k ? 'on' : ''} ${n ? '' : 'z'}" style="--c:${c}" onclick="TIF.f=TIF.f==='${k}'?'all':'${k}';renderTInbox()"><i>${sym}</i><span><b>${n}</b>${lab}</span></a>`;
    const row = t => { const r = t.root, last = t.replies.length ? t.replies[t.replies.length - 1] : r, u = tUnread(t), K = kind(t), memo = r.kind === 'memo';
      const status = r.role === 'mgmt' && r.need ? (r.ack ? `<span class="pl ${/will do|later|tomorrow|⏰/i.test(ackLbl(r)) ? 'am' : 'ok'}">${esc(ackLbl(r))}</span>` : '<span class="pl wt">! Reply needed</span>') : '';
      return `<div class="m508 ${u ? 'u' : ''}" style="--k:${K[2]}" onclick="tMsgOpen('${r.id}')"><span class="ic">${SV[K[0]]}</span><div class="bd"><div class="tp"><b>${esc(K[1])}</b><span>${esc(when(t.lastAt))}${memo && r.memoNo ? ' · ' + esc(r.memoNo) : ''}</span>${status}</div>
<div class="tx">${esc(r.role === 'mgmt' ? r.text : 'You: ' + r.text)}</div>${t.replies.length ? `<div class="rp">↳ ${esc((last.role === 'mgmt' ? 'Management: ' : 'You: ') + last.text)} · ${t.replies.length} repl${t.replies.length === 1 ? 'y' : 'ies'}</div>` : ''}</div>
<button type="button" class="sv ${st[r.id] ? 'on' : ''}" title="${st[r.id] ? 'Remove from saved' : 'Save on this device'}" onclick="tStar('${r.id}', event)">${st[r.id] ? '★' : '☆'}</button></div>`; };
    let body = '';
    if(!TMSG) body = '<div class="sk"></div><div class="sk"></div>';
    else if(!L.length) body = `<div class="ls508"><div class="e508">${q ? 'Nothing matches “' + esc(TIF.q) + '”.' : TIF.f === 'saved' ? 'Tap ☆ on a message to save it here.' : TIF.f === 'unread' ? '✓ All read' : TIF.f === 'reply' ? '✓ Nothing waiting for your reply' : 'No messages yet.'}</div></div>`;
    else { const top = TIF.f === 'all' && !q ? L.filter(t => tUnread(t) || waits(t)) : [], rest = L.filter(t => top.indexOf(t) < 0);
      if(top.length) body += `<div class="g508 nd">Needs you <em>· ${top.length}</em></div><div class="ls508 nd">${top.map(row).join('')}</div>`;
      const G = {}; rest.forEach(t => (G[grp(t.lastAt)] = G[grp(t.lastAt)] || []).push(t));
      ['Today', 'Yesterday', 'This week', 'Earlier'].forEach(g => { if(G[g]) body += `<div class="g508">${g} <em>· ${G[g].length}</em></div><div class="ls508">${G[g].map(row).join('')}</div>`; }); }
    const h = `<div class="lead hd508"><div><h1>Messages</h1><div class="mute small">With management · every message and memo is kept here</div></div>
<div class="ac"><button class="btn teal" onclick="tMsgNew()">New message</button><button class="btn ghost" onclick="tlvSheet()">Request leave</button><button class="btn ghost rf" title="Check for new messages" onclick="loadTMsgs()">${SV.rf}</button></div></div>
<div class="st508">${tile('unread', nU, 'unread', '●', '#00A3AD')}${tile('reply', nW, 'waiting for your reply', '!', '#D4705A')}${tile('saved', nS, 'saved on this device', '★', '#D9A21B')}</div>
<input class="in-t q508" placeholder="Search messages and memos" value="${esc(TIF.q)}" oninput="TIF.q=this.value;clearTimeout(window._tiq);window._tiq=setTimeout(()=>{renderTInbox();const e=document.querySelector('#v-tinbox input');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length);}},250)">
<div class="seg">${seg}</div>${body}`;
    if(v.dataset.k508 !== h){ v.innerHTML = h; v.dataset.k508 = h; }
    tInboxBadge(); return true; }
  const _r = renderTInbox;
  renderTInbox = function(){ try{ if(draw()) return; }catch(e){ console.error('messages 508', e); } return _r.apply(this, arguments); };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'tinbox') renderTInbox(); }catch(e){}
})();
