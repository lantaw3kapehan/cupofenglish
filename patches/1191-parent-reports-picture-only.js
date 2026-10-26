// 1191: (Misty, 26 Oct 17:54) "for pdf feedback, it would be better to remove the pdf and just copy picture instead since parents
//      read feedback on mobile". Parent reports (management) become PICTURE-ONLY:
// · The report window no longer loads or shows the PDF (no mgmtReportPdf call, no "Loading PDF…", no app-made PDF after 6 s).
//   Instead it shows the phone picture itself (the same image "Copy picture" makes: logo frame, scores, compared with last
//   month, strengths · areas · next steps EN + 中文, 20 skills), scaled to fit, so it can be checked before copying.
// · Actions: Copy picture (main) · Share / save picture · Copy message (the WeChat caption) · Mark as sent · Return to teacher.
//   After a picture is copied or shared the window asks once "Sent to the parent? · Mark as sent" (never marks by itself).
// · "PDF being made" is now "Just in": feedback the teacher has sent while Google is still filing it. Those open at once and
//   their picture can be copied right away (built from the feedback data, not the PDF). Statuses and records are unchanged.
// · Screen wording: "the monthly feedback as a phone picture · English + 中文 · check it, then copy it to the parent on WeChat".
// Google still makes the PDFs in the background (no server change); they are simply not used here. Trial reports unchanged.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["if(RPD.report.file){ try{ const r = await api('mgmtReportPdf', TOKEN, key);", "if(false && RPD.report.file){ try{ const r = await api('mgmtReportPdf', TOKEN, key);"],
  ["h += `<div id=\"rpPdf\">${x.file ? '<div class=\"sk\" style=\"height:180px;margin-top:12px\"></div>' : '<div class=\"small mute\" style=\"margin-top:12px\">No PDF in",
   "h += `<div id=\"rpPdf\" data-doc=\"1\">${false ? '<div class=\"sk\" style=\"height:180px;margin-top:12px\"></div>' : '<div class=\"small mute\" style=\"margin-top:12px\">No PDF in"],
  ["setTimeout(go, x.file ? 6000 : 50);", "/* 1191: picture only, no app-made PDF */ void go;"],
  ["· the monthly feedback as your bilingual PDF · check it, then send it to the parent on WeChat",
   "· the monthly feedback as a phone picture · English + 中文 · check it, then copy it to the parent on WeChat"],
  ["['making','PDF being made · '+(RP.making||[]).length]", "['making','Just in · '+(RP.making||[]).length]"],
  ["making: 'No PDFs being made right now'", "making: 'Nothing just in · new feedback shows here for a few minutes while it is filed'"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="d1191">
#rpPdf .pic1191{margin:10px auto 0;width:min(100%,380px);max-height:560px;overflow-x:hidden;overflow-y:auto;border:1px solid #E7E5EE;border-radius:18px;background:#F3F6F7;position:relative;box-shadow:0 6px 20px rgba(43,34,83,.10)}
#rpPdf .pic1191>.sz{position:relative;overflow:hidden}
#rpPdf .pic1191 .in{transform-origin:top left;width:1080px;pointer-events:none}
#rpPdf .pic1191-h{display:flex;align-items:center;gap:8px;margin-top:14px;font:400 .875rem/1.4 var(--ui,Inter,system-ui,sans-serif);color:#5E5A76}
#rpPdf>.small{font-family:var(--ui,Inter,system-ui,sans-serif)}
#rpPdf .pic1191-h b{color:#2B2450}
#rpAct .ask1191{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 12px;border:1px solid #CDEBE8;background:#F2FAF9;border-radius:12px;margin-top:4px}
#rpAct .ask1191 span{flex:1 1 200px;color:#00585F;font-weight:600}
</style>
<script>
/* 1191 · Parent reports: picture only */
(function(){
  if(window.__1191) return; window.__1191 = 1;
  var has = function(){ return typeof RPD !== 'undefined' && RPD && RPD.report; };
  var E = function(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var drawn = null;
  async function preview(){
    if(!has()) return; var x = RPD.report, el = document.getElementById('rpPdf'); if(!el) return;
    if(!RPD.fb){ el.innerHTML = '<div class="small mute" style="margin-top:12px">No feedback scores in the app for this report' + (x.file ? ' (sent before the app)' : '') + '.</div>'; return; }
    var key = x.key + '|' + x.month;
    if(drawn === key && el.querySelector('.pic1191')) return; drawn = key;
    el.innerHTML = '<div class="pic1191-h"><b>Picture for the parent</b> · as the parent sees it on the phone · scroll to check</div><div class="pic1191" style="height:220px"><div class="sk" style="height:200px;margin:10px"></div></div>';
    try{ if(window.rpPicPrep) await rpPicPrep(); }catch(e){}
    if(!has() || RPD.report !== x) return;
    var box = el.querySelector('.pic1191'); if(!box || typeof window.rpPicHtml !== 'function') return;
    box.innerHTML = '<div class="sz"><div class="in">' + rpPicHtml() + '</div></div>';
    var fit = function(){ try{ var sz = box.firstChild, inn = sz && sz.firstChild; if(!inn) return; var k = Math.min(1, (box.clientWidth || 360) / 1080); inn.style.transform = 'scale(' + k + ')'; sz.style.height = Math.ceil(inn.scrollHeight * k) + 'px'; box.style.height = ''; }catch(e){} };
    fit(); var imgs = box.querySelectorAll('img'); [].forEach.call(imgs, function(im){ if(!im.complete) im.addEventListener('load', fit); });
    if(!box.__ro && window.ResizeObserver){ box.__ro = new ResizeObserver(fit); box.__ro.observe(box); }
  }
  function buttons(){
    var el = document.getElementById('rpAct'); if(!el || !has() || el.querySelector('#rpNote')) return;
    var x = RPD.report, sent = /^Sent/.test(x.status), ok = !!RPD.fb;
    el.innerHTML = (ok ? '<div class="row" style="gap:8px;width:100%"><button class="btn teal grow" id="rpCopy1191" onclick="rp1191Pic(0,this)">Copy picture</button><button class="btn ghost grow" onclick="rp1191Pic(1,this)">' + (navigator.share ? 'Share / save picture' : 'Save picture') + '</button></div>' : '')
      + '<button class="btn ghost" onclick="rpCopy()">Copy message</button>'
      + (!sent ? '<button class="btn ghost" onclick="rpMark()">Mark as sent</button><button class="btn ghost" onclick="rpReturn()">Return to teacher</button>' : '');
  }
  window.rp1191Pic = async function(save, btn){
    if(typeof window.rpPic94 !== 'function') return;
    var bad = false, t0 = window.toast;
    window.toast = function(m){ if(/could not|not available/i.test(String(m))) bad = true; return t0.apply(this, arguments); };
    try{ await rpPic94(save, btn); } finally{ window.toast = t0; }
    if(bad || !has() || /^Sent/.test(RPD.report.status)) return;
    var el = document.getElementById('rpAct'); if(!el || el.querySelector('.ask1191')) return;
    el.insertAdjacentHTML('beforeend', '<div class="ask1191" role="status"><span>Sent to the parent?</span><button class="btn teal sm" onclick="this.closest(\'.ask1191\').remove();rpMark(\'WeChat\')">Mark as sent</button><button class="btn ghost sm" onclick="this.closest(\'.ask1191\').remove()">Not yet</button></div>');
  };
  var _p = window.rpPaint; if(typeof _p === 'function') window.rpPaint = function(){ drawn = null; var r = _p.apply(this, arguments); try{ preview(); }catch(e){} return r; };
  var _b = window.rpBtns; if(typeof _b === 'function') window.rpBtns = function(force){ var r = _b.apply(this, arguments); try{ buttons(); }catch(e){} return r; };
  /* "Just in" reports: open at once with the feedback data (no PDF needed) */
  var _ao = window.rpAppOpen;
  window.rpAppOpen = async function(i){
    var m = (RP && RP.making || [])[i]; if(!m) return;
    RPB = null; RPD = { report: { key: m.key || '', code: m.code, student: m.student, teacher: m.teacher, month: RP.month, status: 'Ready', submitted: m.submitted || '', file: '' }, fb: null };
    openSheet('<h1>Parent report</h1><div class="sk"></div><div class="sk" style="width:60%"></div>'); document.getElementById('sheet').classList.add('wide');
    try{
      var r = await fetch(FAST_URL + '-fb', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: m.code }) }).then(function(y){ return y.json(); });
      var mo = RP.month, f = null;
      if(r && r.ok){
        var h = (r.hist || []).find(function(y){ return y.month === mo; });
        if(h) f = { total: h.total, l: h.l, s: h.s, r: h.r, w: h.w, strengths: h.strengths || '', areas: h.areas || '', next: h.next || '', cn: h.cn || {}, course: h.course || '' };
        else { var sb = (r.sub || []).find(function(y){ return y.scores && y.texts && (!y.month || y.month === mo); });
          if(sb){ var it = sb.scores.map(function(a){ return (a || []).map(Number); }), sum = function(a){ return (a || []).reduce(function(p, q){ return p + (q || 0); }, 0); };
            var L = sum(it[0]), S = sum(it[1]), Rr = sum(it[2]), W = sum(it[3]);
            f = { total: L + S + Rr + W, l: L, s: S, r: Rr, w: W, strengths: sb.texts[0] || '', areas: sb.texts[1] || '', next: sb.texts[2] || '', cn: {}, course: '' }; } }
      }
      if(typeof RPD !== 'undefined' && RPD && RPD.report.code === m.code){ RPD.fb = f; try{ if(window.fbcnApply) await fbcnApply(RPD); }catch(e){} rpPaint(); }
    }catch(e){ if(typeof _ao === 'function') return _ao.apply(this, arguments); rpPaint(); }
  };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
