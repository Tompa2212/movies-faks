import SignUp from '@/components/SignUp';
import Icon from '@/components/ui/Icons';
import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl gap-20 mx-auto md:px-20">
      <SignUp />
    </div>
  );
};

export default page;
