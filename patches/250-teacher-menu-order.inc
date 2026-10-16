/* 16 Oct · 250 · Teacher menu in the order of a teacher's day, with headings on a laptop (Misty 20:51):
   Classes (Today, Schedule, Students, Books) · Team (Messages) · My growth (Growth, QA feedback) · Money (Pay). Phones show the same order. */
(function(){
  try{
    const G = { today: 'Classes', tsched: 'Classes', students: 'Classes', books: 'Classes', tinbox: 'Team', growth: 'My growth', qa: 'My growth', pay: 'Money' };
    const ORDER = ['today', 'tsched', 'students', 'books', 'tinbox', 'growth', 'qa', 'pay'];
    const all = NAV_T.slice(), by = {}; all.forEach(x => by[x[0]] = x);
    const out = ORDER.filter(v => by[v]).map(v => [by[v][0], by[v][1], by[v][2], by[v][3], G[v]]).concat(all.filter(x => ORDER.indexOf(x[0]) < 0).map(x => [x[0], x[1], x[2], x[3], 'More']));
    NAV_T.length = 0; out.forEach(x => NAV_T.push(x));
    if(D && !D.mgr) buildNav();
  }catch(e){}
})();
