import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Project, Business } from '@/api/entities';
import { ArrowLeft, Edit2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/components/layout/AppLayout';
import ProjectTabs from '@/components/layout/ProjectTabs';
import CanvasMode from './CanvasMode';
import ScriptMode from './ScriptMode';
import StoryboardMode from './StoryboardMode';
import ProductionMode from './ProductionMode';
import ExportMode from './ExportMode';
import SettingsMode from './SettingsMode';

const statusColors = {
  'Idea': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Script Writing': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Pre-Production': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Production': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Post-Production': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Published': 'bg-green-600/20 text-green-400 border-green-500/30',
};

export default function ProjectLayout() {
  const { id: projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get mode from URL search params
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'canvas';

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list(),
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Project not found</p>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

  const renderMode = () => {
    switch (mode) {
      case 'canvas':
        return <CanvasMode project={project} />;
      case 'script':
        return <ScriptMode project={project} />;
      case 'storyboard':
        return <StoryboardMode project={project} />;
      case 'production':
        return <ProductionMode project={project} />;
      case 'export':
        return <ExportMode project={project} />;
      case 'settings':
        return <SettingsMode project={project} />;
      default:
        return <CanvasMode project={project} />;
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                    <Badge className={statusColors[project.status]} variant="outline">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {businessMap[project.business_id]?.name || 'No business'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProjectTabs projectId={projectId} activeMode={mode} />

        {/* Mode Content */}
        <div className="flex-1 overflow-auto bg-gray-50 min-h-0">
          {renderMode()}
        </div>
      </div>
    </AppLayout>
  );
}

