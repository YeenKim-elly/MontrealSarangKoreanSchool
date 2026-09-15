import {eq} from "drizzle-orm";
import {getDb} from "../db";
import {siteContent} from "../db/schema";
import {normalizeContent} from "./site-content";
export async function loadContent(){
 try{
  const [row]=await getDb().select().from(siteContent).where(eq(siteContent.id,1)).limit(1);
  return normalizeContent(row?JSON.parse(row.content):{});
 }catch{return normalizeContent();}
}
