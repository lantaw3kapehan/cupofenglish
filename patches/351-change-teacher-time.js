// 19 Oct · Change teacher: optional "New time" (24h) — Lewis moves from Teacher Julia 18:30 to Teacher Mayi 18:00, new book OD1. Same weekday; length kept.
require('../tools/lib.js')(process.argv[2], [
["<label>New book <span class=\"mute small\">(optional · leave empty to keep the books)</span></label><input id=\"ctB\"",
 "<label>New time <span class=\"mute small\">(optional · 24h, e.g. 18:00 · leave empty to keep the times · same weekday)</span></label><input id=\"ctT\" class=\"in-t\" placeholder=\"e.g. 18:00\" value=\"${esc(CT.time || '')}\" onchange=\"ctSet('time',this.value)\" autocomplete=\"off\" inputmode=\"numeric\">\n<label>New book <span class=\"mute small\">(optional · leave empty to keep the books)</span></label><input id=\"ctB\""],
["will move to <b>Teacher ${esc(CT.nw || '…')}</b> · same days and times${M.length ? `<div class=\"small mute\" style=\"margin-top:4px\">${M.slice(0, 6).map(c => esc(ymd(c.start).slice(5) + ' ' + hm(c.start) + (c.book ? ' · ' + c.book : ''))).join(' · ')}",
 "will move to <b>Teacher ${esc(CT.nw || '…')}</b> · ${NT() ? 'same days, at <b>' + esc(NT()) + '</b>' : 'same days and times'}${CT.time && !NT() ? ' <span style=\"color:#B03A2E\">· time must be like 18:00</span>' : ''}${M.length ? `<div class=\"small mute\" style=\"margin-top:4px\">${M.slice(0, 6).map(c => esc(ymd(c.start).slice(5) + ' ' + (NT() ? hm(c.start) + '→' + NT() : hm(c.start)) + ' · ' + (CT.book || c.book || ''))).join(' · ')}"],
["onclick=\"ctRun()\" ${CT.nw && M.length ? '' : 'disabled'}>", "onclick=\"ctRun()\" ${CT.nw && M.length && !(CT.time && !NT()) ? '' : 'disabled'}>"],
["  window.ctSet = (k, v) => { if(k === 'from') CT.from = v; else CT[k] = v;",
 "  const NT = () => { const m = String((CT && CT.time) || '').trim().replace(/[.：]/g, ':').match(/^([01]?\\d|2[0-3]):?([0-5]\\d)$/); return m ? m[1].padStart(2, '0') + ':' + m[2] : ''; };\n  window.ctSet = (k, v) => { if(k === 'from') CT.from = v; else CT[k] = v;"],
["  window.ctRun = async function(){ const M = moving(), o = Object.assign({}, CT); if(!o.nw || !M.length) return;",
 "  window.ctRun = async function(){ const M = moving(), o = Object.assign({}, CT, { nt: NT() }); if(!o.nw || !M.length || (o.time && !o.nt)) return;"],
["time: hm(c.start), mins: Math.round((new Date(c.end) - new Date(c.start)) / 6e4) || 25, teacher: o.nw };",
 "time: o.nt || hm(c.start), mins: Math.round((new Date(c.end) - new Date(c.start)) / 6e4) || 25, teacher: o.nw };"],
["to Teacher ${esc(o.nw)} from ${esc(o.from)} · Google Calendar follows",
 "to Teacher ${esc(o.nw)} from ${esc(o.from)}${o.nt ? ' · now at ' + esc(o.nt) : ''} · Google Calendar follows"],
]);
