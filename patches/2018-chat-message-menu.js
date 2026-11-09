// 2018 (9 Nov 17:32, Misty: the row of six message icons "still showing", wants a better way): management chat.
//   Hovering a message now shows only a small "⋯" beside it; tapping "⋯" opens a short labelled menu (React, Reply, Copy link, Edit,
//   Pin, Hide). Any click closes it; a chat refresh keeps it open (S.m9). Teachers' chat unchanged. Held until after classes (no app restarts during time-in or class).
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "(isMgr() ? (tl ? '<div class=\"ch-tools ch-t9\">' + tl + '</div>' : '') + '</div>' : '')",
  "(isMgr() ? (tl ? '<button type=\"button\" class=\"ch-dot9\" aria-label=\"Message options\" title=\"Message options\" onclick=\"chat1400.dot9(event,' + m.id + ')\"><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"5\" cy=\"12\" r=\"1.8\"/><circle cx=\"12\" cy=\"12\" r=\"1.8\"/><circle cx=\"19\" cy=\"12\" r=\"1.8\"/></svg></button><div class=\"ch-tools ch-t9\" role=\"menu\">' + tl + '</div>' : '') + '</div>' : '')   /* 2018 */"
 ],
 [
  "    m2009: function(k){",
  "    dot9: function(ev, id){ if(ev) ev.stopPropagation(); var el = document.getElementById('chm' + id), on = el && !el.classList.contains('m9');   /* 2018 */\n      S.m9 = on ? id : 0; document.querySelectorAll('#v-chat .ch-m.m9').forEach(function(x){ x.classList.remove('m9'); }); if(el && on) el.classList.add('m9'); },\n    m2009: function(k){"
 ],
 [
  "  document.addEventListener('click', function(ev){ if(S.more9 && !(ev.target.closest && ev.target.closest('.ch-mw9'))){ S.more9 = false; render(true); } });",
  "  document.addEventListener('click', function(ev){ if(S.more9 && !(ev.target.closest && ev.target.closest('.ch-mw9'))){ S.more9 = false; render(true); } });\n  document.addEventListener('click', function(ev){ if(!(ev.target.closest && ev.target.closest('.ch-dot9'))) { S.m9 = 0; document.querySelectorAll('#v-chat .ch-m.m9').forEach(function(x){ x.classList.remove('m9'); }); } }, true);   /* 2018: any click closes the message menu (after its own action runs) */"
 ],
 [
  "<style id=\"css2015\">",
  "<style id=\"css2018\">\n/* 2018 · management chat: one small \"⋯\" beside a message on hover; tapping it opens a short labelled menu (React, Reply, Copy link, Edit, Pin, Hide) */\n#v-chat .ch-dot9{position:absolute;top:4px;left:calc(100% + 6px);width:28px;height:28px;border-radius:50%;border:0;background:transparent;color:#8A8FA3;display:none;place-items:center;cursor:pointer}\n#v-chat .ch-m.mine .ch-dot9{left:auto;right:calc(100% + 6px)}\n#v-chat .ch-m:hover .ch-dot9,#v-chat .ch-m.m9 .ch-dot9,#v-chat .ch-dot9:focus-visible{display:grid}\n#v-chat .ch-dot9:hover,#v-chat .ch-m.m9 .ch-dot9{background:#EEF1F4;color:#2D2A4A}\n#v-chat .ch-m .ch-tools.ch-t9{display:none!important}\n#v-chat .ch-m.m9 .ch-tools.ch-t9{display:flex!important;flex-direction:column;align-items:stretch;top:36px;left:calc(100% + 6px);padding:6px;min-width:170px;border-radius:12px;box-shadow:0 10px 28px rgba(20,20,40,.14);z-index:20}\n#v-chat .ch-m.mine.m9 .ch-tools.ch-t9{left:auto;right:calc(100% + 6px)}\n#v-chat .ch-m.m9 .ch-tools.ch-t9 .ch-tb{width:auto;height:36px;justify-content:flex-start;gap:10px;padding:0 10px;font:500 14px Inter,system-ui,sans-serif;color:#2D2A4A}\n#v-chat .ch-m.m9 .ch-tools.ch-t9 .ch-tb::after{content:attr(aria-label)}\n#v-chat .ch-m.m9 .ch-tools.ch-t9 .ch-tb:hover{background:#F3F5F7}\n@media (max-width:760px){#v-chat .ch-dot9{left:auto;right:0;top:-30px}#v-chat .ch-m.mine .ch-dot9{right:auto;left:0}#v-chat .ch-m.m9 .ch-tools.ch-t9,#v-chat .ch-m.mine.m9 .ch-tools.ch-t9{top:auto;bottom:calc(100% + 34px);left:auto;right:0}}\n</style>\n<style id=\"css2015\">"
 ],
 [
  "return '<div class=\"ch-m' + (cont ? ' cont' : '')",
  "return '<div class=\"ch-m' + (S.m9 && S.m9 === m.id ? ' m9' : '') + (cont ? ' cont' : '')"
 ]
]);
