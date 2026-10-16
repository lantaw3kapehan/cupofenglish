// 16 Oct · The parent's lesson summary picture (Copy picture) shows the validity notice too, in English and Chinese, under
// "Package Ends": "Validity ended May 23, 2026 · extended 146 days · 有效期已于2026年5月23日结束 · 已延长146天"
// (only when the date has passed and lessons are left). The app's notice gets the Chinese as well.
const P = '\n<div style="margin-top:10px;font-size:12px;line-height:1.5;color:#4A4766">${st ? `Package Starts: ${fD(st)} · 课程包开始：${zD(st)}<br>` : \'\'}${dl ? `Package Ends: ${fD(dl)} · 课程包结束：${zD(dl)}<br>` : \'\'}';
const Q = '\n<div style="margin-top:10px;font-size:12px;line-height:1.5;color:#4A4766">${st ? `Package Starts: ${fD(st)} · 课程包开始：${zD(st)}<br>` : \'\'}${dl ? `Package Ends: ${fD(dl)} · 课程包结束：${zD(dl)}<br>` : \'\'}${vnLine(dl, left)}';
const fn = "\n</script>\n<script>\n/* 16 Oct · the validity line on the lesson summary picture (parents) */\nfunction vnLine(dl, left){ try{ if(!dl || !(+left > 0)) return ''; const t = new Date(); t.setHours(0, 0, 0, 0); const d = new Date(dl); d.setHours(0, 0, 0, 0); if(!(d < t)) return '';\n  const n = Math.round((t - d) / 864e5), en = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), zh = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';\n  return '<span style=\"color:#B05A16;font-weight:700\">Validity ended ' + en + ' · extended ' + n + ' day' + (n === 1 ? '' : 's') + ' · 有效期已于' + zh + '结束 · 已延长' + n + '天</span><br>'; }catch(e){ return ''; } }\n</script>\n\n</body>";
require('../tools/lib.js')(process.argv[2], [
["剩余 ${left} 课时。</div>" + P, "剩余 ${left} 课时。</div>" + Q],
["剩余 ${left} 课时。`}</div>" + P, "剩余 ${left} 课时。`}</div>" + Q],
["extended ${v.days} day${v.days === 1 ? '' : 's'}</span>`;", "extended ${v.days} day${v.days === 1 ? '' : 's'} · 已延长${v.days}天</span>`;"],
["\n</script>\n\n</body>", fn],
]);
