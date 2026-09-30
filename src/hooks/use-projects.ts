'use client';

import { useState, useCallback } from 'react';

export type ProjectSummary = {
  id: string;
  name: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectFull = ProjectSummary & {
  elements: unknown;
  environment: unknown;
};

export function useProjects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Erro ao carregar projetos');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProject = useCallback(async (id: string): Promise<ProjectFull | null> => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  const saveProject = useCallback(async (data: {
    id?: string;
    name: string;
    elements: unknown;
    environment: unknown;
    thumbnail_url?: string | null;
  }): Promise<ProjectFull | null> => {
    setSaving(true);
    setError(null);
    try {
      const isUpdate = !!data.id;
      const res = await fetch(isUpdate ? `/api/projects/${data.id}` : '/api/projects', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erro ao salvar projeto');
      const saved = await res.json();
      // Atualiza a lista local
      setProjects((prev) => {
        const exists = prev.find((p) => p.id === saved.id);
        if (exists) {
          return prev.map((p) => p.id === saved.id ? saved : p);
        }
        return [saved, ...prev];
      });
      return saved;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) return false;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  return { projects, loading, saving, error, fetchProjects, loadProject, saveProject, deleteProject };
}
