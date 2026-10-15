// 15 Oct · Teachers as a list going down (one teacher per row: name · completion · students · units), cards on phones;
// open slots: opens at once from the database copy (Teacher › open slots took 5 s+ from Google), Google refreshes behind.
const css = `<style id="tc4css">
@media (min-width:760px){
body #v-teachers .tc2-g{grid-template-columns:1fr;gap:0;background:#fff;border:1px solid #EEF0F4;border-radius:20px;overflow:hidden}
body #v-teachers .tc2{display:grid;grid-template-columns:38px minmax(210px,1.3fr) minmax(150px,1fr) minmax(230px,1.3fr) 76px;align-items:center;column-gap:18px;row-gap:0;border:0;border-bottom:1px solid #F1F2F6;border-radius:0;padding:14px 22px;transform:none!important}
body #v-teachers .tc2:last-child{border-bottom:0}
body #v-teachers .tc2:hover{background:#F7F9FA;box-shadow:none}
body #v-teachers .tc2-top{display:contents}
body #v-teachers .tc2-av{grid-column:1;grid-row:1}body #v-teachers .tc2-nm{grid-column:2;grid-row:1}
body #v-teachers .tc2-line{grid-column:3;grid-row:1}body #v-teachers .tc2-f{grid-column:4;grid-row:1}
body #v-teachers .tc2-u{grid-column:5;grid-row:1;text-align:right}
body #v-teachers .tc2-u b{font-size:24px}
}
</style>`;
require('../tools/lib.js')(process.argv[2], [
["</head>", css + "\n</head>"],
["if(!r){ try{ r = await fresh; if(!r || !r.ok) throw r; }catch(e){ $('sheetBody').innerHTML = '<h1>Teacher ' + esc(name)", "if(!r){ try{ const q = await Promise.race([api('mgmtAvailAll', TOKEN, [name]), new Promise(z => setTimeout(() => z(null), 4000))]); const t = q && q.ok && (q.teachers || []).find(x => String(x.name || '').toLowerCase() === name.toLowerCase()); if(t && t.days && t.days.some(Boolean)) r = { ok: true, days: t.days, busy: t.busy || [], from: q.from }; }catch(e){} }\nif(!r){ try{ r = await fresh; if(!r || !r.ok) throw r; }catch(e){ $('sheetBody').innerHTML = '<h1>Teacher ' + esc(name)"],
["AVD.dirty) return; AVD.busy = x.busy || []; AVD._b = null;", "AVD.dirty) return; AVD.busy = x.busy || []; AVD._b = null; AVD.at = x.at || AVD.at; AVD.by = x.by || AVD.by;"],
]);
