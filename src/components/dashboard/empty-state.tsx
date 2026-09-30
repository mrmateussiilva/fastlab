import { Plus, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onNewProject: () => void;
}

export function EmptyState({ onNewProject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white border border-zinc-100 border-dashed rounded-3xl">
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6 shadow-sm">
        <LayoutGrid className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-medium text-zinc-900 mb-2">Nenhum projeto ainda</h3>
      <p className="text-zinc-500 max-w-md mb-8">
        Comece criando o seu primeiro cenário de festa. Use o editor visual e gere versões fotorrealistas em minutos.
      </p>
      <Button 
        onClick={onNewProject}
        className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 shadow-md shadow-orange-600/20"
      >
        <Plus className="w-5 h-5 mr-2" />
        Criar meu primeiro projeto
      </Button>
    </div>
  );
}
