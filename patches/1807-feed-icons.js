// 1807: (Misty 6 Nov 16:07 "make emojis or emoticons professional") The "New from teachers" card uses line icons in tinted
//   circles instead of emoji: calendar-off (notice filed, coral), undo arrow (withdrawn, amber), speech bubble (message, teal).
const lib = require('../tools/lib.js'), file = process.argv[2];
const SV = p => "'<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">" + p + "</svg>'";
lib(file, [
  ["ic = { leave: '🌴', withdrawn: '↩️', msg: '💬' }",
   "ic = { leave: " + SV('<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M10 13.5l4 4M14 13.5l-4 4"/>')
   + ", withdrawn: " + SV('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>')
   + ", msg: " + SV('<path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19.5l1.5-4.3A7.5 7.5 0 1 1 20 11.5z"/>') + " }"],
  ["<span class=\"fd-i\">' + (ic[x.k] || '•') + '</span>", "<span class=\"fd-i fd-' + esc(x.k) + '\">' + (ic[x.k] || '') + '</span>"],
  [".fd-i{font-size:18px;line-height:1.2}", ".fd-i{flex:none;width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-top:1px}.fd-leave{background:#FDE8E4;color:#B5432B}.fd-withdrawn{background:#FBF1DE;color:#8A5A0F}.fd-msg{background:#E3F2F1;color:#1F6E6A}"],
]);
