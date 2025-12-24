import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Task, Project } from '@/api/entities';
import { CheckSquare, Clock, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const statusColors = {
  'To Do': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const priorityColors = {
  'Low': 'text-gray-500',
  'Medium': 'text-yellow-500',
  'High': 'text-red-500',
};

export default function TaskWidget() {
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
  });

  const { data: myTasks = [], isLoading } = useQuery({
    queryKey: ['myTasks', currentUser?.email],
    queryFn: () => Task.filter({ assigned_to: currentUser?.email }),
    enabled: !!currentUser?.email,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Project.list(),
  });

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  const incompleteTasks = myTasks.filter(t => t.status !== 'Done').slice(0, 5);

  const getDeadlineLabel = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'Verlopen';
    if (isToday(date)) return 'Vandaag';
    if (isTomorrow(date)) return 'Morgen';
    return format(date, 'd MMM', { locale: nl });
  };

  const getDeadlineColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'text-red-500';
    if (isToday(date)) return 'text-orange-500';
    if (isTomorrow(date)) return 'text-yellow-500';
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-700 rounded w-32" />
          <div className="h-4 bg-gray-700 rounded" />
          <div className="h-4 bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Mijn Taken</h3>
            <p className="text-sm text-gray-500">{incompleteTasks.length} actieve taken</p>
          </div>
        </div>
        <Link to={createPageUrl('Tasks')}>
          <ArrowRight className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
        </Link>
      </div>

      {incompleteTasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Geen openstaande taken</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incompleteTasks.map(task => (
            <Link
              key={task.id}
              to={createPageUrl(`ProjectDetail?id=${task.project_id}`)}
              className="block bg-[#1a1d21] rounded-lg p-3 hover:bg-[#1f2329] transition-colors border border-gray-800/50"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-white text-sm font-medium flex-1">{task.title}</p>
                <Badge variant="outline" className={statusColors[task.status]}>
                  {task.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">
                  {projectMap[task.project_id]?.title || 'Project'}
                </span>
                {task.due_date && (
                  <>
                    <span className="text-gray-700">•</span>
                    <div className={`flex items-center gap-1 ${getDeadlineColor(task.due_date)}`}>
                      <Clock className="w-3 h-3" />
                      <span>{getDeadlineLabel(task.due_date)}</span>
                    </div>
                  </>
                )}
                {task.priority && (
                  <>
                    <span className="text-gray-700">•</span>
                    <span className={priorityColors[task.priority]}>{task.priority}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}