import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { WhatsAppFloat } from './WhatsAppFloat';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-accent selection:text-accent-foreground">
      <Navigation />
      <main className="flex-grow flex flex-col pt-0">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
