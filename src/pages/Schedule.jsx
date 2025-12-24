import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShootSchedule, Project } from '@/api/entities';
import { Plus, Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { nl } from 'date-fns/locale';

const STATUSES = ['Planned', 'In Progress', 'Completed', 'Cancelled'];
const WEATHER = ['Sunny', 'Cloudy', 'Rainy', 'Indoor - N/A'];

const statusColors = {
  'Planned': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'In Progress': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Cancelled': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function Schedule() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    project_id: '',
    shoot_date: '',
    start_time: '',
    end_time: '',
    location: '',
    address: '',
    equipment: '',
    notes: '',
    status: 'Planned',
    weather: ''
  });

  const { data: shoots = [], isLoading } = useQuery({
    queryKey: ['shoots'],
    queryFn: () => ShootSchedule.list('shoot_date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Project.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => ShootSchedule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoots'] });
      closeForm();
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      project_id: '',
      shoot_date: '',
      start_time: '',
      end_time: '',
      location: '',
      address: '',
      equipment: '',
      notes: '',
      status: 'Planned',
      weather: ''
    });
  };

  const openFormForDate = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, shoot_date: format(date, 'yyyy-MM-dd') }));
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  // Calendar calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getShootsForDay = (date) => {
    return shoots.filter(s => isSameDay(new Date(s.shoot_date), date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Shoot Planning</h1>
          <p className="text-gray-500 mt-1">{shoots.length} shoots gepland</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Shoot
        </Button>
      </div>

      {/* Calendar */}
      <div className="bg-[#22262b] rounded-2xl border border-gray-800/50 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: nl })}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-gray-400 hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-800">
          {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-96 bg-[#1a1d21]" />
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayShots = getShootsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={idx}
                  onClick={() => openFormForDate(day)}
                  className={`
                    min-h-[100px] p-2 border-b border-r border-gray-800/50 cursor-pointer
                    hover:bg-gray-800/30 transition-colors
                    ${!isCurrentMonth ? 'bg-gray-900/20' : ''}
                  `}
                >
                  <div className={`
                    text-sm mb-1 
                    ${isToday ? 'w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center' : ''}
                    ${!isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayShots.slice(0, 2).map(shoot => (
                      <div 
                        key={shoot.id}
                        className="text-xs p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 truncate"
                        title={projectMap[shoot.project_id]?.title}
                      >
                        {shoot.start_time} - {shoot.location}
                      </div>
                    ))}
                    {dayShots.length > 2 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{dayShots.length - 2} meer
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Shoots List */}
      <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Komende Shoots</h3>
        <div className="space-y-3">
          {shoots
            .filter(s => new Date(s.shoot_date) >= new Date())
            .slice(0, 5)
            .map(shoot => (
              <div key={shoot.id} className="flex items-center justify-between p-4 bg-[#1a1d21] rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{projectMap[shoot.project_id]?.title || 'Project'}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {shoot.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {shoot.start_time} - {shoot.end_time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-emerald-400">
                    {format(new Date(shoot.shoot_date), 'd MMM', { locale: nl })}
                  </p>
                  <Badge className={statusColors[shoot.status]} variant="outline">
                    {shoot.status}
                  </Badge>
                </div>
              </div>
            ))}
          {shoots.filter(s => new Date(s.shoot_date) >= new Date()).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Geen komende shoots gepland
            </div>
          )}
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nieuwe Shoot Plannen</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Project *</Label>
              <Select 
                value={formData.project_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, project_id: v }))}
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

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Datum *</Label>
                <Input
                  type="date"
                  value={formData.shoot_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, shoot_date: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Starttijd</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Eindtijd</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Locatie *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="Studio / Buiten"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Weer</Label>
                <Select 
                  value={formData.weather} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, weather: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue placeholder="Selecteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEATHER.map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adres</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Volledig adres"
              />
            </div>

            <div className="space-y-2">
              <Label>Benodigde Apparatuur</Label>
              <Textarea
                value={formData.equipment}
                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[60px]"
                placeholder="Camera, lichten, geluid..."
              />
            </div>

            <div className="space-y-2">
              <Label>Notities</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[60px]"
                placeholder="Extra informatie..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Opslaan...' : 'Shoot Plannen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}