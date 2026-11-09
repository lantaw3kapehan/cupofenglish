// 2020 (9 Nov 17:51, Misty: the chat list "can it be hidden too, so we have bigger and wider space for chat? find the best-fitting
//   workaround"): everyone's Team Chat on a laptop. A small panel button at the left of the chat header hides or shows the chat list;
//   the conversation then uses the full width. While the list is hidden, the button shows how many unread messages wait in other chats.
//   The choice is remembered on that device. Phones are unchanged (they already show the list and the chat on separate screens).
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "var head = '<div class=\"ch-hd\"><button type=\"button\" class=\"ch-ib ch-back\" aria-label=\"Back to chats\" onclick=\"chat1400.list()\">' + I.back + '</button>",
  "var head = '<div class=\"ch-hd\"><button type=\"button\" class=\"ch-ib ch-back\" aria-label=\"Back to chats\" onclick=\"chat1400.list()\">' + I.back + '</button>' + (function(){ var un = (S.init.groups || []).reduce(function(a, x){ return a + (x.id !== S.gid ? (x.unread || 0) : 0); }, 0); return '<button type=\"button\" class=\"ch-ib9 ch-sdt9\" aria-label=\"' + (S.side9 ? 'Show' : 'Hide') + ' the chat list\" title=\"' + (S.side9 ? 'Show' : 'Hide') + ' the chat list\" aria-pressed=\"' + !S.side9 + '\" onclick=\"chat1400.side9()\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M9 4v16\"/></svg>' + (S.side9 && un ? '<span class=\"ch-sdn9\">' + (un > 99 ? '99+' : un) + '</span>' : '') + '</button>'; })() + '"
 ],
 [
  "+ (srv ? ' srv' : '') + (isMgr() ? '' : ' tch');",
  "+ (srv ? ' srv' : '') + (isMgr() ? '' : ' tch') + (S.side9 ? ' side9' : '');   /* 2020 */"
 ],
 [
  "    m2009: function(k){",
  "    side9: function(){ S.side9 = !S.side9; try{ localStorage.setItem('coe.chatSide9', S.side9 ? '1' : '0'); }catch(e){} render(true); },   /* 2020 */\n    m2009: function(k){"
 ],
 [
  "  var E9 = {};",
  "  var E9 = {}; try{ S.side9 = localStorage.getItem('coe.chatSide9') === '1'; }catch(e){}   /* 2020: chat list hidden (remembered on this device) */"
 ],
 [
  "<style id=\"css2018\">",
  "<style id=\"css2020\">\n/* 2020 · laptop: hide or show the chat list for a wider conversation (button at the left of the chat header; remembered on this device) */\n#v-chat .ch-sdt9{position:relative;margin-right:4px}\n#v-chat .ch-sdn9{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#2B7F80;color:#fff;font:600 11px/18px Inter,system-ui,sans-serif;text-align:center}\n@media (min-width:761px){\n  #v-chat .ch.side9 .ch-side{display:none!important}\n  #v-chat .ch.side9{grid-template-columns:minmax(0,1fr)!important}\n  #v-chat .ch.side9.mem:not(.nomem){grid-template-columns:minmax(0,1fr) 260px!important}\n}\n@media (max-width:760px){#v-chat .ch-sdt9{display:none}}\n</style>\n<style id=\"css2018\">"
 ]
]);
