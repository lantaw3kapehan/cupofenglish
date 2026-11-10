// 2044 (10 Nov 09:58, Misty: "when you're typing on the box and clicked Parent asked, the one typed will be gone"; 09:56 a white
//   floating box after cancelling): a reason chip now adds itself in front of what was typed ("Parent asked · Hello, teacher. …")
//   instead of replacing it; tapping another chip swaps only the chip part. The white box was the browser's own "earlier entries"
//   list for that field (seen under the box as "Hello, teacher. Kelly and Leo…"); the app's text fields no longer offer it, so it
//   can't stay painted on the screen after the sheet changes. Passwords and sign-in names keep the browser's help.
const file = process.argv[2];
const JS = `<script id="x2044">
/* 2044 · reason chips keep typed text · no browser autocomplete list on the app's text fields */
window.cxChip2044 = function(b, r){ try{ const el = document.getElementById('eR'); if(!el) return;
  const chips = [...b.parentNode.querySelectorAll('button')].map(x => x.textContent.trim());
  let v = String(el.value || '').trim(); const hit = chips.find(c => v === c || v.indexOf(c + ' · ') === 0);
  if(hit) v = v.slice(hit.length).replace(/^\\s*·\\s*/, '');
  el.value = v ? r + ' · ' + v : r;
  b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  try{ el.dispatchEvent(new Event('input', { bubbles: true })); }catch(e){} }catch(e){} };
document.addEventListener('focusin', ev => { try{ const t = ev.target; if(!t || !/^(INPUT|TEXTAREA)$/.test(t.tagName)) return;
  if(/^(password|email)$/i.test(t.type || '') || /user|login|pass|name="?u/i.test((t.id || '') + ' ' + (t.name || '') + ' ' + (t.getAttribute('autocomplete') || ''))) return;
  if(!t.hasAttribute('autocomplete') || t.getAttribute('autocomplete') === 'on') t.setAttribute('autocomplete', 'off'); }catch(e){} }, true);
</script>
`;
require('../tools/lib.js')(file, [
 ["`<button type=\"button\" onclick=\"$('eR').value='${r}';this.parentNode.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===this))\">${r}</button>`",
  "`<button type=\"button\" onclick=\"cxChip2044(this,'${r}')\">${r}</button>`"],
 ["<script id=\"l1651\">", JS + "<script id=\"l1651\">"]
]);
