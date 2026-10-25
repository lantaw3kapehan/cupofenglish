// 952 (D5 · Teacher role): phone layout fixes found in the teacher preview (390 px).
//      · Pay › Punctuality: each late row ("Late to class · 3 min … Pending · −₱30 unless excused by 26 Oct, 13:03") squeezed the
//        left part to one word per line (the rule wraps the row on phones but the text block could shrink to its narrowest
//        word). Now on phones the text block takes the full row and the status goes under it. Wording and amounts unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 952 · teacher phone layout fixes */
(function(){ if(window.__952) return; window.__952 = 1;
  var css = '@media(max-width:620px){.lt-it{flex-wrap:wrap;row-gap:4px}.lt-it > .grow{flex:1 1 100%!important;min-width:0}.lt-it > b{white-space:normal}}';
  var st = document.createElement('style'); st.id = 's952'; st.textContent = css; document.head.appendChild(st);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
