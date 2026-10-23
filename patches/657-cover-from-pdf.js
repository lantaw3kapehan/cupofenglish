// 657: covers Google has no preview for are drawn from page 1 of the PDF in the app (PDF.js + server mgmtBookRange) and saved.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '657-cover-from-pdf.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('657 · Book covers when Google') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, [
[
"window.bbRetake = async () => { toast('Taking the covers again…'); try{ const r = await api('mgmtBookCovers', TOKEN, [CUR.code], true); await load(true); const z = r && r.list && r.list[0]; toast(z && (z.msg || z.sbErr || z.wbErr) || 'Covers updated ✓'); sheet(); }catch(e){ toast(e.message); } };",
"window.bbRetake = async () => { toast('Taking the covers again…'); try{ const r = await api('mgmtBookCovers', TOKEN, [CUR.code], true); const z = r && r.list && r.list[0];\n    if(z && (z.sbErr || z.wbErr) && window.bbFillMissing){ toast('Drawing page 1 of the book…'); const f = await bbFillMissing([z]); if(f.bad.length) toast('Not drawn: ' + f.bad.join(', ')); }   /* 657 */\n    await load(true); toast(z && z.msg || 'Covers updated ✓'); sheet(); }catch(e){ toast(e.message); } };"
],
[
"const r = await api('mgmtBookCovers', TOKEN, left || []); const L = (r && r.list) || []; n += L.filter(x => !x.later).length;",
"const r = await api('mgmtBookCovers', TOKEN, left || []); const L = (r && r.list) || []; n += L.filter(x => !x.later).length;\n      if(window.bbFillMissing){ const M = L.filter(x => x.sbErr || x.wbErr); if(M.length) await bbFillMissing(M, (c, sd) => { if(btn) btn.textContent = 'Drawing page 1 · ' + c + ' ' + (sd === 'wb' ? 'Workbook' : 'Student Book') + '…'; }); }   /* 657 */"
],
[
"const r = await api('mgmtBookCovers', TOKEN, [CUR.code]); await load(true); const z = r && r.list && r.list[0]; if(z && (z.msg || z.sbErr)) toast(z.msg || z.sbErr); if(CUR) sheet();",
"const r = await api('mgmtBookCovers', TOKEN, [CUR.code]); const z = r && r.list && r.list[0]; if(z && (z.sbErr || z.wbErr) && window.bbFillMissing){ toast('Drawing page 1 of the book…'); await bbFillMissing([z]); } await load(true); if(z && z.msg) toast(z.msg); if(CUR) sheet();"
]
]);
