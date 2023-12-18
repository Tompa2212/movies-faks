'use client';
import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SocketProvider } from './SocketProvider';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { ConfirmDialogProvider } from '@/components/confirm-dialog/ConfirmDialogProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <SocketProvider>
        <TooltipProvider>
          <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
        </TooltipProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
};

export default Providers;
