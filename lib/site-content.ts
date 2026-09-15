export type ClassInfo={id:string;name:string;focus:string;description:string;skills:string[];goals?:string;activities?:string};
export type Teacher={id:string;name:string;role:string;bio:string;photo?:string};
export type Program={id:string;name:string;description:string;icon:string};
export type SiteContent={schoolName:string;heroTitle:string;heroText:string;aboutTitle:string;aboutText:string;affiliation:string;location:string;schedule:string;yearStructure:string;classes:ClassInfo[];teachers:Teacher[];programs:Program[];contentVersion?:number;pageText?:Record<string,string>};
export const defaultContent:SiteContent={
 schoolName:"사랑한글학교",heroTitle:"한글로 이어지는 우리",heroText:"말하고, 읽고, 쓰는 즐거움을 함께 키우는 몬트리올의 주일 한글학교입니다.",
 aboutTitle:"배움이 사랑이 되는 곳",aboutText:"사랑한글학교는 몬트리올 사랑교회에 소속된 한글학교입니다. 서로 다른 출발점의 학습자들이 한국어와 한국 문화를 편안하게 만나고, 자신의 생각을 한글로 표현하도록 돕습니다.",
 affiliation:"몬트리올 사랑교회 소속",location:"몬트리올 사랑교회 건물",schedule:"매주 일요일 09:50–10:40",yearStructure:"1학기 · 겨울방학 · 2학기 · 여름방학",
 classes:[
  {id:"class-1",name:"1반",focus:"한글 첫걸음",description:"한글을 처음 만나는 어린 학습자를 위한 반입니다. 놀이와 소리 중심 활동으로 자음과 모음을 익히고 짧은 낱말과 문장을 읽고 씁니다.",skills:["자음·모음","글자와 소리 연결","기초 낱말","짧은 문장"]},
  {id:"class-2",name:"2반",focus:"읽기와 문장 기초",description:"익숙한 낱말을 넘어 문장을 정확하게 읽고 쓰는 힘을 기릅니다. 어휘를 넓히고, 들은 내용이나 경험을 짧은 문장으로 표현합니다.",skills:["유창한 소리 내어 읽기","받아쓰기","기초 문법","생활 글쓰기"]},
  {id:"class-3",name:"3반",focus:"심화 읽기",description:"다양한 글의 중심 생각과 세부 내용을 파악합니다. 읽은 내용을 요약하고 질문하며, 어휘와 문장 구조를 확장합니다.",skills:["독해 전략","중심 생각 찾기","요약하기","어휘 확장"]},
  {id:"class-4",name:"4반",focus:"논술·심화 쓰기",description:"글을 비판적으로 읽고 자신의 관점을 논리적으로 구성합니다. 근거를 들어 의견을 말하고, 목적과 독자에 맞는 글을 씁니다.",skills:["논리적 글쓰기","근거와 주장","토론","다양한 글의 형식"]},
  {id:"adult",name:"성인반",focus:"성인을 위한 맞춤 한국어",description:"한글을 처음 배우는 분부터 읽기·쓰기와 회화를 더 발전시키려는 분까지, 성인 학습자의 목적과 수준에 맞추어 함께 배웁니다.",skills:["한글 입문","생활 회화","읽기와 쓰기","수준별 학습"]}
 ],
 teachers:[{id:"teacher-1",name:"선생님 이름",role:"담임 교사",bio:"교사의 이름, 담당 반과 간단한 소개를 운영자 모드에서 입력해 주세요."}],
 programs:[{id:"math",name:"수학",description:"개념을 이해하고 문제 해결력을 키우는 수준별 수업",icon:"∑"},{id:"art",name:"미술",description:"다양한 재료로 생각과 이야기를 표현하는 창작 활동",icon:"✦"},{id:"music",name:"음악",description:"악기와 노래를 통해 소리와 문화를 즐기는 수업",icon:"♪"},{id:"culture",name:"한국 문화",description:"역사·놀이·절기를 통해 만나는 살아 있는 한국 문화",icon:"한"}]
};

const leadership:Teacher[]=[
 {id:"principal",name:"김성수 목사님",role:"교장",bio:""},
 {id:"vice-principal",name:"여진숙 권사님",role:"교감",bio:""}
];
const classDetails:Record<string,{goals:string;activities:string}>={
 "class-1":{goals:"자음과 모음의 소리를 구별하고 결합해 낱말을 읽습니다. 익숙한 사물과 일상을 짧은 말과 글로 표현하는 데 자신감을 기릅니다.",activities:"그림과 낱말 짝짓기, 글자 만들기, 소리 내어 읽기, 짧은 문장 따라 쓰기"},
 "class-2":{goals:"문장을 자연스럽게 읽고 내용을 이해합니다. 알맞은 어휘와 문장 표현을 사용해 자신의 경험을 순서대로 전합니다.",activities:"짧은 이야기 읽기, 받아쓰기와 문장 고치기, 경험 이야기하기, 짧은 생활 글쓰기"},
 "class-3":{goals:"글의 중심 생각과 이를 뒷받침하는 내용을 구별합니다. 문맥 속 어휘의 뜻을 찾고, 글에 드러난 정보와 추론한 내용을 바탕으로 자신의 해석을 설명합니다.",activities:"이야기와 설명문 읽기, 문단별 핵심 내용 찾기, 질문 만들기, 요약과 독서 감상 나누기"},
 "class-4":{goals:"주장과 근거를 구분하고 다양한 관점을 비교합니다. 글의 개요를 세우고 문단을 연결하며, 퇴고를 통해 생각이 분명하게 전달되는 글을 완성합니다.",activities:"의견 글 읽기, 주제 토론, 개요 작성, 근거를 갖춘 논술 쓰기, 서로의 글 읽기와 고쳐 쓰기"},
 "adult":{goals:"처음 배우는 분은 글자와 발음, 기본 표현을 익힙니다. 경험이 있는 분은 일상 대화와 읽기·쓰기를 확장하며 각자의 학습 목적에 맞는 한국어 표현력을 기릅니다.",activities:"한글 읽기와 발음 연습, 상황별 생활 회화, 짧은 글 읽기, 경험과 의견 표현하기"}
};
export const defaultPageText:Record<string,string>={
 classesTitle:"나에게 맞는 반을 찾아보세요",classesIntro:"한글 첫걸음부터 심화 읽기와 논술까지, 현재의 한국어 수준과 학습 목표에 맞추어 배웁니다. 성인반은 입문부터 수준별 학습까지 별도로 운영합니다.",
 teachersTitle:"학교를 함께 만드는 사람들",teachersIntro:"교장·교감과 담당 교사를 소개합니다.",
 programsTitle:"배움이 이어지는 오후 프로그램",programsIntro:"오전 한글 수업과 별도로, 오후에는 관심과 재능을 넓히는 다양한 방과후 수업을 운영합니다. 개설 과목과 세부 운영 내용은 학기별로 달라질 수 있습니다.",
 scheduleTitle:"수업과 학기 안내",scheduleIntro:"오전에는 한글을 배우고, 오후에는 다양한 방과후 프로그램으로 배움을 넓힙니다.",
 footerText:"한글과 함께, 사랑으로 함께."
};
// Upgrade older saved content without replacing any existing class or teacher edits.
// Once saved at v2, deleted leadership entries stay deleted.
export function normalizeContent(saved:Partial<SiteContent>={}):SiteContent{
 const content={...defaultContent,...saved};
 let teachers=[...content.teachers];
 if((saved.contentVersion??0)<2){
  for(const leader of leadership){
   const existing=teachers.findIndex(t=>t.id===leader.id||t.role===leader.role);
   if(existing<0)teachers.push({...leader});
   else teachers[existing]={...teachers[existing],name:leader.name,role:leader.role};
  }
 }
 return {...content,contentVersion:2,teachers,
  pageText:{...defaultPageText,...content.pageText},
  classes:content.classes.map(c=>({...classDetails[c.id],...c}))};
}
