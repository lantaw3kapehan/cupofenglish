// 1814: (Misty 6 Nov 18:53 "ensure that flickering won't come back again") Final QA found screens that redraw a big block with the very
//   same content again and again while data loads (Finance › Overview redrew its card 3× in 3 s, Students its list 2×, Home its board 4×).
//   Each identical redraw throws away and rebuilds hundreds of elements, which is what flickers. A guard on innerHTML now skips a redraw
//   when a block (over 1,500 characters) is being set to exactly the same HTML it was last set to and still has its content. Pop-up sheets
//   and forms are left alone (they always redraw), so a form always opens fresh; a screen's search box keeps what was typed. Different content always
//   redraws as before. window.__flicker1814() shows how many redraws were skipped and which blocks redraw most (for the next audit).
const lib = require('../tools/lib.js'), file = process.argv[2];
const G = "<script>/* 1814 · same-HTML guard (no flicker from identical redraws) */\n(function(){ if(window.__g1814) return; window.__g1814 = 1;\n"
  + "  var d = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML'); if(!d || !d.set || !d.get) return;\n"
  + "  var st = { skipped: 0, set: 0, by: {} }, FORM = /<(input|textarea|select)\\b/i;\n"
  + "  function nm(el){ return (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.split(/\\s+/)[0] : '') || el.tagName; }\n"
  + "  Object.defineProperty(Element.prototype, 'innerHTML', { configurable: true, enumerable: d.enumerable, get: d.get,\n"
  + "    set: function(v){ var s = typeof v === 'string' ? v : String(v);\n"
  + "      if(s.length > 1500 && this.__h1814 === s && this.isConnected && this.childNodes.length && !(this.closest && this.closest('#sheet, .sheet, dialog, form'))){ st.skipped++; var k = nm(this); st.by[k] = (st.by[k] || 0) + 1; return; }\n"
  + "      d.set.call(this, v); if(s.length > 1500){ this.__h1814 = s; st.set++; } else if(this.__h1814) this.__h1814 = null; } });\n"
  + "  window.__flicker1814 = function(){ return st; };\n"
  + "})();</script>\n";
lib(file, [["<script>window.__audit1626", G + "<script>window.__audit1626"]]);
