'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { login } from '@/actions/login';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';

const Form = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const handleLogin = async (data: FormData) => {
    try {
      await login(data);
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

const UserAuthForm = () => {
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

export default UserAuthForm;
