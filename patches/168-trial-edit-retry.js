// 15 Oct · Trial details redraw a moment after opening, which removed the "Edit details" button: add it again after
// each redraw (checks for 4 s after opening).
require('../tools/lib.js')(process.argv[2], [
["      try{ const b = $('sheetBody'); if(D && D.mgr && b && !b.querySelector('.s2-edit')){ const m = (b.textContent || '').slice(0, 600).match(/ST-\\d{4}-\\d{3}/); const h1 = b.querySelector('h1');\n        if(m && h1) h1.insertAdjacentHTML('afterend', '<div style=\"margin:8px 0 4px\">' + btn(m[0], 'ghost') + '</div>'); } }catch(e){}",
 "      const add = () => { try{ const b = $('sheetBody'); if(D && D.mgr && b && !b.querySelector('.s2-edit')){ const m = (b.textContent || '').slice(0, 600).match(/ST-\\d{4}-\\d{3}/); const h1 = b.querySelector('h1');\n        if(m && h1) h1.insertAdjacentHTML('afterend', '<div style=\"margin:8px 0 4px\">' + btn(m[0], 'ghost') + '</div>'); } }catch(e){} };\n      [0, 300, 900, 2000, 4000].forEach(t => setTimeout(add, t));"],
]);
