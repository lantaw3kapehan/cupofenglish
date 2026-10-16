// 16 Oct · Misty: teachers don't see the validity notice (class cards, student page, lists, summary picture) · management only.
require('../tools/lib.js')(process.argv[2], [
["      } else if(D && D.students){ (D.students || []).forEach(s => { const dl = String(s.deadline || '').slice(0, 10);", "      } else if(false && D && D.students){ (D.students || []).forEach(s => { const dl = String(s.deadline || '').slice(0, 10);   /* 16 Oct: management only */"],
["function vnLine(dl, left){ try{ if(!dl || !(+left > 0)) return '';", "function vnLine(dl, left){ try{ if(!dl || !(+left > 0) || !(D && D.mgr)) return '';"],
]);
