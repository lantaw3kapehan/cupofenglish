/* 16 Oct · 253 · Teacher Today, calmer class cards (Misty 21:02 "detailed, minimal, not crowded"):
   name + book chip (calendar colour) · one quiet line (code · meeting ID · Edit ID) · "Last class" without a repeated "Next" ·
   one action row (Class brief · Class note · the book's unit · time-in) · tasks as slim one-line rows, done items as a quiet line. */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
.cls .bkchip{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:999px;padding:2px 9px 2px 7px;cursor:pointer;white-space:nowrap;flex:none}
.cls .bkchip::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--c)}
.cls .note{margin-top:8px;background:var(--soft);border-radius:10px;padding:7px 10px;font-size:13px}
.cls .cact{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:10px}
.cls .cact > *{margin:0!important}
.cls .cact .chip{font-size:12px}
.cls .cact .bkb{display:inline-flex;align-items:center;gap:6px}
.cls .cact .bkb i{width:8px;height:8px;border-radius:50%;background:var(--bc);display:inline-block}
.cls .hw{margin-top:6px;padding:7px 10px;border-radius:10px;background:#fff;border:1px solid var(--line);font-size:13px;min-height:0}
.cls .hw .ic{width:20px;height:20px;font-size:11px;background:var(--soft);color:var(--ink2)}
.cls .hw.due{border-color:#F1C9BF;background:#FFF8F6}
.cls .hw.due .ic{background:#FDE7E1;color:#B4533C}
.cls .hw.ok{background:transparent;border:0;padding:3px 2px;color:#2E7D32}
.cls .hw.ok .ic{background:#E8F5E9;color:#2E7D32}
.cls .hw .btn.sm{padding:6px 12px;font-size:12.5px}
.cls .hw .grow.ell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cls .hw .grow.ell .mute{font-size:12.5px}
@media(max-width:560px){.cls .hw .grow.ell .mute{display:none}}
`; document.head.appendChild(st); }catch(e){}
  /* the book button in the action row: one tap to the unit the last class ended on, or the book list */
  window.bkBtn = function(c, s){ try{ if(!c.code || c.cancelled || !window.bkHas || !bkHas(c.book || s.book)) return '';
      const html = window.bkCard ? bkCard(c, s) : ''; if(!html) return '';
      const m = /href="([^"]+)"[^>]*>([^<]*?)\s*›<\/a>/.exec(html), col = bookCol(c.book || s.book);
      if(m) return `<a class="btn ghost sm bkb" style="--bc:${col}" href="${m[1]}" target="_blank" rel="noopener"><i></i>${esc(String(m[2]).replace(/^.*?·\s*/, ''))}</a>`;
      const u = /Unit\s*(\d+)/.exec(html);
      return `<button class="btn ghost sm bkb" style="--bc:${col}" onclick="bookSheet('${esc(c.code)}','${esc(c.id)}')"><i></i>${u ? 'Unit ' + u[1] : 'Book'}</button>`; }catch(e){ return ''; } };
})();
