'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { FolderOpen, Sparkles, Loader2, AlertCircle, LayoutDashboard } from 'lucide-react';

import { useProjects } from '@/hooks/use-projects';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { ProjectCard } from '@/components/dashboard/project-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import MockupBuilder from '@/components/builder/mockup-builder';
import { Button } from '@/components/ui/button';

interface GenerationLimitStatus {
  limit: number;
  used: number;
  remaining: number;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const { projects, loading: projectsLoading, error: projectsError, fetchProjects, deleteProject } = useProjects();
  const [limitStatus, setLimitStatus] = useState<GenerationLimitStatus | null>(null);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [mode, setMode] = useState<'dashboard' | 'builder'>('dashboard');
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && mode === 'dashboard') {
      fetchProjects();
      
      // Fetch rate limit stats
      fetch('/api/generation-limit')
        .then(res => res.json())
        .then(data => setLimitStatus(data))
        .catch(console.error);
    }
  }, [isSignedIn, fetchProjects, mode]);

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }
    setDeletingId(id);
    await deleteProject(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const handleOpenProject = (id: string) => {
    setOpenProjectId(id);
    setMode('builder');
  };

  const handleNewProject = () => {
    setOpenProjectId(null);
    setMode('builder');
  };

  const handleBackToDashboard = () => {
    setOpenProjectId(null);
    setMode('dashboard');
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (mode === 'builder') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-zinc-900 flex flex-col relative overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
        <MockupBuilder
          onBackToHome={handleBackToDashboard}
          projectId={openProjectId ?? undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-zinc-900 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900 pb-20">
      <DashboardHeader onNewProject={handleNewProject} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-10">
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total de Projetos" 
            value={projectsLoading ? '-' : projects.length} 
            icon={FolderOpen} 
          />
          <StatCard 
            title="Gerações Hoje" 
            value={limitStatus ? limitStatus.used : '-'} 
            icon={LayoutDashboard} 
            description="Imagens geradas por IA"
          />
          <StatCard 
            title="Cota Restante" 
            value={limitStatus ? limitStatus.remaining : '-'} 
            icon={Sparkles} 
            description={`De ${limitStatus ? limitStatus.limit : '-'} gerações diárias`}
          />
        </div>

        {/* Projects Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-medium text-zinc-900">Meus Cenários</h2>
        </div>

        {projectsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3 bg-white rounded-3xl border border-zinc-100 shadow-sm">
            <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
            <span className="text-sm">Carregando seus projetos...</span>
          </div>
        ) : projectsError ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-red-600 bg-red-50 border border-red-100 rounded-3xl text-sm">
            <AlertCircle className="w-8 h-8 mb-3 opacity-80" />
            <span className="font-medium">Erro ao carregar os projetos</span>
            <span className="opacity-80 mt-1 mb-4">{projectsError}</span>
            <Button variant="outline" onClick={fetchProjects} className="bg-white hover:bg-red-50">
              Tentar novamente
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState onNewProject={handleNewProject} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id}
                project={project}
                onOpen={handleOpenProject}
                onDelete={handleDelete}
                isDeleting={deletingId === project.id}
                isConfirmingDelete={confirmDeleteId === project.id}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
