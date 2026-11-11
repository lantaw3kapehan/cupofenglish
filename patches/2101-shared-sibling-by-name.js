// 2101 (11 Nov 21:24, Misty: Andrew shares Andy's package · "I have clicked that already but also not sharing"). No save reached the
//   database: the shared-package form only accepted a sibling picked from the list (with the code); a typed name stopped with a small
//   message. Now a typed name (English or Chinese) that matches exactly one enrolled student is accepted, and the button says why if not.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
  "      const v = String(($('esW') || {}).value || ''), owner = (v.toUpperCase().match(/ST-\\d{4}-\\d{3}/) || [''])[0], teacher = String(($('esT') || {}).value || '').trim();\n      if(!owner) return toast('Choose the sibling who paid from the list');",
  "      const v = String(($('esW') || {}).value || ''), teacher = String(($('esT') || {}).value || '').trim(); let owner = (v.toUpperCase().match(/ST-\\d{4}-\\d{3}/) || [''])[0];\n" +
  "      if(!owner && v.trim()){ try{ const C = cols(), t = v.trim().toLowerCase(), m = [...new Set(((typeof AT !== 'undefined' && AT && AT.rows) || []).filter(r => r[C.enrolled] !== '' && r[C.enrolled] != null && up(r[C.code]) !== up(code) && (String(r[C.name] || '').trim().toLowerCase() === t || String(r[C.cn] || '').trim() === v.trim())).map(r => up(r[C.code])))];   /* 2101 */\n" +
  "        if(m.length === 1) owner = m[0]; else if(m.length > 1) return toast(m.length + ' students are called ' + v.trim() + ' · pick the right one from the list (it shows the code)'); }catch(e){} }\n" +
  "      if(!owner) return toast(v.trim() ? 'No enrolled student called ' + v.trim() + ' · pick the sibling from the list' : 'Choose the sibling who paid from the list');"
]]);
