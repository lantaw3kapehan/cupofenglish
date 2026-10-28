// 1374 · speed after the 28 Oct stamp outage (Misty: "screens are slow again").
//   coe_speed after 16:05: the screens themselves open in 0.1–0.7 s, but inside a student's page the
//   Skill breakdown (PR-REPORT) waited 14 s for Google. Two causes:
//   · progress reports, lesson summaries (IND-PKG) and payslips were read from Google whenever the saved
//     copy was older than 3 days, although a report for one progress check does not change;
//   · opening an ACTIVE row also asked Google for that student's IND-PKG summary in the background — which
//     management never uses (Lesson summary is drawn from ACTIVE) — and it holds Google's one "pick" lock,
//     so the progress report queued behind it.
//   Now: the saved copy (any age) shows at once and Google refreshes it behind; the view only redraws if
//   the answer changed. No saved copy → Google, exactly as before. Privacy: the database's 'docs' read keeps
//   its scope checks (management copies for management, a teacher's own copies for her).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(r[C.code] && !docHave('INDPKG', r[C.code], '')) docGet('INDPKG', r[C.code], '').catch(()=>{});",
   "if(r[C.code] && !docHave('INDPKG', r[C.code], '') && !(D && D.mgr)) docGet('INDPKG', r[C.code], '').catch(()=>{});   /* 1374: management's Lesson summary is drawn from ACTIVE — no Google prefetch */"],
  ["</script>\n<script>\n/* 1373 · fixed monthly pay",
   "</script>\n<script>\n/* 1374 · progress reports / lesson summaries / payslips: the saved copy at once, Google behind */\n(function(){\n" +
   "  const base = window.docGet; if(typeof base !== 'function') return;\n" +
   "  const SAFE = /^(PRREP|INDPKG|PAYSLIP)$/, same = (a, b) => JSON.stringify(a && a.rows) === JSON.stringify(b && b.rows);\n" +
   "  window.docGet = docGet = function(key, pick, pick2, force){\n" +
   "    try{\n" +
   "      if(force || !SAFE.test(key) || !pick || typeof LIVE === 'undefined' || !LIVE || typeof sbOn !== 'function' || !sbOn()) return base.apply(this, arguments);\n" +
   "      const k = docK(key, pick, pick2); if(DOCFLY[k]) return DOCFLY[k];\n" +
   "      const fn = D && D.mgr ? 'mgmtTab' : 'tDoc', args = [TOKEN, key, pick || '', pick2 || '', 1, false], box = typeof $ === 'function' ? $('stuSB') : null;\n" +
   "      const p = Promise.race([sbDoc(sbKey(fn, args)), new Promise(z => setTimeout(() => z(null), 3000))]).then(d => {\n" +
   "        const c = d && d.data && d.data.rows ? d.data : null;\n" +
   "        if(!c){ delete DOCFLY[k]; return base(key, pick, pick2); }   /* never saved → Google, as before */\n" +
   "        DOCMEM[k] = c; try{ store('set', k, JSON.stringify(c)); }catch(e){}\n" +
   "        setTimeout(() => { apiNow(fn, ...args).then(r => { if(!r || !r.rows || same(r, c)) return; DOCMEM[k] = r; try{ store('set', k, JSON.stringify(r)); }catch(e){}\n" +
   "          try{ const on = $('sheet') && $('sheet').classList.contains('on');\n" +
   "            if(on && DOCV && DOCV.key === key && String(DOCV.pick || '') === String(pick || '') && $('docP')) docShow(key, DOCV.title, r, pick, pick2);\n" +
   "            else if(key === 'PRREP' && box && $('stuSB') === box && JSON.stringify((c.rows || []).slice(29, 44)) !== JSON.stringify(r.rows.slice(29, 44))){ box.innerHTML = docHtml('PRREP', r.rows, 30, 44); docFit(box); }\n" +
   "          }catch(e){} }).catch(() => {}); }, 400);\n" +
   "        delete DOCFLY[k]; return c; }, () => { delete DOCFLY[k]; return base(key, pick, pick2); });\n" +
   "      return DOCFLY[k] = p;\n" +
   "    }catch(e){ return base.apply(this, arguments); } };\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1373 · fixed monthly pay"],
]);
