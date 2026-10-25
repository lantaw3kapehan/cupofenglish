// 1090: (Misty, 25 Oct 21:04–21:08) "the MONTHLY FEEDBACK that opens today until the 9th next month is NOVEMBER 2026? This is
//      for OCTOBER 2026" · "make the app change now, also the page, ensure it fits the page, so it's efficient and productive
//      to copy the picture and send to the parent — they read on mobile".
// 1 · Month names: the feedback system names a cycle after the month it is DUE (opens 25 Oct, due 9 Nov → key 2026-11). The
//     records keep that key; the app now shows the month of the CLASSES the feedback is about (key − 1 month): Parent reports
//     title and month buttons ("October 2026 classes"), the report header, Overview's "Parent reports sent", and the WeChat
//     message to the parent ("October progress report" / "10月的学习报告").
// 2 · Phone picture: each parent report has "Picture for parent" — one tall image, 1080 px wide (phone width), made from the
//     same feedback: student, October 2026, teacher, course, total /100 with a bar, the four skills /25, strengths · areas ·
//     next steps in English and Chinese. Big type so a parent reads it on a phone without zooming. "Copy picture" puts it on
//     the clipboard for WeChat; on phones "Share" opens the share sheet; "Save" downloads the PNG. The PDF is unchanged.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["${esc(RP.label)} · the monthly feedback as your bilingual PDF",
   "${esc(window.fbClsLab ? fbClsLab(RP.month || RP.current, RP.label) + ' classes' : RP.label)} · the monthly feedback as your bilingual PDF"],
  ["esc(new Date(m+'-15').toLocaleDateString('en-GB',{month:'long',year:'numeric'}))",
   "esc(window.fbClsLab ? fbClsLab(m) : new Date(m+'-15').toLocaleDateString('en-GB',{month:'long',year:'numeric'}))"],
  ["esc(new Date(x.month+'-15').toLocaleDateString('en-GB',{month:'long',year:'numeric'}))",
   "esc(window.fbClsLab ? fbClsLab(x.month) + ' classes' : new Date(x.month+'-15').toLocaleDateString('en-GB',{month:'long',year:'numeric'}))"],
  ["mo = Number(String(x.month).slice(5,7)), en = new Date(x.month + '-15').toLocaleDateString('en-GB',{month:'long'})",
   "mo = window.fbClsKey ? Number(fbClsKey(x.month).slice(5,7)) : Number(String(x.month).slice(5,7)), en = new Date((window.fbClsKey ? fbClsKey(x.month) : x.month) + '-15').toLocaleDateString('en-GB',{month:'long'})"]
]);
let s = fs.readFileSync(file, 'utf8');
s = s.split("<span>Parent reports sent · ${esc(RP.label || '')}</span>").join("<span>Parent reports sent · ${esc(window.fbClsLab && (RP.month || RP.current) ? fbClsLab(RP.month || RP.current) + ' classes' : (RP.label || ''))}</span>");
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1090 · feedback month = the month of the classes · phone picture of the parent report */
(function(){
  if(window.__1090) return; window.__1090 = 1;
  window.fbClsKey = function(k){ var m = String(k || '').match(/^(\d{4})-(\d{2})/); if(!m) return k; var y = +m[1], mo = +m[2] - 1; if(mo < 1){ mo = 12; y--; } return y + '-' + (mo < 10 ? '0' : '') + mo; };
  window.fbClsLab = function(k, fb){ var c = fbClsKey(k); if(!/^\d{4}-\d{2}$/.test(String(c))) return fb || k; return new Date(c + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); };
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var NL = function(s){ return E(s).replace(/\n/g, '<br>'); };
  function page(x, f){
    var key = fbClsKey(x.month), en = fbClsLab(x.month), zm = Number(String(key).slice(5, 7)), zy = String(key).slice(0, 4);
    var logo = (document.querySelector('#login img') || document.querySelector('.hd img') || {}).src || '';
    var sk = [['Listening', '听力', f.l], ['Speaking', '口语', f.s], ['Reading', '阅读', f.r], ['Writing', '写作', f.w]];
    var tot = +f.total || 0, pct = Math.max(0, Math.min(100, tot));
    var bar = function(v, max){ var p = Math.max(0, Math.min(100, (+v || 0) / max * 100)); return '<div style="height:16px;border-radius:8px;background:#E3F1F2;overflow:hidden"><div style="height:16px;width:' + p + '%;background:#2E8F96;border-radius:8px"></div></div>'; };
    var sec = function(en1, zh1, a, b){ if(!a && !b) return ''; return '<div style="margin-top:34px"><div style="font-size:34px;font-weight:700;color:#2B2450">' + en1 + ' <span style="color:#2E8F96">' + zh1 + '</span></div>'
      + (a ? '<div style="font-size:31px;line-height:1.5;margin-top:12px;color:#2B2450">' + NL(a) + '</div>' : '') + (b ? '<div style="font-size:31px;line-height:1.6;margin-top:12px;color:#3D3760">' + NL(b) + '</div>' : '') + '</div>'; };
    return '<div style="width:1080px;box-sizing:border-box;padding:56px 60px 60px;background:#fff;color:#2B2450;font-family:Inter,\'Noto Sans SC\',\'PingFang SC\',\'Microsoft YaHei\',system-ui,sans-serif">'
      + '<div style="display:flex;align-items:center;gap:20px">' + (logo ? '<img src="' + E(logo) + '" style="height:84px">' : '') + '<div style="flex:1"></div><div style="text-align:right;font-size:26px;color:#5E5A76">' + E(en) + '<br>' + zy + '年' + zm + '月</div></div>'
      + '<div style="margin-top:36px;font-size:30px;font-weight:600;letter-spacing:.06em;color:#2E8F96">MONTHLY PROGRESS REPORT · ' + zm + '月学习报告</div>'
      + '<div style="margin-top:10px;font-size:64px;font-weight:700;line-height:1.1">' + E(x.student) + '</div>'
      + '<div style="margin-top:12px;font-size:28px;color:#5E5A76">' + E(x.code) + ' · Teacher ' + E(x.teacher) + ' ' + E(x.teacher) + '老师' + (f.course ? '<br>' + E(f.course) : '') + '</div>'
      + '<div style="margin-top:36px;background:#EAF7F8;border-radius:28px;padding:34px 36px"><div style="display:flex;align-items:baseline;gap:16px"><div style="font-size:120px;font-weight:700;line-height:1;color:#00707A">' + E(f.total) + '</div><div style="font-size:36px;color:#3D3760">/ 100</div><div style="flex:1"></div><div style="font-size:30px;text-align:right;color:#3D3760">Total score<br>本月总分</div></div>'
      + '<div style="margin-top:22px;height:22px;border-radius:11px;background:#fff;overflow:hidden"><div style="height:22px;width:' + pct + '%;background:#00A3AD;border-radius:11px"></div></div></div>'
      + '<div style="margin-top:30px">' + sk.map(function(k){ return '<div style="display:grid;grid-template-columns:300px 1fr 110px;align-items:center;gap:20px;margin-top:20px"><div style="font-size:32px;font-weight:600">' + k[0] + ' <span style="color:#2E8F96;font-weight:500">' + k[1] + '</span></div>' + bar(k[2], 25) + '<div style="font-size:34px;font-weight:700;text-align:right">' + (k[2] === '' || k[2] == null ? '—' : E(k[2])) + '<span style="font-size:24px;color:#5E5A76;font-weight:500">/25</span></div></div>'; }).join('') + '</div>'
      + sec('Strengths', '优势表现', f.strengths, f.cn && f.cn.strengths) + sec('Areas to improve', '待提升方面', f.areas, f.cn && f.cn.areas) + sec('Next steps', '下一步学习目标', f.next, f.cn && f.cn.next)
      + '<div style="margin-top:44px;padding-top:24px;border-top:2px solid #E7E5EE;font-size:26px;color:#5E5A76;display:flex;justify-content:space-between"><span>CupOfEnglish 一杯英语</span><span>Thank you for your support! 感谢您的支持！</span></div></div>';
  }
  async function make(){ if(typeof RPD === 'undefined' || !RPD || !RPD.fb) throw new Error('This report has no feedback scores yet.');
    var H = await h2c(); var box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-20000px;top:0;z-index:-1'; box.innerHTML = page(RPD.report, RPD.fb); document.body.appendChild(box);
    try{ var imgs = box.querySelectorAll('img'); await Promise.all([].map.call(imgs, function(im){ return im.complete ? 0 : new Promise(function(z){ im.onload = im.onerror = z; }); }));
      var cv = await H(box.firstChild, { scale: 1, backgroundColor: '#ffffff', useCORS: true, logging: false });
      return await new Promise(function(z){ cv.toBlob(z, 'image/png'); }); } finally { box.remove(); } }
  var fname = function(){ var x = RPD.report; return 'ProgressReport_' + String(x.student || '').replace(/[^\w-]/g, '') + '_' + fbClsKey(x.month) + '.png'; };
  window.rpPicCopy = async function(btn){ var t = btn && btn.textContent; try{ if(btn){ btn.disabled = true; btn.textContent = 'Making picture…'; }
      var b = await make(); if(!window.ClipboardItem || !navigator.clipboard) throw new Error('nocopy'); await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); toast('Picture copied · paste it in the parent’s WeChat chat'); }
    catch(e){ if(e && e.message === 'nocopy') { toast('Copy is not available here · use Save or Share'); } else toast((e && e.message) || 'Could not make the picture'); }
    finally{ if(btn){ btn.disabled = false; btn.textContent = t; } } };
  window.rpPicShare = async function(btn){ var t = btn && btn.textContent; try{ if(btn){ btn.disabled = true; btn.textContent = 'Making picture…'; }
      var b = await make(), f = new File([b], fname(), { type: 'image/png' });
      if(navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f] });
      else { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fname(); document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 4000); toast('Picture saved'); } }
    catch(e){ if(!(e && e.name === 'AbortError')) toast((e && e.message) || 'Could not make the picture'); }
    finally{ if(btn){ btn.disabled = false; btn.textContent = t; } } };
  window.rpPicHtml = function(){ return typeof RPD !== 'undefined' && RPD && RPD.fb ? page(RPD.report, RPD.fb) : ''; };
  var _b = window.rpBtns;
  if(typeof _b === 'function') window.rpBtns = function(){ var r = _b.apply(this, arguments); try{ var el = document.getElementById('rpAct'); if(el && typeof RPD !== 'undefined' && RPD && RPD.fb && !el.querySelector('.pic1090')){
      var mob = /Android|iPhone|iPad/i.test(navigator.userAgent);
      el.insertAdjacentHTML('afterbegin', '<div class="pic1090" style="width:100%;display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px"><b style="font-size:.875rem">Picture for parent <span class="mute" style="font-weight:400">· phone size, English + 中文</span></b><span style="flex:1"></span>'
        + '<button class="btn sm teal" onclick="rpPicCopy(this)">Copy picture</button><button class="btn sm ghost" onclick="rpPicShare(this)">' + (mob ? 'Share' : 'Save') + '</button></div>'); } }catch(e){} return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
