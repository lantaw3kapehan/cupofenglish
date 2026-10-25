// 846: Student page — compact identity header and one action toolbar, so the tabs and their content come sooner (UI direction).
// CSS/ARIA only: every button, chip, KPI and tab stays; nothing is removed or re-ordered.
// · Identity card: less padding, 40 px avatar, 22 px name, tighter chip lines and KPI boxes (~40% shorter on a laptop).
// · Actions: "Send to parent" and "Manage" sit side by side on one row on a laptop (were two stacked rows), smaller buttons;
//   on a phone the two groups stack and wrap, all buttons visible.
// · The action bar is a labelled toolbar; each group is a labelled group (screen readers hear "Send to parent" / "Manage").
// · The tabs keep sticking to the top of the card while scrolling (unchanged), now closer to the top.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 846 · student page: compact header + one-row action toolbar */
(function(){
  if(window.__846) return; window.__846 = 1;
  const css = document.createElement('style'); css.id = 'css846';
  css.textContent = [
    '#sheetBody.stu2 .shero{padding:12px 16px!important;gap:8px 14px!important;align-items:center!important}',
    '#sheetBody.stu2 .shero .av.big{width:40px!important;height:40px!important;font-size:17px!important;margin-top:0!important}',
    '#sheetBody.stu2 .shero h1{font-size:22px!important;line-height:1.2}',
    '#sheetBody.stu2 .shero h1 .cn{font-size:15px!important}',
    '#sheetBody.stu2 .shero .grow .hl{margin-top:4px!important;gap:3px 14px!important}',
    '#sheetBody.stu2 .shero .grow .hl+.hl{margin-top:2px!important}',
    '#sheetBody.stu2 .shero .grow .hl>*{font-size:12.5px!important}',
    '#sheetBody.stu2 .shero .kpis{padding:2px!important}',
    '#sheetBody.stu2 .shero .kpis>div{padding:5px 12px!important;min-width:62px!important}',
    '#sheetBody.stu2 .shero .kpis b{font-size:18px!important}',
    '#sheetBody.stu2 .shero .kpis span{font-size:11px!important}',
    '#sheetBody.stu2 .stu-bar{flex-direction:row!important;flex-wrap:wrap!important;align-items:center!important;gap:0!important;padding:4px!important;margin:8px 0 2px!important;border-radius:14px!important}',
    '#sheetBody.stu2 .stu-bar .grp{padding:2px 8px!important;gap:5px!important;width:auto!important;flex-wrap:wrap}',
    '#sheetBody.stu2 .stu-bar .grp+.grp{border-top:0!important;border-left:1px solid #F0EFF5!important;margin-top:0!important;padding-top:2px!important;border-radius:0!important}',
    '#sheetBody.stu2 .stu-bar .grp>span{min-width:0!important;font-size:10.5px!important;margin:0 2px 0 0!important}',
    '#sheetBody.stu2 .stu-bar .btn{padding:5px 10px!important;font-size:12.5px!important}',
    '#sheetBody.stu2 .stu-tabs{margin-top:6px!important}',
    '@media(max-width:620px){#sheetBody.stu2 .shero{padding:10px 12px!important}#sheetBody.stu2 .shero h1{font-size:20px!important}#sheetBody.stu2 .stu-bar{flex-direction:column!important;align-items:stretch!important}#sheetBody.stu2 .stu-bar .grp{width:100%!important}#sheetBody.stu2 .stu-bar .grp+.grp{border-left:0!important;border-top:1px solid #F0EFF5!important;margin-top:2px!important;padding-top:4px!important}}'
  ].join('\n');
  document.head.appendChild(css);
  function aria(){ try{ const b = document.querySelector('#sheetBody.stu2 .stu-bar'); if(!b) return;
    if(b.getAttribute('role') !== 'toolbar'){ b.setAttribute('role', 'toolbar'); b.setAttribute('aria-label', 'Student actions'); }
    b.querySelectorAll(':scope > .grp').forEach(g => { const l = ((g.querySelector(':scope > span') || {}).textContent || '').trim(); if(l && g.getAttribute('aria-label') !== l){ g.setAttribute('role', 'group'); g.setAttribute('aria-label', l); } });
    const t = document.querySelector('#sheetBody.stu2 .stu-tabs'); if(t){ if(!t.getAttribute('aria-label')) t.setAttribute('aria-label', 'Student page sections');
      t.querySelectorAll('button').forEach(x => { const p = x.classList.contains('on') ? 'true' : 'false'; if(x.getAttribute('aria-pressed') !== p) x.setAttribute('aria-pressed', p); }); } }catch(e){} }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); try{ aria(); setTimeout(aria, 60); setTimeout(aria, 500); }catch(e){} return r; };
  const _st = window.stuTab; if(_st) window.stuTab = function(){ const r = _st.apply(this, arguments); try{ aria(); }catch(e){} return r; };
})();
</script>` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
