// 1450: (Misty 12:25) Team Chat final polish, both views · clearer English (descriptions, empty states, Back to conversation, Last active,
//   Management), management options say what they do (Requires reply · Requires acknowledgement · Pin message · Templates · Create
//   formal notice) with a check mark and a summary when selected; acknowledgement wording everywhere (not task completion); formal notice
//   form explains where it goes and who receives it; participant panel has a hide button (remembered); "Find a teacher" in direct chats;
//   search is "Search all my chats" with its scope and each result's chat (private marked); option row wraps (never clipped).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"all: 'Everyday team talk with every teacher and management.'",
"all: 'Chat with teachers and management here. For official notices, leave requests, or pay-related inquiries, go to Notices & requests.'"
],
[
"timein: 'Time-in cards post here by themselves. Management checks them.'",
"timein: 'Time-in cards are posted here automatically for management to review.'"
],
[
"subs: 'Ask for or offer a substitute class.'",
"subs: 'Ask for a substitute or offer to cover a class.'"
],
[
"'Private chat between you and management.'",
"'Private chat between you and management. Only you and management can read it.'"
],
[
"' <span>For formal notices, leave or pay use Notices &amp; requests.</span></div>'; }",
"(S.gid === 'all' ? '' : ' <span>For official notices, leave requests, or pay-related inquiries, go to Notices &amp; requests.</span>') + '</div>'; }"
],
[
"No messages today yet.",
"No messages today."
],
[
">View history</button>",
">View earlier messages</button>"
],
[
"onclick=\"chat1400.today()\">Back to Today</button></div></div>';",
"onclick=\"chat1400.today()\">Back to conversation</button></div></div>';"
],
[
"'<button type=\"button\" class=\"ch-b pri\" onclick=\"chat1400.today()\">Back to Today</button>'",
"'<button type=\"button\" class=\"ch-b pri\" onclick=\"chat1400.today()\">Back to conversation</button>'"
],
[
"Your time-in card posts here by itself when you time in.",
"Your time-in card is posted here automatically when you time in."
],
[
"chatStatus1403 = function(m){ return m.inClass ? 'In class' + (m.until ? ' · until ' + tm(m.until) : '') : m.online ? 'Online' : m.last ? lastTxt(m.last)",
"chatStatus1403 = function(m){ return m.inClass ? 'In class' + (m.until ? ' · until ' + tm(m.until) : '') : m.online ? 'Online' : m.last ? 'Last active ' + lastTxt(m.last)"
],
[
"'<span class=\"ch-tag\">Mgmt</span>'",
"'<span class=\"ch-tag\">Management</span>'"
],
[
"onclick=\"chat1400.opt(\\'nr\\')\">Needs reply</button>'",
"onclick=\"chat1400.opt(\\'nr\\')\" title=\"Everyone in this chat is asked to reply (Noted, On it or Done counts)\">' + (o.nr ? '<svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg>' : '') + 'Requires reply</button>'"
],
[
"onclick=\"chat1400.opt(\\'cf\\')\">Confirm</button>",
"onclick=\"chat1400.opt(\\'cf\\')\" title=\"Everyone taps Acknowledge to show they have read and understood it. This is not the same as finishing a task.\">' + (o.cf ? '<svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg>' : '') + 'Requires acknowledgement</button>"
],
[
"onclick=\"chat1400.opt(\\'pin\\')\">Pin</button>'",
"onclick=\"chat1400.opt(\\'pin\\')\" title=\"Keeps this message at the top of the chat for everyone\">' + (o.pin ? '<svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg>' : '') + 'Pin message</button>'"
],
[
"title=\"Send as formal notice: opens the Notices &amp; requests form with this text (Got it) · nothing is posted in Team Chat\" aria-label=\"Send as formal notice\">Formal notice</button></div>'",
"title=\"Opens the Notices &amp; requests form with this text. You choose who receives it; nothing is posted in Team Chat.\">Create formal notice</button></div>'\n      + (o.nr || o.cf || o.pin ? '<div class=\"ch-optsum\" role=\"status\">This message will ' + [o.nr ? 'ask everyone in this chat to reply' + (o.by ? ' by ' + esc(o.by) : '') : '', o.cf ? 'ask everyone to tap Acknowledge' : '', o.pin ? 'stay pinned at the top' : ''].filter(Boolean).join('|').replace(/\\|([^|]*)$/, ' and $1').split('|').join(', ') + '.</div>' : '')"
],
[
"(m.n ? m.confirmed + ' of ' + m.n + ' confirmed' : (m.mine && m.mine.confirmed ? 'You confirmed' : 'Please confirm'))",
"(m.n ? m.confirmed + ' of ' + m.n + ' acknowledged' : (m.mine && m.mine.confirmed ? 'You acknowledged' : 'Please acknowledge'))"
],
[
"+ (m.needs_reply ? m.replied + ' of ' + m.n + ' replied' : m.confirmed + ' of ' + m.n + ' confirmed'",
"+ (m.needs_reply ? m.replied + ' of ' + m.n + ' replied' : m.confirmed + ' of ' + m.n + ' acknowledged'"
],
[
"onclick=\"chat1400.confirm(' + m.id + ')\">' + I.ok + ' Confirm</button>'",
"onclick=\"chat1400.confirm(' + m.id + ')\" title=\"Tap to show you have read and understood this message\">' + I.ok + ' Acknowledge</button>'"
],
[
"toast2('Confirmed');",
"toast2('Acknowledged');"
],
[
"'Confirm ' + who + '\\u2019s message in ' + where",
"'Acknowledge ' + who + '\\u2019s message in ' + where"
],
[
"msgNew(pre); var mt = document.getElementById('mnT'); if(mt){ mt.value = v; mt.focus(); } },",
"msgNew(pre); var mt = document.getElementById('mnT'); if(mt){ mt.value = v; mt.focus(); }\n      var h1 = document.querySelector('#sheet h1'); if(h1 && !document.getElementById('chFnNote')) h1.insertAdjacentHTML('afterend', '<div id=\"chFnNote\" class=\"ch-fn-note\">This creates a formal notice in <b>Notices &amp; requests</b>, not in Team Chat. Only the people you tick below receive it' + (pre ? ' (Teacher ' + esc(pre[0]) + ' is already ticked)' : '') + '. Each person taps Got it, and you can see who has read it. Check the recipients before you tap Send.</div>'); },"
],
[
"    if(!isMgr()) return '<h2>In this chat</h2>",
"    var X = '<button type=\"button\" class=\"ch-memx\" aria-label=\"Hide the participant panel\" title=\"Hide the participant panel\" onclick=\"chat1400.memT()\"><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg></button>';\n    if(!isMgr()) return '<h2>In this chat</h2>"
],
[
"    return '<h2>In this chat</h2><div class=\"ch-note\" style=\"padding:0 0 4px\">' + L.length + ' people can read this chat</div>' + (isMgr()",
"    return X + '<h2>In this chat</h2><div class=\"ch-note\" style=\"padding:0 0 4px\">' + L.length + ' people can read this chat</div>' + (isMgr()"
],
[
"    return '<div class=\"ch-sec\">GROUPS</div>' + g1.map(it).join('') + '<div class=\"ch-sec\">DIRECT</div>' + g2.map(it).join(''); }",
"    var q = String(S.dmq || '').trim().toLowerCase(), g2f = q ? g2.filter(function(g){ return g.name.toLowerCase().indexOf(q) > -1; }) : g2;\n    return '<div class=\"ch-sec\">GROUPS</div>' + g1.map(it).join('') + '<div class=\"ch-sec\">DIRECT</div>' + (isMgr() && g2.length > 5 ? '<label class=\"ch-dmq\"><span class=\"vh\">Find a teacher</span><input type=\"search\" placeholder=\"Find a teacher\" value=\"' + esc(S.dmq || '') + '\" oninput=\"chat1400.dmq(this.value)\" aria-label=\"Find a teacher\"></label>' : '') + (g2f.map(it).join('') || '<div class=\"ch-note\">No teacher matches \"' + esc(S.dmq) + '\".</div>'); }"
],
[
"    jump: function(g, d, id){",
"    openAll: function(){ S.openAll = !S.openAll; render(true); },\n    dmq: function(v){ S.dmq = v; paintSide(); },\n    jump: function(g, d, id){"
],
[
"<div class=\"chT\">' + esc(g.name) + '</div><small>'",
"<div class=\"chT\">' + esc(S.view === 'search' ? 'Search all my chats' : g.name) + '</div><small>'"
],
[
"(S.view === 'hist' ? 'History' : S.view === 'search' ? 'Search' : (S.day && S.day !== S.init.today ? dayName(S.day) + ' · read-only' : 'Today')) + ' · ' + ((d && d.members) || []).length + ' members' + (S.mem && isMgr() ?",
"(S.view === 'hist' ? 'History' : S.view === 'search' ? (isMgr() ? 'All groups and direct chats you can read' : 'Your groups and your chat with management') : (S.day && S.day !== S.init.today ? dayName(S.day) + ' · read-only' : 'Today')) + (S.view === 'search' ? '' : ' · ' + ((d && d.members) || []).length + ' members') + (S.mem && isMgr() && S.view !== 'search' ?"
],
[
"aria-label=\"Search\" title=\"Search messages\" onclick=\"chat1400.search()\">' + I.search + '<span>Search</span>",
"aria-label=\"Search all my chats\" title=\"Search all my chats\" onclick=\"chat1400.search()\">' + I.search + '<span>Search all my chats</span>"
],
[
"'<div class=\"ch-note\" style=\"flex-basis:100%;padding:0\">Searches every chat you are in, all days. Open a result to see it in its conversation.</div></div>'",
"'<div class=\"ch-note\" style=\"flex-basis:100%;padding:0\">' + (isMgr() ? 'Searches all groups and your direct chats with teachers, all days. A direct chat stays private: only that teacher and management can read it.' : 'Searches the groups you are in and your private chat with management, all days. Other teachers cannot read your private chat.') + ' Each result shows the chat it comes from.</div></div>'"
],
[
"<span style=\"min-width:0\"><b>' + esc(disp(m.author)) + '</b> · ' + esc(gg.name || '') + ' · ' + esc(dayName(m.day)) + ' ' + tm(m.at) + '<br>",
"<span style=\"min-width:0\"><span class=\"ch-in' + (m.gid.indexOf('dm:') === 0 ? ' dm' : '') + '\">In ' + esc(m.gid.indexOf('dm:') === 0 ? (isMgr() ? (gg.name || 'a direct chat') + ' · private' : 'your chat with management · private') : (gg.name || 'a group')) + '</span><br><b>' + esc(disp(m.author)) + '</b> · ' + esc(dayName(m.day)) + ' ' + tm(m.at) + '<br>"
],
[
"'<div class=\"ch-empty\">Search messages by keyword, person and date.</div>'",
"'<div class=\"ch-empty\">Search all your chats by keyword, person and date.</div>'"
],
[
"'<div class=\"ch-open\"><b>Still open from earlier (' + d.open.length + ')</b>'",
"'<div class=\"ch-open' + (S.openAll ? ' all' : '') + '\"><b>Still open from earlier days (' + d.open.length + ')</b>' + (d.open.length > 1 ? ' <button type=\"button\" class=\"ch-openx\" aria-expanded=\"' + !!S.openAll + '\" onclick=\"chat1400.openAll()\">' + (S.openAll ? 'Show less' : 'Show all') + '</button>' : '')"
],
[
">Needs reply' + (m.reply_by ? ' by ' + tm(m.reply_by) : '')",
">Reply requested' + (m.reply_by ? ' by ' + tm(m.reply_by) : '')"
],
[
"</body>\n</html>",
"<style id=\"css1450\">\n/* 1450 · Team Chat final polish (Misty 12:25) */\n#v-chat .ch-opts{flex-wrap:wrap!important;overflow:visible!important;-webkit-mask-image:none!important;mask-image:none!important;padding-right:0!important}\n#v-chat .ch-opts .ch-b.sm.on{background:#0E7C7B;border-color:#0E7C7B;color:#fff;gap:4px}\n#v-chat .ch-optsum{font-size:12.5px;color:#0B5F63;background:#EEF7F6;border-radius:8px;padding:6px 10px;margin:-2px 0 8px}\n.ch-fn-note{background:#F4F1FB;border:1px solid #DDD5F2;color:#3C2F6B;border-radius:10px;padding:10px 12px;font-size:13.5px;line-height:1.45;margin:8px 0 4px}\n#v-chat .ch-mi,.ch-sheet .ch-mi{flex-wrap:wrap;white-space:normal;row-gap:0;padding:4px 0}\n#v-chat .ch-mi small,.ch-sheet .ch-mi small{flex:1 1 100%;margin-left:16px;white-space:normal}\n#v-chat .ch-mem{position:relative}\n#v-chat .ch-memx{position:absolute;top:10px;right:8px;width:32px;height:32px;border:0;border-radius:8px;background:none;color:#5E6272;display:flex;align-items:center;justify-content:center;cursor:pointer}\n#v-chat .ch-memx:hover,#v-chat .ch-memx:focus-visible{background:#EEF2F4;outline:2px solid #0B5F63;outline-offset:0}\n#v-chat .ch.tch .ch-memx{display:none}\n#v-chat .ch-dmq{display:block;padding:0 10px 6px}\n#v-chat .ch-dmq input{width:100%;box-sizing:border-box;height:36px;border:1px solid #DCE1E6;border-radius:10px;padding:0 10px;font:14px Inter,system-ui,sans-serif}\n#v-chat .ch-dmq input:focus{outline:2px solid #0B5F63;outline-offset:0}\n#v-chat .vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}\n#v-chat .ch-in{display:inline-block;font-size:11.5px;font-weight:700;color:#0B5F63;background:#E6F3F2;border-radius:6px;padding:1px 7px;margin-bottom:2px}\n#v-chat .ch-in.dm{color:#5B4B9A;background:#F1EEFA}\n#v-chat button:focus-visible,#v-chat .ch-g:focus-visible{outline:2px solid #0B5F63;outline-offset:2px}\n/* no boxes scrolling inside the chat: pinned shows 2 lines (full text on hover), Still open shows 2 items + Show all */\n#v-chat .ch-pin>div{max-height:none!important;overflow:hidden!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}\n#v-chat .ch-open{max-height:none!important;overflow:visible!important}\n#v-chat .ch-open:not(.all)>div:nth-of-type(n+3){display:none}\n#v-chat .ch-open>div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#v-chat .ch-open.all>div{white-space:normal}\n#v-chat .ch-openx{margin-left:6px;font-weight:700!important;text-decoration:none!important}\n@media(max-height:860px){#v-chat .ch-pin>div{-webkit-line-clamp:1}#v-chat .ch-open:not(.all)>div:nth-of-type(n+2){display:none}#v-chat .ch-hint{display:none}#v-chat .ch-pin,#v-chat .ch-open{padding-top:6px;padding-bottom:6px}}\n</style>\n</body>\n</html>"
]
]);
