# 2048 · CHANCE

같은 숫자를 합치는 2048 게임입니다. 설치·빌드 없이 실행됩니다.

## 실행
index.html을 더블클릭하세요. 키보드 방향키/WASD, 화면 방향 버튼, 모바일 스와이프로 조작합니다. Space 또는 일시정지 버튼으로 멈춥니다.

## 쿠폰 규칙
- 한 게임에서 **게임 시작 시의 최고기록을 처음 초과**하면 쿠폰 5장을 받습니다.
- 최초 플레이도 첫 점수를 얻으면 기록 갱신으로 인정합니다.
- 쿠폰 1장 사용: **현재 점수·최고기록을 유지**하고 보드를 새 숫자 2개로 초기화합니다.
- 쿠폰을 사용해도 같은 게임에서는 쿠폰이 다시 지급되지 않습니다.
- 새 게임은 점수와 보드를 초기화하며, 최고기록과 남은 쿠폰은 유지합니다.
- 게임오버 뒤에도 남은 쿠폰으로 다시 이어 할 수 있습니다.
- 게임 진행, 최고기록, 쿠폰은 브라우저 localStorage에 저장됩니다. 재방문 시 일시정지 상태로 이어집니다. 기록은 해당 브라우저/주소에 저장되며 기기 간 동기화되지 않습니다.
- 브라우저가 저장을 막으면 저장 불가 안내를 표시합니다.

## GitHub에 업로드
1. 새 저장소(예: game)를 만듭니다.
2. Add file → Upload files에서 **이 폴더 안의 파일들**을 업로드합니다. index.html이 저장소 최상위에 있어야 합니다.
3. Commit changes를 누릅니다. ZIP 파일 자체를 올리면 홈페이지로 실행되지 않습니다.

## Vercel에 게시
1. Vercel에 로그인한 뒤 Add New → Project에서 위 GitHub 저장소를 Import합니다.
2. Framework Preset은 **Other**, Root Directory는 저장소 루트로 선택합니다.
3. Build Command는 비워둡니다. Output Directory는 **.**입니다. 포함된 vercel.json이 이 설정을 지정합니다.
4. Deploy를 누르고 완료된 사이트 주소로 접속합니다.

공식 안내: https://vercel.com/docs/builds/configure-a-build

## 파일
- index.html: 화면 구성
- style.css: 반응형 디자인
- engine.js: 2048 이동·병합·쿠폰 규칙
- app.js: 조작·일시정지·저장
- favicon.svg: 아이콘
- vercel.json: Vercel 배포 설정

외부 라이브러리, 이미지 서비스, API 키가 필요 없습니다.
