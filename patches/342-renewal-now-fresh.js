// 19 Oct · Renewal picture (341 follow-up): in the minutes right after a renewal the new package row can still carry the old package's used / left
// (the database waits 8 minutes before taking a correction from the sheet). A package paid in the last 2 days that shows fewer lessons left than were
// just bought is that stale moment → lessons now = carried over + new (Mia: 4.5 + 33 = 37.5).
require('../tools/lib.js')(process.argv[2], [["    if(old){ Q.carry = Math.round(+b.left * 10) / 10; Q.now = Math.round((+b.left + Q.tot) * 10) / 10; } else Q.now = +b.left; } }catch(x){}",
"    if(old){ Q.carry = Math.round(+b.left * 10) / 10; Q.now = Math.round((+b.left + Q.tot) * 10) / 10; }\n    else { const fresh = (Date.now() - new Date(Q.paid + 'T00:00:00+08:00').getTime()) < 2 * 864e5; Q.now = fresh && +b.left < Q.tot ? Math.round(((+b.carry || +Q.carry || 0) + Q.tot) * 10) / 10 : +b.left; } } }catch(x){}   /* 342 */"]]);
