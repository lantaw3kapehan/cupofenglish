// 1714: (Misty, 2 Nov 15:00) "why ... payment confirmation takes time to reflect on our sales record and on the partner like dr spring"
//   Ruyi (Dr. Spring's student) was saved in SALES as "CupOfEnglish" (the form's default), so the sheet priced her at the public
//   price (¥4,500 instead of ¥3,300) and her payment did not show in Dr. Spring's partner page until someone fixed the cell.
//   · Enrolled · paid, Renewed · paid and Finance › Add sale now pick the partner for you when the student came through a partner
//     (DATABASE › SOURCE, e.g. "Jinan – Dr. Spring" → "Jinan - Ms. Spring", "Inner Mongolia – Ms. Jane" → "Inner Mongolia - Ms. Jane").
//     An adult (known age 18+) of a partner with an adult label gets that label (e.g. "Adults - Ms. Spring").
//   · Only when Partner still shows CupOfEnglish (or is empty); a partner you picked is never changed. A short note says why, and you
//     can pick another partner if this payment did not go through them.
//   · Add sale finds the student from the invoice name (…_Ruyi) in DATABASE; nothing is set when the name is missing, matches no
//     student, or matches students of different sources. Sources with no matching partner in the list (e.g. Zhanjiang) are left alone.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  /* 1706 · adults: occupation and industry on the student page */\n",
   "  /* 1714 · partner students: Partner picked from DATABASE › SOURCE on the paid forms and Add sale */\n" +
   "  try{ const P1714 = ['CupOfEnglish', 'Jinan - Ms. Spring', 'Jinan - Ms. Rose', 'Inner Mongolia - Ms. Jane', 'Inner Mongolia - Ms. Jane Adult', 'Chengdu - Mr. Clark', 'Panpacific University', 'IELTS', 'TOEFL', 'Adult English', 'Adult English - Ph', 'IELTS - Ms. Spring', 'Adults - Ms. Spring', 'Reading Program'];\n" +
   "    const up = x => String(x || '').trim().toUpperCase();\n" +
   "    const nz = x => String(x || '').toLowerCase().replace(/[\\u2013\\u2014]/g, '-').replace(/^\\s*partner\\s*-\\s*/, '').replace(/\\b(dr|ms|mr|mrs|miss)\\.?\\s+/g, '').replace(/\\s*-\\s*/g, ' - ').replace(/\\s+/g, ' ').trim();\n" +
   "    const labels = el => { const L = (typeof ML !== 'undefined' && ML && Array.isArray(ML.partner) && ML.partner.length) ? ML.partner.slice() : P1714.slice();\n" +
   "      try{ if(el && el.tagName === 'SELECT') [...el.options].forEach(o => { const v = o.value || o.textContent; if(v && v !== '__o' && L.indexOf(v) < 0) L.push(v); }); }catch(e){} return L; };\n" +
   "    const rowsOf = () => { try{ return (typeof DB !== 'undefined' && DB && Array.isArray(DB.rows)) ? DB.rows : []; }catch(e){ return []; } };\n" +
   "    const srcOf = code => { const C = up(code), r = rowsOf().filter(r => up(r[0]) === C).pop(); return r ? String(r[22] || '').trim() : ''; };\n" +
   "    const adultOf = code => { try{ const a = window.coeAge ? coeAge(code) : null; return !!(a && a.age != null && a.age !== '' && +a.age >= 18); }catch(e){ return false; } };\n" +
   "    const pick = (s, adult, el) => { const n = nz(s); if(!n || !/ - /.test(n) || /^(coe|cupofenglish)\\b/.test(n) || /^st-\\d/.test(n)) return '';\n" +
   "      const L = labels(el), base = L.filter(x => nz(x) === n); if(base.length !== 1) return '';\n" +
   "      if(adult){ const who = n.split(' - ').pop(), ad = L.filter(x => /adult/i.test(x) && nz(x).indexOf(who) > -1 && nz(x).indexOf(n.split(' - ')[0]) > -1 || (/^adults - /i.test(x) && nz(x) === 'adults - ' + who)); if(ad.length === 1) return ad[0]; }\n" +
   "      return base[0]; };\n" +
   "    const note = (el, id, s, v) => { const old = document.getElementById(id); if(old) old.remove(); el.insertAdjacentHTML('afterend', '<div id=\"' + id + '\" class=\"small\" style=\"margin-top:4px;color:#9A5B00\">Partner student (source: ' + esc(s) + ') · Partner set to <b>' + esc(v) + '</b> so the partner price is used. Pick another partner if this payment did not go through them.</div>'); };\n" +
   "    const setOn = (el, v) => { if(el.tagName === 'SELECT' && ![...el.options].some(o => (o.value || o.textContent) === v)){ const o = document.createElement('option'); o.textContent = v; el.insertBefore(o, el.firstChild); }\n" +
   "      el.value = v; try{ el.dataset.t = 1; el.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){} };\n" +
   "    const free = el => { const v = String(el.value || '').trim(); return !v || v === 'CupOfEnglish' || el.dataset.auto1714 === v; };\n" +
   "    const setPa = async (id, code) => { for(let k = 0; k < 20; k++){ const el = document.getElementById(id); if(el && (el.tagName === 'SELECT' || k > 8)){\n" +
   "          const s = srcOf(code), v = pick(s, adultOf(code), el); if(!v || !free(el)) return; setOn(el, v); el.dataset.auto1714 = v; note(el, id + 'N1714', s, v); return; }\n" +
   "        await new Promise(r => setTimeout(r, 200)); } };\n" +
   "    const _en1714 = window.enSheet; if(typeof _en1714 === 'function') window.enSheet = function(code){ const r = _en1714.apply(this, arguments); try{ setPa('enPa', code); }catch(e){} return r; };\n" +
   "    const _rp1714 = window.renPaidSheet; if(typeof _rp1714 === 'function') window.renPaidSheet = function(code){ const r = _rp1714.apply(this, arguments); try{ setPa('rpPa', code); }catch(e){} return r; };\n" +
   "    /* Add sale: student from the invoice name (PaymentConfirmation1756_Ruyi.pdf → Ruyi) */\n" +
   "    let t1714 = 0; const saleGuess = async () => { const fi = document.getElementById('fI'), fr = document.getElementById('fR'); if(!fi || !fr) return;\n" +
   "      const inv = String(fi.value || '').replace(/\\.(pdf|png|jpe?g)$/i, '').trim(), nm = inv.indexOf('_') > -1 ? inv.replace(/^.*_/, '').trim() : '';\n" +
   "      const clear = () => { if(fr.dataset.auto1714 && fr.value === fr.dataset.auto1714){ setOn(fr, 'CupOfEnglish'); delete fr.dataset.auto1714; } const o = document.getElementById('fRN1714'); if(o) o.remove(); };\n" +
   "      if(!nm || /[&,+\\u3001\\u548c]/.test(nm)){ clear(); return; }\n" +
   "      if(!rowsOf().length){ try{ if(typeof loadDb === 'function') await loadDb(true); }catch(e){} }\n" +
   "      const k = nm.toLowerCase().replace(/[\\s.]+/g, ''), hit = rowsOf().filter(r => /^ST-\\d{4}-\\d{3}$/i.test(String(r[0] || '').trim()) && [r[2], r[1]].some(x => String(x || '').toLowerCase().replace(/[\\s.]+/g, '') === k));\n" +
   "      const S = [...new Set(hit.map(r => String(r[22] || '').trim()))]; if(!hit.length || S.length !== 1){ clear(); return; }\n" +
   "      const ad = hit.every(r => adultOf(r[0])), v = pick(S[0], ad, fr); if(!v){ clear(); return; } if(!free(fr)) return;\n" +
   "      setOn(fr, v); fr.dataset.auto1714 = v; note(fr, 'fRN1714', S[0] + (hit.length === 1 ? ' · ' + String(hit[0][0]).trim() : ''), v); };\n" +
   "    const later = () => { clearTimeout(t1714); t1714 = setTimeout(() => { saleGuess().catch(() => {}); }, 350); };\n" +
   "    document.addEventListener('input', ev => { if(ev.target && ev.target.id === 'fI') later(); }, true);\n" +
   "    document.addEventListener('change', ev => { if(ev.target && (ev.target.id === 'fFile' || ev.target.id === 'fI')) setTimeout(later, 400); if(ev.target && ev.target.id === 'fR' && ev.isTrusted){ delete ev.target.dataset.auto1714; const o = document.getElementById('fRN1714'); if(o) o.remove(); } }, true);\n" +
   "    document.addEventListener('drop', ev => { if(ev.target && ev.target.closest && ev.target.closest('#fDrop')) setTimeout(later, 600); }, true);\n" +
   "  }catch(e){}\n" +
   "  /* 1706 · adults: occupation and industry on the student page */\n"]
]);
