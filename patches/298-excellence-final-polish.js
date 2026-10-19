// 19 Oct · 298 · Teacher Excellence final design check (Misty: "final QA the design"):
// level names sit clear of the marker; side-menu title on one line; class-visit counts say they are ratings (5 Strong · 7 Needs work are ratings across the visits, not visits);
// My months chart is drawn larger while there are only a few months, so it reads on a phone.
require('../tools/lib.js')(process.argv[2], [
  ['<div class="row small mute" style="position:relative;height:16px;margin-top:6px">', '<div class="row small mute" style="position:relative;height:16px;margin-top:12px">'],
  ['letter-spacing:.12em;color:#9a9aae;text-transform:uppercase">Excellence · this month</div>', 'letter-spacing:.08em;color:#9a9aae;text-transform:uppercase;white-space:nowrap">Excellence · this month</div>'],
  ["${me.visitStrong ? ' · ' + me.visitStrong + ' Strong' : ''}${me.visitNeeds ? ' · ' + me.visitNeeds + ' Needs work' : ''}",
   "${me.visitStrong || me.visitNeeds ? ' · ratings: ' + [me.visitStrong ? me.visitStrong + ' Strong' : '', me.visitNeeds ? me.visitNeeds + ' Needs work' : ''].filter(Boolean).join(', ') : ''}"],
  ["W = 600, HH = 150", "W = Math.min(600, Math.max(360, H.length * 130)), HH = 150"]]);
