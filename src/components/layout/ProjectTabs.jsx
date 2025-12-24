import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Layers, FileText, Film, ClipboardList, Upload, Settings } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'canvas', label: 'Canvas', icon: Layers },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'storyboard', label: 'Storyboard', icon: Film },
  { id: 'production', label: 'Production', icon: ClipboardList },
  { id: 'export', label: 'Export', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProjectTabs({ projectId, activeMode = 'canvas' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (mode) => {
    // Update URL without reloading
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('mode', mode);
    navigate(`/project/${projectId}?${searchParams.toString()}`, { replace: true });
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-14 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeMode} onValueChange={handleTabChange}>
          <TabsList className="h-12 bg-transparent p-0 w-full justify-start gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "h-11 px-4 rounded-md data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700",
                    "data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900",
                    "data-[state=inactive]:hover:bg-gray-50 transition-colors font-medium"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

