import {loadContent} from "../../lib/load-content";
import {siteOrigin} from "../../lib/seo";
export async function GET(){
 const content=await loadContent(),origin=siteOrigin();
 const paths=["/","/about","/classes","/teachers","/programs","/schedule",...content.classes.map(item=>"/classes/"+encodeURIComponent(item.id))];
 const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${new URL(path,origin).href.replaceAll("&","&amp;").replaceAll("<","&lt;")}</loc></url>`).join("")}</urlset>`;
 return new Response(xml,{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600"}});
}
