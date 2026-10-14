// 14 Oct night · Enrolled · paid: the payment list is asked for as soon as a trial report (or a trial student's page)
// is opened, and kept 5 minutes, so it is usually ready when the form opens (Misty: "opening these are too slow").
require('../tools/lib.js')(process.argv[2], [
["const rp = api('mgmtEnrolPaid', TOKEN, { code, dry: true }).catch(e => ({ ok: false, msg: String((e && (e.msg || e.message)) || e) }));",
 "const rp = enPre(code);"],
["window.tlBtns = function(){ const r = _tb.apply(this, arguments);",
 "window.tlBtns = function(){ try{ if(D && D.mgr && typeof TLD !== 'undefined' && TLD && TLD.code) enPre(TLD.code); }catch(e){} const r = _tb.apply(this, arguments);"],
["window.enOth = function(){",
 "window.ENPRE = window.ENPRE || {};\n" +
 "window.enPre = function(code){ const k = String(code || '').toUpperCase(), x = ENPRE[k]; if(x && Date.now() - x.t < 300000) return x.p;\n" +
 "  const p = api('mgmtEnrolPaid', TOKEN, { code: k, dry: true }).catch(e => ({ ok: false, msg: String((e && (e.msg || e.message)) || e) })); ENPRE[k] = { t: Date.now(), p: p };\n" +
 "  p.then(r => { if(!r || !r.ok) delete ENPRE[k]; }); return p; };\n" +
 "window.enOth = function(){"],
["'<button class=\"btn sm ghost\" onclick=\"enSheet(", "'<button class=\"btn sm ghost\" onpointerdown=\"enPre(\\'' + esc(code) + '\\')\" onclick=\"enSheet("],
]);
