'use client';
import { SessionUser } from '@/types/User';
import React, { useState } from 'react';

type Session = {
  user: SessionUser;
};

const sessionContext = React.createContext<
  | [Session | null, React.Dispatch<React.SetStateAction<Session | null>>]
  | undefined
>(undefined);

export const SessionProvider = ({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const [state, setState] = useState<Session | null>(session);

  return (
    <sessionContext.Provider value={[state, setState]}>
      {children}
    </sessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = React.useContext(sessionContext);

  if (ctx === undefined) {
    throw new Error('Use useSession hook inside SessionProvided');
  }

  return ctx;
};
