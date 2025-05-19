# Portfolio Management App 🚀

### 🔍 프로젝트 소개

- 개인 포트폴리오 자산을 관리하고, 투자 현황을 시각적으로 분석하는 웹 애플리케이션

---

## 📦 **프로젝트 구조**

```
src/
├── components/             # 재사용 가능한 컴포넌트
├── pages/                  # 페이지 컴포넌트
├── services/               # Firebase 연동
├── store/                  # Jotai 상태 관리
└── App.tsx                 # 최상위 컴포넌트
```

---

## 🚀 **설치 및 실행 방법**

### 1️⃣ **패키지 설치**

```bash
npm install
```

### 2️⃣ **Firebase Emulator 실행**

```bash
firebase emulators:start --config ./config/firebase/firebase.json
```

- **Emulator UI:** [http://localhost:4000](http://localhost:4000)
- **Firestore:** [http://localhost:4000/firestore](http://localhost:4000/firestore)
- **Auth:** [http://localhost:4000/auth](http://localhost:4000/auth)

---

### 3️⃣ **Vite 개발 서버 실행**

```bash
npm run dev
```

- **URL:** [http://localhost:3000](http://localhost:3000)

---

### 📝 **테스트 방법**

1. PortfolioForm에 자산 정보를 입력
2. "추가하기" 버튼 클릭
3. Firebase Emulator UI에서 Firestore에 데이터 생성 확인

---

## ⚡️ **배포 방법**

1. 빌드 실행

   ```bash
   npm run build
   ```

2. Firebase 배포
   ```bash
   firebase deploy --only hosting
   ```

---

## 🛠 **기술 스택**

- **React 19**
- **Firebase** (Firestore, Auth, Hosting)
- **Vite**
- **Jotai** (상태 관리)

---

## 🔄 **CI/CD**

- GitHub Actions를 통해 Firebase Hosting에 자동 배포
- `main` 브랜치에 Push될 때마다 최신 상태로 자동 배포
