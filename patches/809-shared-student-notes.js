// 809: (Misty) "for SHARED STUDENTS like ELEVEN, not only video upload is affected, even CLASS NOTES, AND HOMEWORK"
// Eleven has Julia (ShortVowels 19:30) and Kat (OD1 20:00) on the same day. The app kept ONE "last class note" per student:
// · Kat's class card showed Julia's note (ShortVowels p. 26) as "Last class", and Kat's own note for her class looked missing
//   (the note on record was Julia's, for Julia's class);
// · Kat's new note was pre-filled from Julia's book; the homework "next pages" mixed both books.
// Now (coe-notes, database):
// · each class card shows the note written for THAT class; "Last class" and the pre-filled note are the teacher's OWN last note
//   for the student (another teacher's note only when this teacher has none);
// · homework "next pages" come from the teacher's own notes for the student.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["const n = s.note, ci = (D.classIns||{})[c.id];", "const n = (s.notesEv && s.notesEv[c.id]) || s.note, ci = (D.classIns||{})[c.id];"],
  ["const s = (D.students||[]).find(x => x.code === c.code) || {}, n = s.note, hw", "const s = (D.students||[]).find(x => x.code === c.code) || {}, n = (s.notesEv && s.notesEv[c.id]) || s.note, hw"],
  ["at: now.toTimeString().slice(0,5), pending: true };", "at: now.toTimeString().slice(0,5), pending: true }; try{ if(eventId) (s.notesEv = s.notesEv || {})[eventId] = s.note; }catch(e){}"],
  ["function paintHw(code, notes){ const box = $('hwPrev'); if(!box) return; const today = D.today;",
   "function paintHw(code, notes){ const box = $('hwPrev'); if(!box) return; const today = D.today; try{ const me0 = String((D.me || {}).name || '').trim().toLowerCase(), mine = (notes || []).filter(x => String(x.teacher || x.by || '').trim().toLowerCase() === me0); if(mine.length) notes = mine; }catch(e){}"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 809 · shared students: own notes per teacher, one note per class */
(function(){
  if(window.__809) return; window.__809 = 1;
  let AT = 0, BUSY = 0;
  async function load(force){ if(typeof D === 'undefined' || !D || D.mgr || !TOKEN || BUSY) return; if(!force && Date.now() - AT < 3 * 6e4) return;
    const L = (D.students || []).map(x => x.code).filter(Boolean); if(!L.length) return; BUSY = 1; AT = Date.now();
    try{ const r = await fetch(FAST_URL + '-notes', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, codes: L }) }).then(x => x.json());
      if(r && r.ok && r.notes){ let ch = 0; const me0 = String((D.me || {}).name || '').trim().toLowerCase();
        (D.students || []).forEach(st => { const n = r.notes[st.code]; if(!n) return;
          const ev = Object.assign({}, n.ev || {}, Object.fromEntries(Object.entries(st.notesEv || {}).filter(([k, v]) => v && v.pending)));
          if(JSON.stringify(ev) !== JSON.stringify(st.notesEv || {})){ st.notesEv = ev; ch = 1; }
          const cur = st.note || null, curMine = cur && String(cur.by || '').trim().toLowerCase() === me0;
          if(n.mine && !(cur && cur.pending) && (!curMine || (n.mine.date + n.mine.at) > ((cur.date || '') + (cur.at || '')))){ if(JSON.stringify(n.mine) !== JSON.stringify(cur)){ st.note = n.mine; ch = 1; } } });
        if(ch){ try{ store('set', KEY_D, JSON.stringify(D)); }catch(e){} try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') renderToday(); }catch(e){} } } }catch(e){}
    BUSY = 0; }
  window.notesShared = load;
  const _r = window.render; if(typeof _r === 'function') window.render = function(){ const x = _r.apply(this, arguments); setTimeout(() => load(false), 300); return x; };
  setTimeout(() => load(true), 3000);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
