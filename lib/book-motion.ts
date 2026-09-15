export const BOOK_HOLD=560;
export const TURN_DURATION=2450;
export const BOOK_END=BOOK_HOLD+TURN_DURATION;

export type BookClock={elapsed:number;previous:number|null};

/** Pause in background tabs and do not consume an entire turn during one stalled frame. */
export function advanceBookClock(clock:BookClock,now:number,visible:boolean):BookClock {
 if(!visible)return {...clock,previous:null};
 const delta=clock.previous===null?0:Math.min(64,Math.max(0,now-clock.previous));
 return {elapsed:clock.elapsed+delta,previous:now};
}

export function turnProgress(time:number,duration:number) {
 const t=Math.max(0,Math.min(1,time/duration));
 return t*t*(3-2*t);
}

/** One narrow paper curl joins the printed cover to the revealed website. */
export function coverFrame(progress:number,width:number,height:number) {
 const p=Math.max(0,Math.min(1,progress));
 const bend=Math.sin(Math.PI*p);
 const curl=Math.min(132,width*.16)*bend;
 const lean=Math.min(86,width*.06)*bend;
 const edge=width*(1-p)-curl*.28;
 const top=edge-lean,bottom=edge+lean*.55;
 const c1=top-curl*.16,c2=bottom-curl*.23;
 const y1=height*.31,y2=height*.71;
 const fmt=(v:number)=>v.toFixed(2);
 const curve=`C${fmt(c1)},${fmt(y1)} ${fmt(c2)},${fmt(y2)} ${fmt(bottom)},${fmt(height)}`;
 const front=`M-2,-2 L${fmt(top)},-2 L${fmt(top)},0 ${curve} L-2,${fmt(height+2)} Z`;
 const fold=`M${fmt(top)},0 ${curve} C${fmt(c2+curl)},${fmt(y2)} ${fmt(c1+curl)},${fmt(y1)} ${fmt(top)},0 Z`;
 return {front,fold,curl,top,bottom,gradientStart:edge-lean*.25,gradientEnd:edge+curl*.82,opacity:Math.min(1,bend*5),contentShift:-width*.055*p};
}
