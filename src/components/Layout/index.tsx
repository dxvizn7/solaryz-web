import React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title = 'Dashboard' }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={title} />
        <main className="flex-1 bg-solar-dark overflow-y-auto">
          <div className="w-full px-8 py-6 flex flex-col gap-8">
          {children}
          </div>
        </main>
      </div>
    </div>
  );
}