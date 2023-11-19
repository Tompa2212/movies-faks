'use client';
import React from 'react';
import { Button } from '../ui/Button';
import register from '@/actions/register';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '../ui/Toast';
import { useRouter } from 'next/navigation';

const Form = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async (data: FormData) => {
    try {
      await register(data);
      toast({
        title: 'Success',
        description: 'Account created, please login to continue.',
        action: (
          <ToastAction onClick={() => router.push('/sign-in')} altText="login">
            Login
          </ToastAction>
        )
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <form action={handleRegister} className="grid gap-6 text-left">
      {children}
    </form>
  );
};

const RegisterForm = () => {
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
          required
        />
      </div>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          name="firstName"
          required
          placeholder="John"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" type="text" name="lastName" placeholder="John" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="*********"
          required
        />
      </div>
      <Button isLoading={status.pending}>Register</Button>
    </Form>
  );
};

export default RegisterForm;
