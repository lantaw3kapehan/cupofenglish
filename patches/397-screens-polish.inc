/* 20 Oct · 397 · Every screen, same calm look as the student page (style only · no data, button, logo or picture template changes).
   · Screen titles: big navy title, one muted line under it; the links under a title look like small buttons.
   · Filter buttons: one row of pills that wraps, no grey track.
   · Lists of rows sit in one white card with thin lines between rows and a light hover; the whole row is clickable.
   · Students list: lessons left in the same colours as the student page (amber 8 or fewer, coral 3 or fewer). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.wrap .lead h1{color:var(--ink);letter-spacing:-.01em}
.wrap .lead .mute.small{line-height:1.5}
.wrap .lead a.lk{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;margin:6px 4px 0 0;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink);text-decoration:none;font-weight:600;font-size:13px;cursor:pointer;transition:border-color .12s,background .12s}
.wrap .lead a.lk:hover{border-color:var(--ink);background:#fff}
.wrap .lead a.lk::after{content:"›";color:var(--teal);font-weight:700}
.wrap>div>.seg,.wrap .seg{background:transparent!important;border:0!important;padding:0!important;box-shadow:none!important;flex-wrap:wrap;gap:6px;margin:12px 0 10px}
.wrap .seg button{padding:7px 14px;font-size:13.5px;font-weight:600;border-radius:999px!important;transform:none!important;clip-path:none!important}
.wrap .search{border:1px solid var(--line);border-radius:14px;box-shadow:var(--sh1);background-color:#fff}
.wrap .search:focus{border-color:var(--teal);box-shadow:0 0 0 3px var(--tint)}
@media(min-width:900px){
  .wrap div:has(> .li + .li){background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:4px 10px;margin-top:6px}
  .wrap div:has(> .li + .li)>.li{border-radius:12px;margin:0;border-bottom:1px solid var(--line)}
  .wrap div:has(> .li + .li)>.li:last-child{border-bottom:0}
  .wrap .li[onclick]:hover{background:#F6FAFA}
}
.wrap .li .av{background:var(--tint);color:#00737B;font-weight:700}
.wrap .sa-l.soon{color:#B7791F!important;background:#FDF4E3!important}
.wrap .sa-l.now,.wrap .sa-l.minus{color:#C0533D!important;background:#FBECE8!important}`;
  document.head.appendChild(css);
  function colour(){ const v = $('v-astudents'); if(!v) return; v.querySelectorAll('.sa-l').forEach(el => { const n = parseFloat(el.textContent); if(isNaN(n)) return; el.classList.toggle('soon', n > 3 && n <= 8); el.classList.toggle('now', n <= 3); }); }
  const r0 = window.renderAStudents; if(r0) window.renderAStudents = function(){ const r = r0.apply(this, arguments); try{ colour(); }catch(e){} setTimeout(() => { try{ colour(); }catch(e){} }, 300); return r; };
})();
