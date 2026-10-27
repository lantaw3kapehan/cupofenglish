// 1271: (Misty, 27 Oct 11:54) WeChat time-in picture: "Teacher Pam" instead of just "Pam".
require('../tools/lib.js')(process.argv[2], [
  ["text-overflow:ellipsis\">' + E(x.name) + '</div>'", "text-overflow:ellipsis\">' + E(/^teacher\\b/i.test(String(x.name || '')) ? x.name : 'Teacher ' + x.name) + '</div>'"]]);
