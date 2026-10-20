/* 20 Oct · 360 · Trial report made in the app, ready at once (Misty: "we wait 30 minutes for the pdf generation and the student also needs to see it real time").
   The parent's two-page report is drawn here from the teacher's answers the moment she sends them (or from TR-DATA once Google has copied them):
   page 1 · student, CEFR level and stage, skill profile, teacher's observations and recommendations (English + Chinese)
   page 2 · learning roadmap, starting point, how progress works, lesson plans (★ suggested), skill breakdown with what the level looks like, next CEFR goal.
   The content comes from the same tables the sheet uses (TR-CEFR can-do lines, TR-PATH roadmaps by learner type) through coe-mgmt op trialData.
   The Chinese of the teacher's own comments: TR-DATA's when Google has made it, otherwise Google's translator for a few seconds (mgmtZh);
   if that is not installed yet, the English is shown and the Chinese headings stay.
   It becomes the report file for every existing button (Copy picture, Send on WeChat, Save PDF): when Google's PDF is not there yet, the app's PDF is used. */
(function(){
  const LV = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const CRIT = [['S1', 'Fluency and Coherence', '流利度与连贯性'], ['S2', 'Pronunciation', '发音'], ['S3', 'Grammatical Accuracy and Range', '语法准确性与丰富度'], ['S4', 'Vocabulary Range and Appropriacy', '词汇丰富度与得体性'], ['S5', 'Interaction and Communication', '互动交流'],
    ['L1', 'Comprehension', '听力理解'], ['L2', 'Response to Spoken Prompts', '听后应答'], ['R1', 'Comprehension', '阅读理解'], ['R2', 'Discussing and Responding to Texts', '阅读讨论与回应']];
  const SEC = [['Speaking', '口语', 0, 5, 20], ['Listening', '听力', 5, 7, 8], ['Reading', '阅读', 7, 9, 8]];
  const rub = t => t <= 10 ? 'Pre-A1' : t <= 15 ? 'A1' : t <= 20 ? 'A2' : t <= 25 ? 'B1' : t <= 30 ? 'B2' : t <= 35 ? 'C1' : 'C2';
  const band = (sum, n) => { const a = sum / n; return a < 1.75 ? ['Emerging', '起步'] : a < 2.5 ? ['Developing', '发展中'] : a < 3.25 ? ['Good', '良好'] : ['Strong', '优秀']; };
  const STAGE = { 'Pre-A1': 'Pre-A1', A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B2', C1: 'C1', C2: 'C2' };
  const e = s => esc(String(s == null ? '' : s));
  const nl = s => e(s).replace(/\n/g, '<br>');
  const TB = {};   /* the two tables, kept for the session */
  let JSP = null;
  function jspdf(){ if(window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF); if(JSP) return JSP;
    JSP = new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload = () => ok(window.jspdf.jsPDF); s.onerror = () => { JSP = null; no(new Error('load')); }; document.head.appendChild(s); }); return JSP; }
  async function data(t){ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'trialData', token: TOKEN, date: t.date, student: t.student, tables: !TB.cefr }) }).then(x => x.json());
    if(!r || !r.ok) throw new Error('data'); if(r.cefr) TB.cefr = r.cefr; if(r.path) TB.path = r.path; return r; }
  const hm = v => { const m = String(v || '').match(/T(\d{2}):(\d{2})/) || String(v || '').match(/^(\d{1,2}):(\d{2})/); return m ? m[1].padStart(2, '0') + ':' + m[2] : ''; };
  /* the report's facts, from TR-DATA (Google's copy) or the teacher's submission */
  function facts(t, r){ const d = r.tr && r.tr.data, f = (r.sub && r.sub.f) || {}, c = (r.sub && r.sub.c) || {};
    let pts, comm, next, commZh = '', nextZh = '', cefr, group = '', teacher = t.teacher || (r.sub && r.sub.who) || '';
    if(d){ pts = d.slice(6, 15).map(Number); comm = d[25]; next = d[26]; commZh = d[27] || ''; nextZh = d[28] || ''; cefr = d[22] || d[23] || d[20] || d[21]; group = d[32] || ''; teacher = d[4] || teacher; }
    else if(f.picks){ pts = f.picks.map(p => 4 - Number(p)); comm = (f.texts || [])[0]; next = (f.texts || [])[1]; cefr = f.cefr; }
    else return null;
    if(pts.length !== 9 || pts.some(x => !(x >= 1 && x <= 4))) return null;
    const total = pts.reduce((a, b) => a + b, 0); if(LV.indexOf(cefr) < 0) cefr = rub(total);
    group = r.pick || group || t.group || '';
    if(!group){ try{ const a = window.coeAge && t.code ? coeAge(t.code) : null; if(a && a.age != null) group = a.age <= 10 ? 'Young learner (≤10)' : a.age <= 17 ? 'Teen (11–17)' : 'Adult (18+)'; }catch(x){} }
    return { student: t.student, cn: t.cn || (d && d[34]) || '', code: t.code || (d && d[33]) || c.code || '', date: t.date, time: t.time || hm(d && d[3]) || c.time || '', teacher, pts, total, cefr, comm: String(comm || '').trim(), next: String(next || '').trim(), commZh, nextZh, group, label: d ? d[0] : '' }; }
  const prefix = g => /business/i.test(g) ? 'AdultB|' : /work/i.test(g) ? 'AdultW|' : /adult/i.test(g) ? 'Adult|' : /teen/i.test(g) ? 'Teen|' : '';
  function path(lv, g){ const P = TB.path || [], k = prefix(g) + lv; return P.find(x => x[0] === k) || P.find(x => x[0] === lv) || null; }
  function can(k, lv){ const r = (TB.cefr || []).find(x => x[0] === k + '|' + lv); return r ? [r[3], r[4]] : ['', '']; }
  function pages(F){
    const lv = F.cefr, p = path(lv, F.group) || [], nx = LV[LV.indexOf(lv) + 1];
    const now = new Date(Date.now() + 8 * 3600e3), gen = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) + ' · ' + now.toISOString().slice(11, 16) + 'H';
    const genZh = now.getUTCFullYear() + '年' + (now.getUTCMonth() + 1) + '月' + now.getUTCDate() + '日 ' + now.toISOString().slice(11, 16) + 'H';
    const dt = new Date(F.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    const sec = SEC.map(s => { const sum = F.pts.slice(s[2], s[3]).reduce((a, b) => a + b, 0); return { en: s[0], zh: s[1], sum, max: s[4], b: band(sum, s[3] - s[2]) }; });
    const spk = rub(sec[0].sum * 36 / 20);
    const dots = n => '●'.repeat(n) + '○'.repeat(4 - n);
    const plan = Number(p[17]) || 2;
    const plans = [['15 lessons', '15节课', 'Starter plan', '起步方案'], ['30 + 3 lessons', '30节 + 赠送3节', 'Core plan', '核心方案'], ['60 + 8 lessons', '60节 + 赠送8节', 'Complete plan', '完整方案']];
    const lc = s => s ? s[0].toLowerCase() + s.slice(1) : s;
    const goal = nx ? [can('S1', nx)[0] + '; ' + lc(can('R1', nx)[0]) + '.', can('S1', nx)[1] + '；' + can('R1', nx)[1] + '。'] : null;
    const H = (en, zh) => `<div class="tr-h"><b>${e(en)}</b><span>${e(zh)}</span></div>`;
    const head = `<div class="tr-top"><div class="tr-logo"><b>CupOfEnglish</b><span>一杯英语</span></div><div class="tr-title"><b>TRIAL CLASS ASSESSMENT</b><span>试听课评估报告</span></div></div>
      <div class="tr-sub">Report generated ${e(gen)} · 报告生成：${e(genZh)}<br>Aligned with the Common European Framework of Reference for Languages (CEFR) · 依据《欧洲语言共同参考框架》（CEFR）进行评估与定级</div>`;
    const foot = n => `<div class="tr-foot"><span>CupOfEnglish · 一杯英语 · LEARN WITH THE BEST</span><span>${e(F.student)} · ${e(F.code)} · ${n} / 2</span></div>`;
    const p1 = `<div class="tr-page">${head}
      <div class="tr-info"><div><span>STUDENT 学生</span><b>${e(F.student)}${F.cn ? ' <i>' + e(F.cn) + '</i>' : ''}</b></div><div><span>TRIAL DATE 试听日期</span><b>${e(dt)}</b></div><div><span>TIME 时间</span><b>${e(F.time ? F.time + 'H' : '—')}</b></div><div><span>TEACHER 教师</span><b>${e(F.teacher)}</b></div></div>
      <div class="tr-cefr"><div class="tr-lv"><span>CEFR LEVEL CEFR级别</span><b>${e(lv)}</b></div><div class="tr-st"><span>STAGE 阶段</span><b>${e(p[1] || '')} <i>${e(p[2] || '')}</i></b><span style="margin-top:8px">CAMBRIDGE ENGLISH ≈ 对应剑桥英语</span><b>${e(p[13] || '—')}</b></div><div class="tr-mean">${nl(p[3] || '')}<br><i>${nl(p[4] || '')}</i></div></div>
      ${H('SKILL PROFILE', '能力概览')}
      <table class="tr-tb"><tr><th>SKILL 技能</th><th>SCORE 得分</th><th>RATING 等级</th><th>PROFILE 能力图示</th></tr>${sec.map(s => `<tr><td><b>${s.en}</b> ${s.zh}</td><td><b>${s.sum} / ${s.max}</b></td><td>${s.b[0]} ${s.b[1]}</td><td><div class="tr-bar"><i style="width:${Math.round(100 * s.sum / s.max)}%"></i></div></td></tr>`).join('')}</table>
      <div class="tr-note">Trial score ${F.total} / 36 · Speaking on its own ≈ ${spk} · Writing is assessed through post-class homework once regular lessons begin.<br>试听总分 ${F.total} / 36 · 口语单项 ≈ ${spk} · 写作能力将在正式课程开始后，通过课后作业进行评估。</div>
      ${H('TEACHER’S OBSERVATIONS', '教师评语')}<div class="tr-tx">${nl(F.comm)}</div>${F.commZh ? `<div class="tr-tx zh">${nl(F.commZh)}</div>` : ''}
      ${H('TEACHER’S RECOMMENDATIONS', '教师建议')}<div class="tr-tx">${nl(F.next)}</div>${F.nextZh ? `<div class="tr-tx zh">${nl(F.nextZh)}</div>` : ''}
      ${H('YOUR LEARNING ROADMAP', '学习路线图')}<div class="tr-road">${e(p[7] || '').replace(/◆\s*([^→]+)/, '<b class="tr-here">◆ $1</b>')}<br><i>${e(p[8] || '')}</i></div>
      <div class="tr-two"><div>${H('STARTING POINT', '起点')}<div class="tr-tx">${e(p[5] || '')}<br><i>${e(p[6] || '')}</i></div></div><div>${H('HOW PROGRESS WORKS', '进阶方式')}<div class="tr-tx">${e(p[9] || '')}<br><i>${e(p[10] || '')}</i></div></div></div>
      ${H('LESSON PLANS — YOUR CHOICE', '课程方案（自由选择）')}<div class="tr-sub" style="margin:-2px 2px 8px">Each lesson 50 min, or two 25-min lessons · 每节50分钟，也可拆分为两节25分钟</div>
      <div class="tr-plans">${plans.map((x, i) => `<div class="${i + 1 === plan ? 'on' : ''}">${i + 1 === plan ? '<em>★ SUGGESTED 推荐</em>' : ''}<b>${x[0]}</b><span>${x[1]}</span><i>${x[2]} · ${x[3]}</i></div>`).join('')}</div>
      <div class="tr-note">${e(p[18] || '')}<br>${e(p[19] || '')}<br>Every learner moves up when ready — sometimes in the middle of a book. Your teacher reviews progress with you along the way. 学员达到要求即可升级，有时一本教材学到一半便可进阶。学习过程中，老师会定期与您沟通学习进展。</div>
      ${foot(1)}</div>`;
    const p2 = `<div class="tr-page">${head}
      ${H('SKILL BREAKDOWN', '分项能力评估 · ●○○○ 1 … ●●●● 4')}
      <table class="tr-tb sm"><tr><th>CRITERION 评估维度</th><th>RATING 评分</th><th>WHAT ${e(lv)} LOOKS LIKE (CEFR) · ${e(lv)}级别能力表现</th></tr>${SEC.map((s, si) => `<tr class="tr-sec"><td colspan="3"><b>${s[0]} ${s[1]}</b> · ${sec[si].sum} / ${s[4]} · ${sec[si].b[0]} ${sec[si].b[1]}</td></tr>` +
        CRIT.slice(s[2], s[3]).map((c, j) => { const k = s[2] + j, cd = can(c[0], lv); return `<tr><td>${c[1]}<br><i>${c[2]}</i></td><td class="tr-dots">${dots(F.pts[k])}</td><td>${e(cd[0])}<br><i>${e(cd[1])}</i></td></tr>`; }).join('')).join('')}</table>
      ${goal ? `<div class="tr-goal"><b>NEXT CEFR GOAL → ${e(nx)}:</b> ${e(goal[0])}<br><i>下一阶段CEFR目标 → ${e(nx)}：${e(goal[1])}</i></div>` : ''}
      <div class="tr-about">About this assessment — Your teacher rated nine CEFR-based skills (1–4) in a 1:1 online trial. The level follows the Council of Europe’s CEFR and its 2020 Companion Volume, and is confirmed in the first lessons. It reflects English ability, not age or school grade. Cambridge English equivalents are indicative.<br>关于本评估——老师在一对一线上试听课中，依据CEFR对九项能力进行评分（1–4分）。级别参照欧洲委员会CEFR标准及其2020年增补版，并将在最初几节正式课中进一步确认。级别反映英语能力，与年龄和年级无关。剑桥英语对应仅供参考。</div>
      ${foot(2)}</div>`;
    return [p1, p2]; }
  const CSS = `.tr-page{width:794px;min-height:1123px;padding-bottom:46px!important;box-sizing:border-box;padding:34px 40px 30px;background:#fff;color:#2B2253;font:12px/1.45 Rockwell,'Roboto Slab',Georgia,serif;position:relative;overflow:hidden}
.tr-page i{font-style:normal;color:#5C5876}
.tr-top{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#2BB3AA,#1F8F96);color:#fff;border-radius:16px;padding:16px 22px}
.tr-logo b{display:block;font:22px 'Fredoka One','Fredoka',Rockwell,sans-serif}.tr-logo span{font-size:12px;letter-spacing:.3em}
.tr-title{text-align:right}.tr-title b{display:block;font:20px 'Fredoka One','Fredoka',Rockwell,sans-serif;letter-spacing:.04em}.tr-title span{font-size:13px}
.tr-sub{font-size:10px;color:#7A768F;margin:8px 4px 12px}
.tr-info{display:grid;grid-template-columns:1.6fr 1fr .8fr 1fr;gap:8px}.tr-info div{background:#F6F5FA;border-radius:10px;padding:8px 12px}.tr-info span,.tr-cefr span{display:block;font-size:9px;letter-spacing:.08em;color:#8A86A0}.tr-info b{font-size:14px}
.tr-cefr{display:grid;grid-template-columns:110px 1fr 1.6fr;gap:10px;margin-top:10px;align-items:stretch}.tr-cefr>div{border:1px solid #E3F4F2;border-radius:12px;padding:10px 12px}
.tr-lv{background:#2B2253;color:#fff;text-align:center}.tr-lv span{color:#CFCBE3!important}.tr-lv b{display:block;font:38px 'Fredoka One','Fredoka',Rockwell,sans-serif;margin-top:4px}
.tr-st b{display:block;font-size:15px}.tr-mean{font-size:12px;background:#F2FAF9}
.tr-h{display:flex;align-items:baseline;gap:10px;margin:14px 0 6px;border-bottom:2px solid #2BB3AA;padding-bottom:3px}.tr-h b{font-size:12.5px;letter-spacing:.08em;color:#00737B}.tr-h span{font-size:11.5px;color:#5C5876}
.tr-tb{width:100%;border-collapse:collapse;font-size:11.5px}.tr-tb td,.tr-tb th{text-align:left}.tr-tb th{font-size:9.5px;letter-spacing:.06em;color:#8A86A0;font-weight:400;padding:3px 6px;border-bottom:1px solid #ECEAF3}.tr-tb td{padding:5px 6px;border-bottom:1px solid #F2F1F6;vertical-align:top}
.tr-tb.sm td{font-size:10.5px;padding:4px 6px}.tr-sec td{background:#F6F5FA;color:#2B2253}.tr-dots{color:#1F8F96;font-size:13px;letter-spacing:1px;white-space:nowrap}
.tr-bar{height:9px;border-radius:9px;background:#ECEAF3;overflow:hidden;margin-top:4px}.tr-bar i{display:block;height:100%;background:linear-gradient(90deg,#2BB3AA,#52B7AC)}
.tr-note{font-size:10.5px;color:#5C5876;background:#FBFAF6;border-radius:10px;padding:7px 10px;margin-top:6px}
.tr-tx{font-size:11.5px;margin:2px 2px 4px}.tr-tx.zh{color:#5C5876;margin-top:4px}
.tr-road{font-size:12px;background:#F2FAF9;border-radius:12px;padding:10px 12px}.tr-here{color:#B4472E}
.tr-two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.tr-plans{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.tr-plans div{border:1px solid #ECEAF3;border-radius:12px;padding:10px 12px;position:relative}.tr-plans div.on{border:2px solid #2BB3AA;background:#F2FAF9}
.tr-plans b{display:block;font-size:15px}.tr-plans span{display:block;font-size:11px;color:#5C5876}.tr-plans i{display:block;font-size:10.5px;margin-top:3px}.tr-plans em{position:absolute;top:-9px;right:10px;background:#B4472E;color:#fff;font-style:normal;font-size:9px;border-radius:8px;padding:1px 7px}
.tr-goal{margin-top:8px;font-size:11px;background:#FDF3EF;border-radius:10px;padding:7px 10px}.tr-about{margin-top:8px;font-size:9.5px;color:#7A768F}
.tr-foot{position:absolute;left:40px;right:40px;bottom:16px;display:flex;justify-content:space-between;font-size:9px;color:#A9A6B8;border-top:1px solid #F2F1F6;padding-top:5px}`;
  async function make(t){ const r = await data(t); const F = facts(t, r); if(!F) throw new Error('nodata');
    if((!F.commZh || !F.nextZh) && F.comm){ try{ const z = await api('mgmtZh', TOKEN, [F.comm, F.next], [F.student, F.cn]); if(z && z.ok && z.zh){ F.commZh = F.commZh || z.zh[0] || ''; F.nextZh = F.nextZh || z.zh[1] || ''; } }catch(x){} }
    const [H2C, PDF] = await Promise.all([h2c(), jspdf()]);
    const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;z-index:-1';
    host.innerHTML = '<style>' + CSS + '</style>' + pages(F).join(''); document.body.appendChild(host);
    try{ if(document.fonts && document.fonts.ready) await document.fonts.ready;
      const doc = new PDF({ unit: 'pt', format: 'a4' }), W = doc.internal.pageSize.getWidth(), Hh = doc.internal.pageSize.getHeight();
      const P = [...host.querySelectorAll('.tr-page')];
      for(let i = 0; i < P.length; i++){ const cv = await H2C(P[i], { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false }); if(i) doc.addPage(); const h = W * cv.height / cv.width, k = h > Hh ? Hh / h : 1; doc.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', (W - W * k) / 2, 0, W * k, h * k); }   /* a longer page is fitted onto the A4 sheet */
      const name = 'COE_TCR_' + String(F.student).replace(/[\\\/:*?"<>|]/g, '') + '_' + F.teacher + '_' + F.date + '.pdf';
      return { file: new File([doc.output('blob')], name, { type: 'application/pdf' }), F }; }
    finally{ host.remove(); } }
  window.tlInstant = async function(btn){ const t = (typeof TLD !== 'undefined') ? TLD : null; if(!t) return; const b = btn && btn.tagName ? btn : null, t0 = b && b.textContent; if(b){ b.disabled = true; b.textContent = 'Making the report…'; }
    try{ const r = await make(t); if(TLD !== t) return; TLB = r.file; TLB._app = 1; const el = $('tlPdf'); if(el) el.innerHTML = `<iframe class="rp-pdf" src="${URL.createObjectURL(TLB)}#view=FitH"></iframe><div class="small mute" style="margin-top:4px">Made in the app${r.F.commZh ? '' : ' · Chinese of the comments not added yet'} · the same report the sheet makes</div>`; try{ tlBtns(); }catch(x){} toast('Report ready · Copy picture or Send'); }
    catch(e){ toast(e && e.message === 'nodata' ? 'The teacher has not sent the report yet' : 'Could not make the report · try again'); if(b){ b.disabled = false; b.textContent = t0; } } };
  /* Trial sheet: when Google's PDF is not there (or still loading after 6 s), make the report in the app by itself */
  const _tp = window.tlPaint; if(_tp) window.tlPaint = function(){ const r = _tp.apply(this, arguments); try{ const t = TLD; if(!t || !(D && D.mgr)) return r;
      const go = () => { if(TLD !== t || TLB) return; const el = $('tlPdf'); if(el && !el.querySelector('#tlIns')) el.insertAdjacentHTML('afterbegin', '<button class="btn teal sm" id="tlIns" style="margin:10px 0 6px" onclick="tlInstant(this)">Make the report now</button>'); tlInstant($('tlIns')); };
      if(!t.pdf) setTimeout(go, 50); else setTimeout(go, 6000); }catch(e){} return r; };
  window.coeTrialPages = (t, r) => { if(r.cefr) TB.cefr = r.cefr; if(r.path) TB.path = r.path; const F = facts(t, r); return F ? '<style>' + CSS + '</style>' + pages(F).join('') : null; };   /* checks and previews */
})();
