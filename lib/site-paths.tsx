"use client";
import {createContext,useContext,forwardRef,type ComponentProps} from "react";
export const SitePaths=createContext("");
function resolve(path:string|undefined,base:string,link=false){
 if(!path||!base||!path.startsWith("/")||path.startsWith("//"))return path;
 const [pathname,hash]=path.split("#");
 return base.replace(/\/$/,"")+pathname+(link&&!pathname.endsWith("/")&&!pathname.split("/").pop()?.includes(".")?"/":"")+(hash?"#"+hash:"");
}
export const SiteLink=forwardRef<HTMLAnchorElement,ComponentProps<"a">>(function SiteLink({href,...props},ref){return <a {...props} ref={ref} href={resolve(href,useContext(SitePaths),true)}/>});
export function SiteImage({src,...props}:ComponentProps<"img">){return <img {...props} src={resolve(typeof src==="string"?src:undefined,useContext(SitePaths))}/>}
