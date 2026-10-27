// 1400: (Misty, 27 Oct 18:36–18:42) Team Chat pilot — "our official WeChat group but all in the app": tag a teacher, see who has seen it and
//   when, who replied; Needs reply (+ by time), Noted / On it / Done, Confirm, Pinned, pictures, time-in card posts itself in the Time-in
//   group, search, each group opens on Today and earlier days sit in History (nothing is ever deleted). Database: coe-chat + chat_* tables.
//   Shown only while sys:chat is on: management always, teachers named in its pilot list (Pam, Kat, April to start).
//   Management: nav › Today › Team Chat. Teachers: Team Chat in their menu, after Messages. The WeChat copy flow is unchanged.
const lib = require('../tools/lib.js'), fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '1400-team-chat.inc.html'), 'utf8');
lib(file, [
  ['<div id="v-mypay" class="hide"></div>', '<div id="v-mypay" class="hide"></div>\n<div id="v-chat" class="hide"></div>'],
  ["'schedule', 'msgs', 'astudents'", "'schedule', 'msgs', 'chat', 'astudents'"],
  ["['msgs','Messages','send',1,'Today'],", "['msgs','Messages','send',1,'Today'],['chat','Team Chat','chat',1,'Today'],"],
  ["'mypay','tsched','leave'];", "'mypay','tsched','leave','chat'];"],
  ["const NAV_T = [['today','Today','today'],", "window.chatOn1400 = window.chatOn1400 || function(){ try{ return localStorage.getItem('coe.chat1400') === '1'; }catch(e){ return false; } };\nconst NAV_T = [['today','Today','today'],['chat','Team Chat','chat'],"],
  ["const items = D && D.mgr ? NAV_M.filter(x => (x[0] !== 'mypay' || ((MYP || kept('mypay') || {}).has))) : NAV_T;", "const items = D && D.mgr ? NAV_M.filter(x => x[0] !== 'chat' || (window.chatOn1400 && chatOn1400())).filter(x => (x[0] !== 'mypay' || ((MYP || kept('mypay') || {}).has))) : NAV_T.filter(x => x[0] !== 'chat' || (window.chatOn1400 && chatOn1400()));"],
  ["msgs:    [() => MSG, () => renderMsgs(),    q => loadMsgs(q)]", "msgs:    [() => MSG, () => renderMsgs(),    q => loadMsgs(q)],\nchat:    [() => !!(window.chat1400 && chat1400.has()), () => chat1400.render(), q => chat1400.load(q)]"],
  ["st.measuring = x.measuring; }", "st.measuring = x.measuring; if(!x.measuring && !st.chat1400 && window.chatTimein1400){ st.chat1400 = 1; try{ chatTimein1400(P.blob, x, st.redo); }catch(e){} } }"],
  ['</body>\n</html>', inc + '\n</body>\n</html>']
]);
