import { supabase } from '@/lib/supabase';
import { CanvasItem } from '@/api/entities';

/**
 * Template initializers - Create canvas items and other data when starting a project from a template
 */

// Get current user ID
const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

/**
 * Initialize Short Film template
 */
export async function initializeShortFilmTemplate(projectId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const items = [
    // Concept & Development Section
    {
      type: 'section',
      x: 10,
      y: 10,
      width: 450,
      height: 600,
      title: 'Concept & Development',
      data: { color: '#6B46C1' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 20,
      y: 70,
      width: 430,
      height: 200,
      title: 'Project Overview',
      content: 'Working Title: The Last Train Home\nGenre: Drama\nDuration: 12 mins\n\nLogline: A weary commuter discovers his late-night train ride is looping through his own memories.',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 20,
      y: 290,
      width: 430,
      height: 120,
      title: 'Story Concept',
      content: 'Theme: Regret and the inability to let go.\n\nInspiration: "Eternal Sunshine", "Groundhog Day", suburban isolation.',
      data: {},
      z_index: 1,
    },
    {
      type: 'image',
      x: 20,
      y: 420,
      width: 430,
      height: 180,
      title: 'Visual Inspiration',
      data: { placeholder: true },
      z_index: 1,
    },
    {
      type: 'note',
      x: 470,
      y: 500,
      width: 160,
      height: 100,
      content: 'Idea: Maybe the train conductor is his older self?',
      data: { color: 'yellow' },
      z_index: 2,
    },
    
    // Pre-Production Section
    {
      type: 'section',
      x: 600,
      y: 10,
      width: 450,
      height: 600,
      title: 'Pre-Production',
      data: { color: '#6B46C1' },
      z_index: 0,
    },
    {
      type: 'script',
      x: 610,
      y: 70,
      width: 430,
      height: 250,
      title: 'Screenplay',
      content: 'INT. TRAIN CAR - NIGHT\n\nThe fluorescent lights FLICKER. A low hum of the engine.\n\nJAMES (30s) stares at his reflection in the dark window.\n\nJAMES\nI missed it. I missed the stop.\n\nHe stands up. The car is empty.',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 610,
      y: 330,
      width: 430,
      height: 150,
      title: 'Locations',
      content: '✓ Subway Car - Secured (Renting standing set at Studio B)\n○ Apartment (Bedroom) - Scouting (Looking for high ceilings)',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 610,
      y: 490,
      width: 430,
      height: 110,
      title: 'Storyboard: Sc 1',
      content: 'Wide shot of train car\nMCU of James',
      data: {},
      z_index: 1,
    },
    
    // Production Section
    {
      type: 'section',
      x: 1200,
      y: 10,
      width: 450,
      height: 600,
      title: 'Production',
      data: { color: '#6B46C1' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 1210,
      y: 70,
      width: 430,
      height: 200,
      title: 'Day 1 Schedule - Nov 12',
      content: '08:00 - Crew Call / Setup (Location: Studio B)\n09:30 - Scene 1 - Train Car (Int. Night Simulated)\n13:00 - Lunch',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 1210,
      y: 280,
      width: 430,
      height: 150,
      title: 'Shot List (0/5 Done)',
      content: '□ 1A - Master Wide (Dolly)\n□ 1B - Med. James (50mm)\n□ 1C - CU Reflection (85mm)\n□ 1D - Insert: Hand on glass',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 1210,
      y: 440,
      width: 430,
      height: 160,
      title: 'Crew Contacts',
      content: 'Director: Sarah Chen\nDP: Marcus Rivera\nSound: Alex Kim',
      data: {},
      z_index: 1,
    },
    
    // Post-Production Section
    {
      type: 'section',
      x: 1800,
      y: 10,
      width: 450,
      height: 600,
      title: 'Post-Production',
      data: { color: '#6B46C1' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 1810,
      y: 70,
      width: 430,
      height: 150,
      title: 'Edit Timeline',
      content: 'Assembly Cut - In Progress\nRough Cut - Pending\nFine Cut - Pending',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 1810,
      y: 230,
      width: 430,
      height: 150,
      title: 'Color Grading Notes',
      content: 'Mood: Cool, desaturated\nKey scenes: Night train (blue tones)',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 1810,
      y: 390,
      width: 430,
      height: 210,
      title: 'Sound Design',
      content: 'Ambient: Train hum, distant city\nMusic: Minimal, atmospheric\nFoley: Footsteps, door sounds',
      data: {},
      z_index: 1,
    },
  ];

  // Insert all canvas items
  const itemsWithProject = items.map(item => ({
    ...item,
    project_id: projectId,
    created_by: userId,
  }));

  const { data, error } = await supabase
    .from('canvas_items')
    .insert(itemsWithProject)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Initialize Music Video template
 */
export async function initializeMusicVideoTemplate(projectId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const items = [
    {
      type: 'section',
      x: 10,
      y: 10,
      width: 450,
      height: 500,
      title: 'Planning',
      data: { color: '#F97316' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 20,
      y: 70,
      width: 430,
      height: 150,
      title: 'Track Info',
      content: 'Artist: [Artist Name]\nTrack: [Track Name]\nDuration: 3:45\nRelease Date: TBD',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 20,
      y: 230,
      width: 430,
      height: 150,
      title: 'Concept',
      content: 'Visual Style: [Describe style]\nMood: [Describe mood]\nKey Locations: [List locations]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 600,
      y: 10,
      width: 450,
      height: 500,
      title: 'Recording',
      data: { color: '#F97316' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 610,
      y: 70,
      width: 430,
      height: 200,
      title: 'Timeline',
      content: 'Scene 1: [Description]\nScene 2: [Description]\nScene 3: [Description]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 1200,
      y: 10,
      width: 450,
      height: 500,
      title: 'Analytics',
      data: { color: '#F97316' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 1210,
      y: 70,
      width: 430,
      height: 150,
      title: 'Performance Goals',
      content: 'Target Views: [Number]\nEngagement Rate: [%]\nPlatform: YouTube, TikTok',
      data: {},
      z_index: 1,
    },
  ];

  const itemsWithProject = items.map(item => ({
    ...item,
    project_id: projectId,
    created_by: userId,
  }));

  const { data, error } = await supabase
    .from('canvas_items')
    .insert(itemsWithProject)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Initialize Commercial Production template
 */
export async function initializeCommercialTemplate(projectId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const items = [
    {
      type: 'section',
      x: 10,
      y: 10,
      width: 450,
      height: 500,
      title: 'Client & Brief',
      data: { color: '#6366F1' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 20,
      y: 70,
      width: 430,
      height: 200,
      title: 'Client Information',
      content: 'Client: [Client Name]\nBrand: [Brand Name]\nProduct: [Product Name]\nCampaign: [Campaign Name]',
      data: {},
      z_index: 1,
    },
    {
      type: 'text',
      x: 20,
      y: 280,
      width: 430,
      height: 150,
      title: 'Creative Brief',
      content: 'Objective: [Campaign objective]\nTarget Audience: [Audience description]\nKey Message: [Main message]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 600,
      y: 10,
      width: 450,
      height: 500,
      title: 'Production',
      data: { color: '#6366F1' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 610,
      y: 70,
      width: 430,
      height: 200,
      title: 'Shoot Schedule',
      content: 'Pre-Production: [Dates]\nShoot Days: [Dates]\nPost-Production: [Dates]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 1200,
      y: 10,
      width: 450,
      height: 500,
      title: 'Approvals',
      data: { color: '#6366F1' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 1210,
      y: 70,
      width: 430,
      height: 200,
      title: 'Approval Workflow',
      content: 'Script: Pending\nStoryboard: Pending\nFinal Cut: Pending',
      data: {},
      z_index: 1,
    },
  ];

  const itemsWithProject = items.map(item => ({
    ...item,
    project_id: projectId,
    created_by: userId,
  }));

  const { data, error } = await supabase
    .from('canvas_items')
    .insert(itemsWithProject)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Initialize Podcast Production template
 */
export async function initializePodcastTemplate(projectId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const items = [
    {
      type: 'section',
      x: 10,
      y: 10,
      width: 450,
      height: 500,
      title: 'Planning',
      data: { color: '#14B8A6' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 20,
      y: 70,
      width: 430,
      height: 150,
      title: 'Episode Planning',
      content: 'Episode Title: [Title]\nTopic: [Topic]\nGuests: [Guest names]\nDuration: [Duration]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 600,
      y: 10,
      width: 450,
      height: 500,
      title: 'Recording',
      data: { color: '#14B8A6' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 610,
      y: 70,
      width: 430,
      height: 200,
      title: 'Recording Checklist',
      content: '□ Equipment setup\n□ Sound check\n□ Guest briefing\n□ Recording start',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 1200,
      y: 10,
      width: 450,
      height: 500,
      title: 'Analytics',
      data: { color: '#14B8A6' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 1210,
      y: 70,
      width: 430,
      height: 150,
      title: 'Performance',
      content: 'Downloads: [Number]\nListeners: [Number]\nPlatform: [Platforms]',
      data: {},
      z_index: 1,
    },
  ];

  const itemsWithProject = items.map(item => ({
    ...item,
    project_id: projectId,
    created_by: userId,
  }));

  const { data, error } = await supabase
    .from('canvas_items')
    .insert(itemsWithProject)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Initialize Photoshoot Production template
 */
export async function initializePhotoshootTemplate(projectId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const items = [
    {
      type: 'section',
      x: 10,
      y: 10,
      width: 450,
      height: 500,
      title: 'Creative Concept',
      data: { color: '#EC4899' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 20,
      y: 70,
      width: 430,
      height: 150,
      title: 'Concept',
      content: 'Theme: [Theme]\nStyle: [Style]\nMood: [Mood]\nColor Palette: [Colors]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 600,
      y: 10,
      width: 450,
      height: 500,
      title: 'Pre-Production',
      data: { color: '#EC4899' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 610,
      y: 70,
      width: 430,
      height: 200,
      title: 'Shot List',
      content: '□ Wide establishing shot\n□ Medium portrait\n□ Close-up details\n□ Product shots',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 1200,
      y: 10,
      width: 450,
      height: 500,
      title: 'Post-Production',
      data: { color: '#EC4899' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 1210,
      y: 70,
      width: 430,
      height: 150,
      title: 'Delivery',
      content: 'Format: [Format]\nResolution: [Resolution]\nDeadline: [Date]',
      data: {},
      z_index: 1,
    },
  ];

  const itemsWithProject = items.map(item => ({
    ...item,
    project_id: projectId,
    created_by: userId,
  }));

  const { data, error } = await supabase
    .from('canvas_items')
    .insert(itemsWithProject)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Initialize Documentary template
 */
export async function initializeDocumentaryTemplate(projectId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  const items = [
    {
      type: 'section',
      x: 10,
      y: 10,
      width: 450,
      height: 500,
      title: 'Research & Concept',
      data: { color: '#06B6D4' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 20,
      y: 70,
      width: 430,
      height: 150,
      title: 'Research',
      content: 'Topic: [Topic]\nKey Questions: [Questions]\nSources: [Sources]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 600,
      y: 10,
      width: 450,
      height: 500,
      title: 'Subjects & Interviews',
      data: { color: '#06B6D4' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 610,
      y: 70,
      width: 430,
      height: 200,
      title: 'Interview Subjects',
      content: 'Subject 1: [Name] - [Role]\nSubject 2: [Name] - [Role]\nSubject 3: [Name] - [Role]',
      data: {},
      z_index: 1,
    },
    {
      type: 'section',
      x: 1200,
      y: 10,
      width: 450,
      height: 500,
      title: 'Production & Archival',
      data: { color: '#06B6D4' },
      z_index: 0,
    },
    {
      type: 'text',
      x: 1210,
      y: 70,
      width: 430,
      height: 200,
      title: 'Archival Materials',
      content: 'Historical footage: [Sources]\nPhotos: [Sources]\nDocuments: [Sources]',
      data: {},
      z_index: 1,
    },
  ];

  const itemsWithProject = items.map(item => ({
    ...item,
    project_id: projectId,
    created_by: userId,
  }));

  const { data, error } = await supabase
    .from('canvas_items')
    .insert(itemsWithProject)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Initialize Blank Canvas template (minimal setup)
 */
export async function initializeBlankCanvasTemplate(projectId) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('User not authenticated');

  // Blank canvas just has a welcome card
  const items = [
    {
      type: 'text',
      x: 400,
      y: 300,
      width: 400,
      height: 200,
      title: 'Welcome to your Canvas',
      content: 'This is your blank canvas. Start by adding cards, notes, images, or sections.\n\nUse the toolbar on the left to add new elements.',
      data: {},
      z_index: 1,
    },
  ];

  const itemsWithProject = items.map(item => ({
    ...item,
    project_id: projectId,
    created_by: userId,
  }));

  const { data, error } = await supabase
    .from('canvas_items')
    .insert(itemsWithProject)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Main template initializer - routes to the correct template function
 */
export async function initializeTemplate(templateId, projectId) {
  const initializers = {
    'short-film': initializeShortFilmTemplate,
    'music-video': initializeMusicVideoTemplate,
    'commercial': initializeCommercialTemplate,
    'podcast': initializePodcastTemplate,
    'photoshoot': initializePhotoshootTemplate,
    'documentary': initializeDocumentaryTemplate,
    'blank': initializeBlankCanvasTemplate,
  };

  const initializer = initializers[templateId];
  if (!initializer) {
    console.warn(`No initializer found for template: ${templateId}`);
    return [];
  }

  return await initializer(projectId);
}
