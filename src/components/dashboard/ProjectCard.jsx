import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Calendar, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const statusColors = {
  'Idea': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Script Writing': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Pre-Production': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Production': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Post-Production': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Published': 'bg-green-600/20 text-green-400 border-green-500/30',
};

const platformIcons = {
  'Instagram': '📸',
  'TikTok': '🎵',
  'YouTube': '▶️',
  'LinkedIn': '💼',
  'Facebook': '👥',
  'Website': '🌐',
  'Other': '📱',
};

const getStatusProgress = (status) => {
  const stages = ['Idea', 'Script Writing', 'Pre-Production', 'Production', 'Post-Production', 'Done', 'Published'];
  const index = stages.indexOf(status);
  return ((index + 1) / stages.length) * 100;
};

export default function ProjectCard({ project, business }) {
  return (
    <Link 
      to={createPageUrl(`ProjectDetail?id=${project.id}`)}
      className="block bg-[#22262b] rounded-2xl p-5 border border-gray-800/50 hover:border-gray-700/50 hover:bg-[#262a30] transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">{business?.name || 'Geen business'}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
      </div>

      {/* Platforms */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.platforms?.map((platform) => (
          <span 
            key={platform} 
            className="text-xs bg-gray-700/50 px-2 py-1 rounded-lg"
            title={platform}
          >
            {platformIcons[platform] || '📱'} {platform}
          </span>
        ))}
      </div>

      {/* Status */}
      <div className="mb-4">
        <Badge className={`${statusColors[project.status]} border font-medium`}>
          {project.status}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${getStatusProgress(project.status)}%` }}
          />
        </div>
      </div>

      {/* Due date */}
      {project.due_date && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(project.due_date), 'd MMM yyyy', { locale: nl })}</span>
        </div>
      )}
    </Link>
  );
}