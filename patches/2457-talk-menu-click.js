// 2457 (Misty 18:03 "some screens are not being clicked on teacher's access like talk of the day") · the Talk of the Day menu item
//   lost its own click when the menu was redrawn (onclick null), so nothing happened · one click listener on the page now opens it
//   wherever the item is (side menu, phone bottom bar, More).
const file = process.argv[2];
const JS = String.raw`<script id="b2457">
document.addEventListener('click', function(e){ var t = e.target && e.target.closest && e.target.closest('[data-v="talk"]'); if(!t || t.closest('#v-talk')) return;
  e.preventDefault(); e.stopPropagation(); try{ if(typeof talk2455 === 'function') talk2455(); else window.open('talk/', '_blank'); }catch(x){ window.open('talk/', '_blank'); } }, true);
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', JS + '<script id="b2278">']]);
