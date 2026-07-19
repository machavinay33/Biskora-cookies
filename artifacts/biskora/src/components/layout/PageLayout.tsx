import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-secondary selection:text-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
