// 789: (Misty) "time-out is too slow now" — the one-tap time-out waited for Google (time-out still saves through Google) before showing anything.
// Now the "Timed out · HH:MM" card shows at once (the time is taken when you tap) and Google saves it behind the screen;
// the card only changes if Google refuses ("Time-out not saved · Try again").
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    OUT_ARM = 0; NET = netCheck(false); BUSY = 1; hdr('Saving…'); res('wait', 'Timing out…', 'One moment');\n    Promise.resolve(sendTimeOut()).then(() => {}, () => {}).then(() => { BUSY = 0; try{ tinNag(); }catch(e){}",
   "    OUT_ARM = 0; NET = netCheck(false); BUSY = 1; hdr('Saving…');\n    const _p789 = sendTimeOut(); try{ const t0 = (D.timeIn || {}).out; if(t0) res('ok', 'Timed out · ' + t0, 'Saved on this device · confirming with the server…'); else res('wait', 'Timing out…', 'One moment'); }catch(e){}   /* 789: shown at once */\n    Promise.resolve(_p789).then(() => {}, () => {}).then(() => { BUSY = 0; try{ tinNag(); }catch(e){}"]
]);
