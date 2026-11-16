// 2258 (Misty 16 Nov 11:31–11:33): teacher profile cards in the app, easy to edit and to copy for Chinese parents.
// - Teachers › "Profile cards": every teacher's card (photo + name), tap to open, "New teacher" to make one.
// - The card screen: edit on the left, the picture updates on the right (sticky), Copy picture / Save picture / Save changes.
//   Teaching mix as rows (percent + text) with a 100% check. Status chip: Saved / Not saved yet.
// - No QR code on the cards (removed from the picture and the editor).
// - Teaching mix: a long line puts its （details） on their own line instead of breaking a word.
// - Photos are kept in the database as small pictures (data:image…), so a new photo shows at once and needs no Google.
// - Teacher Rose and Teacher Cy added to the starting text (Rose from Misty's corrected card, 16 Nov).
// Source: patches/src/2258-profile-cards.client.js · database: coe_dbf_h_profile keeps the photo; coe_dbf_prof_sync keeps it over Google's copy.
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2258-profile-cards.client.js"), "utf8");
const ROSE = `rose: { sub: '专业英语教师 · 温柔耐心 · 擅长引导孩子开口、自信表达',
creds: '持证专业教师\\n中等教育学士（英语专业）\\n4年以上少儿英语教学经验',
skills: '英语基础构建与能力进阶\\n听说读写综合能力提升\\n词汇、阅读理解与口语表达\\nOxford Discover 系列教材\\nCambridge English（Starters / Movers / Flyers / A2 Key）\\n引导式提问，帮助孩子组织语言、完整表达\\n鼓励害羞的孩子大胆开口\\n学习兴趣与良好课堂习惯培养',
mix: '35% 引导式提问与思考（给足思考时间 · 简单提问 · 举例引导）\\n35% 英语表达与沟通能力（自然开口 · 情境对话 · 自信表达）\\n20% 阅读理解与词汇积累（Oxford Discover · 阅读兴趣 · 小测巩固）\\n10% 综合能力培养（4Cs）（创造力 · 沟通力 · 合作力 · 思辨力）',
style: '课堂风格温柔亲切、常带笑容，给孩子充足的思考与回答时间。善于用简单的提问和例子引导孩子组织语言，对害羞或需要再解释一遍的孩子会放慢节奏、耐心等待，帮助孩子大胆开口，建立自信表达。' },
cy: { sub: '专业英语教师 · 擅长少儿英语启蒙与表达训练',
creds: '持证专业教师（TEFL）\\n5年以上少儿英语教学经验\\n海关管理学士、护理学学士',
skills: '自然拼读课程（Phonics）— 系统巩固音素与发音规则\\n适用于 PRE-A1 至 A2 水平学生的分层教学\\n牛津《Oxford Discover》1、2、3 — 探究式与项目式学习\\n麦格劳-希尔《Wonders》K-1 阶段课程 — 建立阅读兴趣与基础理解力\\nRaz-Kids 分级阅读 — 强化阅读流利度与理解技巧\\n4Cs 核心能力教学（批判思维·沟通·创造·合作）',
mix: '40% 教师示范（清晰示范）\\n35% 引导式口语（鼓励多说）\\n20% 学生输出（开放表达）\\n5% 创意活动（4Cs 强化）',
style: '课堂氛围温暖轻松，她以耐心与微笑陪伴低龄儿童，善于通过亲和力与互动让孩子自然开口，建立语言自信。' },
`;
lib(file, [
 ["resa: { sub: '专业英语教师 · 专注少儿英语启蒙与自信表达培养',", ROSE + "resa: { sub: '专业英语教师 · 专注少儿英语启蒙与自信表达培养',"],
 ["async function prfImg(id){ if(!id) return null; if(PRFIMG[id]) return PRFIMG[id];",
  "async function prfImg(id){ if(!id) return null; if(PRFIMG[id]) return PRFIMG[id]; if(/^data:image\\//.test(id)){ const im0 = await prfLd(id); if(im0) PRFIMG[id] = im0; return im0; }   /* 2258: photo kept in the database */"],
 ["P.photoNew = cut(x, y, s, s, 640, 'image/jpeg', 0.88);", "P.photoNew = cut(x, y, s, s, 520, 'image/jpeg', 0.86);"],
 ["P.photoNew = cut(cx - r, cy - r, r * 2, r * 2, 640, 'image/jpeg', 0.88); P.photoIm = await prfLd(P.photoNew);\nP.qrNew = cut(0.786 * W, 0.664 * H, 0.098 * W, 0.128 * H, 520, 'image/png'); P.qrIm = await prfLd(P.qrNew); }",
  "P.photoNew = cut(cx - r, cy - r, r * 2, r * 2, 520, 'image/jpeg', 0.86); P.photoIm = await prfLd(P.photoNew); }   /* 2258: no QR code */"],
 ["const mixL = prfLines(P.mix).map(l => { const x = l.match(/^(\\d+(?:\\.\\d+)?\\s*%)\\s*(.*)$/); return x ? [x[1].replace(/\\s/g, ''), wrap(x[2], mixF, 330)] : ['', wrap(l, mixF, 330)]; });",
  "const mw2258 = t => { const w1 = wrap(t, mixF, 296); if(w1.length < 2) return w1; const i = String(t).search(/[（(]/); return i > 0 ? wrap(String(t).slice(0, i).trim(), mixF, 296).concat(wrap(String(t).slice(i), mixF, 296)) : w1; };   /* 2258: （details） on their own line */\n" +
  "const mixL = prfLines(P.mix).map(l => { const x = l.match(/^(\\d+(?:\\.\\d+)?\\s*%)\\s*(.*)$/); return x ? [x[1].replace(/\\s/g, ''), mw2258(x[2])] : ['', mw2258(l)]; });"],
 ["P.qrIm ? qrTop + 380 : 0", "0"],
 ["if(P.qrIm){ const qw = 230", "if(P.qrIm && false){ const qw = 230"],
 ["el.src = P.url; const w = $('prfWait'); if(w) w.remove(); } }", "el.src = P.url; const w = $('prfWait'); if(w) w.remove(); } try{ window.prf2Thumb && prf2Thumb(); }catch(x){} }"],
 ["if(P.photoNew && r.photo){", "if(P.photoNew && !r.photo){ PRFIMG[P.photoNew] = P.photoIm; P.photo = P.photoNew; P.photoNew = ''; }   /* 2258: the database keeps the picture itself */\nif(P.photoNew && r.photo){"],
 ["styleL = wrap(P.style, stF, 1300)", "styleL = wrap(P.style, stF, 1640)"],
 ["const pcx = 1693, pcy = boxTop + 250, pr = 282;", "const pcx = 1693, pcy = Math.round((boxTop + boxBot) / 2), pr = 282;   /* 2258: no QR · photo in the middle of the box */"],
 ["c.fillStyle = TEAL; c.fillRect(370, stY - 72, 660, 3); c.textAlign = 'center'; c.font = stF; c.fillStyle = TEAL2; styleL.forEach((t, i) => c.fillText(t, 720, stY + i * 58)); c.fillStyle = TEAL; c.fillRect(370, stEnd + 40, 660, 3);",
  "c.fillStyle = TEAL; c.fillRect(W / 2 - 330, stY - 72, 660, 3); c.textAlign = 'center'; c.font = stF; c.fillStyle = TEAL2; styleL.forEach((t, i) => c.fillText(t, W / 2, stY + i * 58)); c.fillStyle = TEAL; c.fillRect(W / 2 - 330, stEnd + 40, 660, 3);   /* 2258: centred on the card */"],
 ["</script>\n</body>\n</html>", "</script>\n<script id=\"b2258\">\n" + JS + "</script>\n</body>\n</html>"],
]);
