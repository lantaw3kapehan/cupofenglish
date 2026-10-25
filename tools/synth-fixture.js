#!/usr/bin/env node
// Builds a FULLY SYNTHETIC preview fixture from the recorded sample data.
// usage: node tools/synth-fixture.js [in=audit/fx/recs.json] [out=audit/fx/synth.json]
//   env SYNTH_SEED (default 'coe-synth-2026-10-25') · SYNTH_SHIFT_DAYS (default 364 = 52 weeks, keeps weekdays)
// Same input + same seed → byte-identical output.
// The output also holds one extra record { url: 'preview://clock', t: <ISO> } with the shifted clock, which
// tools/preview-build.js picks up automatically (or set PREVIEW_T0=<ISO> yourself).
// What it does (see audit/fx/SYNTH-REPORT.md): money × hidden factor per family (+noise); codes / invoice / event / case ids
// remapped; every date shifted by SHIFT_DAYS (month-only values by whole years); people renamed again (fresh made-up names),
// partners → "Partner A…"; free text → neutral sample text; URLs, files, devices, IPs, speeds, phones, e-mails, WeChat ids → fake.
'use strict';
const fs = require('fs');
const IN = process.argv[2] || 'audit/fx/recs.json', OUT = process.argv[3] || 'audit/fx/synth.json';
const SEED = process.env.SYNTH_SEED || 'coe-synth-2026-10-25';
const SHIFT_DAYS = +(process.env.SYNTH_SHIFT_DAYS || 364);
if(SHIFT_DAYS % 7) throw new Error('SYNTH_SHIFT_DAYS must be whole weeks');
const DAY = 864e5, SHIFT_MS = SHIFT_DAYS * DAY, YEARS = Math.round(SHIFT_DAYS / 365.2425);
const T0_ORIG = Date.parse('2026-10-25T05:50:00Z'), T0_NEW = new Date(T0_ORIG + SHIFT_MS).toISOString();

/* ---------- deterministic randomness: every draw is keyed, so traversal order never matters ---------- */
function h32(s){ let h = 2166136261 >>> 0; for(let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
function rng(key){ let a = h32(SEED + '|' + key); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const U = key => rng(key)();
const pick = (arr, key) => arr[Math.floor(U(key) * arr.length)];
const pad = (n, w) => String(n).padStart(w, '0');

const recs = JSON.parse(fs.readFileSync(IN, 'utf8'));
const parsed = recs.map(r => { let t = null, b = null; try{ t = JSON.parse(r.t); }catch(e){} try{ b = JSON.parse(r.body); }catch(e){} return { r, t, b }; });
const RAW = JSON.stringify(recs);
const EP = u => { u = String(u).split('?')[0]; const m = u.match(/functions\/v1\/([^/]+)/); if(m) return m[1]; if(/\/exec$/.test(u)) return 'exec'; return u.split('/').pop(); };
const OPN = b => (b && (b.fn || b.op || b.action)) || '';

/* ---------- calendar helpers ---------- */
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONF = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MRX = '(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
const mIdx = w => MON.indexOf(w.slice(0, 3));
const mName = (i, like) => like.length > 3 && like !== 'Sept' ? MONF[i] : MON[i];
function sh(y, m, d){ const D = new Date(Date.UTC(y, m - 1, d) + SHIFT_MS); return [D.getUTCFullYear(), D.getUTCMonth() + 1, D.getUTCDate()]; }
function guessYear(m, d){ let best = 2026, bd = Infinity; for(const y of [2025, 2026, 2027]){ const x = Math.abs(Date.UTC(y, m - 1, d) - T0_ORIG); if(x < bd){ bd = x; best = y; } } return best; }
const okYMD = (y, m, d) => y >= 1990 && y <= 2099 && m >= 1 && m <= 12 && d >= 1 && d <= 31;

/* ---------- collect identifiers ---------- */
// student codes / teacher codes / case ids → order-preserving remap into fake year 2099
function orderMap(re, fmt, width){ const all = [...new Set(RAW.match(re) || [])].sort(); const M = {}; let n = 0; const room = Math.pow(10, width) - 1;
  const step = Math.max(1, Math.floor((room - 1) / Math.max(1, all.length)));
  all.forEach((c, i) => { n += 1 + Math.floor(U('gap|' + c) * Math.min(step, 3)); if(n > room) n = room - (all.length - i); M[c] = fmt(pad(n, width)); }); return M; }
const STM = orderMap(/ST-\d{4}-\d{3}/g, n => 'ST-2099-' + n, 3);
const COEM = orderMap(/COE-\d{4}-\d{2}/g, n => 'COE-2099-' + n, 2);
const OARM = orderMap(/OAR-\d{4}-\d{3}/g, n => 'OAR-2099-' + n, 3);
// Google Calendar event ids (26 chars base32hex)
const EVM = {}; const B32 = '0123456789abcdefghijklmnopqrstuv';
(RAW.match(/(?<![a-z0-9])[a-v0-9]{26}(?![a-z0-9])/g) || []).forEach(id => { if(EVM[id]) return; const R = rng('ev|' + id); let s = ''; for(let i = 0; i < 26; i++) s += B32[Math.floor(R() * 32)]; EVM[id] = s; });
// invoice numbers: additive offset keeps ranges ("1683–1688") meaningful
const INV_OFF = 4000 + Math.floor(U('invoff') * 900);
const invMap = n => String(+n + INV_OFF);

/* ---------- people: collect every name used in name-like places, give each a fresh made-up name ---------- */
const STOP = new Set(('CupOfEnglish Cupofenglish COE Operations Operation Management Manager President Teacher Teachers Admin App Health health Unmatched Trial ' +
  'Mom Dad Mother Father Ms Mr Mrs Dr Tr Sir Student Students Parent Partner Sample City Province Office System Auto Via Waived None Other Others NA ' +
  'Newly Hired Starting Qualified Junior Senior Master Coordinator Sun Mon Tue Wed Thu Fri Sat Jan Feb Mar Apr Jun Jul Aug Sep Sept Oct Nov Dec ' +
  'January February March June July August September October November December Total Still Paid Checks Regular New Long Term TRUE FALSE Pending ' +
  'Ab Air Aix All At Bfsu Brother Sister Class Cousin Daughter Son Daily Drive Early Jinan Linked LongVowels ShortVowels Mb Kb Od Quant Remote Screenshot Uploaded Video Web Website Wonders ' +
  'You He She Well Book Books Online Offline Group Family Phone Laptop Desktop Windows Mac Android Chrome Edge Safari Unknown Yes No Not').split(/\s+/));
const NAMEKEYS = new Set(['student', 'teacher', 'name', 'who', 'by', 'from', 'to', 'employee', 'sharedName', 'sent_by', 'decidedBy', 'by_name', 'by_who', 'me', 'en', 'cn', 'trialTeacher', 'reply_by']);
const NOTNAME_PATH = /ranks\[\]\.name|next\.name|sales\[\]\.name|vidflags.*list\[\]\.name|books\.list|parts\[\]|trainings\[\]|contract:list\.docs|proof\[\]\.name|wallets?\[\]|lists\.(subject|type|tier|source|status|condition)|setupUrl/;
const NAMELISTKEYS = new Set(['teachers', 'mgmtAll', 'office', 'employee', 'teacher']);
const nameVals = new Set(), cjkVals = new Set();
function addName(v){ v = String(v || '').trim(); if(!v || /^ST-|^COE-|@|^https?:/.test(v) || v.length > 60) return;
  for(const piece of v.split(/[\s·,()\/+&]+/)){ const w = piece.replace(/['’]s$/, '');
    if(/^[一-鿿]+\d*$/.test(w)) { cjkVals.add(w); continue; }
    if(!/^[A-Za-z][A-Za-z'’]*$/.test(w) || w.length < 2) continue;
    const n = w === w.toUpperCase() || w === w.toLowerCase() ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w;
    if(!STOP.has(n) && !STOP.has(w)) nameVals.add(n); } }
function collect(v, path, key){
  if(Array.isArray(v)){ if(NAMELISTKEYS.has(key) && !NOTNAME_PATH.test(path)) v.forEach(x => typeof x === 'string' && addName(x)); v.forEach(x => collect(x, path + '[]', key)); return; }
  if(v && typeof v === 'object'){ for(const k in v) collect(v[k], path + '.' + k, k); return; }
  if(typeof v === 'string' && NAMEKEYS.has(key) && !NOTNAME_PATH.test(path)) addName(v);
}
parsed.forEach(p => p.t && collect(p.t, EP(p.r.url) + ':' + OPN(p.b), ''));
// tables with header rows: names in DATABASE (cols B, C, trial teacher), PAYROLL (teacher), ACTIVE (name, cn, teacher), TODAY/PAY sheets (STUDENT / TEACHER columns)
const DOCS = {}; parsed.forEach(p => { if(p.t && p.t.docs && EP(p.r.url) === 'coe') Object.assign(DOCS, p.t.docs); });
const PAYTAB = (parsed.find(p => EP(p.r.url) === 'exec' && OPN(p.b) === 'mgmtTab') || {}).t;
function sheetNameCols(rows){ let cols = null; (rows || []).forEach(r => { if(!Array.isArray(r)) return; const up = r.map(c => String(c).trim().toUpperCase());
  const ix = up.map((c, i) => /^(STUDENT|TEACHER)$/.test(c) ? i : -1).filter(i => i > -1); if(ix.length){ cols = ix; return; } if(!r.some(c => c !== '' && c != null)){ cols = null; return; }
  if(cols) cols.forEach(i => addName(r[i])); }); }
(function(){ const db = DOCS['pres:mgmtDatabase|[]']; if(db) db.data.rows.forEach(r => [1, 2, 14].forEach(i => addName(r[i])));
  const pr = DOCS['pres:mgmtPayroll|[]']; if(pr) pr.data.rows.forEach(r => addName(r[1]));
  const ac = DOCS['mgmt:mgmtActive|[]']; if(ac){ const C = ac.data.cols; ac.data.rows.forEach(r => ['name', 'cn', 'teacher'].forEach(k => addName(r[C.indexOf(k)]))); }
  const td = DOCS['sys:todaydb']; if(td) sheetNameCols(td.data.rows);
  if(PAYTAB) sheetNameCols(PAYTAB.data.rows);
  ['pres:mgmtTab|["MONEY"]'].forEach(k => DOCS[k] && sheetNameCols(DOCS[k].data.rows));
  const st = Object.keys(DOCS).filter(k => /mgmtStudent\|/.test(k)); st.forEach(k => (DOCS[k].data.profile.row || []).slice(1, 3).forEach(addName));
  (DOCS['coe-trials'] || []);
  parsed.filter(p => EP(p.r.url) === 'coe-trials').forEach(p => (p.t.list || []).forEach(x => { addName(x.t); if(!/[-–]/.test(x.s)) addName(x.s); }));
  // a few name pieces found only inside contract names, signatures and file names
  ['Misty', 'Dagyapen', 'Pescador', 'Alysia', 'Maglaya', 'Pascual', 'Chloe', 'Xyrene'].forEach(addName);
  parsed.forEach(p => { if(!p.t) return; (p.t.rows || []).forEach(x => { if(x && typeof x === 'object' && 'typed_name' in x) ['typed_name', 'pres_name', 'wit_name'].forEach(k => addName(x[k])); }); });
})();
// tokens that are also ordinary words / months: only replaced where safe (see nameRe)
const MONTHLIKE = new Set(['April', 'May', 'June', 'July', 'August']);
// fresh made-up names, never equal to an original token
const ON = ['B','D','F','G','H','J','K','L','M','N','P','R','S','T','V','Z','Br','Tr','Kl','Th','Ch'], VO = ['a','e','i','o','u','ia','eo','ai'], CO = ['n','r','l','s','m','th','v','k','d'];
const used = new Set([...nameVals].map(x => x.toLowerCase()));
function fakeName(key){ const R = rng('nm|' + key); for(let tries = 0; tries < 50; tries++){ const syl = 2 + (R() < 0.35 ? 1 : 0); let s = '';
    for(let i = 0; i < syl; i++) s += (i ? CO[Math.floor(R() * CO.length)] : ON[Math.floor(R() * ON.length)]) + VO[Math.floor(R() * VO.length)];
    if(R() < 0.3) s += CO[Math.floor(R() * CO.length)]; s = s[0].toUpperCase() + s.slice(1);
    if(s.length >= 4 && !used.has(s.toLowerCase())){ used.add(s.toLowerCase()); return s; } } return 'Nameless' + (h32(key) % 1000); }
const NM = {}; [...nameVals].sort().forEach(n => { NM[n] = fakeName(n); });
// Chinese names (and the old "学生NNN" placeholders) → fresh "学生NNN"
const CJM = {}; { const usedN = new Set(); [...cjkVals].sort().forEach(c => { let n; let i = 0; do { n = 100 + Math.floor(U('cj|' + c + '|' + i++) * 900); } while(usedN.has(n)); usedN.add(n); CJM[c] = '学生' + n; }); }
const nameList = Object.keys(NM).sort((a, b) => b.length - a.length);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const titleRe = new RegExp('(?<![A-Za-z\\u00C0-\\u024F])(' + nameList.filter(n => !MONTHLIKE.has(n)).map(esc).join('|') + ')(?![A-Za-z\\u00C0-\\u024F])', 'g');
const monthNameRe = new RegExp('(?<![A-Za-z\\d][ -]?)(' + nameList.filter(n => MONTHLIKE.has(n)).map(esc).join('|') + ')(?![A-Za-z])(?!\\s*(\\d|//))(?!\\s+[a-z])', 'g');
const lowerRe = new RegExp('(?<![A-Za-z])(' + nameList.filter(n => n.length >= 4 && !MONTHLIKE.has(n)).map(n => esc(n.toLowerCase())).join('|') + ')(?![A-Za-z])', 'g');
const upperRe = new RegExp('(?<![A-Za-z])(' + nameList.filter(n => n.length >= 3).map(n => esc(n.toUpperCase())).join('|') + ')(?![A-Za-z])', 'g');
const cjkRe = new RegExp(Object.keys(CJM).sort((a, b) => b.length - a.length).map(esc).join('|'), 'g');
const NMl = {}, NMu = {}; for(const k in NM){ NMl[k.toLowerCase()] = NM[k].toLowerCase(); NMu[k.toUpperCase()] = NM[k].toUpperCase(); }
function renameAll(s, opts){ s = s.replace(titleRe, m => NM[m] || m).replace(monthNameRe, m => NM[m] || m);
  if(opts && opts.lower) s = s.replace(lowerRe, m => NMl[m] || m);
  if(opts && opts.upper) s = s.replace(upperRe, m => NMu[m] || m);
  return s.replace(cjkRe, m => CJM[m] || m); }
const mapExactName = v => { const t = String(v); if(NM[t]) return NM[t]; const tl = t.toLowerCase(); for(const k in NM) if(k.toLowerCase() === tl) return t === tl ? NM[k].toLowerCase() : t === t.toUpperCase() ? NM[k].toUpperCase() : NM[k]; return null; };

/* ---------- partners ---------- */
const KEEP_SRC = /^(CupOfEnglish|COE|N\/A|Referral|IELTS|TOEFL|Adult English|Adult English - Ph|Reading Program|Adults|WeChat|Facebook|Walk-in|Others?|)$/i;
const partnerLabels = new Set();
function addSrc(s){ s = String(s || '').trim(); if(!s || /^ST-\d/.test(s) || KEEP_SRC.test(s)) return; if(/[-–]\s*(Dr|Ms|Mr|Mrs)\.|^(Partner · )?(Dr|Ms|Mr|Mrs)\. |University|College|Academy|Institute|School/.test(s)) partnerLabels.add(s); }
parsed.forEach(p => { if(!p.t) return; const e = EP(p.r.url);
  if(e === 'coe-expenses') (p.t.sales || []).forEach(x => addSrc(x.src)); if(e === 'coe-trials') (p.t.list || []).forEach(x => addSrc(x.s));
  if(e === 'coe-wallet') (p.t.sales || []).forEach(x => addSrc(x.partner)); if(OPN(p.b) === 'mgmtEnqList') (p.t.data.rows || []).forEach(x => addSrc(x.src)); });
(function(){ const db = DOCS['pres:mgmtDatabase|[]']; if(db) db.data.rows.forEach(r => addSrc(r[22]));
  const ac = DOCS['mgmt:mgmtActive|[]']; if(ac){ const i = ac.data.cols.indexOf('source'); ac.data.rows.forEach(r => addSrc(r[i])); }
  Object.keys(DOCS).filter(k => /dbRecord/.test(k)).forEach(k => addSrc(DOCS[k].data.source));
  const mo = DOCS['pres:mgmtTab|["MONEY"]']; if(mo){ let on = false; mo.data.rows.forEach(r => { if(String(r[0]) === 'PARTNER'){ on = true; return; } if(!r.some(c => c !== '')){ on = false; return; } if(on) addSrc(r[0]); }); } })();
const personOf = s => { const m = s.match(/(?:Dr|Ms|Mr|Mrs)\.\s*([A-Za-z]+)/); if(m) return m[1]; return s.replace(/^.*?[-–]\s*/, '').trim(); };
const pCount = {}; [...partnerLabels].forEach(l => { const p = personOf(l); pCount[p] = (pCount[p] || 0) + 1; });
const pLetter = {}; Object.keys(pCount).sort((a, b) => pCount[b] - pCount[a] || (a < b ? -1 : 1)).forEach((p, i) => { pLetter[p] = 'Partner ' + String.fromCharCode(65 + i); });
const PARTNER = {}; [...partnerLabels].forEach(l => { const P = pLetter[personOf(l)]; const pre = (l.match(/^(IELTS|Adults?|Adult English)\s*[-–]\s*/) || [])[1]; const post = /\bAdult$/.test(l) && !pre ? ' Adult' : '';
  PARTNER[l] = (/^Partner · /.test(l) ? 'Partner · ' : '') + (pre ? pre + ' - ' : '') + P + post; });
// bare "Dr. Spring" / "Ms. Spring" mentions
const bareTitles = {}; Object.keys(pLetter).forEach(p => { if(/^[A-Za-z]+$/.test(p)) bareTitles[p] = pLetter[p]; });
const partnerRe = new RegExp(Object.keys(PARTNER).sort((a, b) => b.length - a.length).map(esc).join('|') || '(?!)', 'g');
const bareRe = new RegExp('(?:Dr|Ms|Mr|Mrs)\\.\\s*(' + (Object.keys(bareTitles).map(esc).join('|') || '(?!)') + ')\\b', 'g');

/* ---------- cities / expense descriptions ---------- */
const CITIES = ['Harbor City', 'Riverside', 'Lakeview', 'Hillcrest', 'Northgate', 'Eastport', 'Westfield', 'Sunvale', 'Greenhaven', 'Stonebridge', 'Maplewood', 'Fairview'];
const cityMap = {}; const cityOf = c => c ? (cityMap[c] = cityMap[c] || pick(CITIES, 'city|' + c)) : c;
const EXP = { 'Rent': ['Office rent', 'Monthly rent'], 'Utilities': ['Electricity bill', 'Water bill', 'Internet bill'], 'Food & Meals': ['Team snacks', 'Staff lunch', 'Coffee supplies'],
  'IT & Software/Subscriptions': ['Software subscription', 'Cloud storage plan', 'Domain renewal', 'Video app plan'], 'Banking & Payment Charges': ['Bank transfer fee', 'Payment service fee'],
  'Miscellaneous': ['Miscellaneous expense', 'Courier fee', 'Printing'], 'Repairs & Maintenance': ['Aircon cleaning', 'Repair service'], 'Equipment & Assets': ['Headset', 'Webcam', 'Laptop accessory'],
  'Supplies & Office Materials': ['Office supplies', 'Printer ink', 'Paper and pens'], 'Fare': ['Transport fare'], 'Training & Development': ['Training materials'], 'Travel & Conference': ['Conference fee'],
  'Bootcamp': ['Workshop materials'], 'Payroll & Professional Fees': ['Professional fee'], 'Mandatory Benefit': ['Benefit contribution'], 'Marketing & Branding': ['Social media ads', 'Printed flyers'],
  'Government Contributions': ['Government contribution'] };
const expMap = {}; parsed.filter(p => EP(p.r.url) === 'coe-expenses').forEach(p => (p.t.rows || []).forEach(x => { if(x.t && !expMap[x.t]) expMap[x.t] = pick(EXP[x.c] || ['General expense'], 'exp|' + x.t); }));

/* ---------- money ---------- */
// families: pay (salaries, rates, payroll sheets), fin (sales, expenses, wallets, MONEY sheet), act (penalties / incentives), misc
const AMT = new Set(); (RAW.replace(/\\u20b1/g, '₱').match(/[₱¥]\s?-?\d[\d,]*(?:\.\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?/g) || []).forEach(m => AMT.add(+m.replace(/[^\d.]/g, '')));
(function grab(v, k){ if(Array.isArray(v)) return v.forEach(x => grab(x, k)); if(v && typeof v === 'object') return Object.keys(v).forEach(kk => grab(v[kk], kk)); if(typeof v === 'number' && /^(base|bonus|deduct|gov|lessonPay|net|rate|pay|a|rmb|cny|fee|php|balance|fees|in|out|sales|tfee|tin|tout|penalty|incentive)$/.test(k)) AMT.add(Math.abs(v)); })(parsed.map(p => p.t), '');
AMT.delete(0);
const FACT = {}; const factor = fam => FACT[fam] || (FACT[fam] = 0.6 + 0.8 * U('fam|' + fam));
function money(v, fam, step){ if(!v) return v; const neg = v < 0, a = Math.abs(v); const noise = 1 + (U('nz|' + fam + '|' + a) - 0.5) * 0.06; let x = a * factor(fam) * noise;
  const dec = Math.round(a * 100) % 100 !== 0;
  const q = step || (dec ? 0.01 : a >= 1000 && a % 50 === 0 ? 50 : a % 10 === 0 ? 10 : a % 5 === 0 ? 5 : 1);
  x = dec && !step ? Math.round(x * 100) / 100 : Math.max(q, Math.round(x / q) * q);
  // never land on an amount that exists in the real data (nudge by one rounding step at a time)
  for(let k = 1; k < 40 && AMT.has(x); k++){ const y = Math.round((x + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * q) * 100) / 100; if(y > 0 && !AMT.has(y)){ x = y; break; } }
  return neg ? -x : x; }
const fmtMoney = (x, decs) => x.toLocaleString('en-US', { minimumFractionDigits: decs, maximumFractionDigits: decs });
function moneyStr(s, fam, plainToo){
  s = s.replace(/([-−]?)([₱¥])(\s?)([-−]?)(\d{1,3}(?:,\d{3})+|\d+)(\.\d{1,2})?/g, (m, n1, sym, sp, n2, int, dec) => {
    const v = +(int.replace(/,/g, '') + (dec || '')); const x = money(v, fam); const d = dec ? dec.length - 1 : 0;
    const comma = int.includes(',') || (v < 1000 && x >= 1000);
    return n1 + sym + sp + n2 + (comma ? fmtMoney(x, d) : (d ? x.toFixed(d) : String(x))); });
  if(plainToo) s = s.replace(/(?<![\d.,:₱¥\/-])(-?)(\d{1,3}(?:,\d{3})+)(\.\d{2})?(?![\d,])/g, (m, n, int, dec) => { const v = +(int.replace(/,/g, '') + (dec || '')); return n + fmtMoney(money(v, fam), dec ? 2 : 0); });
  return s; }

/* ---------- the string transform ---------- */
let SENT = []; const put = v => '' + (SENT.push(v) - 1) + '';
const restore = s => { for(let i = 0; i < 4 && //.test(s); i++) s = s.replace(/(\d+)/g, (m, i) => SENT[+i]); return s; };
const URL_PH = u => /maps\.google/.test(u) ? 'https://example.invalid/map' : /drive\.google|docs\.google|photos\.google|googleusercontent/.test(u) ? 'https://example.invalid/file' :
  /supabase\.co\/storage/.test(u) ? 'https://example.invalid/storage' : 'https://example.invalid/link';
function S(str, fam, opts){
  if(typeof str !== 'string' || !str) return str; opts = opts || {}; let s = str;
  s = s.replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+\/=]+/g, () => put('data:,removed'));
  s = s.replace(/https?:\/\/[^\s"'<>)]+/g, u => put(URL_PH(u)));
  s = s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, e => put('user' + (h32(e) % 900 + 100) + '@example.invalid'));
  s = s.replace(/(?<![\d.])(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?![\d.])/g, ip => put('203.0.113.' + (h32(ip) % 250 + 1)));
  s = s.replace(/wxid_[A-Za-z0-9_-]+/g, w => put('wxid_sample' + (h32(w) % 900 + 100)));
  s = s.replace(/(\+63|\+86)[\s-]?\d[\d\s-]{7,}\d|(?<!\d)09\d{2}[\s-]?\d{3}[\s-]?\d{4}(?!\d)/g, () => put('+00 000 000 0000'));
  s = s.replace(/Misty T\. Dagyapen/g, () => put('The Management Team'));
  s = s.replace(partnerRe, m => put(PARTNER[m])).replace(bareRe, (m, p) => put(bareTitles[p]));
  if(opts.exp && expMap[s] && !EXP[s]) return expMap[s];
  if(opts.exp){ const m = s.match(/^(.+) · ([A-Z][A-Za-z &\/]+)$/); if(m && expMap[m[1]] && EXP[m[2]]) return expMap[m[1]] + ' · ' + m[2]; }
  // codes and ids
  s = s.replace(/ST-\d{4}-\d{3}/g, c => put(STM[c] || c)).replace(/COE-\d{4}-\d{2}/g, c => put(COEM[c] || c)).replace(/OAR-\d{4}-\d{3}/g, c => put(OARM[c] || c));
  s = s.replace(/(?<![a-z0-9])[a-v0-9]{26}(?![a-z0-9])/g, id => put(EVM[id] || id));
  s = s.replace(/PaymentConfirmation(\d+)_[^\s"]*/g, (m, n) => put('PaymentConfirmation' + invMap(n) + '_Sample'));
  s = s.replace(/Invoice_?(\d{3,5})_[^\s"]*?\.pdf/gi, (m, n) => put('Invoice' + invMap(n) + '_Sample.pdf'));
  s = s.replace(/\bInvoice (\d{3,5})\b/g, (m, n) => put('Invoice ' + invMap(n)));
  s = s.replace(/(Missing in SALES: )([\d–, ]+)/g, (m, a, list) => a + put(list.replace(/\d{3,5}/g, invMap)));
  // compact date ids
  s = s.replace(/\b(LV|MS|EQ)-(\d{2})(\d{2})(\d{2})(\d{4,6})/g, (m, p, y, mo, d, t) => { if(!okYMD(2000 + +y, +mo, +d)) return m; const [Y, M, D] = sh(2000 + +y, +mo, +d); return put(p + '-' + pad(Y % 100, 2) + pad(M, 2) + pad(D, 2) + t); });
  s = s.replace(/\bAUTO-([A-Z]+)-([A-Z]+)-(\d{2})(\d{2})(\d{2})(\d{4})\b/g, (m, a, who, y, mo, d, t) => { const [Y, M, D] = sh(2000 + +y, +mo, +d); return put('AUTO-' + a + '-' + (NMu[who] || who) + '-' + pad(Y % 100, 2) + pad(M, 2) + pad(D, 2) + t); });
  // a June label the earlier anonymiser had turned into a name
  s = s.replace(/(\d{1,2})-Hanadi-(\d{4})/g, '$1-Jun-$2').replace(/\bHanadi (\d{4})\b/g, 'Jun $1').replace(/\bHanadi (\d{1,2})(?![\d:])/g, 'Jun $1');
  // JavaScript Date.toString() text, e.g. "Tue May 05 2026 00:00:00 GMT+0800 (…"
  s = s.replace(new RegExp('\\b(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat) ' + MRX + ' (\\d{2}) (\\d{4})(?= \\d\\d:\\d\\d)', 'g'), (m, mw, d, y) => { const [Y, M, D] = sh(+y, mIdx(mw) + 1, +d); const wd = new Date(Date.UTC(Y, M - 1, D)).toUTCString().slice(0, 3); return put(wd + ' ' + MON[M - 1] + ' ' + pad(D, 2) + ' ' + Y); });
  // dates (typo dates with a 5+ digit year are blanked)
  s = s.replace(/(?<!\d)\d{5,}-\d{2}-\d{2}(?!\d)/g, () => put('—'));
  s = s.replace(/(?<!\d)(20\d{2})(\d{2})(\d{2})(T?)(\d{6})(?!\d)/g, (m, y, mo, d, T, t) => { if(!okYMD(+y, +mo, +d)) return m; const [Y, M, D] = sh(+y, +mo, +d); return put(Y + pad(M, 2) + pad(D, 2) + T + t); });
  s = s.replace(/(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/g, (m, y, mo, d) => { if(+y < 1990 && +mo >= 1 && +mo <= 12) return put('—'); if(!okYMD(+y, +mo, +d)) return m; const [Y, M, D] = sh(+y, +mo, +d); return put(Y + '-' + pad(M, 2) + '-' + pad(D, 2)); });
  s = s.replace(/(?<![\d-])(20\d{2})-(0[1-9]|1[0-2])(?!-?\d)/g, (m, y, mo) => put((+y + YEARS) + '-' + mo));
  s = s.replace(/(?<!\d)(\d{4})\.(\d{2})\.(\d{2})(?!\d)/g, (m, y, mo, d) => { if(!okYMD(+y, +mo, +d)) return m; const [Y, M, D] = sh(+y, +mo, +d); return put(Y + '.' + pad(M, 2) + '.' + pad(D, 2)); });
  s = s.replace(new RegExp('(?<!\\d)(\\d{1,2})-' + MRX + '-(\\d{4})', 'g'), (m, d, mw, y) => { const [Y, M, D] = sh(+y, mIdx(mw) + 1, +d); return put((d.length === 2 ? pad(D, 2) : D) + '-' + mName(M - 1, mw) + '-' + Y); });
  s = s.replace(new RegExp(MRX + '-(\\d{1,2})-(\\d{4})', 'g'), (m, mw, d, y) => { const [Y, M, D] = sh(+y, mIdx(mw) + 1, +d); return put(mName(M - 1, mw) + '-' + (d.length === 2 ? pad(D, 2) : D) + '-' + Y); });
  s = s.replace(new RegExp('\\b' + MRX + ' (\\d{1,2}), (\\d{4})', 'g'), (m, mw, d, y) => { const [Y, M, D] = sh(+y, mIdx(mw) + 1, +d); return put(mName(M - 1, mw) + ' ' + D + ', ' + Y); });
  s = s.replace(new RegExp('\\b' + MRX + '(\\s+|//)(20\\d{2})\\b', 'g'), (m, mw, sp, y) => put(mw + sp + (+y + YEARS)));
  s = s.replace(new RegExp('\\b' + MRX + ' (\\d{1,2})(?![\\d,:]|\\.\\d)', 'g'), (m, mw, d) => { if(opts.monthLabels) return m; const mo = mIdx(mw) + 1; if(+d > 31) return m; const [, M, D] = sh(guessYear(mo, +d), mo, +d); return put(mName(M - 1, mw) + ' ' + D); });
  s = s.replace(new RegExp('(?<![\\d-])(\\d{1,2}) ' + MRX + '\\b(?![-\\d])', 'g'), (m, d, mw) => { const mo = mIdx(mw) + 1; if(+d > 31 || +d < 1) return m; const [, M, D] = sh(guessYear(mo, +d), mo, +d); return put(D + ' ' + mName(M - 1, mw)); });
  s = s.replace(/(?<![\d-])(\d{2})-(\d{2}) (\d{2}:\d{2})/g, (m, mo, d, t) => { if(!okYMD(2026, +mo, +d)) return m; const [, M, D] = sh(guessYear(+mo, +d), +mo, +d); return put(pad(M, 2) + '-' + pad(D, 2) + ' ' + t); });
  s = s.replace(/^(20\d{2})( \(to date\))?$/, (m, y, t) => put((+y + YEARS) + (t || ''))).replace(/\bBefore (20\d{2})\b/, (m, y) => put('Before ' + (+y + YEARS))).replace(/\|(20\d{2})$/, (m, y) => put('|' + (+y + YEARS)));
  // epoch milliseconds inside strings (file names, keys)
  s = s.replace(/(?<!\d)(1[6-9]\d{11})(?!\d)/g, n => put(String(+n + SHIFT_MS)));
  // money
  if(fam) s = moneyStr(s, fam, opts.plainMoney);
  // speeds, distances
  s = s.replace(/↓ [\d.]+ Mbps · ↑ [\d.]+ Mbps · \d+ ms · jitter [\d.]+ ms/g, m => { const R = rng('spd|' + m); return put('↓ ' + (40 + R() * 160).toFixed(1) + ' Mbps · ↑ ' + (15 + R() * 70).toFixed(1) + ' Mbps · ' + Math.round(20 + R() * 40) + ' ms · jitter ' + (R() * 5).toFixed(1) + ' ms'); });
  s = s.replace(/[\d.]+ km from time-in place/g, m => put((1 + U('km|' + m) * 30).toFixed(1) + ' km from time-in place'));
  s = renameAll(s, opts);
  s = restore(s); SENT = [];
  return s;
}

/* ---------- neutral sample text ---------- */
const POOL = {
  en: ['The lesson went smoothly today.', 'Please review the notes before the next class.', 'Practice the new words for ten minutes a day.', 'Good effort and steady progress this week.',
    'We will continue with the next unit.', 'Reading aloud is getting more confident.', 'Kindly confirm the schedule for next week.', 'Thank you for the update.',
    'This is a sample note for the preview.', 'Listening practice helped a lot.', 'Speaking turns were short but clear.', 'Homework was checked and returned.',
    'More practice with sentence building is suggested.', 'Pronunciation of long vowels improved.', 'The class started on time.', 'Materials were shared before class.'],
  cancel: ['Schedule change requested.', 'Class moved at the family\'s request.', 'Teacher unavailable.', 'Rescheduled to a later date.', 'Student has another activity.'],
  action: ['Teacher informed; adjustment recorded.', 'Reviewed and noted.', 'Sample action note.', 'Reminder sent; noted in the log.', 'Bonus recorded for this month.', 'Handled by the office.'],
  msg: ['Hello team, this is a sample announcement for the preview.', 'Please check the updated guidelines in the app.', 'Reminder: please complete this month\'s checklist.',
    'Thank you all for your hard work this week.', 'A short update about class schedules is attached.', 'Please confirm once you have read this message.'],
  cn: ['这是一段示例文字。', '学生在课堂上表现积极。', '请在下次课前复习。', '本周进步明显。', '我们将继续学习下一单元。']
};
function sample(orig, kind){ orig = String(orig || ''); if(!orig.trim()) return orig; const cn = /[一-鿿]/.test(orig) && !/[a-z]{4}/i.test(orig.replace(/[^\x00-\x7f]/g, '')) ;
  const pool = cn ? POOL.cn : POOL[kind] || POOL.en; const R = rng('tx|' + kind + '|' + orig); const target = Math.max(8, orig.length); let out = '';
  while(out.length < target * 0.9){ out += (out ? (cn ? '' : ' ') : '') + pool[Math.floor(R() * pool.length)]; if(out.length > target * 1.4) break; }
  return out; }
// keep app-recognised prefixes ("📌 Task ·", "progress check (ST-…)", "⚠ My follow-up plan ·" …) and a trailing " · name · date" stamp
const PREFIX = /^(📌\s*Task\s*·|📌[^|\n]{0,40}\||⚠️?\s*My follow-up plan\s*·|[✅⚠️]+\s*App health today:\s*\w+|End of shift [\d:]+|APP UPDATE \||@Mention All|Tip:|Reminder:|Correction:|Dear Teachers,|Good evening, teachers!)/u;
function freeText(v, kind, fam){ if(typeof v !== 'string' || !v.trim()) return v; if(/^[\p{Emoji}\s✓✔️]+$/u.test(v) || /^(Got it!?|OK|Noted\.?)$/i.test(v)) return v;
  let pre = (v.match(PREFIX) || [''])[0], body = v.slice(pre.length), tail = '';
  const parts = body.split(' · '); const meta = []; while(parts.length > 1 && /^(\d|[A-Z][a-z]+$|CupOfEnglish$|Oct|Nov|Sep|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|via |stopped from|Waived|Changed to|Teacher \w+$)/.test(parts[parts.length - 1].trim()) && parts[parts.length - 1].length < 40) meta.unshift(parts.pop());
  if(meta.length) tail = ' · ' + meta.join(' · ');
  const pc = (v.match(/progress check\s*\(ST-\d{4}-\d{3}\)/i) || [])[0];
  return S(pre, fam) + (pre ? ' ' : '') + sample(parts.join(' · '), kind) + (pc ? ' — ' + S(pc, fam) : '') + S(tail, fam); }

/* ---------- structured walk ---------- */
const MONEYKEYS = { base: 1, bonus: 1, deduct: 1, gov: 1, lessonPay: 1, net: 1, rate: 1, pay: 1, a: 1, rmb: 1, cny: 1, fee: 1, php: 1, expected: 1, balance: 1, fees: 1, in: 1, out: 1, nofee: 1,
  sales: 1, tfee: 1, tin: 1, tout: 1, penalty: 1, incentive: 1 };
const FREE = { note: 'en', obs: 'en', homework: 'en', strengths: 'en', areas: 'en', evidence: 'en', comments: 'en', reason: 'en', dnote: 'en', dev: 'en', level: 'en', why: 'cancel',
  action: 'action', text: 'msg', outNote: 'en', reply: 'msg' };
function famOf(ctx, key){ const c = ctx; if(/rate$/i.test(key) || /penalty|incentive/.test(key)) return /penalty|incentive/.test(key) ? 'act' : 'pay';
  if(/coe-expenses|coe-wallet|MONEY|coe-invoice/.test(c)) return 'fin'; if(/mgmtActions/.test(c)) return 'act';
  if(/mgmtPayroll|mgmtTab|overview|mgmtHours|Slip|payall|exec:mgmtTab/.test(c)) return 'pay'; return 'misc'; }
const DEVICES = ['Laptop/Desktop · Windows · Chrome · 1366×768', 'Laptop/Desktop · Windows · Edge · 1920×1080', 'Laptop/Desktop · macOS · Safari · 1440×900', 'Phone · Android · Chrome · 412×915'];
function W(v, path, key, ctx){
  if(Array.isArray(v)) return v.map((x, i) => W(x, path + '[]', key, ctx));
  if(v && typeof v === 'object'){ const o = {}; for(const k in v) o[S(k, null, { lower: true, upper: true })] = W(v[k], path + '.' + k, k, ctx); return o; }
  if(typeof v === 'number'){ if(v >= 1.6e12 && v < 2.0e12) return v + SHIFT_MS; if(MONEYKEYS[key] && !/wallets?\[\]\.(sales_n)|parts|progress|records|trainings|ranks\[\]\.units|teachers\[\]\.(units|lifetime)/.test(path) && !/mgmtHealth/.test(ctx) && !(key === 'a' && !/coe-expenses/.test(ctx))) return money(v, famOf(ctx, key), key === 'rate' ? 5 : 0); return v; }
  if(typeof v !== 'string') return v;
  if(/^BODY:/.test(ctx)) return S(v, null, { lower: true, upper: true });
  // field rules
  if(key === 'map') return v ? 'https://example.invalid/map' : v;
  if(key === 'proof' && /^https?:/.test(v)) return 'https://example.invalid/file';
  if(key === 'url' && /setupUrl/.test(ctx)) return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='%23e8eef3'/><text x='50%' y='52%' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23667'>Sample setup photo</text></svg>";
  if(key === 'url' && /^https?:/.test(v)) return URL_PH(v);
  if(key === 'device') return pick(DEVICES, 'dev|' + v);
  if(key === 'net') return v ? 'Sample ISP · AS64500 · Sample City' : v;
  if(key === 'ip' || key === 'pres_ip') return /\d+\.\d+\.\d+\.\d+/.test(v) ? '203.0.113.' + (h32(v) % 250 + 1) : v;
  if(key === 'wechat') return v ? 'wxid_sample' + (h32(v) % 900 + 100) : v;
  if(key === 'email') return v ? 'user' + (h32(v) % 900 + 100) + '@example.invalid' : v;
  if(key === 'filled_hash') { const R = rng('hash|' + v); let s = ''; for(let i = 0; i < 64; i++) s += '0123456789abcdef'[Math.floor(R() * 16)]; return s; }
  if(key === 'scan_name') return v ? 'signed-contract-scan.pdf' : v;
  if(key === 'typed_name' || key === 'pres_name' || key === 'wit_name'){ const first = v.split(/\s+/)[0]; const f = mapExactName(first[0] + first.slice(1).toLowerCase()) || fakeName('full|' + v); return f + ' Q. Sample'; }
  if(/proof\[\]\.id$/.test(path)) return 'sample-file-' + (h32(v) % 9000 + 1000);
  if(/proof\[\]\.name$/.test(path)) return 'proof-' + (h32(v) % 90 + 10) + '.' + ((v.match(/\.(\w+)$/) || [, 'jpg'])[1]).toLowerCase();
  if(key === 'name' && /coe-wallet/.test(ctx)) return S(v, 'fin');
  if(key === 'inv' && /^\d+$/.test(v)) return invMap(v);
  if(key === 'meet') return v.replace(/\d/g, (d, i) => String(Math.floor(U('meet|' + v + '|' + i) * 10)));
  if(key === 'city') return cityOf(v);
  if(key === 'details') { const nm = fakeName('enq|' + v); const R = rng('det|' + v); return 'English Name 英文名：\n' + nm + '\nChinese Name 中文名：\n学生' + (100 + Math.floor(R() * 900)) +
      '\nBirthdate (Month-Day-Year)\n出生日期（月-日-年）：\n' + (2008 + Math.floor(R() * 12)) + '.' + pad(1 + Math.floor(R() * 12), 2) + '.' + pad(1 + Math.floor(R() * 28), 2) + '\nSchool Grade 年级：\n' + (1 + Math.floor(R() * 12)) + '\nEnglish Learning Experience\n英语学习经历：' + (1 + Math.floor(R() * 6)) + ' years'; }
  if(key === 'birth') return randBirth(v);
  if(key === 't' && /coe-expenses/.test(ctx) && /rows\[\]$/.test(path)) return expMap[v] || 'General expense';
  if(key === 'student' && /coe-monitor/.test(ctx) && /\.(mp4|mov|png|jpe?g)/i.test(v)) return 'class-video.mp4' + ((v.match(/ · [\d.]+.*$/) || [''])[0]);
  if(key === 'months' && /mgmtActive/.test(ctx)) return v.replace(/^([A-Z][a-z]{2}) (\d{2})$/, (m, mo, yy) => mo + ' ' + pad((+yy + YEARS) % 100, 2));
  if(/(\.|^)(next|strengths|areas)$/.test(path) && /feedback|trial/.test(path)) return sample(v, 'en');
  if(/notes\[\]\.next$/.test(path)) return sample(v, 'en');
  if(/cn\.\w+$/.test(path)) return sample(v, 'cn');
  if(/thread\[\]$/.test(path)) { const m = v.match(/^(.*?: )(.*)$/s); return m ? S(m[1], null) + sample(m[2], 'msg') : sample(v, 'msg'); }
  if(key === 'note' && /coe-wallet/.test(ctx) && /^Starting balance/.test(v)) return S(v, 'fin');
  if(FREE[key] && !(key === 'dev' && !/latest|prev/.test(path)) && !(key === 'level' && !/mgmtEnqList/.test(ctx)) && !(key === 'reply' && v == null)) return freeText(v, FREE[key], famOf(ctx, key));
  if(key === 'name' && /mgmtEnqList/.test(ctx) && /['’]s (Mom|Dad)/.test(v)) return S(v, null);
  if((key === 'src' || key === 's' || key === 'source' || key === 'partner') && v) return S(v, null);
  return S(v, famOf(ctx, key), { lower: true, upper: true });
}
// birthdates: not shifted but replaced by a random date (minors) — keeps the format
function randBirth(v){ if(!v) return v; let y, mo, d; let m, iso;
  if((m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/))){ y = +m[1]; iso = v; } else if((m = v.match(/^(\d{1,2})-(\w{3})-(\d{4})$/))){ y = +m[3]; iso = y + '-' + pad(mIdx(m[2]) + 1, 2) + '-' + pad(+m[1], 2); }
  else { const yy = v.match(/(19|20)\d{2}/); if(!yy) return ''; const R = rng('bd|' + v); const ny = +yy[0] + YEARS + Math.floor(R() * 3) - 1; return (1 + Math.floor(R() * 28)) + '-' + MON[Math.floor(R() * 12)] + '-' + ny; }
  const R = rng('bd|' + iso);
  y = y + YEARS + Math.floor(R() * 3) - 1; mo = 1 + Math.floor(R() * 12); d = 1 + Math.floor(R() * 28);
  if(y + '-' + pad(mo, 2) + '-' + pad(d, 2) === iso) d = d % 28 + 1;   // never keep the real birthdate
  return /^\d{4}-/.test(v) ? y + '-' + pad(mo, 2) + '-' + pad(d, 2) : d + '-' + MON[mo - 1] + '-' + y; }

/* ---------- sheet-like tables (rows of cells) ---------- */
function sheetRows(rows, fam, ctx, colRules){ return rows.map(r => Array.isArray(r) ? r.map((c, i) => {
  if(colRules && colRules[i]) return colRules[i](c);
  if(typeof c === 'number') return c >= 1.6e12 && c < 2e12 ? c + SHIFT_MS : c;
  if(Array.isArray(c)) return c;
  return S(c, fam, { plainMoney: fam === 'pay' || fam === 'fin', lower: false, upper: false, exp: /MONEY/.test(ctx) }); }) : W(r, '', '', ctx)); }
function docData(key, d){
  const ctx = 'docs:' + key;
  if(key === 'pres:mgmtDatabase|[]' || /mgmtStudent\|/.test(key)){
    // col 23 sometimes holds a parent's WeChat id instead of a number
    const rules = { 5: randBirth, 9: cityOf, 22: v => S(v, null), 23: v => /^\s*(\d*|N\/A|NA|-)\s*$/i.test(String(v)) ? v : 'wx_sample' + (h32(String(v)) % 900 + 100) };
    const fix = row => { const b = row[5]; const m = String(b).match(/^(\d{1,2})-(\w{3})-(\d{4})$/); if(!m) return row; const T = new Date(T0_NEW);
      const by = +m[3], bm = mIdx(m[2]), bd = +m[1]; let age = T.getUTCFullYear() - by; if(T.getUTCMonth() < bm || (T.getUTCMonth() === bm && T.getUTCDate() < bd)) age--;
      if(row[6] !== '') row[6] = String(age); let nb = Date.UTC(T.getUTCFullYear(), bm, bd); if(nb < Date.UTC(T.getUTCFullYear(), T.getUTCMonth(), T.getUTCDate())) nb = Date.UTC(T.getUTCFullYear() + 1, bm, bd);
      const dd = Math.round((nb - Date.UTC(T.getUTCFullYear(), T.getUTCMonth(), T.getUTCDate())) / DAY); row[4] = dd <= 6 ? '🎉 This Week' : dd <= 30 ? '🎈 Coming Soon' : ''; return row; };
    if(key === 'pres:mgmtDatabase|[]') return Object.assign({}, d, { head: d.head, rows: d.rows.map(r => fix(sheetRows([r], 'misc', ctx, rules)[0])) });
    const o = W(d, '', '', ctx); if(d.profile && d.profile.row) o.profile.row = fix(sheetRows([d.profile.row], 'misc', ctx, rules)[0]); return o; }
  if(key === 'pres:mgmtPayroll|[]') return Object.assign({}, d, { rows: sheetRows(d.rows, 'pay', ctx) });
  if(key === 'pres:mgmtTab|["MONEY"]') return Object.assign({}, W(d, '', '', ctx), { rows: sheetRows(d.rows, 'fin', ctx) });
  if(key === 'sys:todaydb') return Object.assign({}, W(d, '', '', ctx), { rows: d.rows.map(r => r.map((c, i) => typeof c === 'string' && /^Hello! Hope all is well/.test(c) ? S(c, null) : S(c, 'misc', { lower: false }))) });
  if(key === 'mgmt:mgmtActive|[]'){ const C = d.cols, si = C.indexOf('source'), ii = C.indexOf('incentive'); const o = W(Object.assign({}, d, { rows: [] }), '', '', ctx);
    o.rows = d.rows.map(r => r.map((c, i) => i === si ? S(c, null) : i === ii && typeof c === 'number' ? money(c, 'act') : Array.isArray(c) ? c : typeof c === 'string' ? S(c, 'misc') : c)); return o; }
  return W(d, '', '', ctx);
}

/* ---------- run ---------- */
const out = parsed.map(({ r, t, b }) => {
  const e = EP(r.url), op = OPN(b), ctx = e + ':' + op;
  const url = /\/exec$/.test(r.url.split('?')[0]) ? 'https://preview.invalid/exec' : /functions\/v1\//.test(r.url) ? 'https://preview.invalid/functions/v1/' + e : r.url.replace(/^https?:\/\/[^/]+/, 'https://preview.invalid');
  // request body: same string transform as responses (keys must line up with what the app asks for on the shifted clock)
  let body = r.body; if(typeof body === 'string' && body) { if(/": /.test(body)) body = S(body, null, { lower: true, upper: true }); else try{ body = JSON.stringify(W(JSON.parse(body), 'BODY', '', 'BODY:' + ctx)); }catch(x){ body = S(body, null, { lower: true, upper: true }); } }
  let tt = r.t;
  if(t && typeof t === 'object'){
    let o;
    if(e === 'coe' && op === 'docs' && t.docs){ o = Object.assign({}, t, { docs: {} }); for(const k in t.docs){ const nk = S(k, null, { lower: true, upper: true }); const v = t.docs[k];
        o.docs[nk] = v && typeof v === 'object' ? Object.assign(W(Object.assign({}, v, { data: null }), '', '', 'docs:' + k), { data: v.data == null ? v.data : docData(k, v.data) }) : v; } }
    else if(e === 'exec' && op === 'mgmtTab') o = Object.assign(W(Object.assign({}, t, { data: Object.assign({}, t.data, { rows: [] }) }), '', '', ctx), {}), o.data.rows = sheetRows(t.data.rows, 'pay', ctx);
    else o = W(t, '', '', ctx);
    tt = JSON.stringify(o);
  } else if(typeof tt === 'string' && e !== 'version.txt') tt = S(tt, null);
  return { url, body, t: tt };
});
out.push({ url: 'preview://clock', body: '', t: T0_NEW });
fs.writeFileSync(OUT, JSON.stringify(out));
const info = { seed: SEED, shiftDays: SHIFT_DAYS, clock: T0_NEW, names: Object.keys(NM).length, cjk: Object.keys(CJM).length, students: Object.keys(STM).length, teacherCodes: Object.keys(COEM).length,
  cases: Object.keys(OARM).length, events: Object.keys(EVM).length, partners: PARTNER, records: out.length };
if(process.env.SYNTH_DEBUG) info.nameMap = NM;
console.log(JSON.stringify(info, null, 1));
