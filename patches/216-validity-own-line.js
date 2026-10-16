// 16 Oct · Lists: the validity notice goes on its own small line under the name (inside the name it cut the name short
// and pushed the Chinese name out of place — Anna 郭蕾).
require('../tools/lib.js')(process.argv[2], [
["const old = el.querySelector(':scope .vn'); if(!v){ if(old) old.remove(); return; } if(old) return;\n      const nm = el.querySelector('b, .nm, .t') || el; nm.insertAdjacentHTML('beforeend', chip(v)); });",
 "const old = el.querySelector(':scope .vn'); if(!v){ if(old) old.remove(); return; } if(old) return;\n      const nm = el.querySelector('b, .nm, .t'); const line = nm && nm.parentElement && nm.parentElement !== el ? nm.parentElement : nm;\n      if(line && line !== el) line.insertAdjacentHTML('afterend', chip(v).replace('class=\"vn\"', 'class=\"vn vn-row vn-li\"')); else el.insertAdjacentHTML('beforeend', chip(v)); });"],
["  .vn-row{display:flex;width:max-content;max-width:100%;margin-top:4px}`;", "  .vn-row{display:flex;width:max-content;max-width:100%;margin-top:4px}\n  .vn-li{margin:2px 0 4px;white-space:normal}`;"],
]);
