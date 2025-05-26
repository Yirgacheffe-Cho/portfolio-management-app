import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '@/services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

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
          createdAt: new Date(),
        });

        console.log('Firestore에 사용자 정보가 저장되었습니다.');

        // 👉 로그인 성공 시 메인 페이지로 이동
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Portfolio Management App</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
        >
          구글로 로그인하기
        </button>
      </div>
    </div>
  );
};

export default Login;
