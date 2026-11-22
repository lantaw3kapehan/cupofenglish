// 2723 (Misty 22 Nov 19:18): finished classes fold to one line (time · student · book · "All done ✓" bar); tap the card to open it again.
//   The count sits after the bar; the green "video uploaded" box and the speed / I'm in chips are quiet on every card (trials too).
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`#v-today .cs93.p20 em{grid-row:1 / span 2;font-style:normal;font-size:12px;color:#6C6786;white-space:nowrap;margin-left:6px;align-self:start}`,
   `#v-today .cs93.p20 em{grid-column:5;grid-row:1;font-style:normal;font-size:12px;color:#6C6786;white-space:nowrap;margin-left:6px;align-self:start}
#v-today .cls.c20:not(.o20){cursor:pointer;padding-top:10px;padding-bottom:10px}
#v-today .cls.c20:not(.o20) .grow > :not(.row){display:none!important}
#v-today .cls.c20:not(.o20) .t span{display:none}
#v-today .cls.c20:not(.o20) .cs93.p20 b{display:none}
#v-today .cls.c20:not(.o20) .cs93.p20 span::before{height:6px}
#v-today .cls.c20 .row .o20t{font-size:11.5px;color:#8A879C;margin-left:6px;white-space:nowrap}
#v-today .cls .hw[style*="#BFE3D2"]{display:none}
#v-today .cls .cact .chip:not(.red):not(.coral){background:none!important;border:0!important;padding:0 2px!important;font-size:11.5px!important;font-weight:500!important;color:#8A879C!important}`],
  [`      const row20 = card.querySelector('.grow > .row'); if(row20){ row20.insertAdjacentHTML('beforeend', html20); card.classList.add('f93'); return; }`,
   `      const row20 = card.querySelector('.grow > .row'); if(row20){ row20.insertAdjacentHTML('beforeend', html20); card.classList.add('f93');
        if(nd20 === 4 && !card.querySelector('.hw.due')){ card.classList.add('c20'); if((window.__o2723 || {})[c.id]) card.classList.add('o20');
          card.addEventListener('click', e => { if(e.target.closest('button,a,input,select,textarea,[onclick]:not(.cls)')) return; card.classList.toggle('o20'); (window.__o2723 = window.__o2723 || {})[c.id] = card.classList.contains('o20'); }); }
        return; }`],
]);
