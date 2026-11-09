// 2015 (9 Nov 17:18, Misty: "the pin, emojis showing on tap felt a mess, is there a best way to position it somewhere"): management chat.
//   The message tools (react, reply, copy link, edit, pin, hide) appeared over the top of the bubble and covered its first line. They now
//   sit beside the bubble: to the right of other people's messages, to the left of your own; smaller and quieter. On a narrow screen
//   they sit just above the bubble's corner. Teachers' chat unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "<div class=\"ch-body\">' + (tl ? '<div class=\"ch-tools\">' + tl + '</div>' : '') + (cont ? '' : who) + par",
  "<div class=\"ch-body\">' + (tl && !isMgr() ? '<div class=\"ch-tools\">' + tl + '</div>' : '') + (cont ? '' : who) + par"
 ],
 [
  "      + '<div class=\"ch-bub' + (me ? ' me' : '') + (m.hidden ? ' hid' : '') + '\" onclick=\"chat1400.tt(event,' + m.id + ')\">' + inner + '</div>' + rxHtml(m)",
  "      + (isMgr() ? '<div class=\"ch-bw9\">' : '') + '<div class=\"ch-bub' + (me ? ' me' : '') + (m.hidden ? ' hid' : '') + '\" onclick=\"chat1400.tt(event,' + m.id + ')\">' + inner + '</div>' + (isMgr() ? (tl ? '<div class=\"ch-tools ch-t9\">' + tl + '</div>' : '') + '</div>' : '') + rxHtml(m)"
 ],
 [
  "<style id=\"css2010\">",
  "<style id=\"css2015\">\n/* 2015 · management chat: the message tools (react, reply, link, edit, pin, hide) sit beside the bubble, not over its words */\n#v-chat .ch-bw9{position:relative;width:fit-content;max-width:calc(100% - 210px)}   /* room for the tools beside it */\n#v-chat .ch-tools.ch-t9{top:0;right:auto;left:calc(100% + 6px);gap:0;padding:2px;border-radius:10px;box-shadow:0 2px 10px rgba(20,40,40,.08)}\n#v-chat .ch-m.mine .ch-tools.ch-t9{left:auto;right:calc(100% + 6px)}\n#v-chat .ch-tools.ch-t9 .ch-tb{width:30px;height:30px;color:#5E6272}\n#v-chat .ch-tools.ch-t9 .ch-tb svg{width:16px;height:16px}\n@media (max-width:760px){#v-chat .ch-bw9{max-width:100%}#v-chat .ch-tools.ch-t9{top:auto;bottom:calc(100% + 4px);left:auto;right:0}#v-chat .ch-m.mine .ch-tools.ch-t9{right:auto;left:0}}\n</style>\n<style id=\"css2010\">"
 ]
]);
