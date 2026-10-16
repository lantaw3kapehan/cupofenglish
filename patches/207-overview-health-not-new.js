// 16 Oct · Overview: the automatic "App health" reports no longer count as New messages (they already left the Messages counts — Overview still showed 1 after opening).
require('../tools/lib.js')(process.argv[2], [
["if(MSG){ const nw = (MSG.threads || []).filter(t => [t.root].concat(t.replies).some(msgNewM));", "if(MSG){ const nw = (MSG.threads || []).filter(t => t && t.root && !/^App health$/i.test(String(t.root.from || '')) && [t.root].concat(t.replies).some(msgNewM));"],
]);
