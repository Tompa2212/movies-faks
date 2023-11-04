'use client';
import React from 'react';
import { DropdownMenuItem } from '../ui/DropdownMenu';
import Icon from '../ui/Icons';
import { signOut } from '@/actions/signout';

type Props = {};

const SignOutMenuItem = (props: Props) => {
  return (
    <DropdownMenuItem
      onSelect={(e: any) => {
        e.preventDefault();
        signOut();
      }}
      className="cursor-pointer"
    >
      <Icon name="LogOut" className="w-4 h-4 mr-2" />
      <span>Sign Out</span>
    </DropdownMenuItem>
  );
};

export default SignOutMenuItem;
