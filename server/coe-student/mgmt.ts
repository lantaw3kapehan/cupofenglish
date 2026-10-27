// coe-student · management's own Lesson summary code, run on the server (1353).
// The portal does NOT re-implement the lesson maths: it loads the live management app (app.html), takes the exact functions the
// Lesson summary uses (pkgGroup, shGroup, shLeft, lsRows, lsHtml, shHtml and patch 1196's monthly-history step) and runs them on the
// exact data management's ACTIVE screen gets (rpc coe_active_screen + coe_pkg_mon_rows). The numbers are read from the variables
// those functions compute; the picture is their own HTML. If anything cannot be loaded or read, the caller shows 核对中 (being checked).
const APP_URL = "https://app.cupofenglishatph.com/app.html";
let CACHE: { at: number; src: string; hash: string } | null = null;

// ── a small JS scanner: find the end of a balanced block, skipping strings, templates, comments and regex literals ──
function skipBlock(s: string, i: number): number {   // s[i] === '{' → index after the matching '}'
  let depth = 0, last = "";
  const regexOK = () => { const t = last.trimEnd(); return !t || /(^|[^A-Za-z0-9_$])(return|typeof)$/.test(t) || /[(,=:\[!&|?{};+\-*%<>~^]$/.test(t); };
  while (i < s.length) {
    const ch = s[i];
    if (ch === "/" && s[i + 1] === "/") { const e = s.indexOf("\n", i); i = e < 0 ? s.length : e; continue; }
    if (ch === "/" && s[i + 1] === "*") { const e = s.indexOf("*/", i + 2); i = e < 0 ? s.length : e + 2; continue; }
    if (ch === "'" || ch === '"') { let j = i + 1; while (j < s.length && s[j] !== ch) { if (s[j] === "\\") j++; j++; } last = "x"; i = j + 1; continue; }
    if (ch === "`") { i = tplEnd(s, i + 1); last = "x"; continue; }
    if (ch === "/" && regexOK()) { let j = i + 1, cls = false; while (j < s.length) { const c = s[j]; if (c === "\\") { j += 2; continue; } if (c === "[") cls = true; else if (c === "]") cls = false; else if (c === "/" && !cls) break; j++; } j++; while (/[a-z]/i.test(s[j] || "")) j++; last = "x"; i = j; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) return i + 1; }
    if (!/\s/.test(ch)) last = (last + ch).slice(-12); else if (last && !last.endsWith(" ")) last += " ";
    i++;
  }
  throw new Error("unbalanced");
}
function tplEnd(t: string, k: number): number { while (k < t.length) { const c = t[k]; if (c === "\\") { k += 2; continue; } if (c === "`") return k + 1; if (c === "$" && t[k + 1] === "{") { k = skipBlock(t, k + 1); continue; } k++; } throw new Error("tpl"); }
export function topFn(src: string, name: string): string {
  const k = src.indexOf("\nfunction " + name + "("); if (k < 0) throw new Error("missing " + name);
  const b = src.indexOf("{", src.indexOf(")", k)); return src.slice(k + 1, skipBlock(src, b));
}
function block1196(src: string): string {
  const k = src.indexOf("/* 1196 · monthly lessons per package"); if (k < 0) throw new Error("missing 1196");
  const f = src.indexOf("(function(){", k), b = src.indexOf("{", f); const e = skipBlock(src, b); return src.slice(f, e) + ")();";
}
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 16); }

// the management functions, instrumented to hand back the numbers they compute (CAP), in a sandbox
export function buildSandbox(app: string) {
  const ls = topFn(app, "lsHtml"), sh = topFn(app, "shHtml");
  const A = "return `<table class=\"sd\"";
  if (ls.split(A).length !== 2 || sh.split(A).length !== 2) throw new Error("summary template changed");
  const ls2 = ls.replace(A, "CAP.ls = { done, total, left, over, enrolled, carry, inc, incTx, pct, T, name, cn, code: o[C.code], course: C.course != null ? o[C.course] : '', book: C.book != null ? o[C.book] : '', start: o[C.start], deadline: o[C.deadline], owner: o[C.code], hist: hist.map(x => ({ ym: x.ym, v: months[x.i] || 0 })), sub: C.sub != null ? n1(rows0.reduce((a, x) => a + (+x[C.sub] || 0), 0)) : 0, rows: rows0.map(x => x[C.row]) }; " + A);
  const sh2 = sh.replace(A, "CAP.sh = { done, tot, left, enrolled, carry, trf, inc, pct, T, names, cns, owner: o[C.code], start: o[C.start], deadline: o[C.deadline], course: C.course != null ? o[C.course] : '', book: C.book != null ? o[C.book] : '', kids: kids.map(k => ({ code: k.code, name: k.name, cn: k.cn, finished: k.finished, teachers: k.teachers })), hist: rows.map(x => ({ ym: x.ym, v: kids.map(k => k.months[x.i] || 0) })), rows: G.members.map(x => x[C.row]).concat(G.unlinked.map(x => x[C.row])) }; " + A);
  const code = [
    "'use strict'; let AT = null, CAP = {}; const window = W; const document = { querySelector: () => null }; const D = { mgr: false };",
    "const esc = s => String(s == null ? '' : s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));",
    "const cxCnOf = () => ''; const pkCourse = v => String(v || '').split(',').map(x => x.trim()).filter(Boolean).map(x => x.replace(/([a-z])([A-Z])/g, '$1 $2')).join(' · ');",
    "function vnLine(){ return ''; }",
    topFn(app, "pkgGroup"), topFn(app, "shGroup"), topFn(app, "shLeft"), topFn(app, "lsRows"), ls2, sh2,
    "return { set: v => { AT = v; }, cap: () => { const c = CAP; CAP = {}; return c; }, shGroup, lsRows, lsHtml, shHtml, pkgGroup };"].join("\n");
  const S = new Function("W", code)({});
  // patch 1196, run as management runs it: its own loader is fed the coe-mon rows instead of a network call
  const mon = block1196(app);
  const run1196 = (rows: any[], AT: any) => {
    const W: any = {};
    const fetchStub = () => Promise.resolve({ json: () => Promise.resolve({ ok: true, rows }) });
    new Function("window", "fetch", "TOKEN", "D", "FAST_URL", "AbortController", "setTimeout", "clearTimeout", "AT", "VIEW", mon)(W, fetchStub, "x", { mgr: true }, "x", undefined, setTimeout, clearTimeout, undefined, "");
    return W.coeMonLoad(true).then(() => W.coeMonApply(AT));
  };
  return { S, run1196 };
}

export async function mgmtApp(force = false) {
  if (!force && CACHE && Date.now() - CACHE.at < 15 * 60e3) return CACHE;
  const r = await fetch(APP_URL + "?v=" + Date.now(), { headers: { "cache-control": "no-cache" } });
  if (!r.ok) { if (CACHE) return CACHE; throw new Error("app " + r.status); }
  const src = await r.text(); CACHE = { at: Date.now(), src, hash: await sha(src) }; return CACHE;
}

// management's data: the ACTIVE screen rows + coe-mon rows (exactly what the app loads)
export async function mgmtData(db: any) {
  const pageMon = async () => { const o: any[] = []; for (let f = 0; f < 50000; f += 1000) { const { data, error } = await db.rpc("coe_pkg_mon_rows").order("code").order("teacher").order("sheet_r").order("buy").order("m").range(f, f + 999); if (error) throw new Error("mon"); o.push(...(data || [])); if (!data || data.length < 1000) break; } return o; };
  const [{ data: A, error: e1 }, M] = await Promise.all([db.rpc("coe_active_screen"), pageMon()]);
  if (e1 || !A) throw new Error("data");
  const rows = M.map((x: any) => [x.sheet_r ?? null, x.code, x.teacher, x.m, Math.round(Number(x.v) * 10) / 10]);
  return { AT: A, mon: rows };
}

// one student's Lesson summary, computed by management's code
export async function mgmtSummary(env: { S: any; run1196: any }, AT: any, mon: any[], code: string, applied?: boolean) {
  const at = applied ? AT : JSON.parse(JSON.stringify(AT));
  if (!applied) await env.run1196(mon, at);
  env.S.set(at);
  const shared = !!env.S.shGroup(code);
  const html = shared ? env.S.shHtml(code) : env.S.lsHtml(code);
  const cap = env.S.cap();
  if (!html) return null;
  const c = shared ? cap.sh : cap.ls; if (!c) throw new Error("no capture");
  return { shared, html, c };
}

// ── the CEFR journey, by management's own code (cjHtml + patch 1221's prep), same way as the Lesson summary (1354) ──
function lineFrom(src: string, start: string): string { const k = src.indexOf("\n" + start); if (k < 0) throw new Error("missing " + start); const e = src.indexOf("\n", k + 1); return src.slice(k + 1, e); }
export function buildJourney(app: string) {
  const lvAt = app.indexOf("const LV = [\n{ k: 'C2'"); if (lvAt < 0) throw new Error("missing CEFR_LV");
  const lvEnd = app.indexOf("}];", lvAt); const LVsrc = app.slice(lvAt, lvEnd + 3);
  const k1221 = app.indexOf("/* 1221 · one CEFR level everywhere"); if (k1221 < 0) throw new Error("missing 1221");
  const f = app.indexOf("(function(){", k1221), b = app.indexOf("{", f); const iife = app.slice(f, skipBlock(app, b)) + ")();";
  const code = [
    "const window = W; const document = { querySelector: () => null, querySelectorAll: () => [] }; const D = { mgr: false }; const $ = () => null;",
    "const esc = s => String(s == null ? '' : s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));",
    LVsrc, "window.CEFR_LV = LV; const CEFR_LV = LV;",
    lineFrom(app, "const CJ_L = ["), lineFrom(app, "const ymdLocal = "),
    topFn(app, "cjLv"), topFn(app, "cjDay"), topFn(app, "cjPath"), topFn(app, "cjNewest"), topFn(app, "cjHtml"),
    "window.cjHtml = cjHtml;", iife,
    "return { run: (S, X) => { window.CJX[S.code] = X; window._CJ = null; const h = window.cjHtml(S); const J = window._CJ; return J ? { html: h, now: CJ_L[J.now] || '', next: CJ_L[J.nxt] || '', up: J.up, since: J.since, tk: J.tk, tkAll: J.tkAll,",
    "  steps: J.T.map(x => ({ d: x.d || '', lv: CJ_L[x.i] || '', en: x.en, zh: x.zh, bk: x.bk || '', u: x.u == null ? null : x.u, start: !!x.start, dd: !!x.dd, chk: !!x.chk, after: x.after || '' })) } : null; } };"].join("\n");
  return new Function("W", code)({});
}
