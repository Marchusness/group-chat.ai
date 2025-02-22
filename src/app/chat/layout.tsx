'use client';
import AuthWrapper from '@/components/auth/authWrapper';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <AuthWrapper>
      <main className="min-h-screen">
        {children}
      </main>
    </AuthWrapper>
  );
}
