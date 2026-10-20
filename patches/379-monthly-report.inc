/* 20 Oct · 379 · Monthly parent report made in the app, ready at once (like the trial report · Misty: "do all now").
   From the teacher's monthly feedback (FEEDBACK DATA copy in the database, or her app submission before Google copies it) through coe-fb:
   page 1 · student, course, teacher, month · overall score and the four skills · progress over the months · strengths, areas for improvement, next steps (English + Chinese)
   page 2 · the 20 skills rated 1–5 (what each one means), about this report.
   Same look as the schedule pictures and the trial report (logo, label, tagline). It becomes the report file for the existing buttons
   (Copy picture, Send on WeChat, Save PDF) when Google's PDF is not there yet, and "PDF being made" reports can now be opened and sent. */
(function(){
  const e = s => esc(String(s == null ? '' : s)), nl = s => e(s).replace(/\n/g, '<br>');
  const SK = [['Listening', '听力', [['Understanding instructions', '理解指令', 'Following spoken directions and tasks'], ['Comprehension of conversations', '对话理解', 'Understanding dialogues and discussions'], ['Recognition of key vocabulary', '关键词汇识别', 'Identifying essential words and phrases'], ['Note-taking skills', '记录要点', 'Noting important information while listening'], ['Overall listening proficiency', '整体听力水平', 'Understanding and processing spoken English']]],
    ['Speaking', '口语', [['Fluency and coherence', '流利度与连贯性', 'Flow of speech and logical connection of ideas'], ['Lexical resource', '词汇运用', 'Range and appropriateness of vocabulary'], ['Grammatical range and accuracy', '语法范围与准确性', 'Correct use of grammar in speech'], ['Pronunciation', '发音', 'Clarity of sounds and intonation'], ['Interaction and engagement', '互动与参与', 'Responding effectively in conversation']]],
    ['Reading', '阅读', [['Understanding main ideas', '理解主旨', 'Identifying the central themes of a text'], ['Detail comprehension', '细节理解', 'Grasping specific details and information'], ['Vocabulary recognition', '词汇识别', 'Understanding vocabulary in reading'], ['Ability to infer meaning', '推断含义', 'Reading between the lines'], ['Reading speed', '阅读速度', 'Reading fluently and efficiently']]],
    ['Writing', '写作', [['Organization of ideas', '观点组织', 'Logical structure and flow'], ['Use of vocabulary', '词汇使用', 'Appropriate and varied words'], ['Grammatical accuracy', '语法准确性', 'Correct grammar in writing'], ['Clarity and cohesion', '清晰与连贯', 'Clear and connected writing'], ['Response to prompt', '切题程度', 'Meeting the task requirements']]]];
  const K = ['l', 's', 'r', 'w'];   /* FEEDBACK DATA item order: Listening, Speaking, Reading, Writing */
  const mLab = m => { try{ return new Date(m + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); }catch(x){ return m; } };
  const mZh = m => { const p = String(m).split('-'); return p.length > 1 ? p[0] + '年' + (+p[1]) + '月' : m; };
  const mShort = m => { try{ return new Date(m + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'short' }); }catch(x){ return m; } };
  async function data(code){ const r = await fetch(FAST_URL + '-fb', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code }) }).then(x => x.json()); if(!r || !r.ok) throw new Error('data'); return r; }
  function facts(code, month, r, hint){
    const H = (r.hist || []).slice().sort((a, b) => String(a.month).localeCompare(String(b.month)));
    let f = H.find(x => x.month === month) || null;
    if(!f){ const s = (r.sub || []).find(x => x.scores && x.texts && (!x.month || x.month === month)); if(s){ const it = s.scores.map(a => a.map(Number)), sum = a => a.reduce((p, q) => p + (q || 0), 0);
      f = { month, teacher: s.who, items: it, l: sum(it[0] || []), s: sum(it[1] || []), r: sum(it[2] || []), w: sum(it[3] || []), strengths: s.texts[0] || '', areas: s.texts[1] || '', next: s.texts[2] || '', cn: {}, course: (hint && hint.course) || '', submitted: String(s.at || '').slice(0, 10) };
      f.total = f.l + f.s + f.r + f.w; } }
    if(!f) return null;
    const hist = H.filter(x => x.month <= month && x.total != null).slice(-6); if(!hist.some(x => x.month === month)) hist.push({ month, total: f.total });
    return { code, month, student: (hint && hint.student) || r.stu.en || f.student || code, cn: r.stu.cn || '', teacher: f.teacher || (hint && hint.teacher) || '', course: f.course || '', total: f.total, sk: K.map(k => f[k]),
      items: f.items || [], strengths: f.strengths || '', areas: f.areas || '', next: f.next || '', zh: Object.assign({}, f.cn || {}), submitted: f.submitted || '', hist: hist.slice(-6) }; }
  function pages(F){
    const LG = (document.querySelector('#login img') || {}).src || '', TG = (document.querySelector('#login .tagl img') || {}).src || '';
    const gen = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const head = `<div class="tr-top"><div class="tr-logo">${LG ? '<img src="' + LG + '" alt="CupOfEnglish">' : '<b>CupOfEnglish</b>'}</div><div class="tr-title"><span class="tr-pill">Monthly progress report · 月度学习报告</span></div></div>
      <div class="tr-sub">${e(mLab(F.month))} report · ${e(mZh(F.month))}学习报告 · made ${e(gen)}</div>`;
    const foot = n => `<div class="tr-foot"><span class="tr-fl">${e(F.student)} · ${e(F.code)}</span>${TG ? '<img src="' + TG + '" alt="Learn with the best">' : '<span>Learn with the best to be the best</span>'}<span class="tr-fr">${n} / 2</span></div>`;
    const H = (en, zh) => `<div class="tr-h"><b>${e(en)}</b><span>${e(zh)}</span></div>`;
    const tiles = SK.map((s, i) => { const v = F.sk[i]; return `<div class="mr-t"><span>${e(s[0])} ${e(s[1])}</span><b>${v == null || v === '' ? '—' : e(v)}<i> / 25</i></b><div class="tr-bar"><i style="width:${Math.round((+v || 0) / 25 * 100)}%"></i></div></div>`; }).join('');
    const mx = 100, bw = 56, gap = 22, ch = 110, hs = F.hist, W = hs.length * (bw + gap);
    const chart = hs.length > 1 ? `<svg width="${W}" height="${ch + 34}" viewBox="0 0 ${W} ${ch + 34}">${hs.map((x, i) => { const h = Math.max(4, Math.round((+x.total || 0) / mx * ch)), xx = i * (bw + gap), cur = x.month === F.month;
      return `<rect x="${xx}" y="${ch - h + 14}" width="${bw}" height="${h}" rx="8" fill="${cur ? '#1F8F96' : '#CDEBE8'}"/><text x="${xx + bw / 2}" y="${ch - h + 9}" text-anchor="middle" font-size="12" font-weight="700" fill="#2B2253">${e(x.total)}</text><text x="${xx + bw / 2}" y="${ch + 30}" text-anchor="middle" font-size="11" fill="#7A768F">${e(mShort(x.month))}</text>`; }).join('')}</svg>` : '<div class="tr-note">The progress chart starts from the second month. · 从第二个月起显示进步图表。</div>';
    const T = (en, zh, a, b) => a ? `${H(en, zh)}<div class="tr-tx">${nl(a)}</div>${b ? `<div class="tr-tx zh">${nl(b)}</div>` : ''}` : '';
    const p1 = `<div class="tr-page">${head}
      <div class="tr-info"><div><span>STUDENT 学生</span><b>${e(F.student)}${F.cn ? ' <i>' + e(F.cn) + '</i>' : ''}</b></div><div><span>COURSE 课程</span><b>${e(F.course || '—')}</b></div><div><span>TEACHER 教师</span><b>Teacher ${e(F.teacher)}</b></div><div><span>MONTH 月份</span><b>${e(mLab(F.month))}</b></div></div>
      <div class="mr-sc"><div class="mr-tot"><span>OVERALL 总分</span><b>${e(F.total)}</b><i>/ 100</i></div><div class="mr-ts">${tiles}</div></div>
      ${H('PROGRESS OVER THE MONTHS', '历月总分')}<div class="mr-ch">${chart}</div>
      ${T('STRENGTHS', '优势表现', F.strengths, F.zh.strengths)}${T('AREAS FOR IMPROVEMENT', '待提升方面', F.areas, F.zh.areas)}${T('NEXT STEPS AND LEARNING GOALS', '下一步学习目标', F.next, F.zh.next)}
      ${foot(1)}</div>`;
    const dots = v => { v = Math.max(0, Math.min(5, +v || 0)); return '●'.repeat(v) + '○'.repeat(5 - v); };
    const rows = SK.map((s, i) => `<tr class="tr-sec"><td colspan="3"><b>${e(s[0])} ${e(s[1])}</b> · ${e(F.sk[i] == null ? '—' : F.sk[i])} / 25</td></tr>` + s[2].map((c, j) => { const v = (F.items[i] || [])[j];
      return `<tr><td><b>${e(c[0])}</b><br><i>${e(c[1])}</i></td><td class="mr-d">${e(c[2])}</td><td class="tr-dots">${dots(v)} <b>${v == null ? '—' : e(v)}</b></td></tr>`; }).join('')).join('');
    const p2 = `<div class="tr-page">${head}${H('SKILL BREAKDOWN', '分项能力评估 · 1 … 5')}<table class="tr-tb sm"><tr><th>SKILL 能力</th><th>WHAT IT MEANS 说明</th><th>RATING 评分</th></tr>${rows}</table>
      <div class="tr-about">About this report — Each month your teacher rates 20 skills from 1 to 5 based on the lessons: 25 points for each of listening, speaking, reading and writing, 100 in total. The comments come from the teacher's own notes from class. · 关于本报告——老师每月根据课堂表现为20项能力评分（1–5分）：听、说、读、写各25分，总分100分。评语来自老师的课堂记录。</div>
      ${foot(2)}</div>`;
    return [p1, p2]; }
  const CSS2 = `.mr-sc{display:grid;grid-template-columns:150px 1fr;gap:10px;margin-top:10px}.mr-tot{background:#2B2253;color:#fff;border-radius:14px;padding:12px;text-align:center}.mr-tot span{display:block;font-size:9px;letter-spacing:.08em;color:#CFCBE3}.mr-tot b{display:block;font:42px 'Fredoka One','Fredoka',Rockwell,sans-serif;margin-top:4px}.mr-tot i{font-style:normal;color:#CFCBE3}
.mr-ts{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.mr-t{background:#F6F5FA;border-radius:12px;padding:9px 12px}.mr-t span{display:block;font-size:10px;color:#5C5876}.mr-t b{font-size:20px}.mr-t b i{font-size:11px;color:#8A86A0;font-style:normal}
.mr-ch{padding:6px 4px 0}.mr-d{font-size:10px;color:#7A768F}`;
  function baseCss(){ try{ return window.coeTrialCss ? coeTrialCss() : ''; }catch(x){ return ''; } }
  async function make(code, month, hint){ const r = await data(code); const F = facts(code, month, r, hint); if(!F) throw new Error('nodata');
    if((!F.zh.strengths || !F.zh.areas || !F.zh.next) && (F.strengths || F.areas || F.next)){ try{ const z = await api('mgmtZh', TOKEN, [F.strengths, F.areas, F.next], [F.student, F.cn]); if(z && z.ok && z.zh){ F.zh.strengths = F.zh.strengths || z.zh[0] || ''; F.zh.areas = F.zh.areas || z.zh[1] || ''; F.zh.next = F.zh.next || z.zh[2] || ''; } }catch(x){} }
    const [H2C, PDF] = await Promise.all([h2c(), window.coeJsPdf ? coeJsPdf() : Promise.reject(new Error('pdf'))]);
    const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;z-index:-1';
    host.innerHTML = '<style>' + baseCss() + CSS2 + '</style>' + pages(F).join(''); document.body.appendChild(host);
    try{ if(document.fonts && document.fonts.ready) await document.fonts.ready;
      const doc = new PDF({ unit: 'pt', format: 'a4' }), W = doc.internal.pageSize.getWidth(), Hh = doc.internal.pageSize.getHeight(), P = [...host.querySelectorAll('.tr-page')];
      for(let i = 0; i < P.length; i++){ const cv = await H2C(P[i], { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false }); if(i) doc.addPage(); const h = W * cv.height / cv.width, k = h > Hh ? Hh / h : 1; doc.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', (W - W * k) / 2, 0, W * k, h * k); }
      const name = 'COE_PR_' + String(F.student).replace(/[\\\/:*?"<>|]/g, '') + '_' + F.teacher + '_' + F.month + '.pdf';
      return { file: new File([doc.output('blob')], name, { type: 'application/pdf' }), F }; }
    finally{ host.remove(); } }
  window.coeMonthlyPages = (code, month, r, hint) => { const F = facts(code, month, r, hint); return F ? '<style>' + baseCss() + CSS2 + '</style>' + pages(F).join('') : null; };   /* checks and previews */
  async function fill(btn){ const x = RPD && RPD.report; if(!x) return; const b = btn && btn.tagName ? btn : null, t0 = b && b.textContent; if(b){ b.disabled = true; b.textContent = 'Making the report…'; }
    try{ const r = await make(x.code, x.month, { student: x.student, teacher: x.teacher, course: RPD.fb && RPD.fb.course }); if(!RPD || RPD.report !== x) return; RPB = r.file; RPB._app = 1;
      const el = $('rpPdf'); if(el) el.innerHTML = `<iframe class="rp-pdf" src="${URL.createObjectURL(RPB)}#view=FitH"></iframe><div class="small mute" style="margin-top:4px">Made in the app from the teacher's feedback${r.F.zh.strengths ? '' : ' · the Chinese comes when Google has translated it'}</div>`; rpBtns(); }
    catch(err){ toast(err && err.message === 'nodata' ? 'The teacher has not sent this feedback yet' : 'Could not make the report · try again'); if(b){ b.disabled = false; b.textContent = t0; } } }
  window.rpInstant = fill;
  /* Parent report sheet: no Google PDF yet, or still loading after 6 s → made in the app */
  const _rp = window.rpPaint; if(_rp) window.rpPaint = function(){ const r = _rp.apply(this, arguments); try{ const x = RPD && RPD.report; if(!x || !(D && D.mgr)) return r;
      const go = () => { if(!RPD || RPD.report !== x || RPB) return; const el = $('rpPdf'); if(el && !el.querySelector('#rpIns')) el.insertAdjacentHTML('afterbegin', '<button class="btn teal sm" id="rpIns" style="margin:10px 0 6px" onclick="rpInstant(this)">Make the report now</button>'); fill($('rpIns')); };
      setTimeout(go, x.file ? 6000 : 50); }catch(e){} return r; };
  /* "PDF being made": open it here and send it */
  window.rpAppOpen = function(i){ const m = (RP && RP.making || [])[i]; if(!m) return; RPB = null;
    RPD = { report: { key: m.key || '', code: m.code, student: m.student, teacher: m.teacher, month: RP.month, status: 'Ready', submitted: m.submitted || '', file: '' }, fb: null };
    openSheet('<h1>Parent report</h1>'); $('sheet').classList.add('wide'); rpPaint(); };
  const _rr = window.renderReports; if(_rr) window.renderReports = function(){ const r = _rr.apply(this, arguments); try{ if(RP_F === 'making') document.querySelectorAll('#v-reports .rp-row').forEach((row, i) => { row.style.cursor = 'pointer'; row.onclick = () => rpAppOpen(i); }); }catch(e){} return r; };
  const _mk = window.rpMark; if(_mk) window.rpMark = function(){ if(RPD && RPD.report && !RPD.report.key){ toast('Sent · it is listed under "To check" in a few minutes, then mark it there'); return; } return _mk.apply(this, arguments); };
})();
