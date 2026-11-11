#!/usr/bin/env python3
"""Builds the live-preview artifact from the real Next.js prerender output (run `npm run build` first)."""
import re, glob, os
ROOT = '/home/user/Shabahang-Studio'
APP = f'{ROOT}/.next/server/app'
OUT = os.environ.get('PREVIEW_OUT', '/tmp/shabahang-preview.html')

pages = {}
for lang in ('fa', 'en'):
    pages[lang] = f'{APP}/{lang}.html'
    for sub in ('services', 'about', 'contact', 'login', 'panel'):
        pages[f'{lang}-{sub}'] = f'{APP}/{lang}/{sub}.html'
    for sv in ('brand', 'web', 'growth', 'it', 'product'):
        pages[f'{lang}-services-{sv}'] = f'{APP}/{lang}/services/{sv}.html'

css_href = re.search(r'<link rel="stylesheet" href="([^"]+\.css)"', open(pages['fa']).read()).group(1)
css = open(f'{ROOT}/.next/static/' + css_href.split('/_next/static/')[1]).read()
css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)  # next/font files are not reachable here; Google Fonts is linked instead

SKY = re.compile(r'<div class="pointer-events-none fixed inset-0 -z-10 sky-bg".*?(?:<span class="meteor"[^>]*></span>)+</div>', re.S)
PROG = re.compile(r'<div class="scroll-progress"[^>]*></div>')
def view(key, path):
    html = open(path).read()
    body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
    body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
    body = SKY.sub('', body, count=1)
    body = PROG.sub('', body, count=1)
    body = body.replace('<div hidden=""><!--$--><!--/$--></div>', '')
    lang = key.split('-')[0]
    def link(m):
        h = m.group(1)
        if h.startswith(('http', 'tel:', 'mailto:')): return m.group(0)
        if h.startswith('#'): return f'href="#{key}-{h[1:]}"'
        h2 = h.lstrip('/').replace('/', '-').replace('#', '-')
        return f'href="#{h2}"'
    body = re.sub(r'href="([^"]*)"', link, body)
    return f'<div class="view" id="v-{key}" data-lang="{lang}" hidden>{body}</div>'

views = '\n'.join(view(k, p) for k, p in pages.items())
import base64  # clients-embed: images are blocked from other hosts, so inline them
def _emb(m):
    f = f'{ROOT}/public/clients/{m.group(1)}'
    return 'src="data:image/' + ('png' if f.endswith('.png') else 'svg+xml') + ';base64,' + base64.b64encode(open(f,'rb').read()).decode() + '"'
views = re.sub(r'src="/clients/([a-z]+\.(?:svg|png))"', _emb, views)
titles = {}
for k, p in pages.items():
    titles[k] = re.search(r'<title>(.*?)</title>', open(p).read()).group(1)

import json, subprocess
engine = subprocess.check_output(['node','-e',"const ts=require('/home/user/Shabahang-Studio/node_modules/typescript');const fs=require('fs');process.stdout.write(ts.transpileModule(fs.readFileSync('/home/user/Shabahang-Studio/src/lib/starfield.ts','utf8'),{compilerOptions:{module:'ESNext',target:'ES2019'}}).outputText)"]).decode().replace('export function','function')
reveal = subprocess.check_output(['node','-e',"const ts=require('/home/user/Shabahang-Studio/node_modules/typescript');const fs=require('fs');process.stdout.write(ts.transpileModule(fs.readFileSync('/home/user/Shabahang-Studio/src/lib/reveal.ts','utf8'),{compilerOptions:{module:'ESNext',target:'ES2019'}}).outputText)"]).decode().replace('export function','function')
progress = subprocess.check_output(['node','-e',"const ts=require('/home/user/Shabahang-Studio/node_modules/typescript');const fs=require('fs');process.stdout.write(ts.transpileModule(fs.readFileSync('/home/user/Shabahang-Studio/src/lib/progress.ts','utf8'),{compilerOptions:{module:'ESNext',target:'ES2019'}}).outputText)"]).decode().replace('export function','function')
def _ts(path):
    return subprocess.check_output(['node','-e',"const ts=require('/home/user/Shabahang-Studio/node_modules/typescript');const fs=require('fs');process.stdout.write(ts.transpileModule(fs.readFileSync(process.argv[1],'utf8'),{compilerOptions:{module:'ESNext',target:'ES2019'}}).outputText)",path]).decode()
def _strip(js):
    js = re.sub(r'^import .*$', '', js, flags=re.M)
    return re.sub(r'^export ', '', js, flags=re.M)
SERVICES_JSON = subprocess.check_output(['node','-e',"const ts=require('/home/user/Shabahang-Studio/node_modules/typescript');const fs=require('fs');const js=ts.transpileModule(fs.readFileSync('/home/user/Shabahang-Studio/src/data/services.ts','utf8'),{compilerOptions:{module:'CommonJS',target:'ES2019'}}).outputText;const m={exports:{}};new Function('module','exports','require',js)(m,m.exports,()=>({}));process.stdout.write(JSON.stringify(m.exports.PILLARS.filter(p=>p.enabled).map(p=>({id:p.id,name:p.name.fa,line:p.line.fa}))))"]).decode()
PANEL_JS = 'var PANEL=(function(){\n' + _strip(_ts(f'{ROOT}/src/lib/panel/demo.ts')) + '\n' + _strip(_ts(f'{ROOT}/src/lib/panel/jalali.ts')) + '\n' + _strip(_ts(f'{ROOT}/src/lib/panel/invoices.ts')) + '\n' + _strip(_ts(f'{ROOT}/src/lib/panel/panel.ts')) + '\nreturn {mountInvoices:mountInvoices,mountPanel:mountPanel,demoLogin:demoLogin,saveSession:saveSession,readSession:readSession,clearSession:clearSession};\n})();\nvar SERVICES=' + SERVICES_JSON + ';\n'
ENH_JS = _strip(_ts(f'{ROOT}/src/lib/enhance.ts'))
PKG_JSON = subprocess.check_output(['node','-e',"const ts=require('/home/user/Shabahang-Studio/node_modules/typescript');const fs=require('fs');const js=ts.transpileModule(fs.readFileSync('/home/user/Shabahang-Studio/src/data/packages.ts','utf8'),{compilerOptions:{module:'CommonJS',target:'ES2019'}}).outputText;const m={exports:{}};new Function('module','exports',js)(m,m.exports);process.stdout.write(JSON.stringify(m.exports.INSTAGRAM_PACKAGES))"]).decode()
page = f'''<title>Shabahang Studio Preview</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600&family=Vazirmatn:wght@300;400;700;900&display=swap">
<style>
{css}
html[lang]{{--font-vazir:'Vazirmatn',system-ui,sans-serif;--font-sora:'Sora',system-ui,sans-serif;}}
.view[hidden]{{display:none!important}}
.view{{position:relative;z-index:1;display:flex;flex-direction:column;min-height:100svh}}
.view>main{{flex:1 0 auto}}
.sky-bg{{z-index:0!important}}
body{{background:var(--midnight)!important}}
#pv-bar{{position:fixed;bottom:max(12px,env(safe-area-inset-bottom,0px));inset-inline-start:12px;z-index:50;font:11px/1.4 system-ui,sans-serif;color:#A9A7BD;background:rgba(7,9,26,.8);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:6px 12px;backdrop-filter:blur(8px)}}
</style>

<div class="scroll-progress" aria-hidden="true"></div>
<div class="pointer-events-none fixed inset-0 -z-10 sky-bg" aria-hidden="true">
  <div class="nebula-a absolute -top-1/4 start-[-10%] h-[70vmax] w-[70vmax] rounded-full opacity-30 blur-3xl" style="background:radial-gradient(circle, rgba(123,108,246,.45), transparent 65%)"></div>
  <div class="nebula-b absolute -bottom-1/3 end-[-15%] h-[60vmax] w-[60vmax] rounded-full opacity-25 blur-3xl" style="background:radial-gradient(circle, rgba(232,140,90,.5), transparent 65%)"></div>
  <canvas id="sky-canvas" class="absolute inset-0"></canvas>
  <span class="meteor" style="--t:8%;--l:18%;--dur:17s;--delay:4s;--len:140px"></span><span class="meteor" style="--t:22%;--l:52%;--dur:23s;--delay:11s;--len:110px"></span><span class="meteor" style="--t:5%;--l:74%;--dur:29s;--delay:19s;--len:150px"></span>
</div>
{views}
<div id="pv-bar" dir="ltr">Static preview of the live build</div>

<script>
{engine}
{reveal}
{progress}
__PANEL_JS__
{ENH_JS}
initProgress(document.querySelector('.scroll-progress'));
</script>
<script>
(function(){{
  var TITLES={json.dumps(titles, ensure_ascii=False)};
  var MSG={{fa:{{need:"نام و راه تماس را وارد کنید.",ok:"برنامه‌ی ایمیل شما باز شد. پیام را ارسال کنید تا به دست ما برسد."}},en:{{need:"Enter your name and how to reach you.",ok:"Your mail app opened. Send the message to get it to us."}}}};
  var LG={{fa:{{tl:['ورود به حساب','شناسه و رمز عبور خود را وارد کنید.'],ts:['ساخت حساب','اطلاعات زیر را کامل کنید.'],forgotHelp:'بازنشانی رمز را مدیر شباهنگ انجام می‌دهد. از صفحه‌ی تماس درخواست دهید.',req:'شناسه و رمز عبور را وارد کنید.',inv:'شناسه یا رمز عبور درست نیست.',no:'سامانه‌ی ورود هنوز فعال نیست. به‌زودی با همین شناسه و رمز وارد می‌شوید.',all:'همه‌ی فیلدها را کامل کنید.',bad:'شناسه فقط می‌تواند حروف انگلیسی، عدد، نقطه و خط زیر داشته باشد.',short:'رمز عبور باید حداقل ۸ نویسه باشد.',mis:'رمز عبور و تکرار آن یکسان نیستند.',sno:'ساخت حساب هنوز فعال نیست. به‌زودی با همین اطلاعات حساب می‌سازید.',sl:'قدرت رمز',lv:['ضعیف','متوسط','قوی']}},en:{{tl:['Sign in to your account','Enter your ID and password.'],ts:['Create your account','Fill in the details below.'],forgotHelp:'A Shabahang admin resets passwords. Request it from the contact page.',req:'Enter your ID and password.',inv:'The ID or password is not correct.',no:'Sign-in is not live yet. Soon you will sign in with this same ID and password.',all:'Fill in every field.',bad:'The ID can only contain English letters, digits, dot and underscore.',short:'The password must be at least 8 characters.',mis:'The password and its repeat do not match.',sno:'Account creation is not live yet. Soon you will create your account with these details.',sl:'Password strength',lv:['Weak','Fair','Strong']}}}};
  function switchTab(v,k){{
    var lg=v.querySelector('#login-form'),su=v.querySelector('#signup-form');if(!lg||!su)return;
    lg.hidden=k!=='login';su.hidden=k!=='signup';
    v.querySelectorAll('[role=tab]').forEach(function(t){{var on=t.dataset.tab===k;t.setAttribute('aria-selected',on);t.classList.toggle('bg-gold',on);t.classList.toggle('text-midnight',on);t.classList.toggle('text-muted',!on)}});
    var L=LG[v.dataset.lang],h=v.querySelector('h1'),tx=k==='login'?L.tl:L.ts;h.textContent=tx[0];h.nextElementSibling.textContent=tx[1];
    v.querySelectorAll('[role=status]').forEach(function(x){{x.innerHTML=''}});
  }}
  function score(p){{var n=0;if(p.length>=8)n++;if(p.length>=12)n++;if(/[a-zA-Z\u0600-\u06FF]/.test(p)&&/\d/.test(p))n++;if(/[^A-Za-z0-9\u0600-\u06FF]/.test(p)||(/[a-z]/.test(p)&&/[A-Z]/.test(p)))n++;return n}}
  document.addEventListener('input',function(e){{
    if(e.target.id!=='su-password')return;
    var v=e.target.closest('.view'),L=LG[v.dataset.lang],p=e.target.value,sc=score(p),lvl=p.length===0?-1:sc<=1?0:sc<=3?1:2;
    var box=e.target.closest('form').querySelector('[aria-live=polite]'),segs=box.querySelectorAll('[aria-hidden=true] > span'),cls=['bg-amber','bg-gold','bg-emerald-400'];
    segs.forEach(function(sg,i){{sg.className='h-1.5 flex-1 rounded-full transition-colors duration-300 '+(i<=lvl?cls[lvl]:'bg-white/10')}});
    box.querySelector('p').innerHTML=lvl>=0?L.sl+': <span class="font-bold text-text">'+L.lv[lvl]+'</span>':'';
  }});
  var views=[].slice.call(document.querySelectorAll('.view'));
  function show(){{
    var h=(location.hash||'#fa').slice(1),anchor=null,key=h;
    while(key&&!document.getElementById('v-'+key)){{var i=key.lastIndexOf('-');if(i<0){{key='';break}}anchor=key.slice(i+1)+(anchor?'-'+anchor:'');key=key.slice(0,i)}}
    if(!key){{key='fa';anchor=null}}
    var v=document.getElementById('v-'+key);
    views.forEach(function(x){{x.hidden=x!==v}});
    var lang=v.dataset.lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr';
    document.title=TITLES[key]||document.title;
    var t=anchor&&v.querySelector('#'+anchor);
    if(t)t.scrollIntoView();else window.scrollTo(0,0);
    if(key==='fa-panel'||key==='en-panel'){{var ses0=PANEL.readSession();if(!ses0){{location.hash='#fa-login';return}}if(window.__panelStop)window.__panelStop();window.__panelStop=PANEL.mountPanel(v.querySelector('[data-panel-root]'),{{session:ses0,services:SERVICES,siteHref:'#fa',mountInvoices:PANEL.mountInvoices,onLogout:function(){{PANEL.clearSession();location.hash='#fa-login'}}}})}}
    var hl=v.querySelector('header a[href$="-login"],header a[href$="-panel"]');if(hl){{var sx=PANEL.readSession(),fa=v.dataset.lang==='fa';hl.setAttribute('href','#'+v.dataset.lang+(sx?'-panel':'-login'));var sp=hl.querySelector('span');if(sp)sp.textContent=sx?(fa?'پنل کاربری':'My panel'):(fa?'ورود':'Sign in');hl.classList.toggle('font-bold',!!sx);hl.classList.toggle('text-gold',!!sx);hl.classList.toggle('text-muted',!sx)}}
    if(window.__stopEnh)window.__stopEnh();window.__stopEnh=initEnhance(v);if(window.__stopReveal)window.__stopReveal();setTimeout(function(){{window.__stopReveal=initReveal(v)}},80);
  }}
  addEventListener('hashchange',show);show();
  document.addEventListener('submit',function(e){{
    var f=e.target;if(!f.matches('form'))return;e.preventDefault();
    if(f.id==='login-form'||f.id==='signup-form'){{
      var Lg=LG[f.closest('.view').dataset.lang],st=f.querySelector('[role=status]'),say=function(t,ok){{st.innerHTML='<p class="'+(ok?'text-muted':'text-amber')+'">'+t+'</p>'}};
      if(f.id==='login-form'){{var idv=f.elements.username.value.trim(),pwv=f.elements.password.value;if(!idv||!pwv){{say(Lg.req,false);return}}var ses=PANEL.demoLogin(idv,pwv);if(ses){{PANEL.saveSession(ses);location.hash='#fa-panel';return}}say(Lg.inv,false);return}}
      var nm=f.elements.name.value.trim(),id=f.elements.username.value.trim(),pw=f.elements.password.value,cf=f.elements.confirm.value;
      if(!nm||!id||!pw||!cf)return say(Lg.all);
      if(!/^[A-Za-z0-9._]{{3,32}}$/.test(id))return say(Lg.bad);
      if(pw.length<8)return say(Lg.short);
      if(pw!==cf)return say(Lg.mis);
      say(Lg.sno,true);return;
    }}
    var lang=f.closest('.view').dataset.lang,m=MSG[lang],live=f.querySelector('[aria-live]');
    var n=f.elements.name.value.trim(),r=f.elements.reach.value.trim();
    if(!n||!r){{live.innerHTML='<p class="text-amber">'+m.need+'</p>';return;}}
    live.innerHTML='<p class="text-muted">'+m.ok+'</p>';
    var body=n+'\\n'+r+'\\n'+f.elements.service.value+'\\n\\n'+f.elements.message.value;
    var a=document.createElement('a');a.href='mailto:Amirhosseinshariatt@gmail.com?subject='+encodeURIComponent(n)+'&body='+encodeURIComponent(body);a.click();
  }});
  var PKG={PKG_JSON};
  function r2(n){{return Math.round(n*100)/100}}
  document.addEventListener('click',function(e){{
    var tg=e.target.closest('[data-toggle-pw]');
    if(tg){{var fm=tg.closest('form'),open=fm.elements.password.type==='password';['password','confirm'].forEach(function(n){{if(fm.elements[n])fm.elements[n].type=open?'text':'password'}});tg.setAttribute('aria-pressed',open);return}}
    var tab=e.target.closest('[role=tab]');
    if(tab){{switchTab(tab.closest('.view'),tab.dataset.tab);return}}
    var sw=e.target.closest('form p > button');
    if(sw){{var vw=sw.closest('.view');switchTab(vw,sw.closest('form').id==='login-form'?'signup':'login');return}}
    var fg=e.target.closest('#login-form [aria-expanded]');
    if(fg){{var ex=fg.getAttribute('aria-expanded')==='true';fg.setAttribute('aria-expanded',!ex);var hp=fg.closest('form').querySelector('.pv-help');if(hp)hp.remove();else{{var q=document.createElement('p');q.className='pv-help mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-center text-sm leading-7 text-muted';q.textContent=LG[fg.closest('.view').dataset.lang].forgotHelp;fg.closest('div').after(q)}}return}}
    var b=e.target.closest('[role=radio]');if(!b)return;
    var view=b.closest('.view'),lang=view.dataset.lang,grp=b.parentNode;
    var ds=PKG.durations.filter(function(d){{return d.enabled}}),ps=PKG.plans.filter(function(p){{return p.enabled}});
    var idx=[].indexOf.call(grp.querySelectorAll('[role=radio]'),b),d=ds[idx];if(!d)return;
    var nf=new Intl.NumberFormat(lang==='fa'?'fa-IR':'en-US',{{maximumFractionDigits:2}});
    grp.querySelectorAll('[role=radio]').forEach(function(x,i){{
      var on=i===idx;x.setAttribute('aria-checked',on);
      x.classList.toggle('bg-gold',on);x.classList.toggle('text-midnight',on);x.classList.toggle('text-muted',!on);x.classList.toggle('hover:text-gold',!on);
      var sp=x.querySelector('span');if(sp){{sp.classList.toggle('text-midnight/80',on);sp.classList.toggle('text-gold',!on)}}
    }});
    grp.parentNode.parentNode.querySelectorAll(':scope > ul > li').forEach(function(li,i){{
      var p=ps[i];if(!p)return;
      var monthly=r2(p.basePrice*(1-d.discountPercent/100)),total=r2(p.basePrice*(1-d.discountPercent/100)*d.months+d.setupFee);
      var pm=li.querySelector('.text-4xl'),pt=li.querySelector('p.mt-2 .font-bold'),un=li.querySelector('p.mt-6 .text-sm');
      pm.textContent=nf.format(total);pt.textContent=nf.format(monthly)+' '+PKG.currency[lang];un.textContent=PKG.currency[lang]+' / '+d.label[lang];
      [pm,pt].forEach(function(el){{el.classList.remove('price-pop');void el.offsetWidth;el.classList.add('price-pop')}});
      var su=li.querySelector('p.mt-2 span.block');
      if(su){{su.hidden=!(d.setupFee>0);su.textContent=PKG.setupIncluded[lang]+' ('+nf.format(d.setupFee)+' '+PKG.currency[lang]+')'}}
    }});
  }});
  createStarfield(document.getElementById('sky-canvas'),{{reduced:matchMedia('(prefers-reduced-motion: reduce)').matches}});
}})();
</script>
'''
page = page.replace('__PANEL_JS__', PANEL_JS)
open(OUT, 'w').write(page)
print('written', len(page)//1024, 'KB')
