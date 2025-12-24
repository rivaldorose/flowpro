import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Calendar, ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const statusColors = {
  'Idea': 'bg-gray-100 text-gray-700 border-gray-200',
  'Script Writing': 'bg-sky-100 text-sky-700 border-sky-200',
  'Pre-Production': 'bg-blue-100 text-blue-700 border-blue-200',
  'Production': 'bg-orange-100 text-orange-700 border-orange-200',
  'Post-Production': 'bg-purple-100 text-purple-700 border-purple-200',
  'Done': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Published': 'bg-green-100 text-green-700 border-green-200',
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
      className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">{business?.name || 'Geen business'}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
      </div>

      {/* Platforms */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.platforms?.map((platform) => (
          <span 
            key={platform} 
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg border border-gray-200"
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
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${getStatusProgress(project.status)}%` }}
          />
        </div>
      </div>

      {/* Due date */}
      {project.due_date && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(project.due_date), 'd MMM yyyy', { locale: nl })}</span>
        </div>
      )}
    </Link>
  );
}