// 20 Oct · Price picture form: the "Recommend" buttons in English (Foundation · 15); the picture itself keeps its Chinese.
require('../tools/lib.js')(process.argv[2], [
  ["onclick=\"ppRec(\\'' + p.k + '\\')\">' + p.zh + ' · ' + p.n", "onclick=\"ppRec(\\'' + p.k + '\\')\">' + (p.en || p.zh) + ' · ' + p.n"]]);
