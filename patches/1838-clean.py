import re,sys
CJK=re.compile('[一-鿿]')
CJKP=set('。！？，：；、）」』…')
EMO='[\U0001F000-\U0001FAFF☀-☄☇-✒✖-➿⬀-⯿ℹ⌚-⏿〰〽㊗㊙][️\U0001F3FB-\U0001F3FF‍]*'
RX=re.compile('[ \t]*(?:'+EMO+'[ \t]*)+')
def rep(s,m,src):
    a,b=m.start(),m.end()
    p=s[a-1] if a>0 else ''
    # line start
    i=a; 
    while i>0:
        if s[i-1] in '\n' or (src and s[i-1] in '\'"`') or (src and s[i-2:i]=='\\n'): break
        i-=1
    line=s[i:a]
    rest=s[b:b+2]
    eol = (b>=len(s)) or rest[:1]=='\n' or (src and (rest[:1] in '\'"`' or rest=='\\n'))
    n=s[b] if b<len(s) else ''
    if line.strip()=='' : return ''          # emoji at line start
    if eol:
        if p in CJKP or p in '.!?:' : return ''
        if CJK.match(p or ' ') and len(line)>12: return '。'
        if not CJK.search(line) and len(line)>25 and re.match(r'[A-Za-z0-9)]',p or ''): return '.'
        return ''
    if CJK.match(p) or CJK.match(n) or p in CJKP:
        if p in CJKP: return ''
        if CJK.match(p) and CJK.match(n): return '，'
        return ' '
    if p in '.!?:,;': return ' '
    if re.match(r'[A-Za-z0-9)}]',p) and re.match(r'[A-Z]',n): return '. '
    if n in '.,!?:;': return ''
    return ' '
def clean(s,src=False):
    return RX.sub(lambda m: rep(s,m,src), s)
import re,sys

f=sys.argv[1]; s=open(f).read()
fix=[("weekly open times 👇${sug ? ` For you","weekly open times, shown in the picture.${sug ? ` For you"),
     ("weekly open times 👇${sug ? ` For ${kid}","weekly open times, shown in the picture.${sug ? ` For ${kid}"),
     ("每周可预约的上课时间👇${sug ?","每周可预约的上课时间（见图）。${sug ?"),
     ("Hello! Welcome to CupOfEnglish 🎉 ' + who","Hello! Welcome to CupOfEnglish. ' + who"),
     ("您好！欢迎加入一杯英语🎉 ' + whz","您好！欢迎加入一杯英语，' + whz"),
     ("'Hello! Great news 🎉 ' + who","'Hello! Great news: ' + who"),
     ("您好！好消息🎉 ' + whz","您好！好消息，' + whz")]
for a,b in fix:
    c=s.count(a); print('fix',c,a[:30]); s=s.replace(a,b)
out=[];last=0;changes=[]
for m in RX.finditer(s):
    ctx=s[max(0,m.start()-120):m.end()+120]
    if not CJK.search(ctx): continue
    pre=s[max(0,m.start()-60):m.start()]
    if re.search(r'(test\(|RegExp|replace\(/|match\(/|/\[)',pre): continue
    r=rep(s,m,True)
    changes.append((m.start(),m.group(),r,s[max(0,m.start()-40):m.start()],s[m.end():m.end()+25]))
    out.append(s[last:m.start()]); out.append(r); last=m.end()
out.append(s[last:]); s2=''.join(out)
open(f,'w').write(s2)

print(len(changes))
