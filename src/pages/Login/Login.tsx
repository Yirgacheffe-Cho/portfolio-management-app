import { useLogin } from '@/hooks/auth/useLogin';

export default function Login() {
  const { login } = useLogin();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Portfolio Management App</h1>
        <button
          onClick={login}
          className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
        >
          구글로 로그인하기
        </button>
      </div>
    </div>
  );
}
