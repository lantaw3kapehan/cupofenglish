// 2003: (Misty 15:38 · Julia's laptop header) The Teacher Excellence line ("Bronze · Only 0.1 points to Silver …") sat in the header and
//   squeezed the header buttons into a tall empty pill. On laptops it belongs in the side menu. Cause: 1992 remembered the side menu's width
//   from the first check, which can run before the menu has its final width (0 or narrow) — then the laptop was taken for a phone until the
//   window was resized. Now only a laptop-sized width is remembered; anything else is checked again next time.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(navW1992 < 0) navW1992 = n.offsetWidth; return navW1992 >= 200 && navW1992 < 420; };",
   "const w2003 = navW1992 >= 200 && navW1992 < 420 ? navW1992 : n.offsetWidth; if(w2003 >= 200 && w2003 < 420) navW1992 = w2003; return w2003 >= 200 && w2003 < 420; };   /* 2003: remember only a real side-menu width */"],
]);
