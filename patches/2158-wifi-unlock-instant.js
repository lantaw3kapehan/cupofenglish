// 2158 (13 Nov · Misty 13:44 "once she answers quickly, the teacher access gets unlocked right?"): the I'm in gate kept the lock answer
// for up to 90 s on the teacher's device, so right after Operations unlocked, one tap could still say "locked". Now: when the last answer
// was "locked", tapping I'm in asks again first (at most 2.5 s), so an unlock works on the very next tap. Unlocked teachers: no extra wait.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["    let f = null; try{ f = await quick(state(false)); }catch(e){}",
   "    let f = null; try{ f = await quick(state(!!C.flag)); }catch(e){}   /* 2158: locked before → ask again, so an unlock opens on this tap */"],
]);
