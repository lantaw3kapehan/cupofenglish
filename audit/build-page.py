#!/usr/bin/env python3
"""Builds the review page (audit/site/index.html) from register.json, out/*.json and the screenshots."""
import json, os, html, shutil
A = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(A, 'site'); os.makedirs(os.path.join(S, 'img'), exist_ok=True)
reg = json.load(open(os.path.join(A, 'register.json')))
def load(t):
    p = os.path.join(A, 'out', t + '.json')
    return json.load(open(p)) if os.path.exists(p) else {}
B1, B3, A1, A3 = load('before-1280'), load('before-390'), load('after-1280'), load('after-390')
NAMES = {'home': 'Overview', 'monitor': 'Monitor', 'team': 'Monitor › Time-ins', 'mtoday': 'To do', 'schedule': 'Schedule', 'msgs': 'Messages',
 'astudents': 'Students', 'reports': 'Students › Parent reports', 'db': 'Students › Database sheet', 'active': 'Packages (Active)',
 'trials': 'Trials', 'enquiry': 'Trials › Enquiries', 'teachers': 'Teachers', 'perf': 'Teachers › Performance', 'train': 'Teachers › Trainings',
 'leave': 'Teachers › Leave', 'actions': 'Teachers › Cases', 'contract': 'Contracts (teacher view)', 'finov': 'Finance › Overview', 'payroll': 'Finance › Payroll',
 'expenses': 'Finance › Transactions', 'money': 'Finance › Sales & costs', 'wallets': 'Finance › Wallets', 'books': 'Books', 'more': 'More screens (phone)', 'act': 'Activity log'}
PAIRS = ['finov', 'payroll', 'expenses', 'money', 'wallets', 'home', 'mtoday', 'schedule', 'team', 'leave', 'perf', 'train', 'reports', 'enquiry', 'astudents']
def cp(tag, v):
    src = os.path.join(A, 'shots', f'{tag}-{v}.png')
    if not os.path.exists(src): return None
    dst = f'img/{tag}-{v}.png'; shutil.copy(src, os.path.join(S, dst)); return dst
def st(r, role_blocked=None):
    if role_blocked: return ('blk', role_blocked)
    if not r: return ('nt', 'Not tested')
    if r.get('errs'): return ('fail', 'Fail · script error')
    if r.get('nodata') or r.get('len', 0) < 100: return ('blk', 'Blocked · no sample data')
    if r.get('hscroll'): return ('fail', 'Fail · page scrolls sideways')
    return ('pass', 'Pass')
e = html.escape
rows = []
for v in sorted(set(list(A1.keys()) + list(B1.keys())), key=lambda v: list(NAMES).index(v) if v in NAMES else 99):
    if v not in NAMES: continue
    c1, c2 = st(A1.get(v)), st(A3.get(v))
    tch = ('blk', 'Blocked · no teacher sample data') if v not in ('contract', 'books', 'act', 'train') else ('nt', 'Not tested')
    rows.append(f'<tr><th scope="row">{e(NAMES[v])}</th>' + ''.join(f'<td><span class="pill {k}">{e(t)}</span></td>' for k, t in [c1, c2, ('nt', 'Not tested'), tch]) + '</tr>')
cards = []
for x in reg:
    k = 'ok' if x['status'].startswith('Fixed') else ('info' if x['status'].startswith('Explained') else 'nt')
    q = f'<p class="q"><b>Question for you:</b> {e(x["q"])}</p>' if x.get('q') else ''
    cards.append(f'''<details class="iss" id="f{x['id']}"><summary><span class="num">#{x['id']}</span><span class="t">{e(x['title'])}</span><span class="pill {k}">{e(x['status'])}</span></summary>
<dl><dt>Reproduced</dt><dd>{e(x['repro'])}</dd><dt>What changed</dt><dd>{e(x['what'])}</dd><dt>Not changed</dt><dd>{e(x['not'])}</dd><dt>Change files</dt><dd>{e(x['patch'])}</dd></dl>{q}</details>''')
shots = []
for v in PAIRS:
    b, a = cp('before-1280', v), cp('after-1280', v)
    if not a: continue
    shots.append(f'''<figure class="pair"><figcaption>{e(NAMES.get(v, v))}</figcaption><div class="two">
<div><span class="lab">Before</span>{f'<img loading="lazy" src="{b}" alt="Before: {e(NAMES.get(v, v))}">' if b else '<div class="none">New screen</div>'}</div>
<div><span class="lab after">After</span><img loading="lazy" src="{a}" alt="After: {e(NAMES.get(v, v))}"></div></div></figure>''')
phone = []
for v in ['finov', 'payroll', 'expenses', 'home', 'mtoday', 'team']:
    b, a = cp('before-390', v), cp('after-390', v)
    if a: phone.append(f'<figure class="ph"><figcaption>{e(NAMES.get(v, v))}</figcaption><div class="two">{f"<img loading=lazy src={b} alt=Before>" if b else ""}<img loading="lazy" src="{a}" alt="After"></div></figure>')
tpl = open(os.path.join(A, 'page-template.html')).read()
out = tpl.replace('{{ISSUES}}', '\n'.join(cards)).replace('{{ROWS}}', '\n'.join(rows)).replace('{{SHOTS}}', '\n'.join(shots)).replace('{{PHONE}}', '\n'.join(phone))
open(os.path.join(S, 'index.html'), 'w').write(out)
print('ok', len(cards), 'issues', len(rows), 'rows', len(shots), 'pairs')
