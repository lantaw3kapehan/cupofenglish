// 15 Oct night · The Messages badge no longer comes and goes: the automatic "App health" reports have their own tab and
// are left out of the counts on screen, so they are left out of the unread number from the server too.
require('../tools/lib.js')(process.argv[2], [
["api('mgmtMsgs', TOKEN), v => MSG = v, () => {", "api('mgmtMsgs', TOKEN), v => { MSG = v; try{ const sys = (MSG.threads || []).filter(t => t && t.root && /^App health$/i.test(String(t.root.from || ''))); MSG.unread = Math.max(0, (MSG.unread || 0) - sys.reduce((a, t) => a + [t.root].concat(t.replies || []).filter(msgNewM).length, 0)); }catch(e){} }, () => {"],
]);
