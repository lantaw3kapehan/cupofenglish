// 21 Oct · All-time total: a failed answer no longer waits 30 minutes before asking again (it asks again on the next visit).
require('../tools/lib.js')(process.argv[2], [["payAllAt = Date.now(); if(!r || !r.ok || !r.months) return;", "if(!r || !r.ok || !r.months) return; payAllAt = Date.now();"]]);
