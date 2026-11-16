// 2289 (Teacher Kat 16 Nov 21:27, Misty): "Wala pong Meeting ID sa part ko" — the Schedule rows cut the "+ Meeting ID" link off
// (the row is one line with an ellipsis, so on a phone or narrow window the link was hidden). The link now sits on its own line
// as a clear button under the student, in the list and in the day panel, so a teacher can add or change the ID for any day ahead.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ['<style id="d2238">#v-tsched a.m38{margin-left:6px;font-size:12.5px;font-weight:600;color:#00737B;cursor:pointer;white-space:nowrap}#v-tsched a.m38.add{color:#B5531F}</style>',
  '<style id="d2238">#v-tsched a.m38{margin-left:6px;font-size:12.5px;font-weight:600;color:#00737B;cursor:pointer;white-space:nowrap}#v-tsched a.m38.add{color:#B5531F}' +
  '#v-tsched .sv-n:has(a.m38){white-space:normal}#v-tsched .sv-n:has(a.m38) > b{white-space:nowrap}' +
  '#v-tsched a.m38{display:flex;width:max-content;max-width:100%;align-items:center;gap:6px;margin:6px 0 2px;padding:5px 12px;border-radius:999px;background:#E8F3F3;line-height:1.2;text-decoration:none}' +
  '#v-tsched a.m38.add{background:#FCEFE6}#v-tsched a.m38:active{transform:scale(.97)}' +
  '#v-tsched .dd36 .r .s{flex-wrap:wrap}#v-tsched .dd36 .r .s a.m38{flex-basis:auto;margin:4px 0 0 18px}#v-tsched .dd36 .r .s b{max-width:calc(100% - 18px)}</style>'],
]);
