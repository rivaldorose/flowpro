import React, { useState } from 'react';
import { MapPin, Package, Users, Sparkles, Clock, Shirt, Music, ChevronRight, Plus, X, CheckSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';

const categories = [
  { id: 'locations', label: 'Locaties', icon: MapPin, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'props', label: 'Props', icon: Package, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'crew', label: 'Crew/Talent', icon: Users, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'vfx', label: 'VFX', icon: Sparkles, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'time', label: 'Time of Day', icon: Clock, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'wardrobe', label: 'Wardrobe', icon: Shirt, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'sound', label: 'Sound/Music', icon: Music, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
];

export default function ScriptBreakdown({ breakdown, onTagClick, activeTag, onUpdateBreakdown, scriptId, projectId }) {
  const [addingTo, setAddingTo] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [creatingTasks, setCreatingTasks] = useState(false);

  if (!breakdown) {
    return (
      <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Script Breakdown</h3>
        <p className="text-gray-400 text-sm">Geen breakdown beschikbaar</p>
      </div>
    );
  }

  const handleAddItem = (categoryId) => {
    if (!newItem.trim()) return;
    
    const updatedBreakdown = {
      ...breakdown,
      [categoryId]: [...(breakdown[categoryId] || []), newItem.trim()]
    };
    
    onUpdateBreakdown(updatedBreakdown);
    setNewItem('');
    setAddingTo(null);
  };

  const handleRemoveItem = (categoryId, itemToRemove) => {
    const updatedBreakdown = {
      ...breakdown,
      [categoryId]: breakdown[categoryId].filter(item => item !== itemToRemove)
    };
    
    onUpdateBreakdown(updatedBreakdown);
  };

  const createProductionTasks = async () => {
    if (!scriptId || !projectId) return;
    
    setCreatingTasks(true);
    try {
      const tasks = [];
      
      Object.entries(breakdown).forEach(([category, items]) => {
        items.forEach(item => {
          tasks.push({
            project_id: projectId,
            script_id: scriptId,
            category,
            item,
            status: 'To Do'
          });
        });
      });

      if (tasks.length > 0) {
        await base44.entities.ProductionTask.bulkCreate(tasks);
      }
    } catch (error) {
      console.error('Failed to create tasks:', error);
    } finally {
      setCreatingTasks(false);
    }
  };

  return (
    <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
      <h3 className="text-lg font-semibold text-white mb-4">Script Breakdown</h3>
      
      <ScrollArea className="h-[530px] pr-4">
        <div className="space-y-4">
          {categories.map(category => {
            const items = breakdown[category.id] || [];
            const Icon = category.icon;
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-semibold text-white">{category.label}</h4>
                  <Badge variant="outline" className="ml-auto text-xs border-gray-600 text-gray-400">
                    {items.length}
                  </Badge>
                </div>

                <div className="flex gap-2 mb-2">
                  <Input
                    value={addingTo === category.id ? newItem : ''}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={`Voeg ${category.label.toLowerCase()} toe...`}
                    className="bg-[#1a1d21] border-gray-700 text-white text-sm h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddItem(category.id);
                    }}
                    onFocus={() => setAddingTo(category.id)}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddItem(category.id)}
                    className="bg-emerald-500 hover:bg-emerald-600 h-8 px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {items.length > 0 ? (
                  <div className="space-y-1">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`
                          group flex items-center justify-between px-3 py-2 rounded-lg text-sm
                          transition-all duration-200 cursor-pointer
                          ${activeTag?.category === category.id && activeTag?.value === item
                            ? `${category.color} border`
                            : 'bg-[#1a1d21] text-gray-300 hover:bg-[#1a1d21]/80'
                          }
                        `}
                        onClick={() => onTagClick(category.id, item)}
                      >
                        <span>{item}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(category.id, item);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 px-3">Geen {category.label.toLowerCase()} gevonden</p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <Button
          onClick={createProductionTasks}
          disabled={creatingTasks || !breakdown || Object.values(breakdown).flat().length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-600 gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          {creatingTasks ? 'Taken aanmaken...' : 'Maak Productie Taken'}
        </Button>
      </div>
    </div>
  );
}