import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Script, User } from '@/api/entities';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScriptEditor from '@/components/script/ScriptEditor';
import ScriptBreakdown from '@/components/script/ScriptBreakdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Script Mode - Script editor view
 * Migrated from ScriptDetail
 */
export default function ScriptMode({ project }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('editor');
  const [editorContent, setEditorContent] = useState('');

  // Get or create script for this project
  const { data: scripts = [] } = useQuery({
    queryKey: ['projectScripts', project?.id],
    queryFn: () => Script.filter({ project_id: project?.id }),
    enabled: !!project?.id,
  });

  const script = scripts[0]; // Use first script or create new one

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => Script.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectScripts', project?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => Script.update(script?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectScripts', project?.id] });
      queryClient.invalidateQueries({ queryKey: ['script', script?.id] });
    },
  });

  // Initialize editor content
  useEffect(() => {
    if (script?.content && !editorContent) {
      setEditorContent(script.content);
    }
  }, [script?.content]);

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!script?.id || !editorContent || editorContent === script.content) return;

    const timeoutId = setTimeout(() => {
      updateMutation.mutate({ content: editorContent });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [editorContent, script?.id]);

  const handleCreateScript = () => {
    if (!project?.id) return;
    createMutation.mutate({
      project_id: project.id,
      title: `${project.title} - Script`,
      content: '',
    });
  };

  const handleContentChange = (content) => {
    setEditorContent(content);
  };

  if (!script) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Script Yet</h2>
          <p className="text-gray-600 mb-6">
            Create a script for project: <strong>{project?.title}</strong>
          </p>
          <Button onClick={handleCreateScript} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Script
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200">
            <ScriptEditor
              content={editorContent}
              onChange={handleContentChange}
              scriptId={script.id}
            />
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <ScriptBreakdown
              scriptId={script.id}
              content={editorContent || script.content}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

