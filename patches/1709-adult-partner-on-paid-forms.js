// 1709: (Misty, 2 Nov 11:20) "the money on those Alipay is not tallying, in my account now is 7425 ... David Zheng is adult thats 2400"
//   David's "Enrolled · paid" saved SALES Partner "CupOfEnglish" (the form's default), so the sheet priced him as a child (¥2,250)
//   instead of Adult English (¥2,400) and the Alipay wallet was ¥150 short.
//   · On "Enrolled · paid" and "Renewed · paid", when the student is an adult, Partner is set to "Adult English" for you, with a note
//     saying why (pick CupOfEnglish again if it really is a child). Adult = known age 18+, or work details saved (1706), or an adult
//     book (Daily English, Business English, Market Leader, Freetalk, DK English). A partner student's Partner is not touched.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  /* 1706 · adults: occupation and industry on the student page */\n",
   "  /* 1709 · adults: Partner = Adult English on the paid forms */\n" +
   "  try{ const SX1709 = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-stuext', ADB1709 = /^(daily ?english|business ?english|market ?leader|freetalk|dk english)/i;\n" +
   "    const up = x => String(x || '').trim().toUpperCase();\n" +
   "    const book = code => { const C = up(code); try{ if(typeof DB !== 'undefined' && DB && Array.isArray(DB.rows)){ const r = DB.rows.filter(r => up(r[0]) === C).pop(); if(r) return String(r[12] || ''); } }catch(e){} try{ if(typeof ENS !== 'undefined' && ENS && up(ENS.code) === C) return (ENS.cls || []).map(c => c.book || '').join(' '); }catch(e){} return ''; };\n" +
   "    const src = code => { const C = up(code); try{ if(typeof DB !== 'undefined' && DB && Array.isArray(DB.rows)){ const r = DB.rows.filter(r => up(r[0]) === C).pop(); if(r) return String(r[22] || ''); } }catch(e){} return ''; };\n" +
   "    const isAdult = async code => { try{ const a = window.coeAge ? coeAge(code) : null; if(a && a.age != null && a.age !== ''){ return +a.age >= 18 ? 'age ' + a.age : ''; } }catch(e){}\n" +
   "      if(ADB1709.test(book(code).trim())) return 'adult book';\n" +
   "      try{ const j = await fetch(SX1709, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: up(code) }) }).then(r => r.json()); if(j && j.ok && j.x && (j.x.occ || j.x.ind)) return 'work details saved'; }catch(e){}\n" +
   "      return ''; };\n" +
   "    const setPa = async (id, code) => { const why = await isAdult(code); if(!why) return; const s = src(code); if(s && !/^(coe|cupofenglish|wechat|n\\/a|xiaohongshu|douyin|referral|friend)/i.test(s) && !/^ST-\\d/i.test(s)) return;\n" +
   "      for(let k = 0; k < 15; k++){ const el = document.getElementById(id); if(el && (el.tagName === 'SELECT' || k > 6)){ const v = String(el.value || '').trim(); if(v && v !== 'CupOfEnglish') return;\n" +
   "          if(el.tagName === 'SELECT' && ![...el.options].some(o => o.value === 'Adult English')){ const o = document.createElement('option'); o.textContent = 'Adult English'; el.insertBefore(o, el.firstChild); }\n" +
   "          el.value = 'Adult English'; try{ el.dataset.t = 1; el.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){}\n" +
   "          if(!document.getElementById(id + 'A1709')) el.insertAdjacentHTML('afterend', '<div id=\"' + id + 'A1709\" class=\"small\" style=\"margin-top:4px;color:#9A5B00\">Adult student (' + esc(why) + ') · Partner set to <b>Adult English</b> so the price is the adult price. Pick CupOfEnglish if this is a child.</div>');\n" +
   "          return; }\n" +
   "        await new Promise(r => setTimeout(r, 200)); } };\n" +
   "    const _en1709 = window.enSheet; if(typeof _en1709 === 'function') window.enSheet = function(code){ const r = _en1709.apply(this, arguments); try{ setPa('enPa', code); }catch(e){} return r; };\n" +
   "    const _rp1709 = window.renPaidSheet; if(typeof _rp1709 === 'function') window.renPaidSheet = function(code){ const r = _rp1709.apply(this, arguments); try{ setPa('rpPa', code); }catch(e){} return r; };\n" +
   "  }catch(e){}\n" +
   "  /* 1706 · adults: occupation and industry on the student page */\n"]
]);
