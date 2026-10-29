// 1610: (coordinator, 29 Oct, after Misty 08:56 · Abby) the "sync stopped" hold — "The ACTIVE copy from Google is out of date" and
// "The renewal check has not run since …" — now applies to RENEWAL pictures only (and renewal saves, 1611). Ordinary "Lessons left"
// pictures and the Lesson Summary rely on the database numbers and the numbers-agree check (carried + new − used = now), which still
// holds them (核对中) whenever the numbers actually disagree. The freshness itself is Google's last check-in (database 29 Oct, 08:59).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["    if(c){ if(!c.copyOk) why.push('The ACTIVE copy from Google is out of date (last copy ' + hm(c.copyAt) + ')');\n      if(!(now - Date.parse(c.at) < 25 * 6e4)) why.push('The renewal check has not run since ' + hm(c.at)); }",
   "    if(c && o.renew){ if(!c.copyOk) why.push('The ACTIVE copy from Google is out of date (last copy ' + hm(c.copyAt) + ')');   /* 1610: renewals only */\n      if(!(now - Date.parse(c.at) < 25 * 6e4)) why.push('The renewal check has not run since ' + hm(c.at)); }"]
]);
