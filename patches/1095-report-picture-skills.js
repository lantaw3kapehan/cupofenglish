// 1095: (Misty, 25 Oct 21:53) "this one does not show the skill breakdown" — the parent picture (Copy picture) now ends
//      with the 20 skills the teacher rated, the same as page 2 of the PDF, laid out for a phone: each of Listening /
//      Speaking / Reading / Writing with its five skills, English + Chinese name, ●●●●○ and the rating 1–5.
//      Ratings come from the teacher's feedback (coe-fb, the same source as the app's PDF); if they cannot be loaded the
//      picture is made without this part, as before.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [["box.innerHTML = rpPicHtml();", "if(window.rpPicPrep) try{ await rpPicPrep(); }catch(x){} box.innerHTML = rpPicHtml();"]]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1095 · the 20 skills on the parent picture */
(function(){
  if(window.__1095) return; window.__1095 = 1;
  var SK = [['Listening', '听力', [['Understanding instructions', '理解指令'], ['Comprehension of conversations', '对话理解'], ['Recognition of key vocabulary', '关键词汇识别'], ['Note-taking skills', '记录要点'], ['Overall listening proficiency', '整体听力水平']]],
    ['Speaking', '口语', [['Fluency and coherence', '流利度与连贯性'], ['Lexical resource', '词汇运用'], ['Grammatical range and accuracy', '语法范围与准确性'], ['Pronunciation', '发音'], ['Interaction and engagement', '互动与参与']]],
    ['Reading', '阅读', [['Understanding main ideas', '理解主旨'], ['Detail comprehension', '细节理解'], ['Vocabulary recognition', '词汇识别'], ['Ability to infer meaning', '推断含义'], ['Reading speed', '阅读速度']]],
    ['Writing', '写作', [['Organization of ideas', '观点组织'], ['Use of vocabulary', '词汇使用'], ['Grammatical accuracy', '语法准确性'], ['Clarity and cohesion', '清晰与连贯'], ['Response to prompt', '切题程度']]]];
  var C = {};
  window.rpPicPrep = async function(){
    if(typeof RPD === 'undefined' || !RPD || !RPD.report) return; var x = RPD.report, k = x.code + '|' + x.month; if(C[k]) return;
    var r = await fetch(FAST_URL + '-fb', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: x.code }) }).then(function(y){ return y.json(); });
    if(!r || !r.ok) return; var it = null;
    var h = (r.hist || []).find(function(y){ return y.month === x.month && y.items && y.items.length; }); if(h) it = h.items;
    if(!it){ var sb = (r.sub || []).find(function(y){ return y.scores && (!y.month || y.month === x.month); }); if(sb) it = sb.scores; }
    if(it) C[k] = it.map(function(a){ return (a || []).map(Number); }); };
  function part(it){
    var dots = function(v){ var n = Math.max(0, Math.min(5, Math.round(+v || 0))), o = ''; for(var j = 0; j < 5; j++) o += '<span style="color:' + (j < n ? '#2E8F96' : '#D5E9EB') + '">●</span>'; return o; };
    return '<div style="margin-top:40px"><div style="font-size:34px;font-weight:700;color:#2B2450">Skill breakdown <span style="color:#2E8F96">分项能力评估</span></div><div style="font-size:24px;color:#5E5A76;margin-top:6px">Each skill rated 1–5 · 每项1–5分</div>'
      + SK.map(function(g, gi){ var a = it[gi] || []; return '<div style="margin-top:24px;background:#F6FAFB;border-radius:22px;padding:18px 26px 8px"><div style="font-size:30px;font-weight:700;color:#00707A;margin-bottom:6px">' + g[0] + ' ' + g[1] + '</div>'
        + g[2].map(function(s, si){ var v = a[si]; return '<div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-top:' + (si ? '1px solid #E3EEF0' : '0') + '"><div style="flex:1;min-width:0"><div style="font-size:27px;font-weight:600;color:#2B2450;line-height:1.25">' + s[0] + '</div><div style="font-size:25px;color:#3D3760;margin-top:2px">' + s[1] + '</div></div><div style="font-size:30px;letter-spacing:3px;white-space:nowrap">' + dots(v) + '</div><div style="width:36px;text-align:right;font-size:30px;font-weight:700;color:#2B2450">' + (v ? v : '—') + '</div></div>'; }).join('') + '</div>'; }).join('') + '</div>';
  }
  var _h = window.rpPicHtml;
  if(typeof _h === 'function') window.rpPicHtml = function(){ var h = _h.apply(this, arguments); try{ var x = RPD.report, it = C[x.code + '|' + x.month]; if(!it || !h) return h;
      var mk = '<div style="margin-top:44px;padding-top:24px;border-top:2px solid #E7E5EE', j = h.lastIndexOf(mk); if(j < 0) return h; return h.slice(0, j) + part(it) + h.slice(j); }catch(e){ return h; } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
