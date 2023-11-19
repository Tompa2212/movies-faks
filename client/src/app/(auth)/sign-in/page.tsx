import SignIn from '@/components/SignIn';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl gap-20 mx-auto md:px-20">
      <SignIn />
    </div>
  );
};

export default page;
