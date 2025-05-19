import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      // Firebase Auth로 Google 로그인 실행
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const { uid, displayName, email, photoURL } = result.user;

        // Firestore에 사용자 정보 저장
        await setDoc(doc(db, 'users', uid), {
          displayName,
          email,
          photoURL,
        });

        alert(`로그인 성공! 환영합니다, ${displayName}`);
        console.log('Firestore에 사용자 정보가 저장되었습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>구글로 로그인하기</button>
    </div>
  );
};

export default Login;
