import asyncio, sys
from playwright.async_api import async_playwright
FONT='file:///home/claude/cupofenglish/fonts/card-inter-var.woff2'
CSS="""@font-face{font-family:I;src:url(%s) format('woff2');font-weight:100 900}
*{box-sizing:border-box}body{margin:0;background:#fff;font:16px/1.45 I,system-ui,sans-serif;color:#1F2937}
#s{display:inline-flex;gap:56px;align-items:center;padding:34px 40px;background:#fff}
.m{width:640px;flex:none}.lg{width:520px;display:flex;flex-direction:column;gap:26px}
.li{display:flex;gap:14px;align-items:flex-start}.li i,.n{font-style:normal;flex:none;width:34px;height:34px;border-radius:50%%;background:#00838F;color:#fff;font-weight:700;font-size:17px;display:inline-flex;align-items:center;justify-content:center}
.li.r i,.n.r{background:#D92D20}.n{width:26px;height:26px;font-size:14px;margin-left:8px;vertical-align:middle;box-shadow:0 0 0 3px #fff}
.li b{display:block;font-size:22px;line-height:1.25;color:#00707A}.li.r b{color:#D92D20}.li span{display:block;font-size:17px;color:#5B5870;margin-top:3px}
.card{border:1.5px solid #E4E2EC;border-radius:16px;background:#fff;padding:18px 20px}
.soft{background:#F7F8FA}.t{font-weight:700;color:#2F2752}.g{color:#6B6880}.sm{font-size:14px}
.btn{display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:#0F6E6B;color:#fff;font-weight:600;font-size:15px}
.btn.o{background:#fff;color:#0F6E6B;border:1.5px solid #0F6E6B}.btn.red{background:#D92D20}
.chip{display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:999px;border:1.5px solid #E4E2EC;font-size:14px;color:#2F2752;background:#fff;margin:0 6px 6px 0}
.chip.on{background:#E6F5F6;border-color:#00838F;color:#00707A;font-weight:600}
.in{border:1.5px solid #DADCE3;border-radius:10px;height:42px;padding:0 12px;display:flex;align-items:center;color:#2F2752;background:#fff}
.lab{font-size:13px;font-weight:600;color:#5B5870;margin:12px 0 5px}
.row{display:flex;align-items:center;gap:10px}.sp{flex:1}
.hl{outline:3px solid #D92D20;outline-offset:3px;border-radius:8px}
.pill{font-size:13px;font-weight:600;border-radius:999px;padding:3px 10px}
"""%FONT
def leg(items):
    return '<div class="lg">'+''.join('<div class="li%s"><i>%d</i><div><b>%s</b><span>%s</span></div></div>'%(' r' if r else '',k+1,a,b) for k,(a,b,r) in enumerate(items))+'</div>'
def n(k,r=0): return '<span class="n%s">%d</span>'%(' r' if r else '',k)
P={}
# 1 app update
P['g-update']='''<div class="m"><div class="card" style="padding:0;overflow:hidden">
<div class="row" style="padding:12px 16px;border-bottom:1.5px solid #E4E2EC"><b style="font-weight:700;font-size:19px;color:#2F2752">CupOfEnglish</b><span class="sp"></span>
<span class="btn" style="background:#2F2752">Update ready · Update app</span>%s</div>
<div style="padding:18px 16px"><div class="t" style="font-size:20px">Today</div><div class="g sm">Saturday 28 November</div>
<div class="card soft" style="margin-top:12px;height:70px"></div><div class="card soft" style="margin-top:10px;height:70px"></div></div></div>
<div class="row" style="margin-top:16px"><div class="card" style="width:250px;padding:0;overflow:hidden"><div class="row" style="padding:10px 12px;border-bottom:1.5px solid #E4E2EC"><b style="color:#2F2752">COE</b><span class="sp"></span><span class="btn" style="background:#2F2752;height:32px;font-size:14px">Update app</span></div><div style="height:60px"></div></div><span class="g sm" style="margin-left:6px">On a phone it says only Update app %s</span></div></div>'''%(n(1),n(2))+leg([('Tap Update ready','the app reloads on the newest version in a few seconds',0),('Same button on a phone','it shows only Update app',0),('Finish typing first','save an open form before you update, so nothing is lost',1)])
# 2 sign in
P['g-signin']='''<div class="m"><div class="card" style="max-width:420px;margin:0 auto;padding:26px 28px">
<div style="font-weight:700;font-size:22px;color:#2F2752;text-align:center">Sign in</div>
<div class="row" style="justify-content:center;margin:14px 0 4px"><span class="chip on">Teacher</span><span class="chip">Management</span>%s</div>
<div class="lab">Gmail</div><div class="in">teacher.lena@gmail.com</div>
<div class="lab">App password %s</div><div class="in">••••••••••</div>
<div style="margin-top:18px"><span class="btn" style="width:100%%;justify-content:center;height:44px">Sign in</span></div>
<div class="g sm" style="text-align:center;margin-top:12px">Forgot it? Message Ops. %s</div></div></div>'''%(n(1),n(2),n(3))+leg([('Choose Teacher','then type the Gmail registered with CupOfEnglish',0),('Your app password','check Caps Lock. After 6 wrong tries, wait 15 minutes',1),('Forgot it?','message Ops. Operations sets a new password and tells you privately',0)])
# 3 leave form
P['g-leave-1']='''<div class="m"><div class="card"><div class="t" style="font-size:20px">Notice of unavailability</div>
<div class="lab">Type %s</div><div><span class="chip on">Sick</span><span class="chip">Emergency</span><span class="chip">Bereavement</span><span class="chip">Vacation</span><span class="chip">Personal</span><span class="chip">Other</span></div>
<div class="row"><div style="flex:1"><div class="lab">From</div><div class="in">Mon 30 Nov</div></div><div style="flex:1"><div class="lab">To</div><div class="in">Mon 30 Nov</div></div></div>
<div class="lab">Booked lessons affected %s</div>
<div class="card soft" style="padding:10px 14px"><div class="row sm"><b style="color:#2F2752">18:00 · Lucas</b><span class="sp"></span><span class="pill" style="background:#E7F6EE;color:#1E7A55">52 h notice</span></div>
<div class="row sm" style="margin-top:8px"><b style="color:#2F2752">19:00 · Emma</b><span class="sp"></span><span class="pill" style="background:#E7F6EE;color:#1E7A55">53 h notice</span></div></div>
<div class="lab">Proof %s</div><div class="row sm"><span class="btn o" style="height:34px">Attach</span><span class="g">or</span><span style="color:#2F2752">☐ I’ll send it later</span></div></div></div>'''%(n(1),n(2,1),n(3))+leg([('Pick the type and dates','then Whole day, or Some classes with the times',0),('At least 4 hours’ notice','each booked lesson shows its hours of notice. Under 4 hours brings a service credit',1),('Add proof','the form says what to attach, or tick I’ll send it later',0)])
P['g-leave-2']='''<div class="m"><div class="t" style="font-size:20px;margin-bottom:12px">Leaves filed in a month</div>
<div class="card" style="padding:14px 18px"><div class="row"><b style="color:#2F2752;width:150px">1 leave</b><span class="pill" style="background:#E7F6EE;color:#1E7A55">within the limit</span></div></div>
<div class="card" style="padding:14px 18px;margin-top:10px;border-color:#F3C9C4"><div class="row"><b style="color:#2F2752;width:150px">2 or more</b><span class="pill" style="background:#FEF3F2;color:#B42318">over the limit · that month counts</span></div></div>
<div class="row" style="margin-top:18px;gap:10px">
<div class="card" style="flex:1;text-align:center;padding:14px"><div class="g sm">Month 1 of 3</div><b style="color:#9A6A12">Reminder</b></div>
<div class="card" style="flex:1;text-align:center;padding:14px"><div class="g sm">Month 2 of 3</div><b style="color:#C2410C">Formal warning</b></div>
<div class="card" style="flex:1;text-align:center;padding:14px;border-color:#F3C9C4"><div class="g sm">Month 3 of 3</div><b style="color:#B42318">Suspension</b><div class="g" style="font-size:12px">up to 30 days</div></div></div></div>'''+leg([('Every request counts','approved, declined or waiting. Only one you cancel yourself does not',1),('More than 1 in a month','is over the limit for that month',1),('No booked lessons?','no leave needed: close those hours in My open times',0)])
# 5 time-in timeline
def tl():
    return '''<div class="m"><div class="t" style="font-size:20px">Your first class at 18:00</div>
<div style="position:relative;height:120px;margin-top:20px">
<div style="position:absolute;left:0;right:0;top:46px;height:6px;border-radius:3px;background:#E4E2EC"></div>
<div style="position:absolute;left:4%%;width:26%%;top:46px;height:6px;background:#1E9E62;border-radius:3px"></div>
<div style="position:absolute;left:30%%;width:53%%;top:46px;height:6px;background:#E8A33A"></div>
<div style="position:absolute;left:4%%;top:10px;transform:translateX(-50%%);text-align:center" class="sm"><b style="color:#2F2752">17:20</b></div>
<div style="position:absolute;left:30%%;top:10px;transform:translateX(-50%%)" class="sm"><b style="color:#2F2752">17:30</b></div>
<div style="position:absolute;left:83%%;top:10px;transform:translateX(-50%%)" class="sm"><b style="color:#D92D20">18:00</b></div>
<div style="position:absolute;left:4%%;top:64px;transform:translateX(-50%%);width:110px;text-align:center" class="sm g">Time-in opens %s</div>
<div style="position:absolute;left:30%%;top:64px;transform:translateX(-50%%);width:110px;text-align:center" class="sm g">last on-time %s</div>
<div style="position:absolute;left:83%%;top:64px;transform:translateX(-50%%);width:120px;text-align:center" class="sm g">class starts</div></div>
<div class="card soft" style="margin-top:6px"><div class="row"><b style="color:#2F2752">18:00 · Lucas</b><span class="sp"></span><span class="btn">I’m in</span>%s</div><div class="g sm" style="margin-top:6px">Opens 17:55 · on time until 18:00</div></div></div>'''%(n(1),n(2,1),n(3,1))
P['g-timein-1']=tl()+leg([('Time-in opens 40 minutes before','open the app in Chrome or Edge on your class laptop',0),('On time until 30 minutes before','tap Time in, then Share entire screen · Time in',1),('I’m in for each class','opens 5 minutes before, on time until the class starts. No grace period',1)])
P['g-timein-2']='''<div class="m"><div class="card" style="padding:0;overflow:hidden;background:#1F2433">
<div style="padding:14px;display:flex;gap:10px"><div style="flex:2;height:190px;border-radius:10px;background:#3A4157;display:flex;align-items:center;justify-content:center;color:#C9CEDC;font-weight:600">VooV · you and your student %s</div>
<div style="flex:1;height:190px;border-radius:10px;background:#2E3447"></div></div>
<div class="row" style="background:#11141D;padding:8px 14px;color:#E6E8EF;font-size:14px"><span>⊞</span><span class="sp"></span>
<span style="border:1.5px solid #9AA3B8;border-radius:4px;padding:0 6px;font-size:12px">LAN</span>%s<span style="margin-left:14px;text-align:right;line-height:1.2">17:24<br><span style="font-size:12px">28/11/2026</span></span>%s</div></div></div>'''%(n(1),n(2,1),n(3))+leg([('Your VooV class with your student','shared on the laptop you teach on',0),('LAN cable, not Wi-Fi','turn Wi-Fi off during class',1),('Full date and time','Windows: bottom right · Mac: top right. Allow your location',0)])
# 7 notices
P['g-notices']='''<div class="m"><div class="row" style="align-items:flex-start;gap:16px">
<div class="card" style="width:240px;padding:10px"><div class="sm g" style="padding:6px 8px">Today</div><div class="sm g" style="padding:6px 8px">Schedule</div>
<div class="row sm" style="padding:6px 8px;background:#E6F5F6;border-radius:8px;color:#00707A;font-weight:600">Notices &amp; requests<span class="sp"></span><span class="pill" style="background:#D92D20;color:#fff">2</span></div>%s<div class="sm g" style="padding:6px 8px">Pay</div></div>
<div class="card" style="flex:1"><div class="g sm">Official memo · CoE Memo 00-2026</div><div class="t" style="font-size:18px;margin:4px 0 8px">Sample notice title</div>
<div style="height:10px;background:#EEF0F4;border-radius:5px;margin:6px 0"></div><div style="height:10px;background:#EEF0F4;border-radius:5px;width:80%%"></div>
<div class="row" style="margin-top:16px"><span class="btn">Got it</span>%s<span class="btn o" style="margin-left:6px">Reply</span>%s</div></div></div></div>'''%(n(1,1),n(2,1),n(3))+leg([('Notices &amp; requests','the red number shows what you have not read yet',1),('Tap Got it','management sees who read each notice and who tapped Got it',1),('Reply if it asks','for a new question, tap New message',0)])
# 8 video checks
def vrow(t,c,bg,txt,btn=''):
    return '<div class="row" style="padding:12px 0;border-top:1.5px solid #EEF0F4"><div><b style="color:#2F2752">%s</b><div class="g sm">%s</div></div><span class="sp"></span><span class="pill" style="background:%s;color:%s">%s</span>%s</div>'%(t[0],t[1],bg,c,txt,btn)
P['g-vcheck']='<div class="m"><div class="card"><div class="t" style="font-size:20px;margin-bottom:6px">Video checks</div>'+vrow(('Lucas · 27 Nov 18:00','Video shorter than the class'),'#9A6A12','#FDF3E1','Explain this video','<span class="btn" style="margin-left:10px;height:34px">Explain</span>'+n(1,1))+vrow(('Emma · 26 Nov 19:00','Screen proof instead of a video'),'#9A6A12','#FDF3E1','Waiting for review')+vrow(('Lucas · 25 Nov 18:00','Recorded before the class'),'#1E7A55','#E7F6EE','Reviewed · OK',n(2))+'</div></div>'+leg([('Tap Explain','choose the reason and write what happened. You can change it until it is reviewed',1),('Management reviews it','Reviewed · OK, or Needs action: management will contact you',0),('It never blocks your upload','it only asks you to explain',0)])
# 9 class notes
P['g-notes']='''<div class="m"><div class="card" style="padding:0;overflow:hidden"><div class="row" style="padding:16px 20px;border-bottom:1.5px solid #E4E2EC">
<b style="font-weight:700;font-size:18px;color:#2F2752">CupOfEnglish</b><span class="sp"></span><div style="text-align:right"><b style="color:#2F2752;font-size:18px">Class Notes / 课堂笔记</b>
<div class="g sm">Teacher / 老师: Lena · 28 Nov 2026</div><div class="sm"><span class="hl" style="padding:1px 6px;color:#2F2752;font-weight:600">For / 学生: Lucas</span>%s</div></div></div>
<div style="height:170px;background:repeating-linear-gradient(#fff 0 34px,#EEF0F4 34px 36px)"></div></div>
<div class="card soft" style="margin-top:12px;padding:12px 16px"><div class="row"><b style="color:#2F2752">18:00 · Lucas</b><span class="sp"></span><span class="btn o" style="height:34px">Book page</span>%s</div></div></div>'''%(n(1,1),n(2))+leg([('Check For / 学生','it must be the student in front of you',1),('Open the book from this class','the class card, or the student’s Course book card',0),('Wrong or empty name?','close the book and open it again from the right class card',0)])
# 10 contract
P['g-contract']='''<div class="m"><div class="row" style="align-items:flex-start;gap:14px"><div class="card" style="flex:1"><div class="t" style="font-size:18px;margin-bottom:8px">Your documents</div>
<div class="row sm" style="padding:8px 0;border-top:1.5px solid #EEF0F4"><span style="color:#2F2752">Agreement</span><span class="sp"></span><span class="pill" style="background:#E7F6EE;color:#1E7A55">Signed</span></div>
<div class="row sm" style="padding:8px 0;border-top:1.5px solid #EEF0F4"><span style="color:#2F2752">Annex A</span><span class="sp"></span><span class="pill" style="background:#E7F6EE;color:#1E7A55">Signed</span></div>
<div class="row sm" style="padding:8px 0;border-top:1.5px solid #EEF0F4"><span style="color:#2F2752">Addendum</span><span class="sp"></span><span class="pill" style="background:#FDF3E1;color:#9A6A12">To sign</span>%s</div></div>
<div class="card" style="flex:1.2"><div class="lab" style="margin-top:0">Full name</div><div class="in">Lena Sample</div><div class="lab">Signature</div>
<div class="in" style="height:80px;font:italic 30px Georgia,serif;color:#2F2752">L. Sample</div><div class="row" style="margin-top:12px"><span class="btn">Sign</span>%s<span class="sp"></span><span class="g sm">Print or save as PDF</span>%s</div></div></div></div>'''%(n(1),n(2,1),n(3))+leg([('Open what is To sign','read it to the end',0),('Type your name, draw, tap Sign','respond within 14 days: sign, or tap I have a question',1),('Keep your copy','Print or save as PDF. The notarized copy is added here too',0)])
# 11 monthly
P['g-monthly']='''<div class="m"><div class="card"><div class="t" style="font-size:20px;margin-bottom:6px">Needs your action</div>
<div class="row" style="padding:12px 0;border-top:1.5px solid #EEF0F4"><div><b style="color:#2F2752">Monthly feedback · Lucas</b><div class="g sm">Students › Feedback due</div></div><span class="sp"></span><span class="btn" style="height:34px">Open</span>%s</div>
<div class="row" style="padding:12px 0;border-top:1.5px solid #EEF0F4"><div><b style="color:#2F2752">Peer review · a colleague’s class</b><div class="g sm">Growth › Peer feedback</div></div><span class="sp"></span><span class="btn" style="height:34px">Open</span>%s</div>
<div class="row" style="padding:12px 0;border-top:1.5px solid #EEF0F4"><div><b style="color:#2F2752">Your QA feedback is ready</b><div class="g sm">I have read and understood my feedback</div></div><span class="sp"></span><span class="btn o" style="height:34px">Read</span>%s</div></div></div>'''%(n(1),n(2),n(3))+leg([('Monthly feedback','open the student, fill in the form and send it',0),('Peer reviews','watch the class, then fill in and send the form',0),('Your own feedback','read it, then tap I have read and understood',0)])
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        p=await b.new_page(viewport={'width':1400,'height':900},device_scale_factor=2)
        for k,h in P.items():
            if len(sys.argv)>1 and k not in sys.argv[1:]: continue
            await p.set_content('<style>'+CSS+'</style><div id="s">'+h+'</div>'); await p.wait_for_timeout(300)
            await p.locator('#s').screenshot(path='/home/claude/guidepics/%s.png'%k)
        await b.close()
asyncio.run(main())
