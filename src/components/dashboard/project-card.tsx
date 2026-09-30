import { Calendar, Trash2, Edit2, Play } from 'lucide-react';
import { ProjectSummary } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: ProjectSummary;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isConfirmingDelete: boolean;
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

// Simple hash function for consistent colors
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 85%)`;
}

export function ProjectCard({ project, onOpen, onDelete, isDeleting, isConfirmingDelete }: ProjectCardProps) {
  const bgColor = project.thumbnail_url ? 'transparent' : stringToColor(project.name);

  return (
    <div className="group bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-orange-200 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div 
        className="aspect-video w-full relative bg-zinc-100 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => onOpen(project.id)}
        style={{ backgroundColor: bgColor }}
      >
        {project.thumbnail_url ? (
          <img 
            src={project.thumbnail_url} 
            alt={project.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-zinc-600/50 flex flex-col items-center">
            <span className="font-serif text-3xl opacity-50">{project.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        
        {/* Overlay Play button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
            <Play className="w-5 h-5 text-orange-600 ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-zinc-900 line-clamp-1 group-hover:text-orange-700 transition-colors">
          {project.name}
        </h3>
        
        <div className="flex items-center text-xs text-zinc-500 mt-2 gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Editado {formatRelativeDate(project.updated_at)}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8 px-2 text-zinc-600 hover:text-orange-600 hover:bg-orange-50"
            onClick={() => onOpen(project.id)}
          >
            Abrir
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs h-8 px-2 ${
              isConfirmingDelete 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700' 
                : 'text-zinc-400 hover:text-red-600 hover:bg-red-50'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : isConfirmingDelete ? 'Tem certeza?' : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
