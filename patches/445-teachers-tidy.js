// 20 Oct · Teachers tidy: map labels never overlap, zone labels out of the dots' way, "1 student", attendance headline aligned, bonus tile readable.
require('../tools/lib.js')(process.argv[2], [
  ["zone(L + 8, Tp + 16, 'ROOM TO TAKE MORE', 'start')", "zone(xa - 8, Tp + 16, 'ROOM TO TAKE MORE', 'end')"],
  ["zone(L + 8, yg + 18, 'NEEDS A TALK', 'start')", "zone(xa - 8, yg + 18, 'NEEDS A TALK', 'end')"],
  ["    g += pts.map(p => {", "    { const S = pts.slice().sort((a, b) => a.cy - b.cy), placed = []; S.forEach(p => { let ly = p.cy + 4, lx = p.cx + p.r + 4; for(let k = 0; k < 8; k++){ const hit = placed.find(q => Math.abs(q.x - lx) < 70 && Math.abs(q.y - ly) < 13); if(!hit) break; ly = hit.y + 13; } p.ly = ly; p.lx = lx; placed.push({ x: lx, y: ly }); }); }   /* 445: labels step down instead of overlapping */\n    g += pts.map(p => {"],
  ["'<text x=\"' + (p.cx + p.r + 4) + '\" y=\"' + (p.cy + 4) + '\" font-size=\"11.5\"", "(Math.abs(p.ly - p.cy - 4) > 1 ? '<line x1=\"' + (p.cx + p.r) + '\" y1=\"' + p.cy + '\" x2=\"' + (p.lx - 1) + '\" y2=\"' + (p.ly - 4) + '\" stroke=\"#C9C6D6\" stroke-width=\"1\"/>' : '') + '<text x=\"' + p.lx + '\" y=\"' + p.ly + '\" font-size=\"11.5\""],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 445 · small tidy: "1 students" → "1 student"; the attendance headline starts at the left edge; the bonus tile reads "+₱300 bonus · −₱0 deductions" on two clear lines. */
(function(){
  const css = document.createElement('style');
  css.textContent = '.att44 .hd{padding:0!important;margin-left:0!important}.att44 .hd>b{min-width:0!important;width:auto!important;text-align:left!important;padding:0!important}' +
    '#v-teachers #ttBody>.card .stat .b45{font-family:var(--brand);font-size:20px;color:#1E8A5E;display:block;line-height:1.2}#v-teachers #ttBody>.card .stat .d45{font-size:12px;color:#8A86A0}';
  document.head.appendChild(css);
  function tidy(){ const v = document.getElementById('v-teachers'); if(!v) return;
    v.querySelectorAll('.tc2-f span').forEach(s => { if(/^1 students$/.test(s.textContent)) s.textContent = '1 student'; });
    v.querySelectorAll('#ttBody>.card .stat').forEach(st => { if(st.dataset.b45) return; const t = st.textContent.replace(/\\s+/g, ' '); const m = t.match(/\\+\\s*₱\\s*([\\d,]+)\\s*bonus\\s*·\\s*[−-]\\s*₱\\s*([\\d,]+)/); if(!m) return; st.dataset.b45 = 1;
      st.innerHTML = '<span class="b45">+₱' + m[1] + '</span><span class="d45">bonus · ' + (m[2] === '0' ? 'no deductions' : '<b style="color:#C0563F">−₱' + m[2] + '</b> deductions') + '</span>'; }); }
  ['renderTeachers', 'loadTT'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ tidy(); }catch(e){} Promise.resolve(r).then(() => { try{ tidy(); }catch(e){} }); return r; }; });
  try{ tidy(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
