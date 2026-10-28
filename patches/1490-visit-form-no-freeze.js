// 1490 · "Page Unresponsive" when management opens a live class card (28 Oct 17:16, Misty on #schedule, James 17:00 class).
//   Cause (since 19 Oct, COE_V 658, block "QA next actions" in the class visit form): a document-wide MutationObserver
//   re-ran inject() whenever #mvGo was on screen and no .qn-box existed. inject() adds a .qn-box, asks the database for the
//   teacher's QA next actions, and REMOVES the box when there are none (or the call fails). Removing it is a mutation, so
//   the observer saw "no box" and called inject() again. Once the empty answer was cached, load() resolved as a microtask,
//   so observer → inject → remove → observer never gave the page back: Chrome's "Page Unresponsive". (Answer fails → the
//   same loop paced by the network: ~10 requests a second while the card stays open.) It needs a class whose teacher has no
//   QA next actions this period, e.g. a class taught by Misty herself, so it was rarely hit.
//   Fix:
//   · inject() runs once per visit form (the Save button is marked); an empty or failed answer removes the box for good.
//   Also on the same screen:
//   · "OK" in the quick-QA rating rows (and "Partly" in the follow-up) was squeezed into the app's round 28 px ".o" badge
//     style (class "o" clash): it now has the same size, border and corners as Needs work / Strong.
//   · "Teacher Teacher Julia": tName() already adds "Teacher". Fixed in the schedule reminder chip, "waiting for Teacher …",
//     the Teacher of the Month congratulations and the commendation card.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function inject(){ const go = $('mvGo'), e = window._mvE; if(!go || !e || go.parentNode.querySelector('.qn-box')) return; const t = tOf(e); if(!t) return;",
   "function inject(){ const go = $('mvGo'), e = window._mvE; if(!go || !e || go.dataset.qn1490 || go.parentNode.querySelector('.qn-box')) return; const t = tOf(e); if(!t) return; go.dataset.qn1490 = '1';   /* 1490: once per visit form · an empty answer must not bring the box back (it froze the page) */"],
  ["new MutationObserver(() => { try{ if($('mvGo') && !document.querySelector('#mvGo ~ .qn-box, .qn-box')) inject(); }catch(e){} }).observe(document.body, { childList: true, subtree: true });",
   "new MutationObserver(() => { try{ const g = $('mvGo'); if(g && !g.dataset.qn1490 && !document.querySelector('#mvGo ~ .qn-box, .qn-box')) inject(); }catch(e){} }).observe(document.body, { childList: true, subtree: true });"],
  ["'#monVisit textarea{background:#F8FBFB;border:1.5px solid #E3ECEC;border-radius:12px}",
   "'#monVisit .gx-rv button.o{display:block;width:auto;height:auto;place-items:normal;border-radius:10px;font-size:13px;font-style:normal}' +   /* 1490: not the round 28 px .o badge */\n" +
   "'#monVisit textarea{background:#F8FBFB;border:1.5px solid #E3ECEC;border-radius:12px}"],
  ["'Teacher ' + esc(tName(r.by))) : 'sent'", "esc(tName(r.by))) : 'sent'"],
  ["waiting for Teacher ${esc(tName(e.teacher || ''))}</span>", "waiting for ${esc(tName(e.teacher || ''))}</span>"],
  ["'Congratulations, Teacher ' + esc(tName(w.name)) + '!'", "'Congratulations, ' + esc(tName(w.name)) + '!'"],
  ["const T = n => { try{ return 'Teacher ' + tName(n); }catch(e){ return 'Teacher ' + n; } };", "const T = n => { try{ return tName(n); }catch(e){ return 'Teacher ' + n; } };"],
]);
