// 1482 · Teacher QA (28 Oct 2026): line icons instead of emojis in the app's own teacher text; phone tap targets; side menu label
// 1. Emojis in app text → the app's line icons (same colours as the text): Class sound (🔔/🔕), My class videos (🎬), drag-and-drop
//    video tip (🎬), Last homework (📚), class note chip (💬), monthly feedback draft (✨), video check flags (⚠), homework warning (⚠),
//    notice of breach (⚠), management comments warning heading (⚠/⛔). Emojis typed by people (messages, chat, parent templates) stay.
// 2. Phone: the class card line "ST-… · phone · Edit ID" wraps instead of cutting "Edit ID" off; inline links on class cards,
//    Students and Schedule get a taller tap area without moving the layout.
// 3. Phone / narrow bottom bar: the Notices & requests tab had an icon and badge but no label; it now reads "Notices".
// 4. Laptop side menu: "Notices & requests" (two lines) is left-aligned like the other items.
// Display only.
const fs = require('fs'), file = process.argv[2];
const I = k => "(window.i1482 ? i1482('" + k + "') : '')";
require('../tools/lib.js')(file, [
  ["'🔔 Class sound on · first class 15 min before · never during a class' : '🔕 Class sound off'",
   I('bell') + " + 'Class sound on · first class 15 min before · never during a class' : " + I('belloff') + " + 'Class sound off'"],
  ['<span class="chip teal">💬 Class note</span>', '<span class="chip teal">Class note</span>'],
  ['color:#4A4860">📚 <b>Last homework:</b>', "color:#4A4860\">' + " + I('book') + " + '<b>Last homework:</b>"],
  ['<b class="grow">🎬 My class videos</b>', "<b class=\"grow\">' + " + I('video') + " + 'My class videos</b>"],
  ['<span style="font-size:22px">🎬</span>', "<span style=\"font-size:22px;color:#00737B\">' + " + I('video') + " + '</span>"],
  ["fbRedo()\">✨ ' + (FBS._draft ? 'Redo from my notes' : 'Draft from my notes')", "fbRedo()\">' + (FBS._draft ? 'Redo from my notes' : 'Draft from my notes')"],
  ["bt.textContent = '✨ Redo from my notes'", "bt.textContent = 'Redo from my notes'"],
  ['<div class="fb-tag">✨ <b>Drafted', "<div class=\"fb-tag\">' + " + I('spark') + " + '<b>Drafted"],
  ["w ? '<b style=\"color:#D93F2B\">⚠ ' + esc(w.msg)", "w ? '<b style=\"color:#D93F2B\">' + " + I('warn') + " + esc(w.msg)"],
  ['<span style="color:#B4442F;font-size:20px" aria-hidden="true">⚠</span>', "<span style=\"color:#B4442F;font-size:20px\" aria-hidden=\"true\">' + " + I('warn') + " + '</span>"],
  ["R.level >= 3 ? '⛔ Final warning · management has been told' : '⚠ Warning · management’s comments need action'",
   "R.level >= 3 ? " + I('stop') + " + 'Final warning · management has been told' : " + I('warn') + " + 'Warning · management’s comments need action'"],
  ["b.innerHTML = '<span class=\"nlL\">Notices &amp; requests</span>';", "b.innerHTML = '<span class=\"nlL\">Notices &amp; requests</span><span class=\"nlS\">Notices</span>';"]
]);
let s = fs.readFileSync(file, 'utf8');
const early = (code) => { const A = 'const msgAt = s => {'; if (s.split(A).length !== 2) { console.error('msgAt anchor not found once'); process.exit(1); } s = s.replace(A, () => code + '\n' + A); };
early(String.raw`window.i1482 = function(k){ var P = { bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>', belloff: '<path d="M13.7 21a2 2 0 0 1-3.4 0M18.6 13A17.9 17.9 0 0 1 18 8M6.3 6.3A6 6 0 0 0 6 8c0 7-3 9-3 9h14M18 8a6 6 0 0 0-9.3-5M3 3l18 18"/>', video: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="M15.5 10.5l6-3.5v10l-6-3.5z"/>', book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>', spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>', warn: '<path d="M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>', stop: '<circle cx="12" cy="12" r="9"/><path d="M5.7 5.7l12.6 12.6"/>' }; if(!P[k]) return ''; return '<svg class="i1482" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[k] + '</svg>'; };`);
const all = (a, b, n) => { const c = s.split(a).length - 1; if (c !== n) { console.error('Expected ' + n + ' matches, found ' + c + ' for: ' + a); process.exit(1); } s = s.split(a).join(b); };
all("x.flags.map(f => '⚠ ' + esc(f.t))", "x.flags.map(f => " + I('warn') + " + esc(f.t))", 3);
all("toast('✨ Drafted from your class notes · read and adjust')", "toast('Drafted from your class notes · read and adjust')", 2);
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="css1482">
/* 1482 · teacher line icons, phone tap areas, side menu label */
.i1482{display:inline-block!important;width:1.05em;height:1.05em;vertical-align:-.17em;margin-right:5px;flex:none}
.fb-tag .i1482{color:#00737B}
#v-today #ftBox h3{flex-wrap:nowrap}
#v-today #ftBox h3>.i1482{align-self:flex-start;margin-top:.15em}
@media (max-width:640px){
  #v-today .cls .small.ell:has(a.link[onclick^="meetSheet"]){white-space:normal;overflow:visible;text-overflow:clip}
  #v-today .cls a.link[role=button], #v-students a.link, #v-tsched .why{display:inline-block;padding:9px 2px;margin:-9px 0}
}
@media (min-width:900px){ #navIn button[data-v=tinbox] .nl{text-align:left} }
</style>
<script>
/* 1482 · line icons (stroke = text colour) */

</script>
` + s.slice(i);
fs.writeFileSync(file, s);
