// Trials + Enquiries sample data for the preview (29 Oct 2026). Made-up names and codes only (ST-2099-…), nothing real.
// usage: node tools/trials-fixture.js [in=audit/fx/synth.json] [out=audit/fx/synth-trials.json]
// Adds to the synthetic fixture the screens that had no samples (QA 28 Oct: "Trials lists Blocked, mgmtTrials not in fixture"):
//   mgmtTrials (reports + "no report yet"), mgmtTrialFus (follow-ups), coe-trials recon (sessions by calendar event id, release 1560),
//   more enquiries (China + Philippines, a long Messenger link as name, a clock-skewed "logged" time), and sys:trial_next.
// The cases mirror the patterns found on 29 Oct (see server/QA-2026-10-29-trials-enquiries.md):
//   Chenia   – booked 23 Oct, moved by the office to 24 Oct, report dated 24 Oct  → the 23 Oct "no report yet" entry is the same session.
//   Toma     – booked 25 Oct, moved to 30 Oct (not held yet)                      → not a missing report.
//   Ricco    – trial 11 Oct (report), then two more "Trial" log rows 17 + 18 Oct with other event ids → kept, flagged "check".
//   Lumi     – trial 22 Oct, held, no report                                     → a real missing report.
//   Pia      – two real trials (30 Sep, 20 Oct), two reports                       → both kept.
'use strict';
const fs = require('fs');
const IN = process.argv[2] || 'audit/fx/synth.json', OUT = process.argv[3] || 'audit/fx/synth-trials.json';
const recs = JSON.parse(fs.readFileSync(IN, 'utf8'));
const U = 'https://preview.invalid/functions/v1/';
const scr = (fn, args, t) => ({ url: U + 'coe-mgmt', body: JSON.stringify({ op: 'screen', fn, args: args || [], token: 'T' }), t: JSON.stringify({ ok: true, data: t }) });
const gas = (fn, args, t) => ({ url: 'https://preview.invalid/exec', body: JSON.stringify({ fn, args: ['T'].concat(args || []) }), t: JSON.stringify({ ok: true, data: t }) });   // Google (Apps Script) answer
const C = 'The learner answered in full sentences and asked two questions of her own. Sample text for the preview.';
const N = 'Recommended course: sample book (CEFR A2). Twice a week, 25 minutes. Sample text for the preview.';
const rep = (o) => Object.assign({ l: 3, s: 10, rd: 4, cn: '', pdf: '', sub: o.date + ' 11:02', comm: C, next: N, commZh: '示例文字', nextZh: '示例文字', pics: '', check: '', total: 20, cefr: 'A2', enrolled: 'Not yet',
  label: o.date + ' · ' + o.student + ' · ' + o.teacher }, o);
const rows = [
  rep({ date: '2027-10-24', time: '10:00', student: 'Chenia', code: 'ST-2099-606', teacher: 'Gaimu', status: 'Sent', group: 'Adult · business English', total: 17, sent: { at: '2027-10-24 13:13', by: 'Operations', how: '' },
    pics: 'Report sent to parent 2027-10-24 13:13 by Operations · Follow-up: Thinking it over 2027-10-26 13:14 by Operations' }),
  rep({ date: '2027-10-23', time: '20:00', student: 'Alin', code: 'ST-2099-590', teacher: 'Julia', status: 'Ready', group: 'Kids & teens', total: 22 }),
  rep({ date: '2027-10-22', time: '19:30', student: 'Bao', cn: '小宝', code: 'ST-2099-601', teacher: 'Pusiania', status: 'Making PDF', group: 'Kids & teens', total: 15, cefr: 'A1' }),
  rep({ date: '2027-10-20', time: '18:00', student: 'Pia', cn: '琵琶', code: 'ST-2099-603', teacher: 'Leovo', status: 'Sent', group: 'Kids & teens', sent: { at: '2027-10-20 20:00', by: 'Operations', how: '' } }),
  rep({ date: '2027-10-19', time: '22:00', student: 'Sela', code: 'ST-2099-604', teacher: 'Julia', status: 'Sent', group: 'Adult · IELTS', cefr: 'B1', total: 26, sent: { at: '2027-10-20 09:00', by: 'Operations', how: '' } }),
  rep({ date: '2027-10-18', time: '18:30', student: 'Lewin', code: 'ST-2099-570', teacher: 'Gaimu', status: 'Sent', group: 'Kids & teens', enrolled: 'Yes', sent: { at: '2027-10-18 20:00', by: 'Operations', how: '' } }),
  rep({ date: '2027-10-11', time: '19:00', student: 'Ricco', code: 'ST-2099-600', teacher: 'Gaimu', status: 'Sent', group: 'Kids & teens', sent: { at: '2027-10-11 21:00', by: 'Operations', how: '' } }),
  rep({ date: '2027-10-10', time: '20:30', student: 'Yuna', code: 'ST-2099-598', teacher: 'Pam', status: 'Sent', group: 'Kids & teens', sent: { at: '2027-10-11 09:00', by: 'Operations', how: '' } }),
  rep({ date: '2027-09-30', time: '18:00', student: 'Pia', cn: '琵琶', code: 'ST-2099-603', teacher: 'Kaku', status: 'Sent', group: 'Kids & teens', sent: { at: '2027-09-30 20:00', by: 'Operations', how: '' } }),
  rep({ date: '2027-09-27', time: '20:00', student: 'Jeff', code: 'ST-2099-594', teacher: 'April', status: 'Sent', group: 'Kids & teens', sent: { at: '2027-09-28 09:00', by: 'Operations', how: '' } })];
const wait = [
  { code: 'ST-2099-610', date: '2027-10-25', time: '19:00', status: '', student: 'Toma', teacher: 'Resa' },
  { code: 'ST-2099-606', date: '2027-10-23', time: '10:00', status: '', student: 'Chenia', teacher: 'Gaimu' },
  { code: 'ST-2099-612', date: '2027-10-22', time: '18:00', status: '', student: 'Lumi', teacher: 'Kaku' },
  { code: 'ST-2099-600', date: '2027-10-18', time: '19:00', status: 'Enrolled', student: 'Ricco', teacher: 'Gaimu' },
  { code: 'ST-2099-600', date: '2027-10-17', time: '19:00', status: 'Enrolled', student: 'Ricco', teacher: 'Gaimu' }];
const fus = { '2027-10-24|chenia': { at: '2027-10-26 13:14', by: 'Operations', st: 'Thinking it over', note: 'Will reply in the first week of November.' },
  '2027-10-11|ricco': { at: '2027-10-12 11:03', by: 'Management', st: 'Enrolling', note: 'enrolled' },
  '2027-09-27|jeff': { at: '2027-10-09 20:24', by: 'Operations', st: 'Not now', note: '' },
  '2027-10-19|sela': { at: '2027-10-21 10:00', by: 'Operations', st: 'Following up', note: 'Day 3 message sent' } };
const ses = (ev, d, tm, code, s, t, cal, n) => ({ ev, d, tm, code, s, t, n: n || 1, cal });
const recon = { ok: true, since: '2027-08-10', sessions: [
  ses('fx1chenia', '2027-10-23', '10:00', 'ST-2099-606', 'Chenia', 'Gaimu', { day: '2027-10-24', x: 0, mv: '2027-10-23' }),
  ses('fx2toma', '2027-10-25', '19:00', 'ST-2099-610', 'Toma', 'Resa', { day: '2027-10-30', x: 0, mv: '2027-10-25' }),
  ses('fx3lumi', '2027-10-22', '18:00', 'ST-2099-612', 'Lumi', 'Kaku', { day: '2027-10-22', x: 0, mv: '' }),
  ses('fx4ricco', '2027-10-11', '19:00', 'ST-2099-600', 'Ricco', 'Gaimu', { day: '2027-10-11', x: 0, mv: '' }, 2),
  ses('fx5ricco', '2027-10-17', '19:00', 'ST-2099-600', 'Ricco', 'Gaimu', null),
  ses('fx6ricco', '2027-10-18', '19:00', 'ST-2099-600', 'Ricco', 'Gaimu', null),
  ses('fx7pia', '2027-09-30', '18:00', 'ST-2099-603', 'Pia', 'Kaku', { day: '2027-09-30', x: 0, mv: '' }, 2),
  ses('fx8pia', '2027-10-20', '18:00', 'ST-2099-603', 'Pia', 'Leovo', { day: '2027-10-20', x: 0, mv: '' }, 2)],
  reports: rows.map(r => ({ d: r.date, code: r.code, s: r.student.toLowerCase() })) };
const H = (d, h) => d + ' ' + h;
const enq = (o) => Object.assign({ by: 'Operations', st: 'New', age: '', src: 'WeChat', note: '', prog: 'Kids & teens', sent: '', level: '', trial: '', wechat: '', details: '' }, o);
const enqs = [
  enq({ id: 'EQ-FX-01', at: H('2027-10-24', '09:10'), up: H('2027-10-24', '09:10'), name: 'Momo\'s Mum', prog: 'Kids & teens', age: '7', src: 'Partner · Partner A' }),
  enq({ id: 'EQ-FX-02', at: H('2027-10-24', '19:40'), up: H('2027-10-24', '19:40'), name: 'https://www.messenger.com/t/100089912345678901234?mibextid=sample-preview-only', prog: 'PH Adult English 1:1 · Professional', src: 'Facebook', wechat: 'https://m.me/sample.preview.only.1234567890' }),
  enq({ id: 'EQ-FX-03', at: H('2027-10-19', '15:00'), up: H('2027-10-19', '15:00'), name: 'Leo (adult)', prog: 'Adults', src: '小红书', sent: 'Price picture 10-19 15:20' }),
  enq({ id: 'EQ-FX-04', at: H('2027-10-21', '11:00'), up: H('2027-10-23', '10:00'), name: 'Chenia', prog: 'Adults', st: 'Trial booked', src: 'Partner · Partner A', trial: '2027-10-23|Chenia', sent: 'Trial invitation 10-21 11:30' }),
  enq({ id: 'EQ-FX-05', at: H('2027-10-12', '10:00'), up: H('2027-10-12', '10:00'), name: 'Kiko\'s Dad', prog: 'IELTS', src: 'Referral' }),
  enq({ id: 'EQ-FX-06', at: H('2027-10-23', '08:00'), up: H('2027-10-23', '08:00'), name: 'Maria Santos', prog: 'PH IELTS 1:1 · Mastery', src: 'Facebook' }),
  enq({ id: 'EQ-FX-08', at: H('2027-10-25', '03:00'), up: H('2027-10-25', '03:00'), name: 'Night enquiry', prog: 'Kids & teens', src: 'WeChat' }),   // logged "tomorrow" (Manila 03:00 is still the day before in UTC) → was "-1 days"
  enq({ id: 'EQ-FX-07', at: H('2027-10-01', '10:00'), up: H('2027-10-03', '10:00'), name: 'Ana', prog: 'Kids & teens', st: 'Not now', src: 'WeChat' })];
const out = recs.filter(r => !/"fn":"mgmtEnqList"/.test(r.body || ''));
out.push(scr('mgmtTrials', [], { at: '13:45', rows, wait }), gas('mgmtTrials', [], { at: '13:45', rows, wait }));
out.push(scr('mgmtTrialFus', [], fus), gas('mgmtTrialFus', [], fus));
const old = recs.find(r => /"fn":"mgmtEnqList"/.test(r.body || '')); let base = [];
try{ base = JSON.parse(old.t).data.rows || []; }catch(e){}
out.push(scr('mgmtEnqList', [], { ok: true, rows: enqs.concat(base) }));
out.push({ url: U + 'coe-trials', body: JSON.stringify({ token: 'T', recon: 75 }), t: JSON.stringify(recon) });
fs.writeFileSync(OUT, JSON.stringify(out));
console.log('trials fixture: ' + rows.length + ' reports, ' + wait.length + ' without a report, ' + enqs.length + ' enquiries → ' + OUT);
