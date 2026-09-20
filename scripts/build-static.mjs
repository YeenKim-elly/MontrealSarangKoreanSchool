import {build} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=resolve(root,'docs');
// Keep the configured custom domain when rebuilding the output directory.
let domain='';
try{domain=(await readFile(resolve(out,'CNAME'),'utf8')).trim()}catch(error){if(error.code!=='ENOENT')throw error}
if(domain&&!/^[a-z0-9.-]+$/i.test(domain))throw new Error('Invalid CNAME');
const base=domain?'/':'/MontrealSarangKoreanSchool/';
const origin=domain?'https://'+domain:'https://yeenkim-elly.github.io';
const common={configFile:false,root,base,plugins:[react()],resolve:{alias:{'@':root}}};
await build({...common,publicDir:false,build:{ssr:resolve(root,'static/render.tsx'),outDir:resolve(root,'.static-render'),emptyOutDir:true}});
await build({...common,build:{outDir:out,emptyOutDir:true,rollupOptions:{input:resolve(root,'static/index.html')}}});
if(domain)await writeFile(resolve(out,'CNAME'),domain+'\n');
const {render,data}=await import('../.static-render/render.js');
const template=await readFile(resolve(out,'static/index.html'),'utf8');
const routes=[['','home','몬트리올 사랑한글학교'],['about','about','학교 소개'],['teachers','teachers','교장·교감 및 선생님'],['schedule','schedule','수업·학기 안내'],['classes','classes','한글 수업'],['programs','programs','방과후 수업'],...data.classes.map(c=>['classes/'+c.id,'class-detail',c.name+' · '+c.focus,c.id])];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const [path,page,title,classId] of routes){
 const props={initialContent:data,page,classId,staticMode:true,basePath:base},url=origin+base+(path?path+'/':'');
 const description=classId?data.classes.find(c=>c.id===classId).description:data.heroText+' '+data.affiliation+'. '+data.schedule;
 const schema={'@context':'https://schema.org','@type':'EducationalOrganization',name:data.schoolName,url:origin+base,description,parentOrganization:{'@type':'Organization',name:'몬트리올 사랑교회'}};
 const head=`<title>${escape(title)} | 사랑한글학교</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${url}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin+base}images/sarang-ink-hero.webp"><meta property="og:type" content="website"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
 const html=template.replace('<!--head-->',head).replace('<!--app-->',render(props)).replace('<!--props-->',`<script type="application/json" id="site-props">${JSON.stringify(props).replaceAll('<','\\u003c')}</script>`);
 await mkdir(resolve(out,path),{recursive:true});await writeFile(resolve(out,path,'index.html'),html);
}
await rm(resolve(out,'static'),{recursive:true});await writeFile(resolve(out,'.nojekyll'),'');
await writeFile(resolve(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin+base}sitemap.xml\n`);
await writeFile(resolve(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([p])=>`<url><loc>${origin+base}${p?p+'/':''}</loc></url>`).join('')}</urlset>`);
await writeFile(resolve(out,'404.html'),`<!doctype html><html lang="ko"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>페이지를 찾을 수 없습니다</title><h1>페이지를 찾을 수 없습니다</h1><a href="${base}">사랑한글학교 홈으로</a></html>`);
console.log(`Built ${routes.length} static pages in docs/`);
