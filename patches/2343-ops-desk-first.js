// 2343: Ops Desk always sits first on To do (other cards are added under the title later).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["    if(o){ if(o.outerHTML !== HTML) o.outerHTML = HTML; return; }\n    var lead = v.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', HTML); else v.insertAdjacentHTML('afterbegin', HTML); }", "    if(o){ if(o.outerHTML !== HTML) o.outerHTML = HTML; } else { var lead0 = v.querySelector('.lead'); if(lead0) lead0.insertAdjacentHTML('afterend', HTML); else v.insertAdjacentHTML('afterbegin', HTML); }\n    try{ var lead = v.querySelector('.lead'), me = document.getElementById('od2341'); if(lead && me && lead.nextElementSibling !== me) lead.parentNode.insertBefore(me, lead.nextSibling); }catch(e){} }   /* 2343: always first under the title */"]
]);
