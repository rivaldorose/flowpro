import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, Business, Script, BudgetEntry, ShootSchedule, Shot, PostProduction } from '@/api/entities';
import { ArrowLeft, Edit2, Save, FileText, Euro, Calendar, Film, CheckSquare, Users, Video, MapPin, Upload, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import BudgetDonut from '../components/dashboard/BudgetDonut';
import ProductionTaskList from '../components/production/ProductionTaskList';
import CastingList from '../components/casting/CastingList';
import LocationList from '../components/location/LocationList';
import CommentSection from '../components/collaboration/CommentSection';
import DocumentSharing from '../components/collaboration/DocumentSharing';

const STATUSES = ['Idea', 'Script Writing', 'Pre-Production', 'Production', 'Post-Production', 'Done', 'Published'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Facebook', 'Website', 'Other'];
const CONTENT_TYPES = ['Video', 'Photo', 'Photo + Video', 'Reel', 'Story', 'Post'];
const BUDGET_CATEGORIES = ['Crew', 'Equipment', 'Location', 'Props', 'Post-Production', 'Other'];
const POST_STATUSES = ['Not Started', 'Rough Cut', 'Fine Cut', 'Color Grading', 'Sound Design', 'Final Export', 'Delivered'];

const statusColors = {
  'Idea': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Script Writing': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Pre-Production': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Production': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Post-Production': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Published': 'bg-green-600/20 text-green-400 border-green-500/30',
};

export default function ProjectDetail() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

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

  const { data: scripts = [] } = useQuery({
    queryKey: ['projectScripts', projectId],
    queryFn: () => Script.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const { data: budgetEntries = [] } = useQuery({
    queryKey: ['projectBudget', projectId],
    queryFn: () => BudgetEntry.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const { data: shoots = [] } = useQuery({
    queryKey: ['projectShoots', projectId],
    queryFn: () => ShootSchedule.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const { data: shots = [] } = useQuery({
    queryKey: ['projectShots', projectId],
    queryFn: () => Shot.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const { data: postProduction = [] } = useQuery({
    queryKey: ['projectPost', projectId],
    queryFn: () => PostProduction.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => Project.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setIsEditing(false);
    },
  });

  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

  // Budget calculations
  const totalBudget = budgetEntries.filter(e => e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalSpent = budgetEntries.filter(e => !e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalRemaining = totalBudget - totalSpent;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-[#22262b]" />
        <Skeleton className="h-96 bg-[#22262b]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Project niet gevonden</p>
        <Link to={createPageUrl('Projects')}>
          <Button className="mt-4">Terug naar projecten</Button>
        </Link>
      </div>
    );
  }

  const startEditing = () => {
    setEditData({ ...project });
    setIsEditing(true);
  };

  const saveChanges = () => {
    updateMutation.mutate(editData);
  };

  const togglePlatform = (platform) => {
    setEditData(prev => ({
      ...prev,
      platforms: prev.platforms?.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...(prev.platforms || []), platform]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('Projects')}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{project.title}</h1>
              <Badge className={statusColors[project.status]} variant="outline">
                {project.status}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">{businessMap[project.business_id]?.name}</p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-600 text-gray-300">
              Annuleren
            </Button>
            <Button onClick={saveChanges} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
              <Save className="w-4 h-4" />
              Opslaan
            </Button>
          </div>
        ) : (
          <Button onClick={startEditing} variant="outline" className="border-gray-600 text-gray-300 gap-2">
            <Edit2 className="w-4 h-4" />
            Bewerken
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#22262b] border border-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Overzicht
          </TabsTrigger>
          <TabsTrigger value="scripts" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <FileText className="w-4 h-4 mr-2" />
            Scripts & Taken
          </TabsTrigger>
          <TabsTrigger value="shots" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Film className="w-4 h-4 mr-2" />
            Shot List
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Euro className="w-4 h-4 mr-2" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Calendar className="w-4 h-4 mr-2" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <MapPin className="w-4 h-4 mr-2" />
            Locaties
          </TabsTrigger>
          <TabsTrigger value="casting" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Users className="w-4 h-4 mr-2" />
            Casting
          </TabsTrigger>
          <TabsTrigger value="post" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <CheckSquare className="w-4 h-4 mr-2" />
            Post
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Users className="w-4 h-4 mr-2" />
            Samenwerking
          </TabsTrigger>
          <TabsTrigger value="attachments" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <FileText className="w-4 h-4 mr-2" />
            Bijlagen
          </TabsTrigger>
          </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
            {isEditing ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organisatie</Label>
                    <Select 
                      value={editData.business_id} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, business_id: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {businesses.map(b => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLATFORMS.map(platform => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          checked={editData.platforms?.includes(platform)}
                          onCheckedChange={() => togglePlatform(platform)}
                        />
                        <label className="text-sm text-gray-300">{platform}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select 
                      value={editData.content_type} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, content_type: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map(ct => (
                          <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={editData.status} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, status: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prioriteit</Label>
                    <Select 
                      value={editData.priority} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, priority: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={editData.due_date}
                    onChange={(e) => setEditData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="bg-[#1a1d21] border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Beschrijving</Label>
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-[#1a1d21] border-gray-700"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Content Type</p>
                    <p className="font-medium text-white">{project.content_type || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prioriteit</p>
                    <p className="font-medium text-white">{project.priority || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-medium text-white">
                      {project.due_date ? format(new Date(project.due_date), 'd MMM yyyy', { locale: nl }) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Aangemaakt</p>
                    <p className="font-medium text-white">
                      {format(new Date(project.created_date), 'd MMM yyyy', { locale: nl })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {project.platforms?.map(p => (
                      <Badge key={p} variant="outline" className="border-gray-600 text-gray-300">
                        {p}
                      </Badge>
                    )) || <span className="text-gray-500">-</span>}
                  </div>
                </div>

                {project.description && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Beschrijving</p>
                    <p className="text-gray-300">{project.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#22262b] rounded-xl p-4 border border-gray-800/50">
              <p className="text-2xl font-bold text-white">{scripts.length}</p>
              <p className="text-sm text-gray-500">Scripts</p>
            </div>
            <div className="bg-[#22262b] rounded-xl p-4 border border-gray-800/50">
              <p className="text-2xl font-bold text-white">{shoots.length}</p>
              <p className="text-sm text-gray-500">Shoots</p>
            </div>
            <div className="bg-[#22262b] rounded-xl p-4 border border-gray-800/50">
              <p className="text-2xl font-bold text-white">{shots.length}</p>
              <p className="text-sm text-gray-500">Shots</p>
            </div>
            <div className="bg-[#22262b] rounded-xl p-4 border border-gray-800/50">
              <p className="text-2xl font-bold text-emerald-400">€{totalRemaining.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Budget Over</p>
            </div>
          </div>
        </TabsContent>

        {/* Scripts Tab */}
        <TabsContent value="scripts" className="space-y-4">
          <ProductionTaskList projectId={projectId} />
          
          {scripts.length === 0 ? (
            <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nog geen scripts voor dit project</p>
              <Link to={createPageUrl('Scripts')}>
                <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600">
                  Ga naar Scripts
                </Button>
              </Link>
            </div>
          ) : (
            scripts.map(script => (
              <div key={script.id} className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{script.title}</h3>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">v{script.version}</Badge>
                </div>
                {script.content && (
                  <p className="text-sm text-gray-400 line-clamp-4 whitespace-pre-wrap">{script.content}</p>
                )}
              </div>
            ))
          )}
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <BudgetDonut total={totalBudget} spent={totalSpent} remaining={totalRemaining} />
          
          <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
            <h3 className="font-semibold text-white mb-4">Budget Items</h3>
            {budgetEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nog geen budget entries</p>
            ) : (
              <div className="space-y-2">
                {budgetEntries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-lg">
                    <div>
                      <p className="text-white">{entry.description || entry.category}</p>
                      <p className="text-xs text-gray-500">{entry.category}</p>
                    </div>
                    <p className={`font-medium ${entry.is_budget ? 'text-emerald-400' : 'text-white'}`}>
                      {entry.is_budget ? '+' : '-'}€{entry.amount?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          {shoots.length === 0 ? (
            <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nog geen shoots gepland</p>
              <Link to={createPageUrl('Schedule')}>
                <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600">
                  Ga naar Planning
                </Button>
              </Link>
            </div>
          ) : (
            shoots.map(shoot => (
              <div key={shoot.id} className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{shoot.location}</p>
                    <p className="text-sm text-gray-500">{shoot.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-medium">
                      {format(new Date(shoot.shoot_date), 'd MMM yyyy', { locale: nl })}
                    </p>
                    <p className="text-sm text-gray-500">{shoot.start_time} - {shoot.end_time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Shot List Tab */}
        <TabsContent value="shots" className="space-y-4">
          {shots.length === 0 ? (
            <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
              <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nog geen shots toegevoegd</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {shots.map(shot => (
                <div key={shot.id} className="bg-[#22262b] rounded-xl border border-gray-800/50 overflow-hidden">
                  {shot.reference_image && (
                    <img 
                      src={shot.reference_image} 
                      alt={`Shot ${shot.shot_number}`}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-400 font-semibold">Shot #{shot.shot_number}</span>
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        {shot.status}
                      </Badge>
                    </div>
                    <p className="text-white text-sm mb-2">{shot.scene_description}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="text-gray-500">{shot.shot_type}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500">{shot.camera_angle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <LocationList projectId={projectId} />
        </TabsContent>

        {/* Casting Tab */}
        <TabsContent value="casting">
          <CastingList projectId={projectId} />
        </TabsContent>

        {/* Post Production Tab */}
        <TabsContent value="post" className="space-y-4">
          {postProduction.length === 0 ? (
            <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
              <CheckSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nog geen post-productie gestart</p>
            </div>
          ) : (
            postProduction.map(post => (
              <div key={post.id} className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-white">{post.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POST_STATUSES.map((status, idx) => {
                    const currentIdx = POST_STATUSES.indexOf(post.status);
                    const isCompleted = idx <= currentIdx;
                    return (
                      <div 
                        key={status}
                        className={`px-3 py-1 rounded-full text-xs ${
                          isCompleted 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-gray-700/50 text-gray-500'
                        }`}
                      >
                        {status}
                      </div>
                    );
                  })}
                </div>
                {post.feedback && (
                  <div className="mt-4 p-4 bg-[#1a1d21] rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Feedback</p>
                    <p className="text-gray-300 text-sm">{post.feedback}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="text-lg font-semibold text-white mb-4">Reacties</h3>
              <CommentSection projectId={projectId} />
            </div>

            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <DocumentSharing projectId={projectId} />
            </div>
          </div>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Project Bijlagen</h3>
            <Link to={createPageUrl(`Storyboard?project_id=${projectId}`)}>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                View Storyboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50 text-center">
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Upload bijlagen voor dit project</p>
              <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                <Plus className="w-4 h-4" />
                Upload Bestand
              </Button>
            </div>
          </div>
        </TabsContent>
        </Tabs>
        </div>
        );
        }