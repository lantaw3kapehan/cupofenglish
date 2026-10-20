// 20 Oct · Class notice: the DATABASE name when ACTIVE carries another student's (Elsa showed "Eric"); the trial class is not part of the
// weekly schedule (Elsa's "Mon 21:00" was her trial); a first-class date over 6 months old (copied ACTIVE row) is not used as the purchase date.
require('../tools/lib.js')(process.argv[2], [
  ["CN = { code: code, name: pk[C.name] || code, cn: pk[C.cn] || '', kid: 1, rn: rn, L: L, pi: 0,",
   "const nf = (window.NAMEFIX || {})[code]; CN = { code: code, name: nf || pk[C.name] || code, cn: nf ? ((window.NAMEFIX || {})['cn:' + code] || '') : (pk[C.cn] || ''), kid: 1, rn: rn, L: (Array.isArray(L) ? L : []).filter(x => !/(^|-)\\s*TC(\\s+X)?\\s*$/i.test(String(x.title || '').trim()) && !/trial/i.test(String(x.title || ''))), pi: 0,"],
  ["st: String(r[C.start] || '').slice(0, 10), left: r[C.available] }))",
   "st: (s => s && Date.now() - new Date(s + 'T12:00:00').getTime() > 183 * 864e5 ? '' : s)(String(r[C.start] || '').slice(0, 10)), left: r[C.available] }))"]]);
