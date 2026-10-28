// 1498: (Misty 20:47) Team Chat search · result rows have their own layout (chat label, sender + time, preview clamped to 3 lines;
//   heights follow the content, nothing positioned) so nothing overlaps at any size or zoom; the Members panel (this chat only) is
//   hidden while searching and comes back as it was; the search header and toolbar wrap instead of cutting labels; opening a result
//   shows the message in context with "Back to search results" (query, filters, results and scroll kept).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"return '<button type=\"button\" class=\"ch-g ch-res\" onclick=\"chat1400.jump(\\'' + esc(m.gid) + '\\',\\'' + m.day + '\\',' + m.id + ')\"><span style=\"min-width:0\"><span class=\"ch-in' + (m.gid.indexOf('dm:') === 0 ? ' dm' : '') + '\">In ' + esc(m.gid.indexOf('dm:') === 0 ? (isMgr() ? (gg.name || 'a direct chat') + ' · private' : 'your chat with management · private') : (gg.name || 'a group')) + '</span><br><b>' + esc(disp(m.author)) + '</b> · ' + esc(dayName(m.day)) + ' ' + tm(m.at) + '<br><span style=\"color:#5E6272\">' + esc(String(m.body || (m.kind === 'voice' ? 'Voice message' : 'Picture')).slice(0, 140)) + '</span></span><small>Open</small></button>'; }",
"return '<button type=\"button\" class=\"ch-res2\" onclick=\"chat1400.jump(\\'' + esc(m.gid) + '\\',\\'' + m.day + '\\',' + m.id + ')\"><span class=\"r-in ch-in' + (m.gid.indexOf('dm:') === 0 ? ' dm' : '') + '\">In ' + esc(m.gid.indexOf('dm:') === 0 ? (isMgr() ? (gg.name || 'a direct chat') + ' · private' : 'your chat with management · private') : (gg.name || 'a group')) + '</span><span class=\"r-open\">Open</span><span class=\"r-who\"><b>' + esc(disp(m.author)) + '</b><span class=\"r-at\">' + esc(dayName(m.day)) + ' ' + tm(m.at) + '</span></span><span class=\"r-tx\">' + esc(String(m.body || (m.kind === 'voice' ? 'Voice message' : m.kind === 'timein' ? 'Time-in card' : 'Picture')).slice(0, 600)) + '</span></button>'; }"
],
[
"var cls = 'ch' + (S.ph === 'conv' ? ' conv' : '') + (S.memOpen ? ' mem' : '') + (S.memHide ? ' nomem' : '') + (isMgr() ? '' : ' tch');",
"var srv = S.view === 'search', cls = 'ch' + (S.ph === 'conv' ? ' conv' : '') + (S.memOpen && !srv ? ' mem' : '') + (S.memHide || srv ? ' nomem' : '') + (srv ? ' srv' : '') + (isMgr() ? '' : ' tch');   /* 1498: no Members panel during search */"
],
[
"(S.view !== 'chat' || (S.day && S.day !== S.init.today) ? '<button type=\"button\" class=\"ch-b pri\" onclick=\"chat1400.today()\">Back to conversation</button>' : '')",
"(S.view === 'chat' && S.srBack ? '<button type=\"button\" class=\"ch-b pri ch-bsr\" onclick=\"chat1400.backSearch()\">' + I.search + '<span class=\"sv\">Back to search results</span></button>' : '') + (S.view !== 'chat' || (S.day && S.day !== S.init.today) ? '<button type=\"button\" class=\"ch-b pri\" onclick=\"chat1400.today()\">Back to conversation</button>' : '')"
],
[
"    search: function(){ S.view = S.view === 'search' ? 'chat' : 'search'; S.res = null; render(); var q = document.getElementById('chQ'); if(q) q.focus(); },",
"    search: function(){ if(S.view === 'search'){ S.view = 'chat'; S.srBack = 0; render(); return; } S.view = 'search'; render(); srRestore(); var q = document.getElementById('chQ'); if(q && !S.res) q.focus(); },   /* 1498: query, filters and results are kept */\n    backSearch: function(){ S.view = 'search'; S.srBack = 0; render(); srRestore(); },"
],
[
"    jump: function(g, d, id){ S.gid = g;",
"    jump: function(g, d, id){ var L0 = document.querySelector('#v-chat .ch-list'), M0 = document.querySelector('#v-chat .ch-main'); S.srTop = L0 ? L0.scrollTop : 0; S.srTop2 = M0 ? M0.scrollTop : 0; S.srBack = 1; S.gid = g;"
],
[
"    list: function(){ S.ph = 'list'; render(true); },",
"    list: function(){ S.ph = 'list'; S.srBack = 0; render(true); },"
],
[
"    open: function(g){ var tx0 = document.getElementById('chTx');",
"    open: function(g){ S.srBack = 0; var tx0 = document.getElementById('chTx');"
],
[
"  function shell(){ var R = root();",
"  function srRestore(){ var L = document.querySelector('#v-chat .ch-list'), M = document.querySelector('#v-chat .ch-main'); if(L && S.srTop) L.scrollTop = S.srTop; if(M && S.srTop2) M.scrollTop = S.srTop2; }\n  function shell(){ var R = root();"
],
[
"if(S.focus){ var el = document.getElementById('chm' + S.focus); if(el){ el.scrollIntoView({ block: 'center' }); el.querySelector('.ch-bub').style.outline = '2px solid #5B4B9A'; } S.focus = 0; } }",
"if(S.focus){ var el = document.getElementById('chm' + S.focus); if(el){ el.scrollIntoView({ block: 'center' }); el.querySelector('.ch-bub').style.outline = '2px solid #5B4B9A'; el.classList.add('ch-hit'); S.focus = 0; } else if(S.data && S.data.msgs && S.data.msgs.length && !S.data.msgs.some(function(x){ return x.id === S.focus; })) S.focus = 0; } }"
],
[
"</body>\n</html>",
"<style id=\"css1498\">\n/* 1498 (Misty 20:47) · search results never overlap · no Members panel during search · header wraps instead of truncating */\n#v-chat .ch-srv-n,#v-chat .ch.srv .ch-list>*{flex:none}\n#v-chat .ch-res2{flex:none;display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:3px;width:100%;box-sizing:border-box;text-align:left;background:#fff;border:0;border-bottom:1px solid #F0F1F4;padding:10px 12px;font:400 14px/1.4 Inter,system-ui,sans-serif;color:#1F1D3A;cursor:pointer;height:auto;min-height:0;position:static}\n#v-chat .ch-res2:hover{background:#F7F8FA}#v-chat .ch-res2:focus-visible{outline:2px solid #0B5F63;outline-offset:-2px}\n#v-chat .ch-res2 .r-in{grid-column:1;justify-self:start;max-width:100%;white-space:normal;overflow-wrap:anywhere;margin:0}\n#v-chat .ch-res2 .r-open{grid-column:2;grid-row:1;align-self:start;color:#00737B;font-weight:600;font-size:12.5px;white-space:nowrap}\n#v-chat .ch-res2 .r-who{grid-column:1 / -1;display:flex;flex-wrap:wrap;column-gap:8px;row-gap:0;align-items:baseline;min-width:0}\n#v-chat .ch-res2 .r-who b{font-weight:600;overflow-wrap:anywhere}#v-chat .ch-res2 .r-at{color:#6E6A85;font-size:12.5px;white-space:nowrap}\n#v-chat .ch-res2 .r-tx{grid-column:1 / -1;color:#5E6272;overflow-wrap:anywhere;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;line-clamp:3;overflow:hidden}\n#v-chat .ch.srv .ch-mem,#v-chat .ch.srv .ch-memb{display:none!important}\n#v-chat .ch.srv .ch-hd{flex-wrap:wrap;row-gap:6px}\n#v-chat .ch.srv .ch-hd>div:nth-child(2){flex:1 1 220px!important;min-width:0}\n#v-chat .ch.srv .ch-hd .chT,#v-chat .ch.srv .ch-hd small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}\n#v-chat .ch-hd .ch-bsr{width:auto!important;padding:0 12px!important;gap:6px}#v-chat .ch-hd .ch-bsr span.sv{display:inline!important}\n#v-chat .ch-srch{flex-wrap:wrap}\n@media (max-height:620px){#v-chat .ch.srv .ch-main{overflow-y:auto}#v-chat .ch.srv .ch-main>.ch-list{flex:none!important;overflow:visible!important;height:auto!important;max-height:none!important;min-height:0}}   /* short windows: filters and results scroll as one page */\n@media (max-width:640px){#v-chat .ch-hd .ch-bsr span.sv{display:none!important}#v-chat .ch-hd .ch-bsr{width:44px!important;padding:0!important}}\n</style>\n</body>\n</html>"
]
]);
