// 2166 (13 Nov · Misty 18:15 "class reminders we copy and send to WeChat … with the student name in it, so parents won't feel it's same same"):
// the copied reminder (Schedule › Remind, the teacher's Remind) now names the student (English + Chinese name when we have it) and the
// teacher, and the wording is picked per student and day from a larger set, so two parents rarely get the same text. Same stages as
// before (on / soon / today / tomorrow / another day) and the VooV meeting ID on "on" and "soon". Nothing else changes.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>",
   `</script>
<script id="x2166">
/* 2166 · class reminders name the student and the teacher, and vary per student */
(function(){
  if(window.__x2166 || typeof window.scRemindText !== 'function') return; window.__x2166 = 1;
  const base = window.scRemindText;
  const CJK = /[\\u3400-\\u9fff]/;
  const nameOf = e => { let n = String(e.student || '').trim(); if(!n || /^ST-/i.test(n)){ const p = String(e.title || '').replace(/\\s+X$/, '').split('-'); n = p.length >= 4 ? p[3] : n; }
    return n.replace(/\\s+/g, ' ').trim(); };
  const hash = s => { let h = 7; for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const V = {
    on: [['Hi {n}! Class has started at {t}. Teacher {T} is waiting for you.', '{z}，{t}的课已经开始啦，{T}老师正在等你哦！'],
         ['{n}, it is class time ({t}). Please join now, Teacher {T} is ready.', '{z}，现在是上课时间（{t}），{T}老师已经准备好了，请尽快进入课堂。'],
         ['Class started at {t}. {n}, please join Teacher {T} now.', '{t}已经开始上课了，请{z}尽快进入课堂，{T}老师在等候。']],
    soon: [['Hi {n}! Class with Teacher {T} starts at {t}. Please get ready.', '{z}你好！{t}和{T}老师上课，请做好准备哦。'],
           ['{n}, class starts in a few minutes ({t}). See you soon!', '{z}，还有几分钟就上课啦（{t}），马上见！'],
           ['Almost time! {n}\\'s class with Teacher {T} starts at {t}.', '马上上课啦！{z}和{T}老师的课{t}开始。'],
           ['Please be ready, {n}. Teacher {T} will start class at {t}.', '请{z}做好准备，{T}老师{t}开始上课。']],
    today: [['Hi {n}! You have English class today at {t} with Teacher {T}.', '{z}你好！今天{t}有{T}老师的英语课哦。'],
            ['Reminder: {n} has class today at {t} with Teacher {T}.', '温馨提醒：{z}今天{t}和{T}老师上课。'],
            ['See you in class today at {t}, {n}! Teacher {T} is looking forward to it.', '{z}，今天{t}课堂见！{T}老师很期待和你上课。'],
            ['{n}\\'s English class is today at {t} (Teacher {T}).', '{z}的英语课在今天{t}（{T}老师）。'],
            ['Good day! A friendly reminder that {n} has class today at {t}.', '您好！温馨提醒：{z}今天{t}有英语课。']],
    tmw: [['Hi {n}! Class tomorrow at {t} with Teacher {T}.', '{z}你好！明天{t}和{T}老师上课哦。'],
          ['Reminder: {n} has English class tomorrow at {t}.', '温馨提醒：{z}明天{t}有英语课。'],
          ['See you tomorrow at {t}, {n}! Teacher {T}', '{z}，明天{t}课堂见！——{T}老师'],
          ['{n}\\'s next class is tomorrow at {t} with Teacher {T}.', '{z}的下一节课在明天{t}，{T}老师。']],
    day: [['Hi {n}! Your next class is on {D} at {t} with Teacher {T}.', '{z}你好！下一节课在{Z}{t}，{T}老师。'],
          ['Reminder: {n} has class on {D} at {t}.', '温馨提醒：{z}在{Z}{t}上课。'],
          ['See you on {D} at {t}, {n}! Teacher {T}', '{z}，{Z}{t}课堂见！——{T}老师']]
  };
  window.scRemindText = function(e){
    try{
      const n0 = nameOf(e); if(!n0) return base.apply(this, arguments);
      const s = new Date(e.start), now = Date.now(), t = tm(e.start), mins = Math.round((s - now) / 6e4);
      const today = ymdLocal(s) === ymdLocal(new Date()), tmw = ymdLocal(s) === ymdLocal(new Date(now + 864e5));
      const D = s.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      const Z = (s.getMonth() + 1) + '月' + s.getDate() + '日（周' + '日一二三四五六'[s.getDay()] + '）';
      let cn = ''; try{ cn = typeof cxCnOf === 'function' ? String(cxCnOf(e.code) || '').trim() : ''; }catch(x){}
      const z = cn && CJK.test(cn) ? cn : n0;
      const T = String(e.teacher || '').replace(/^teacher\\s+/i, '').trim().replace(/^./, c => c.toUpperCase()) || 'your teacher';
      const k = today && mins <= 0 ? 'on' : today && mins <= 20 ? 'soon' : today ? 'today' : tmw ? 'tmw' : 'day', L = V[k];
      const p = L[hash(String(e.code || n0) + '|' + ymdLocal(new Date()) + '|' + k) % L.length];
      const f = x => x.split('{n}').join(n0).split('{z}').join(z).split('{T}').join(T).split('{t}').join(t).split('{D}').join(D).split('{Z}').join(Z);
      const vo = e.meet && typeof meetFmt === 'function' ? '\\n\\n#腾讯会议：' + meetFmt(e.meet) : '';
      return f(p[0]) + '\\n' + f(p[1]).replace(/\\{T\\}老师/g, T + '老师') + (k === 'on' || k === 'soon' ? vo : '');
    }catch(x){ return base.apply(this, arguments); }
  };
})();
</script>
</body>
</html>`],
]);
