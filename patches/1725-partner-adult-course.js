// 1725: (Misty, 3 Nov 22:44) Becky ST-2026-129 (Dr. Spring, Business English, no birthday on file) was enrolled with Partner
//   "Jinan - Ms. Spring" → SALES priced her as a young learner (¥825) instead of the adult price (¥900, label "Adults - Ms. Spring").
//   1714 only knew "adult" from the age. Now a Business / Daily English / Adult course (typed in Course or booked in the calendar)
//   also counts as adult, and changing Course re-picks the partner label while it was still the automatic one.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const adultOf = code => { try{ const a = window.coeAge ? coeAge(code) : null; return !!(a && a.age != null && a.age !== '' && +a.age >= 18); }catch(e){ return false; } };",
   "const adultOf = code => { try{ const a = window.coeAge ? coeAge(code) : null; if(a && a.age != null && a.age !== '' && +a.age >= 18) return true; }catch(e){}\n" +
   "      try{ const AC = /business|daily\\s*english|adult/i, c1 = (document.getElementById('enC') || {}).value || '', S = typeof ENS !== 'undefined' && ENS && String(ENS.code || '').toUpperCase() === up(code) ? ENS : null;   /* 1725: an adult course counts as adult */\n" +
   "        if(AC.test(c1)) return true; if(S && (S.cls || []).some(c => AC.test(String(c.book || '')))) return true; }catch(e){} return false; };"],
  ["    const _en1714 = window.enSheet; if(typeof _en1714 === 'function') window.enSheet = function(code){ const r = _en1714.apply(this, arguments); try{ setPa('enPa', code); }catch(e){} return r; };",
   "    const _en1714 = window.enSheet; if(typeof _en1714 === 'function') window.enSheet = function(code){ const r = _en1714.apply(this, arguments); try{ setPa('enPa', code); }catch(e){} return r; };\n" +
   "    document.addEventListener('change', e => { try{ const t = e.target; if(!t || !/^enC/.test(t.id || '')) return; const el = document.getElementById('enPa'); if(!el || !el.dataset.auto1714 || el.value !== el.dataset.auto1714 || typeof ENS === 'undefined' || !ENS) return; setTimeout(() => { try{ setPa('enPa', ENS.code); }catch(x){} }, 50); }catch(x){} }, true);   /* 1725 */"]
]);
