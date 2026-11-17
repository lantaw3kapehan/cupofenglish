// 2291 (Misty 17 Nov 10:32–10:35, Yoyo): "Delete" refused a class that is part of a weekly series ("part of Google Calendar"), and a
// Cancel still shows on teacher and management schedules. The app is the calendar since 8 Nov (Google is only a mirror), so Delete now
// removes that one class in the database (coe-cal v5 delClassDb → coe_class_del_db: a full copy is kept in Deleted classes first; only a
// class that has not started). Undo puts it back the same way. A cancelled class can be deleted too.
const lib = require("../tools/lib.js"), file = process.argv[2];
const CAL = "'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-cal'";
lib(file, [
 ["let r; try{ r = await apiNow('delClass', TOKEN, e.id, { start: e.start, reason: why }); }catch(x){ r = { ok: false, msg: (x && x.message) || 'No connection · nothing deleted' }; }",
  "let r; try{ const st = new Date(e.start).toISOString(), rid = String(e.id).indexOf('|') > -1 ? String(e.id) : String(e.id) + '|' + st;   /* 2291: the class row in the app's calendar */\n" +
  "      r = await fetch(" + CAL + ", { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'delClassDb', id: rid, reason: why }) }).then(x => x.json()); }catch(x){ r = { ok: false, msg: (x && x.message) || 'No connection · nothing deleted' }; }"],
 ["let r; try{ r = await apiNow('undelClass', TOKEN, id); }catch(x){ r = { ok: false, msg: 'No connection' }; }",
  "let r; try{ r = await fetch(" + CAL + ", { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'undelClassDb', tid: id }) }).then(x => x.json());   /* 2291 */\n" +
  "      if(r && r.notDb) r = await apiNow('undelClass', TOKEN, id); }catch(x){ r = { ok: false, msg: 'No connection' }; }"],
]);
