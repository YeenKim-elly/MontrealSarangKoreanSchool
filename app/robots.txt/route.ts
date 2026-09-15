import {siteOrigin} from "../../lib/seo";
export function GET(){
 return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteOrigin()}/sitemap.xml\n`,{headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=3600"}});
}
