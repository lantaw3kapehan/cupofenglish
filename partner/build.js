// node build.js app.html partner.src.html out.html — injects the app's logo + tagline artwork (data URIs, no network)
const fs = require('fs'), [app, src, out] = process.argv.slice(2), A = fs.readFileSync(app, 'utf8');
const dec = s => s.replace(/&#43;/g, '+').replace(/&#x2B;/gi, '+').replace(/&amp;/g, '&');
const i = A.indexOf('id="login"'), logo = dec(A.slice(i).match(/<img[^>]*src="(data:image[^"]+)"/)[1]);
const tag = dec(A.match(/class="tagl"><img src="(data:image[^"]+)"/)[1]);
let h = fs.readFileSync(src, 'utf8').split('__LOGO__').join(logo).split('__TAG__').join(tag);
fs.writeFileSync(out, h); console.log('built', out, h.length, 'bytes');
