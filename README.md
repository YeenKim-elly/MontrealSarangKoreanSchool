# 몬트리올 사랑한글학교

몬트리올 사랑교회 소속 사랑한글학교의 공개 웹사이트입니다.

**현재 홈페이지:** [sarang-hangeul-school.yeen0528.chatgpt.site](https://sarang-hangeul-school.yeen0528.chatgpt.site)

## 제공 기능

- 학교 소개, 한글 1–4반·성인반, 교장·교감·선생님 소개, 수업 일정, 오후 방과후 프로그램
- 드롭다운 메뉴를 통한 개별 페이지 이동과 모바일 메뉴
- 화면 전체의 책 표지가 말리며 열리는 애니메이션, 붓글씨와 바탕체 디자인
- 운영자 비밀번호 인증, 페이지 내용 수정, 선생님 사진 업로드
- 검색용 제목·설명, canonical URL, 학교 구조화 데이터, `robots.txt`, `sitemap.xml`

오전 한글 수업은 매주 일요일 **09:50–10:40**, 몬트리올 사랑교회 건물에서 진행합니다.

## 배포

이 저장소에는 사이트 코드와 공개 이미지·서체가 들어 있습니다. 현재 공개 사이트는 위 주소에서 운영되며, **GitHub에 코드를 올리는 것만으로 현재 사이트가 자동 갱신되지는 않습니다.**

GitHub를 통한 자동 배포는 **Cloudflare Workers Builds + D1 + R2** 연결을 사용하도록 준비했습니다. 운영자 인증과 내용·사진 저장은 서버 기능이므로 GitHub Pages만으로는 전체 기능을 실행할 수 없습니다.

**[계정 연결·자동 배포·기존 데이터 이전 안내 →](deployment/GITHUB.md)**

## 개발 및 검증

Node.js 24와 `package.json`에 지정된 pnpm 버전을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm exec tsc --noEmit --incremental false
node --test tests/book-motion.test.mjs
pnpm build
```

Cloudflare 계정의 리소스와 환경 변수를 설정한 뒤에는 다음 명령으로 배포합니다.

```sh
pnpm run build:cloudflare
pnpm run deploy:cloudflare
```

## 운영 데이터와 비밀번호

- 운영자 비밀번호는 배포 환경의 `ADMIN_PASSWORD` secret으로 설정합니다. 저장소에는 비밀번호를 넣지 않습니다.
- 운영자가 저장한 최신 내용과 업로드 사진은 데이터베이스·파일 저장소에 있습니다. 새 호스팅으로 옮길 때 별도로 이전해야 합니다.
- 현재 공개 주소를 변경할 때 `PUBLIC_SITE_URL`과 검색 등록 설정을 함께 갱신합니다.

## 서체

붓글씨는 Nanum Brush Script, 본문은 Gowun Batang을 바탕으로 한 서체를 사용합니다. 서체 라이선스는 [`public/fonts`](public/fonts)에 포함되어 있습니다.
