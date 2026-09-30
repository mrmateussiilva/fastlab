import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { Plus, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onNewProject: () => void;
}

export function DashboardHeader({ onNewProject }: DashboardHeaderProps) {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 shadow-sm w-full">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar ao início</span>
          </Link>
          
          <div className="h-6 w-px bg-zinc-200 hidden sm:block" />

          <div className="flex items-center gap-3">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 shadow-sm"
                }
              }}
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-zinc-900 leading-none">
                {user?.firstName ? `Olá, ${user.firstName}` : 'Minha Área'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onNewProject}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-5 shadow-sm shadow-orange-600/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Novo Cenário</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>
    </header>
  );
}
