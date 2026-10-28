// 1365 · Books (management): the "who has agreed to the Books rule" panel no longer pushes the screen down (stability check: phone Books 0.039 on open).
//   It showed one "Loading who has agreed…" line, then grew to the full list of names (≈260 px on a phone) a moment later,
//   moving the search box and every book below it. Now it is one steady line, the same height while loading and when filled:
//   "Books rule · 9 of 15 teachers agreed · 6 not yet ›" — tap it to see the names (opened by the user, so nothing moves on its own).
//   The names, colours and dates are unchanged. It always starts closed, so a list arriving later never pushes the screen.
const file = process.argv[2];
require('../tools/lib.js')(file, [
[`    if(!AG){ el.innerHTML = '<div class="small mute">Loading who has agreed…</div>'; return; }
    const yes = AG.filter(x => x.at), no = AG.filter(x => !x.at);
    el.innerHTML = \`<div class="small" style="margin-bottom:6px"><b>Books rule</b> <span class="mute">· \${yes.length} of \${AG.length} teachers agreed (they agree the first time they open a book)</span></div><div style="display:flex;flex-wrap:wrap;gap:6px">\``,
`    const line = t => \`<summary class="small" style="list-style:none;cursor:pointer;min-height:20px;line-height:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><b>Books rule</b> <span class="mute">· \${t} ›</span></summary>\`;
    if(!AG){ if(!el.firstElementChild || el.firstElementChild.tagName !== 'DETAILS') el.innerHTML = '<details>' + line('checking who has agreed…') + '</details>'; return; }
    const yes = AG.filter(x => x.at), no = AG.filter(x => !x.at);
    const was = el.querySelector('details'), keep = !!(was && was.open);   /* a refresh keeps it as the manager left it */
    el.innerHTML = '<details' + (keep ? ' open' : '') + '>' + line(yes.length + ' of ' + AG.length + ' teachers agreed' + (no.length ? ' · ' + no.length + ' not yet' : ''))
      + \`<div class="small mute" style="margin:4px 0 6px">They agree the first time they open a book.</div><div style="display:flex;flex-wrap:wrap;gap:6px">\``],
[`      + yes.map(x => \`<span class="bk-sn" style="--sb:#E8F5E9;--sc:#2E7D32">✓ \${esc(cap(x.name))} · \${esc(when(x.at))}</span>\`).join('') + '</div>'; }`,
 `      + yes.map(x => \`<span class="bk-sn" style="--sb:#E8F5E9;--sc:#2E7D32">✓ \${esc(cap(x.name))} · \${esc(when(x.at))}</span>\`).join('') + '</div></details>'; }`],
]);
