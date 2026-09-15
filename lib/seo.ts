import type {Metadata} from "next";
import {env} from "cloudflare:workers";
import type {SiteContent} from "./site-content";

export function siteOrigin(){
 const fallback="https://sarang-hangeul-school.yeen0528.chatgpt.site";
 try{const url=new URL(env.PUBLIC_SITE_URL||fallback);return url.protocol==="https:"?url.origin:fallback}catch{return fallback}
}

export function pageMetadata(content:SiteContent,{path="/",title,description}:{path?:string;title?:string;description?:string}={}):Metadata {
 const name=content.schoolName;
 const pageTitle=title||`몬트리올 한글학교 | ${name}`;
 const summary=description||`몬트리올 사랑장로교회(사랑교회) 소속 ${name}. 한글 기초부터 심화 읽기·논술까지 1–4반과 성인반을 운영합니다. 오전 수업 ${content.schedule}. 오후 방과후 프로그램도 만나보세요.`;
 const origin=siteOrigin();
 return {
  metadataBase:new URL(origin),title:pageTitle,description:summary,
  alternates:{canonical:new URL(path,origin).href},
  robots:{index:true,follow:true},
  openGraph:{type:"website",locale:"ko_KR",siteName:name,title:pageTitle,description:summary,url:new URL(path,origin).href,images:[{url:"/images/sarang-ink-hero.webp",width:1536,height:1024,alt:`${name} · 한글로 이어지는 우리`}]},
  twitter:{card:"summary_large_image",title:pageTitle,description:summary,images:["/images/sarang-ink-hero.webp"]},
  ...(env.GOOGLE_SITE_VERIFICATION?{verification:{google:env.GOOGLE_SITE_VERIFICATION}}:{}),
 };
}

export function schoolStructuredData(content:SiteContent){
 const origin=siteOrigin();
 return {
  "@context":"https://schema.org","@type":"School","@id":origin+"/#school",
  name:content.schoolName,alternateName:["사랑 한글학교","몬트리올 사랑한글학교"],url:origin,
  description:content.heroText,logo:origin+"/logo.png",image:origin+"/images/sarang-ink-hero.webp",
  address:{"@type":"PostalAddress",addressLocality:"Montréal",addressRegion:"QC",addressCountry:"CA"},
  parentOrganization:{"@type":"Church",name:"몬트리올 사랑교회",alternateName:["몬트리올 사랑장로교회","몬트리올 사랑 장로 교회"]},
 };
}
