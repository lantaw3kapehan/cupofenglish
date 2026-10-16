/* 16 Oct · 249 · Books: each student's name is a coloured label, the same colour for that student on every book and in
   "By student", so a teacher spots a student at a glance (Misty 20:42). */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
#v-books .bl-c .who{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;padding-left:4px}
#v-books .bl-c .who .k{font-size:11px;color:var(--mute);width:100%;margin-bottom:1px}
.bk-sn{display:inline-block;font-size:11.5px;line-height:1.2;padding:3px 8px;border-radius:999px;background:var(--sb);color:var(--sc);font-weight:700;white-space:nowrap}
`; document.head.appendChild(st); }catch(e){}
  const PAL = [['#E3F2FD', '#1565C0'], ['#FCE4EC', '#AD1457'], ['#E8F5E9', '#2E7D32'], ['#FFF3E0', '#B45309'], ['#EDE7F6', '#5E35B1'], ['#E0F7FA', '#00838F'],
    ['#FBE9E7', '#BF360C'], ['#F1F8E9', '#558B2F'], ['#E8EAF6', '#283593'], ['#FFFDE7', '#8D6E00'], ['#F3E5F5', '#8E24AA'], ['#E0F2F1', '#00695C']];
  const pick = n => { let h = 0; String(n || '').toLowerCase().split('').forEach(ch => h = (h * 31 + ch.charCodeAt(0)) >>> 0); return PAL[h % PAL.length]; };
  window.bkStuC = n => pick(n)[1];
  window.bkWho = who => `<div class="who"><span class="k">${who.length} student${who.length === 1 ? '' : 's'}</span>${who.slice(0, 8).map(w => { const p = pick(w); return `<span class="bk-sn" style="--sb:${p[0]};--sc:${p[1]}">${esc(w)}</span>`; }).join('')}${who.length > 8 ? `<span class="bk-sn" style="--sb:#F1F1F4;--sc:var(--ink2)">+${who.length - 8}</span>` : ''}</div>`;
})();
