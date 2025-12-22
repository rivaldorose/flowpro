import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FolderKanban, Calendar, Euro, FileText, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import MetricCard from '../components/dashboard/MetricCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import BudgetDonut from '../components/dashboard/BudgetDonut';
import UpcomingShootCard from '../components/dashboard/UpcomingShootCard';
import TaskWidget from '../components/tasks/TaskWidget';

export default function Dashboard() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => base44.entities.Business.list(),
  });

  const { data: scripts = [] } = useQuery({
    queryKey: ['scripts'],
    queryFn: () => base44.entities.Script.list(),
  });

  const { data: shoots = [] } = useQuery({
    queryKey: ['shoots'],
    queryFn: () => base44.entities.ShootSchedule.list('shoot_date'),
  });

  const { data: budgetEntries = [] } = useQuery({
    queryKey: ['budgetEntries'],
    queryFn: () => base44.entities.BudgetEntry.list(),
  });

  // Calculations
  const activeProjects = projects.filter(p => !['Done', 'Published'].includes(p.status));
  
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekShoots = shoots.filter(s => {
    const shootDate = new Date(s.shoot_date);
    return isWithinInterval(shootDate, { start: weekStart, end: weekEnd });
  });

  const upcomingShoots = shoots.filter(s => new Date(s.shoot_date) >= new Date()).slice(0, 5);

  const scriptsInProgress = scripts.filter(s => s.status !== 'Final');

  // Budget calculations
  const totalBudget = budgetEntries.filter(e => e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalSpent = budgetEntries.filter(e => !e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalRemaining = totalBudget - totalSpent;

  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});
  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  const currentProjects = projects.filter(p => 
    ['Pre-Production', 'Production', 'Post-Production'].includes(p.status)
  ).slice(0, 6);

  if (projectsLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 bg-[#22262b]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Production Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Week van {format(weekStart, 'd MMM', { locale: nl })} - {format(weekEnd, 'd MMM yyyy', { locale: nl })}
          </p>
        </div>
        <Link to={createPageUrl('Projects')}>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            Nieuw Project
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Actieve Projecten"
          value={activeProjects.length}
          icon={FolderKanban}
          color="emerald"
          trend="up"
          trendValue="+2 deze maand"
        />
        <MetricCard
          title="Shoots Deze Week"
          value={thisWeekShoots.length}
          icon={Calendar}
          color="blue"
        />
        <MetricCard
          title="Budget Resterend"
          value={`€${(totalRemaining / 1000).toFixed(1)}K`}
          subtitle={`van €${(totalBudget / 1000).toFixed(1)}K totaal`}
          icon={Euro}
          color="purple"
        />
        <MetricCard
          title="Scripts In Progress"
          value={scriptsInProgress.length}
          icon={FileText}
          color="orange"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Current Projects */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Lopende Projecten</h2>
            <Link 
              to={createPageUrl('Projects')} 
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Bekijk alle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {currentProjects.length === 0 ? (
            <div className="bg-[#22262b] rounded-2xl p-8 text-center border border-gray-800/50">
              <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Geen lopende projecten</p>
              <Link to={createPageUrl('Projects')}>
                <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600">
                  Start een nieuw project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  business={businessMap[project.business_id]} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Shoots & Tasks */}
        <div className="space-y-4">
          <TaskWidget />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Komende Shoots</h2>
              <Link 
                to={createPageUrl('Schedule')} 
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Planning <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50 space-y-3">
              {upcomingShoots.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Geen shoots gepland</p>
                </div>
              ) : (
                upcomingShoots.map(shoot => (
                  <UpcomingShootCard 
                    key={shoot.id} 
                    shoot={shoot} 
                    project={projectMap[shoot.project_id]} 
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <BudgetDonut total={totalBudget} spent={totalSpent} remaining={totalRemaining} />
    </div>
  );
}