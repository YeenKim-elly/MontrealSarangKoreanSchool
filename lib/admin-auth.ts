import { env } from "cloudflare:workers";
const encoder=new TextEncoder();
export const COOKIE_NAME="sarang_admin";
async function tokenFor(day:number){
 const key=await crypto.subtle.importKey("raw",encoder.encode(env.ADMIN_PASSWORD||""),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const sig=await crypto.subtle.sign("HMAC",key,encoder.encode("sarang-admin:"+day));
 return btoa(String.fromCharCode(...new Uint8Array(sig))).replaceAll("+","-").replaceAll("/","_").replaceAll("=","");
}
export const makeAdminToken=()=>tokenFor(Math.floor(Date.now()/86400000));
export async function isAdmin(request:Request){
 if(!env.ADMIN_PASSWORD)return false;
 const cookie=request.headers.get("cookie")||"";
 const value=cookie.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE_NAME+"="))?.split("=")[1];
 if(!value)return false;
 const day=Math.floor(Date.now()/86400000);
 return value===await tokenFor(day)||value===await tokenFor(day-1);
}
