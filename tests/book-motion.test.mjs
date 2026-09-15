import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceBookClock,BOOK_END,coverFrame,turnProgress} from '../lib/book-motion.ts';

test('background tabs and stalled frames cannot finish the opening off screen',()=>{
 let clock=advanceBookClock({elapsed:400,previous:1000},1016,true);
 assert.equal(clock.elapsed,416);
 clock=advanceBookClock(clock,90000,false);
 assert.equal(clock.elapsed,416);
 clock=advanceBookClock(clock,95000,true);
 assert.equal(clock.elapsed,416);
 clock=advanceBookClock(clock,125000,true);
 assert.ok(clock.elapsed<=480);
 assert.ok(clock.elapsed<BOOK_END);
});

test('normal visible frames finish the sequence',()=>{
 let clock={elapsed:0,previous:null};
 for(let time=0;time<BOOK_END+40;time+=16)clock=advanceBookClock(clock,time,true);
 assert.ok(clock.elapsed>=BOOK_END);
 assert.equal(turnProgress(-500,3200),0);
 assert.equal(turnProgress(9999,3200),1);
});

for(const [width,height] of [[390,844],[1363,936],[1920,1080]]){
 test(`a ${width}px cover reveals the site without a full-screen blank paper layer`,()=>{
  const closed=coverFrame(0,width,height);
  assert.equal(closed.top,width);
  assert.equal(closed.bottom,width);
  assert.equal(closed.curl,0);
  let previousTop=width,previousBottom=width;
  for(let progress=0;progress<=1;progress+=.02){
   const frame=coverFrame(progress,width,height);
   assert.ok(frame.curl<=width*.16,'paper underside must stay narrow');
   assert.ok(frame.top<=previousTop&&frame.bottom<=previousBottom,'the reveal cannot reverse or expand over the site');
   assert.ok(!/NaN|Infinity/.test(frame.front+frame.fold));
   previousTop=frame.top;previousBottom=frame.bottom;
  }
  const open=coverFrame(1,width,height);
  assert.ok(Math.abs(open.top)<1e-7&&Math.abs(open.bottom)<1e-7&&open.curl<1e-7);
 });
}
