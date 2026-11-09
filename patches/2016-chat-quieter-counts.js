// 2016 (9 Nov 17:20, Misty: "seen by 9 is enough, no need to put the overall · also the total members, and who's online, perhaps we can
//   hide those, only when we want to know then we click"): management chat. "Seen by 9" (tap it for who and when, as before);
//   the header says only "Group chat" / "Private chat"; members and who is online are in More › Members.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "' Seen by ' + m.seen + ' of ' + m.n + '</button>'",
  "' Seen by ' + m.seen + '</button>'"
 ],
 [
  "(S.view === 'search' ? '' : ' · ' + ((d && d.members) || []).length + ' members')",
  "(S.view === 'search' || isMgr() ? '' : ' · ' + ((d && d.members) || []).length + ' members')"
 ],
 [
  "(S.mem && isMgr() && S.view !== 'search' ? ' · ' +",
  "(false && S.mem && isMgr() && S.view !== 'search' ? ' · ' +"
 ]
]);
