// 2277 (Misty 16 Nov 18:49–18:54): book pages open in the CupOfEnglish reader tab (reader/index.html · PDF.js), not Google Drive:
// zoom, drawing tools, Present mode for screen sharing, the unit's lessons and videos. PDFs come from our Storage copy (book-media,
// filled by coe-media-sync) with the Drive stream (coe-audio) as the fallback. Also: the book sheet note says pages open in the reader.
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2277-book-reader-tab.client.js"), "utf8");
lib(file, [
 ['<div class="b3-note">Pages open in Google Drive · videos and audio play here in the app.</div>', '<div class="b3-note">Pages open in the CupOfEnglish reader tab (zoom, drawing, Present for class) · videos and audio play here in the app.</div>'],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
