'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '@/pages/login/LoginForm';

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* 로고 */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-lg">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Portfolio App
          </a>
        </div>

        {/* 로그인 폼 */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm withEmail={false} />
          </div>
        </div>
      </div>

      {/* 오른쪽 일러스트 (lg 이상) */}
      <div className="bg-muted relative hidden lg:flex items-center justify-center">
        <img
          src="/images/login-illustration.png"
          alt="로그인 로고"
          className="w-[300px] h-[300px] object-contain"
        />
      </div>
    </div>
  );
}
