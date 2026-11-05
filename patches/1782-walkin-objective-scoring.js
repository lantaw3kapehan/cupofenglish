// 1782: (Misty 5 Nov 13:43 "can the assessor be guided with scoring too to maintain objectivity?" → 13:44 "yes go ahead" for 1–4)
//   Walk-in assessment scoring, per criterion:
//   1. "What did you hear / see?" — tick the observable signs; the app shows which bands the ticks point to (the assessor still decides)
//      and warns softly when the band chosen is outside that range.
//   2. Evidence — one line per criterion ("FC 6: kept going but repeated…"); Share result asks first if a scored criterion has none.
//   3. One band up / one band down — under the band chosen, the band above and below in one line each, to confirm the choice.
//   4. Writing facts counted by the database (coe_assessments.essay_facts): words, paragraphs, sentences, average sentence length,
//      different linking words, opinion stated, both views, conclusion — shown with the essay and in Writing scoring.
//   Ticks and evidence are saved in the database with the notes (ck_*, ev_*).
const file = process.argv[2];
const CK = {
  sp: {
    fc: [['Speaks at length with little effort', 7, 9], ['Hesitates to find words or grammar', 4, 6], ['Repeats or corrects herself often', 5, 6], ['Long pauses or only short answers', 3, 4], ['Links ideas naturally (because, although, so that…)', 7, 8], ['Uses only simple linkers (and, but, so)', 5, 5], ['Loses the thread; hard to follow', 4, 5]],
    lr: [['Less common / idiomatic words used well', 7, 9], ['Natural word partners ("make a decision")', 7, 8], ['Paraphrases when stuck', 6, 8], ['Some wrong words, meaning still clear', 5, 6], ['Repeats the same words', 4, 5], ['Enough words for familiar topics only', 4, 4]],
    gra: [['Many error-free sentences', 7, 8], ['Mix of simple and complex sentences', 6, 7], ['Errors mainly in complex sentences', 6, 6], ['Mostly simple sentences', 4, 5], ['Frequent errors (tense, agreement, articles)', 4, 5], ['Errors make the meaning unclear', 3, 4]],
    p: [['Easy to understand all the time', 7, 9], ['Natural stress and intonation', 7, 8], ['Some sounds unclear, still understood', 6, 6], ['Flat or unnatural rhythm', 5, 6], ['I had to ask her to repeat', 4, 4], ['Often hard to understand', 2, 3]]
  },
  wr: {
    tr: [['Discusses both views', 6, 9], ['Clear opinion all the way through', 7, 9], ['Ideas supported with examples or reasons', 7, 8], ['Opinion unclear or only at the end', 5, 6], ['Ideas listed, not developed', 5, 6], ['Under 250 words', 4, 5], ['Off-topic or misreads the question', 3, 4]],
    cc: [['Clear paragraphs, one main idea each', 7, 8], ['Logical progression from start to end', 6, 8], ['Linking words used naturally', 7, 8], ['Linking words mechanical or overused', 5, 6], ['No clear paragraphs', 4, 5], ['Hard to follow', 3, 4]],
    lr: [['Academic / less common words used well', 7, 8], ['Natural word partners', 7, 8], ['Some spelling or word-form errors', 6, 6], ['Repetitive vocabulary', 5, 5], ['Errors make reading hard', 4, 4]],
    gra: [['Most sentences error-free', 7, 8], ['Mix of simple and complex sentences', 6, 7], ['Errors do not block meaning', 6, 6], ['Frequent errors', 5, 5], ['Punctuation often wrong', 4, 5], ['Errors dominate', 3, 4]]
  }
};
const CSS = String.raw`.as-ck{margin-top:10px;background:#FAFAFC;border:1px solid #EEEDF3;border-radius:12px;padding:10px 12px}
.as-ck .h{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#8A86A0;margin-bottom:6px}
.as-ck label{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;line-height:1.35;padding:4px 0;cursor:pointer;color:#2B2450}.as-ck input{margin-top:2px;accent-color:#00707A}
.as-ck label span.r{margin-left:auto;font-size:11.5px;color:#8A86A0;white-space:nowrap}
.as-sg{font-size:13px;font-weight:700;color:#00616A;margin-top:6px}.as-sg.warn{color:#7A4A00}
.as-ev{margin-top:8px}.as-ev input{width:100%;box-sizing:border-box;border:1px solid #D8D5E3;border-radius:10px;padding:8px 10px;font:inherit;font-size:13.5px}
.as-adj{font-size:12.5px;font-weight:400;color:#5E5A76;line-height:1.4;margin-top:4px}.as-adj b{color:#2B2253}
.as-facts{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}.as-facts span{font-size:12.5px;font-weight:600;border-radius:999px;padding:4px 10px;background:#F1F0F6;color:#4C4868}
.as-facts span.y{background:#E6F4EC;color:#1E6E4C}.as-facts span.n{background:#FFF4DE;color:#7A4A00}
`;
const HELP = String.raw`  /* 1782 · objective scoring: ticks → suggested bands, evidence line, one band up / down, writing facts */
  const CK = ` + JSON.stringify(CK) + String.raw`;
  const ckGet = (sk, k) => String((S.a.notes || {})['ck_' + sk + '_' + k] || '').split(',').filter(x => x !== '').map(Number);
  function sugTxt(sk, k){ const L = (CK[sk] || {})[k] || [], on = ckGet(sk, k).map(i => L[i]).filter(Boolean); if(!on.length) return '';
    const mid = Math.round(on.reduce((s, x) => s + (x[1] + x[2]) / 2, 0) / on.length), lo = Math.min.apply(null, on.map(x => x[1])), hi = Math.max.apply(null, on.map(x => x[2])), v = (S.a[sk] || {})[k];
    const out = v != null && (v < lo || v > hi); return '<div class="as-sg' + (out ? ' warn' : '') + '">Your ticks point to about band ' + mid + (lo !== hi ? ' (range ' + lo + '–' + hi + ')' : '') + (out ? ' · the band you chose is outside this range — check your evidence' : '') + '</div>'; }
  const ckHtml = (sk, k) => { const L = (CK[sk] || {})[k] || [], on = ckGet(sk, k); return '<div class="as-ck"><div class="h">What did you ' + (sk === 'sp' ? 'hear' : 'see') + '?</div>' + L.map((x, i) => '<label><input type="checkbox"' + (on.indexOf(i) > -1 ? ' checked' : '') + ' onchange="as1778.ck(\'' + sk + '\',\'' + k + '\',' + i + ',this.checked)"><span>' + E(x[0]) + '</span><span class="r">' + (x[1] === x[2] ? 'band ' + x[1] : 'bands ' + x[1] + '–' + x[2]) + '</span></label>').join('') +
    '<div id="as-sg-' + sk + k + '">' + sugTxt(sk, k) + '</div><div class="as-ev"><input data-f="notes.ev_' + sk + '_' + k + '" placeholder="Evidence: what she said or wrote that shows this band" value="' + E((S.a.notes || {})['ev_' + sk + '_' + k] || '') + '" oninput="as1778.put(this.dataset.f,this.value)"></div></div>'; };
  function ck(sk, k, i, on){ const s = ckGet(sk, k).filter(x => x !== i); if(on) s.push(i); s.sort((a, b) => a - b); put('notes.ck_' + sk + '_' + k, s.join(',')); const g = document.getElementById('as-sg-' + sk + k); if(g) g.innerHTML = sugTxt(sk, k); }
  const adjTxt = (sk, k, v) => { if(v == null || v === '') return ''; const D = (DESC[sk] || {})[k] || {}, up = +v + 1, dn = +v - 1;
    return '<div class="as-adj">' + (D[up] ? '<div>↑ <b>Band ' + up + '</b> would need: ' + E(D[up]) + '</div>' : '') + (dn >= 1 && D[dn] ? '<div>↓ <b>Band ' + dn + '</b> would be: ' + E(D[dn]) + '</div>' : '') + '</div>'; };
  function factsHtml(){ const f = S.a.essay_facts || {}, w = S.a.essay_words || f.words || 0; if(!w) return '';
    const yn = (b, y, n) => '<span class="' + (b ? 'y' : 'n') + '">' + (b ? y : n) + '</span>';
    return '<div class="as-facts"><span>' + w + ' words</span><span>' + (f.paras || 0) + ' paragraph' + (f.paras === 1 ? '' : 's') + '</span><span>' + (f.sents || 0) + ' sentences' + (f.sents ? ' · ' + Math.round(w / f.sents) + ' words each on average' : '') + '</span><span>' + (f.linkers || 0) + ' different linking words</span>' +
      yn(f.both, 'Both views mentioned', 'Other view not found') + yn(f.opinion, 'Opinion stated', 'No clear opinion phrase') + yn(f.concl, 'Conclusion', 'No conclusion phrase') + '</div><div class="as-m" style="margin:-4px 0 8px">Counted by the database from her essay — facts to support Task Response and Coherence, not a score.</div>'; }
  function crit(sk, C){`;
require('../tools/lib.js')(file, [
  ['.as-tabs button.on{', CSS + '.as-tabs button.on{'],
  ['  function crit(sk, C){', HELP],
  [String.raw`  const blTxt = (sk, k, v) => v == null || v === '' ? '' : 'Band ' + v + ' · ' + BN[v] + (DESC[sk] && DESC[sk][k] && DESC[sk][k][v] ? ' — <i>' + E(DESC[sk][k][v]) + '</i>' : '');`,
   String.raw`  const blTxt = (sk, k, v) => v == null || v === '' ? '' : 'Band ' + v + ' · ' + BN[v] + (DESC[sk] && DESC[sk][k] && DESC[sk][k][v] ? ' — <i>' + E(DESC[sk][k][v]) + '</i>' : '') + adjTxt(sk, k, v);   /* 1782: + one band up / down */`],
  [String.raw`+ guide(sk, k, v[k]) + '</div>').join(''); }`, String.raw`+ guide(sk, k, v[k]) + ckHtml(sk, k) + '</div>').join(''); }`],
  [String.raw`const sm = document.getElementById('as-sum'); if(sm) sm.innerHTML = sumHtml(); }`,
   String.raw`const sm = document.getElementById('as-sum'); if(sm) sm.innerHTML = sumHtml(); const g = document.getElementById('as-sg-' + sk + k); if(g) g.innerHTML = sugTxt(sk, k); }`],
  [String.raw`'essay_submitted_at', 'rkey', 'wkey', 'updated_at'].forEach(k => a[k] = n[k]);`, String.raw`'essay_submitted_at', 'rkey', 'wkey', 'updated_at', 'essay_facts'].forEach(k => a[k] = n[k]);`],
  [String.raw`(S.typeEssay ? '' : '<div class="as-ess">'`, String.raw`factsHtml() + (S.typeEssay ? '' : '<div class="as-ess">'`],
  [String.raw`<div class="as-m">Whole bands 0–9 by the IELTS Writing descriptors.`, String.raw`' + factsHtml() + '<div class="as-m">Whole bands 0–9 by the IELTS Writing descriptors.`],
  ["  async function share(){ const r = await act('share');",
   "  async function share(){ const miss = []; [['sp', ['fc', 'lr', 'gra', 'p']], ['wr', ['tr', 'cc', 'lr', 'gra']]].forEach(([sk, K]) => K.forEach(k => { if((S.a[sk] || {})[k] != null && !String((S.a.notes || {})['ev_' + sk + '_' + k] || '').trim()) miss.push(sk === 'sp' ? 'Speaking ' + k.toUpperCase() : 'Writing ' + k.toUpperCase()); }));   /* 1782 */\n" +
   "    if(miss.length && !confirm('No evidence line yet for: ' + miss.join(', ') + '.\\nShare the result anyway?')) return;\n    const r = await act('share');"],
  ['  window.as1778 = { nm, edit,', '  window.as1778 = { ck, nm, edit,'],
]);
