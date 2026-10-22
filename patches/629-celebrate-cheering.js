// 629: "A cup of cheers" reads like a drinking toast for young children → "Your teachers at CupOfEnglish are cheering for you!" (= 一杯英语全体老师为你喝彩！).
require('../tools/lib.js')(process.argv[2], [
[
"c.fillText('A cup of cheers from your teachers at CupOfEnglish!', MX, wy + 52);",
"c.fillText('Your teachers at CupOfEnglish are cheering for you!', MX, wy + 52);"
],
[
"if(x.kind === 'bday') return `Happy Birthday, ${en}! 🎂 Wishing you good health, happiness and great progress in your studies. A cup of cheers from your teachers at CupOfEnglish!\\n${cn}，生日快乐！🎂 祝你健康快乐，学业进步！一杯英语全体老师为你喝彩！`;\n    if(x.kind === 'book') return `Congratulations, ${en}! 🎉 You have moved up to ${x.bookN}. Onwards and upwards! A cup of cheers from your teachers at CupOfEnglish!\\n恭喜${cn}！🎉 已升级到新教材 ${x.bookN}，更上一层楼！一杯英语全体老师为你喝彩！`;\n    return `Congratulations, ${en}! 🎉 You have completed ${x.n} lessons with CupOfEnglish. Persistence pays off! A cup of cheers from your teachers at CupOfEnglish!\\n恭喜${cn}！🎉 已在一杯英语完成${x.n}节课，坚持就是胜利！一杯英语全体老师为你喝彩！`; }",
"if(x.kind === 'bday') return `Happy Birthday, ${en}! 🎂 Wishing you good health, happiness and great progress in your studies. Your teachers at CupOfEnglish are cheering for you!\\n${cn}，生日快乐！🎂 祝你健康快乐，学业进步！一杯英语全体老师为你喝彩！`;\n    if(x.kind === 'book') return `Congratulations, ${en}! 🎉 You have moved up to ${x.bookN}. Onwards and upwards! Your teachers at CupOfEnglish are cheering for you!\\n恭喜${cn}！🎉 已升级到新教材 ${x.bookN}，更上一层楼！一杯英语全体老师为你喝彩！`;\n    return `Congratulations, ${en}! 🎉 You have completed ${x.n} lessons with CupOfEnglish. Persistence pays off! Your teachers at CupOfEnglish are cheering for you!\\n恭喜${cn}！🎉 已在一杯英语完成${x.n}节课，坚持就是胜利！一杯英语全体老师为你喝彩！`; }"
]
]);
