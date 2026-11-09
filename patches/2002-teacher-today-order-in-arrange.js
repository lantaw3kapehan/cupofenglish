// 2002: (follows 2001) Teacher Today keeps its order in one place. 2001 moved the Christmas card and the welcome line, but the existing
//   Today arranger (1104) put the next class straight after the welcome line again, so they changed places back. The order now lives in
//   the arranger itself:
//   · every width: urgent line → urgent notices → next class → Needs your action → (the day) → optional announcements (Christmas card);
//   · phones (≤ 640 px): the welcome line moves below the announcements, so the next class is the first card under the urgent line;
//   · laptops keep the welcome line at the top.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    var ref = lead; qa('.ct-ban.nt-ban').concat([q('#ftBox')]).forEach(function(x){ if(!x) return; if(ref.nextElementSibling !== x) ref.after(x); ref = x; });",
   "    var ph2002 = !window.matchMedia || matchMedia('(max-width:640px)').matches, top2002 = q('#top2002');   /* 2002: phones start above the welcome line */\n    if(ph2002){ if(!top2002){ top2002 = document.createElement('i'); top2002.id = 'top2002'; top2002.hidden = true; } if(v.firstElementChild !== top2002) v.prepend(top2002); } else if(top2002) top2002.remove();\n    var ref = ph2002 ? top2002 : lead; [q('#urg2001')].concat(qa('.ct-ban.nt-ban'), [q('#ftBox')]).forEach(function(x){ if(!x) return; if(ref.nextElementSibling !== x) ref.after(x); ref = x; });"],
  ["    var anchorTd = nn || ref; if(td.previousElementSibling !== anchorTd) anchorTd.after(td);\n  }catch(e){ console.warn('1104', e); } }",
   "    var anchorTd = nn || ref; if(td.previousElementSibling !== anchorTd) anchorTd.after(td);\n    var tail2002 = (!cols && day && day.previousElementSibling === td) ? day : (td.style.display === 'none' ? anchorTd : td), xm2002 = q('#x21c');   /* 2002: announcements after the class and the actions */\n    if(xm2002){ if(tail2002.nextElementSibling !== xm2002) tail2002.after(xm2002); tail2002 = xm2002; }\n    if(ph2002 && lead && tail2002.nextElementSibling !== lead) tail2002.after(lead);\n  }catch(e){ console.warn('1104', e); } }"],
  ["      const x = v.querySelector(':scope > #x21c'); if(x && (x.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING)) after.insertAdjacentElement('afterend', x);\n      const lead = v.querySelector(':scope > .lead'); if(lead && phone()){ const tgt = x && x.parentNode === v ? x : after; if(lead.compareDocumentPosition(tgt) & Node.DOCUMENT_POSITION_FOLLOWING) tgt.insertAdjacentElement('afterend', lead); }",
   "      void after;   /* 2002: the order is kept by the Today arranger (1104) */"],
  ["if(u.nextElementSibling !== nn) nn.insertAdjacentElement('beforebegin', u); }", "if(!u.parentNode) nn.insertAdjacentElement('beforebegin', u); }"],
]);
