"use client";
import {useCallback,useEffect,useRef,useState,type ReactNode} from "react";
import {ArrowRight,CalendarDays,ChevronDown,Clock3,ImagePlus,LockKeyhole,LogOut,MapPin,Menu as MenuIcon,Plus,RotateCcw,Save,School,Trash2,Users,X} from "lucide-react";
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Sheet,SheetTrigger,SheetContent,SheetHeader,SheetTitle,SheetDescription} from "@/components/ui/sheet";
import {SitePaths,SiteLink,SiteImage} from "../lib/site-paths";
import BookIntro from "./book-intro";
import type {ClassInfo,Program,SiteContent,Teacher} from "../lib/site-content";
export type SitePage="home"|"classes"|"class-detail"|"teachers"|"programs"|"about"|"schedule";
const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v));
const classUrl=(id:string)=>"/classes/"+encodeURIComponent(id);
function Field({label,value,onChange,multiline=false}:{label:string;value:string;onChange:(v:string)=>void;multiline?:boolean}){
 return <label className="editor-field"><span>{label}</span>{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)}/>:<input value={value} onChange={e=>onChange(e.target.value)}/>}</label>;
}
function Menu({label,children,active=false}:{label:string;children:ReactNode;active?:boolean}){
 return <DropdownMenu><DropdownMenuTrigger className={"nav-trigger"+(active?" selected":"")}>{label}<ChevronDown size={16}/></DropdownMenuTrigger><DropdownMenuContent className="site-dropdown" align="start" sideOffset={10}>{children}</DropdownMenuContent></DropdownMenu>;
}
function MenuLink({href,children}:{href:string;children:ReactNode}){
 return <DropdownMenuItem asChild><SiteLink href={href}>{children}</SiteLink></DropdownMenuItem>;
}
export default function SiteClient({initialContent,page="home",classId,staticMode=false,basePath=""}:{staticMode?:boolean;basePath?:string;initialContent:SiteContent;page?:SitePage;classId?:string}){
 const [content,setContent]=useState(clone(initialContent)),[draft,setDraft]=useState(clone(initialContent));
 const [admin,setAdmin]=useState(false),[showLogin,setShowLogin]=useState(false),[password,setPassword]=useState(""),[message,setMessage]=useState(""),[saving,setSaving]=useState(false),[uploading,setUploading]=useState(false);
 const [introVisible,setIntroVisible]=useState(page==="home");
 const [introMounted,setIntroMounted]=useState(false);
 const [introRun,setIntroRun]=useState(0);
 const mainRef=useRef<HTMLElement>(null),replayRef=useRef<HTMLButtonElement>(null);
 const completeIntro=useCallback(()=>setIntroVisible(false),[]);
 useEffect(()=>setIntroMounted(true),[]);
 useEffect(()=>{if(page==="home"&&!introVisible&&introMounted){(introRun>0?replayRef.current:mainRef.current)?.focus({preventScroll:true})}},[page,introVisible,introMounted,introRun]);
 const current=admin?draft:content;
 const dirty=admin&&JSON.stringify(content)!==JSON.stringify(draft);
 useEffect(()=>{if(staticMode)return;fetch("/api/admin/session",{cache:"no-store"}).then(r=>r.json()).then(d=>setAdmin(Boolean((d as {authenticated?:boolean}).authenticated))).catch(()=>{})},[]);
 useEffect(()=>{
  if(!dirty&&!uploading&&!saving)return;
  const before=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue=""};
  const navigate=(e:MouseEvent)=>{
   const link=(e.target as Element)?.closest?.("a[href]");
   if(!link)return;
   if(uploading||saving){e.preventDefault();setMessage("저장 또는 사진 업로드가 끝난 뒤 이동해 주세요.");return;}
   if(!window.confirm("저장하지 않은 변경사항이 있습니다. 저장하지 않고 이동할까요?"))e.preventDefault();
  };
  window.addEventListener("beforeunload",before);document.addEventListener("click",navigate,true);
  return()=>{window.removeEventListener("beforeunload",before);document.removeEventListener("click",navigate,true)};
 },[dirty,uploading,saving]);
 useEffect(()=>{
  if(!showLogin)return;
  const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setShowLogin(false)};
  document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key);
 },[showLogin]);
 async function login(e:React.FormEvent){
  e.preventDefault();setMessage("");
  try{const r=await fetch("/api/admin/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({password})});
   if(r.ok){setAdmin(true);setShowLogin(false);setPassword("");setDraft(clone(content))}
   else setMessage("비밀번호를 확인해 주세요.");
  }catch{setMessage("연결하지 못했습니다. 다시 시도해 주세요.")}
 }
 async function logout(){
  if(dirty&&!window.confirm("저장하지 않은 내용을 취소하고 운영자 모드를 종료할까요?"))return;
  try{const r=await fetch("/api/admin/logout",{method:"POST"});if(!r.ok)throw new Error();setAdmin(false);setDraft(clone(content));setMessage("")}catch{setMessage("종료하지 못했습니다. 다시 시도해 주세요.")}
 }
 async function save(){
  setSaving(true);setMessage("");
  try{const r=await fetch("/api/content",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(draft)});
   if(!r.ok)throw new Error();setContent(clone(draft));setMessage("변경사항을 저장했습니다.");
  }catch{setMessage("저장하지 못했습니다. 수정 내용은 유지됩니다. 다시 시도해 주세요.")}
  finally{setSaving(false)}
 }
 const setField=(key:keyof SiteContent,value:unknown)=>setDraft(d=>({...d,[key]:value}));
 const editClass=(i:number,p:Partial<ClassInfo>)=>setDraft(d=>({...d,classes:d.classes.map((x,n)=>n===i?{...x,...p}:x)}));
 const editTeacher=(i:number,p:Partial<Teacher>)=>setDraft(d=>({...d,teachers:d.teachers.map((x,n)=>n===i?{...x,...p}:x)}));
 const editProgram=(i:number,p:Partial<Program>)=>setDraft(d=>({...d,programs:d.programs.map((x,n)=>n===i?{...x,...p}:x)}));
 const pageText=(key:string)=>current.pageText?.[key]||"";
 function textField(key:string,label:string,multiline=false){
  return <Field label={label} value={pageText(key)} multiline={multiline} onChange={v=>setDraft(d=>({...d,pageText:{...d.pageText,[key]:v}}))}/>;
 }
 async function uploadPhoto(i:number,file?:File){
  if(!file)return;setUploading(true);setMessage("");
  try{const form=new FormData();form.append("file",file);const r=await fetch("/api/upload",{method:"POST",body:form});const data=await r.json() as {error?:string;url?:string};
   if(!r.ok||!data.url)throw new Error(data.error||"사진을 올리지 못했습니다.");
   editTeacher(i,{photo:data.url});setMessage("사진을 올렸습니다. 모두 저장을 눌러 반영해 주세요.");
  }catch(error){setMessage(error instanceof Error?error.message:"사진을 올리지 못했습니다.")}
  finally{setUploading(false)}
 }
 function info(){
  return <div className="info-grid">{([
   ["소속","affiliation",School],["장소","location",MapPin],["오전 한글 수업","schedule",Clock3],["연간 운영","yearStructure",CalendarDays]
  ] as const).map(([label,key,Icon])=><div key={key}><Icon/><div>{admin?<Field label={label} value={current[key]} onChange={v=>setField(key,v)}/>:<><span>{label}</span><strong>{current[key]}</strong></>}</div></div>)}</div>;
 }
 function teacherCard(t:Teacher,i:number){
  return <article className="teacher-card" key={t.id}><div className="teacher-photo">
   {t.photo?<SiteImage src={t.photo} alt={t.name+" 사진"}/>:<Users size={42} aria-label="사진 미등록"/>}
   {admin&&<label className="photo-button"><ImagePlus size={16}/>{uploading?"업로드 중…":"사진 선택"}<input disabled={uploading||saving} type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>uploadPhoto(i,e.target.files?.[0])}/></label>}
  </div><div>{admin?<><Field label="이름·호칭" value={t.name} onChange={v=>editTeacher(i,{name:v})}/><Field label="직책·담당 반" value={t.role} onChange={v=>editTeacher(i,{role:v})}/><Field label="간단한 소개" value={t.bio} multiline onChange={v=>editTeacher(i,{bio:v})}/><button type="button" className="danger" onClick={()=>{if(window.confirm(t.name+" 소개를 삭제할까요? 저장 전에는 되돌릴 수 있습니다."))setField("teachers",draft.teachers.filter((_,n)=>n!==i))}}><Trash2 size={15}/>소개 삭제</button></>:<><span>{t.role}</span><h3>{t.name}</h3>{t.bio&&<p>{t.bio}</p>}</>}</div></article>;
 }
 const classIndex=current.classes.findIndex(c=>c.id===classId),detail=current.classes[classIndex];
 const isLeader=(t:Teacher)=>t.role==="교장"||t.role==="교감"||t.id==="principal"||t.id==="vice-principal";
 const teachers=current.teachers.map((t,i)=>({t,i})).filter(({t})=>admin||t.name!=="선생님 이름");
 return <SitePaths value={basePath}>
  {page==="home"&&<noscript><style>{".book-intro{display:none!important}"}</style></noscript>}
  {introVisible&&<BookIntro key={introRun} schoolName={current.schoolName} title={current.heroTitle} onComplete={completeIntro}/>}
  <main ref={mainRef} tabIndex={-1} inert={introVisible&&introMounted}>
  <SiteLink href="#page-content" className="skip-link">본문으로 이동</SiteLink>
  <header className="topbar">
   <SiteLink className="brand" href="/"><SiteImage src="/logo.png" alt="사랑한글학교 로고"/><span>{current.schoolName}</span></SiteLink>
   <nav className="desktop-nav" aria-label="주 메뉴">
    <SiteLink href="/" className={"home-link"+(page==="home"?" selected":"")} aria-current={page==="home"?"page":undefined}>홈</SiteLink>
    <Menu label="학교 소개" active={["about","teachers","schedule"].includes(page)}>
     <MenuLink href="/about">학교 소개</MenuLink><MenuLink href="/teachers">교장·교감 및 선생님</MenuLink><MenuLink href="/schedule">수업·학기 안내</MenuLink>
    </Menu>
    <Menu label="한글 수업" active={page==="classes"||page==="class-detail"}>
     <MenuLink href="/classes">전체 반 한눈에 보기</MenuLink>
     {current.classes.map(c=><MenuLink key={c.id} href={classUrl(c.id)}><span>{c.name}</span><small>{c.focus}</small></MenuLink>)}
    </Menu>
    <Menu label="방과후 수업" active={page==="programs"}>
     <MenuLink href="/programs">방과후 수업 안내</MenuLink>
     {current.programs.map(p=><MenuLink key={p.id} href={"/programs#program-"+encodeURIComponent(p.id)}>{p.name}</MenuLink>)}
    </Menu>
   </nav>
   <div className="header-actions">
   {!staticMode&&(admin?<button className="admin-pill active" aria-label="운영자 종료" disabled={saving||uploading} onClick={logout}><LogOut size={15}/><span>운영자 종료</span></button>:<button className="admin-pill" aria-label="운영자 모드 열기" onClick={()=>{setMessage("");setShowLogin(true)}}><LockKeyhole size={15}/><span>운영자</span></button>)}
   <Sheet><SheetTrigger asChild><button type="button" className="mobile-menu-button" aria-label="전체 메뉴 열기"><MenuIcon size={23}/></button></SheetTrigger><SheetContent className="mobile-navigation" side="right"><SheetHeader><SheetTitle>{current.schoolName}</SheetTitle><SheetDescription>학교와 수업 안내</SheetDescription></SheetHeader><nav className="mobile-links" aria-label="모바일 주 메뉴"><SiteLink href="/">홈</SiteLink><div><span>학교 소개</span><SiteLink href="/about">학교 이야기</SiteLink><SiteLink href="/teachers">교장·교감과 선생님</SiteLink><SiteLink href="/schedule">수업·학기 안내</SiteLink></div><div><span>오전 한글 수업</span><SiteLink href="/classes">전체 반 보기</SiteLink>{current.classes.map(c=><SiteLink key={c.id} href={classUrl(c.id)}>{c.name}<small>{c.focus}</small></SiteLink>)}</div><div><span>오후 방과후 수업</span><SiteLink href="/programs">프로그램 알아보기</SiteLink></div></nav></SheetContent></Sheet>
   </div>
  </header>
  {admin&&<div className="editbar"><span>{dirty?"저장하지 않은 변경사항이 있습니다.":"운영자 모드 · 이 페이지의 내용을 수정할 수 있습니다."}</span><span className="edit-actions"><em role="status">{message}</em><button className="secondary" disabled={saving||uploading} onClick={()=>{setDraft(clone(content));setMessage("")}}>되돌리기</button><button onClick={save} disabled={saving||uploading}><Save size={16}/>{saving?"저장 중…":uploading?"사진 업로드 중…":"모두 저장"}</button></span></div>}
  <div id="page-content" tabIndex={-1} className={"page-body page-"+page}>
   {page!=="home"&&<div className="breadcrumb"><SiteLink href="/">홈</SiteLink><span>/</span>{page==="class-detail"?<><SiteLink href="/classes">오전 한글반</SiteLink><span>/</span><span>{detail?.name}</span></>:<span>{{classes:"오전 한글반",teachers:"교직원 소개",programs:"오후 프로그램",about:"학교 소개",schedule:"수업·학기 안내"}[page]}</span>}</div>}
   {page==="home"&&<>
    <section className="hero home-hero">
     <div className="hero-copy"><span className="eyebrow">사랑한글학교 <span aria-hidden="true"> / </span> MONTRÉAL</span>
      {admin?<><Field label="홈 제목" value={current.heroTitle} onChange={v=>setField("heroTitle",v)}/><Field label="홈 소개" value={current.heroText} multiline onChange={v=>setField("heroText",v)}/></>:<><h1 className="home-title">{current.heroTitle==="한글로 이어지는 우리"?<>한글로 이어지는<br/><em>우리</em></>:current.heroTitle}</h1><p>{current.heroText}</p></>}
      <div className="hero-actions"><SiteLink className="primary-link" href="/classes">우리 반 알아보기<ArrowRight size={18}/></SiteLink><SiteLink className="home-secondary-link" href="/about">학교 이야기</SiteLink></div>
     </div>
     <figure className="home-illustration">
      <SiteImage className="book-reveal-art" src="/images/sarang-ink-hero.webp" width="1536" height="1024" fetchPriority="high" alt="초록빛 붓결과 노란 잎사귀가 펼쳐진 책 위로 흐르는 한글 배움의 일러스트"/>
     </figure>
    </section>
    <div className="home-information" aria-label="수업 안내"><div><Clock3/><span>오전 한글 수업<strong>{current.schedule}</strong></span></div><div><MapPin/><span>함께 배우는 곳<strong>{current.location}</strong></span></div><SiteLink href="/schedule">수업·학기 안내<ArrowRight size={18}/></SiteLink></div>
    <div className="home-shortcuts">{[["/about","학교 소개","소속과 교육 방향"],["/teachers","교직원 소개","교장·교감과 담당 교사"],["/programs","오후 프로그램","다양한 방과후 수업"]].map(([url,title,subtitle],i)=><SiteLink href={url} key={url}><span className="shortcut-index" aria-hidden="true">0{i+1}</span><span><strong>{title}</strong><small>{subtitle}</small></span><ArrowRight size={18}/></SiteLink>)}</div>
   </>}
   {page==="classes"&&<section className="section classes-section">
    <div className="section-head"><span className="kicker">MORNING CLASSES</span>{admin?<>{textField("classesTitle","반 안내 제목")}{textField("classesIntro","반 안내 소개",true)}</>:<><h1>{pageText("classesTitle")}</h1><p>{pageText("classesIntro")}</p></>}</div>
    <div className="class-grid">{current.classes.map((c,i)=><article className={"class-card tone-"+i} key={c.id}><div className="class-number">{i<4?"0"+(i+1):"성인"}</div><h2>{c.name}</h2><strong>{c.focus}</strong><p>{c.description}</p><SiteLink className="detail-link" href={classUrl(c.id)}>{admin?"상세 내용 편집":"학습 내용 자세히 보기"}<ArrowRight size={17}/></SiteLink></article>)}</div>
   </section>}
   {page==="class-detail"&&detail&&<section className="section detail-section">
    <aside className="class-sidebar" aria-label="다른 반 보기"><SiteLink href="/classes">전체 반</SiteLink>{current.classes.map(c=><SiteLink key={c.id} href={classUrl(c.id)} aria-current={c.id===classId?"page":undefined}>{c.name}<span>{c.focus}</span></SiteLink>)}</aside>
    <article className="class-detail-content"><span className="kicker">MORNING · KOREAN LANGUAGE</span>
     {admin?<><Field label="반 이름" value={detail.name} onChange={v=>editClass(classIndex,{name:v})}/><Field label="중심 학습 내용" value={detail.focus} onChange={v=>editClass(classIndex,{focus:v})}/><Field label="반 소개" value={detail.description} multiline onChange={v=>editClass(classIndex,{description:v})}/></>:<><h1>{detail.name}<span>{detail.focus}</span></h1><p className="detail-lead">{detail.description}</p></>}
     <div className="learning-block"><h2>핵심 학습 내용</h2>{admin?<Field label="항목마다 한 줄씩 입력" value={detail.skills.join("\n")} multiline onChange={v=>editClass(classIndex,{skills:v.split("\n")})}/>:<ul className="skill-list">{detail.skills.filter(Boolean).map((s,i)=><li key={i}>{s}</li>)}</ul>}</div>
     <div className="learning-block"><h2>이런 힘을 기릅니다</h2>{admin?<Field label="학습 목표" value={detail.goals||""} multiline onChange={v=>editClass(classIndex,{goals:v})}/>:<p>{detail.goals}</p>}</div>
     <div className="learning-block"><h2>학습 활동 예시</h2>{admin?<Field label="활동 예시" value={detail.activities||""} multiline onChange={v=>editClass(classIndex,{activities:v})}/>:<p>{detail.activities}</p>}</div>
     <div className="class-time"><Clock3 size={19}/><span>{current.schedule}<br/>{current.location}</span><SiteLink href="/schedule">운영 안내<ArrowRight size={16}/></SiteLink></div>
    </article>
   </section>}
   {page==="teachers"&&<section className="section teachers-section">
    <div className="section-head left"><span className="kicker">OUR PEOPLE</span>{admin?<>{textField("teachersTitle","교직원 페이지 제목")}{textField("teachersIntro","교직원 페이지 소개",true)}</>:<><h1>{pageText("teachersTitle")}</h1><p>{pageText("teachersIntro")}</p></>}</div>
    <h2 className="group-heading">교장·교감</h2><div className="teacher-grid leadership-grid">{teachers.filter(({t})=>isLeader(t)).sort((a,b)=>(a.t.role==="교장"?0:1)-(b.t.role==="교장"?0:1)).map(({t,i})=>teacherCard(t,i))}</div>
    <h2 className="group-heading">담당 선생님</h2><div className="teacher-grid">{teachers.filter(({t})=>!isLeader(t)).map(({t,i})=>teacherCard(t,i))}</div>
    {!teachers.some(({t})=>!isLeader(t))&&<p className="empty-note">담당 선생님 소개는 준비 중입니다.</p>}
    {admin&&<button className="add-button" disabled={uploading||saving} onClick={()=>setField("teachers",[...draft.teachers,{id:crypto.randomUUID(),name:"새 선생님",role:"담당 교사",bio:""}])}><Plus size={17}/>교직원 추가</button>}
   </section>}
   {page==="programs"&&<section className="section programs-section"><div className="program-intro"><span className="kicker">SUNDAY AFTERNOON</span>{admin?<>{textField("programsTitle","오후 프로그램 제목")}{textField("programsIntro","오후 프로그램 소개",true)}</>:<><h1>{pageText("programsTitle")}</h1><p>{pageText("programsIntro")}</p></>}<SiteLink className="light-link" href="/schedule">수업·학기 안내<ArrowRight size={18}/></SiteLink></div><div className="program-list">{current.programs.map((p,i)=><article id={"program-"+p.id} key={p.id}><i aria-hidden="true">{p.icon}</i>{admin?<div><Field label="프로그램 이름" value={p.name} onChange={v=>editProgram(i,{name:v})}/><Field label="프로그램 설명" value={p.description} multiline onChange={v=>editProgram(i,{description:v})}/><Field label="표시 문자" value={p.icon} onChange={v=>editProgram(i,{icon:v})}/><button className="danger" onClick={()=>{if(window.confirm(p.name+" 프로그램을 삭제할까요?"))setField("programs",draft.programs.filter((_,n)=>n!==i))}}><Trash2 size={16}/>삭제</button></div>:<div><h2>{p.name}</h2><p>{p.description}</p></div>}</article>)}{admin&&<button className="add-button" onClick={()=>setField("programs",[...draft.programs,{id:crypto.randomUUID(),name:"새 프로그램",description:"",icon:"+"}])}><Plus size={17}/>프로그램 추가</button>}</div></section>}
   {page==="about"&&<section className="section about-section"><div className="about-mark"><School/></div><div><span className="kicker">ABOUT US</span>{admin?<><Field label="학교 이름" value={current.schoolName} onChange={v=>setField("schoolName",v)}/><Field label="학교 소개 제목" value={current.aboutTitle} onChange={v=>setField("aboutTitle",v)}/><Field label="학교 소개" value={current.aboutText} multiline onChange={v=>setField("aboutText",v)}/></>:<><h1>{current.aboutTitle}</h1><p>{current.aboutText}</p></>}{info()}<SiteLink className="detail-link" href="/teachers">교장·교감과 선생님 만나기<ArrowRight size={17}/></SiteLink></div></section>}
   {page==="schedule"&&<section className="section schedule-section"><div className="section-head left"><span className="kicker">SCHOOL LIFE</span>{admin?<>{textField("scheduleTitle","운영 안내 제목")}{textField("scheduleIntro","운영 안내 소개",true)}</>:<><h1>{pageText("scheduleTitle")}</h1><p>{pageText("scheduleIntro")}</p></>}</div>{info()}<div className="schedule-links"><SiteLink href="/classes"><strong>오전 한글학교</strong><span>1–4반과 성인반 학습 안내</span><ArrowRight/></SiteLink><SiteLink href="/programs"><strong>오후 방과후 수업</strong><span>학기별 프로그램 살펴보기</span><ArrowRight/></SiteLink></div></section>}
  </div>
  <footer><SiteImage src="/logo.png" alt=""/><div><strong>{current.schoolName}</strong><span>{current.affiliation}</span></div>{admin&&page==="about"?textField("footerText","하단 문구"):<p>{pageText("footerText")}</p>}{page==="home"&&<button ref={replayRef} className="replay-intro" type="button" onClick={()=>{window.scrollTo({top:0,behavior:"instant"});setIntroRun(n=>n+1);setIntroVisible(true)}}><RotateCcw size={15}/>책 열기 다시 보기</button>}</footer>
  {showLogin&&<div className="modal-backdrop" onMouseDown={()=>setShowLogin(false)}><form className="login-card" role="dialog" aria-modal="true" aria-labelledby="login-title" onSubmit={login} onMouseDown={e=>e.stopPropagation()}><button type="button" className="close" aria-label="로그인 창 닫기" onClick={()=>setShowLogin(false)}><X/></button><div className="lock"><LockKeyhole/></div><h2 id="login-title">운영자 모드</h2><p>기존 운영자 비밀번호를 입력해 주세요.</p><label>비밀번호<input autoFocus autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{message&&<span className="error" role="alert">{message}</span>}<button type="submit">운영자 모드 시작</button></form></div>}
 </main></SitePaths>;
}
