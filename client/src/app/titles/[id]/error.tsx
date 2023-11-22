'use client';
import React from 'react';

const error = ({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <h1 className="text-3xl">{error.message}</h1>;
};

export default error;
