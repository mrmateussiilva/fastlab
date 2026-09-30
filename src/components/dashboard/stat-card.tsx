import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-start gap-4">
      <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
        <p className="text-2xl font-bold text-zinc-900 mt-1">{value}</p>
        {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
      </div>
    </div>
  );
}
