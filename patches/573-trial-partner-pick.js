// 22 Oct · Misty: in a trial, Source › Partner should fill our partners automatically. One-tap partner chips under the
// partner box (same names as DATABASE › Source), typing still works and suggests them.
require('../tools/lib.js')(process.argv[2], [
["\n</body>", `
<script>
/* 573 · partner chips in New class › Trial › Source › Partner */
(function(){
  const PARTNERS = ['Jinan \\u2013 Dr. Spring', 'Jinan \\u2013 Dr. Rose', 'Inner Mongolia \\u2013 Ms. Jane', 'Chengdu \\u2013 Mr. Jayson', 'Chengdu \\u2013 Mr. Clark', 'Dalian \\u2013 Tintin', 'Partner \\u2013 Xiaolan'];
  function add(){ const w = document.getElementById('cPtW'), i = document.getElementById('cPt'); if(!w || !i || w.querySelector('.pt573')) return;
    i.placeholder = 'Pick a partner below or type a new one'; i.setAttribute('list', 'ptL573');
    w.insertAdjacentHTML('beforeend', '<datalist id="ptL573">' + PARTNERS.map(p => '<option value="' + p + '">').join('') + '</datalist><div class="skc pt573" style="margin-top:8px">' + PARTNERS.map(p => '<button type="button" onclick="pt573(this)">' + p + '</button>').join('') + '</div>');
    sync(); i.addEventListener('input', sync); }
  function sync(){ const i = document.getElementById('cPt'); document.querySelectorAll('.pt573 button').forEach(b => b.classList.toggle('on', !!i && b.textContent === i.value.trim())); }
  window.pt573 = b => { const i = document.getElementById('cPt'); if(!i) return; i.value = i.value.trim() === b.textContent ? '' : b.textContent; sync(); try{ classPrev(); }catch(e){} };
  document.head.insertAdjacentHTML('beforeend', '<style>.pt573 button.on{background:#2E2650;color:#fff;border-color:#2E2650}</style>');
  const _s = window.classSrc; if(typeof _s === 'function') window.classSrc = function(){ const r = _s.apply(this, arguments); try{ add(); }catch(e){} return r; };
})();
</script>

</body>`],
]);
