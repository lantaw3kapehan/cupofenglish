/* 28 Oct · 1505 · Screens are real links (Misty 19:23: "when we click a SCREEN, we can OPEN LINK IN NEW TAB so we can do other things too").
   · The side menu, the phone bottom bar, More, the tabs at the top of a group (Finance, Teachers, Students, Trials) and the links inside
     screens (Overview tiles, To do, "Notices & requests" …) are <a href="#screen"> links: Ctrl/Cmd-click, middle-click and
     right-click › "Open link in new tab" open that screen in a new tab. A normal click works exactly as before (no reload).
   · Records have their own address: #student=ST-…, #teacher=Name, #chat=all (also #student/ST-…, #chat/all). The new tab checks access
     the same way a click does (the screen must be in that person's menu / group tabs; the server still checks every record).
   · A new tab opens straight on its screen from the copies saved on this device; reloading a tab keeps that tab's own screen and scroll.
   · Menu items were <button>s; the stylesheet rules and look-ups written for "nav button" also match the new links, so they look and
     behave the same (same size, colours, hover, selected bar, badges). */
(function(){
  if(window.__1505) return; window.__1505 = 1;
  var EP = Element.prototype, DP = Document.prototype, FP = DocumentFragment.prototype;
  var O = { eq: EP.querySelector, ea: EP.querySelectorAll, dq: DP.querySelector, da: DP.querySelectorAll, fq: FP.querySelector, fa: FP.querySelectorAll, cl: EP.closest, ma: EP.matches };
  var $1 = function(id){ return document.getElementById(id); };

  /* ── 1 · selectors written for menu/tab <button>s also match the menu/tab links ── */
  var CTX_C = /^nav(?![\w-])|#navIn(?![\w-])|\.grp-tabs(?![\w-])|\.mo-tabs(?![\w-])/;
  var CTX_S = 'nav,.grp-tabs';
  var split = function(sel, at){ var out = [], d = 0, q = '', cur = '';
    for(var k = 0; k < sel.length; k++){ var c = sel[k];
      if(q){ cur += c; if(c === '\\'){ cur += sel[++k] || ''; } else if(c === q) q = ''; continue; }
      if(c === '"' || c === "'"){ q = c; cur += c; continue; }
      if(c === '(' || c === '[') d++; else if(c === ')' || c === ']') d--;
      if(d === 0 && at(c, sel, k)){ out.push(cur); out.push(c); cur = ''; continue; }
      cur += c; }
    out.push(cur); return out; };
  var RWC = new Map();
  function rw(sel, ctx){ var key = (ctx ? '1' : '0') + sel, hit = RWC.get(key); if(hit !== undefined) return hit;
    var parts = split(sel, function(c){ return c === ','; }), out = '';
    for(var p = 0; p < parts.length; p += 2){
      var cx = ctx, toks = split(parts[p], function(c){ return c === ' ' || c === '>' || c === '+' || c === '~' || c === '\n' || c === '\t'; }), s = '';
      for(var t = 0; t < toks.length; t += 2){ var cmp = toks[t];
        if(cmp.indexOf('(') > -1 && cmp.indexOf('button') > -1) cmp = inner(cmp, cx);
        if(cx && /^button(?=$|[.#:\[])/.test(cmp)) cmp = ':is(button,a)' + cmp.slice(6);
        else if(!cx && cmp && CTX_C.test(cmp)) cx = true;
        s += cmp + (t + 1 < toks.length ? toks[t + 1] : ''); }
      out += s + (p + 1 < parts.length ? parts[p + 1] : ''); }
    RWC.set(key, out); return out; }
  /* selectors nested in :is() / :where() / :not() (e.g. the generated ":is(nav button):where(#app …)") */
  function inner(cmp, cx){ var re = /:(is|where|not|matches|-webkit-any)\(/g, m, out = '', last = 0;
    while((m = re.exec(cmp))){ var st = m.index + m[0].length, d = 1, k = st;
      for(; k < cmp.length && d; k++){ var c = cmp[k]; if(c === '(') d++; else if(c === ')') d--; }
      if(d) break; out += cmp.slice(last, st) + rw(cmp.slice(st, k - 1), cx) + ')'; last = k; re.lastIndex = k; }
    return out + cmp.slice(last); }
  window.rw1505 = rw;
  var inCtx = function(n){ try{ return n && n.nodeType === 1 && !!O.cl.call(n, CTX_S); }catch(e){ return false; } };
  var shim = function(proto, name, orig, isEl){ proto[name] = function(sel){ if(typeof sel === 'string' && sel.indexOf('button') > -1){ var n = rw(sel, isEl && inCtx(this)); if(n !== sel) arguments[0] = n; } return orig.apply(this, arguments); }; };
  shim(EP, 'querySelector', O.eq, 1); shim(EP, 'querySelectorAll', O.ea, 1); shim(EP, 'closest', O.cl, 1); shim(EP, 'matches', O.ma, 1);
  shim(DP, 'querySelector', O.dq, 0); shim(DP, 'querySelectorAll', O.da, 0); shim(FP, 'querySelector', O.fq, 0); shim(FP, 'querySelectorAll', O.fa, 0);
  if(EP.webkitMatchesSelector) shim(EP, 'webkitMatchesSelector', EP.webkitMatchesSelector, 1);

  var DONE = typeof WeakSet === 'function' ? new WeakSet() : null;
  function walk(rs){ for(var i = 0; i < rs.length; i++){ var r = rs[i], s = r.selectorText;
    if(s && s.indexOf('button') > -1){ var n = rw(s, false); if(n !== s){ try{ r.selectorText = n; }catch(e){} } }
    if(r.cssRules && r.cssRules.length) walk(r.cssRules); } }
  function sheets(){ if(!DONE) return; var L = document.styleSheets;
    for(var i = 0; i < L.length; i++){ var sh = L[i]; if(DONE.has(sh)) continue; var rs; try{ rs = sh.cssRules; }catch(e){ DONE.add(sh); continue; } DONE.add(sh); try{ walk(rs); }catch(e){} } }
  window.sheets1505 = sheets;
  sheets();
  try{ new MutationObserver(sheets).observe(document.head, { childList: true, subtree: true, characterData: true }); }catch(e){}

  /* the links look exactly like the buttons and rows they replace */
  var css = document.createElement('style'); css.id = 's1505';
  css.textContent = ':where(a[data-nl]){color:inherit;text-decoration:none;-webkit-user-drag:none}'
    + ':where(#navIn>a[data-v],.grp-tabs>a[data-nl]){box-sizing:border-box;text-align:center;cursor:pointer;line-height:normal;letter-spacing:normal;word-spacing:normal;text-transform:none;text-indent:0;text-shadow:none}'
    + ':where(#app,#login,#sheet,#toast,#ivM,#wlM,#tapRes) .grp-tabs>a[data-nl]{font-weight:var(--fw-ctl)!important}'   /* the typography rule a991 gives every button this weight */
    + ':where(a[data-nl="d"]){display:block}'
    + ':where(a[data-nl="r"]){display:block}';
  document.head.appendChild(css);

  /* ── 2 · where a click goes → the address of that screen or record ── */
  var isView = function(v){ return typeof VIEWS !== 'undefined' && VIEWS.indexOf(v) > -1; };
  var H = function(v){ return window.coeH ? coeH(v) : '#' + v; };
  var enc = encodeURIComponent;
  function hrefFor(oc){ var m; oc = String(oc || '');
    if((m = oc.match(/^\s*(?:[A-Za-z_$][\w$.]*\s*=\s*'[^'\\]*'\s*;\s*)*go\('([a-z]+)'\)\s*;?\s*$/))) return isView(m[1]) ? H(m[1]) : null;
    if((m = oc.match(/^\s*openStudent\('([^'\\]+)'\)\s*;?\s*$/))) return '#student=' + enc(m[1]);
    if((m = oc.match(/^\s*openTeacher\('([^'\\]+)'\)\s*;?\s*$/))) return '#teacher=' + enc(m[1]);
    if((m = oc.match(/^\s*chat1400\.open\('([^'\\]+)'\)\s*;?\s*$/))) return '#chat=' + enc(m[1]);
    if((m = oc.match(/^\s*chat1400\.todoGo\('([^'\\]*)',\s*'([^'\\]*)',\s*(\d+)\)\s*;?\s*$/))) return '#chat=' + enc(m[1]) + '|' + enc(m[2]) + '|' + m[3];
    return null; }
  window.href1505 = hrefFor;

  var INTER = 'a[href],button,input,select,textarea,label,summary,[onclick],[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
  var DOCS = '#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]';
  function toA(el, href, kind){ var a = document.createElement('a');
    for(var i = 0; i < el.attributes.length; i++){ var at = el.attributes[i]; if(at.name === 'type' || at.name === 'role' || at.name === 'aria-pressed' || (at.name === 'tabindex' && at.value === '0')) continue; a.setAttribute(at.name, at.value); }
    a.setAttribute('href', href); a.setAttribute('data-nl', kind || '1');
    Object.keys(el).forEach(function(k){ if(!/^__(a881|971)/.test(k)) try{ a[k] = el[k]; }catch(e){} });
    while(el.firstChild) a.appendChild(el.firstChild);
    el.replaceWith(a); return a; }
  function mark(a, href){ a.setAttribute('href', href); a.setAttribute('data-nl', '1'); if(a.getAttribute('role') === 'button') a.removeAttribute('role'); if(a.getAttribute('tabindex') === '0') a.removeAttribute('tabindex'); try{ delete a.__a881k; }catch(e){} }

  /* the menu (laptop side menu, phone bottom bar) */
  function navLinks(){ var n = $1('navIn'); if(!n) return; var L = O.ea.call(n, ':scope > button[data-v]');
    for(var i = 0; i < L.length; i++){ var b = L[i], v = b.dataset.v; if(!v || !isView(v)) continue; toA(b, H(v)); }
    cur(); }
  function cur(){ try{ var L = O.da.call(document, '#navIn > a[data-v], .grp-tabs > a[data-nl]');
    for(var i = 0; i < L.length; i++){ var a = L[i], on = a.classList.contains('on'); if(on && a.getAttribute('aria-current') !== 'page') a.setAttribute('aria-current', 'page'); else if(!on && a.hasAttribute('aria-current')) a.removeAttribute('aria-current'); } }catch(e){} }
  window.navLinks1505 = navLinks;

  /* links inside screens: anchors get their address; plain rows / tiles / group tabs become anchors */
  function linkify(root){ if(!root || root.nodeType !== 1) return; var L = [];
    if(root.hasAttribute('onclick')) L.push(root); var Q = O.ea.call(root, '[onclick]'); for(var i = 0; i < Q.length; i++) L.push(Q[i]);
    for(var j = 0; j < L.length; j++){ var el = L[j]; if(!el.isConnected) continue; var t = el.tagName;
      if(t === 'A'){ if(el.hasAttribute('href')) continue; var h = hrefFor(el.getAttribute('onclick')); if(h) mark(el, h); continue; }
      if(t !== 'DIV' && t !== 'SPAN' && t !== 'BUTTON') continue;
      var h2 = hrefFor(el.getAttribute('onclick')); if(!h2) continue;
      if(t === 'BUTTON'){ var p = el.parentElement; if(p && p.classList.contains('grp-tabs')) toA(el, h2, '1'); continue; }
      if(O.cl.call(el, 'a,button,' + DOCS + ',#login,[contenteditable="true"]')) continue;
      if(O.eq.call(el, INTER)) continue;
      toA(el, h2, t === 'DIV' ? 'd' : '1'); }
  }
  window.linkify1505 = linkify;

  var pend = [], qd = 0;
  var ST = window.__s1505 = { ms: 0, n: 0, links: 0 };
  function flush(){ qd = 0; var L = pend; pend = []; var t0 = performance.now();
    for(var i = 0; i < L.length; i++){ try{ linkify(L[i]); }catch(e){} }
    try{ if(L.length) cur(); }catch(e){} try{ sheets(); }catch(e){} ST.ms += performance.now() - t0; ST.n++; }
  try{ new MutationObserver(function(ms){
      for(var k = 0; k < ms.length; k++){ var m = ms[k];
        if(m.type === 'attributes'){ var el = m.target; if(el.nodeType === 1 && el.hasAttribute('onclick') && !el.hasAttribute('href')) pend.push(el); continue; }
        for(var j = 0; j < m.addedNodes.length; j++){ var n = m.addedNodes[j]; if(n.nodeType === 1){ if(n.parentNode && n.parentNode.id === 'navIn' && n.tagName === 'BUTTON'){ qd = qd || 2; } pend.push(n); } } }
      if(qd === 2){ navLinks(); reOn(); } flush();
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['onclick'] }); }catch(e){}

  /* ── 3 · clicks: a plain click stays in this tab exactly as before; Ctrl/Cmd/Shift-click and middle-click open a new tab ── */
  function linkOf(t){ if(!t || t.nodeType !== 1) t = t && t.parentElement; if(!t) return null; var a = O.cl.call(t, 'a[data-nl]'); if(!a) return null;
    var x = O.cl.call(t, INTER); return x === a ? a : null; }
  addEventListener('click', function(e){ var a = linkOf(e.target); if(!a || e.button !== 0) return;
    if(e.ctrlKey || e.metaKey || e.shiftKey){ e.stopPropagation(); return; }   /* the browser opens it in a new tab / window */
    e.preventDefault(); }, true);                                             /* the link's own onclick runs as before */
  addEventListener('auxclick', function(e){ if(e.button === 1 && linkOf(e.target)) e.stopPropagation(); }, true);
  addEventListener('mousedown', function(e){ if(e.button === 1 && linkOf(e.target)) e.stopPropagation(); }, true);
  addEventListener('keydown', function(e){ if(e.key !== ' ' && e.key !== 'Spacebar') return; var a = e.target; if(!a || a.tagName !== 'A' || !a.hasAttribute('data-nl') || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault(); e.stopPropagation(); a.click(); }, true);           /* Space works like it did on the menu buttons */

  /* the record shown in a panel keeps its own address too (copy / duplicate the tab) */
  try{ var ot = window.openTeacher; if(typeof ot === 'function') window.openTeacher = function(name){ var r = ot.apply(this, arguments); try{ if(history.state && history.state.sh) history.replaceState(history.state, '', '#teacher=' + enc(name)); }catch(e){} return r; }; }catch(e){}
  (function hookChat(n){ var C = window.chat1400; if(!C || typeof C.open !== 'function'){ if(n < 40) setTimeout(function(){ hookChat(n + 1); }, 500); return; } if(C.open.__1505) return;
    var o = C.open; C.open = function(g){ var r = o.apply(this, arguments); try{ if(typeof VIEW !== 'undefined' && VIEW === 'chat' && !(history.state && history.state.sh)) history.replaceState(history.state, '', '#chat=' + enc(g)); }catch(e){} return r; }; C.open.__1505 = 1; })(0);

  /* menu: links after every build; current screen marked for screen readers */
  /* a rebuilt menu keeps the current screen marked (before, a rebuild a moment after opening left no item marked until the next tap) */
  var GRP = { reports: 'astudents', db: 'astudents', enquiry: 'trials', perf: 'teachers', train: 'teachers', leave: 'teachers', actions: 'teachers', finov: 'payroll', expenses: 'payroll', money: 'payroll', forecast: 'payroll', wallets: 'payroll', team: 'monitor' };
  function reOn(){ try{ var n = $1('navIn'); if(!n || typeof VIEW === 'undefined' || typeof D === 'undefined' || !D || O.eq.call(n, ':scope > .on')) return; var v = VIEW;
    var sec = D.mgr && typeof NAV_M !== 'undefined' && NAV_M.find(function(x){ return x[0] === v && x[3] === 1; }), g = D.mgr ? GRP[v] : '';
    [].forEach.call(O.ea.call(n, ':scope > a[data-v]'), function(a){ var d = a.dataset.v; if(d === v || (sec && d === 'more') || (g && d === g)) a.classList.add('on'); }); }catch(e){} }
  var bn = window.buildNav; if(typeof bn === 'function') window.buildNav = function(){ var r = bn.apply(this, arguments); try{ navLinks(); reOn(); cur(); }catch(e){} return r; };
  var g0 = window.go; if(typeof g0 === 'function') window.go = function(){ var r = g0.apply(this, arguments); try{ cur(); }catch(e){} return r; };
  try{ navLinks(); linkify(document.body); }catch(e){}

})();
