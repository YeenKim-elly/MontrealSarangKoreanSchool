import {notFound} from "next/navigation";
import {loadContent} from "../../lib/load-content";
import SiteClient,{type SitePage} from "../site-client";
import {pageMetadata} from "../../lib/seo";
const titles:Record<string,string>={classes:"오전 한글반",teachers:"교직원 소개",programs:"오후 프로그램",about:"학교 소개",schedule:"수업·학기 안내"};
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{section:string}>}){
 const {section}=await params,content=await loadContent();
 const summaries:Record<string,string>={classes:content.pageText?.classesIntro||"",teachers:content.pageText?.teachersIntro||"",programs:content.pageText?.programsIntro||"",about:content.aboutText,schedule:content.schedule+". "+content.yearStructure};
 return pageMetadata(content,{path:"/"+section,title:(titles[section]||"페이지")+" | 몬트리올 "+content.schoolName,description:summaries[section]});
}
export default async function Section({params}:{params:Promise<{section:string}>}){
 const {section}=await params;if(!titles[section])notFound();
 return <SiteClient initialContent={await loadContent()} page={section as SitePage}/>;
}
