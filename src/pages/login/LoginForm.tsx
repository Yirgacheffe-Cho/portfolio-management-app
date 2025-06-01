import { LogIn } from 'lucide-react';
import { useLogin } from '@/hooks/auth/useLogin';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps extends React.ComponentProps<'form'> {
  withEmail?: boolean;
}

export function LoginForm({
  className,
  withEmail = false,
  ...props
}: LoginFormProps) {
  const { login } = useLogin();

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-muted-foreground text-sm text-balance">
          자산관리를 시작하려면 로그인하세요.
        </p>
      </div>

      <div className="grid gap-6">
        {withEmail && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              이메일로 로그인
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                또는
              </span>
            </div>
          </>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={login}
        >
          <LogIn className="w-4 h-4 mr-2" />
          구글로 로그인하기
        </Button>
      </div>

      {/* <div className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{' '}
        <a href="#" className="underline underline-offset-4">
          회원가입
        </a>
      </div> */}
    </form>
  );
}
