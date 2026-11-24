// Step 1 of the faster-download plan (24 Nov 2026): makes app.min.html, a compact copy of app.html for downloading.
// app.html stays the file we edit. Only the notes and spaces inside <script> and <style> blocks are removed and local
// names are written short; top-level names, function names and the "const COE_V = N;" line are kept as they are.
// usage: node tools/compact.js [app.html] [app.min.html]   (needs terser and csso: npm i terser@5 csso@5 in tools/node_modules or NODE_PATH)
const fs = require('fs');
const { minify } = require('terser');
const csso = require('csso');
const src = process.argv[2] || 'app.html', out = process.argv[3] || 'app.min.html';
const s = fs.readFileSync(src, 'utf8');
const V = (s.match(/const COE_V = (\d+);/) || [])[1];
if (!V || s.indexOf('COE_API') < 0) { console.error('app.html looks incomplete'); process.exit(1); }

(async () => {
  const re = /(<script(?![^>]*\bsrc=)[^>]*>)([\s\S]*?)(<\/script>)|(<style[^>]*>)([\s\S]*?)(<\/style>)/g;
  const parts = []; let last = 0, m, nJ = 0, nC = 0;
  while ((m = re.exec(s))) {
    parts.push(s.slice(last, m.index)); last = re.lastIndex;
    if (m[1] !== undefined) {
      nJ++;
      const r = await minify(m[2], {
        compress: false,                                   // the code itself is not rewritten
        mangle: { keep_fnames: true, keep_classnames: true }, // only local names inside functions get shorter
        keep_fnames: true, keep_classnames: true,
        format: { comments: false, inline_script: true, ascii_only: false },
      }).catch((e) => { throw new Error('script ' + nJ + ': ' + e.message); });
      let js = r.code || '';
      if (/const COE_V\s*=/.test(js)) js = js.replace(/const COE_V\s*=\s*(\d+)\s*([;,])/, (x, n, e) => e === ';' ? 'const COE_V = ' + n + ';' : 'const COE_V = ' + n + ';const ');
      parts.push(m[1] + js + m[3]);
    } else {
      nC++;
      let css;
      try { css = csso.minify(m[5], { restructure: false, comments: false }).css; } catch (e) { css = m[5]; }
      parts.push(m[4] + css + m[6]);
    }
  }
  parts.push(s.slice(last));
  const o = parts.join('').replace(/<!--(?!\[)[\s\S]*?-->/g, '');
  if ((o.match(/const COE_V = (\d+);/) || [])[1] !== V) { console.error('COE_V line lost'); process.exit(1); }
  fs.writeFileSync(out, o);
  const zlib = require('zlib');
  const kb = (x) => (x / 1048576).toFixed(2) + ' MB';
  console.log('app.min.html · ' + nJ + ' scripts, ' + nC + ' styles · ' + kb(Buffer.byteLength(s)) + ' → ' + kb(Buffer.byteLength(o)) +
    ' (compressed ' + kb(zlib.gzipSync(s).length) + ' → ' + kb(zlib.gzipSync(o).length) + ') · version ' + V);
})().catch((e) => { console.error(e.message); process.exit(1); });
