// 1104: (Misty, 26 Oct 12:00) teacher Today as the main workspace · stage B.
// Today is arranged in the order a teacher works (the same boxes and buttons, moved — nothing is rebuilt or removed):
//   1 · greeting line, then URGENT only: notice of breach, management comments that need action
//   2 · NOW & NEXT: the class happening now and the next class, side by side on a laptop, each with its own card
//       (time, length, student, book, last lesson → next focus, I'm in, Class brief, Class note, Book, homework, video)
//       and a label: "Now · ends 14:05" / "Next · 16:00 · in 2 h 20 min" / "Next · opens for time-in at 15:55"
//   3 · NEEDS YOUR ACTION: late time-in review, signatures, "management is waiting", video checks, my class videos
//   4 · the day at a glance, then the rest of today's classes (earlier classes with unfinished notes / homework / videos
//       keep their checklist), time-in and the to-do list
// When no class is on now, the next class leads; when today is finished the section is not shown.
// Cards keep working exactly as before (drag-and-drop video upload, drafts, statuses) — they are only placed higher.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = `
#v-today .nn1104{margin:14px 0 18px}
#v-today .nn1104>.nn-h{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:0 0 10px}
#v-today .nn1104>.nn-h h2{margin:0}
#v-today .nn1104>.nn-h .small{color:#5E5A76}
#v-today .nn1104 .nn-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,430px),1fr));gap:14px;align-items:start}
#v-today .nn1104 .nn-i{min-width:0}
#v-today .nn1104 .nn-t{display:inline-flex;align-items:center;gap:6px;font-size:.8125rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#00575F;background:#E3F4F5;border-radius:999px;padding:3px 10px;margin:0 0 6px 2px}
#v-today .nn1104 .nn-t.nx{color:#3A3556;background:#F0EEF5}
#v-today .nn1104 .nn-t i{width:8px;height:8px;border-radius:50%;background:#00707A;display:inline-block}
#v-today .nn1104 .nn-t.nx i{background:#8C88A3}
#v-today .nn1104 .cls{margin:0!important;box-shadow:0 1px 2px rgba(43,36,80,.06),0 8px 22px -14px rgba(43,36,80,.28)!important;border:1px solid #E7E5EE!important}
#v-today .nn1104 .cls.now{border-color:#8CC5CA!important;box-shadow:0 0 0 1px #8CC5CA,0 8px 22px -14px rgba(0,112,122,.45)!important}
#v-today .td1104{margin:6px 0 18px}
#v-today .td1104>h2{margin:0 0 10px}
#v-today .td1104>*+*{margin-top:10px!important}
#v-today .lt1104{margin:18px 0 8px}
`;
const js = String.raw`
(function(){
  if(window.__1104) return; window.__1104 = 1;
  var hm = function(t){ var m = String(t || '').match(/(\d{1,2}):(\d{2})/); return m ? (+m[1]) * 60 + (+m[2]) : null; };
  var two = function(n){ return (n < 10 ? '0' : '') + n; };
  var span = function(min){ if(min < 60) return min + ' min'; var h = Math.floor(min / 60), r = min % 60; return h + ' h' + (r ? ' ' + r + ' min' : ''); };
  var nowMin = function(){ var d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
  function arrange(){ try{
    if(typeof D === 'undefined' || !D || D.mgr) return; var v = document.getElementById('v-today'); if(!v) return;
    var q = function(sel){ return v.querySelector(':scope>' + sel); }, qa = function(sel){ return [].slice.call(v.querySelectorAll(':scope>' + sel)); };
    var lead = q('.lead'), cols = q('.tcols'); if(!lead) return;   /* laptop: two columns (.tcols); narrow windows: one column */
    var nn = q('.nn1104'), td = q('.td1104');
    if(!nn && !td){
      var c0 = (cols || v).querySelector('.cls'), list = c0 ? c0.parentElement : null, cards = list ? [].slice.call(list.querySelectorAll(':scope>.cls')) : [];
      var live = cards.filter(function(c){ return !c.classList.contains('x') && !/cancel/i.test(c.className); });
      var tOf = function(c){ var b = c.querySelector('.t b, .t .num'); return hm(b && b.textContent); }, lenOf = function(c){ var sp = c.querySelector('.t span'); var m = sp && String(sp.textContent).match(/(\d+)\s*min/); return m ? +m[1] : 25; };
      var n = nowMin(), cur = live.find(function(c){ return c.classList.contains('now'); }) || null;
      var nxt = live.find(function(c){ var t = tOf(c); return c !== cur && t != null && t > n; }) || null;
      if(cur || nxt){ nn = document.createElement('section'); nn.className = 'nn1104'; nn.setAttribute('aria-label', 'Now and next');
        var nm = function(c){ var e = c.querySelector('.nm'); return e ? e.textContent.replace('›', '').trim() : ''; };
        nn.innerHTML = '<div class="nn-h"><h2>' + (cur ? 'Now &amp; next' : 'Next class') + '</h2><span class="small">' + (cur && nxt ? 'then ' + esc(nm(nxt) || 'the next class') + ' at ' + two(Math.floor(tOf(nxt) / 60)) + ':' + two(tOf(nxt) % 60) : cur ? 'your last class today' : '') + '</span></div><div class="nn-g"></div>';
        var g = nn.querySelector('.nn-g');
        [cur, nxt].forEach(function(c){ if(!c) return; var w = document.createElement('div'); w.className = 'nn-i'; var t = tOf(c), L = lenOf(c), lab;
          if(c === cur){ var end = t + L; lab = '<span class="nn-t"><i></i>Now · ends ' + two(Math.floor(end / 60) % 24) + ':' + two(end % 60) + '</span>'; }
          else { var dm = t - n; lab = '<span class="nn-t nx"><i></i>Next · ' + two(Math.floor(t / 60)) + ':' + two(t % 60) + (dm > 0 ? ' · in ' + span(dm) : '') + '</span>'; }
          w.innerHTML = lab; w.appendChild(c); g.appendChild(w); });
        var h = cols ? cols.querySelector('.tcol-main>h2') : (list && list.previousElementSibling && list.previousElementSibling.tagName === 'H2' ? list.previousElementSibling : null); if(h && /today/i.test(h.textContent)) h.textContent = 'Rest of today'; }
      td = document.createElement('section'); td.className = 'td1104'; td.setAttribute('aria-label', 'Needs your action'); td.innerHTML = '<h2>Needs your action</h2>';
      lead.after(td); if(nn) lead.after(nn); }
    /* urgent right after the greeting; action items into "Needs your action"; the day before the class list (runs again when boxes arrive later) */
    /* move only what is out of place (moving triggers the observer again) */
    var ref = lead; qa('.ct-ban.nt-ban').concat([q('#ftBox')]).forEach(function(x){ if(!x) return; if(ref.nextElementSibling !== x) ref.after(x); ref = x; });
    if(nn && nn.previousElementSibling !== ref) ref.after(nn);
    var want = []; ['#txLate', '.ct-ban:not(.nt-ban)', '#mustBox', '#vcBox', '#vidMine'].forEach(function(sel){ [].forEach.call(v.querySelectorAll(':scope>' + sel + ', :scope>.td1104>' + sel), function(x){ want.push(x); }); });
    var have = [].slice.call(td.children, 1); if(want.length !== have.length || want.some(function(x, k){ return have[k] !== x; })) want.forEach(function(x){ td.appendChild(x); });
    var dsp = want.length ? '' : 'none'; if(td.style.display !== dsp) td.style.display = dsp;
    var day = q('.yd92'); if(day){ if(cols){ if(day.nextElementSibling !== cols) cols.before(day); } else if(day.previousElementSibling !== td) td.after(day); }
    var anchorTd = nn || ref; if(td.previousElementSibling !== anchorTd) anchorTd.after(td);
  }catch(e){ console.warn('1104', e); } }
  var t = 0, later = function(){ clearTimeout(t); t = setTimeout(arrange, 30); };
  ['renderToday', 'render', 'go'].forEach(function(nm){ var f = window[nm]; if(typeof f !== 'function') return; window[nm] = function(){ var r = f.apply(this, arguments); later(); return r; }; });
  var v = document.getElementById('v-today'); if(v) new MutationObserver(function(){ later(); }).observe(v, { childList: true });
  setTimeout(arrange, 1200);
})();
`;
s = s.slice(0, i) + '<style id="d1104">/* 1104 · teacher Today workspace */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
