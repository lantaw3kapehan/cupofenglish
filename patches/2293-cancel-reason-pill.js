// 2293 (Misty 17 Nov 10:45 "any better than bullets?"): the cancel reason reads as one line with "·" between the parent's message,
// the English and "From the parent". Now it shows as: a small coloured label (Parent asked / Teacher asked / CupOfEnglish /
// Force majeure), the message, and the English on its own line. Older reasons typed as "- From parent" get the same label.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["const cxWhy = w => { const s = cxSplit(w), k = s.r.indexOf(' · EN: '); return (k > -1 ? esc(s.r.slice(0, k)) + `<br><span class=\"small\">English: ${esc(s.r.slice(k + 7))}</span>` : esc(s.r)) + (s.by ? ` <span class=\"cxby\">${esc(s.by)}</span>` : ''); };   /* 2154 */",
  `const cxWho2293 = r => { const re = /\\s*(?:·|[-–—])\\s*(from\\s+(?:the\\s+)?(parent|student|teacher|cupofenglish|school|management)|force majeure)\\s*[.!]?\\s*$/i; let m = String(r || '').match(re), k = '';
  if(m){ const w = (m[2] || '').toLowerCase(); k = /force/i.test(m[1]) ? 'force' : (w === 'parent' || w === 'student') ? 'parent' : w === 'teacher' ? 'teacher' : 'company'; r = String(r).slice(0, m.index); }
  return { r: String(r || ''), k }; };
const cxWhy = w => { const s = cxSplit(w); let r = s.r, en = '', k = r.indexOf(' · EN: '); if(k > -1){ en = r.slice(k + 7); r = r.slice(0, k); }   /* 2154 · 2293 */
  let a = cxWho2293(r), b = cxWho2293(en); r = a.r; en = b.r; const who = a.k || b.k;
  const L = { parent: ['Parent asked', '#E8F0FB', '#2F5C9A'], teacher: ['Teacher asked', '#FCEDE7', '#A2462C'], company: ['CupOfEnglish', '#E4F3F2', '#13636B'], force: ['Force majeure', '#EEEDF3', '#5B5770'] }[who];
  return (L ? \`<span class="cxwho" style="background:\${L[1]};color:\${L[2]}">\${L[0]}</span> \` : '') + esc(r.trim()) + (en.trim() ? \`<br><span class="small">English: \${esc(en.trim())}</span>\` : '') + (s.by ? \` <span class="cxby">\${esc(s.by)}</span>\` : ''); };`],
 [".cxby{font-weight:400;font-size:11px;color:#9A8F94;margin-left:4px;white-space:nowrap}.cxby::before{content:\"by \"}",
  ".cxby{font-weight:400;font-size:11px;color:#9A8F94;margin-left:4px;white-space:nowrap}.cxby::before{content:\"by \"}.cxwho{display:inline-block;font-size:11px;font-weight:700;padding:1px 8px;border-radius:999px;margin-right:4px;text-decoration:none;white-space:nowrap;vertical-align:1px}"],
]);
