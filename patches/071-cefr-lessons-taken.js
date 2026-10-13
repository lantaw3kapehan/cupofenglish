// CEFR picture: lessons taken so far, under the current level (Misty, 13 Oct).
// "已上课时 · Lessons taken" = all lessons with us from S-MONTHLY when the server sends them (paste file Step 3b),
// otherwise the lessons used in the current package (ACTIVE). "剩余课时 · Lessons left" next to it when known.
require('../tools/lib.js')(process.argv[2], [
["window._CJ = { T, now, nxt, up, nowK, M: CJ_M, mk, mon, since: mon(st.d), who:",
 "window._CJ = { T, now, nxt, up, nowK, M: CJ_M, mk, mon, since: mon(st.d), tk: tot > 0 ? tot : (S.s && +S.s.done > 0 ? +S.s.done : null), tkAll: tot > 0, left: S.s && S.s.left != null && !S.s.shared ? +S.s.left : null, who:"],
["/* 1 · the staircase: low on the left",
 "if(J.tk != null || J.left != null){ const bw = (T.Wc - T.CX * 2 - 16) / 2, cards = [J.tk != null ? [J.tk, J.tkAll ? '已上课时 · Lessons taken' : '本期已上 · Lessons taken', J.tkAll ? 'with CupOfEnglish so far · 累计' : 'in this package · 本期课时包'] : null, J.left != null ? [J.left, '剩余课时 · Lessons left', 'in this package · 本期课时包'] : null].filter(Boolean);\ncards.forEach((c, i) => { const X = T.CX + i * (bw + 16); T.box(X, y, bw, 120, 22, '#F4FAFA', '#BFE6E3', 2); T.text(String(c[0]), X + 30, y + 78, '400 60px ' + T.B, T.TEAL); const nw = T.w(String(c[0]), '400 60px ' + T.B); T.text(c[1], X + 50 + nw, y + 56, '700 24px ' + T.F, T.NAVY); T.text(c[2], X + 50 + nw, y + 88, '400 19px ' + T.F, T.MUTE); }); y += 166; }\n/* 1 · the staircase: low on the left"]
]);
