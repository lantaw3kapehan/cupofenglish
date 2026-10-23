// 660: (Misty) Books to buy — "Copy picture" instead of Share / save: the picture and each cover go straight to the clipboard to paste in
// WeChat (no saving to the laptop). Covers are turned into PNG for the clipboard. Share / save stays only as the fallback.
require('../tools/lib.js')(process.argv[2], [
[
"  window.bbSaveCover = async side => { const r = rowOf(CUR.code) || {}, u = r[side + '_cover']; if(!u) return;\n    try{ const b = await fetch(u).then(x => x.blob()); await give(b, (r.title || CUR.code).replace(/[^\\w.-]+/g, '-') + (side === 'wb' ? '-Workbook' : '-Student-Book') + (b.type === 'image/png' ? '.png' : '.jpg')); }catch(e){ toast('Could not save the cover'); } };",
"  /* 660 · copy to the clipboard first (paste in WeChat); the clipboard call is made at once in the tap, the picture follows */\n  const toPng = b => b && b.type === 'image/png' ? Promise.resolve(b) : createImageBitmap(b).then(bm => new Promise(ok => { const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height; c.getContext('2d').drawImage(bm, 0, 0); c.toBlob(ok, 'image/png'); }));\n  function copyImg(pBlob, name){ try{ if(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write){ return navigator.clipboard.write([new ClipboardItem({ 'image/png': pBlob.then(toPng) })]).then(() => toast('Picture copied ✓ · paste it in WeChat'), () => pBlob.then(b => give(b, name))); } }catch(e){} return pBlob.then(b => give(b, name)); }\n  window.bbSaveCover = side => { const r = rowOf(CUR.code) || {}, u = r[side + '_cover']; if(!u) return;\n    copyImg(fetch(u).then(x => x.blob()), (r.title || CUR.code).replace(/[^\\w.-]+/g, '-') + (side === 'wb' ? '-Workbook' : '-Student-Book') + '.png'); };"
],
[
"window.bbGive = () => PICB && give(PICB.blob, PICB.name);",
"window.bbGive = () => PICB && copyImg(Promise.resolve(PICB.blob), PICB.name);"
],
[
"onclick=\"bbGive()\">' + (navigator.share ? 'Share / save' : 'Copy picture') + '</button>",
"onclick=\"bbGive()\">Copy picture</button>"
],
[
"onclick=\"bbSaveCover(\\'sb\\')\">Student Book cover alone</button>",
"onclick=\"bbSaveCover(\\'sb\\')\">Copy Student Book cover</button>"
],
[
"onclick=\"bbSaveCover(\\'wb\\')\">Workbook cover alone</button>",
"onclick=\"bbSaveCover(\\'wb\\')\">Copy Workbook cover</button>"
],
[
"The covers alone are for Taobao photo search (拍立淘).",
"Copy, then paste in the class WeChat group · the covers alone are for Taobao photo search (拍立淘)."
],
[
"<button class=\"btn ghost sm\" style=\"margin-top:4px\" onclick=\"bbSaveCover(\\'' + side + '\\')\">Save cover</button>",
"<button class=\"btn ghost sm\" style=\"margin-top:4px\" onclick=\"bbSaveCover(\\'' + side + '\\')\">Copy cover</button>"
]
]);
