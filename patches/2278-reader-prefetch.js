// 2278 (Misty 16 Nov 19:09 "ensure when they open those books it won't be slow"): the reader's files (page, PDF engine, logo) are
// fetched quietly in the background a few seconds after the app opens, so the first book opens at once.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = `<script id="b2278">
/* 2278 · warm the CupOfEnglish book reader (reader/) so the first book opens without waiting */
(function(){ function warm(){ try{ if(!D) return; ['reader/', 'reader/pdfjs/pdf.min.mjs', 'reader/pdfjs/pdf.worker.min.mjs', 'reader/logo.png'].forEach(u => { const l = document.createElement('link'); l.rel = 'prefetch'; l.href = u; document.head.appendChild(l); }); }catch(e){} }
  setTimeout(warm, 6000); })();
</script>`;
lib(file, [["\n</body>\n</html>", "\n" + JS + "\n</body>\n</html>"]]);
