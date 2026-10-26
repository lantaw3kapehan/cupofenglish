// 1098: (Misty, 25 Oct 22:00) "be consistent with our logo header and footer, same as when we send the class schedule,
//      lesson summary etc — for uniformity and centralization" · "ensure the Chinese is authentic, native-speaker,
//      professional standard, especially in education services".
// · The parent picture now uses the same frame as the class / schedule pictures: light grey background, white rounded
//   card, CupOfEnglish logo top left with a label pill on the right ("October report · 10月学习报告"), a thin line,
//   "Student · 学生" and the name in the brand font, the same Rockwell type, and the "Learn with the best" tagline
//   artwork centred at the bottom.
// · Chinese wording reviewed for parents (report + PDF + picture, the same words everywhere):
//   需要加强的方面 (areas to improve) · 近月总分变化 (progress over the months) · 每项满分5分 · 比9月下降…分 ·
//   skills: 听懂指令 · 识别关键词汇 · 语法多样性与准确性 · 互动交流 · 词汇理解 · 推理判断 · 阅读流畅度 · 内容组织 ·
//   用词 · 清晰连贯 · 切题.  The teachers' own comments are not changed here.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const R = [["'理解指令'", "'听懂指令'"], ["'关键词汇识别'", "'识别关键词汇'"], ["'语法范围与准确性'", "'语法多样性与准确性'"], ["'互动与参与'", "'互动交流'"],
  ["'词汇识别'", "'词汇理解'"], ["'推断含义'", "'推理判断'"], ["'阅读速度'", "'阅读流畅度'"], ["'观点组织'", "'内容组织'"], ["'词汇使用'", "'用词'"],
  ["'清晰与连贯'", "'清晰连贯'"], ["'切题程度'", "'切题'"], ["'待提升方面'", "'需要加强的方面'"], ["'历月总分'", "'近月总分变化'"],
  ["历月总分</span>", "近月总分变化</span>"], ["每项1–5分", "每项满分5分"], ["'低' + (-d) + '分", "'下降' + (-d) + '分"]];
R.forEach(([a, b]) => { const n = s.split(a).length - 1; if(!n) throw new Error('1098: not found ' + a); s = s.split(a).join(b); });
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1098 · parent picture in the CupOfEnglish picture frame (same as the class / schedule pictures) */
(function(){
  if(window.__1098) return; window.__1098 = 1;
  var _h = window.rpPicHtml; if(typeof _h !== 'function') return;
  var F = "'Rockwell','Rockwell Nova',Arvo,'PingFang SC','Microsoft YaHei',serif", B = "'Fredoka One'," + F;
  window.rpPicHtml = function(){ var h = _h.apply(this, arguments); try{ if(!h) return h;
    var x = RPD.report, d = document.createElement('div'); d.innerHTML = h; var root = d.firstElementChild; if(!root) return h;
    var kids = [].slice.call(root.children); if(kids.length < 5) return h;
    var key = window.fbClsKey ? fbClsKey(x.month) : x.month, mo = +String(key).slice(5, 7), EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var logo = (document.querySelector('#login img') || {}).src || '', tag = (document.querySelector('#login .tagl img') || {}).src || '';
    var E = function(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var head = '<div style="display:flex;align-items:center;gap:20px">' + (logo ? '<img src="' + E(logo) + '" style="width:330px;height:auto;display:block">' : '<b style="font:400 40px ' + B + ';color:#2B2253">CupOfEnglish</b>') + '<span style="flex:1"></span>'
      + '<span style="background:#ECEAF6;color:#2B2253;font:700 26px ' + F + ';border-radius:30px;padding:14px 26px;white-space:nowrap">' + (EN[mo - 1] || '') + ' report · ' + mo + '月学习报告</span></div>'
      + '<div style="height:2px;background:#EEF0F4;margin:30px 0 26px"></div>'
      + '<div style="font:400 26px ' + F + ';color:#6F6B85">Student · 学生</div>'
      + '<div style="font:400 64px ' + B + ';color:#2B2253;line-height:1.15;margin-top:8px">' + E(x.student) + '</div>';
    var who = '<div style="margin-top:12px;font-size:28px;color:#4C4868;line-height:1.45">' + E(x.code) + ' · Teacher ' + E(x.teacher) + ' · ' + E(x.teacher) + '老师' + (RPD.fb && RPD.fb.course ? '<br>' + E(RPD.fb.course) : '') + '</div>';
    var foot = '<div style="height:2px;background:#EEF0F4;margin:44px 0 18px"></div><div style="text-align:center">' + (tag ? '<img src="' + E(tag) + '" style="width:230px;height:auto;display:inline-block">' : '<div style="font:400 24px ' + B + ';color:#2B2253">Learn with the best to be the best</div><div style="font-size:22px;color:#4C4868;margin-top:4px">与优秀者同行，遇见更好的自己</div>') + '</div>';
    kids[0].remove(); kids[1].remove(); kids[2].remove(); kids[3].remove(); kids[kids.length - 1].remove();
    root.style.cssText = 'width:1080px;box-sizing:border-box;padding:40px;background:#F3F6F7;color:#2B2450;font-family:' + F;
    var card = document.createElement('div'); card.style.cssText = 'background:#fff;border-radius:34px;padding:44px 44px 30px;border:2px solid #E8ECF0';
    card.innerHTML = head + who; while(root.firstChild) card.appendChild(root.firstChild); card.insertAdjacentHTML('beforeend', foot); root.appendChild(card);
    return d.innerHTML; }catch(e){ return h; } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
