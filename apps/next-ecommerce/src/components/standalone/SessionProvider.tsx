'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: ReactNode;
};

// NOTE : Adding session as a prop leads to auth call failures
const ClientSessionProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientSessionProvider;
