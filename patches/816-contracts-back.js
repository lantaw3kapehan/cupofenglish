// 816: (Misty) "WHERE DID THE CASES, CONTRACT GO" — after the sidebar was grouped (812), Contracts and Notices of breach lost their
// place (they sat under Cases). They are back in the side menu right under Teachers. Cases is the "Cases" tab of Teachers,
// and the Teachers tab bar now also has Contracts and Notices of breach.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["const cs = document.querySelector('#navIn button[data-v=\"actions\"]');", "const cs = document.querySelector('#navIn button[data-v=\"actions\"]') || document.querySelector('#navIn button[data-v=\"teachers\"]');"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 816 · Contracts and Notices also in the Teachers tab bar */
(function(){
  if(window.__816) return; window.__816 = 1;
  function add(){ try{ document.querySelectorAll('.grp-tabs[data-g="teachers"]').forEach(b => { if(b.querySelector('.x816')) return;
      if(typeof ctAdmin === 'function') b.insertAdjacentHTML('beforeend', '<button class="x816" onclick="ctAdmin()">Contracts</button>');
      if(typeof ntAdmin === 'function') b.insertAdjacentHTML('beforeend', '<button class="x816" onclick="ntAdmin()">Notices of breach</button>'); }); }catch(e){} }
  new MutationObserver(add).observe(document.body, { childList: true, subtree: true });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
