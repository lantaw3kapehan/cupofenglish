// 1808: (Misty 6 Nov 16:13 "OK, but we have declined her leave?") A declined notice means the teacher is expected to teach, so
//   nothing is charged from the notice itself. Each booked lesson is checked after it happens (database coe_leave_att, in the
//   mgmt:feed1806 doc, every minute): taught ("I'm in" or a video/proof upload) → no charge · reassigned/cancelled → no charge ·
//   not yet → "expected to teach" · missed → Excused or Unexcused (Clause 4.1 "Cancelled, missed or absent lesson"), decided by
//   management. Buttons act only on missed lessons for a declined notice (and on lessons under 4 h otherwise).
const fs = require('fs'), file = process.argv[2]; let s = fs.readFileSync(file, 'utf8');
const rep = (a, b, n) => { const c = s.split(a).length - 1; if(c !== n) throw new Error('Expected ' + n + ' got ' + c + ' for ' + a.slice(0, 80)); s = s.split(a).join(b); };
rep("    return Object.assign({}, c, { h: h, k: k, why: why }); }); }",
  "    let ch = h < 4, lbl = '';\n"
  + "    if(/^Declined/i.test(x.status || '')){ const a = lv1808att(x.id), st = a ? a[c.md + ' ' + c.hm] : null;   /* 1808: declined → she is expected to teach */\n"
  + "      if(st === 'taught'){ k = 'none'; ch = false; lbl = 'Taught · no charge'; }\n"
  + "      else if(st === 'reassigned'){ k = 'none'; ch = false; lbl = 'Reassigned · no charge'; }\n"
  + "      else if(st === 'missed'){ k = h <= 0 ? 'Unexcused' : 'wait'; ch = true; why = 'missed after the notice was declined'; lbl = h <= 0 ? '' : 'Missed · Excused ₱? or Unexcused'; }\n"
  + "      else { k = 'later'; ch = false; lbl = st === 'upcoming' ? 'Expected to teach' : 'Checking…'; } }\n"
  + "    return Object.assign({}, c, { h: h, k: k, why: why, ch: ch, lbl: lbl }); }); }\n"
  + "function lv1808att(id){ if(typeof FD1806 === 'undefined') return null; if(FD1806.att) return FD1806.att[id] || {};\n"
  + "  if(!FD1806.attP && typeof sbDoc === 'function') FD1806.attP = sbDoc('mgmt:feed1806').then(d => { if(d && d.data){ FD1806.att = d.data.att || {}; if(!FD1806.items) FD1806.items = d.data.items || []; } else FD1806.att = {}; }).catch(() => { FD1806.att = {}; })\n"
  + "    .finally(() => { setTimeout(() => { FD1806.attP = null; FD1806.att = null; }, 60000); try{ const b = document.querySelector('.lv95box'), y = b && LVF && LVF.id && LV && LV.rows.find(r => r.id === LVF.id); if(y){ const h = lvc1795(y); if(h) b.outerHTML = h; } }catch(e){} });\n"
  + "  return null; }", 1);
rep("FD1806.items = d.data.items; FD1806.at = Date.now();", "FD1806.items = d.data.items; FD1806.att = d.data.att || {}; FD1806.at = Date.now();", 1);
rep("'</span><b>' + (p.k === 'none' ? 'No charge'", "'</span><b>' + (p.lbl && p.lbl.indexOf('₱?') < 0 ? p.lbl : p.lbl ? 'Missed · Excused ₱' + rate('Excused') + ' or Unexcused ₱' + rate('Unexcused') : p.k === 'none' ? 'No charge'", 1);
rep("plan.some(p => p.h < 4)", "plan.some(p => p.ch)", 2);
rep("plan.filter(p => p.h < 4).length", "plan.filter(p => p.ch).length", 2);
rep("'Under 4 h all excused · ₱'", "(/^Declined/i.test(x.status || '') ? 'Missed lessons all excused' : 'Under 4 h all excused') + ' · ₱'", 1);
rep("'Under 4 h all unexcused · ₱'", "(/^Declined/i.test(x.status || '') ? 'Missed lessons all unexcused' : 'Under 4 h all unexcused') + ' · ₱'", 1);
rep("k === 'plan' || p.h >= 4 ? p", "k === 'plan' || !p.ch ? p", 1);
rep(".filter(p => p.h < 4 && (p.k === 'Excused' || p.k === 'Unexcused'))", ".filter(p => p.ch && (p.k === 'Excused' || p.k === 'Unexcused'))", 1);
rep("' · Clause 2.9: 4 h or more is no charge · Clause 5.1: send the notice of breach before the credit is taken</div>'",
  "(/^Declined/i.test(x.status || '') ? ' · <b>notice declined: she is expected to teach</b> · each lesson is checked after it ends (I’m in or video) · only missed lessons are charged' : ' · Clause 2.9: 4 h or more is no charge') + ' · Clause 5.1: send the notice of breach before the credit is taken</div>'", 1);
const m = s.match(/const COE_V = (\d+)/); if(m){ s = s.replace(m[0], 'const COE_V = ' + (+m[1] + 1)); console.log('COE_V ' + m[1] + ' → ' + (+m[1] + 1)); }
fs.writeFileSync(file, s);
