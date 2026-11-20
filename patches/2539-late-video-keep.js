// 2539 (Misty 17:58 "if we leave it, it still shows · add some options"): a late class video case on To do › Class videos has
//   "Keep ₱200" next to Waive: the penalty stands (12:00 midnight rule), the case is marked reviewed for all of management
//   (coe-ops ok ref vidkeep:<case>, coe-cases v6 returns kept) and leaves the list. Each case also shows when it was due and when it came in.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["&& c.amount && !/^Waived/.test(c.action || '') && new RegExp('-' + mo + '-' + yr + '$').test(c.when || ''));",
   "&& c.amount && !c.kept && !/^Waived/.test(c.action || '') && new RegExp('-' + mo + '-' + yr + '$').test(c.when || ''));"],
  ["' · <b>' + esc(c.amount) + '</b></span><button class=\"btn sm ghost\" onclick=\"event.stopPropagation();cw1917(\\'' + esc(c.id) + '\\')\">Waive</button></div>').join('')",
   "' · <b>' + esc(c.amount) + '</b>' + (function(m){ return m ? '<br><span class=\"mute\">Due ' + esc(m[1]) + ' · came in ' + esc(m[2]) + '</span>' : ''; })(String(c.action || '').match(/due (\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}) · uploaded in the app (\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2})/)) + '</span><button class=\"btn sm\" title=\"The penalty stands. Marks the case reviewed and takes it off this list.\" onclick=\"event.stopPropagation();vk2539(\\'' + esc(c.id) + '\\',this)\">Keep ' + esc(c.amount) + '</button><button class=\"btn sm ghost\" onclick=\"event.stopPropagation();cw1917(\\'' + esc(c.id) + '\\')\">Waive</button></div>').join('')"],
  ["window.cw1917 = async id => {",
   "window.vk2539 = async (id, btn) => { const c = CS1917.find(x => x.id === id); if(!c) return; if(!confirm('Keep ' + id + ' (' + c.employee + ', ' + c.amount + ')?\\n\\nThe penalty stands and the case leaves this list.')) return; if(btn){ btn.disabled = true; btn.textContent = 'Saving…'; }\n    try{ const r = await fetch(FAST_URL + '-ops', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'ok', ref: 'vidkeep:' + id }) }).then(x => x.json()); if(!r || !r.ok) throw 0;\n      c.kept = true; try{ card(); }catch(e){} toast('✓ Kept · ' + id + ' · ' + c.amount + ' stands'); }catch(e){ if(btn){ btn.disabled = false; btn.textContent = 'Keep ' + c.amount; } toast('Not saved. Try again.'); } };\n  window.cw1917 = async id => {"]
]);
