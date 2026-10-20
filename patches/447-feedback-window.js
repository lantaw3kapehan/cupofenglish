// 20 Oct · Teacher card: monthly feedback counts as due only from the 25th (it opens on the 25th); before that no coral, no count.
require('../tools/lib.js')(process.argv[2], [
  ["const S = (p.students || []).slice(), fb = S.filter(s => s.feedbackDue).length;",
   "const FBO = new Date().getDate() >= 25;   /* 447: monthly feedback opens on the 25th */\n    const S = (p.students || []).map(s => FBO ? s : Object.assign({}, s, { feedbackDue: false })), fb = S.filter(s => s.feedbackDue).length;"],
  ["'<div><b style=\"color:' + (fb ? '#C0563F' : '#1E8A5E') + '\">' + fb + '</b><span>feedback due</span></div></div>'",
   "(FBO ? '<div><b style=\"color:' + (fb ? '#C0563F' : '#1E8A5E') + '\">' + fb + '</b><span>monthly feedback due</span></div></div>' : '<div><b style=\"color:#8A86A0\">25th</b><span>monthly feedback opens · ' + (25 - new Date().getDate()) + ' day' + (25 - new Date().getDate() === 1 ? '' : 's') + ' to go</span></div></div>')"],
  ["(fb ? '<b style=\"color:#C0563F\">' + fb + '</b> feedback due · ' : '')",
   "(fb ? '<b style=\"color:#C0563F\">' + fb + '</b> monthly feedback due · ' : '')"]]);
