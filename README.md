# 📊 자산관리 포트폴리오 앱

개인의 금융자산을 통합 관리하고, 투자 포트폴리오를 리밸런싱하며, 실적을 시각화하는 **모바일 중심 자산관리 대시보드**입니다.

> 🔐 한국 금융감독원 기준 자산 분류를 기반으로 설계됨  
> 📈 리밸런싱 / 성과 분석 / 대시보드 시각화 / 티커 분석 제공

---

## 🚀 주요 기능

- **티커 분석**: 특정 주식/ETF 종목의 정보 확인
- **포트폴리오 시각화**: 자산별/섹터별 비중을 그래프로 제공
- **리밸런싱 도우미**: 목표 비중 설정 및 리밸런싱 내역 추천
- **성과 분석**: 월별/연도별 수익률 및 자산 증가 추이 시각화
- **자산 등록**: 금융자산(예금, 펀드, 주식 등)을 분류 기준에 맞춰 등록
- **Firebase 연동**: 실시간 데이터 동기화, 인증

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트엔드** | React 19, TypeScript, Tailwind CSS, Shadcn/UI |
| **상태관리** | Jotai (로컬 상태), React Query v5 (서버 상태) |
| **백엔드** | Firebase Modular SDK (Firestore, Auth) |
| **아이콘** | lucide-react |
| **차트** | react-chartjs-2, recharts 등 (시각화 목적별 선택) |

---

## 🧱 폴더 구조

\`\`\`
src/
├── components/        # UI 컴포넌트
├── hooks/             # 커스텀 훅
├── pages/             # 라우트 단위 페이지
├── services/firebase/ # 파이어베이스 연동
├── store/             # jotai 상태 관리
├── utils/             # 유틸 함수
\`\`\`

---

## 🧪 개발 가이드

- 컴포넌트는 모두 `shadcn/ui + tailwind`로 작성
- 상태는 jotai atom 단위로 분리, 서버 상태는 react-query 사용
- 함수 및 훅에는 **모든 주석 필수** (무엇, 왜, 주의점 포함)
- 반응형 대응 필수
- 아이콘은 lucide-react 사용

---

## 🧭 향후 계획 (Roadmap)

- [ ] 모바일 자산 등록 간소화 (OCR 기반?)
- [ ] 리밸런싱 백테스트 기능 추가
- [ ] 금융 API (예: 카카오뱅크, 토스) 연동
- [ ] 사용자 커스터마이징 기능 강화

---

## 📎 참고 문서

- [React 19 릴리즈 노트](https://react.dev/blog/2024/12/05/react-19)
- [Jotai 공식 문서](https://jotai.org/docs/introduction)
- [React Query v5 문서](https://tanstack.com/query/v5)
- [Firebase Modular SDK](https://firebase.google.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)

---

## 👨‍💻 개발

> 이 프로젝트는 포트폴리오 용도로 개발되었으며, 실제 금융 거래는 포함하지 않습니다.
