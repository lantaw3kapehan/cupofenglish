// 2369: steady screens (2368) remember the exact place of a card that has no card above it (under the title, not above it).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["[].slice.call(v.children).forEach(function(c){ var k = keyOf(c); if(k && !c.hasAttribute('data-c2368') && c.offsetHeight > 8){ var h = c.outerHTML; if(h.length < 40000) out.push({ k: k, a: prev, h: h }); } if(k) prev = k; });", "[].slice.call(v.children).forEach(function(c, i){ var k = keyOf(c); if(k && !c.hasAttribute('data-c2368') && c.offsetHeight > 8){ var h = c.outerHTML; if(h.length < 40000) out.push({ k: k, a: prev === '^' ? '^' + i : prev, h: h }); } if(k) prev = k; });"],
["var anchor = x.a === '^' ? null : have[x.a]; if(x.a !== '^' && !anchor) return;", "var top = x.a.charAt(0) === '^', anchor = top ? null : have[x.a]; if(!top && !anchor) return;"],
["if(anchor) anchor.after(n); else v.prepend(n); have[x.k] = n; }); }catch(e){} }", "if(anchor) anchor.after(n); else { var ref = v.children[parseInt(x.a.slice(1), 10) || 0]; if(ref) v.insertBefore(n, ref); else v.appendChild(n); } have[x.k] = n; }); }catch(e){} }"]
]);
