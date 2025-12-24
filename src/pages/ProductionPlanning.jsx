import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { 
  ArrowLeft, Settings, Share2, Download, ClipboardList, CalendarDays, 
  DollarSign, Users, PackageOpen, Plus, Search, Filter, Table, LayoutGrid,
  MoreHorizontal, CheckCircle2, Circle, Image, ListVideo, Sparkles, Mail, Phone
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPageUrl } from '../utils';
import { format } from 'date-fns';
import BudgetTab from './BudgetTab';

const SHOT_TYPES = {
  'WS': { label: 'WS', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'MS': { label: 'MS', color: 'bg-green-100 text-green-700 border-green-200' },
  'CU': { label: 'CU', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

const SETUP_COMPLEXITY = {
  'Simple': { color: 'bg-green-500' },
  'Medium': { color: 'bg-orange-500' },
  'Complex': { color: 'bg-red-500' },
};

export default function ProductionPlanning() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('shotlist');
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShots, setSelectedShots] = useState([]);

  const urlParams = new URLSearchParams(location.search);
  const projectId = urlParams.get('project_id');

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  const { data: shots = [] } = useQuery({
    queryKey: ['shots', projectId],
    queryFn: () => base44.entities.Shot.list('-shot_number'),
    enabled: !!projectId,
  });

  const { data: shoots = [] } = useQuery({
    queryKey: ['shoots', projectId],
    queryFn: () => base44.entities.ShootSchedule.list('shoot_date'),
    enabled: !!projectId,
  });

  const { data: budgetEntries = [] } = useQuery({
    queryKey: ['budgetEntries', projectId],
    queryFn: () => base44.entities.BudgetEntry.list('-date'),
    enabled: !!projectId,
  });

  const { data: crew = [] } = useQuery({
    queryKey: ['crew'],
    queryFn: () => base44.entities.CrewMember.list('name'),
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

  const toggleShotSelection = (shotId) => {
    setSelectedShots(prev => 
      prev.includes(shotId) 
        ? prev.filter(id => id !== shotId)
        : [...prev, shotId]
    );
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 font-sans flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(createPageUrl('Projects'))}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
                {project?.title || 'No Project'}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-600">Production</span>
            </div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Production Planning</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-4.5 h-4.5" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export All
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="bg-white border-b border-gray-200 shrink-0 px-4">
        <div className="flex gap-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('shotlist')}
            className={`group relative py-3 px-1 text-xs font-medium transition-colors ${
              activeTab === 'shotlist' 
                ? 'text-purple-600 font-bold' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Shot List
            </div>
            {activeTab === 'shotlist' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-600 rounded-t-full"></span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`group relative py-3 px-1 text-xs font-medium transition-colors ${
              activeTab === 'schedule' 
                ? 'text-purple-600 font-bold' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Schedule
            </div>
            {activeTab === 'schedule' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-600 rounded-t-full"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('budget')}
            className={`group relative py-3 px-1 text-xs font-medium transition-colors ${
              activeTab === 'budget' 
                ? 'text-purple-600 font-bold' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget
            </div>
            {activeTab === 'budget' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-600 rounded-t-full"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('contacts')}
            className={`group relative py-3 px-1 text-xs font-medium transition-colors ${
              activeTab === 'contacts' 
                ? 'text-purple-600 font-bold' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </div>
            {activeTab === 'contacts' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-600 rounded-t-full"></span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('equipment')}
            className={`group relative py-3 px-1 text-xs font-medium transition-colors ${
              activeTab === 'equipment' 
                ? 'text-purple-600 font-bold' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <PackageOpen className="w-4 h-4" />
              Equipment
            </div>
            {activeTab === 'equipment' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-600 rounded-t-full"></span>
            )}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden relative bg-gray-50">
        
        {/* TAB 1: SHOT LIST */}
        {activeTab === 'shotlist' && (
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold text-gray-900">Shot List</h2>
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                  {shots.length} shots
                </span>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search shots..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 outline-none w-48"
                  />
                </div>
                <button className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 border border-dashed border-gray-200 rounded hover:bg-gray-50 transition-colors">
                  <Filter className="w-3 h-3" />
                  Filter
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-50 rounded p-0.5 border border-gray-200">
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`p-1 rounded transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700 shadow-sm transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add Shot
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto bg-white relative">
              <table className="w-full text-left border-collapse min-w-max">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 sticky top-0 z-20">
                  <tr>
                    <th className="p-3 border-b border-gray-200 w-10 sticky left-0 bg-gray-50 z-30 shadow-[1px_0_0_0_rgba(229,231,235,1)]">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="p-3 border-b border-gray-200 w-16">Scene</th>
                    <th className="p-3 border-b border-gray-200 w-16">Shot</th>
                    <th className="p-3 border-b border-gray-200 min-w-[240px]">Description</th>
                    <th className="p-3 border-b border-gray-200 w-24">Type</th>
                    <th className="p-3 border-b border-gray-200 w-24">Angle</th>
                    <th className="p-3 border-b border-gray-200 w-24">Move</th>
                    <th className="p-3 border-b border-gray-200 w-20">Lens</th>
                    <th className="p-3 border-b border-gray-200 w-20 text-right">Dur</th>
                    <th className="p-3 border-b border-gray-200 w-32">Equipment</th>
                    <th className="p-3 border-b border-gray-200 w-32">Cast</th>
                    <th className="p-3 border-b border-gray-200 w-32">Location</th>
                    <th className="p-3 border-b border-gray-200 w-24">Setup</th>
                    <th className="p-3 border-b border-gray-200 w-10"></th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-900 font-medium divide-y divide-gray-200">
                  {Object.entries(shotsByScene).map(([sceneNum, sceneShots]) => (
                    <React.Fragment key={sceneNum}>
                      {/* Scene Header */}
                      <tr className="bg-gray-50/80">
                        <td colSpan={14} className="px-3 py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-500 hover:text-gray-900">
                              <ArrowLeft className="w-3.5 h-3.5 rotate-[-90deg]" />
                            </button>
                            <span className="font-bold text-gray-900">SCENE {sceneNum}</span>
                            <span className="text-gray-500 font-normal">• {sceneShots[0]?.location || 'Location TBD'}</span>
                            <span className="ml-auto text-gray-500 font-mono text-[10px]">
                              Total: {sceneShots.reduce((sum, s) => sum + (parseInt(s.duration) || 0), 0)}s
                            </span>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Shots in Scene */}
                      {sceneShots.map((shot, idx) => (
                        <tr 
                          key={shot.id} 
                          className={`group hover:bg-purple-50/50 transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                          }`}
                        >
                          <td className="p-3 sticky left-0 bg-white group-hover:bg-purple-50/50 border-r border-gray-200 z-10">
                            <input 
                              type="checkbox" 
                              checked={selectedShots.includes(shot.id)}
                              onChange={() => toggleShotSelection(shot.id)}
                              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </td>
                          <td className="p-3 font-mono text-gray-500">{shot.scene_number || sceneNum}</td>
                          <td className="p-3 font-mono font-bold text-purple-600">{shot.shot_number || idx + 1}</td>
                          <td className="p-3">
                            <div className="truncate">{shot.scene_description || 'No description'}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] border ${
                              SHOT_TYPES[shot.shot_type]?.color || 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                              {shot.shot_type || 'WS'}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500">{shot.camera_angle || 'Eye'}</td>
                          <td className="p-3 text-gray-500">{shot.camera_move || 'Static'}</td>
                          <td className="p-3 font-mono text-gray-500">{shot.lens || '24mm'}</td>
                          <td className="p-3 text-right font-mono">{shot.duration || '8'}s</td>
                          <td className="p-3">
                            <div className="flex gap-1 items-center">
                              <span className="w-2 h-2 rounded-full bg-teal-500" title="Camera A"></span>
                              <span className="text-[10px] text-gray-500">Cam A</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-500">-</td>
                          <td className="p-3 truncate max-w-[100px]">{shot.location || 'TBD'}</td>
                          <td className="p-3">
                            <span className={`w-2 h-2 rounded-full inline-block mr-1 ${
                              SETUP_COMPLEXITY[shot.setup_complexity]?.color || SETUP_COMPLEXITY['Simple'].color
                            }`}></span>
                            {shot.setup_complexity || 'Simple'}
                          </td>
                          <td className="p-3 text-center">
                            <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-purple-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {shots.length === 0 && (
                    <tr>
                      <td colSpan={14} className="p-12 text-center text-gray-500">
                        No shots found. Add your first shot to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Floating Bulk Actions */}
            {selectedShots.length > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-4 z-50 text-xs font-medium">
                <span>{selectedShots.length} shots selected</span>
                <div className="h-4 w-px bg-white/20"></div>
                <button className="hover:text-purple-400 transition-colors">Move to Scene</button>
                <button className="hover:text-purple-400 transition-colors">Assign Equip</button>
                <button className="text-red-300 hover:text-red-400 transition-colors">Delete</button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold text-gray-900">Schedule</h2>
                <div className="flex items-center gap-2 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 cursor-pointer hover:border-purple-600/50 transition-colors">
                  <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-medium">Mar 15 - Mar 20, 2025</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700 shadow-sm transition-colors">
                  Smart Schedule
                  <Sparkles className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50 p-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-7 gap-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                </div>
                <div className="grid grid-cols-7 gap-4 h-[600px]">
                  {shoots.slice(0, 3).map((shoot, idx) => (
                    <div 
                      key={shoot.id}
                      className={`bg-white rounded-lg border-l-4 shadow-sm p-3 relative group hover:shadow-md transition-all cursor-pointer ${
                        idx === 0 ? 'border-l-purple-600' :
                        idx === 1 ? 'border-l-orange-500' :
                        'border-l-teal-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-900">
                          {format(new Date(shoot.shoot_date), 'd MMM')}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 rounded ${
                          idx === 0 ? 'bg-purple-100 text-purple-600' :
                          idx === 1 ? 'bg-orange-100 text-orange-600' :
                          'bg-teal-100 text-teal-600'
                        }`}>
                          DAY {idx + 1}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mb-1">{shoot.location || 'Location TBD'}</div>
                      <div className="text-[10px] text-gray-500 mb-3">
                        {shoot.start_time || '09:00'} - {shoot.end_time || '18:00'}
                      </div>
                      <div className="space-y-1">
                        <div className="bg-gray-100 text-[10px] px-1.5 py-0.5 rounded text-gray-900 truncate">
                          Sc {shoot.scene_numbers || '1'} - {shoot.location || 'Location'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUDGET */}
        {activeTab === 'budget' && (
          <BudgetTab projectId={projectId} />
        )}

        {/* TAB 4: CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <h2 className="text-sm font-bold text-gray-900">Directory ({crew.length})</h2>
              <div className="flex gap-2 text-xs">
                <button className="px-3 py-1 bg-gray-900 text-white rounded-full">All</button>
                <button className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full hover:border-gray-300">Cast</button>
                <button className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full hover:border-gray-300">Crew</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-50 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {crew.map((member) => (
                <div key={member.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      {member.name?.charAt(0) || 'C'}
                    </div>
                    <span className="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Crew</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{member.role}</p>
                  <div className="space-y-2 text-xs">
                    {member.email && (
                      <div className="flex items-center gap-2 text-gray-900 hover:text-purple-600 cursor-pointer transition-colors">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        {member.email}
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-gray-900 hover:text-purple-600 cursor-pointer transition-colors">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        {member.phone}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-500">
                    <span>Full Shoot</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EQUIPMENT */}
        {activeTab === 'equipment' && (
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
              <h2 className="text-sm font-bold text-gray-900">Equipment Inventory</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded hover:bg-black transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 hover:border-purple-600/50 transition-colors">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                    <Image className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold text-gray-900 truncate">RED Komodo 6K</h3>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 rounded border border-green-100">RESERVED</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Camera Pkg A • CinemaRent Co.</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-gray-500">
                      <span className="bg-gray-50 px-1 rounded border border-gray-200">Qty: 1</span>
                      <span>$500/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

