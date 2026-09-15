"use client";

import {useEffect,useRef,useState} from "react";
import {SiteImage} from "../lib/site-paths";
import {ArrowRight} from "lucide-react";
import {advanceBookClock,BOOK_END,BOOK_HOLD,TURN_DURATION,coverFrame,turnProgress,type BookClock} from "../lib/book-motion";

export default function BookIntro({schoolName,title,onComplete}:{schoolName:string;title:string;onComplete:()=>void}) {
 const [ready,setReady]=useState(false);
 const root=useRef<HTMLDivElement>(null),cover=useRef<HTMLDivElement>(null),printing=useRef<HTMLDivElement>(null);
 const curl=useRef<SVGSVGElement>(null),fold=useRef<SVGPathElement>(null),light=useRef<SVGLinearGradientElement>(null);
 const skip=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  setReady(true);
  skip.current?.focus({preventScroll:true});
  let clock:BookClock={elapsed:0,previous:null},frame=0;
  let size={width:window.innerWidth,height:window.innerHeight};
  const measure=()=>{
   const bounds=root.current?.getBoundingClientRect();
   if(bounds)size={width:bounds.width,height:bounds.height};
   curl.current?.setAttribute("viewBox",`0 0 ${size.width} ${size.height}`);
  };
  measure();
  const render=(now:number)=>{
   clock=advanceBookClock(clock,now,document.visibilityState!=="hidden");
   if(document.visibilityState!=="hidden"){
    const p=turnProgress(clock.elapsed-BOOK_HOLD,TURN_DURATION);
    const geometry=coverFrame(p,size.width,size.height);
    if(cover.current){
     cover.current.style.clipPath=`path('${geometry.front}')`;
     cover.current.style.setProperty("-webkit-clip-path",`path('${geometry.front}')`);
    }
    if(printing.current)printing.current.style.transform=`translateX(${geometry.contentShift}px)`;
    fold.current?.setAttribute("d",geometry.fold);
    light.current?.setAttribute("x1",String(geometry.gradientStart));
    light.current?.setAttribute("x2",String(geometry.gradientEnd));
    if(curl.current)curl.current.style.opacity=String(geometry.opacity);
    if(root.current)root.current.dataset.progress=p.toFixed(3);
    if(clock.elapsed>=BOOK_END){onComplete();return;}
   }
   frame=requestAnimationFrame(render);
  };
  const visibility=()=>{clock={...clock,previous:null}};
  const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")onComplete()};
  window.addEventListener("resize",measure);
  document.addEventListener("visibilitychange",visibility);
  document.addEventListener("keydown",escape);
  frame=requestAnimationFrame(render);
  return()=>{
   cancelAnimationFrame(frame);
   window.removeEventListener("resize",measure);
   document.removeEventListener("visibilitychange",visibility);
   document.removeEventListener("keydown",escape);
   document.body.style.overflow=previousOverflow;
  };
 },[onComplete]);
 return <div ref={root} className="book-intro" data-ready={ready} role="dialog" aria-modal="true" aria-labelledby="book-intro-title">
  <div ref={cover} className="book-cover" aria-hidden="true">
   <div className="book-cover-face">
    <SiteImage className="book-cover-art" src="/images/sarang-book-cover.webp" alt="" fetchPriority="high" width="1086" height="1448"/>
    <div className="book-cover-shade"/>
    <div ref={printing} className="book-cover-printing">
     <div className="book-cover-content">
      <span className="book-edition">MONTRÉAL · KOREAN LANGUAGE SCHOOL</span>
      <span className="book-cover-name">{schoolName}</span>
      <span className="book-cover-caption">{title}</span>
      <span className="book-cover-rule"/>
     </div>
     <span className="book-cover-bottom">SARANG</span>
    </div>
   </div>
  </div>
  <svg ref={curl} className="book-curl" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
   <defs>
    <linearGradient ref={light} id="book-curl-light" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
     <stop offset="0" stopColor="#a0ae96"/><stop offset=".26" stopColor="#e7e5d4"/><stop offset=".63" stopColor="#fffdf0"/><stop offset="1" stopColor="#d2d5c4"/>
    </linearGradient>
   </defs>
   <path ref={fold} fill="url(#book-curl-light)"/>
  </svg>
  <h2 id="book-intro-title" className="sr-only">{schoolName} · 책이 열리면 홈페이지가 나타납니다.</h2>
  <button ref={skip} type="button" className="book-skip" onClick={onComplete}>건너뛰기<ArrowRight size={16}/></button>
 </div>;
}
