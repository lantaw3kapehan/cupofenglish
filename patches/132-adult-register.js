// 14 Oct night · Adults are not "parents" (Misty: Ying is an adult student, use the right register).
// Trial card and renewal card say "the student" for adults (learner type Adult… on the trial, or an adult in DATABASE),
// and the trial follow-up messages (Day 3 / 7 / 14) speak to the adult directly (you / 您) instead of "your child".
require('../tools/lib.js')(process.argv[2], [
["sec(1, 'Send the report to the parent'", "sec(1, 'Send the report to the ' + whoW(t.code, t.group)"],
["sec(2, 'Help the parent decide'", "sec(2, 'Help the ' + whoW(t.code, t.group) + ' decide'"],
["' · when the parent has paid (or lessons are transferred)'", "' · when the ' + whoW(t.code, t.group) + ' has paid (or lessons are transferred)'"],
["head(1, 'Remind the parent'", "head(1, 'Remind the ' + whoW(code)"],
["head(2, 'What did the parent say?'", "head(2, 'What did the ' + whoW(code) + ' say?'"],
["head(3, 'Record the payment', paidDone ? '' : ' · when the parent has paid'", "head(3, 'Record the payment', paidDone ? '' : ' · when the ' + whoW(code) + ' has paid'"],
["head(4, 'Send the parent the new package'", "head(4, 'Send the ' + whoW(code) + ' the new package'"],
["Sent to the parent ${esc(x.sent.at)}", "Sent to the ${whoW(x.code, x.group)} ${esc(x.sent.at)}"],
["${esc(code)} · what did the parent say?", "${esc(code)} · what did the ${whoW(code)} say?"],
["function fuMsg(x, k){",
 "function whoW(code, group){ try{ if(/^adult/i.test(String(group || ''))) return 'student'; if(code && isAdult(code)) return 'student'; const T = (typeof TRL !== 'undefined' && TRL && TRL.rows) || [], t = T.find(y => String(y.code || '').toUpperCase() === String(code || '').toUpperCase() && y.group); if(t && /^adult/i.test(t.group)) return 'student'; }catch(e){} return 'parent'; }\n" +
 "function fuMsg(x, k){ if(whoW(x.code, x.group) === 'student') return fuMsgAd(x, k); return fuMsgKid(x, k); }\n" +
 "function fuMsgAd(x, k){ const nm = String(x.name || '').trim().split(/\\s+/)[0] || '', T = String(x.t || '').replace(/^teacher\\s+/i, '').split(/[,&/]/)[0].trim(), tzh = T ? T + '老师' : '老师', ten = T ? 'Teacher ' + T : 'our teacher';\n" +
 "const sug = String(x.sug || '').trim(), szh = sug.replace(/lessons?/i, '节课').replace(/\\s+/g, ' ');\n" +
 "const fri = (() => { const d = new Date(Date.now() + 3 * 864e5); while(d.getDay() !== 5) d.setDate(d.getDate() + 1); return d; })(), fen = fri.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }), fzh = (fri.getMonth() + 1) + '月' + fri.getDate() + '日（周五）';\n" +
 "if(k === 'd3') return `Hello ${nm}! This is CupOfEnglish 😊 Did you have a chance to read your trial class report? ${ten} really enjoyed the class with you.${x.cefr ? ` Your level is ${x.cefr}.` : ''} If you have any questions about your level or the learning plan, just let me know!\\n\\n${nm}您好！我是一杯英语😊 请问您看过您的试听课报告了吗？${tzh}很喜欢和您一起上课。${x.cefr ? `您目前的英语水平是${x.cefr}。` : ''}关于级别或学习计划有任何问题，都可以随时问我哦！`;\n" +
 "if(k === 'd7') return `Hello ${nm}! Here are ${ten}'s weekly open times 👇${sug ? ` For you, we suggest ${sug}.` : ''} Choose the times that suit you and we'll keep them for you. 😊\\n\\n${nm}您好！这是${tzh}每周可预约的上课时间👇${sug ? `我们建议您选择${szh}。` : ''}请选择适合您的时间，我们会为您保留。😊`;\n" +
 "return `Hello ${nm}! Just a friendly note — we're keeping ${ten}'s class times for you until ${fen}. If now isn't the right time, no problem at all — we're here whenever you're ready. 😊\\n\\n${nm}您好！温馨提醒：我们会为您保留${tzh}的上课时间到${fzh}。如果现在不方便也完全没关系，您随时准备好了都可以联系我们😊`; }\n" +
 "function fuMsgKid(x, k){"],
]);
