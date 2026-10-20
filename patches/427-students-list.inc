/* 20 Oct · 427 · Students list, final polish (Misty: "let us go to the Students screen"). Style and order only.
   · Filters on one row (scroll sideways), the same pill style as other screens; the source filter sits with them.
   · Rows half as tall: name + Chinese name + code on line 1; teacher · book on line 2; the small chips (new, agreement,
     reminder, source) on one line under it.
   · The "Validity ended … extended N days" chip moves into the Valid until column ("ended 5 Jun · +137 days", coral),
     so it is not said twice. Lessons left: amber 8 or fewer, coral 3 or fewer. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-astudents>div>.seg,#v-astudents .seg{flex-wrap:nowrap!important;overflow-x:auto;padding-bottom:2px!important;scrollbar-width:none}#v-astudents .seg::-webkit-scrollbar{display:none}
#v-astudents .seg button{flex:none}
#v-astudents .sk2{margin-top:8px!important;padding:0 2px}
#v-astudents .sk2 button{border:1px solid var(--line)!important;padding:5px 11px!important;font-size:12.5px!important}
#v-astudents .sk2 button.on{border-color:currentColor!important}
#v-astudents .li.sa{padding:9px 14px!important;row-gap:0}
#v-astudents .li.sa .grow>.row:first-child{flex-wrap:wrap;align-items:baseline;column-gap:8px}
#v-astudents .li.sa .grow .nm27{font-size:12.5px;color:#8A86A0;font-weight:400}
#v-astudents .li.sa .grow>.small.mute{font-size:13px;margin-top:1px}
#v-astudents .li.sa .grow>.tags,#v-astudents .li.sa .grow>div:has(>.sa-src){display:inline-flex!important;flex-wrap:wrap;gap:4px;margin:4px 6px 0 0!important;vertical-align:middle}
#v-astudents .li.sa .grow .tags .chip,#v-astudents .li.sa .sa-src{font-size:11.5px!important;padding:2px 9px!important;margin:0!important}
#v-astudents .li.sa .vn{display:none!important}
#v-astudents .li.sa .sa-d small{display:block;font-size:11.5px;color:#B4442F;font-weight:600}
#v-astudents .li.sa .sa-d.end{color:#B4442F}`;
  document.head.appendChild(css);
  function paint(){ const v = $('v-astudents'); if(!v) return;
    v.querySelectorAll('.li.sa').forEach(li => { if(li.dataset.p27) return; li.dataset.p27 = 1;
      /* code onto the name line */
      const sub = li.querySelector('.grow>.small.mute'), r1 = li.querySelector('.grow>.row'); if(sub && r1 && !r1.querySelector('.nm27')){ const m = sub.textContent.match(/^(ST-\d{4}-\d{3})\s*·\s*/); if(m){ r1.insertAdjacentHTML('beforeend', '<span class="nm27">' + m[1] + '</span>'); sub.innerHTML = sub.innerHTML.replace(m[1] + ' · ', ''); } }
      /* validity into the date column */
      const vn = li.querySelector('.vn'), d = li.querySelector('.sa-d'); if(vn && d){ const t = vn.textContent.match(/ended\s+([^·]+)·\s*extended\s+(\d+)/i); if(t && !d.querySelector('small')){ d.classList.add('end'); d.insertAdjacentHTML('beforeend', '<small>+' + t[2] + ' days past</small>'); } } }); }
  const r0 = window.renderAStudents; if(r0) window.renderAStudents = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){} setTimeout(() => { try{ paint(); }catch(e){} }, 400); setTimeout(() => { try{ paint(); }catch(e){} }, 1500); return r; };
  try{ const v = $('v-astudents'); let t = 0; if(v) new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { try{ paint(); }catch(e){} }, 120); }).observe(v, { childList: true, subtree: true }); }catch(e){}
})();
