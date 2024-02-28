#🐶Team4_of_Death 😸(Pet-Sitter)🐶

#✨프로젝트 소개
- 반려동물 걱정에 여행을 못가거나 따로 맡길 곳이 없는 집사들을 위한 편의성 웹어플리케이션

#😃프로젝트 의의
- 내새끼 PR--------

#🕰️개발기간
- 2024-02-23 ~ 2024-02-28

#👨‍👩‍👦‍👦 멤버구성 & 맡은 기능
- 김재연: 사용자CRUD(회원가입, 로그인, 로그아웃), nodemailer, 찜하기 등록,취소, 예약등록, 포인트 추가, 차감 내역조회, Redis연동
- 김주희: 트레이너 등록, 조회, 특정 조회, 수정, 삭제
- 김주영: 사용자 회원가입 프로필이미지 multer, awsS3
- 황세민: 리뷰 작성, 조회, 수정, 삭제, 일자별 예약 가능한 트레이너 조회
- 이재헌: nodemailer, 예약 가능한 날짜 조회, 예약된 날짜 조회, 수정, 삭제

#📌 주요 기능
- 회원가입: nodemailer를 통한 이메일 인증 회원가입
- 로그인: nodemailer로 이메일 인증을 완료한 회원이 로그인 가능
- 트레이너: 등록, 조회, 특정 트레이너 조회, 수정, 삭제, 찜하기 
- 리뷰: 리뷰 작성, 조회, 수정, 삭제 기능
- 예약: 예약하기, 트레이너 예약된 날짜 조회, 예약 가능한 날짜 조회, 수정, 삭제
- 포인트: 포인트 추가, 차감, 내 포인트 조회, 포인트 사용 내역 조회

# 🔒환경변수
- DATABASE_URL=
- PORT = 
- REDIS_PORT = 
- REDIS_HOST = 
- REDIS_PASSWORD = 
- REDIS_USERNAME = 
- REDIS = 
- SECRET_KEY = 
- EMILSERVICE = 
- USERMAIL = 
- USERPASS = 
- EMAIL_SECRET_KEY = 
- S3_ACCESS_KEY_ID=
- S3_SECRET_ACCESS_KEY=
- S3_BUCKET=
- S3_DEFAULT_IMAGE_PATH=

# 패키지
- npm

# 개발 환경
- Node.js
- Express
- Jest
- JS
- S3Route
- Redis
- Prisma

# API 명세서
- https://teamsparta.notion.site/fc5f89b8d79443139a00ede4ba0245d1?v=c64906aeeb6440dfb857a2cabb82e1dc

# ERD
- https://drawsql.app/teams/jaeheons-team/diagrams/pet-sitter-v2
