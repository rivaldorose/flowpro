import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Project, Business, User } from '@/api/entities';
import { 
  Clapperboard, Search, Bell, Plus, X, MoreHorizontal, Film, 
  Tv, Music, FileText, LayoutGrid, List, ChevronDown, 
  CheckCircle2, Camera, Video, Megaphone, User as UserIcon, Settings, LogOut,
  Layers, ArrowRight, FileSearch, Mic
} from 'lucide-react';
import { createPageUrl } from '../utils';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

// Status badge colors mapping
const statusBadgeColors = {
  'Production': 'bg-orange-100 text-orange-700 border-orange-200',
  'Pre-Production': 'bg-purple-100 text-purple-700 border-purple-200',
  'Post-Production': 'bg-teal-50 text-teal-700 border-teal-200',
  'Done': 'bg-green-100 text-green-700 border-green-200',
  'Published': 'bg-green-100 text-green-700 border-green-200',
  'Idea': 'bg-gray-100 text-gray-700 border-gray-200',
  'Script Writing': 'bg-blue-100 text-blue-700 border-blue-200',
};

// Project type icons
const projectTypeIcons = {
  'Short Film': Film,
  'Documentary': Tv,
  'Music Video': Music,
  'Commercial': Megaphone,
  'Photoshoot': Camera,
  'Other': FileText,
};

const getStatusProgress = (status) => {
  const stages = ['Idea', 'Script Writing', 'Pre-Production', 'Production', 'Post-Production', 'Done', 'Published'];
  const index = stages.indexOf(status);
  return ((index + 1) / stages.length) * 100;
};

const getProjectType = (project) => {
  // Try to determine from content_type or default
  if (project.content_type?.includes('Video')) return 'Short Film';
  if (project.content_type?.includes('Photo')) return 'Photoshoot';
  return 'Other';
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    project_type: 'Short Film',
    template: 'blank',
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Project.list('-created_date'),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list(),
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
  });

  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return !['Done', 'Published'].includes(p.status);
    if (filterStatus === 'completed') return ['Done', 'Published'].includes(p.status);
    return p.status === filterStatus;
  });

  const activeProjects = projects.filter(p => !['Done', 'Published'].includes(p.status));

  const handleCreateProject = () => {
    // Navigate to projects page with new project form
    navigate(createPageUrl('Projects'));
    setShowNewProjectModal(false);
  };

  const ProjectCard = ({ project }) => {
    const projectType = getProjectType(project);
    const IconComponent = projectTypeIcons[projectType] || FileText;
    const progress = getStatusProgress(project.status);
    const statusColor = statusBadgeColors[project.status] || statusBadgeColors['Idea'];
    const isCompleted = ['Done', 'Published'].includes(project.status);

    return (
      <article 
        onClick={() => navigate(createPageUrl(`ProjectDetail?id=${project.id}`))}
        className="project-card group bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer relative"
      >
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm backdrop-blur-sm bg-opacity-90 ${statusColor}`}>
            {project.status}
          </span>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Clapperboard className="w-16 h-16 text-purple-300" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight group-hover:text-purple-600 transition-colors">
              {project.title}
            </h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle more options
              }}
              className="text-gray-300 hover:text-gray-900"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            {project.updated_date 
              ? `Last edited ${format(new Date(project.updated_date), 'MMM d', { locale: nl })}`
              : project.created_date 
              ? `Created ${format(new Date(project.created_date), 'MMM d', { locale: nl })}`
              : 'No date'}
          </p>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  isCompleted ? 'bg-green-500' : 
                  project.status === 'Production' ? 'bg-orange-500' :
                  project.status === 'Pre-Production' ? 'bg-purple-600' :
                  'bg-purple-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500">
              {isCompleted ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Done
                </span>
              ) : (
                `${Math.round(progress)}%`
              )}
            </span>
          </div>

          {/* Footer: Team & Type */}
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="flex -space-x-2 overflow-hidden">
              {businessMap[project.business_id] && (
                <div className="h-7 w-7 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-[10px] font-medium text-purple-700">
                  {businessMap[project.business_id].name?.charAt(0) || 'B'}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <IconComponent className="w-3.5 h-3.5" />
              <span>{projectType}</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all">
              <Clapperboard className="w-4 h-4" strokeWidth={2} />
            </div>
            <span className="font-serif font-semibold text-xl tracking-tight text-gray-900">Flow Pro</span>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="relative group w-full max-w-[400px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full bg-gray-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-purple-600/20 rounded-full py-2 pl-10 pr-12 text-sm outline-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:shadow-[0_4px_12px_rgba(107,70,193,0.1)] transition-all placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="hidden lg:inline-flex items-center h-5 px-1.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-5">
            {/* Notifications */}
            <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>

            {/* New Project Button */}
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              <span>New Project</span>
            </button>

            {/* Avatar */}
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {currentUser?.photo ? (
                  <img src={currentUser.photo} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xs font-medium">
                    {currentUser?.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                <div className="py-1">
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600">
                    <UserIcon className="w-4 h-4" /> Profile
                  </a>
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600">
                    <Settings className="w-4 h-4" /> Settings
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Log Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight mb-2">
            Your Projects
          </h1>
          <p className="text-gray-500 font-sans text-base">
            Welcome back{currentUser?.full_name ? `, ${currentUser.full_name.split(' ')[0]}` : ''}. You have {activeProjects.length} {activeProjects.length === 1 ? 'project' : 'projects'} in production.
          </p>
        </header>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex items-center">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Filter Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:border-gray-300 transition-colors">
                <span>
                  {filterStatus === 'all' ? 'All Projects' : 
                   filterStatus === 'active' ? 'Active' : 
                   filterStatus === 'completed' ? 'Completed' : 
                   filterStatus}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block z-10">
                <div 
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
                    filterStatus === 'all' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
                  }`}
                >
                  All Projects
                </div>
                <div 
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
                    filterStatus === 'active' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
                  }`}
                >
                  Active
                </div>
                <div 
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
                    filterStatus === 'completed' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
                  }`}
                >
                  Completed
                </div>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors">
              Recent Activity
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 aspect-video animate-pulse">
                <div className="h-full bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <Clapperboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first project</p>
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-full shadow-lg shadow-purple-500/20 transition-all"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-12">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {/* New Project Card */}
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="group border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center aspect-video md:aspect-auto cursor-pointer hover:border-purple-600/50 hover:bg-purple-50/30 transition-all min-h-[300px]"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all mb-4 text-gray-400 group-hover:text-purple-600">
                <Plus className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-gray-600 group-hover:text-purple-600 transition-colors">
                Create New Project
              </h3>
              <p className="text-sm text-gray-400 mt-1">Start from scratch or template</p>
            </button>
          </div>
        )}

        {/* Quick Templates */}
        <section className="border-t border-gray-200 pt-8 mt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Quick Templates</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                setNewProjectData({ ...newProjectData, project_type: 'Short Film' });
                setShowNewProjectModal(true);
              }}
              className="flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Clapperboard className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-900">Short Film</span>
            </button>
            <button 
              onClick={() => {
                setNewProjectData({ ...newProjectData, project_type: 'Photoshoot' });
                setShowNewProjectModal(true);
              }}
              className="flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Camera className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-900">Photoshoot</span>
            </button>
            <button 
              onClick={() => {
                setNewProjectData({ ...newProjectData, project_type: 'Music Video' });
                setShowNewProjectModal(true);
              }}
              className="flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-8 h-8 rounded bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-900">Music Video</span>
            </button>
            <button 
              onClick={() => {
                setNewProjectData({ ...newProjectData, project_type: 'Commercial' });
                setShowNewProjectModal(true);
              }}
              className="flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-8 h-8 rounded bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-900">Script Only</span>
            </button>
          </div>
        </section>
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setShowNewProjectModal(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-gray-900">Create New Project</h2>
              <button 
                onClick={() => setShowNewProjectModal(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. The Grand Hotel" 
                  value={newProjectData.title}
                  onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Type Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Project Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Short Film', 'Commercial', 'Other'].map(type => (
                    <label key={type} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="ptype" 
                        className="peer hidden" 
                        checked={newProjectData.project_type === type}
                        onChange={() => setNewProjectData({ ...newProjectData, project_type: type })}
                      />
                      <div className="px-3 py-2 text-center text-sm border border-gray-200 rounded-lg peer-checked:bg-purple-600/10 peer-checked:border-purple-600 peer-checked:text-purple-600 hover:bg-gray-50 transition-all">
                        {type}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Template Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Start with</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewProjectModal(false);
                      navigate('/templates/blank');
                    }}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-600/50 transition-colors group text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-purple-600/10 group-hover:text-purple-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Blank Project</p>
                      <p className="text-xs text-gray-500">Start from scratch</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateSelection(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-600/50 transition-colors group text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600/10">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Use a Template</p>
                      <p className="text-xs text-gray-500">Pre-production, Shot lists, etc.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setShowNewProjectModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateProject}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all transform active:scale-95"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
