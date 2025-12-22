import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Save, FileText, Trash2, Clock, Edit2, Sparkles } from 'lucide-react';
import ReactQuill from 'react-quill';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import ScriptBreakdown from '../components/script/ScriptBreakdown';

const STATUSES = ['Draft', 'Review', 'Approved', 'Final'];

const statusColors = {
  'Draft': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Approved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Final': 'bg-green-600/20 text-green-400 border-green-500/30',
};

export default function ScriptDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [breakdown, setBreakdown] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const scriptId = urlParams.get('id');

  const { data: script, isLoading } = useQuery({
    queryKey: ['script', scriptId],
    queryFn: async () => {
      const scripts = await base44.entities.Script.filter({ id: scriptId });
      return scripts[0];
    },
    enabled: !!scriptId,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const [formData, setFormData] = useState({
    title: '',
    project_id: '',
    content: '',
    status: 'Draft',
    version: 1
  });

  React.useEffect(() => {
    if (script) {
      setFormData({
        title: script.title || '',
        project_id: script.project_id || '',
        content: script.content || '',
        status: script.status || 'Draft',
        version: script.version || 1
      });
    }
  }, [script]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Script.update(scriptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script', scriptId] });
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Script.delete(scriptId),
    onSuccess: () => {
      navigate(createPageUrl('Scripts'));
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (confirm('Weet je zeker dat je dit script wilt verwijderen?')) {
      deleteMutation.mutate();
    }
  };

  const analyzeScript = async () => {
    if (!script.content) return;
    
    setIsAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this film/video script and extract the following elements:
        
Script:
${script.content}

Extract and return ONLY a JSON object with these categories:
- locations: array of location names (INT. OFFICE, EXT. PARK, etc)
- props: array of props/objects needed
- crew: array of crew roles or talent names mentioned
- vfx: array of special effects or VFX needs
- time: array of time of day mentions (DAY, NIGHT, GOLDEN HOUR, etc)
- wardrobe: array of wardrobe/costume requirements
- sound: array of sound/music requirements

Keep items short and clear. Only include items that are explicitly mentioned or clearly implied.`,
        response_json_schema: {
          type: "object",
          properties: {
            locations: { type: "array", items: { type: "string" } },
            props: { type: "array", items: { type: "string" } },
            crew: { type: "array", items: { type: "string" } },
            vfx: { type: "array", items: { type: "string" } },
            time: { type: "array", items: { type: "string" } },
            wardrobe: { type: "array", items: { type: "string" } },
            sound: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setBreakdown(response);
    } catch (error) {
      console.error('Script analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (script?.content && !isEditing) {
      analyzeScript();
    }
  }, [script?.content, isEditing]);

  const handleTagClick = (category, value) => {
    if (activeTag?.category === category && activeTag?.value === value) {
      setActiveTag(null);
    } else {
      setActiveTag({ category, value });
    }
  };

  const highlightContent = (content) => {
    if (!breakdown || !content || isEditing) return content;
    
    let highlighted = content;
    const colors = {
      locations: 'rgba(59, 130, 246, 0.3)',
      props: 'rgba(168, 85, 247, 0.3)',
      crew: 'rgba(34, 197, 94, 0.3)',
      vfx: 'rgba(236, 72, 153, 0.3)',
      time: 'rgba(251, 146, 60, 0.3)',
      wardrobe: 'rgba(234, 179, 8, 0.3)',
      sound: 'rgba(239, 68, 68, 0.3)',
    };

    Object.entries(breakdown).forEach(([category, items]) => {
      items.forEach(item => {
        const regex = new RegExp(`\\b${item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const isActive = activeTag?.category === category && activeTag?.value === item;
        const color = isActive ? 'rgba(74, 222, 128, 0.5)' : colors[category];
        highlighted = highlighted.replace(
          regex, 
          `<mark style="background-color: ${color}; padding: 2px 4px; border-radius: 3px;">$&</mark>`
        );
      });
    });

    return highlighted;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-[#22262b]" />
        <Skeleton className="h-96 bg-[#22262b]" />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 mb-4">Script niet gevonden</p>
        <Button onClick={() => navigate(createPageUrl('Scripts'))} className="bg-emerald-500 hover:bg-emerald-600">
          Terug naar Scripts
        </Button>
      </div>
    );
  }

  const project = projects.find(p => p.id === script.project_id);

  return (
    <div className="space-y-6">
      <style>{`
        .quill-dark .ql-toolbar {
          background: #1a1d21;
          border: none;
          border-bottom: 1px solid #374151;
          padding: 12px;
        }
        .quill-dark .ql-toolbar .ql-formats {
          margin-right: 8px;
        }
        .quill-dark .ql-container {
          background: #1a1d21;
          border: none;
          color: #fff;
          font-size: 14px;
          min-height: 600px;
        }
        .quill-dark .ql-editor {
          min-height: 600px;
          color: #fff;
        }
        .quill-dark .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        .quill-dark .ql-stroke {
          stroke: #9ca3af;
        }
        .quill-dark .ql-fill {
          fill: #9ca3af;
        }
        .quill-dark .ql-picker-label {
          color: #9ca3af;
        }
        .quill-dark button:hover .ql-stroke,
        .quill-dark button.ql-active .ql-stroke {
          stroke: #4ade80;
        }
        .quill-dark button:hover .ql-fill,
        .quill-dark button.ql-active .ql-fill {
          fill: #4ade80;
        }
        .prose-invert h1, .prose-invert h2, .prose-invert h3 {
          color: #fff;
        }
        .prose-invert p, .prose-invert li {
          color: #d1d5db;
        }
        .quill-dark .ql-picker-options {
          background: #1a1d21;
          border: 1px solid #374151;
        }
        .quill-dark .ql-picker-item {
          color: #9ca3af;
        }
        .quill-dark .ql-picker-item:hover {
          color: #4ade80;
        }
        .quill-dark .ql-indent,
        .quill-dark button[value="+1"],
        .quill-dark button[value="-1"] {
          display: none !important;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(createPageUrl('Scripts'))}
            className="mb-3 text-gray-400 hover:text-white -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar Scripts
          </Button>
          
          {isEditing ? (
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl lg:text-3xl font-bold bg-[#1a1d21] border-gray-700 text-white mb-2"
            />
          ) : (
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{script.title}</h1>
          )}
          
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-gray-500">{project?.title || 'Geen project'}</p>
            <Badge className={statusColors[formData.status]} variant="outline">
              {formData.status}
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-400">
              Versie {formData.version}
            </Badge>
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(script.updated_date || script.created_date), 'd MMM yyyy HH:mm', { locale: nl })}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-600 text-gray-300"
              >
                Annuleren
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-emerald-500 hover:bg-emerald-600 gap-2"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? 'Opslaan...' : 'Opslaan'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-red-600 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={analyzeScript}
                disabled={isAnalyzing}
                variant="outline"
                className="border-gray-600 text-gray-300 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? 'Analyseren...' : 'Analyseer'}
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-emerald-500 hover:bg-emerald-600 gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Bewerken
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Metadata Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 text-sm">Project</Label>
                {isEditing ? (
                  <Select 
                    value={formData.project_id} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, project_id: v }))}
                  >
                    <SelectTrigger className="bg-[#1a1d21] border-gray-700 mt-1">
                      <SelectValue placeholder="Selecteer project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-white mt-1">{project?.title || 'Geen project'}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Status</Label>
                {isEditing ? (
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}
                  >
                    <SelectTrigger className="bg-[#1a1d21] border-gray-700 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-white mt-1">{formData.status}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Versie</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: Number(e.target.value) }))}
                    className="bg-[#1a1d21] border-gray-700 mt-1"
                    min="1"
                  />
                ) : (
                  <p className="text-white mt-1">v{formData.version}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Gemaakt op</Label>
                <p className="text-white mt-1 text-sm">
                  {format(new Date(script.created_date), 'd MMM yyyy HH:mm', { locale: nl })}
                </p>
              </div>

              <div>
                <Label className="text-gray-400 text-sm">Laatst gewijzigd</Label>
                <p className="text-white mt-1 text-sm">
                  {format(new Date(script.updated_date || script.created_date), 'd MMM yyyy HH:mm', { locale: nl })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Script Content */}
        <div className="lg:col-span-3">
          <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">Script Inhoud</h3>
            
            {isEditing ? (
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[600px] font-mono text-sm"
                placeholder="Schrijf hier je script..."
              />
            ) : (
              <div className="bg-[#1a1d21] rounded-xl p-6 min-h-[600px] prose prose-invert prose-emerald max-w-none whitespace-pre-wrap">
                <div dangerouslySetInnerHTML={{ __html: highlightContent(script.content) || '<p class="text-gray-500">Geen inhoud</p>' }} />
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Sidebar */}
        <div className="lg:col-span-1">
          <ScriptBreakdown 
            breakdown={breakdown} 
            onTagClick={handleTagClick}
            activeTag={activeTag}
            onUpdateBreakdown={setBreakdown}
            scriptId={scriptId}
            projectId={script?.project_id}
          />
        </div>
      </div>
    </div>
  );
}