// 851: (audit 25 Oct, finding 5) Time-ins › "Today's timeline": dots for different time-ins sat almost on top of each other.
// Cause: the time axis ran from the first due hour to the later of (estimated end of the last class, now) — on a normal day
// 07:00 → 22:00 — squeezed into the phone's ~200 px track, so 07:22, 07:55 and 09:44 were only a few pixels apart.
// Also: a time-in earlier than the first due hour was pinned to the left edge (clamped), and the grey class bar used
// "first class + classes × 30 min" even when the real last class ended hours later.
// Changes (display only):
// · each hour gets at least 56 px; when the card is narrower, the timeline scrolls sideways inside the card
//   (teacher names stay pinned on the left, the time label on the right); every hour is labelled;
// · the axis starts at the earliest of due times AND time-ins, so an early time-in is drawn where it happened;
// · the class bar ends at the teacher's real last class today when Schedule for today is loaded; otherwise the old estimate.
// Status, counts and the time-in data are unchanged.
require('../tools/lib.js')(process.argv[2], [
  ["#v-team .tl11 .lg{display:flex",
   "#v-team .tl11 .sx{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -4px;padding:0 4px}\n" +
   "#v-team .tl11 .sx>div{min-width:var(--mw,0)}\n" +
   "#v-team .tl11 .sx .r>span,#v-team .tl11 .sx .ax>span:first-child{position:sticky;left:0;z-index:3;background:#fff}\n" +
   "#v-team .tl11 .sx .r>em,#v-team .tl11 .sx .ax>span:last-child{position:sticky;right:0;z-index:3;background:#fff}\n" +
   "#v-team .tl11 .lg{display:flex"],
  ["if(W.length){ const ends = W.map(x => { const f = new Date(x.first); const n = +x.classes || 1; return new Date(f.getTime() + Math.max(1, n) * 30 * 6e4); });",
   "if(W.length){ const k851 = n => String(n || '').replace(/^teacher\\s+/i, '').trim().toLowerCase(), td851 = typeof ymdLocal === 'function' ? ymdLocal(now) : '';\n" +
   "      const sc851 = (typeof SC !== 'undefined' && SC && SC.date === td851 && Array.isArray(SC.events)) ? SC.events.filter(e => !e.cancelled) : null;\n" +
   "      const tin851 = x => { const t = x.timeIn ? toDate(x.timeIn, new Date(x.first)) : null; return t && !isNaN(t) ? t : null; };\n" +
   "      const ends = W.map(x => { const f = new Date(x.first); const n = +x.classes || 1; const est = new Date(f.getTime() + Math.max(1, n) * 30 * 6e4);\n" +
   "        if(!sc851) return est; const L = sc851.filter(e => k851(e.teacher) === k851(x.name)).map(e => +new Date(e.end)).filter(v => !isNaN(v)); return L.length ? new Date(Math.max(...L)) : est; });   /* 851: real last class */"],
  ["let a = new Date(Math.min(...W.map(x => due(x).getTime()))); a.setMinutes(0, 0, 0); let b = new Date(Math.max(...ends.map(d => d.getTime()), now.getTime())); b.setMinutes(60, 0, 0);",
   "let a = new Date(Math.min(...W.map(x => { const d0 = due(x).getTime(), t = tin851(x); return t ? Math.min(d0, t.getTime()) : d0; }))); a.setMinutes(0, 0, 0);   /* 851: early time-ins inside the axis */\n" +
   "      let b = new Date(Math.max(...ends.map(d => d.getTime()), ...W.map(x => { const t = tin851(x); return t ? t.getTime() : 0; }), now.getTime())); b.setMinutes(60, 0, 0);"],
  ["      const step = hrs.length > 9 ? 2 : 1;",
   "      const step = 1, mw851 = 200 + Math.max(1, hrs.length - 1) * 56;   /* 851: at least 56 px per hour, scroll when narrower */"],
  ["'<div class=\"ax\"><span></span><div>'",
   "'<div class=\"sx\"><div style=\"--mw:' + mw851 + 'px\"><div class=\"ax\"><span></span><div>'"],
  ["'<div class=\"lg\"><span><i style=\"width:12px;height:12px;border-radius:6px;background:#00A3AD\"></i>on time",
   "'</div></div><div class=\"lg\"><span><i style=\"width:12px;height:12px;border-radius:6px;background:#00A3AD\"></i>on time"],
]);
