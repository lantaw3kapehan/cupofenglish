/* 17 Oct · 263 · a save banner that stays until the result is known (Misty: "the prompt just goes off without knowing if it has been saved") */
function svPillWhen(f){ try{ const d = new Date(f.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); return d + ' ' + f.time + (f.count > 1 ? ' · ' + f.count + ' classes' : '') + (f.teacher ? ' · Teacher ' + tName(f.teacher) : ''); }catch(e){ return ''; } }
function svPill(id, html, kind){
  let box = document.getElementById('svPills'); if(!box){ box = document.createElement('div'); box.id = 'svPills'; box.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:9999;display:flex;flex-direction:column;gap:8px;width:min(520px,calc(100vw - 32px))'; document.body.appendChild(box); }
  const C = { wait: ['#2B2253', '#fff'], ok: ['#E8F7F3', '#0B6B4F'], bad: ['#FFF0EC', '#9A3B22'] }[kind] || ['#2B2253', '#fff'];
  let el = id && document.getElementById(id); if(!el){ el = document.createElement('div'); el.id = id = 'svp' + Date.now() + Math.random().toString(36).slice(2, 6); box.appendChild(el); }
  el.style.cssText = 'background:' + C[0] + ';color:' + C[1] + ';border-radius:14px;padding:12px 40px 12px 16px;box-shadow:0 8px 24px rgba(43,34,83,.18);font-size:14px;line-height:1.4;position:relative;border:1.5px solid ' + (kind === 'ok' ? '#3E8E5E' : kind === 'bad' ? '#E9B8AC' : 'transparent');
  el.innerHTML = html + '<button type="button" aria-label="Close" style="position:absolute;top:8px;right:10px;border:0;background:none;color:inherit;font-size:18px;cursor:pointer;opacity:.7">×</button>';
  el.querySelector('button').onclick = () => el.remove();
  clearTimeout(el._t); if(kind === 'ok') el._t = setTimeout(() => el.remove(), 15000);
  return id;
}
