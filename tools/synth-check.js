#!/usr/bin/env node
// Leak check for the synthetic fixture: which sensitive-looking values in synth.json also occur in recs.json?
// usage: node tools/synth-check.js [recs=audit/fx/recs.json] [synth=audit/fx/synth.json] [--json]
// Two measures per category:
//   overlap    = occurrences in synth whose value also occurs anywhere in recs (value-set match; includes coincidences)
//   positional = the same value sits in the same place (same record, same field) in both files → value was NOT transformed
'use strict';
const fs = require('fs');
const A = process.argv.slice(2).filter(a => !/^--/.test(a)), RECS = A[0] || 'audit/fx/recs.json', SYN = A[1] || 'audit/fx/synth.json';
const load = f => JSON.parse(fs.readFileSync(f, 'utf8')).map(r => { let t = r.t, b = r.body; try{ t = JSON.parse(r.t); }catch(e){} try{ b = JSON.parse(r.body); }catch(e){} return { url: r.url, body: b, t }; });
const R = load(RECS), S = load(SYN).filter(r => r.url !== 'preview://clock');
const M = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec', MF = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
const CAT = {
  studentCode: /ST-\d{4}-\d{3}/g, teacherCode: /COE-\d{4}-\d{2}/g, caseId: /OAR-\d{4}-\d{3}|\b(?:LV|MS|EQ)-\d{10,12}/g,
  invoiceNo: /(?:Invoice[_ ]?|PaymentConfirmation)(\d{3,5})/g,
  amountString: /[-−]?[₱¥]\s?[-−]?\d[\d,]*(?:\.\d+)?|(?<![\d.])\d{1,3}(?:,\d{3})+(?:\.\d+)?(?![\d,])/g,
  dateISO: /\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?/g, dateMonthKey: /(?<![\d-])20\d{2}-\d{2}(?![\d-])/g,
  dateDMonY: new RegExp('\\d{1,2}-(?:' + M + ')-\\d{4}', 'g'), dateMonDY: new RegExp(MF + '[ -]\\d{1,2},?[ -]\\d{4}', 'g'),
  dateMonthYear: new RegExp(MF + '(?:\\s+|//)20\\d{2}', 'g'), dateMonD: new RegExp('\\b(?:' + M + ') \\d{1,2}(?![\\d,:])', 'g'), dateDMon: new RegExp('(?<![\\d-])\\d{1,2} (?:' + M + ')\\b', 'g'),
  dateCompact: /(?<!\d)20\d{6}T?\d{6}(?!\d)|(?<!\d)1[6-9]\d{11}(?!\d)/g,
  email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, url: /https?:\/\/[^\s"'<>)]+/g, dataUrl: /data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+\/=]{20,}/g,
  ip: /(?<![\d.])\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?![\d.])/g, wechat: /wxid_[A-Za-z0-9_-]+/g, coords: /\b1[56]\.\d{4,6},\s?12[01]\.\d{4,6}\b/g,
  driveId: /\b1[A-Za-z0-9_-]{24,40}\b/g, eventId: /(?<![a-z0-9])[a-v0-9]{26}(?![a-z0-9])/g,
  digits4: /(?<![\d.])\d{4,}(?![\d])/g
};
const NAMEKEYS = /^(student|teacher|name|who|by|from|to|employee|sharedName|typed_name|pres_name|wit_name|en|cn)$/;
function leaves(rec){ const out = []; const walk = (v, path, key) => {
    if(Array.isArray(v)) return v.forEach((x, i) => walk(x, path + '/' + i, key));
    if(v && typeof v === 'object') return Object.keys(v).forEach((k, i) => { out.push({ p: path + '/k' + i, s: k, key: '#key' }); walk(v[k], path + '/' + i, k); });
    if(v == null || typeof v === 'boolean') return; out.push({ p: path, s: String(v), key, num: typeof v === 'number' }); };
  walk(rec.url, 'u', 'url'); walk(rec.body, 'b', ''); walk(rec.t, 't', ''); return out; }
const RL = R.map(leaves), SL = S.map(leaves);
const posR = new Map(); RL.forEach((L, i) => L.forEach(x => posR.set(i + x.p, x.s)));
function tokens(x, cat){ const re = CAT[cat]; re.lastIndex = 0; const m = []; let a; while((a = re.exec(x.s))){ m.push(cat === 'invoiceNo' ? a[1] : a[0]); if(!a[0]) re.lastIndex++; } return m; }
const RSET = {}; for(const c in CAT){ RSET[c] = new Set(); RL.forEach(L => L.forEach(x => tokens(x, c).forEach(t => RSET[c].add(t)))); }
// money numbers stored as numbers, invoice numbers stored bare in "inv"
const MONEYK = /^(base|bonus|deduct|gov|lessonPay|net|rate|pay|a|rmb|cny|fee|balance|sales|tfee|tin|tout|penalty|incentive)$/;
RSET.moneyNumber = new Set(); RL.forEach(L => L.forEach(x => { if(x.num && MONEYK.test(x.key) && Math.abs(+x.s) >= 10) RSET.moneyNumber.add(x.s); }));
RL.forEach(L => L.forEach(x => { if(x.key === 'inv' && x.s) RSET.invoiceNo.add(x.s); }));
// person names: words used in name fields that are not also ordinary words elsewhere in the app data (book titles, ranks, months, labels)
const VOCAB = new Set(); RL.forEach(L => L.forEach(x => { if(!NAMEKEYS.test(x.key) && !x.num && /^(book|title|label|series|rank|kind|status|subject|type|c|course|head|cols|months|tier|descr|short|lv|cefr|domains|types|name)$/.test(x.key)) (x.s.match(/[A-Z][a-z]{2,}/g) || []).forEach(w => VOCAB.add(w)); }));
['January','February','March','April','May','June','July','August','September','October','November','December','English','Cup','The','Video','Teacher','Newly','Hired','Starting','Qualified','Junior','Senior','Master','All','Sun','Mon','Sat'].forEach(w => VOCAB.add(w));
RSET.personName = new Set(); RL.forEach(L => L.forEach(x => { if(NAMEKEYS.test(x.key) && !x.num) (x.s.match(/[A-Z][a-z]{2,}/g) || []).forEach(w => { if(!VOCAB.has(w)) RSET.personName.add(w); }); }));
['CupOfEnglish', 'Operations', 'Management', 'President', 'Teacher', 'Health', 'Unmatched', 'Trial', 'Sample', 'City', 'Province', 'Partner', 'App', 'Mom', 'Dad'].forEach(w => RSET.personName.delete(w));
const res = {};
function bump(cat, tok, pos, where){ const r = res[cat] = res[cat] || { synthTokens: 0, overlap: 0, positional: 0, ex: {}, pex: {} }; r.synthTokens++;
  if(RSET[cat].has(tok)){ r.overlap++; r.ex[tok] = (r.ex[tok] || 0) + 1; if(pos){ r.positional++; r.pex[tok + " @" + where] = 1; (r.pkeys = r.pkeys || {})[where] = (r.pkeys[where] || 0) + 1; } } }
SL.forEach((L, i) => L.forEach(x => {
  const orig = posR.get(i + x.p);
  for(const c in CAT){ tokens(x, c).forEach(t => bump(c, t, orig != null && orig.includes(t), x.key)); }
  if(x.num && MONEYK.test(x.key) && Math.abs(+x.s) >= 10) bump('moneyNumber', x.s, orig === x.s, x.key);
  if(x.key === 'inv' && x.s) bump('invoiceNo', x.s, orig === x.s, 'inv');
  if(!x.num) (x.s.match(/[A-Z][a-z]{2,}/g) || []).forEach(w => { if(RSET.personName.has(w)) bump('personName', w, orig != null && orig.includes(w), x.key); });
}));
for(const c in res){ const r = res[c]; r.ex = Object.entries(r.ex).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => k + '×' + n); r.pex = Object.keys(r.pex).filter(k => !/^₱0(\.00)? @|@v$/.test(k)).slice(0, 40); }
if(process.argv.includes('--json')) console.log(JSON.stringify(res, null, 1));
else for(const c of Object.keys(CAT).concat(['moneyNumber', 'personName'])){ const r = res[c] || { synthTokens: 0, overlap: 0, positional: 0, ex: [], pex: [] };
  console.log(c.padEnd(14), 'recs:' + String(RSET[c].size).padStart(6), ' synth:' + String(r.synthTokens).padStart(6), ' overlap:' + String(r.overlap).padStart(5), ' positional:' + String(r.positional).padStart(5), r.ex.length ? ' e.g. ' + r.ex.join(', ').slice(0, 220) : '', r.pex.length ? '\n      positional: ' + r.pex.join(', ').slice(0, 300) : ''); }
