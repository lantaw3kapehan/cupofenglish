// 653: (Misty) no flicker — tonight's boxes (missing videos, video checks, videos to check) draw at once from the copy kept on the
// device, and redraw only when the server's answer is different (no pop-in / jump when nothing changed).
require('../tools/lib.js')(process.argv[2], [
[
"try{ const r = await api('tVidList', TOKEN); if(r && r.ok){ VL = { list: r.list || [], t: Date.now() }; window.VL_LIST = VL.list;",
"try{ const r = await api('tVidList', TOKEN); if(r && r.ok){ if(JSON.stringify(r.list || []) === JSON.stringify(window.VL_LIST || [])) return; VL = { list: r.list || [], t: Date.now() }; window.VL_LIST = VL.list;"
],
[
"try{ const r = await api('tVidFlags', TOKEN); if(r && r.ok){ TF = r.list || [];",
"try{ const r = await api('tVidFlags', TOKEN); if(r && r.ok){ if(JSON.stringify(r.list || []) === JSON.stringify(TF)) return; TF = r.list || [];"
],
[
"let MF = null, mBusy = false;",
"let MF = (() => { try{ return JSON.parse(localStorage.getItem('coe.vflagsm') || 'null'); }catch(e){ return null; } })(), mBusy = false;"
],
[
"try{ const r = await api('mgmtVidFlags', TOKEN); if(r && r.ok){ MF = r.list || []; mPaint(); } }catch(e){}",
"try{ const r = await api('mgmtVidFlags', TOKEN); if(r && r.ok){ const L = r.list || []; if(MF && JSON.stringify(L) === JSON.stringify(MF)) return; MF = L; try{ localStorage.setItem('coe.vflagsm', JSON.stringify(MF)); }catch(e){} mPaint(); } }catch(e){}"
]
]);
