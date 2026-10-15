// 15 Oct · To do came up empty (Misty 14:09): Google answered the TODAY tab with 0 rows while the sheet was rebuilding it
// (14:07), and the app kept that empty copy. Now an empty tab answer never replaces a good copy, and the app asks again
// 20 s later (up to 3 times) — for every tab screen (To do, Money, Cases, Database…).
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", `
</script>
<script>
(function(){
  const _swr = swr, tries = {};
  swr = function(k, call, set, paint){
    const call2 = async () => { const v = await call();
      if(v && Array.isArray(v.rows) && !v.rows.length){
        const t = tries[k] = tries[k] && Date.now() - tries[k].at < 300000 ? tries[k] : { n: 0, at: Date.now() };
        if(t.n < 3){ t.n++; setTimeout(() => { try{ swr(k, call, set, paint); }catch(e){} }, 20000); }
        const old = kept(k); if(old && Array.isArray(old.rows) && old.rows.length) throw new Error('empty answer · kept the last copy');
      } else delete tries[k];
      return v; };
    return _swr(k, call2, set, paint); };
})();
</script>

</body>`],
]);
