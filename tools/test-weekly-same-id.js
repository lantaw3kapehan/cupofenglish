// 2052 · regression for 10 Nov (Jimmy, Teacher Pam): a weekly class keeps the same id every week, so an "I'm in" from one day must
// never show on the same class another day. Runs every helper that fills Schedule / Monitor check-ins (block 1145) in a sandbox:
// Monday's tap must show on Monday's class, and never on Tuesday's — not from a kept list, not after the list reloads.
// Runs on every release from tools/check.js. Returns a promise of the number of failed cases.
const fs = require('fs'), vm = require('vm');
module.exports = async function(file){
  const s = fs.readFileSync(file, 'utf8'), re = /<script[^>]*>([\s\S]*?)<\/script>/g, blocks = []; let m;
  while ((m = re.exec(s))) if (m[1].indexOf("1145 · Schedule \"I'm in\" from the database") > -1) blocks.push(m[1]);
  if (!blocks.length) { console.error('weekly same id: the 1145 helper was not found'); return 1; }
  let failed = 0; const ok = (c, what) => { console.log((c ? 'ok   ' : 'FAIL ') + what); if (!c) failed++; };
  for (let b = 0; b < blocks.length; b++) {
    const mon = { kind: 'ci', id: 'wk1', start: '2026-11-09T13:30:00.000Z', at: '2026-11-09T13:26:49.000Z', status: 'On time', mins: 3, time: '21:26' };
    const S = { day: '2026-11-09' };
    const ctx = { TOKEN: 't', D: { mgr: 1 }, FAST_URL: 'u', VIEW: 'schedule', console,
      fetch: async () => ({ json: async () => ({ ok: true, list: S.day === '2026-11-09' ? [mon] : [] }) }),
      setInterval: () => 0, setTimeout, Date, Math, JSON, String, Promise };
    ctx.window = ctx; ctx.monChips = (e) => e; ctx.renderSchedule = () => {};
    vm.createContext(ctx);
    try { vm.runInContext(blocks[b], ctx); } catch (e) { ok(false, 'copy ' + (b + 1) + ' runs: ' + e.message); continue; }
    const wait = () => new Promise((r) => setTimeout(r, 30));
    const monEv = { id: 'wk1', start: '2026-11-09T13:30:00.000Z', first: false, teacher: 'Pam' };
    ctx.SC = { events: [monEv] }; ctx.renderSchedule(); await wait();
    ok(monEv.ci && monEv.ci.time === '21:26', 'copy ' + (b + 1) + ' · Monday class shows Monday\'s "I\'m in"');
    const tue = { id: 'wk1', start: '2026-11-10T13:30:00.000Z', first: false, teacher: 'Pam' };
    ctx.SC = { events: [tue] }; ctx.renderSchedule();
    ok(!tue.ci, 'copy ' + (b + 1) + ' · Tuesday class does not take Monday\'s kept list');
    ctx.monChips(tue); ok(!tue.ci, 'copy ' + (b + 1) + ' · Monitor does not take Monday\'s kept list');
    S.day = '2026-11-10'; await wait(); ctx.renderSchedule(); await wait();
    ok(!tue.ci, 'copy ' + (b + 1) + ' · Tuesday class after its own list loads: "Not yet"');
    const moved = { id: 'wk1', start: '2026-11-10T13:30:00.000Z', first: false, teacher: 'Pam', ci: { time: '21:26', status: 'On time', app1145: 1, d2051: '2026-11-09' } };
    ctx.monChips(moved); ok(!moved.ci, 'copy ' + (b + 1) + ' · a chip carried over from another day is cleared');
  }
  if (failed) console.error('Weekly same id: ' + failed + ' case(s) failed');
  else console.log('Weekly classes: an "I\'m in" shows only on its own day (' + blocks.length + ' helper)');
  return failed;
};
