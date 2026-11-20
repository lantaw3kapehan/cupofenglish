// 2530 (Misty 16:01 "it's like you can't click it because it's faded, then it goes back"): steady screens (2368) drew the remembered copy of a
//   card greyed (opacity .55) and not clickable until the real card arrived, which on To do (redrawn every minute) could take seconds.
//   The copy now looks and works like the card (its buttons call the same actions) and is taken away after 6 s if the real one does not come.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["n.setAttribute('data-c2368', Date.now()); n.setAttribute('inert', ''); n.style.opacity = '.55'; n.style.pointerEvents = 'none'; setTimeout(function(){ watchCopy(n); }, 0);",
   "n.setAttribute('data-c2368', Date.now()); setTimeout(function(){ watchCopy(n); }, 0);   /* 2530: no grey, clickable */"],
  ["if(Date.now() - +c.getAttribute('data-c2368') > 12000) c.remove(); }); }, 700);",
   "if(Date.now() - +c.getAttribute('data-c2368') > 6000) c.remove(); }); }, 700);"]
]);
