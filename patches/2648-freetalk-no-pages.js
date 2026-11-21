// 2648 (Misty 21 Nov 20:57 "maybe if the class is freetalk no need these? · or have an option to click · do it now please")
//   Class note: Free Talk classes open without Unit / Book page / Workbook page (link "+ Add book pages" brings them back);
//   book classes keep them, with a "No book today" link to hide them. Chips follow the choice:
//   no book → Next class: Continue today's topic, New topic, Use today's new words in a story (no Start the next unit / Reading aloud);
//             Homework: Prepare 3 ideas for the next topic (no Workbook p.).
//   The choice is kept per student on this device, so the next class opens the same way. Nothing else in the note changes.
const file = process.argv[2];
const JS = `<script id="b2648">
(function(){ if(window.__2648) return; window.__2648 = 1;
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var FT = /free\\s*talk/i, KEY = function(c){ return 'coe.nb2648.' + c; };
  var css = document.createElement('style'); css.textContent = '.nb2648-off{display:none!important}.nb2648-l{display:inline-block;margin-top:6px;font-size:13px;color:#00737B;font-weight:600;cursor:pointer;background:none;border:0;padding:2px 0}';
  document.head.appendChild(css);
  function isTalk(code){ try{ var k = localStorage.getItem(KEY(code)); if(k) return k === 'talk'; }catch(e){}
    try{ var e = document.getElementById('nE'), v = e ? e.value : '';
      if(FT.test(v)) return true;
      var on = document.querySelector('#epBox [data-bk].on'); if(on && FT.test(on.textContent + ' ' + on.dataset.bk)) return true;
      if(!v){ var last = document.querySelector('#epBox .gx-c button[onclick^="epLast"]'); if(last && FT.test(last.textContent)) return true;
        var st = (D.students || []).find(function(x){ return x.code === code; }) || {}; var bks = String(st.book || '').split(/\\s*,\\s*/).filter(Boolean);
        if(bks.length && bks.every(function(b){ return FT.test(b) || /^(pre[-\\s]?)?[abc][12]\\+?$/i.test(b); })) return true; }
    }catch(e){} return false; }
  function txt(b){ return (b.textContent || '').trim(); }
  function apply(code, talk){
    var box = document.getElementById('epBox'); if(!box) return;
    var g = box.querySelector('.ep-g'), hint = g && g.nextElementSibling;
    [g, hint].forEach(function(x){ if(x) x.classList.toggle('nb2648-off', talk); });
    var hw = document.getElementById('epHw'); if(hw) hw.classList.toggle('nb2648-off', talk);
    var pc = document.getElementById('gxPlanC');
    if(pc){ [].slice.call(pc.querySelectorAll('button')).forEach(function(b){ if(/^(Start the next unit|Reading aloud)$/.test(txt(b))) b.classList.toggle('nb2648-off', talk); });
      if(!pc.querySelector('.nb2648-t')) pc.insertAdjacentHTML('afterbegin', [["Continue today's topic: ", "Continue today's topic"], ['New topic: ', 'New topic: …'], ["Use today's new words in a short story. ", "Use today's new words in a story"]].map(function(x){ return '<button type="button" class="nb2648-t" data-t="' + E(x[0]) + '" onclick="gxIns(\\'nN\\',this.dataset.t)">' + E(x[1]) + '</button>'; }).join(''));
      [].slice.call(pc.querySelectorAll('.nb2648-t')).forEach(function(b){ b.classList.toggle('nb2648-off', !talk); }); }
    var h1 = document.getElementById('nH'), hc = h1 && h1.parentElement ? [].slice.call(h1.parentElement.querySelectorAll('.gx-c')).find(function(c){ return /Read aloud 5 min/.test(c.textContent); }) : null;
    if(hc){ [].slice.call(hc.querySelectorAll('button')).forEach(function(b){ if(/^Workbook p\\./.test(txt(b))) b.classList.toggle('nb2648-off', talk); });
      if(!hc.querySelector('.nb2648-t')) hc.insertAdjacentHTML('afterbegin', '<button type="button" class="nb2648-t" data-t="Prepare 3 ideas for the next topic: " onclick="gxIns(\\'nH\\',this.dataset.t)">Prepare 3 ideas for the next topic</button>');
      [].slice.call(hc.querySelectorAll('.nb2648-t')).forEach(function(b){ b.classList.toggle('nb2648-off', !talk); }); }
    var l = document.getElementById('nb2648l');
    if(!l){ box.insertAdjacentHTML('beforeend', '<button type="button" id="nb2648l" class="nb2648-l"></button>'); l = document.getElementById('nb2648l'); }
    l.textContent = talk ? '+ Add book pages' : 'No book today';
    l.onclick = function(){ try{ localStorage.setItem(KEY(code), talk ? 'book' : 'talk'); }catch(e){} apply(code, !talk); };
  }
  window.nb2648 = apply;
  var _ns = window.noteSheet; if(typeof _ns !== 'function') return;
  window.noteSheet = function(code){ var r = _ns.apply(this, arguments);
    try{ var go = function(){ if(document.getElementById('epBox')) apply(code, isTalk(code)); }; go(); setTimeout(go, 400); setTimeout(go, 1500); }catch(e){ console.warn('2648', e); }
    return r; };
})();
</script>
</body>`;
const fs = require('fs'); let h = fs.readFileSync(file, 'utf8');
if (h.includes('id="b2648"')) throw new Error('already');
const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + JS + h.slice(i + 7);
fs.writeFileSync(file, h);
require('../tools/lib.js')(file, []);
