// 1969: (Misty 9 Nov 13:10 "can you also show here that it was returned? so its easy for us to check and explain to parents")
//   Lesson Summary and Shared Lesson Summary pictures: a "LESSONS RETURNED 退回课时" section lists each class of this package that was not held
//   because of the teacher ("Who asked? Teacher", 1947/1968): date, time, child, and "+0.5 returned". These lessons are not counted as
//   completed and stay in the package. Data: docs sys:returned (database coe_returned_build, every 5 min).
const fs = require('fs');
const file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const END = '<div style="margin-top:8px;font-size:11px;color:#6F6B85">Records current as of the date above. 记录更新至上述日期。</div></td></tr></table>`; }';
if (s.split(END).length - 1 !== 2) { console.error('Expected 2 summary endings'); process.exit(1); }
s = s.split(END).join('${(() => { try{ return window.ret1969 ? ret1969(G, C, code, st) : \'\'; }catch(e){ return \'\'; } })()}' + END);
fs.writeFileSync(file, s);
const HELP = "<script>\n/* 1969 · lessons returned (class not held by the teacher) for the Lesson Summary pictures */\n(function(){\n" +
"  let R = null, at = 0; try{ R = JSON.parse(localStorage.getItem('coe.ret1969') || 'null'); }catch(e){}\n" +
"  function load(){ try{ if(typeof TOKEN === 'undefined' || !TOKEN || !(typeof D !== 'undefined' && D && D.mgr) || Date.now() - at < 120000) return; at = Date.now();\n" +
"    fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:returned'] }) }).then(x => x.json())\n" +
"      .then(r => { const d = r && r.ok && r.docs && r.docs['sys:returned'] && r.docs['sys:returned'].data; if(d && d.by){ R = d.by; try{ localStorage.setItem('coe.ret1969', JSON.stringify(R)); }catch(e){} } }).catch(() => {}); }catch(e){} }\n" +
"  setTimeout(load, 4000); setInterval(load, 180000); window.addEventListener('focus', load);\n" +
"  window.ret1969 = function(G, C, code, st){ if(!R) return '';\n" +
"    const up = x => String(x || '').trim().toUpperCase(), nm = {};\n" +
"    const rows0 = (G && G.members) ? G.members.concat(G.owner ? [G.owner] : []) : []; rows0.forEach(x => { const k = up(x[C.code]); if(k && !nm[k]) nm[k] = String(x[C.name] || ''); });\n" +
"    if(code && !(up(code) in nm)) nm[up(code)] = '';\n" +
"    const from = st && !isNaN(st) ? st.getFullYear() + '-' + ('0' + (st.getMonth() + 1)).slice(-2) + '-' + ('0' + st.getDate()).slice(-2) : '';\n" +
"    const L = []; Object.keys(nm).forEach(k => (R[k] || []).forEach(x => { if(!from || x.d >= from) L.push(Object.assign({ k, n: nm[k] }, x)); }));\n" +
"    if(!L.length) return ''; L.sort((a, b) => (a.d + a.t).localeCompare(b.d + b.t));\n" +
"    const many = Object.keys(nm).length > 1, tot = Math.round(L.reduce((a, x) => a + (+x.u || 0), 0) * 10) / 10;\n" +
"    const fD = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }), zD = d => { const p = d.split('-'); return +p[0] + '年' + (+p[1]) + '月' + (+p[2]) + '日'; };\n" +
"    const e = s => String(s).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));\n" +
"    return '<div style=\"border-top:1px solid #3FA7A8;margin-top:12px;padding-top:8px;font-weight:700;color:#2B2253;font-size:13px\">LESSONS RETURNED <span style=\"font-weight:400\">退回课时</span></div>'\n" +
"      + '<table style=\"width:100%;border-collapse:collapse;margin-top:6px;font-size:13px\">' + L.map(x => '<tr style=\"border-top:1px solid #F1F2F6\"><td style=\"padding:5px 0\">' + e(fD(x.d)) + ' · ' + e(x.t) + '<div style=\"font-size:11px;color:#6F6B85\">' + e(zD(x.d)) + ' ' + e(x.t) + '</div></td>'\n" +
"        + (many ? '<td>' + e(x.n) + '</td>' : '') + '<td>Class not held by the teacher<div style=\"font-size:11px;color:#6F6B85\">因老师原因未能上课</div></td>'\n" +
"        + '<td style=\"text-align:right;white-space:nowrap\"><b style=\"color:#3FA7A8\">+' + x.u + '</b> returned<div style=\"font-size:11px;color:#6F6B85\">已退回 ' + x.u + ' 课时</div></td></tr>').join('') + '</table>'\n" +
"      + '<div style=\"margin-top:6px;font-size:12px;color:#4A4766;line-height:1.5\">' + tot + ' lesson' + (tot === 1 ? '' : 's') + ' returned: not counted as completed, still in the package.<br>共退回 ' + tot + ' 课时，不计入已上课时，仍保留在课程包中。</div>'; };\n" +
"})();\n</script>\n";
s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no </body>'); process.exit(1); }
s = s.slice(0, i) + HELP + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);   // version bump
