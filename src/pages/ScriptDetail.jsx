import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, FileText, Clock, LayoutTemplate, MessageSquare, 
  ChevronDown, Settings, Send, CheckCircle, Plus, Search,
  Image, ListVideo, GripHorizontal, MessageSquarePlus, MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import ScriptBreakdown from '../components/script/ScriptBreakdown';

// Parse script content into scenes (simplified - you may want to enhance this)
const parseScriptIntoScenes = (content) => {
  if (!content) return [];
  
    const sceneRegex = /(?:^|\n)(\d+\.\s*)?(INT\.|EXT\.|INT\/EXT\.)\s+([^-]+?)\s*-\s*([A-Z\s]+)/gim;
  const scenes = [];
  let match;
  let sceneNumber = 1;
  
  while ((match = sceneRegex.exec(content)) !== null) {
    scenes.push({
      number: sceneNumber++,
      heading: match[0].trim(),
      type: match[2]?.trim() || 'INT.',
      location: match[3]?.trim() || '',
      time: match[4]?.trim() || 'DAY',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }
  
  return scenes;
};

export default function ScriptDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('comments');
  const [activeScene, setActiveScene] = useState(1);
  const [commentFilter, setCommentFilter] = useState('all');
  const [newComment, setNewComment] = useState('');
  
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

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Script.update(scriptId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script', scriptId] });
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });

  const scenes = React.useMemo(() => {
    return parseScriptIntoScenes(script?.content || '');
  }, [script?.content]);

  // Calculate stats
  const wordCount = script?.content ? script.content.split(/\s+/).length : 0;
  const pageCount = Math.ceil(wordCount / 250); // Rough estimate: 250 words per page
  const estimatedRuntime = Math.round(pageCount * 1.2); // Rough estimate: 1.2 min per page

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading script...</p>
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Script niet gevonden</p>
          <Button onClick={() => navigate(createPageUrl('Scripts'))} className="bg-purple-600 hover:bg-purple-700">
            Terug naar Scripts
          </Button>
        </div>
      </div>
    );
  }

  const project = projects.find(p => p.id === script.project_id);

  return (
    <div className="h-screen bg-gray-50 text-gray-900 font-sans flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <header className="h-14 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center justify-between px-4 z-50 shrink-0">
        {/* Left */}
        <div className="flex items-center gap-4 w-1/3">
          <button 
            onClick={() => navigate(createPageUrl('Scripts'))}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 flex items-center gap-1">
              {project?.title || 'No Project'} <span className="text-xs">•</span> {script.content_type || 'Feature Film'}
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <h1 className="text-sm font-bold text-gray-900">{script.title || 'Untitled Script'}</h1>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-6 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5" title="Page Count">
            <FileText className="w-3.5 h-3.5" />
            <span className="text-gray-900">Page {activeScene}</span> of {pageCount || 1}
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1.5" title="Word Count">
            <FileText className="w-3.5 h-3.5" />
            {wordCount.toLocaleString()} words
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="flex items-center gap-1.5" title="Est. Runtime">
            <Clock className="w-3.5 h-3.5" />
            {estimatedRuntime} mins
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          {/* Collaborators */}
          <div className="flex -space-x-2 mr-2">
            {currentUser && (
              <div 
                className="w-7 h-7 rounded-full border-2 border-white ring-1 ring-gray-200 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold"
                title={currentUser.full_name || 'You'}
              >
                {(currentUser.full_name || 'U').charAt(0)}
              </div>
            )}
            <div className="w-7 h-7 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 ring-1 ring-gray-200">+2</div>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <LayoutTemplate className="w-3.5 h-3.5 text-orange-500" />
            Breakdown
          </button>
          
          <button className="p-2 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors relative">
            <MessageSquare className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-md shadow-sm hover:bg-gray-800 transition-all">
            Export
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:rotate-90 transition-all">
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR: Scene Navigator */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shrink-0">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Scenes</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search scenes..." 
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {scenes.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No scenes found
              </div>
            ) : (
              scenes.map((scene, index) => (
                <button
                  key={index}
                  onClick={() => setActiveScene(scene.number)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 border ${
                    activeScene === scene.number
                      ? 'bg-purple-50 border-purple-200 relative'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {activeScene === scene.number && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-purple-600 rounded-r-full"></div>
                  )}
                  <span className={`text-xs font-mono font-bold mt-0.5 ${
                    activeScene === scene.number ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {scene.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold truncate ${
                      activeScene === scene.number ? 'text-purple-600' : 'text-gray-900'
                    }`}>
                      {scene.heading.split('\n')[0] || `${scene.type} ${scene.location}`}
                    </div>
                    <div className={`text-[10px] flex justify-between mt-1 ${
                      activeScene === scene.number ? 'text-purple-600/70' : 'text-gray-500'
                    }`}>
                      <span>{scene.time}</span>
                      {activeScene === scene.number && (
                        <span className="flex items-center gap-1 bg-white/50 px-1.5 rounded-full border border-purple-200">
                          <MessageSquare className="w-2.5 h-2.5" />
                          3
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-200 rounded-lg text-xs font-medium text-gray-500 hover:text-purple-600 hover:border-purple-600 hover:bg-purple-50 transition-all">
              <Plus className="w-3.5 h-3.5" />
              Add Scene
            </button>
          </div>
        </aside>

        {/* CENTER: SCRIPT EDITOR */}
        <main className="flex-1 bg-gray-50 overflow-y-auto relative scroll-smooth">
          <div className="max-w-4xl mx-auto py-10 px-6 pb-40 space-y-8">
            
            {/* Script Content */}
            {script.content ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  SCENE {activeScene}
                </div>
                
                <div className="absolute top-6 right-6">
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Script Content with Formatting */}
                <div className="font-mono text-[17px] leading-relaxed text-gray-900 mt-6 whitespace-pre-wrap">
                  {script.content.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    
                    // Scene heading
                    if (/^(INT\.|EXT\.|INT\/EXT\.)/i.test(trimmedLine)) {
                      return (
                        <div key={index} className="font-bold mb-6 script-line relative group">
                          {trimmedLine}
                          <button className="comment-trigger absolute -right-12 top-0 opacity-0 transition-opacity cursor-pointer text-gray-400 hover:text-purple-600 p-1 group-hover:opacity-100">
                            <MessageSquarePlus className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      );
                    }
                    
                    // Character name (all caps, centered)
                    if (/^[A-Z\s]+$/.test(trimmedLine) && trimmedLine.length < 30 && !trimmedLine.includes('.')) {
                      return (
                        <div key={index} className="mb-0.5 script-line relative group" style={{ marginLeft: '35%', width: '40%' }}>
                          <div className="font-bold">{trimmedLine}</div>
                          <button className="comment-trigger absolute -right-12 top-1 opacity-0 transition-opacity cursor-pointer text-gray-400 hover:text-purple-600 p-1 group-hover:opacity-100">
                            <MessageSquarePlus className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      );
                    }
                    
                    // Parenthetical
                    if (/^\(.+\)$/.test(trimmedLine)) {
                      return (
                        <div key={index} className="mb-0.5 script-line relative group italic" style={{ marginLeft: '30%', width: '40%' }}>
                          {trimmedLine}
                          <button className="comment-trigger absolute -right-12 top-1 opacity-0 transition-opacity cursor-pointer text-gray-400 hover:text-purple-600 p-1 group-hover:opacity-100">
                            <MessageSquarePlus className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      );
                    }
                    
                    // Dialogue
                    if (trimmedLine && !trimmedLine.startsWith('(') && !trimmedLine.match(/^(INT\.|EXT\.|INT\/EXT\.)/i)) {
                      return (
                        <div key={index} className="mb-4 script-line relative group" style={{ marginLeft: '20%', width: '60%' }}>
                          {trimmedLine}
                          <button className="comment-trigger absolute -right-12 top-1 opacity-0 transition-opacity cursor-pointer text-gray-400 hover:text-purple-600 p-1 group-hover:opacity-100">
                            <MessageSquarePlus className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      );
                    }
                    
                    // Empty line
                    return <div key={index} className="mb-2"></div>;
                  })}
                </div>

                {/* Scene Footer */}
                <div className="mt-12 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200 hover:border-purple-500/50 cursor-pointer group transition-all">
                      <Image className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-gray-900">Storyboards</span>
                      <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 rounded-full font-bold ml-1 group-hover:bg-purple-600 group-hover:text-white transition-colors">5</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200 hover:border-orange-500/50 cursor-pointer group transition-all">
                      <ListVideo className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-medium text-gray-900">Shot List</span>
                      <Plus className="w-3 h-3 text-gray-400 ml-1" />
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    EST. {estimatedRuntime} MIN
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6">No script content yet</p>
                <Button 
                  onClick={() => navigate(createPageUrl(`ScriptDetail?id=${scriptId}&edit=true`))}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start Writing
                </Button>
              </div>
            )}

            {/* Add Scene Button */}
            <div className="flex justify-center py-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-dashed border-gray-200 text-gray-500 hover:text-purple-600 hover:border-purple-600 hover:shadow-md rounded-full transition-all text-sm font-medium">
                <Plus className="w-4 h-4" />
                Create Scene {scenes.length + 1}
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: Comments & Breakdown */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col z-20 shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.05)]">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-3 text-xs font-bold transition-colors ${
                activeTab === 'comments' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Comments <span className="bg-purple-600 text-white ml-1 px-1.5 py-0.5 rounded-full text-[10px]">12</span>
            </button>
            <button 
              onClick={() => setActiveTab('breakdown')}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeTab === 'breakdown' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Breakdown
            </button>
          </div>

          {activeTab === 'comments' ? (
            <>
              {/* Filters */}
              <div className="px-4 py-3 flex gap-2 overflow-x-auto">
                <button 
                  onClick={() => setCommentFilter('all')}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors ${
                    commentFilter === 'all' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setCommentFilter('open')}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors ${
                    commentFilter === 'open' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Open
                </button>
                <button 
                  onClick={() => setCommentFilter('resolved')}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors ${
                    commentFilter === 'resolved' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Resolved
                </button>
              </div>

              {/* Comment Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Comment Card (Focused) */}
                <div className="bg-gray-50 border border-purple-300 rounded-lg p-3 shadow-sm relative">
                  <div className="absolute -left-4 top-4 w-4 h-px bg-purple-300"></div>
                  <div className="absolute -left-5 top-3 w-2 h-2 rounded-full bg-purple-600 border-2 border-white"></div>
                  
                  <div className="text-[10px] text-gray-500 font-mono mb-2 border-l-2 border-gray-200 pl-2 line-clamp-1 italic">
                    "JOHN (30s, nervous energy)..."
                  </div>
                  
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Mike Director</span>
                        <span className="text-[10px] text-gray-500">2h ago</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1">Should we make him younger? Maybe 20s works better for the dynamic with Sarah.</p>
                    </div>
                  </div>

                  {/* Reply */}
                  <div className="flex items-start gap-2 pl-3 border-l border-gray-200 mt-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Sarah Writer</span>
                        <span className="text-[10px] text-gray-500">1h ago</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1">Good point. Let's try late 20s.</p>
                    </div>
                  </div>

                  {/* Reply Input */}
                  <div className="mt-3 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Reply..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-purple-600"
                    />
                    <button className="text-purple-600 hover:text-purple-700">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Comment Card (Resolved) */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-[10px] text-gray-500 font-mono border-l-2 border-gray-200 pl-2 line-clamp-1 italic max-w-[180px]">
                      "INT. COFFEE SHOP - DAY"
                    </div>
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">RESOLVED</span>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold">
                      M
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900">Mike Director</span>
                      <p className="text-xs text-gray-700 mt-1">Is this the location on 5th Ave?</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Action */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2 rounded-md shadow-md transition-colors flex items-center justify-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Resolve All in Scene
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <ScriptBreakdown 
                breakdown={null}
                onTagClick={() => {}}
                activeTag={null}
                onUpdateBreakdown={() => {}}
                scriptId={scriptId}
                projectId={script?.project_id}
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
