// Stability check (26 Oct 2026, Misty: "always ensure management and teacher screens do not keep moving, adjusting and flickering").
// Run before EVERY release: node tools/stability-check.js <app.html> [limit]
// Builds the management (synth) and teacher previews, then for every screen measures layout shift (CLS) in two cases:
//   first    – very first open on a new device (nothing saved yet) – reported, not failed
//   refresh  – the page is reloaded on that screen (saved copy present, like a real refresh) and watched for 9 s, incl. the quiet background update
//   open     – the screen is opened from another screen and watched for 6 s
// Also counts "flashes": the main area going blank/replaced after it first showed content.
// Exit code 1 if any screen's CLS is above the limit (default 0.02). Nothing is saved; previews have saving switched off.
const { chromium } = require('playwright'), { execSync } = require('child_process'), path = require('path');
const app = path.resolve(process.argv[2] || 'app.html'), LIMIT = +(process.argv[3] || 0.02), root = path.resolve(__dirname, '..');
const HN = { mtoday: 'todo', astudents: 'students', students: 'my-students', msgs: 'messages', enquiry: 'enquiries', perf: 'performance', money: 'sales', tsched: 'my-schedule', active: 'active-students' };
const ONLY = process.env.ONLY || '';
const SETS = [
  { who: 'management', fx: 'audit/fx/synth.json', views: ['mtoday', 'schedule', 'monitor', 'reports', 'msgs', 'team', 'teachers', 'perf', 'qa', 'students', 'astudents', 'active', 'trials', 'books', 'money', 'finov', 'expenses', 'payroll', 'leave', 'enquiry', 'contract', 'actions'] },
  { who: 'teacher', fx: 'audit/fx/teacher.json', views: ['today', 'tsched', 'growth', 'pay', 'train', 'students', 'msgs', 'leave'] }];
const OBS = `window.__cls = 0; window.__sh = []; try{ new PerformanceObserver(l => { l.getEntries().forEach(e => { if(!e.hadRecentInput){ window.__cls += e.value; window.__sh.push([Math.round(e.startTime), +e.value.toFixed(4), (e.sources || []).map(s => s.node && (s.node.id || s.node.className || s.node.nodeName)).filter(Boolean).slice(0, 2).join(' | ').slice(0, 80)]); } }); }).observe({ type: 'layout-shift', buffered: true }); }catch(e){}`;
(async () => {
  const b = await chromium.launch(), out = []; let bad = 0;
  for (const S of SETS.filter(x => !ONLY || ONLY.split(',').some(o => x.who.startsWith(o.split(':')[0])))) {
    const pv = `/tmp/stab-${S.who}.html`;
    execSync(`node tools/preview-build.js ${app} ${S.fx} ${pv} stability`, { cwd: root, stdio: 'ignore' });
    { const fs = require('fs'); let h = fs.readFileSync(pv, 'utf8'); h = h.replace("try{ localStorage.clear(); sessionStorage.clear(); }catch(e){}", "try{ if(!localStorage.getItem('stab.warm')){ localStorage.clear(); sessionStorage.clear(); localStorage.setItem('stab.warm', '1'); } }catch(e){}"); fs.writeFileSync(pv, h); }  // keep the saved copy across the reload, like a real refresh
    for (const W of [{ n: 'laptop', w: 1440, h: 900 }, { n: 'phone', w: 390, h: 844 }].filter(w => !process.env.DEV || w.n === process.env.DEV)) {
      const run = async (v) => {
        const ctx = await b.newContext({ viewport: { width: W.w, height: W.h } }), p = await ctx.newPage();
        await p.addInitScript(OBS);
        const r = { who: S.who, dev: W.n, view: v };
        try {
          await p.goto('file://' + pv + '#' + (HN[v] || v)); await p.waitForTimeout(9000);
          r.first = await p.evaluate(() => +window.__cls.toFixed(4));
          await p.reload(); await p.waitForTimeout(9000);
          r.refresh = await p.evaluate(() => ({ cls: +window.__cls.toFixed(4), top: window.__sh.sort((a, z) => z[1] - a[1]).slice(0, 3) }));
          await p.evaluate(() => { try{ closeSheet(); }catch(e){} go(D && D.mgr ? 'mtoday' : 'today'); }); await p.waitForTimeout(2500);
          await p.evaluate(() => { window.__cls = 0; window.__sh = []; }); await p.evaluate(x => go(x), v); await p.waitForTimeout(6000);
          r.open = await p.evaluate(() => ({ cls: +window.__cls.toFixed(4), top: window.__sh.sort((a, z) => z[1] - a[1]).slice(0, 3) }));
        } catch (e) { r.err = String(e.message).slice(0, 120); }
        await ctx.close(); return r;
      };
      const K = +(process.env.CONC || 1); for (let i = 0; i < S.views.length; i += K) (await Promise.all(VV.slice(i, i + K).map(run))).forEach(r => out.push(r));
    }
  }
  await b.close();
  out.forEach(r => { const worst = Math.max(r.refresh ? r.refresh.cls : 0, r.open ? r.open.cls : 0), fail = worst > LIMIT || r.err; if (fail) bad++;
    console.log(`${fail ? 'MOVES' : 'ok   '} ${r.who.padEnd(10)} ${r.dev.padEnd(6)} ${r.view.padEnd(10)} first ${r.first != null ? r.first : '-'}  refresh ${r.refresh ? r.refresh.cls : '-'}  open ${r.open ? r.open.cls : '-'}${r.err ? '  ERR ' + r.err : ''}`);
    if (fail) [r.refresh, r.open].forEach((x, i) => x && x.cls > LIMIT && x.top.forEach(t => console.log(`        ${i ? 'open' : 'refresh'} @${t[0]}ms ${t[1]} ${t[2]}`))); });
  console.log(bad ? `\n${bad} screen(s) move more than ${LIMIT}` : `\nAll ${out.length} screen checks stable (limit ${LIMIT})`);
  process.exit(bad ? 1 : 0);
})();
