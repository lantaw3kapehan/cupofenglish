// 2290 (Misty 16 Nov 22:00): opening a chat (Teaching Team) showed the latest/old messages, not the ones not read yet, so it was hard
// to tell what was new. Unread messages from earlier days were marked read without being shown or marked.
// Now: the chat opens at the first message you have not read, with a red "New messages" line above it — also when that message is
// from an earlier day (those days are loaded first). With nothing unread it opens at the newest message as before.
const lib = require("../tools/lib.js"), file = process.argv[2];
const DIV = `'<div class="ch-day" id="chNewDiv" style="background:#FDECEA;color:#9B2C1F">New messages</div>'`;
lib(file, [
 // today's list: the divider gets an id, and steps aside when the first unread is on an earlier day
 [`return (S.fu && m.id === S.fu ? '<div class="ch-day" style="background:#FDECEA;color:#9B2C1F">New messages</div>' : '')`,
  `return (S.fu && m.id === S.fu && !(S.fuE && S.fuE.gid === S.gid) ? ${DIV} : '')`],
 // earlier days: the divider before the first unread message
 [`h += '<div class="ch-day">' + esc(dayName(b.day)) + '</div>' + b.msgs.map(function(m, i){ return msgHtml(m, byId, i ? b.msgs[i - 1] : null, b.msgs[i + 1] || null); }).join(''); });`,
  `h += '<div class="ch-day">' + esc(dayName(b.day)) + '</div>' + b.msgs.map(function(m, i){ return (S.fuE && S.fuE.gid === S.gid && m.id === S.fuE.id ? ${DIV} : '') + msgHtml(m, byId, i ? b.msgs[i - 1] : null, b.msgs[i + 1] || null); }).join(''); });`],
 // after drawing: jump to the divider once
 [`if(L2 && S.pre2009) L2.scrollTop = Math.max(0, L2.scrollHeight - S.pre2009.h + S.pre2009.t); S.pre2009 = null;`,
  `if(L2 && S.pre2009) L2.scrollTop = Math.max(0, L2.scrollHeight - S.pre2009.h + S.pre2009.t); S.pre2009 = null;
    if(L2 && S.jumpNew){ var nd = document.getElementById('chNewDiv'); if(nd){ L2.scrollTop = Math.max(0, nd.offsetTop - L2.offsetTop - 40); if(!S.fuE || S.fuE.gid !== S.gid || S.fuE.ready) S.jumpNew = 0; } }   /* 2290 */`],
 // opening a chat: forget the last one's marker; jump to the new line when it is drawn
 [`S.newBelow = false; S.lastN = 0; S.voice = null; S.gid = g; S.day = null; S.view = 'chat';`,
  `S.newBelow = false; S.lastN = 0; S.voice = null; S.fuE = null; S.jumpNew = 1; S.gid = g; S.day = null; S.view = 'chat';`],
 // earlier unread: remember the first one, load back to its day, then mark them read
 [`for(var i = 0; i < L.length; i++){ var r = await post('list', { gid: gid, day: L[i] }); ((r && r.msgs) || []).forEach(function(m){ if(m.mine && !m.mine.seen) ids.push(m.id); }); }
      if(ids.length) await post('seen', { ids: ids });`,
  `var first = null;
      for(var i = 0; i < L.length; i++){ var r = await post('list', { gid: gid, day: L[i] }); ((r && r.msgs) || []).forEach(function(m){ if(m.mine && !m.mine.seen){ ids.push(m.id); if(L[i] < S.init.today && (!first || m.id < first.id)) first = { gid: gid, id: m.id, day: L[i] }; } }); }
      if(first && S.gid === gid && S.view === 'chat'){ S.fuE = first; S.jumpNew = 1;   /* 2290: show them before marking them read */
        for(var k = 0; k < 12 && S.gid === gid; k++){ var e9 = E9[gid]; if(e9 && e9.blocks.some(function(b){ return b.day <= first.day; })) break; if(e9 && e9.done) break;
          if(!e9 || e9.busy){ await new Promise(function(ok){ setTimeout(ok, 250); }); continue; } await more2009(); }
        first.ready = 1; S.jumpNew = 1; if(S.gid === gid) render(true); }
      if(ids.length) await post('seen', { ids: ids });`],
]);
