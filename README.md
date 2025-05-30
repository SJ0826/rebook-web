# 리북 (Re-Book)

## ◾ 프로젝트 개요

ReBook은 중고 책 거래를 위한 웹 애플리케이션입니다.  
프론트엔드는 **Next.js 기반**으로 개발되었으며, 사용자 친화적인 UI와 **실시간 채팅, 이미지 업로드, JWT 인증 기반 로그인** 등을 제공합니다.




## 🧱 기술 스택 

**프레임워크**: Next.js 15 (App Router)  
**언어**: TypeScript + React 19  
**스타일링**: Tailwind CSS v4 + DaisyUI + Prettier Tailwind 플러그인  
**상태관리**: TanStack Query 5 + Zustand  
**서버 통신**: Axios
**실시간 기능**: Socket.IO 기반 채팅  
**폼 & 애니메이션**: React Hook Form, Framer Motion  
**배포**: AWS Amplify
**코드 품질**: ESLint, Prettier, PostCSS



## ◾ 주요 기능

- 📚 **책 목록 / 상세 페이지**: 판매 중인 중고 책 목록 조회 및 상세 정보 확인
- 🔍 **검색 및 필터**: 제목, 상태 기준의 실시간 검색
- ❤️ **찜하기 기능**: 로그인 후 관심 책 찜 가능
- 💬 **실시간 채팅**: WebSocket 기반 채팅, 메시지 읽음 처리
- 👤 **회원가입/로그인/로그아웃**: JWT + RefreshToken + Cookie 방식 인증
- 🖼️ **이미지 업로드**: S3 + CloudFront를 통한 이미지 업로드
- 📱 **모바일 반응형**: 데스크탑/모바일 모두 대응



## 🔗 데모 링크

📦 [👉 프론트엔드 데모 보러가기](https://main.d2nh4o8zioz2s8.amplifyapp.com/)

> 백엔드는 AWS EC2 + PostgreSQL 기반 NestJS 서버와 연결되어 있습니다.



✅ 개발 포인트 및 회고
* useQuery, useMutation, queryClient.invalidateQueries 등 TanStack Query의 CRUD 패턴 학습
* 모바일 최적화 + 다양한 디바이스에서의 반응형 UI 테스트
* WebSocket 연결 최적화 (404, reconnect 대응)
* 인증 흐름 정립: SSR 환경에서 쿠키 접근 대응 학습
*  [[네트워크] RefreshToken을 왜 쿠키에 저장해야할까?](https://sj0826.github.io/network/network-RefreshToken%EC%9D%84-%EC%99%9C-%EC%BF%A0%ED%82%A4%EC%97%90-%EC%A0%80%EC%9E%A5%ED%95%B4%EC%95%BC%ED%95%A0%EA%B9%8C/)
