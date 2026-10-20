/* 20 Oct · 451 · Performance (Misty: "now let us do the Performance screen").
   Teaching setup: a coloured bar (approved green · to check amber · to fix coral · not sent grey) under the title;
   only teachers who sent a screenshot are cards (bigger picture, status, Approve / Ask for a fix); everyone else is one line "Not sent yet · 13: April, Ara, …". */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#setupPanel .ts51b{display:flex;height:8px;border-radius:4px;overflow:hidden;gap:2px;margin-top:8px}
#setupPanel .ts51b i{display:block}
#setupPanel .ts51g{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-top:12px}
#setupPanel .ts51c{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
#setupPanel .ts51c.w{border-color:#F2C46D;box-shadow:0 0 0 1px #F2C46D}
#setupPanel .ts51c.f{border-color:#F0C9BF}
#setupPanel .ts51c img,#setupPanel .ts51c .ph{display:block;width:100%;height:130px;object-fit:cover;background:#EEE;cursor:zoom-in}
#setupPanel .ts51c .bd{padding:8px 12px 10px}
#setupPanel .ts51n{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--line)}
#setupPanel .ts51n span{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0;margin-right:4px}
#setupPanel .ts51n b{font-size:12.5px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--soft);color:#55526E}`;
  document.head.appendChild(css);
})();
