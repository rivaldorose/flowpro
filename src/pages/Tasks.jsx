import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, CheckSquare, Filter, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentSection from '../components/collaboration/CommentSection';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { toast } from "sonner";
import { createPageUrl } from '../utils';

const STATUSES = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const statusColors = {
  'To Do': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const priorityColors = {
  'Low': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'High': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Tasks() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ project: 'all', status: 'all', assignedTo: 'all', search: '' });
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    assigned_to: '',
    status: 'To Do',
    priority: 'Medium',
    due_date: ''
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const task = await base44.entities.Task.create(data);
      
      if (data.assigned_to && data.assigned_to !== currentUser?.email) {
        const project = projects.find(p => p.id === data.project_id);
        await base44.entities.Notification.create({
          user_email: data.assigned_to,
          type: 'task_assigned',
          title: 'Nieuwe taak toegewezen',
          message: `Je hebt de taak "${data.title}" gekregen voor project ${project?.title || 'Onbekend'}`,
          link: createPageUrl(`ProjectDetail?id=${data.project_id}`),
          related_id: task.id
        });
      }
      
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      resetForm();
      toast.success('Taak aangemaakt');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, oldData }) => {
      const updated = await base44.entities.Task.update(id, data);
      
      if (data.status !== oldData.status && data.assigned_to) {
        const project = projects.find(p => p.id === data.project_id);
        await base44.entities.Notification.create({
          user_email: data.assigned_to,
          type: 'status_update',
          title: 'Taak status gewijzigd',
          message: `Status van "${data.title}" is nu: ${data.status}`,
          link: createPageUrl(`ProjectDetail?id=${data.project_id}`),
          related_id: id
        });
      }
      
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Taak bijgewerkt');
    },
  });

  const resetForm = () => {
    setFormData({
      project_id: '',
      title: '',
      description: '',
      assigned_to: '',
      status: 'To Do',
      priority: 'Medium',
      due_date: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleStatusChange = (task, newStatus) => {
    updateMutation.mutate({ 
      id: task.id, 
      data: { ...task, status: newStatus },
      oldData: task
    });
  };

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
  const userMap = users.reduce((acc, u) => ({ ...acc, [u.email]: u }), {});

  const filteredTasks = tasks.filter(t => {
    if (filters.project !== 'all' && t.project_id !== filters.project) return false;
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    if (filters.assignedTo !== 'all' && t.assigned_to !== filters.assignedTo) return false;
    if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const groupedByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = filteredTasks.filter(t => t.status === status);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Taken</h1>
          <p className="text-gray-500 mt-1">{tasks.length} taken totaal</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Taak
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Zoek taken..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 bg-[#1a1d21] border-gray-700 text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={filters.project} onValueChange={(v) => setFilters(prev => ({ ...prev, project: v }))}>
              <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Projecten</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v }))}>
              <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Statussen</SelectItem>
                {STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.assignedTo} onValueChange={(v) => setFilters(prev => ({ ...prev, assignedTo: v }))}>
              <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Toegewezen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Iedereen</SelectItem>
                <SelectItem value={currentUser?.email}>Mijn Taken</SelectItem>
                {users.map(u => (
                  <SelectItem key={u.email} value={u.email}>{u.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-96 bg-[#22262b]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.map(status => (
            <div key={status} className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{status}</h3>
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  {groupedByStatus[status].length}
                </Badge>
              </div>

              <div className="space-y-3">
                {groupedByStatus[status].map(task => (
                  <div 
                    key={task.id} 
                    className="bg-[#1a1d21] rounded-xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-all cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-white text-sm flex-1">{task.title}</h4>
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                    )}

                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        📁 {projectMap[task.project_id]?.title || 'Geen project'}
                      </div>
                      
                      {task.assigned_to && (
                        <div className="text-xs text-gray-500">
                          👤 {userMap[task.assigned_to]?.full_name || task.assigned_to}
                        </div>
                      )}

                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarIcon className="w-3 h-3" />
                          {format(new Date(task.due_date), 'd MMM yyyy', { locale: nl })}
                        </div>
                      )}

                      <Select 
                        value={task.status} 
                        onValueChange={(v) => handleStatusChange(task, v)}
                      >
                        <SelectTrigger className="h-8 bg-[#22262b] border-gray-700 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                {groupedByStatus[status].length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-sm">
                    Geen taken
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuwe Taak</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Project *</Label>
              <Select 
                value={formData.project_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, project_id: v }))}
                required
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue placeholder="Selecteer project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Titel *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Taak titel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Beschrijving</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[80px]"
                placeholder="Taak details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Toegewezen aan</Label>
                <Select 
                  value={formData.assigned_to} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, assigned_to: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue placeholder="Selecteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(u => (
                      <SelectItem key={u.email} value={u.email}>{u.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioriteit</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v }))}
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
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Taak Aanmaken
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Project</p>
                <p className="text-white">{projectMap[selectedTask?.project_id]?.title || '-'}</p>
              </div>

              {selectedTask?.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Beschrijving</p>
                  <p className="text-gray-300 text-sm">{selectedTask.description}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Badge className={statusColors[selectedTask?.status]}>
                    {selectedTask?.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Prioriteit</p>
                  <Badge className={priorityColors[selectedTask?.priority]}>
                    {selectedTask?.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Toegewezen aan</p>
                  <p className="text-white text-sm">{selectedTask?.assigned_to || '-'}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <CommentSection projectId={selectedTask?.project_id} taskId={selectedTask?.id} />
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
}