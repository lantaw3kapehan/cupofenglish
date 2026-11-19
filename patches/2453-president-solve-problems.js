// 2453 (Misty 17:06 "I want to see problems easily so they will be solved instantly") · on the President's "From Operations" card the
//   problems Celine found today are listed first with one tap each: "Solved" (she sees "Solved by Management" in her day) · a problem
//   she later cleared, skipped or fixed herself leaves the list; the same item marked twice shows once.
const file = process.argv[2];
const OLD = "(function(){ var P = ((d.log) || []).filter(function(l){ return l.kind === 'problem' || l.kind === 'still'; });   /* 2452 */";
const NEW = "(function(){ var LG = (d.log) || [], seen = {}, P = LG.filter(function(l, i){ if(l.kind !== 'problem' && l.kind !== 'still') return false;   /* 2452 · 2453 */\n" +
"        if(LG.some(function(y){ return y.kind === 'resolved' && y.ref === 'log:' + l.id; })) return false;\n" +
"        if(l.ref){ if(seen[l.ref]) return false; seen[l.ref] = 1; if(LG.slice(0, i).some(function(y){ return y.ref === l.ref && /^(skip|match|fixed|cleared|done)$/.test(y.kind); })) return false; if(LG.some(function(y){ return y.kind === 'resolved' && LG.some(function(z){ return z.ref === l.ref && y.ref === 'log:' + z.id; }); })) return false; }\n" +
"        return true; });";
const OLDROW = "'<div class=\"pr\"><span class=\"t\">' + E(l.at) + '</span><span><span class=\"lb\">' + (l.kind === 'still' ? 'Not cleared yet' : 'Problem found') + '</span>' + E(l.title || '') + (l.note ? '<div class=\"small mute\" style=\"margin-top:2px\">' + E(l.note) + '</div>' : '') + '</span></div>'";
const NEWROW = "'<div class=\"pr\"><span class=\"t\">' + E(l.at) + '</span><span><span class=\"lb\">' + (l.kind === 'still' ? 'Not cleared yet' : 'Problem found') + '</span>' + E(l.title || '') + (l.note ? '<div class=\"small mute\" style=\"margin-top:2px\">' + E(l.note) + '</div>' : '') + '</span><button class=\"btn teal sm\" onclick=\"psol2453(' + (+l.id) + ',this)\">Solved</button></div>'";
const FN = "window.psol2453 = function(id, el){ if(el){ el.disabled = true; el.textContent = 'Saving…'; }   /* 2453 */\n" +
"    call({ op: 'resolve', lid: id, who: (PD && PD.who) || '' }).then(function(r){ if(!r || !r.ok){ if(el){ el.disabled = false; el.textContent = 'Solved'; } return say((r && r.error) || 'Not saved. Try again.'); }\n" +
"      var row = el && el.closest('.pr'); if(row) row.remove(); say('Solved ✓ · she sees it in her day'); pload(true); }).catch(function(){ if(el){ el.disabled = false; el.textContent = 'Solved'; } say('Not saved. Try again.'); }); };\n  window.pans2360 =";
require('../tools/lib.js')(file, [
  [OLD, NEW], [OLDROW, NEWROW], ["window.pans2360 =", FN],
  ["messaging: 'Messaging parents', skip: 'Not a problem', done: 'Done' }", "messaging: 'Messaging parents', skip: 'Not a problem', done: 'Done', resolved: 'Solved by Management' }"],
  ["messaging: ['Messaging parents', 'b'], skip: ['Not a problem', 'n'], done: ['Done', 'g'] }", "messaging: ['Messaging parents', 'b'], skip: ['Not a problem', 'n'], done: ['Done', 'g'], resolved: ['Solved by Management', 'g'] }"],
  ['<script id="b2278">', '<style id="u2453">.p2452 .pr{grid-template-columns:48px 1fr auto!important;align-items:start}.p2452 .pr .btn{white-space:nowrap}</style>\n<script id="b2278">']
]);
