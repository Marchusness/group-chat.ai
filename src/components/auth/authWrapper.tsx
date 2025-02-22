'use client';

import { ReactNode } from 'react';
import { useAuthUser } from '@/services/firebase/init';
import { LoginScreen } from './loginScreen';

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const user = useAuthUser();

  if (user) {
    return <>{children}</>;
  }

  return <LoginScreen />;
}
