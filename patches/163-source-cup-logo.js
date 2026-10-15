// 15 Oct · The CupOfEnglish source tag uses the official cup logo (the app icon) instead of a drawn cup (Misty).
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", `
</script>
<script>
(function(){
  try{ const l = document.querySelector('link[rel="icon"]'); if(l && l.href) document.documentElement.style.setProperty('--coe-cup', 'url("' + l.href + '")'); }catch(e){}
  const st = document.createElement('style'); st.id = 'cupico';
  st.textContent = '.sa-src.coe svg{display:none}.sa-src.coe::before{content:"";width:15px;height:15px;flex:none;background:var(--coe-cup) center/contain no-repeat}';
  document.head.appendChild(st);
})();
</script>

</body>`],
]);
