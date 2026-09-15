# GitHub에서 공개 배포하기

이 사이트는 서버에서 HTML을 생성하며, 운영자 인증·내용 저장·사진 업로드를 제공합니다. GitHub 저장소를 Cloudflare Workers Builds에 연결하면 소스 변경을 자동으로 공개 배포할 수 있습니다. GitHub Pages만으로는 현재 서버 기능을 실행할 수 없습니다.

## 준비된 내용

- `pnpm run build:cloudflare`: 사용자의 Cloudflare D1/R2를 연결한 배포 파일을 생성합니다.
- `pnpm run deploy:cloudflare`: 데이터베이스 마이그레이션을 적용하고 Worker를 배포합니다.
- 환경에 맞는 canonical URL, Open Graph, `robots.txt`, `sitemap.xml`과 학교 구조화 데이터를 제공합니다.
- 운영자 비밀번호는 서버 secret으로만 설정합니다. 소스나 빌드 변수에 넣지 않습니다.

## 계정에서 필요한 설정

1. [YeenKim-elly/MontrealSarangKoreanSchool](https://github.com/YeenKim-elly/MontrealSarangKoreanSchool) 저장소를 사용합니다. Cloudflare의 GitHub 연결에서 이 저장소에 접근하도록 허용합니다.
2. 본인 Cloudflare 계정에서 D1 데이터베이스와 R2 버킷을 생성합니다.
3. Workers Builds에서 GitHub 저장소의 `main` 브랜치를 연결합니다.
4. Node.js 24와 저장소에 지정된 pnpm 버전을 사용합니다. 설치 명령은 `pnpm install --frozen-lockfile`, 빌드 명령은 `pnpm run build:cloudflare`, 배포 명령은 `pnpm run deploy:cloudflare`입니다.
5. 다음 빌드 변수를 설정합니다. API 토큰은 Cloudflare의 보안 입력란에만 설정하고 코드에 넣지 않습니다. 배포 토큰에는 해당 Worker 배포와 D1 마이그레이션에 필요한 권한이 있어야 합니다.

| 변수 | 값 |
| --- | --- |
| `SARANG_WORKER_NAME` | `sarang-hangeul-school` 또는 선택한 Worker 이름 |
| `SARANG_D1_DATABASE_ID` | 본인 계정에서 생성한 D1 데이터베이스 ID |
| `SARANG_R2_BUCKET` | 생성한 R2 버킷 이름 |
| `PUBLIC_SITE_URL` | 실제 공개 HTTPS 주소, 마지막 `/`는 생략 가능 |
| `GOOGLE_SITE_VERIFICATION` | 선택 사항: Search Console에서 받은 HTML 메타태그의 `content` 값 |

6. Worker의 runtime secret에 `ADMIN_PASSWORD`를 설정한 뒤 방문자가 접근할 수 있도록 배포합니다. 비밀번호를 설정하지 않으면 운영자 로그인과 내용 변경은 허용되지 않습니다.

## 기존 데이터 이전

저장된 학교 내용과 사진은 현재 사이트의 D1/R2에 있으며 Git에 들어 있지 않습니다. 새 Cloudflare 계정으로 옮길 때는 **기존 콘텐츠와 사진을 먼저 내보내고 새 저장소에 복원**해야 합니다. 코드만 배포하면 기본 내용이 표시됩니다. 현재 사이트를 유지한 채 복사·확인한 후 새 주소를 사용합니다.

## Google 검색

공개 주소를 확정한 뒤 `PUBLIC_SITE_URL`을 그 주소로 설정하고 재배포합니다. Search Console에서 주소의 소유권을 확인하고 `/sitemap.xml`을 제출합니다. `/`, `/about`의 색인 생성을 요청할 수 있습니다. URL 이전 시 기존 주소에서 새 주소로의 리디렉션도 함께 설정합니다.

검색용 제목과 설명은 몬트리올 한글학교, 사랑한글학교, 소속 교회 정보를 자연스럽게 설명합니다. 검색 노출 여부와 순위는 Google이 결정하며 즉시 표시되거나 특정 순위가 보장되지는 않습니다.

공식 안내: [Cloudflare의 GitHub 연결](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/), [GitHub Pages의 범위](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Google 색인 생성 요청](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
