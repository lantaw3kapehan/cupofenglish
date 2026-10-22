// 627: Celebrate wording for Chinese parents — classic blessings (健康快乐，学业进步 · 更上一层楼 · 坚持就是胜利) with matching English, and the CupOfEnglish signature "A cup of cheers" / 一杯英语全体老师为你喝彩.
require('../tools/lib.js')(process.argv[2], [
[
"const WI = x.kind === 'bday' ? ['Wishing you a wonderful year of learning, growing and fun!', '祝你新的一岁快乐成长，学习进步！'] : x.kind === 'book' ? ['Your hard work is paying off. Keep up the great work!', '你的努力有了回报，继续加油！'] : ['We are proud of your progress. Keep up the great work!', '我们为你的进步感到骄傲，继续加油！'];",
"const WI = x.kind === 'bday' ? ['Wishing you good health, happiness and great progress in your studies!', '祝你健康快乐，学业进步！'] : x.kind === 'book' ? ['Onwards and upwards! Your hard work is paying off.', '更上一层楼！你的努力有了回报。'] : ['Persistence pays off! We are proud of your progress.', '坚持就是胜利！我们为你的进步感到骄傲。'];"
],
[
"c.fillText('With love from your teachers at CupOfEnglish.', MX, wy + 56); c.fillText('一杯英语全体老师敬上', MX, wy + 86);",
"c.fillStyle = '#00737B'; c.font = '700 22px ' + F; c.fillText('A cup of cheers from your teachers at CupOfEnglish!', MX, wy + 58); c.fillText('一杯英语全体老师为你喝彩！', MX, wy + 90);"
],
[
"if(x.kind === 'bday') return `Happy Birthday, ${en}! 🎂 Wishing you a wonderful year of learning, growing and fun. From all your teachers at CupOfEnglish\\n${cn}，生日快乐！🎂 祝你新的一岁快乐成长，学习进步！一杯英语全体老师`;\n    if(x.kind === 'book') return `Congratulations, ${en}! 🎉 You have moved up to ${x.bookN}. Your hard work is paying off. Keep it up!\\n恭喜${cn}！🎉 已升级到新教材 ${x.bookN}。你的努力有了回报，继续加油！`;\n    return `Congratulations, ${en}! 🎉 You have completed ${x.n} lessons with CupOfEnglish. We are proud of your progress!\\n恭喜${cn}！🎉 已在一杯英语完成${x.n}节课，我们为你的进步感到骄傲！`; }",
"if(x.kind === 'bday') return `Happy Birthday, ${en}! 🎂 Wishing you good health, happiness and great progress in your studies. A cup of cheers from your teachers at CupOfEnglish!\\n${cn}，生日快乐！🎂 祝你健康快乐，学业进步！一杯英语全体老师为你喝彩！`;\n    if(x.kind === 'book') return `Congratulations, ${en}! 🎉 You have moved up to ${x.bookN}. Onwards and upwards! A cup of cheers from your teachers at CupOfEnglish!\\n恭喜${cn}！🎉 已升级到新教材 ${x.bookN}，更上一层楼！一杯英语全体老师为你喝彩！`;\n    return `Congratulations, ${en}! 🎉 You have completed ${x.n} lessons with CupOfEnglish. Persistence pays off! A cup of cheers from your teachers at CupOfEnglish!\\n恭喜${cn}！🎉 已在一杯英语完成${x.n}节课，坚持就是胜利！一杯英语全体老师为你喝彩！`; }"
]
]);
