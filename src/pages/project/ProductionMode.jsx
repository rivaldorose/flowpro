import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shot, ShootSchedule, BudgetEntry, CrewMember } from '@/api/entities';
import { ClipboardList, CalendarDays, DollarSign, Users, Table, LayoutGrid, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetTab from '@/pages/BudgetTab';
import ContactsTab from '@/pages/ContactsTab';
import LocationsTab from '@/pages/LocationsTab';
import { format } from 'date-fns';

const SHOT_TYPES = {
  'WS': { label: 'WS', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'MS': { label: 'MS', color: 'bg-green-100 text-green-700 border-green-200' },
  'CU': { label: 'CU', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

/**
 * Production Mode - Production planning view
 * Migrated from ProductionPlanning page
 */
export default function ProductionMode({ project }) {
  const [activeTab, setActiveTab] = useState('shotlist');
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: shots = [] } = useQuery({
    queryKey: ['shots', project?.id],
    queryFn: () => Shot.filter({ project_id: project?.id }),
    enabled: !!project?.id,
  });

  const { data: shoots = [] } = useQuery({
    queryKey: ['shoots', project?.id],
    queryFn: () => ShootSchedule.filter({ project_id: project?.id }),
    enabled: !!project?.id,
  });

  const { data: budgetEntries = [] } = useQuery({
    queryKey: ['budgetEntries', project?.id],
    queryFn: () => BudgetEntry.filter({ project_id: project?.id }),
    enabled: !!project?.id,
  });

  const { data: crew = [] } = useQuery({
    queryKey: ['crew'],
    queryFn: () => CrewMember.list(),
  });

  // Group shots by scene
  const shotsByScene = React.useMemo(() => {
    const grouped = {};
    shots.forEach(shot => {
      const scene = shot.scene_number || 'Unknown';
      if (!grouped[scene]) {
        grouped[scene] = [];
      }
      grouped[scene].push(shot);
    });
    return grouped;
  }, [shots]);

  // Calculate budget totals
  const budgetTotal = budgetEntries.filter(e => e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const budgetSpent = budgetEntries.filter(e => !e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const budgetRemaining = budgetTotal - budgetSpent;

  const filteredShots = shots.filter(shot => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      shot.scene_description?.toLowerCase().includes(query) ||
      shot.shot_number?.toString().includes(query) ||
      shot.shot_type?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Production Planning</h1>
            <p className="text-gray-500 mt-1">{project?.title}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shots</p>
                <p className="text-2xl font-bold text-gray-900">{shots.length}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shoot Days</p>
                <p className="text-2xl font-bold text-gray-900">{shoots.length}</p>
              </div>
              <CalendarDays className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">€{budgetTotal.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crew Members</p>
                <p className="text-2xl font-bold text-gray-900">{crew.length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="shotlist">
              <ClipboardList className="w-4 h-4 mr-2" />
              Shot List
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <CalendarDays className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="budget">
              <DollarSign className="w-4 h-4 mr-2" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <Users className="w-4 h-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="locations">
              <MapPin className="w-4 h-4 mr-2" />
              Locations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shotlist" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Search shots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <Table className="w-4 h-4 mr-2" />
                    Table
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Grid
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {Object.entries(shotsByScene).map(([scene, sceneShots]) => (
                  <div key={scene}>
                    <h3 className="font-semibold text-gray-900 mb-2">Scene {scene}</h3>
                    <div className="space-y-2">
                      {sceneShots.filter(shot => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          shot.scene_description?.toLowerCase().includes(query) ||
                          shot.shot_number?.toString().includes(query)
                        );
                      }).map(shot => (
                        <div key={shot.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold w-20">Shot {shot.shot_number}</span>
                          <Badge className={SHOT_TYPES[shot.shot_type]?.color || 'bg-gray-100 text-gray-700'}>
                            {shot.shot_type || 'N/A'}
                          </Badge>
                          <span className="flex-1 text-sm text-gray-700">{shot.scene_description || 'No description'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredShots.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No shots found. Add shots to get started.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-4">
                {shoots.map(shoot => (
                  <div key={shoot.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {shoot.name || `Shoot Day ${format(new Date(shoot.shoot_date), 'MMM d')}`}
                        </h3>
                        <p className="text-sm text-gray-600">{format(new Date(shoot.shoot_date), 'EEEE, MMMM d, yyyy')}</p>
                      </div>
                      <Badge variant="outline">{shoot.shots_count || 0} shots</Badge>
                    </div>
                  </div>
                ))}
                {shoots.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No shoot days scheduled. Add a shoot day to get started.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <BudgetTab projectId={project?.id} />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab projectId={project?.id} />
          </TabsContent>

          <TabsContent value="locations">
            <LocationsTab projectId={project?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

