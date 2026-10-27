// 1352: Parent portal → Student portal 学员专区 (adult students use it too). Management button "Student access 学员专区";
//       neutral panel wording; Copy WeChat message has two templates by learner type (the app's adult rule — DATABASE
//       school grade WA/UM/U#/PhD/ADULT or age ≥ 20 and not a G# grade — sent by coe-student sList as x.adult):
//       adults → "Simon 您好 / Hello Simon"; young learners (and unknown) → "Mia 家长您好 / Hello, Mia's family".
const file = process.argv[2];
require('../tools/lib.js')(file, [
[`  function msg(x){ var n = x.name || '孩子', cn = x.cn ? x.cn : n;
    return '【CupOfEnglish 一杯英语 · 家长专区 Parent portal】\\n' + cn + '家长您好！现在可以在手机上随时查看孩子的课表、课后作业、课堂反馈和月度学习报告。\\n'
      + '链接 Link：' + URLS + '\\n学号 Student code：' + x.code + '\\n'
      + (x.own ? '密码 Password：您已设置的新密码（如忘记请联系我们重置）\\n' : '密码 Password：孩子的英文名 ' + n + '（不区分大小写 · not case-sensitive）\\n')
      + '建议在微信中直接点击链接打开；登录后30天内无需再次登录。\\n\\n'
      + 'Hello! You can now see ' + n + '\\'s classes, homework, class notes and monthly reports on your phone. Open the link and sign in with the student code and ' + (x.own ? 'the password you set.' : 'your child\\'s English name.'); }`,
`  function msg(x){ var n = x.name || '', head = '【CupOfEnglish 一杯英语 · 学员专区 Student portal】\\n', tail = '建议在微信中直接点击链接打开；登录后30天内无需再次登录。\\n\\n',
      link = '链接 Link：' + URLS + '\\n学号 Student code：' + x.code + '\\n', own = '密码 Password：您已设置的新密码（如忘记请联系我们重置）\\n';
    if (x.adult) return head + (n ? n + ' ' : '') + '您好！现在可以在手机上随时查看您的课表、课后作业、课堂反馈和月度学习报告。\\n' + link
      + (x.own ? own : '密码 Password：您的英文名 ' + n + '（不区分大小写 · not case-sensitive）\\n') + tail
      + 'Hello' + (n ? ' ' + n : '') + '! You can now see your classes, homework, class notes and monthly reports on your phone. Open the link and sign in with your student code and ' + (x.own ? 'the password you set.' : 'your English name.');
    return head + (n ? n + ' ' : '') + '家长您好！现在可以在手机上随时查看' + (n ? ' ' + n + ' 的' : '') + '课表、课后作业、课堂反馈和月度学习报告。\\n' + link
      + (x.own ? own : '密码 Password：学员英文名 ' + n + '（不区分大小写 · not case-sensitive）\\n') + tail
      + 'Hello' + (n ? ', ' + n + '\\'s family' : '') + '! You can now see ' + (n ? n + '\\'s' : 'the') + ' classes, homework, class notes and monthly reports on your phone. Open the link and sign in with the student code and ' + (x.own ? 'the password you set.' : (n ? n + '\\'s' : 'the student\\'s') + ' English name.'); }`],
[`' <span class="mute small">· ' + e(x.code) + (x.enrolled ? '' : ' · not enrolled') + '</span>'`,
 `' <span class="mute small">· ' + e(x.code) + ' · ' + (x.adult ? 'Adult' : 'Young learner') + (x.enrolled ? '' : ' · not enrolled') + '</span>'`],
[`(x.own ? ' · parent set own password' : ' · password = English name')`, `(x.own ? ' · own password set' : ' · password = English name')`],
[`el.innerHTML = '<h1>Parent access</h1><div class="mute small">Parents sign in at <b>' + e(URLS) + '</b> with the <b>ST code</b> and the <b>child’s English name</b> (not case-sensitive). They see only their own child: next class, lessons left, schedule, homework &amp; class notes, level, reports sent to parents, attendance.`,
 `el.innerHTML = '<h1>Student access 学员专区</h1><div class="mute small">Adult students and young learners’ families sign in at <b>' + e(URLS) + '</b> with the <b>ST code</b> and the <b>student’s English name</b> (not case-sensitive). They see only that student: next class, lessons left, schedule, homework &amp; class notes, level, monthly reports already sent, attendance. The WeChat message greets adults by name and young learners’ families as “家长”.`],
[`' famil' + (on === 1 ? 'y has' : 'ies have') + ' signed in so far.`, `' student' + (on === 1 ? ' has' : 's have') + ' signed in so far.`],
[`toast('Copied · paste it to ' + (x.name || code) + '’s parents on WeChat')`, `toast('Copied · paste it to ' + (x.adult ? (x.name || code) : (x.name || code) + '’s family') + ' on WeChat')`],
[`toast(r && r.ok ? 'Cleared · the English name works again (the family is signed out)'`, `toast(r && r.ok ? 'Cleared · the English name works again (signed out on all phones)'`],
[`openSheet('<div id="ps1350"><h1>Parent access</h1>`, `openSheet('<div id="ps1350"><h1>Student access 学员专区</h1>`],
[`onclick="psOpen()">Parent access</button>`, `onclick="psOpen()">Student access 学员专区</button>`],
]);
