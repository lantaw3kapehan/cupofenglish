// 2166 (13 Nov · Misty 18:22 "for the class reminders we copy and send to WeChat … with the student name in it, so parents won't feel
// it's same same"): the class reminder names the student (English + Chinese name when known) and the teacher, and the wording is picked per
// student and day (not one wording for everyone that day). Same stages as before (day / tomorrow / today / soon / started), VooV number
// kept for soon / started. Management and teachers (Ops off) both copy this text.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>", `</script>
<script id="x2166">
/* 2166 · class reminders: the student's name and the teacher, wording varied per student */
(function(){
  if(window.__x2166 || typeof window.scRemindText !== 'function') return; window.__x2166 = 1;
  const base = window.scRemindText;
  const h = s => { let x = 7; for(const ch of String(s)) x = (x * 31 + ch.charCodeAt(0)) >>> 0; return x; };
  const enName = e => { let n = String(e.student || '').trim(); if(!n){ const p = String(e.title || '').split(/[-–]/); n = p.length > 3 ? p[3] : ''; } return n.replace(/\\s*\\(.*\\)$/, '').split(/\\s+/)[0] || ''; };
  const zhName = e => { try{ const L = [].concat(window.MS || [], (window.D && (D.students || [])) || [], (window.D && (D.special || [])) || []);
      const s = L.find(x => x && x.code && e.code && String(x.code).toUpperCase() === String(e.code).toUpperCase()); return String((s && s.cn) || '').trim(); }catch(x){ return ''; } };
  window.scRemindText = function(e){
    try{
      const en = enName(e); if(!en) return base.apply(this, arguments);
      const zh = zhName(e) || en, tch = String(e.teacher || '').replace(/^teacher\\s+/i, '').trim(), T = tch ? tch.charAt(0).toUpperCase() + tch.slice(1) : '';
      const s = new Date(e.start), n = Date.now(), t = tm(e.start), mins = Math.round((s - n) / 6e4), today = ymdLocal(s) === ymdLocal(new Date()), tmw = ymdLocal(s) === ymdLocal(new Date(n + 864e5));
      const Dd = s.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }), Z = (s.getMonth() + 1) + '月' + s.getDate() + '日（周' + '日一二三四五六'[s.getDay()] + '）';
      const vo = e.meet ? '\\n\\n#腾讯会议：' + meetFmt(e.meet) : '';
      const wT = T ? ' with Teacher ' + T : '', zT = T ? '和' + T + '老师' : '';
      const V = {
        on: [['{n}, class has started ({t}). Teacher {T} is waiting for you!', '{z}，{t}的课已经开始啦，{T}老师在等你哦！'],
             ['Hi {n}! Class started at {t}. Please join now.', '{z}你好！{t}已经开始上课，请尽快进入课堂。'],
             ['{n}, it is class time ({t}). See you in VooV!', '{z}，{t}上课时间到啦，腾讯会议见！']],
        soon: [['Hi {n}! Class{wT} starts at {t}. Please get ready.', '{z}你好！{t}{zT}上课，请做好准备哦。'],
               ['{n}, class starts in a few minutes ({t}).', '{z}，还有几分钟就上课啦（{t}）。'],
               ['Almost time, {n}! Class{wT} at {t}.', '{z}，马上上课啦！{t}{zT}上课。']],
        today: [['Hi {n}! Reminder: English class{wT} today at {t}.', '{z}你好！温馨提醒：今天{t}{zT}上英语课哦。'],
                ['{n}, see you in class today at {t}!', '{z}，今天{t}课堂见！'],
                ['Hello {n}! Class{wT} today at {t}.', '{z}，今天{t}{zT}上课，期待见到你！'],
                ['Hi {n}, your English class is today at {t}.', '{z}你好，今天{t}有英语课哦。']],
        tmw: [['Hi {n}! Reminder: class{wT} tomorrow at {t}.', '{z}你好！温馨提醒：明天{t}{zT}上课哦。'],
              ['{n}, see you in class tomorrow at {t}!', '{z}，明天{t}课堂见！'],
              ['Hi {n}, your English class is tomorrow at {t}.', '{z}你好，明天{t}有英语课哦。']],
        day: [['Hi {n}! Reminder: class{wT} on {D} at {t}.', '{z}你好！温馨提醒：{Z}{t}{zT}上课。'],
              ['{n}, see you in class on {D} at {t}!', '{z}，{Z}{t}课堂见！']]
      };
      const k = today && mins <= 0 ? 'on' : today && mins <= 20 ? 'soon' : today ? 'today' : tmw ? 'tmw' : 'day', L = T ? V[k] : V[k].filter(v => v[0].indexOf('{T}') < 0);
      const p = L[h((e.code || en) + '|' + ymdLocal(new Date()) + '|' + k) % L.length];
      const f = x => x.split('{n}').join(en).split('{z}').join(zh).split('{t}').join(t).split('{D}').join(Dd).split('{Z}').join(Z)
        .split('{wT}').join(wT).split('{zT}').join(zT).split('{T}').join(T);
      const a = f(p[0]), b = f(p[1]);
      return a + '\\n' + b + (k === 'on' || k === 'soon' ? vo : '');
    }catch(x){ return base.apply(this, arguments); }
  };
})();
</script>
</body>
</html>`],
]);
