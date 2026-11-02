// 1702: (Misty, 2 Nov 10:23) "for our WeChat group name it should be this format now: 一杯英语Vita-33节课(ST-2026-127) · depending on
//   the lesson". The group name now has no spaces and carries the lessons of the student's current package (ACTIVE › ENROLLED of the
//   active package row, paid + free, e.g. 30 + 3 = 33): 一杯英语Vita-33节课(ST-2026-127). Siblings / shared package: the family's
//   names with the package holder's lessons and code, e.g. 一杯英语Una&Levin-68节课(ST-2023-046). With no package yet (trial),
//   the lessons part is left out: 一杯英语Becky(ST-2026-129). Used everywhere the app shows or copies the group name.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  async function load(){ try{ if(typeof D === 'undefined' || !D || !D.mgr || !TOKEN) return; const r = await call({ action: 'wx_get' });",
   "  /* 1702 · 一杯英语Vita-33节课(ST-2026-127): no spaces, the current package's lessons */\n" +
   "  const lessons1702 = code => { try{ if(typeof AT === 'undefined' || !AT || !AT.cols) return 0; const C = {}; AT.cols.forEach((c, i) => C[c] = i);\n" +
   "      const R = AT.rows.filter(r => up(r[C.code]) === up(code) && r[C.enrolled] !== '' && r[C.enrolled] != null && +r[C.enrolled] > 0);\n" +
   "      const pick = R.filter(r => r[C.active]).sort((a, b) => String(b[C.start] || '').localeCompare(String(a[C.start] || '')))[0] || R.sort((a, b) => String(b[C.start] || '').localeCompare(String(a[C.start] || '')))[0];\n" +
   "      return pick ? Math.round(+pick[C.enrolled] * 10) / 10 : 0; }catch(e){ return 0; } };\n" +
   "  window.wxLessons1702 = lessons1702;\n" +
   "  { const _g1702 = window.wxGroup; window.wxGroup = (name, code) => { const g = _g1702(name, code), m = String(g).match(/^一杯英语\\s*(.+?)\\s*\\((ST-\\d{4}-\\d{3})\\)$/i); if(!m) return g;\n" +
   "      const names = m[1].replace(/\\s*&\\s*/g, '&').replace(/\\s+/g, ' ').trim(), n = lessons1702(m[2]);\n" +
   "      return '一杯英语' + names + (n ? '-' + n + '节课' : '') + '(' + m[2].toUpperCase() + ')'; }; }\n" +
   "  async function load(){ try{ if(typeof D === 'undefined' || !D || !D.mgr || !TOKEN) return; const r = await call({ action: 'wx_get' });"]
]);
