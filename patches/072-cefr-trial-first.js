// CEFR journey logic (Misty, 13 Oct): the trial class is where the journey begins, so it sits on the START step, before "入学 Start",
// even when the trial teacher's estimate differs from the level they were placed at. Picture and in-app use the same rule.
// Renewals: the latest renewal (DATABASE › RENEWAL DATE) shows as "续费 Renewed" under the level they were at. Steps below the start level get no ✓.
// "Next goal" and "Up N level steps" now count the same whole levels as the staircase (A1 → next goal A2, not A1+).
require('../tools/lib.js')(process.argv[2], [
["const nxt = Math.min(CJ_L.length - 1, now + 1), up = now - st.i;",
 "let nxt = Math.min(CJ_L.length - 1, now + 1), up = now - st.i;"],
["const mk = i => CJ_M.findIndex(m => m[0] === String(CJ_L[i] || '').replace('+', '')), nowK = mk(now);",
 "const mk = i => CJ_M.findIndex(m => m[0] === String(CJ_L[i] || '').replace('+', '')), nowK = mk(now);\nnxt = (() => { for(let i = now + 1; i < CJ_L.length; i++) if(!/\\+/.test(CJ_L[i]) && mk(i) > nowK) return i; return now; })(); up = Math.max(0, nowK - mk(st.i));   /* whole levels, as on the staircase */"],
["const tg = T.filter(x => mk(x.i) === k)",
 "const tg = T.filter(x => (/^Trial/.test(x.en) && chain.length ? mk(chain[0]) : mk(x.i)) === k)"],
["J.T.filter(x => J.mk(x.i) === k).forEach(x => {",
 "J.T.filter(x => (/^Trial/.test(x.en) && st ? J.mk(st.i) : J.mk(x.i)) === k).forEach(x => {"],
["const tag = (x, light) =>",
 "{ const rd0 = cjDay(col(/RENEWAL DATE/i)); if(rd0 && rd0 > (st.d || '')){ const at = T.filter(x => x.d && x.d <= rd0 && !/^Trial/.test(x.en)).pop(); T.push({ d: rd0, i: at ? at.i : now, en: 'Renewed', zh: '续费' }); } }   /* the latest renewal, on the level they were at then */\nconst tag = (x, light) =>"],
["(x.start ? 'Start 起点' : /^Trial/.test(x.en) ? 'Trial 试听' : /^Level/.test(x.en) ? 'Up 升级' : 'Check 测评')",
 "(x.start ? 'Start 起点' : /^Trial/.test(x.en) ? 'Trial 试听' : /^Renew/.test(x.en) ? 'Renewed 续费' : /^Level/.test(x.en) ? 'Up 升级' : 'Check 测评')"],
["const EV = x => x.start ? '入学 Start' : /^Trial/.test(x.en) ? '试听 Trial' :",
 "const EV = x => x.start ? '入学 Start' : /^Renew/.test(x.en) ? '续费 Renewed' : /^Trial/.test(x.en) ? '试听 Trial' :"],
["s = k < J.nowK ? 'dn' :",
 "s = k < J.nowK ? (stK > -1 && k < stK ? 'lt' : 'dn') :"]
]);
