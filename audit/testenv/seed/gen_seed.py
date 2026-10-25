#!/usr/bin/env python3
# Test environment seed (25 Oct 2026) · builds SQL for the Supabase TEST BRANCH (jeenkwqibxeuuazeyrvw) from the fixtures
#   audit/fx/recs.json   (management sample, names already replaced)  and  audit/fx/teacher.json  (made-up "Test" teacher).
# Nothing here reads production. The fixtures are scrubbed again on the way in (left-over surname, IPs, GPS points,
# Drive file links, e-mails, WeChat IDs, internet-provider names, enquiry free text), see SCRUB below.
# Output: <out>/NN-*.sql (each under ~90 KB, applied in order) and <out>/manifest.json (md5 of every docs row as jsonb prints it,
# to check the copy on the branch is exact).
# usage: python3 -I gen_seed.py <repo> <out-dir>
import json, re, sys, os, hashlib
from decimal import Decimal

REPO, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
FX = os.path.join(REPO, "audit", "fx")

# ── JSON with numbers kept exactly as written ───────────────────────────────────────────────────────────────────────
def load(s):
    return json.loads(s, parse_float=Decimal, parse_int=Decimal)

def numtxt(d, pg=False):
    if isinstance(d, bool):
        return "true" if d else "false"
    t = format(d, "f") if isinstance(d, Decimal) else str(d)
    if pg and t in ("-0",):
        t = "0"
    if pg and t.startswith("-") and set(t[1:]) <= set("0."):
        t = t[1:]
    return t

def esc(s, pg=False):
    out = ['"']
    for ch in s:
        o = ord(ch)
        if ch == '"': out.append('\\"')
        elif ch == '\\': out.append('\\\\')
        elif ch == '\b': out.append('\\b')
        elif ch == '\f': out.append('\\f')
        elif ch == '\n': out.append('\\n')
        elif ch == '\r': out.append('\\r')
        elif ch == '\t': out.append('\\t')
        elif o < 0x20: out.append('\\u%04x' % o)
        else: out.append(ch)
    out.append('"')
    return "".join(out)

def dump(x, pg=False):
    """compact JSON (pg=False) or exactly what Postgres prints for jsonb (pg=True)"""
    if x is None: return "null"
    if x is True: return "true"
    if x is False: return "false"
    if isinstance(x, (Decimal, int, float)): return numtxt(x, pg)
    if isinstance(x, str): return esc(x, pg)
    if isinstance(x, list):
        return ("[" + ", ".join(dump(v, pg) for v in x) + "]") if pg else ("[" + ",".join(dump(v) for v in x) + "]")
    if isinstance(x, dict):
        ks = list(x.keys())
        if pg:
            ks.sort(key=lambda k: (len(k.encode("utf-8")), k.encode("utf-8")))
            return "{" + ", ".join(esc(k, True) + ": " + dump(x[k], True) for k in ks) + "}"
        return "{" + ",".join(esc(k) + ":" + dump(x[k]) for k in ks) + "}"
    raise TypeError(type(x))

def keyargs(a):   # the app's docs key: JSON.stringify(args)
    return dump(a)

# ── SCRUB: what the fixture still carried ───────────────────────────────────────────────────────────────────────────
IPMAP, DRMAP, EMMAP, WXMAP = {}, {}, {}, {}
def _ip(m):
    v = m.group(0)
    if v not in IPMAP: IPMAP[v] = "203.0.113.%d" % (len(IPMAP) + 10)
    return IPMAP[v]
def _drive(m):
    v = m.group(0)
    if v not in DRMAP: DRMAP[v] = "https://example.invalid/drive/TEST-%s" % hashlib.sha1(v.encode()).hexdigest()[:16]
    return DRMAP[v]
def _mail(m):
    v = m.group(0)
    if v not in EMMAP: EMMAP[v] = "user%d@example.invalid" % (len(EMMAP) + 1)
    return EMMAP[v]
SUBS = [
    (re.compile(r"Dagyapen"), lambda m: "Sample"),
    (re.compile(r"MISTY"), lambda m: "YURILO"), (re.compile(r"Misty"), lambda m: "Yurilo"), (re.compile(r"misty"), lambda m: "yurilo"),
    (re.compile(r"\bApril\b(?!\s+\d)"), lambda m: "Avrielle"), (re.compile(r"\bapril\b"), lambda m: "avrielle"),
    (re.compile(r"\brose\b"), lambda m: "rozan"),
    (re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b"), _ip),
    (re.compile(r"https?://(?:drive|docs)\.google\.com/[^\s\"'<>)]+"), _drive),
    (re.compile(r"(maps\.google\.com/\?q=)-?[\d.]+,-?[\d.]+"), lambda m: m.group(1) + "0,0"),
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+"), _mail),
]
def scrub_s(s):
    for rx, fn in SUBS:
        s = rx.sub(fn, s)
    return s
def scrub(x, key=None):
    if isinstance(x, str):
        if key in ("wechat", "wx", "wechatId"):
            if not x: return x
            if x not in WXMAP: WXMAP[x] = "wx_test_%d" % (len(WXMAP) + 1)
            return WXMAP[x]
        if key == "net" and x: return "Test ISP"
        if key == "details" and x: return "(enquiry details removed in the test copy)"
        if key in ("open_ua", "ua", "pres_ua", "wit_ua") and x: return "Test browser"
        return scrub_s(x)
    if isinstance(x, list): return [scrub(v) for v in x]
    if isinstance(x, dict): return {scrub_s(k): scrub(v, k) for k, v in x.items()}
    return x

recs = json.load(open(os.path.join(FX, "recs.json")))
teach = json.load(open(os.path.join(FX, "teacher.json")))
def resp(x):
    try: return scrub(load(x["t"]))
    except Exception: return None
def body(x):
    try: return json.loads(x.get("body") or "null")
    except Exception: return None
def fname(x): return x["url"].split("?")[0].rstrip("/").split("/")[-1]

# ── docs ────────────────────────────────────────────────────────────────────────────────────────────────────────────
SYS_SCOPE = {"cl18": "mgmt", "db": "mgmt", "fb": "mgmt", "fbtemplate": "mgmt", "prl": "mgmt", "tmap": "mgmt", "todaydb": "mgmt", "todaylive": "mgmt", "vids": "mgmt", "watch": "mgmt"}
def scope_of(k):
    p = k.split(":", 1)[0]
    if p == "sys": return SYS_SCOPE.get(k.split(":", 1)[1].split("|")[0], "pres")
    return p
DOCS = {}
def put_doc(k, data, src):
    DOCS[k] = {"scope": scope_of(k), "data": data, "src": src}

for x in recs:
    f = fname(x)
    if f != "coe": continue
    d = resp(x)
    if not d or not isinstance(d.get("docs"), dict): continue
    for k, v in d["docs"].items():
        if isinstance(v, dict) and "data" in v: put_doc(k, v["data"], "recs")

# teacher: the docs answer, then every Apps Script answer as the same database copy ("test:<fn>|<args>")
for x in teach:
    d = resp(x)
    if not d: continue
    if fname(x) == "coe" and isinstance(d.get("docs"), dict):
        for k, v in d["docs"].items():
            if isinstance(v, dict) and "data" in v: put_doc(k, v["data"], "teacher")
for x in teach:
    if fname(x) != "exec": continue
    b, d = body(x), resp(x)
    if not b or not d or not d.get("ok") or "data" not in d: continue
    k = "test:" + b["fn"] + "|" + keyargs(scrub(b.get("args", [])[1:]))
    if k not in DOCS: put_doc(k, d["data"], "teacher-exec")

# copies other functions read from docs
def first(fn, pred):
    for x in recs:
        if fname(x) == fn:
            b = body(x) or {}
            if pred(b): return resp(x)
    return None
vfd = first("coe-train", lambda b: b.get("action") == "vf_decs")
if vfd and isinstance(vfd.get("dec"), dict): put_doc("mgmt:vfdec", vfd["dec"], "recs:vf_decs")
wx = first("coe-train", lambda b: b.get("action") == "wx_get")
if wx and isinstance(wx.get("map"), dict): put_doc("mgmt:wxgroup", wx["map"], "recs:wx_get")
vf = first("coe-train", lambda b: b.get("action") == "vidflags")
flags = list(vf.get("list") or []) if vf else []
for x in teach:
    if fname(x) == "coe-train" and (body(x) or {}).get("action") == "vidflags":
        flags += list((resp(x) or {}).get("list") or [])
put_doc("sys:vids", {"flags": flags, "days": {}}, "recs:vidflags")

# ── small tables straight from function answers ─────────────────────────────────────────────────────────────────────
def lit(v):
    if v is None: return "null"
    if isinstance(v, bool): return "true" if v else "false"
    if isinstance(v, Decimal): return numtxt(v)
    if isinstance(v, (dict, list)): return "$j$" + dump(v) + "$j$::jsonb"
    return "'" + str(v).replace("'", "''") + "'"
NOTNULL = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'notnull.json')))

# Check constraints on the branch (pg_constraint, 25 Oct). The seed must satisfy them; checked here so a bad row stops the build.
CHECKS = {
    "coe_ledger": {"kind": {"expense", "sale"}},
    "coe_setup_check": {"status": {"Waiting", "Approved", "Fix needed"}},
    "coe_trainings": {"kind": {"mandatory", "selfstudy", "unlock", "coaching"}},
    "coe_training_sessions": {"status": {"scheduled", "done", "cancelled"}},
    "coe_training_records": {"status": {"done", "assigned", "excused", "pending", "completed", "further", "void"},
                             "via": {"live", "recording", "online", "grandfathered", "manual", "assigned", "recognized"}},
    "coe_wallet": {"kind": {"check", "remit", "out", "in", "transfer"}, "wallet": {"Alipay", "WeChat", "ChinaBank", "CCB"}},
}
# The hand-written teacher fixture uses via 'video', which the database does not allow; the app's own "watched online" path writes 'online'.
VIA_FIX = {"video": "online"}
ROWS = {}

def rows_sql(table, cols, rows, conflict="do nothing", casts=None):
    if not rows: return ""
    for r in rows:
        for c, ok in CHECKS.get(table, {}).items():
            v = r.get(c)
            if v is not None and v not in ok: raise SystemExit("check %s.%s fails for %r" % (table, c, v))
    ROWS.setdefault(table, []).extend(rows)
    casts = casts or {}
    vals = []
    nn = NOTNULL.get(table, {})
    for r in rows:
        cells = []
        for c in cols:
            v = r.get(c)
            if v is None and c in nn:
                if not nn[c]: raise SystemExit("NOT NULL column %s.%s has no value and no default: %r" % (table, c, {k: r.get(k) for k in cols[:2]}))
                cells.append("DEFAULT"); continue
            cells.append(lit(v) + (casts.get(c, "") if v is not None else ""))
        vals.append("(" + ",".join(cells) + ")")
    return "insert into %s (%s) values\n%s\non conflict %s;\n" % (table, ",".join(cols), ",\n".join(vals), conflict)

small = []
wal = first("coe-wallet", lambda b: b.get("action") == "get")
if wal:
    small.append(rows_sql("coe_wallet", ["id", "wallet", "kind", "day", "cny", "fee", "php", "note", "expected", "by_name", "created_at", "void_at", "void_by", "to_wallet"], wal["entries"]))
    small.append("select setval(pg_get_serial_sequence('coe_wallet','id'), (select max(id) from coe_wallet));\n")

con = first("coe-contract", lambda b: b.get("action") == "list")
tcon = None
for x in teach:
    if fname(x) == "coe-contract" and (body(x) or {}).get("action") == "my": tcon = resp(x)
if con:
    D = []
    for d in con["docs"]:
        e = dict(d); e["body"] = "TEST COPY · the wording of \"%s\" is not part of the test data.\n\nThis text stands in for the real document so signing can be tried end to end." % d["title"]
        e["published_at"] = "2026-10-22T00:00:00+00:00"; e["respond_days"] = 14; e["for_existing"] = True
        e["hash"] = hashlib.sha256(e["body"].encode()).hexdigest()
        D.append(e)
    small.append(rows_sql("coe_contract_docs", ["id", "kind", "ref", "version", "title", "short", "body", "sort", "needs_sign", "for_existing", "in_new_set", "published_at", "respond_days", "hash"], D))
    small.append("select setval(pg_get_serial_sequence('coe_contract_docs','id'), (select max(id) from coe_contract_docs));\n")
    SC = ["id", "teacher", "doc_id", "sent_at", "sent_by", "due_at", "opened_at", "status", "note", "note_at", "reply", "reply_at", "reply_by", "signed_at", "typed_name", "ip", "loc", "filled_hash",
          "pres_at", "pres_name", "pres_ip", "pres_loc", "scan_name", "scan_at", "paper_date", "void_at", "wit_at", "wit_name"]
    R = [dict(r) for r in con["rows"]]
    if tcon:
        kind_of = {d["id"]: d["kind"] for d in tcon["docs"]}
        by_kind = {d["kind"]: d["id"] for d in con["docs"]}
        for r in tcon["rows"]:
            e = dict(r); e["doc_id"] = by_kind.get(kind_of.get(r["doc_id"]), r["doc_id"]); e["id"] = Decimal(900000) + Decimal(r["id"])
            R.append(e)
        P = dict(tcon.get("people") or {}); P["teacher"] = "Test"; P["citizenship"] = "Filipino"; P["updated_by"] = "seed"
        small.append(rows_sql("coe_contract_people", ["teacher", "legal_name", "civil_status", "citizenship", "address", "agreement_date", "rate50", "updated_by"], [P]))
    small.append(rows_sql("coe_contract_signs", SC, R))
    small.append("select setval(pg_get_serial_sequence('coe_contract_signs','id'), (select max(id) from coe_contract_signs));\n")

for x in teach:
    if fname(x) == "coe-notice" and (body(x) or {}).get("action") == "list":
        N = (resp(x) or {}).get("notices") or []
        small.append(rows_sql("coe_notices", ["id", "teacher", "case_id", "subject", "happened", "rule", "record", "consequence", "amount", "points", "final_notice", "sent_at", "sent_by", "due_at",
                                              "opened_at", "explain", "explain_at", "conf_req", "files", "decision", "decision_text", "decided_at", "decided_by"], N))
        small.append("select setval(pg_get_serial_sequence('coe_notices','id'), (select max(id) from coe_notices));\n")

cel = first("coe-notice", lambda b: b.get("action") == "cel_list")
if cel:
    small.append(rows_sql("coe_celebrate", ["k", "kind", "code", "skipped", "at", "by"], cel["marks"]))
    small.append(rows_sql("coe_cel_books", ["code", "books"], [{"code": k, "books": "{" + ",".join('"%s"' % b.replace('"', '') for b in v) + "}"} for k, v in cel["books"].items()]))

onl = first("coe-train", lambda b: b.get("action") == "online")
if onl: small.append(rows_sql("coe_presence", ["name", "mode", "dev", "view", "v", "at", "since"], onl["rows"]))

tr = first("coe-train", lambda b: b.get("action") == "all")
ttr = None
for x in teach:
    if fname(x) == "coe-train" and (body(x) or {}).get("action") == "my": ttr = resp(x)
if tr:
    T = list(tr["trainings"]); have = {t["id"] for t in T}
    P = list(tr["parts"]); S = list(tr["sessions"]); RR = list(tr["records"]); G = list(tr["progress"]); Q = list(tr["quiz"])
    if ttr:
        T += [t for t in ttr["trainings"] if t["id"] not in have]
        P += [p for p in ttr["parts"]]
        S += ttr["sessions"]
        RR += [dict(r, id=Decimal(900000) + Decimal(r["id"]), via=VIA_FIX.get(r.get("via"), r.get("via"))) for r in ttr["records"]]
        G += ttr["progress"]; Q += ttr["quiz"]
    small.append(rows_sql("coe_trainings", ["id", "title", "kind", "gate", "sort", "descr", "units", "active", "updated_at"], T))
    small.append(rows_sql("coe_training_parts", ["id", "training_id", "sort", "title", "ver", "video_path", "dur_sec", "quiz", "approve", "active", "updated_at"], P))
    small.append(rows_sql("coe_training_sessions", ["id", "training_id", "starts_at", "mins", "facilitator", "meet_url", "invited", "recording_path", "note", "status", "created_by", "created_at"],
                          [dict(s, invited="{" + ",".join('"%s"' % i for i in (s.get("invited") or [])) + "}") for s in S]))
    small.append(rows_sql("coe_training_records", ["id", "teacher", "training_id", "status", "via", "session_id", "done_at", "note", "by_who", "created_at"], RR))
    small.append(rows_sql("coe_training_progress", ["teacher", "part_id", "ver", "seen", "pct", "secs", "views", "first_at", "last_at", "done_at", "reflection", "approved_by", "approved_at"], G))
    small.append(rows_sql("coe_training_quiz", ["teacher", "part_id", "ver", "score", "total", "passed", "answers", "at"], Q))
    for t in ("coe_training_parts", "coe_training_sessions", "coe_training_records", "coe_training_quiz"):
        small.append("select setval(pg_get_serial_sequence('%s','id'), coalesce((select max(id) from %s), 1));\n" % (t, t))

su = first("coe-mgmt", lambda b: b.get("fn") == "mgmtSetupAll")
if su: small.append(rows_sql("coe_setup_check", ["teacher", "ym", "path", "status", "note", "submitted_at", "reviewed_by", "reviewed_at"],
                             [{"teacher": r["teacher"], "ym": (r.get("path") or "2026-10")[:7], "path": r.get("path"), "status": r["status"], "note": r.get("note"), "submitted_at": r.get("at"), "reviewed_by": r.get("by"), "reviewed_at": r.get("rat")} for r in su["data"]]))
qa = first("coe-mgmt", lambda b: b.get("fn") == "mgmtQaAcks")
if qa: small.append(rows_sql("coe_qa_ack", ["teacher", "period", "sent_at", "sent_by", "seen_at", "acked_at"], qa["data"]))
bl = first("coe-mgmt", lambda b: b.get("op") == "books" and b.get("list"))
if bl: small.append(rows_sql("coe_book_map", ["code", "label"], bl["list"]))

# ── EXPENSES / SALES sheet copies (coe-expenses) and October sales in the ledger (coe-wallet) ───────────────────────
ex = first("coe-expenses", lambda b: True)
big = []
if ex:
    E = sorted(ex["rows"], key=lambda r: r["d"])   # oldest first = sheet order
    erows = [[r["d"] + "T00:00:00", r["t"], r["c"], r["a"]] for r in E]
    S = sorted(ex["sales"], key=lambda r: r["d"])
    def invname(r): return ("PaymentConfirmation%s_%s" % (r["inv"], r["t"].replace(" ", "_"))) if r.get("inv") else r["t"]
    srows = [[r["d"] + "T00:00:00", invname(r), r["pkg"], r["free"], r["src"], r["pay"], r["rmb"], r["a"]] for r in S]
    big.append(("expenses", "insert into sheet_tabs (tab, nrows, synced_at) values ('EXPENSES', " + str(len(erows) + 1) + ", now()) on conflict (tab) do update set nrows = excluded.nrows, synced_at = excluded.synced_at;\n"
                "insert into sheet_rows (tab, r, data) select 'EXPENSES', (o + 1)::int, v from jsonb_array_elements($j$" + dump(erows) + "$j$::jsonb) with ordinality as t(v, o) on conflict do nothing;\n"))
    big.append(("sales", "insert into sheet_tabs (tab, nrows, synced_at) values ('SALES', " + str(len(srows) + 2) + ", now()) on conflict (tab) do update set nrows = excluded.nrows, synced_at = excluded.synced_at;\n"
                "insert into sheet_rows (tab, r, data) select 'SALES', (o + 2)::int, v from jsonb_array_elements($j$" + dump(srows) + "$j$::jsonb) with ordinality as t(v, o) on conflict do nothing;\n"
                "insert into coe_ledger (kind, day, k, data, src, status, sheet_r) select 'sale', left(data->>0, 10)::date, coe_ledger_key('sale', data), data, 'test', 'sheet', r from sheet_rows where tab = 'SALES' and data->>0 >= '2026-10-01';\n"))

# ── tables worked out on the branch from the docs just loaded ──────────────────────────────────────────────────────
derived = r"""
-- classes: the 9 schedule days management recorded, and the Test teacher's week
insert into classes (id, day, starts_at, ends_at, code, student, teachers, cancelled, data, updated_at)
select e->>'id' || '|' || (e->>'start'), ((e->>'start')::timestamptz at time zone 'Asia/Manila')::date, (e->>'start')::timestamptz, (e->>'end')::timestamptz,
       nullif(e->>'code', ''), nullif(e->>'student', ''), t.teachers, coalesce((e->>'cancelled')::boolean, false),
       jsonb_strip_nulls(jsonb_build_object('id', e->>'id', 'start', e->>'start', 'end', e->>'end', 'title', e->>'title', 'code', e->>'code', 'student', e->>'student', 'book', e->>'book',
         'meet', e->>'meet', 'teachers', t.teachers, 'cancelled', coalesce((e->>'cancelled')::boolean, false), 'why', coalesce(e->>'why', ''), 'mv', e->'mv')), now()
from docs d, jsonb_array_elements(d.data->'events') e,
     lateral (select coalesce(jsonb_agg(lower(trim(x))) filter (where trim(x) not in ('', '—')), '[]'::jsonb) teachers from unnest(string_to_array(coalesce(e->>'teacher', ''), ',')) x) t
where d.key like 'mgmt:mgmtSchedule|%' and e ? 'id' and e ? 'start'
on conflict (id) do nothing;
insert into classes (id, day, starts_at, ends_at, code, student, teachers, cancelled, data, updated_at)
select e->>'id' || '|' || (e->>'start'), coalesce(nullif(e->>'day', '')::date, ((e->>'start')::timestamptz at time zone 'Asia/Manila')::date), (e->>'start')::timestamptz, (e->>'end')::timestamptz,
       nullif(e->>'code', ''), nullif(e->>'student', ''), '["test"]'::jsonb, coalesce((e->>'cancelled')::boolean, false),
       jsonb_strip_nulls(jsonb_build_object('id', e->>'id', 'start', e->>'start', 'end', e->>'end', 'title', e->>'title', 'code', e->>'code', 'student', e->>'student', 'book', e->>'book',
         'meet', e->>'meet', 'teachers', '["test"]'::jsonb, 'cancelled', coalesce((e->>'cancelled')::boolean, false), 'why', coalesce(e->>'why', ''), 'mv', e->'mv')), now()
from docs d, jsonb_array_elements(coalesce(d.data->'events', d.data->'schedule')) e
where (d.key like 'test:tSchedule|%' or d.key = 'test:getBootstrap|[]') and e ? 'id' and e ? 'start'
on conflict (id) do nothing;
-- coe_students: the DATABASE tab as management saw it (row number last)
insert into coe_students (code, data, sheet_r, src, created_at, updated_at)
select r->>0, (select jsonb_agg(v order by o) from jsonb_array_elements(r) with ordinality q(v, o) where o <= jsonb_array_length(r) - 1), (r->>(jsonb_array_length(r) - 1))::int, 'test', now(), now()
from docs d, jsonb_array_elements(d.data->'rows') r
where d.key = 'pres:mgmtDatabase|[]' and r->>0 ~ '^ST-\d{4}-\d{3}$';
-- T-TIMEIN copy (log_rows) from the check-ins on the recorded schedules: the day's time-in (first class) and "I'm in" per class
insert into log_rows (tab, id, ord, data, src, updated_at)
select 'T-TIMEIN', 'test-' || md5(d.key || (e->>'id')), row_number() over (order by e->>'start'),
       jsonb_build_array(substr(d.key, strpos(d.key, '["') + 2, 10) || 'T00:00:00', lower(trim(split_part(e->>'teacher', ',', 1))), '',
         substr(d.key, strpos(d.key, '["') + 2, 10) || 'T' || (e->'ci'->>'time') || ':00', substr(d.key, strpos(d.key, '["') + 2, 10) || 'T' || coalesce(e->'ci'->>'start', '') || ':00',
         coalesce(e->'ci'->'mins', '""'::jsonb), coalesce(e->'ci'->>'status', ''), '', coalesce(e->'ci'->>'decision', ''), coalesce(e->'ci'->>'device', ''), '', '', '',
         case when coalesce((e->'ci'->>'first')::boolean, false) then 'Day' else 'Class' end, coalesce(e->>'code', '') || ' · ' || (e->>'id'), '', '', '',
         case when coalesce(e->'ci'->>'out', '') <> '' then substr(d.key, strpos(d.key, '["') + 2, 10) || 'T' || (e->'ci'->>'out') || ':00' else '' end, coalesce(e->'ci'->'hours', '""'::jsonb)),
       'test', now()
from docs d, jsonb_array_elements(d.data->'events') e
where d.key like 'mgmt:mgmtSchedule|%' and jsonb_typeof(e->'ci') = 'object' and coalesce(e->'ci'->>'time', '') <> ''
on conflict do nothing;
"""

# ── write the files ─────────────────────────────────────────────────────────────────────────────────────────────────
files = []
def emit(name, sql):
    files.append(name); open(os.path.join(OUT, name), "w").write(sql)

LIMIT = 88000
order = sorted(DOCS.items(), key=lambda kv: len(dump(kv[1]["data"])))
batch, size, n = [], 0, 0
def flush():
    global batch, size, n
    if not batch: return
    n += 1
    sql = "insert into docs (key, scope, data, updated_at) values\n" + ",\n".join(
        "(%s,%s,$j$%s$j$::jsonb,now())" % (lit(k), lit(v["scope"]), dump(v["data"])) for k, v in batch) + "\non conflict (key) do update set scope = excluded.scope, data = excluded.data, updated_at = excluded.updated_at;\n"
    emit("10-docs-%02d.sql" % n, sql); batch, size = [], 0
def split_big(k, v):
    """a doc too big for one statement: insert it with the first part of its biggest list, then append the rest in pieces"""
    global n
    d = v["data"]
    if isinstance(d, list): field, L = None, d
    else:
        field = max((f for f in d if isinstance(d[f], list)), key=lambda f: len(dump(d[f])))
        L = d[field]
    chunks, cur, cs = [], [], 0
    for item in L:
        t = len(dump(item).encode()) + 1
        if cur and cs + t > LIMIT - 2000: chunks.append(cur); cur, cs = [], 0
        cur.append(item); cs += t
    if cur: chunks.append(cur)
    head = chunks[0] if field is None else dict(d, **{field: chunks[0]})
    n += 1
    emit("10-docs-%02d.sql" % n, "insert into docs (key, scope, data, updated_at) values (%s,%s,$j$%s$j$::jsonb,now())\non conflict (key) do update set scope = excluded.scope, data = excluded.data, updated_at = excluded.updated_at;\n"
         % (lit(k), lit(v["scope"]), dump(head)))
    for c in chunks[1:]:
        n += 1
        upd = ("data || $j$%s$j$::jsonb" % dump(c)) if field is None else ("jsonb_set(data, %s, (data->%s) || $j$%s$j$::jsonb)" % (lit("{" + field + "}"), lit(field), dump(c)))
        emit("10-docs-%02d.sql" % n, "update docs set data = %s where key = %s;\n" % (upd, lit(k)))
for k, v in order:
    s = len(dump(v["data"]).encode()) + len(k) + 40
    if s > LIMIT:
        flush(); split_big(k, v); continue
    if batch and size + s > LIMIT: flush()
    batch.append((k, v)); size += s
flush()
emit("20-small.sql", "".join(small))
for i, (nm, sql) in enumerate(big):
    emit("30-%s.sql" % nm, sql)
emit("40-derived.sql", derived)

man = {"docs": {k: {"scope": v["scope"], "md5": hashlib.md5(dump(v["data"], True).encode()).hexdigest(), "src": v["src"]} for k, v in DOCS.items()},
       "files": [(f, os.path.getsize(os.path.join(OUT, f))) for f in files],
       "scrub": {"ips": len(IPMAP), "drive_links": len(DRMAP), "emails": len(EMMAP), "wechat_ids": len(WXMAP)}}
# Foreign keys and unique keys on the branch: check them over the rows actually written ("on conflict do nothing" keeps the first row of a key).
def firsts(t, key):
    seen = {}
    for r in ROWS.get(t, []):
        seen.setdefault(tuple(str(r.get(k)) for k in key), r)
    return seen
def ids(t): return {k[0] for k in firsts(t, ["id"])}
FK = [("coe_training_parts", "training_id", "coe_trainings"), ("coe_training_sessions", "training_id", "coe_trainings"),
      ("coe_training_records", "training_id", "coe_trainings"), ("coe_training_records", "session_id", "coe_training_sessions"),
      ("coe_training_progress", "part_id", "coe_training_parts"), ("coe_training_quiz", "part_id", "coe_training_parts"),
      ("coe_contract_signs", "doc_id", "coe_contract_docs")]
bad = []
for t, c, rt in FK:
    have = ids(rt)
    for r in ROWS.get(t, []):
        if r.get(c) is not None and str(r.get(c)) not in have: bad.append("%s.%s=%s not in %s" % (t, c, r.get(c), rt))
for t, key in (("coe_contract_signs", ["teacher", "doc_id"]), ("coe_contract_docs", ["ref", "version"])):
    k1 = firsts(t, key); k2 = firsts(t, ["id"])
    if len(k1) != len(k2): bad.append("%s: %d rows by id but %d by %s (a later row would hit the unique key)" % (t, len(k2), len(k1), key))
if bad: raise SystemExit("seed fails database keys:\n" + "\n".join(bad[:20]))
json.dump(man, open(os.path.join(OUT, "manifest.json"), "w"), indent=1, ensure_ascii=False)
print(json.dumps({"files": man["files"], "docs": len(DOCS), "scrub": man["scrub"]}, indent=0))
