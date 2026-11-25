// 2949 (Misty 25 Nov 22:03) management only: every screen follows the Deadlines look.
// Reads every <style> block and every CSS string inside scripts in app.html, finds rules that paint with the light logo teal,
// and writes the same rules again, for management only (:where(body.is-mgr), no extra weight), with:
//   solid logo teal  -> dark teal #0E6F68
//   pale teal fills  -> neutral grey #F1F0F5 (borders #E4E2EC)
//   teal words       -> dark teal #0E6F68
// Usage: node tools/b2949.js app.html > tools/b2949.css
const fs = require('fs'), csstree = require('css-tree');
const src = fs.readFileSync(process.argv[2], 'utf8');
const START = src.indexOf('<style id="css2949">');
const s = START > 0 ? src.slice(0, START) : src;

const SOLID = ['#00a3ad', '#01b0bf', '#00939d', '#00aeb5', '#008e9c', '#00a0aa', '#00b0bf', '#5b9ea6', '#2d7a78', '#2e6e77'];
const PALE = ['#e3f4f5', '#e6f6f7', '#e3f6f7', '#e1f4f5', '#e3f6f6', '#e7f3f2', '#e6f4f3', '#e3f6f7', '#e8f6f7', '#e0f4f5', '#eaf7f8', '#e6f4f4', '#e4f4f1', '#e6f4f3', '#f0f9fa', '#eef8f8', '#e6f7f8', '#dff3f4', '#e9f6f7'];
const WORDS = ['#00616a', '#00575f', '#01727c', '#00666d', '#00707a', '#1e5d5b', '#0b6867', '#007a85', '#00818c', '#006d77', '#008c96'];
const RGBA_PALE = /rgba\(\s*(0|1)\s*,\s*(163|176|147)\s*,\s*(173|191|157)\s*,\s*\.?0?\.?\d+\s*\)/gi;

function mapValue(prop, v) {
  if (prop === 'text-transform') return /uppercase/i.test(v) ? 'capitalize' : null;   // labels in Title Case, never capitals
  let out = v, low = v.toLowerCase();
  const isBg = /^background/.test(prop), isBorder = /^(border|outline|box-shadow)/.test(prop), isColor = prop === 'color' || prop === 'fill' || prop === 'stroke' || prop === 'caret-color' || prop === 'text-decoration-color';
  const rep = (list, to) => { for (const c of list) { const re = new RegExp(c + '(?![0-9a-f])', 'gi'); if (re.test(out)) out = out.replace(re, to); } };
  rep(SOLID, '#0E6F68');
  if (isBg) rep(PALE, '#F1F0F5');
  else if (isBorder) rep(PALE, '#E4E2EC');
  else if (isColor) rep(PALE, '#F1F0F5');
  if (isColor || isBorder) rep(WORDS, '#0E6F68');
  out = out.replace(RGBA_PALE, isBg ? '#F1F0F5' : 'rgba(14,111,104,.18)');
  return out === v ? null : out;
}

// collect CSS sources
const sheets = [];
let m; const reStyle = /<style[^>]*>([\s\S]*?)<\/style>/g;
while ((m = reStyle.exec(s))) sheets.push({at: m.index, css: m[1]});
// CSS inside script strings: '...{...}' pieces
const reScript = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
while ((m = reScript.exec(s))) {
  const js = m[1];
  const reStr = /'((?:[^'\\\n]|\\.){8,})'|"((?:[^"\\\n]|\\.){8,})"|`([^`$]{8,})`/g; let k;
  while ((k = reStr.exec(js))) { const t = k[1] || k[2] || k[3]; if (/\{[^{}]*:[^{}]*\}/.test(t) && /#[0-9a-f]{6}|rgba/i.test(t)) sheets.push({at: m.index + k.index, css: t.replace(/\\'/g, "'").replace(/\\"/g, '"')}); }
}

sheets.sort((a, b) => a.at - b.at);
const last = new Map();   // atrule|selector|property -> {val, important, map}

function prefixSel(sel) {
  sel = sel.trim();
  if (!sel || /^(html|:root)\b/i.test(sel)) return null;
  if (/^body\b/i.test(sel)) return sel.replace(/^body/i, 'body:where(.is-mgr)');
  return ':where(body.is-mgr) ' + sel;
}
function walk(ast) {
  csstree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      if (node.prelude.type !== 'SelectorList') return;
      const at = this.atrule ? '@' + this.atrule.name + ' ' + csstree.generate(this.atrule.prelude) : '';
      const sels = []; node.prelude.children.forEach(x => sels.push(csstree.generate(x).trim()));
      node.block.children.forEach(d => {
        if (d.type !== 'Declaration') return;
        const prop = d.property.toLowerCase(); const val = csstree.generate(d.value);
        for (const sel of sels) {
          const key = at + '|' + sel + '|' + prop; const prev = last.get(key);
          if (prev && prev.important && !d.important) continue;   // an !important value earlier still wins
          last.set(key, { at, sel, prop: d.property, val, important: d.important });
        }
      });
    }
  });
}
let bad = 0;
for (const { css } of sheets) {
  try { walk(csstree.parse(css, { parseValue: true, onParseError: () => { bad++; } })); } catch (e) { bad++; }
}
const groups = new Map();
for (const e of last.values()) {
  const nv = mapValue(e.prop.toLowerCase(), e.val); if (!nv) continue;
  const sel = prefixSel(e.sel); if (!sel) continue;
  const g = e.at + '\u0000' + sel; if (!groups.has(g)) groups.set(g, []);
  groups.get(g).push(e.prop + ':' + nv + (e.important ? '!important' : ''));
  if (nv === 'capitalize') groups.get(g).push('letter-spacing:.01em' + (e.important ? '!important' : ''));
}
const out = [];
for (const [g, decls] of groups) { const [at, sel] = g.split('\u0000'); const rule = sel + '{' + decls.join(';') + '}'; out.push(at ? at + '{' + rule + '}' : rule); }
// validate the result parses cleanly
const result = out.join('\n');
let errs = 0; csstree.parse(result, { onParseError: () => errs++ });
process.stderr.write('rules ' + out.length + ' · parse errors in sources ' + bad + ' · errors in output ' + errs + '\n');
process.stdout.write(result + '\n');
