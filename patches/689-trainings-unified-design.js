// 689: (Misty) Trainings redesign, in the app's own look (same fonts, colours, buttons, cards as the other screens).
// Teacher: dark "what's next" card (units ring, next training, one button); "My path" as a ladder — one row per rank, trainings as
// pills (✓ done, ▶ next, dashed = not recorded yet, lock = later), bottom = first week, top = Master; side: What I can teach, Self-study.
// Management: four counters (Coming up, Needs you, Blocked, Self-study — tap for the list); lighter table: thin coloured rank lines,
// short column names, small dots, rank chip and "done x/y" per teacher; "Videos & quizzes" replaces "Trainings list".
const fs = require('fs'), path = require('path'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const cut = (A, Z, NEW) => { const i = s.indexOf(A), j = s.indexOf(Z, i); if (i < 0 || j < 0 || s.indexOf(A, i + 1) > -1) { console.error('not found: ' + A.slice(0, 60)); process.exit(1); } s = s.slice(0, i) + NEW + s.slice(j); };
cut("  function paintMy(){ const v = $('v-train'); if(!v || !MY) return;", "  function partRow(", fs.readFileSync(path.join(__dirname, '689-my.part.txt'), 'utf8'));
cut("  function paintAll(){ const v = $('v-train'); if(!v || !AL) return;", "    if(v._h !== h){ v.innerHTML = h; v._h = h; } }\n  window.paintTrAll", fs.readFileSync(path.join(__dirname, '689-all.part.txt'), 'utf8'));
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("+ pathHtml(TV, name, { ix: Math.max(0, x.ix), rank: x.rank, life: x.life, next: x.next }) +", "+ ladderHtml(TV, name, { ix: Math.max(0, x.ix), rank: x.rank, life: x.life, next: x.next }) +");
rep("  window.paintTrAll = () => paintAll();", "  window.paintTrAll = () => paintAll();\n  window.trListOpen = k => { const L = (window._trLists || {})[k]; if(!L) return; openSheet('<h1>' + L[0] + '</h1><div style=\"margin-top:10px\">' + (L[1].join('') || '<div class=\"small mute\" style=\"padding:10px 0\">Nothing here now.</div>') + '</div>' + (L[2] ? '<div style=\"margin-top:14px\">' + L[2] + '</div>' : '')); };");
rep("openSheet('<h1>Trainings list</h1>", "openSheet('<h1>Videos &amp; quizzes</h1>");
const st = ".tr-chips{";
rep(st, `.tx{max-width:1180px}.tx .lead{align-items:center;gap:8px;flex-wrap:wrap}
.tx-card{background:var(--card,#fff);border:1px solid var(--line);border-radius:20px;padding:18px 20px}.tx-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}.tx-h b{font-family:"Fredoka One",Fredoka,sans-serif;font-weight:400;font-size:18px;color:var(--ink)}.tx-h span{font-size:12.5px;color:#77738C}
.tx-hero{display:flex;gap:22px;align-items:center;background:#2B2253;color:#fff;border-radius:22px;padding:20px 24px;margin:14px 0;flex-wrap:wrap}
.tx-hero .k{font-size:11px;letter-spacing:.08em;opacity:.7}.tx-hero .t{font-family:"Fredoka One",Fredoka,sans-serif;font-size:22px;line-height:1.25;margin:2px 0}.tx-hero .s{font-size:13px;opacity:.82}.tx-hero .grow{min-width:220px}
.tx-ring{--p:0%;width:82px;height:82px;border-radius:50%;background:conic-gradient(#3CC8C0 var(--p),rgba(255,255,255,.15) 0);display:grid;place-items:center;flex:none}.tx-ring>div{width:66px;height:66px;border-radius:50%;background:#2B2253;display:grid;place-items:center;align-content:center;line-height:1.05;text-align:center}.tx-ring b{font-size:17px}.tx-ring span{font-size:9.5px;opacity:.7;display:block}
.tx-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}@media(min-width:980px){.tx-grid{grid-template-columns:minmax(0,1fr) 330px;align-items:start}}.tx-grid aside{display:flex;flex-direction:column;gap:16px}
.tx-lad{display:flex;flex-direction:column}.tx-rung{display:flex;gap:14px;align-items:stretch}.tx-rl{width:120px;flex:none;text-align:right;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#9A97AE;padding-top:9px}.tx-rl small{display:block;text-transform:none;letter-spacing:0;font-weight:400;font-size:11px}
.tx-rung.ok .tx-rl{color:#00737B}.tx-rung.nx .tx-rl{color:#B4532F}.tx-bar{width:3px;border-radius:3px;flex:none}.tx-pills{flex:1;display:flex;flex-wrap:wrap;gap:8px;padding:5px 0 14px;min-width:0}
.tx-pill{display:inline-flex;gap:6px;align-items:center;font:inherit;font-size:13px;border-radius:12px;padding:8px 12px;border:1.5px solid transparent;cursor:pointer;text-align:left}.tx-pill small{font-size:11px;color:#9A97AE;font-weight:400}
.tx-pill.done{background:#EEF8F7;color:#00626A;font-weight:700}.tx-pill.next{background:#FBEDE8;color:#8A3B22;border-color:#F0C9BD;font-weight:700}.tx-pill.open{background:#fff;color:var(--ink2);border:1.5px dashed #CFE9E7}.tx-pill.lock{background:var(--soft);color:#9A97AE}
@media(max-width:620px){.tx-rl{width:78px;font-size:10px}.tx-hero{padding:16px}.tx-hero .t{font-size:19px}}
.tx-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tx-tiles button{font:inherit;font-size:12.5px;text-align:left;border:0;border-radius:12px;padding:10px;background:var(--soft);color:#77738C;cursor:pointer}.tx-tiles button.ok{background:#EEF8F7;color:#00626A;font-weight:700}
.tx-cnts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}@media(max-width:760px){.tx-cnts{grid-template-columns:repeat(2,minmax(0,1fr))}}
.tx-cnt{font:inherit;text-align:left;background:var(--card,#fff);border:1px solid var(--line);border-radius:18px;padding:14px 16px;cursor:pointer;color:var(--ink)}.tx-cnt span{display:block;font-size:12.5px;color:var(--ink2)}.tx-cnt b{display:block;font-family:"Fredoka One",Fredoka,sans-serif;font-weight:400;font-size:28px;line-height:1.2}.tx-cnt small{font-size:11.5px;color:#77738C}
.tx-cnt.warn{background:#FBEDE8;border-color:#F0C9BD;color:#8A3B22}.tx-cnt.warn span,.tx-cnt.warn small{color:#8A3B22}
.tx-seg{display:inline-flex;background:var(--soft);border-radius:99px;padding:4px}.tx-seg button{font:inherit;font-size:13px;font-weight:700;border:0;background:none;color:var(--ink2);border-radius:99px;padding:7px 14px;cursor:pointer}.tx-seg button.on{background:var(--ink);color:#fff}
.tx-tb{overflow:auto;max-height:70vh}.tx-tb table{border-collapse:separate;border-spacing:0;width:100%;font-size:13px}
.tx-tb thead th{position:sticky;background:var(--card,#fff);z-index:2;font-weight:700}.tx-tb tr.g th{top:0;height:26px;padding:0 3px;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:#77738C}.tx-tb tr.g th span{display:block;border-bottom:3px solid;padding-bottom:3px}
.tx-tb tr.t th{top:26px;padding:8px 3px;font-size:11.5px;border-bottom:1px solid var(--line)}.tx-tb tr.t th button{font:inherit;background:none;border:0;color:var(--ink);cursor:pointer;padding:3px 4px;border-radius:8px;white-space:nowrap}.tx-tb tr.t th button:hover{background:var(--soft);text-decoration:underline}
.tx-tb .st{position:sticky;left:0;z-index:1;background:var(--card,#fff);text-align:left;padding:9px 10px;white-space:nowrap}.tx-tb thead .st{z-index:3}.tx-tb td{border-bottom:1px solid #F3F2F7;text-align:center;padding:8px 3px;cursor:pointer}.tx-tb td.st{cursor:default}.tx-tb tbody tr:hover td{background:#FAFAFC}
.tx-tb .dn{text-align:right;padding-right:10px;color:var(--ink2);font-size:12px;white-space:nowrap;cursor:default}.tx-tb tr.blk td{background:#FDF6F3}
.tx-rk{font-size:10.5px;font-weight:700;color:#fff;border-radius:99px;padding:2px 8px;margin-left:4px}.tx-bk{font-size:10.5px;font-weight:700;color:#B4532F;background:#FBEDE8;border-radius:99px;padding:2px 7px;margin-left:4px}
.tx .d{display:inline-block;width:14px;height:14px;border-radius:50%;box-sizing:border-box;vertical-align:middle}.tx .d.y{width:18px;height:18px;background:#00A3AD}.tx .d.n{border:2px solid #E4E2EC}.tx .d.b{border:2px dashed #D4705A}.tx .d.x{background:#CFCDD9}.tx-tb td:hover .d.n{border-color:#00A3AD}
.tx .dt{font-size:11px;color:#B4532F}.tx-lg{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--ink2);margin-top:10px}.tx-lg span{display:inline-flex;gap:6px;align-items:center}
.tr-chips{`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
