# GitHub Pages 정적 배포

현재 공개 Sites 사이트는 그대로 유지합니다. 이 저장소의 `docs/`는 별도의 GitHub Pages용 정적 사이트입니다. Cloudflare 계정, API, 데이터베이스, 환경변수가 필요하지 않습니다.

## 최초 게시

저장소 Settings → Pages → Build and deployment에서 다음을 선택하고 Save를 누릅니다.

- Source: Deploy from a branch
- Branch: main
- Folder: /docs

예상 주소: https://yeenkim-elly.github.io/MontrealSarangKoreanSchool/

Custom domain은 비워 둡니다. 도메인은 교회 허락 후 별도로 연결합니다.

## 내용 수정

1. `static/content.json`에서 학교·반·교직원·프로그램 내용을 수정합니다.
2. 사진을 `public/images/`에 추가한 뒤 `photo`에 `/images/파일명`을 적습니다.
3. Node 22.13 이상에서 저장소 의존성을 설치하고 `npm run build:static`을 실행합니다.
4. 변경된 원본과 `docs/` 전체를 함께 커밋합니다. Pages가 다시 게시합니다.

운영자 로그인과 서버 편집 기능은 정적 버전에 표시되지 않습니다. 기존 Sites 사이트의 운영자 기능은 변경하지 않습니다. 정적 내용은 자동 동기화되지 않습니다.

`docs/`에는 11개 사전 렌더링 HTML 페이지, 로컬 글꼴·이미지, 사이트맵, 검색 설명과 구조화 데이터가 포함됩니다. Google 검색 노출 시점과 순위는 보장되지 않습니다.
