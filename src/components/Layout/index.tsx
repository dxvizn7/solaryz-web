import { Sidebar } from './sidebar';
import { Header } from './header';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title='Dashboard' />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Tudo que estiver dentro do Layout vai renderizar aqui (Saldo, Extrato, etc) */}
          <div className="max-w-5xl mx-auto w-full flex flex-col gap-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}