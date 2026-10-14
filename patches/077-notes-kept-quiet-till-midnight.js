// 14 Oct · teacher feedback:
// 1) Class notes vanished when a teacher pressed Back (or tapped outside the card) by accident.
//    Now every keystroke is kept on the phone (coe.nd:CODE:DAY) and comes back when the note is reopened,
//    the phone's Back button closes the open card instead of leaving the app, and closing shows "kept on this phone".
// 2) Trial classes run late: the app could reload itself for a new version at 22:00 in the middle of a trial report.
//    Updates now wait until midnight (quiet 16:00–23:59).
require('../tools/lib.js')(process.argv[2], [
// 1a · keep the note as it is typed
["NUPD = !!mine; nReady(); setTimeout(()=>{ const o = $('nO'); if(o && !o.value) o.focus(); }, 250);",
 "NUPD = !!mine; nReady(); setTimeout(()=>{ const o = $('nO'); if(o && !o.value) o.focus(); }, 250);\n" +
 "NKEEP = { code: code, day: dd, base: JSON.stringify(nNow()) }; const sb = $('sheetBody'); if(sb){ sb.addEventListener('input', nKeep); sb.addEventListener('change', nKeep); sb.addEventListener('click', nKeepClick); }"],
["let NUPD = false, NSAVING = 0;",
 "let NUPD = false, NSAVING = 0, NKEEP = null;\n" +
 "function nNow(){ const v = id => (($(id)||{}).value||'').trim(); return { obs: v('nO'), ended: v('nE'), skills: [...document.querySelectorAll('.skc button.on')].map(b => b.textContent).join(', '), next: v('nN'), homework: ($('nNoH') && $('nNoH').checked) ? 'No homework today' : v('nH') }; }\n" +
 "function nKeepClick(e){ if(e.target && e.target.closest && e.target.closest('.skc')) setTimeout(nKeep, 0); }\n" +
 "function nKeep(){ if(!NKEEP || !$('nO')) return; const n = nNow(), j = JSON.stringify(n); if(j === NKEEP.base) return; NKEEP.dirty = 1; noteDraft(NKEEP.code, NKEEP.day, (n.obs || n.ended || n.next || (n.homework && n.homework !== 'No homework today')) ? Object.assign({ date: NKEEP.day }, n) : null); }   /* 14 Oct: typed notes are never lost */"],
// Save closes the card itself: no "kept" message then (saveNote keeps the note until the server confirms)
["closeSheet(); render(); toast((upd ? 'Updating ' : 'Saving ')",
 "NKEEP = null; closeSheet(); render(); toast((upd ? 'Updating ' : 'Saving ')"],
["<div>Your note was kept on this device · check it and tap Save again</div>",
 "<div>Your note was kept on this phone · check it and tap Save</div>"],
// 1b · closing a card that has an unsaved note says so; Back closes the card instead of leaving the app
["function closeSheet(){ if(SC_PEND){",
 "function closeSheet(){ if(NKEEP){ const k = NKEEP; NKEEP = null; if(k.dirty && noteDraft(k.code, k.day)){ toast('Note kept on this phone · open it and tap Save'); setTimeout(() => { try{ render(); }catch(e){} }, 300); } } if(SC_PEND){"],
["document.addEventListener('keydown', e => { if(e.key==='Escape') closeSheet(); });",
 "document.addEventListener('keydown', e => { if(e.key==='Escape') closeSheet(); });\n" +
 "/* 14 Oct: phone Back button closes the open card (one step), it doesn't leave the app or lose what was typed */\n" +
 "try{ if(!(history.state && history.state.coe)) history.pushState({ coe: 1 }, ''); window.addEventListener('popstate', () => { if($('sheet').classList.contains('on')){ closeSheet(); try{ history.pushState({ coe: 1 }, ''); }catch(e){} } }); const _os = openSheet; openSheet = function(h){ try{ if(!(history.state && history.state.coe)) history.pushState({ coe: 1 }, ''); }catch(e){} return _os.apply(this, arguments); }; }catch(e){}"],
// 2 · no self-reload for a new version from 16:00 until midnight
["const h = new Date().getHours(); return h >= 16 && h < 22; }",
 "const h = new Date().getHours(); return h >= 16; }   /* 14 Oct: quiet until midnight (late trial classes), was 22:00 */"],
]);
