// Price picture › Copy message: optional enrolment + payment lines (on by default), in English with a Chinese line under each.
// The payment contact (e.g. "Dr. @Sunshine") is editable and remembered on the device (coe.ppPay).
require('../tools/lib.js')(process.argv[2], [
[
"'<div id=\"ppImg\" style=\"margin-top:12px\"><div class=\"sk\"></div><div class=\"sk\"></div></div>');",
"'<div class=\"card\" style=\"margin-top:10px;padding:10px 12px\"><label class=\"check\" for=\"ppPayOn\" style=\"margin:0\"><input type=\"checkbox\" id=\"ppPayOn\" ' + (PP.pay === false ? '' : 'checked') + ' onchange=\"PP.pay=this.checked\"><span>Add the enrolment and payment lines to the message</span></label><div class=\"row\" style=\"gap:8px;align-items:center;margin-top:6px\"><span class=\"small mute\">Payment with</span><input id=\"ppPayNm\" class=\"in-t grow\" style=\"margin:0\" value=\"' + esc(ppPayNm()) + '\" onchange=\"try{localStorage.setItem(\\'coe.ppPay\\',this.value.trim())}catch(e){}\"></div></div>' +\n'<div id=\"ppImg\" style=\"margin-top:12px\"><div class=\"sk\"></div><div class=\"sk\"></div></div>');"
],
[
"try{ await navigator.clipboard.writeText(tt); toast('Message copied · paste it with the picture'); }catch(e){ toast(t); } };",
"const ex = ppExtra(), out = ex ? tt.replace(/\\n\\n一杯英语（CupOfEnglish）$/, '') + ex + '\\n\\n一杯英语（CupOfEnglish）' : tt;\ntry{ await navigator.clipboard.writeText(out); toast('Message copied · paste it with the picture'); }catch(e){ toast(out); } };\nwindow.ppPayNm = function(){ let n = ''; try{ n = localStorage.getItem('coe.ppPay') || ''; }catch(e){} return n || 'Dr. @Sunshine'; };\nwindow.ppExtra = function(){ const on = $('ppPayOn'); if(on ? !on.checked : PP.pay === false) return ''; const el = $('ppPayNm'), nm = (el && el.value.trim()) || ppPayNm();\nreturn '\\n\\nFor enrolment, kindly refer to the attached course packages. You are welcome to choose whichever package best suits your preferences and learning goals.\\n报名请参阅图片中的课程方案，您可以根据自己的需求和学习目标，选择最适合的课程。' +\n'\\n\\nFor payment arrangements, kindly coordinate directly with ' + nm + ', who will be assisting us with the process.[Joyful]\\n付款事宜请直接与 ' + nm + ' 联系，她会协助我们完成付款。'; };"
]
]);
