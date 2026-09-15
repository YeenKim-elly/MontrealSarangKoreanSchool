import {loadContent} from "../lib/load-content";
import SiteClient from "./site-client";
import {schoolStructuredData} from "../lib/seo";
export const dynamic="force-dynamic";
export default async function Home(){
 const content=await loadContent();
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schoolStructuredData(content)).replace(/</g,"\\u003c")}}/><SiteClient initialContent={content} page="home"/></>;
}
