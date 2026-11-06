// 1800: (Misty 6 Nov 15:27–15:28, Dezza's notice card) 1. "Releases with less than 7 days' notice ... is that easy to understand?
//   I think it needs rewording" → "Short-notice requests in the last 60 days: 2 (this one included) · short notice = less than
//   7 days before the lessons". 2. "employment status rate should be based on their length with us or rank" → the New / Regular
//   rate (PEN-013–016) now comes from the teacher's rank in the database (coe_rank_cur via coe-payedit op tpay, the same rank pay
//   uses): Newly Hired and Starting Teacher = New; Newly Qualified and up = Regular; fixed-rate people = Regular. The card says
//   which rank decided it. A President-only "change" link stays for exceptions. Buttons wait until the rank is in.
const lib = require('../tools/lib.js'), file = process.argv[2];
const SHORT = "'Short-notice requests in the last 60 days: <b>' + cnt + '</b> (this one included) <span class=\"mute\">· short notice = less than 7 days before the lessons</span>'";
lib(file, [
  ["lv1795line(cnt >= 3 ? 'bad' : cnt >= 2 ? 'warn' : 'ok', 'Releases with less than 7 days\\' notice in 60 days: <b>' + cnt + '</b>' + (cnt >= 3 ? ' · notice of breach (Clause 5.1)' : cnt >= 2 ? ' · Operations may move these students to another teacher' : ''))",
   "lv1795line(cnt >= 3 ? 'bad' : cnt >= 2 ? 'warn' : 'ok', " + SHORT + " + (cnt >= 3 ? ' · <b>notice of breach</b> (Clause 5.1)' : cnt >= 2 ? ' · a 3rd brings a notice of breach' : ''))   /* 1800 wording */"],
  ["'Booked lessons released with less than 7 days\\' notice in the last 60 days: <b>' + cnt + '</b>' + (n && h0 < 168 ? ' (with this one)' : '')",
   "'Short-notice requests in the last 60 days: <b>' + cnt + '</b>' + (n && h0 < 168 ? ' (this one included)' : '') + ' <span class=\"mute\">· short notice = less than 7 days before the lessons</span>'"],
  ["const tier = (window.LV95T && LV95T[x.id]) || 'Regular', n = cls.length,",
   "const tier = lv1800tier(x) || 'Regular', rk = lv1800rank(x.teacher), n = cls.length,"],
  ["'<div class=\"small mute\" style=\"margin-top:6px\">Employment status for the rate: <a class=\"link\" onclick=\"(window.LV95T=window.LV95T||{})[\\'' + esc(x.id) + '\\']=\\'' + (tier === 'Regular' ? 'New' : 'Regular') + '\\';lvSheet(\\'' + esc(x.id) + '\\')\">' + tier + ' (tap to change)</a></div>'",
   "'<div class=\"small mute\" style=\"margin-top:6px\">Rate: <b style=\"color:#2B2840\">' + (rk ? tier : 'checking rank…') + '</b>' + (rk ? ' · ' + esc(rk.fixed ? 'fixed-rate teacher' : rk.rank || 'no rank') + (window.LV95T && LV95T[x.id] ? ' · changed by hand' : ' (from rank)') : '') + ' <span>· New = Newly Hired / Starting Teacher · Regular = Newly Qualified and up</span>'"
   + " + (rk && isPres() ? ' · <a class=\"link\" onclick=\"(window.LV95T=window.LV95T||{})[\\'' + esc(x.id) + '\\']=\\'' + (tier === 'Regular' ? 'New' : 'Regular') + '\\';lvSheet(\\'' + esc(x.id) + '\\')\">change</a>' : '') + '</div>'"],
  ["+ '<div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:8px\">' + (charged.length ? btn('plan',",
   "+ (!rk ? '' : '<div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:8px\">' + (charged.length ? btn('plan',"],
  ["'All unexcused · ₱' + (rate('Unexcused') * n).toLocaleString(), 'ghost') + '</div>')",
   "'All unexcused · ₱' + (rate('Unexcused') * n).toLocaleString(), 'ghost') + '</div>'))"],
  ["async function lvCredit1795(id, k){ const x = LV && LV.rows.find(r => r.id === id); if(!x) return; const tier = (window.LV95T && LV95T[id]) || 'Regular';",
   "const LVRK1800 = {};\n"
   + "function lv1800rank(t){ const k = String(t || '').toLowerCase(); if(!k) return null; const v = LVRK1800[k]; if(v && v !== 'wait') return v; if(v === 'wait') return null; LVRK1800[k] = 'wait';   /* 1800: rank from the database, the same one pay uses */\n"
   + "  fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'tpay', teacher: t }) }).then(r => r.json()).then(r => { const k2 = (r && r.rank) || {}; LVRK1800[k] = { rank: k2.rank || '', fixed: !!k2.fixed, ok: !!(r && r.ok) }; }).catch(() => { LVRK1800[k] = { rank: '', fixed: false, ok: false }; })\n"
   + "    .finally(() => { try{ const b = document.querySelector('.lv95box'), x = b && LVF && LVF.id && LV && LV.rows.find(r => r.id === LVF.id); if(x){ const h = lvc1795(x); if(h) b.outerHTML = h; } }catch(e){} });\n"
   + "  return null; }\n"
   + "function lv1800tier(x){ const o = window.LV95T && LV95T[x.id]; if(o) return o; const rk = lv1800rank(x.teacher); if(!rk) return null; return rk.fixed ? 'Regular' : /newly hired|starting/i.test(rk.rank || '') ? 'New' : 'Regular'; }\n"
   + "async function lvCredit1795(id, k){ const x = LV && LV.rows.find(r => r.id === id); if(!x) return; const tier = lv1800tier(x); if(!tier) return toast('Checking the teacher’s rank · try again in a moment');"],
]);
