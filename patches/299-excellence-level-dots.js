// 19 Oct · 299 · Teacher Excellence: the level is shown with a plain coloured dot, not the 🥇🥈🥉 medals — the silver medal shows a "2",
// which read as 2nd place next to "5th place". The medals stay only on the Top 3, where the number is the place.
const dot = c => `<span style="display:inline-block;width:.78em;height:.78em;border-radius:50%;background:${c};box-shadow:inset 0 -2px 0 rgba(0,0,0,.12);vertical-align:-.06em"></span>`;
require('../tools/lib.js')(process.argv[2], [
  ["const MED = { Gold: '🥇', Silver: '🥈', Bronze: '🥉', Developing: '🌱' };",
   "const MED = { Gold: '" + dot('#d4a017') + "', Silver: '" + dot('#8f9bab') + "', Bronze: '" + dot('#c98a4b') + "', Developing: '" + dot('#9aa5b1') + "' };"]]);
