import {notFound} from "next/navigation";
import {loadContent} from "../../../lib/load-content";
import SiteClient from "../../site-client";
import {pageMetadata} from "../../../lib/seo";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const content=await loadContent();const item=content.classes.find(c=>c.id===id);
 return pageMetadata(content,{path:"/classes/"+encodeURIComponent(id),title:item?item.name+" · "+item.focus+" | 몬트리올 "+content.schoolName:"반 안내 | "+content.schoolName,description:item?.description});
}
export default async function ClassDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const content=await loadContent();if(!content.classes.some(c=>c.id===id))notFound();
 return <SiteClient initialContent={content} page="class-detail" classId={id}/>;
}
