// 2403 (Misty 19 Nov 11:36: "minimal, straightforward, effective and targeted") · on the Trials list the dots line no longer repeats a
//   "Next" when the row already shows its Next step (follow-up line); it is just the dots + "N of 10", a Next only when the row has none,
//   and the red note only when something is wrong. Smaller and quieter, in the row's own grey.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["+ (st.nx ? ' · Next: ' + E(st.nx.title) : ' · all done') + (warn ?",
   "+ (row.querySelector('.nx61') ? '' : st.nx ? ' · Next: ' + E(st.nx.title) : ' · all done ✓') + (warn ?"],
  ["'.st01l{font-size:13px;color:#2B2253;margin-top:5px}.st01l .w{color:#C0492F;font-weight:700}'",
   "'.st01l{font-size:12.5px;color:#6B6880;margin-top:4px}.st01l b{color:#2B2253;font-weight:600}.st01l .w{color:#C0492F;font-weight:600}.st01d i{width:7px;height:7px}'"]
]);
