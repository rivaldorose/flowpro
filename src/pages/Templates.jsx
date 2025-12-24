import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Film, 
  Music, 
  Megaphone, 
  Mic, 
  Camera, 
  FileSearch, 
  Layers,
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import CreateProjectFromTemplate from '@/components/templates/CreateProjectFromTemplate';

const templates = [
  {
    id: 'short-film',
    name: 'Short Film',
    description: 'Complete workflow for short film production from concept to post-production.',
    icon: Film,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    route: '/templates/short-film',
    category: 'Video',
    features: ['Script', 'Storyboard', 'Shot List', 'Budget'],
  },
  {
    id: 'music-video',
    name: 'Music Video',
    description: 'Plan and execute music video productions with timeline management.',
    icon: Music,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-red-500',
    route: '/templates/music-video',
    category: 'Video',
    features: ['Timeline', 'Visual References', 'Choreography'],
  },
  {
    id: 'commercial',
    name: 'Commercial Production',
    description: 'Professional commercial production workflow with client approvals.',
    icon: Megaphone,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-indigo-500',
    route: '/templates/commercial',
    category: 'Commercial',
    features: ['Client Management', 'Approval Workflow', 'Broadcast Standards'],
  },
  {
    id: 'podcast',
    name: 'Podcast Production',
    description: 'Organize episodes, manage guests, and track your publishing schedule.',
    icon: Mic,
    color: 'bg-teal-500',
    gradient: 'from-teal-500 to-emerald-500',
    route: '/templates/podcast',
    category: 'Audio',
    features: ['Episode Planning', 'Guest Pipeline', 'Recording Checklist'],
  },
  {
    id: 'photoshoot',
    name: 'Photoshoot Production',
    description: 'Plan creative concepts, manage shot lists, and track deliverables.',
    icon: Camera,
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-500',
    route: '/templates/photoshoot',
    category: 'Photo',
    features: ['Creative Direction', 'Shot List', 'Post-Production'],
  },
  {
    id: 'documentary',
    name: 'Documentary',
    description: 'Investigation workspace for research, interviews, and narrative building.',
    icon: FileSearch,
    color: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-blue-500',
    route: '/templates/documentary',
    category: 'Documentary',
    features: ['Research', 'Interview Management', 'Archival Log'],
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with a completely customizable workspace.',
    icon: Layers,
    color: 'bg-gray-500',
    gradient: 'from-gray-500 to-slate-500',
    route: '/templates/blank',
    category: 'Custom',
    features: ['Fully Customizable', 'Drag & Drop', 'Infinite Canvas'],
  },
];

const categories = ['All', 'Video', 'Audio', 'Photo', 'Commercial', 'Documentary', 'Custom'];

export default function Templates() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    // Option 1: Navigate to template preview page
    navigate(template.route);
  };

  const handleStartProject = (template) => {
    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Templates
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Start with a Template
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Choose a production template to jumpstart your project. Each template includes a complete workflow with all the tools you need.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
              <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-purple-200"
                onClick={() => handleUseTemplate(template)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {template.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(template);
                    }}
                  >
                    Preview
                  </Button>
                  <Button 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartProject(template);
                    }}
                  >
                    Start Project
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {selectedTemplate && (
        <CreateProjectFromTemplate
          templateId={selectedTemplate.id}
          templateName={selectedTemplate.name}
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
        />
      )}
    </div>
  );
}

