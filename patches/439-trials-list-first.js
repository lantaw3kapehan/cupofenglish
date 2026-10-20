// 20 Oct · Trials: the work list (status, source, trials) comes first, the results and charts below it.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 439 · Misty: "can this part go up, then graphs below?"
   Order on the Trials screen: search · booked trial classes · the list to work on (Status, Source, the trials) · then "Results" with the
   period cards and charts. Style only: nothing moves in the code, the screen just shows them in this order. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-trials:not(.hide){display:flex;flex-direction:column}
#v-trials #tpTabs{display:contents}
#v-trials #tpTabs>.seg{order:1}
#v-trials #tpTabs>.sk2{order:2}
#v-trials #tpList{order:3}
#v-trials #tpAt{order:4}
#v-trials #tp2fun{order:5;margin-top:22px!important;position:relative}
#v-trials #tp2fun:before{content:'Results · trial to enrolled';position:absolute;top:-20px;left:4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0}\`;
  document.head.appendChild(css);
})();
` + "</script>\n\n</body>"]]);
