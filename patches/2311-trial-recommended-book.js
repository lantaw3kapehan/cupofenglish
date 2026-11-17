// 2311 (Misty 17 Nov 16:21 "In this trial report, can you also let teachers choose the recommended book, so in management, it also
// automates and that's in the trial report?"):
// · Teacher's trial report: a "Recommended book" section under Learner type (required before sending); saved with the report (book).
// · Parent PDF: the starting point names the teacher's recommended book (Oxford Phonics levels, Raz-Kids, Wonders, Oxford Discover,
//   Reading Explorer, exams, adult courses), in English and Chinese.
// · Management: the student record's "CEFR & books" is filled from the trial report (CEFR + recommended book) when it is still empty.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["return { book: String(r.book || ''), student: t.student,", "return { book: String(f.book || r.book || ''), rec: !!f.book, student: t.student,"],
 ["function bookPath(p, F){ try{ const k = String(F.book || '').toLowerCase().replace(/[^a-z0-9]/g, ''), b = OPW[k]; if(!b || !p.length || !/phonics/i.test(String(p[5] || ''))) return p;",
  "function bookPath(p, F){ try{ const k = String(F.book || '').toLowerCase().replace(/[^a-z0-9]/g, ''), b = OPW[k];\n      if(F.rec && !b && p.length && window.BK2311 && BK2311[k]){ const x = BK2311[k], q = p.slice(); q[5] = x[0] + ' — ' + x[2]; q[6] = x[1] + '——' + x[3]; return q; }   /* 2311: the teacher's recommended book */\n      if(!b || !p.length || (!F.rec && !/phonics/i.test(String(p[5] || '')))) return p;"],
 ["q[5] = en + ' — ' + (String(p[5]).split(' — ')[1] || 'sound-by-sound phonics, so your child can read new words independently');",
  "q[5] = en + ' — ' + ((/phonics/i.test(String(p[5] || '')) && String(p[5]).split(' — ')[1]) || 'sound-by-sound phonics, so your child can read new words independently');"],
 ['<script id="b2278">',
  `<style id="d2311">#trBk .bkg{font-size:13px;font-weight:600;color:#4B5563;margin:12px 0 6px}#trBk .seg button{white-space:nowrap}</style>
<script id="b2311">
/* 2311 · Recommended book in the trial report (teacher) → parent PDF starting point → management's CEFR & books */
(function(){
  if(window.__b2311) return; window.__b2311 = 1;
  /* key (letters and digits of the book code) → [English, Chinese, what it does (EN), (ZH)] */
  const OD = n => ['Oxford Discover ' + n, '《牛津探索》' + n + '级', 'an inquiry-based course that builds speaking, reading and writing through big questions', '以探究式问题为主线，全面提升听说读写能力'];
  const RE = (n, z) => ['Reading Explorer ' + n, '《Reading Explorer》' + z, 'National Geographic readings that build reading skills and vocabulary', '国家地理真实阅读材料，提升阅读技巧与词汇量'];
  window.BK2311 = {
    razkids: ['Raz-Kids levelled readers', 'Raz-Kids 分级阅读', 'short levelled stories that build reading fluency step by step', '循序渐进的分级小故事，逐步提升阅读流利度'],
    wondersk: ['Wonders Kindergarten', '《Wonders》K级', 'a US reading and language course with stories, phonics and vocabulary', '美国语文课程，融合故事、自然拼读与词汇'],
    wonders1: ['Wonders Grade 1', '《Wonders》1级', 'a US reading and language course with stories, phonics and vocabulary', '美国语文课程，融合故事、自然拼读与词汇'],
    od1: OD(1), od2: OD(2), od3: OD(3), od4: OD(4), od5: OD(5), od6: OD(6),
    ref: RE('Foundations', '基础级'), re1: RE(1, '1级'), re2: RE(2, '2级'), re4: RE(4, '4级'),
    ket: ['Cambridge A2 Key (KET)', '剑桥 A2 Key（KET）', 'exam preparation for reading, writing, listening and speaking', '针对考试的听说读写全面备考'],
    pet: ['Cambridge B1 Preliminary (PET)', '剑桥 B1 Preliminary（PET）', 'exam preparation for reading, writing, listening and speaking', '针对考试的听说读写全面备考'],
    ieltsspeaking: ['IELTS Speaking', '雅思口语', 'test practice with feedback on fluency, vocabulary, grammar and pronunciation', '模拟练习，并就流利度、词汇、语法和发音给予反馈'],
    ieltswriting: ['IELTS Writing', '雅思写作', 'Task 1 and Task 2 practice with detailed feedback', '小作文与大作文练习，并提供详细批改'],
    toefl: ['TOEFL', '托福', 'test practice across all four skills', '四项技能的考试练习'],
    dailyenglish: ['Daily English', '日常英语', 'practical English for everyday situations', '日常生活场景中的实用英语'],
    freetalk: ['Free talk', '自由会话', 'guided conversation that builds fluency and confidence', '引导式对话，提升口语流利度与自信'],
    businessenglish: ['Business English', '商务英语', 'English for meetings, emails and presentations', '会议、邮件与演讲等职场英语'],
    debate: ['Debate', '辩论', 'structured speaking that builds reasoning and confidence', '结构化表达，提升逻辑思维与自信'] };
  /* the choices teachers see: [group, [[code saved, label]]] */
  const PH = ['Phonics', [['TheAlphabet', 'The Alphabet'], ['ShortVowels', 'Short Vowels'], ['LongVowels', 'Long Vowels'], ['ConsonantBlends', 'Consonant Blends'], ['LetterCombination', 'Letter Combinations']]];
  const RD = ['Reading', [['Raz Kids', 'Raz-Kids'], ['Wonders K', 'Wonders K'], ['Wonders 1', 'Wonders 1'], ['RE-F', 'Reading Explorer F'], ['RE-1', 'Reading Explorer 1'], ['RE-2', 'Reading Explorer 2'], ['RE-4', 'Reading Explorer 4']]];
  const ODG = ['Oxford Discover', [1, 2, 3, 4, 5, 6].map(n => ['OD' + n, 'OD' + n])];
  const EX = ['Exams', [['KET', 'KET'], ['PET', 'PET'], ['IELTS Speaking', 'IELTS Speaking'], ['IELTS Writing', 'IELTS Writing'], ['TOEFL', 'TOEFL']]];
  const AD = ['Courses', [['Daily English', 'Daily English'], ['Freetalk', 'Free talk'], ['BusinessEnglish', 'Business English'], ['Debate', 'Debate']]];
  const order = g => /^Adult/.test(g || '') ? [AD, EX, ODG, RD, PH] : /^Teen/.test(g || '') ? [ODG, RD, EX, AD, PH] : [PH, RD, ODG, EX, AD];
  const H = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function box(){ try{ const b = (typeof TRS !== 'undefined' && TRS && TRS.book) || '', G = order(typeof TRS !== 'undefined' && TRS ? TRS.group : '');
    return '<section class="sec" id="trBk"><h2>Recommended book</h2><div class="small mute">The book you suggest to start with. It shows on the parent PDF as the starting point, and management sees it when the student enrols.</div>' +
      G.map(([t, L]) => '<div class="bkg">' + t + '</div><div class="seg" style="flex-wrap:wrap;margin-top:0">' + L.map(([v, l]) => '<button type="button" class="' + (v === b ? 'on' : '') + '" onclick="trBook2311(\\'' + H(v) + '\\')">' + H(l) + '</button>').join('') + '</div>').join('') + '</section>'; }catch(e){ return ''; } }
  window.trBook2311 = function(v){ try{ TRS.book = TRS.book === v ? '' : v; trSave(); const el = document.getElementById('trBk'); if(el) el.outerHTML = box(); }catch(e){} };
  const gb = window.trGrpBox; if(typeof gb === 'function') window.trGrpBox = function(){ return gb.apply(this, arguments) + box(); };
  const gr = window.trGrp; if(typeof gr === 'function') window.trGrp = function(){ const o = document.getElementById('trBk'); if(o) o.remove(); return gr.apply(this, arguments); };
  const sd = window.trSend; if(typeof sd === 'function') window.trSend = function(){ try{ if(typeof TRF !== 'undefined' && TRF && typeof TRS !== 'undefined' && TRS && TRS.group && !TRS.book){ toast('Pick the recommended book'); const el = document.getElementById('trBk'); if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; } }catch(e){} return sd.apply(this, arguments); };
  const wrap = base => { const w = function(fn, tok, ctx, body){ try{ if(fn === 'tTrialSubmit' && body && typeof body === 'object' && typeof TRS !== 'undefined' && TRS && TRS.book && !body.book) body.book = TRS.book; }catch(e){} return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2311 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
  /* management: the student record's CEFR & books filled from the trial report while it is still empty */
  async function fill(){ try{ const s = document.getElementById('sCb'); if(!s || s.value || s.dataset.f2311) return; s.dataset.f2311 = '1';
      const day = ((document.getElementById('sTd') || {}).value || '').slice(0, 10), nm = ((document.getElementById('sEn') || {}).value || '').trim(); if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(day) || !nm) return;
      const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'trialData', token: TOKEN, date: day, student: nm, tables: false }) }).then(x => x.json()).catch(() => null);
      const f = r && r.ok && r.sub && r.sub.f; if(!f || !f.book) return; const s2 = document.getElementById('sCb'); if(!s2 || s2.value) return;
      const lv = ((document.getElementById('sTc') || {}).value || '').trim() || ((r.tr && r.tr.data && (r.tr.data[22] || r.tr.data[23] || r.tr.data[20])) || ''), v = (lv ? lv + ', ' : '') + f.book;
      if(![...s2.options].some(o => o.value === v)){ const o = document.createElement('option'); o.value = v; o.textContent = v; s2.appendChild(o); }
      s2.value = v; s2.dispatchEvent(new Event('change', { bubbles: true }));
      s2.insertAdjacentHTML('afterend', '<div class="small" style="color:#00737B;margin-top:4px">From the trial report' + (r.sub.who ? ' · Teacher ' + H(r.sub.who) : '') + ' recommended ' + H(f.book) + '</div>'); }catch(e){} }
  const sf = window.stuForm; if(typeof sf === 'function') window.stuForm = async function(){ const r = await sf.apply(this, arguments); setTimeout(fill, 60); setTimeout(fill, 1500); return r; };
})();
</script>
<script id="b2278">`],
]);
