# 📊 자산관리 포트폴리오 앱

개인의 금융 자산을 통합 관리하고, 투자 비중을 조절하며, 수익 흐름을 분석할 수 있는 **모바일 최적화 자산 관리 대시보드**입니다.

> 🔍 내가 가진 자산을 한눈에 보고,  
> 🧮 목표 비중에 맞춰 리밸런싱하며,  
> 📈 투자 수익률과 포트폴리오 흐름을 분석하는 구조


---

## 🚀 주요 기능

### ✅ 종목 분석 (AI 기반)
- 선택한 티커(주식/ETF)에 대해 **Gemini API를 활용한 요약 분석** 제공
- 최신 정보 기반 분석은 Perplexity를 수동 활용하는 구조로 구현
- 프롬프트 자동 생성 → Gemini 요약까지 이어지는 구조

### 📊 포트폴리오 시각화
- 전체 자산을 카테고리/섹터 기준으로 시각화
- 원형 차트 / 바 차트 / 퍼포먼스 요약 등 다양한 형태로 제공

### 🎯 리밸런싱 도우미
- 자산별 목표 비중을 입력하면, 현재 상태와 비교하여 리밸런싱 추천

### 📅 수익률 분석
- 월별/연도별 수익률 그래프 제공
- 자산별 증가 추이 / 평단가 / 보유 기간 등 분석
-  **Gemini API를 활용한 요약 분석** 제공
-  
### 📥 자산 등록
- 예금, 펀드, 주식, ETF 등 금융감독원 기준 자산 유형에 따라 입력
- 수동 입력 기반이지만 카테고리화 구조를 통해 직관적 사용 가능

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

## 🧪 개발 가이드

- 컴포넌트는 모두 `shadcn/ui + tailwind`로 작성
- 상태는 jotai atom 단위로 분리, 서버 상태는 react-query 사용
- 함수 및 훅에는 **모든 주석 필수** (무엇, 왜, 주의점 포함)
- 아이콘은 lucide-react 사용
- 
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
