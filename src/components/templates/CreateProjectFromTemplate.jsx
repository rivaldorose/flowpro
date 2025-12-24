import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Project, Business } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

/**
 * Modal to create a new project from a template
 */
export default function CreateProjectFromTemplate({ 
  templateId, 
  templateName, 
  open, 
  onOpenChange 
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [description, setDescription] = useState('');

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list(),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Create the project
      const project = await Project.create(data);
      
      // TODO: Initialize template-specific data here if needed
      // For example, create initial canvas items, scripts, etc. based on template
      
      return project;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onOpenChange(false);
      // Navigate to the new project
      navigate(`/project/${project.id}?mode=canvas`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName || !selectedBusinessId) return;

    createMutation.mutate({
      title: projectName,
      name: projectName, // Some schemas use 'name', others use 'title'
      description: description || `Project created from ${templateName} template`,
      business_id: selectedBusinessId,
      status: 'Planning',
      // Store template reference in metadata if needed
      // template_id: templateId,
    });
  };

  const defaultName = `${templateName} Project`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Project from Template</DialogTitle>
          <DialogDescription>
            Start a new project using the <strong>{templateName}</strong> template.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={defaultName}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business">Business *</Label>
            <Select
              value={selectedBusinessId}
              onValueChange={setSelectedBusinessId}
              required
            >
              <SelectTrigger id="business">
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {businesses.length === 0 && (
              <p className="text-sm text-gray-500">
                No businesses found. Please create a business first.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName || !selectedBusinessId || createMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {createMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

