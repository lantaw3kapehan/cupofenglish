/* 16 Oct · 248 · Books: for CupOfEnglish classes only (Misty 20:41). A notice on the Books screen and on every book list, and
   before a teacher opens a book for the first time on a device, they read it and tap "I understand". */
(function(){
  const TXT = 'These books are for CupOfEnglish classes only. Use them only to teach and prepare for your CupOfEnglish students. Do not download, copy, share, forward or post them, and do not use them for other classes, private tutoring or personal use.';
  try{ const st = document.createElement('style'); st.textContent = `
.bk-rule{display:flex;gap:10px;align-items:flex-start;margin:12px 0 4px;padding:12px 14px;border-radius:12px;background:#FDF1EE;border:1px solid #F1C9BF;color:var(--ink);font-size:13.5px;line-height:1.5}
.bk-rule b{display:block;color:var(--coral);font-size:14px;margin-bottom:2px}
.bk-rule svg{flex:none;width:20px;height:20px;margin-top:1px;color:var(--coral)}
`; document.head.appendChild(st); }catch(e){}
  const ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
  const box = () => `<div class="bk-rule">${ICO}<div><b>For CupOfEnglish classes only</b>${esc(TXT)}</div></div>`;
  window.bkRuleHtml = box;
  const L0 = window.bkLib2; if(L0) window.bkLib2 = function(){ const r = L0.apply(this, arguments); try{ const h = document.querySelector('#v-books .bl-hd'); if(h && !document.querySelector('#v-books .bk-rule')) h.insertAdjacentHTML('afterend', box()); }catch(e){} return r; };
  const ok = () => { try{ return !!store('get', 'coe.bkok.' + String((D && D.me && D.me.name) || '').toLowerCase()); }catch(e){ return false; } };
  window.bkAgree = function(a, b, c){ try{ store('set', 'coe.bkok.' + String((D && D.me && D.me.name) || '').toLowerCase(), new Date().toISOString()); }catch(e){} window.bookSheet(a, b, c); };
  const S0 = window.bookSheet; if(S0) window.bookSheet = function(a, b, c){
    if(D && !D.mgr && !ok()){ const arg = [a, b, c].map(x => esc(JSON.stringify(x == null ? '' : x))).join(',');
      openSheet(`<h1>Before you open the books</h1>${box()}<div class="small mute" style="margin-top:8px">The books are licensed to CupOfEnglish for our classes. Keeping them inside CupOfEnglish protects the school and you.</div><button class="btn block" style="margin-top:16px" onclick="bkAgree(${arg})">I understand · open the book</button>`); return; }
    const r = S0.apply(this, arguments); try{ const h = document.querySelector('#sheetBody h1'); if(h && !document.querySelector('#sheetBody .bk-rule')) h.parentNode.insertBefore(document.createRange().createContextualFragment(box()), $('bkBody')); }catch(e){} return r; };
  /* the one-tap unit link on a class card opens Drive directly: the first time, the notice comes first */
  document.addEventListener('click', ev => { const a0 = ev.target && ev.target.closest && ev.target.closest('a[href^="https://drive.google.com/file/d/"]'); if(!a0 || !D || D.mgr || ok()) return;
    ev.preventDefault(); const u = a0.href; window._bkGo = () => { try{ store('set', 'coe.bkok.' + String((D && D.me && D.me.name) || '').toLowerCase(), new Date().toISOString()); }catch(e){} closeSheet(); window.open(u, '_blank', 'noopener'); };
    openSheet(`<h1>Before you open the books</h1>${box()}<div class="small mute" style="margin-top:8px">The books are licensed to CupOfEnglish for our classes. Keeping them inside CupOfEnglish protects the school and you.</div><button class="btn block" style="margin-top:16px" onclick="_bkGo()">I understand · open the book</button>`); }, true);
})();
