// 1795: (Misty 6 Nov 14:57–15:11: "restrict teachers in casually asking for leave · this has happened repeatedly for Dezza and Kat"
//   · "make it aligned for independent service provider" · "not in the memorandum but a set control on the leave when they click it"
//   · "as described above") Controls on the leave form, using only what the signed contract already says:
//   Clause 2.9 (notice of unavailability at least 4 hours before the lesson, with proof), Clause 2.10 (time off = close slots before
//   students are booked; a booked lesson is a commitment), Clause 4.1 (a lesson the teacher cancels: excused ₱100 new / ₱300 regular,
//   unexcused ₱300 / ₱500), Clause 5.1 (notice of breach).
//   Teacher: the form is now "Notice of unavailability". It shows the booked lessons, the hours until the first one and the service
//   credit before sending; planned time off with booked lessons less than 7 days ahead needs a tick ("I'm releasing booked lessons ·
//   excused rate applies"); emergency / sick / bereavement: proof now or within 48 h; her count of releases (< 7 days' notice) in the
//   last 60 days, amber at 2, red at 3.
//   Management: the leave card shows the notice (green / amber / red), the booked lessons, proof, the 60-day count and a suggested
//   outcome; one tap records it: No charge · Excused · Unexcused (one Teacher Class Cancellation case per lesson, through addCase).
const lib = require('../tools/lib.js'), file = process.argv[2];
const helpers = String.raw`/* 1795 · notice of unavailability: notice period, booked lessons, service credit (Clauses 2.9, 2.10, 4.1, 5.1) */
const LV1795_PLANNED = /^(Personal|Vacation|Other)/i, LV1795_RATE = { Excused: { New: 100, Regular: 300 }, Unexcused: { New: 300, Regular: 500 } };
var TLV1795 = { L: null, needAck: false };
function lv1795at(s){ const m = String(s || '').match(/^(\d{4}-\d\d-\d\d)[ T](\d\d:\d\d)/); return m ? Date.parse(m[1] + 'T' + m[2] + ':00+08:00') : Date.now(); }
function lv1795cls(x){ const t = String((x && x.classes) || ''), k = t.indexOf(':'); if(k < 0 || /^No classes/i.test(t)) return [];
  const y = +String(x.from || '').slice(0, 4) || new Date().getFullYear();
  return t.slice(k + 1).split(', ').map(s => { const m = s.trim().match(/^(\d\d-\d\d) (\d\d:\d\d)(?:[–-]\d\d:\d\d)? ?(.*)$/); if(!m) return null;
    let yy = y; if(String(x.from || '').slice(5, 7) === '12' && m[1].slice(0, 2) === '01') yy = y + 1;
    return { md: m[1], hm: m[2], name: (m[3] || '').trim(), t: Date.parse(yy + '-' + m[1] + 'T' + m[2] + ':00+08:00') }; }).filter(Boolean); }
function lv1795count(rows, teacher, upto){   /* releases of booked lessons with less than 7 days' notice, in the 60 days up to 'upto' */
  const lo = new Date(Date.parse(String(upto).slice(0, 10) + 'T12:00:00+08:00') - 60 * 864e5).toISOString().slice(0, 10);
  return (rows || []).filter(r => (!teacher || String(r.teacher || '').toLowerCase() === String(teacher).toLowerCase()) && !/Declined|Cancelled/i.test(r.status || '')
    && String(r.from || '') >= lo && String(r.from || '') <= String(upto).slice(0, 10) && lv1795cls(r).length
    && (Math.min.apply(null, lv1795cls(r).map(c => c.t)) - lv1795at(r.at)) < 7 * 864e5).length; }
function lv1795h(h){ if(h < 0) return 'after the lesson started'; if(h >= 48) return Math.floor(h / 24) + ' days'; const H = Math.floor(h), M = Math.round((h - H) * 60); return H + ' h ' + M + ' min'; }
function lv1795line(c, t){ return '<div class="lv95 ' + c + '">' + t + '</div>'; }
function tlv1795(L){ const box = $('tlN'); if(!box) return; if(L) TLV1795.L = L; L = TLV1795.L || [];
  const planned = LV1795_PLANNED.test(LVF.type || ''), emerg = !!LVF.type && !planned, n = L.length;
  const first = n ? Math.min.apply(null, L.map(c => Date.parse(String(c.date).slice(0, 10) + 'T' + String(c.time || '00:00').slice(0, 5) + ':00+08:00'))) : 0, h = n ? (first - Date.now()) / 36e5 : 0;
  const cnt = lv1795count((TLV && TLV.rows) || [], null, ($('tlT') || {}).value || ymdLocal(new Date())) + (n && h < 168 ? 1 : 0);
  let out = '';
  if(!n) out += lv1795line('ok', '✓ No booked lessons in these dates · to keep these hours free, also close them in <b>My open times</b> (Clause 2.10).');
  else {
    out += lv1795line(h < 4 ? 'bad' : (planned && h < 168) ? 'warn' : 'ok', '<b>' + n + ' booked lesson' + (n === 1 ? '' : 's') + '</b> · the first in <b>' + lv1795h(h) + '</b>');
    if(h < 4) out += lv1795line('bad', 'Less than the 4 hours required (Clause 2.9) · <b>₱300 (new) / ₱500 (regular) per lesson</b>' + (emerg ? ' unless you upload proof of the emergency within 48 hours' : '') + '.');
    else if(planned && h < 168) out += lv1795line('warn', 'Less than 7 days ahead · these are booked lessons you are releasing (Clause 2.10) · the excused rate applies: <b>₱100 (new) / ₱300 (regular) per lesson</b> (Clause 4.1).');
    else if(planned) out += lv1795line('ok', '✓ 7 days or more ahead · the lessons are released and moved · no charge.');
    else if(emerg) out += lv1795line('warn', 'Emergency, sick or bereavement · <b>no charge once your proof is checked</b>. Upload it now or within 48 hours; without proof the lessons count as cancelled without a valid reason (₱300 / ₱500 per lesson).');
  }
  if(cnt) out += lv1795line(cnt >= 3 ? 'bad' : cnt >= 2 ? 'warn' : 'ok', 'Booked lessons released with less than 7 days\' notice in the last 60 days: <b>' + cnt + '</b>' + (n && h < 168 ? ' (with this one)' : '') + (cnt >= 3 ? ' · a third time brings a notice of breach (Clause 5.1)' : cnt >= 2 ? ' · Operations may move these students to another teacher' : ''));
  TLV1795.needAck = planned && n > 0 && h < 168;
  if(TLV1795.needAck) out += '<label class="row" style="gap:8px;margin-top:8px;font-weight:600"><input type="checkbox" id="tlAck"> I understand I am releasing booked lessons and the service credit above applies.</label>';
  box.innerHTML = out; }
function lvc1795(x){ const cls = lv1795cls(x); if(!cls.length) return '';
  const at = lv1795at(x.at), h = (Math.min.apply(null, cls.map(c => c.t)) - at) / 36e5, planned = LV1795_PLANNED.test(x.type || ''), proof = (x.proof || []).length, age = (Date.now() - at) / 36e5;
  const cnt = lv1795count((LV && LV.rows) || [], x.teacher, x.from), done = (() => { try{ return JSON.parse(localStorage.getItem('lv1795:' + x.id) || 'null'); }catch(e){ return null; } })();
  let sug = 'none', why = '';
  if(planned){ if(h < 4){ sug = 'Unexcused'; why = 'planned · less than 4 hours (Clause 2.9)'; } else if(h < 168){ sug = 'Excused'; why = 'planned · less than 7 days ahead (Clauses 2.10, 4.1)'; } else why = 'planned · 7 days or more ahead'; }
  else if(proof){ why = 'emergency with proof · check the proof'; }
  else if(age < 48){ sug = 'wait'; why = 'proof due within 48 h (' + lv1795h(48 - age) + ' left)'; }
  else { sug = 'Unexcused'; why = 'no proof after 48 h · no valid reason'; }
  const tier = (window.LV95T && LV95T[x.id]) || 'Regular', n = cls.length, amt = k => LV1795_RATE[k][tier];
  const btn = (k, lbl, cls2) => '<button class="btn sm ' + cls2 + '" onclick="lvCredit1795(\'' + esc(x.id) + '\',\'' + k + '\')">' + lbl + '</button>';
  return '<div class="lv95box"><b>Notice &amp; service credit</b>'
    + lv1795line(h < 4 ? 'bad' : (planned && h < 168) ? 'warn' : 'ok', 'Notice: <b>' + lv1795h(h) + '</b> before the first of <b>' + n + ' booked lesson' + (n === 1 ? '' : 's') + '</b>')
    + lv1795line(proof ? 'ok' : planned ? 'ok' : age < 48 ? 'warn' : 'bad', proof ? '✓ Proof attached (' + proof + ')' : planned ? 'Planned time off · proof optional' : 'No proof yet')
    + lv1795line(cnt >= 3 ? 'bad' : cnt >= 2 ? 'warn' : 'ok', 'Releases with less than 7 days\' notice in 60 days: <b>' + cnt + '</b>' + (cnt >= 3 ? ' · notice of breach (Clause 5.1)' : ''))
    + '<div class="small" style="margin-top:6px">Suggested: <b>' + (sug === 'none' ? 'No charge' : sug === 'wait' ? 'Wait for the proof' : sug + ' · ₱' + amt(sug) + ' × ' + n + ' = ₱' + (amt(sug) * n).toLocaleString()) + '</b> · ' + esc(why) + '</div>'
    + (done ? '<div class="lv95 ok" style="margin-top:6px">✓ Recorded on this device: <b>' + esc(done.k) + '</b> · ' + esc(done.at) + (done.ids ? ' · ' + esc(done.ids) : '') + '</div>'
      : '<div class="small mute" style="margin-top:6px">Employment status for the rate: <a class="link" onclick="(window.LV95T=window.LV95T||{})[\'' + esc(x.id) + '\']=\'' + (tier === 'Regular' ? 'New' : 'Regular') + '\';lvSheet(\'' + esc(x.id) + '\')">' + tier + ' (tap to change)</a></div>'
        + '<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">' + btn('none', 'No charge', sug === 'none' ? 'teal' : 'ghost') + btn('Excused', 'Excused · ₱' + (amt('Excused') * n).toLocaleString(), sug === 'Excused' ? 'teal' : 'ghost') + btn('Unexcused', 'Unexcused · ₱' + (amt('Unexcused') * n).toLocaleString(), sug === 'Unexcused' ? 'teal' : 'ghost') + '</div>')
    + '</div>'; }
async function lvCredit1795(id, k){ const x = LV && LV.rows.find(r => r.id === id); if(!x) return; const cls = lv1795cls(x), tier = (window.LV95T && LV95T[id]) || 'Regular';
  const at = lv1795at(x.at), h = (Math.min.apply(null, cls.map(c => c.t)) - at) / 36e5, stamp = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  if(k === 'none'){ try{ localStorage.setItem('lv1795:' + id, JSON.stringify({ k: 'No charge', at: stamp })); }catch(e){} toast('✓ No charge recorded for ' + tName(x.teacher)); lvSheet(id); return; }
  const amt = LV1795_RATE[k][tier];
  if(!confirm(k + ' · ' + cls.length + ' lesson' + (cls.length === 1 ? '' : 's') + ' × ₱' + amt + ' = ₱' + (amt * cls.length).toLocaleString() + ' for ' + tName(x.teacher) + '?\nOne Teacher Class Cancellation case per lesson.')) return;
  toast('Saving ' + cls.length + ' case' + (cls.length === 1 ? '' : 's') + '…'); const ids = [];
  for(const c of cls){ try{ const r = await api('addCase', TOKEN, { subject: 'Teacher Class Cancellation', source: 'Teacher', assigned: 'Operations', type: 'Attendance', employee: x.teacher, student: c.name, condition: k, status: tier, amount: amt, done: true,
      action: 'Notice of unavailability ' + id + ' · ' + lv1795h(h) + ' notice · lesson ' + c.md + ' ' + c.hm + ' · Clause ' + (h < 4 ? '2.9' : '2.10 / 4.1') }); if(r && r.ok) ids.push(r.caseId); }catch(e){} }
  try{ localStorage.setItem('lv1795:' + id, JSON.stringify({ k: k + ' · ₱' + (amt * ids.length).toLocaleString(), at: stamp, ids: ids.join(', ') })); }catch(e){}
  toast(ids.length === cls.length ? '✓ ' + ids.length + ' case' + (ids.length === 1 ? '' : 's') + ' saved · ' + ids.join(', ') : ids.length + ' of ' + cls.length + ' saved · check Actions'); lvSheet(id); try{ AC = null; }catch(e){} }
(function(){ const st = document.createElement('style'); st.textContent = '.lv95{font-size:13px;padding:6px 10px;border-radius:10px;margin-top:6px;border-left:4px solid}.lv95.ok{background:#E3F4EC;color:#1C6B4C;border-color:#2E9E6B}.lv95.warn{background:#FFF6E5;color:#8A5A0F;border-color:#E2A93B}.lv95.bad{background:#FDE8E4;color:#A3321E;border-color:#D2553B}.lv95box{margin-top:12px;padding:12px;border:1px solid #ECEAF1;border-radius:14px;background:#fff}'; document.head.appendChild(st); })();
async function tlvSend(){`;
lib(file, [
  ["${x ? `<div style=\"margin-top:10px\">${lvChip(x)}</div>` : ''}",
   "${x ? `<div style=\"margin-top:10px\">${lvChip(x)}</div>` : ''}${x && window.lvc1795 ? lvc1795(x) : ''}"],
  ["openSheet(`<h1>Request leave</h1><div class=\"mute small\">Attach your proof · Operations checks it and may ask for more details · then management approves · you see the status here</div>",
   "openSheet(`<h1>Notice of unavailability</h1><div class=\"mute small\">For lessons already booked with you (Clause 2.9) · at least 4 hours before the first lesson, with proof · Operations moves or covers the lessons · you see the status here</div>"],
  ["<label>Lessons affected</label><div id=\"tlC\" class=\"small mute\">Checking your schedule…</div>",
   "<label>Booked lessons affected</label><div id=\"tlC\" class=\"small mute\">Checking your schedule…</div><div id=\"tlN\"></div>"],
  ["if($('tlC')) $('tlC').innerHTML = lvClsHtml(L);", "if($('tlC')) $('tlC').innerHTML = lvClsHtml(L); try{ tlv1795(L); }catch(e){}"],
  ["\"$('tlH').textContent=LV_HINT[LVF.type]||''\"", "\"$('tlH').textContent=LV_HINT[LVF.type]||'';try{tlv1795()}catch(e){}\""],
  ["if(!LVFILES.length && !f.later) return toast('Attach your proof, or tick \"I\\'ll send it later\"');",
   "if(!LVFILES.length && !f.later) return toast('Attach your proof, or tick \"I\\'ll send it later\"');\nif(TLV1795.needAck && !($('tlAck') || {}).checked) return toast('Tick the box: you are releasing booked lessons');"],
  ["async function tlvSend(){", helpers],
  ["<button class=\"btn block\" id=\"tlGo\" style=\"margin-top:14px\" onclick=\"tlvSend()\">Send request</button>",
   "<button class=\"btn block\" id=\"tlGo\" style=\"margin-top:14px\" onclick=\"tlvSend()\">Send notice</button>"],
]);
