'use client';
import React from 'react';
import { Button } from '../ui/Button';
import login from '@/actions/login';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'next/navigation';

const Form = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [, setSession] = useSession();
  const router = useRouter();

  const handleLogin = async (data: FormData) => {
    try {
      const user = await login(data);
      setSession({ user });
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Authorization error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <form action={handleLogin} className="grid gap-6 text-left">
      {children}
    </form>
  );
};

const LoginForm = () => {
  const status = useFormStatus();

  return (
    <Form>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="jsmith@mail.com"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="*********"
        />
      </div>
      <Button isLoading={status.pending}>Login</Button>
    </Form>
  );
};

export default LoginForm;
