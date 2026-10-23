// 682: (Misty) Trainings (management) — easier and cleaner table:
//  · two tabs: "Path" (mandatory, by rank) and "Books & trials" (unlocks), so the table is never 20 columns wide
//  · headings grouped by the rank they unlock (coloured bands); tap a heading to tick many (no ✓ in headings any more)
//  · teachers grouped by rank, name column stays in place while scrolling, with "done x of y" and a small bar
//  · cells are clear circles: ✓ done · date = booked · ring = not yet · coral = needed for the next rank now · Ex = excused
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "    // table\n    const short = {", Z = "    if(v._h !== h){ v.innerHTML = h; v._h = h; } }\n  window.trView = async function";
const i = s.indexOf(A), j = s.indexOf(Z);
if (i < 0 || j < i || s.indexOf(A, i + 1) > -1) { console.error('table block not found once'); process.exit(1); }
const NEW = `    // table (682)
    const short = { way: 'CoE Way', demo: 'Final Demo', track: 'TRACK', ct: 'Critical Thinking', comm: 'Commun&shy;ication', collab: 'Collab&shy;oration', creat: 'Creat&shy;ivity', integ: 'Integ&shy;ration', phon: 'Phono&shy;logy', gram: 'Grammar', prog: 'Progress checks', inq: 'Inquiry', spec: 'Special&shy;ization', facil: 'Facilitate', trial: 'Trial classes', 'cw-phonics': 'Phonics', 'cw-od1': 'OD 1', 'cw-od2': 'OD 2', 'cw-re': 'Reading Explorer' };
    const tab = window._trTab || 'path', U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((a, b) => a.sort - b.sort), C = tab === 'path' ? M : U;
    const BAND = { 'Newly Hired': '#EEF8F7', 'Starting Teacher': '#EEF8F7', 'Newly Qualified': '#F3F1FB', 'Junior Teacher': '#FFF6E9', 'Senior Teacher': '#EEF3FB', 'Master Teacher': '#FBEFF4' };
    const grp = []; C.forEach(t => { const g = tab === 'path' ? (t.gate || '') : 'Unlocks'; const l = grp[grp.length - 1]; if(l && l.g === g) l.n++; else grp.push({ g, n: 1 }); });
    const bg = t => tab === 'path' ? (BAND[t.gate] || '#F6F5FA') : '#F6F5FA';
    h += '<div class="trm-tabs"><button class="' + (tab === 'path' ? 'on' : '') + '" onclick="window._trTab=\\'path\\';paintTrAll()">Path · by rank</button><button class="' + (tab === 'unl' ? 'on' : '') + '" onclick="window._trTab=\\'unl\\';paintTrAll()">Books &amp; trials</button><span class="grow"></span><span class="trm-lg"><i class="o y">✓</i> done <i class="o s">31</i> booked <i class="o b">!</i> needed now <i class="o n"></i> not yet</span></div>';
    h += '<div class="trm-tb2"><table><thead><tr class="g"><th class="st"></th>' + grp.map(x => '<th colspan="' + x.n + '" style="background:' + (tab === 'path' ? (BAND[x.g] || '#F6F5FA') : '#F6F5FA') + '">' + (tab === 'path' ? 'To ' + e(x.g) : 'Unlocks') + '</th>').join('') + '</tr>'
      + '<tr class="t"><th class="st">Teacher <small>tap a name for the path</small></th>' + C.map(t => '<th style="background:' + bg(t) + '"><button type="button" title="Tick ' + e(t.title) + ' for many teachers" onclick="trCol(\\'' + t.id + '\\')">' + (short[t.id] || e(t.title)) + '</button></th>').join('') + '</tr></thead><tbody>';
    const byRank = {}; T.forEach(x => { const k = x.ix < 0 ? -1 : x.ix; (byRank[k] = byRank[k] || []).push(x); });
    Object.keys(byRank).map(Number).sort((a, b) => b - a).forEach(k => { const G = byRank[k].sort((a, b) => String(a.name).localeCompare(b.name));
      h += '<tr class="rk"><td class="st">' + e(k < 0 ? 'Other' : RANKS[k] + 's') + ' · ' + G.length + '</td><td colspan="' + C.length + '"></td></tr>';
      G.forEach(x => { const L = statusList(d, x.name, Math.max(0, x.ix)), blocked = x.next && x.next.need <= 0 && L.some(y => y.gi === x.ix + 1 && y.st !== 'done');
        const dn = C.filter(t => ['done', 'excused'].includes((latestRec(d.records, x.name, t.id) || {}).status)).length;
        h += '<tr class="' + (blocked ? 'blk' : '') + '"><td class="st"><b class="link" onclick="trView(\\'' + e(x.name) + '\\')">' + e(x.name) + '</b>' + (blocked ? ' <span class="trm-bk">blocked</span>' : '') + '<div class="trm-pg"><i style="width:' + Math.round(dn / Math.max(1, C.length) * 100) + '%"></i></div><small>' + dn + ' of ' + C.length + ' done</small></td>'
          + C.map(t => { const rec = latestRec(d.records, x.name, t.id), ses = (d.sessions || []).find(s => s.training_id === t.id && s.status === 'scheduled' && (s.invited || []).includes(x.name));
            const P = t.id === 'way' ? partsOf(d, 'way') : [], pd = P.filter(p => partDone(d, x.name, p)).length;
            const c = rec && rec.status === 'done' ? '<i class="o y" title="' + e(fmtD(rec.done_at) + ' · ' + rec.via) + '">✓</i>' : rec && rec.status === 'excused' ? '<i class="o x">Ex</i>' : ses ? '<i class="o s" title="' + e(fmtDT(ses.starts_at)) + '">' + new Date(ses.starts_at).getDate() + '</i>' : t.id === 'way' && pd ? '<i class="o s">' + pd + '/' + P.length + '</i>' : rec && rec.status === 'assigned' ? '<i class="o s" title="Assigned">A</i>' : tab === 'path' && rix(t.gate) === x.ix + 1 && blocked ? '<i class="o b" title="Needed for ' + e(x.next.name) + '">!</i>' : '<i class="o n"></i>';
            return '<td style="background:' + bg(t) + '33" onclick="trCell(\\'' + e(x.name) + '\\',\\'' + t.id + '\\')">' + c + '</td>'; }).join('') + '</tr>'; }); });
    h += '</tbody></table></div><p class="small mute" style="margin-top:8px">Tap a heading to tick many teachers · tap a circle for one · tap a name to see the path and "Mark everything up to". Teachers already at a rank are not blocked by that rank\\'s trainings.</p></div>';
`;
s = s.slice(0, i) + NEW + s.slice(j);
// expose a repaint for the tabs
const k = "  window.trView = async function";
s = s.replace(k, "  window.paintTrAll = () => paintAll();\n" + k);
// styles
const st = ".trm-tb tr.blk td{background:#FDF6F3}";
if (s.split(st).length !== 2) { console.error('css anchor'); process.exit(1); }
s = s.replace(st, st + `
.trm-tabs{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0 10px}.trm-tabs button{font:inherit;font-weight:700;font-size:13.5px;border:1px solid #E4E2EC;background:#fff;color:#4A4566;border-radius:99px;padding:8px 14px;cursor:pointer}.trm-tabs button.on{background:#2B2253;border-color:#2B2253;color:#fff}
.trm-lg{font-size:12px;color:#5E5A75;display:flex;gap:6px;align-items:center;flex-wrap:wrap}.trm-lg .o{width:20px;height:20px;font-size:10px;margin-left:6px}
.trm-tb2{background:#fff;border:1px solid #EEEDF3;border-radius:18px;overflow:auto;max-height:72vh}
.trm-tb2 table{border-collapse:separate;border-spacing:0;font-size:13px;min-width:100%}
.trm-tb2 thead th{position:sticky;z-index:2;font-size:11.5px;font-weight:700;color:#4A4566;text-align:center;padding:6px 4px}
.trm-tb2 thead tr.g th{top:0;height:30px;font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;color:#5E5A75;border-left:2px solid #fff}
.trm-tb2 thead tr.t th{top:30px;border-bottom:1px solid #E4E2EC;border-left:2px solid #fff;vertical-align:bottom;min-width:62px;max-width:86px}
.trm-tb2 thead tr.t th button{font:inherit;background:none;border:0;color:#2B2253;cursor:pointer;padding:4px 2px;line-height:1.2;border-radius:8px;hyphens:manual}.trm-tb2 thead tr.t th button:hover{background:#fff;text-decoration:underline}
.trm-tb2 .st{position:sticky;left:0;z-index:1;background:#fff;text-align:left;min-width:170px;padding:9px 12px;border-right:1px solid #EEEDF3}
.trm-tb2 thead .st{z-index:3;background:#fff}.trm-tb2 thead tr.t .st small{display:block;font-weight:400;color:#77738C;font-size:11px}
.trm-tb2 td{border-bottom:1px solid #F3F2F7;text-align:center;padding:6px 4px;cursor:pointer}.trm-tb2 tbody tr:hover td{filter:brightness(.97)}.trm-tb2 tbody tr:hover td.st{background:#FAFAFC}
.trm-tb2 td.st b{font-size:14px}.trm-tb2 td.st small{color:#77738C;font-size:11px}
.trm-tb2 tr.rk td{background:#FAFAFC!important;cursor:default;padding:7px 12px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#5E5A75}
.trm-tb2 tr.blk td.st{background:#FDF6F3}
.trm-pg{height:4px;background:#EEEDF3;border-radius:99px;margin:5px 0 2px;max-width:120px}.trm-pg i{display:block;height:4px;border-radius:99px;background:#00A3AD}
.trm-bk{font-size:10.5px;font-weight:700;color:#B4532F;background:#FBEDE8;border-radius:99px;padding:2px 7px}
.o{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;font-style:normal;font-weight:700;font-size:12px;box-sizing:border-box}
.o.y{background:#00A3AD;color:#fff}.o.s{border:2px solid #D4705A;color:#B4532F;font-size:11px}.o.b{border:2px dashed #D4705A;color:#B4532F;background:#FDF6F3}.o.n{border:2px solid #E4E2EC}.o.x{background:#E4E2EC;color:#5E5A75;font-size:10px}
.trm-tb2 td:hover .o.n{border-color:#00A3AD}`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
