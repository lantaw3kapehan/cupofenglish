// 788: (Misty) "move all now" · WeChat reminders: the "Reminded ✓" mark waited for Google (10–50 s) before the screen updated.
// Now it shows the moment the reminder is copied (teachers and Ops); Google still records it in REMINDERS behind the screen.
const file = process.argv[2];
const mark = (ev) => "REM.map[scRemKey(" + ev + ", st)] = REM.map[scRemKey(" + ev + ", st)] || { by: ((D && D.me && D.me.name) || ''), at: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) };";
require('../tools/lib.js')(file, [
  ["const ok = () => { toast('Copied · open the ' + (c.code || '') + ' group, type @ to tag the parent, then paste'); if(!st) return; try{ localStorage.setItem(scRemKey(c, st), '1'); }catch(x){}",
   "const ok = () => { toast('Copied · open the ' + (c.code || '') + ' group, type @ to tag the parent, then paste'); if(!st) return; try{ localStorage.setItem(scRemKey(c, st), '1'); }catch(x){} try{ " + mark('c') + " renderToday(); }catch(x){}   /* 788: marked at once */"],
  ["const ok = () => { if(st){ try{ localStorage.setItem(scRemKey(e, st), '1'); }catch(x){} api('mgmtRemindLog'",
   "const ok = () => { if(st){ try{ localStorage.setItem(scRemKey(e, st), '1'); }catch(x){} try{ " + mark('e') + " renderSchedule(); }catch(x){}   /* 788: marked at once */ api('mgmtRemindLog'"]
]);
