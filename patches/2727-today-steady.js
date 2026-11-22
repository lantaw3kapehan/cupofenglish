// 2727 (Misty 22 Nov 19:06 "the screen still moves and adjusts or flickers"): Teacher Today was rebuilt by the regular background
//   refreshes even when nothing had changed, and every rebuild redraws the cards (the bars, Homework ▾ and other parts arrive a moment
//   later, so the page jumps). Now a rebuild that would show exactly the same thing is skipped: same classes, homework, videos, I'm in,
//   notes, time-in and the same class phase (before / during / after). Anything the teacher does (tap, type) always redraws at once.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`  wrap(); setTimeout(wrap, 1500); setTimeout(wrap, 6000);
})();
</script>
</body>`,
   `  wrap(); setTimeout(wrap, 1500); setTimeout(wrap, 6000);
})();
</script>
<script>
(function(){ if(window.__s2727) return; window.__s2727 = 1;
  let last = '', act = 0; ['pointerdown', 'keydown', 'input'].forEach(e => document.addEventListener(e, () => { act = Date.now(); }, true));
  const sig = () => { try{ if(typeof D === 'undefined' || !D || D.mgr) return ''; const now = Date.now();
      const L = (D.schedule || []).filter(c => c.day === D.today).map(c => { const s = +new Date(c.start), e = +new Date(c.end); return [c.id, c.cancelled, c.meet, c.type, now < s - 40 * 6e4 ? 0 : now < s - 5 * 6e4 ? 1 : now < s ? 2 : now <= e ? 3 : now <= e + 30 * 6e4 ? 4 : 5]; });
      const S = (D.students || []).map(s => [s.code, s.note && (s.note.date + '|' + (s.note.ended || '') + '|' + (s.note.obs || '').length + '|' + (s.note.pending ? 1 : 0))]);
      let drafts = 0; try{ for(let i = 0; i < localStorage.length; i++) if(/draft|nd\\./i.test(localStorage.key(i))) drafts++; }catch(e){}
      return JSON.stringify([D.today, L, D.hw, D.vids, D.vfold, D.classIns, D.timeIn, S, D.notesEv && Object.keys(D.notesEv).length, drafts, (document.getElementById('v-today') || {}).childElementCount]); }catch(e){ return ''; } };
  function wrap(){ const f = window.renderToday; if(!f || f.__s2727) return; const w = function(){ try{ const v = document.getElementById('v-today');
        if(v && v.childElementCount && typeof VIEW !== 'undefined' && VIEW === 'today' && Date.now() - act > 4000 && !(document.getElementById('sheet') || {classList: {contains(){ return false; }}}).classList.contains('on')){
          const s = sig(); if(s && s === last) return; last = s; } else last = sig(); }catch(e){} return f.apply(this, arguments); };
    w.__s2727 = 1; window.renderToday = w; try{ renderToday = w; }catch(e){} }
  setTimeout(wrap, 2000); setTimeout(wrap, 9000); setInterval(wrap, 60000);
})();
</script>
</body>`],
]);
