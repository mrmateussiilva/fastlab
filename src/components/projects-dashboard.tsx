'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { FolderOpen, Plus, Trash2, Loader2, Clock, AlertCircle } from 'lucide-react';
import { useProjects, ProjectSummary } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';

interface ProjectsDashboardProps {
  onNewProject: () => void;
  onOpenProject: (projectId: string) => void;
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return 'agora mesmo';
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffH < 24) return `há ${diffH}h`;
  if (diffD === 1) return 'ontem';
  if (diffD < 7) return `há ${diffD} dias`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function ProjectsDashboard({ onNewProject, onOpenProject }: ProjectsDashboardProps) {
  const { isSignedIn } = useAuth();
  const { projects, loading, error, fetchProjects, deleteProject } = useProjects();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchProjects();
    }
  }, [isSignedIn, fetchProjects]);

  const handleDelete = async (project: ProjectSummary) => {
    if (confirmDeleteId !== project.id) {
      setConfirmDeleteId(project.id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }
    setDeletingId(project.id);
    await deleteProject(project.id);
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  if (!isSignedIn) return null;

  return (
    <section className="w-full py-16 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-zinc-900">
              Meus Projetos
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Seus cenários salvos na nuvem</p>
          </div>
          <Button
            onClick={onNewProject}
            className="h-9 px-5 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Novo projeto
          </Button>
        </div>

        {/* Estado de loading */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-zinc-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Carregando projetos...</span>
          </div>
        )}

        {/* Estado de erro */}
        {!loading && error && (
          <div className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-100 rounded-xl p-4 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
            <button onClick={fetchProjects} className="ml-auto underline underline-offset-2 hover:opacity-75 cursor-pointer">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !error && projects.length === 0 && (
          <div
            onClick={onNewProject}
            className="group border-2 border-dashed border-zinc-200 hover:border-orange-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
          >
            <div className="w-14 h-14 bg-zinc-100 group-hover:bg-orange-50 rounded-2xl flex items-center justify-center mb-4 transition-colors">
              <FolderOpen className="w-7 h-7 text-zinc-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <p className="font-medium text-zinc-700 mb-1">Nenhum projeto salvo ainda</p>
            <p className="text-zinc-400 text-sm">Clique aqui para criar seu primeiro cenário</p>
          </div>
        )}

        {/* Grid de projetos */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Card "Novo Projeto" */}
            <div
              onClick={onNewProject}
              className="group border-2 border-dashed border-zinc-200 hover:border-orange-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px] hover:shadow-sm"
            >
              <div className="w-10 h-10 bg-zinc-100 group-hover:bg-orange-50 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="text-sm font-medium text-zinc-600 group-hover:text-orange-600 transition-colors">
                Novo projeto
              </span>
            </div>

            {/* Cards de projetos existentes */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md flex flex-col"
                onClick={() => onOpenProject(project.id)}
              >
                {/* Thumbnail ou placeholder */}
                <div className="w-full h-32 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
                  {project.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.thumbnail_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FolderOpen className="w-10 h-10 text-orange-200" />
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex-1 flex flex-col">
                  <p className="text-sm font-semibold text-zinc-900 truncate mb-1">
                    {project.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-zinc-400 mt-auto">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeDate(project.updated_at)}</span>
                  </div>
                </div>

                {/* Ações (visíveis no hover) */}
                <div className="px-3 pb-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project);
                    }}
                    disabled={deletingId === project.id}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      confirmDeleteId === project.id
                        ? 'bg-red-600 text-white'
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {deletingId === project.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    {confirmDeleteId === project.id ? 'Confirmar' : 'Excluir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
