// 21 Oct · To do section icons: drawn as real inline icons (the masked icon did not show, leaving an empty square next to "Renewals due").
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 21 Oct · 490 · Misty: fix the empty square beside "Renewals due". The section icons were a CSS mask over a coloured box; on this screen
   the mask did not draw, so only the box showed. Now each To do section title gets the icon as a small inline SVG in its own colour
   (renewals amber · new students violet · parents teal · data slate · deadlines grey); the old box and masked icon are hidden. */
(function(){
  const I = { renew: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
    follow: '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>', reports: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    fix: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4z"/>', ref: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>' };
  const css = document.createElement('style');
  css.textContent = '#v-mtoday [id^="td-"] h2:before{display:none!important} #v-mtoday [id^="td-"] h2 .ic8{display:none!important}' +
    '#v-mtoday [id^="td-"] h2 .ic90{flex:none;width:34px;height:34px;border-radius:11px;background:var(--catT);display:inline-flex;align-items:center;justify-content:center}' +
    '#v-mtoday [id^="td-"] h2 .ic90 svg{width:18px;height:18px;stroke:var(--cat);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}';
  document.head.appendChild(css);
  function paint(){ Object.keys(I).forEach(k => { const s = document.getElementById('td-' + k); if(!s) return; const h = s.querySelector('h2'); if(!h || h.querySelector('.ic90')) return;
    h.insertAdjacentHTML('afterbegin', '<span class="ic90" aria-hidden="true"><svg viewBox="0 0 24 24">' + I[k] + '</svg></span>'); }); }
  const r0 = window.renderMToday; if(r0) window.renderMToday = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){} setTimeout(() => { try{ paint(); }catch(e){} }, 400); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') renderMToday(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
