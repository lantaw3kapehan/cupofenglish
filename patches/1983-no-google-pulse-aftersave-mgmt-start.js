// 1983: (Misty 9 Nov "nothing read from Google" · "go ahead") — the Google reads the app's own speed log (coe_speed, 48 h) still showed:
//   · management "anything changed?" asked Google every 15 min per open window (556 calls in 48 h, 4 s each) for changes typed straight
//     into the sheets or calendar. The sheets are frozen copies and the app is the calendar (1907, 1921), so only the database is asked.
//   · right after any save, screens the database works out itself were asked of Google for 2 min ("aftersave": teacher home, goals,
//     homework history, schedule, feedback list; management Students, DATABASE). Saves land in the database first, and these screens are
//     worked out from the tables at the moment they are asked, so the database answer is used.
//   · management start data refreshed from Google in the background on every new tab (104 calls in 48 h). Today's time-in now comes from
//     the database (the same reading the teacher home uses); name, role and shift stay as saved on this device.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const wantG = Date.now() - gAt > 15 * 6e4;", "const wantG = false;   /* 1983: sheets frozen, the app is the calendar — nothing changes on Google's side */"],
  ["const age = d => d && SB_LASTW && Date.now() - SB_LASTW < 120000", "const age = d => d && !d.live && SB_LASTW && Date.now() - SB_LASTW < 120000"],
  ["if(window.__bootBg1971){ window.__bootBg1971 = 0; const tk = TOKEN; api('getBootstrap', tk).then(v => { if(!v || !v.mgr || TOKEN !== tk) return; D = v; store('set', KEY_D, JSON.stringify(D));",
   "if(window.__bootBg1971){ window.__bootBg1971 = 0; const tk = TOKEN, nm = String((D && D.me && D.me.name) || '').toLowerCase(); fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'calc', token: tk, fn: 'getBootstrap', args: [], as: nm }) }).then(x => x.json()).then(r => { const v = r && r.ok && r.data; if(!nm || !v || !v.me || String(v.me.name || '').toLowerCase() !== nm || TOKEN !== tk || !D || !D.mgr) return; D = Object.assign({}, D, { today: v.today || D.today, timeIn: v.timeIn || null }); store('set', KEY_D, JSON.stringify(D));   /* 1983: from the database (was Google) */"],
]);
