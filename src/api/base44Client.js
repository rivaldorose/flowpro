// DEPRECATED: This file is kept only for backward compatibility with a few remaining components
// that use base44.agents and base44.functions. These should be migrated to Supabase Edge Functions.
// 
// Most of the codebase has been migrated to use direct entity imports:
// - Use: import { Project, User, Task } from '@/api/entities'
// - Instead of: import { base44 } from '@/api/base44Client' then base44.entities.Project
//
// TODO: Migrate remaining components:
// - components/ai/TaskAssistant.jsx (uses base44.agents)
// - components/storyboard/StoryDeckConnect.jsx (uses base44.functions)
// - components/storyboard/StatusSyncButton.jsx (uses base44.functions)
// - components/script/ScriptBreakdown.jsx (uses base44.entities.ProductionTask.bulkCreate)

import * as entities from './entities.js'
import * as functions from './functions.js'
import { User } from './entities.js'

// Create a base44-compatible API structure for remaining legacy code
export const base44 = {
  entities: entities,
  functions: functions,
  auth: User,
  // Placeholder for agents - should be implemented as Supabase Edge Functions
  agents: {
    subscribeToConversation: () => () => {}, // No-op unsubscribe
    createConversation: async () => ({ id: 'temp' }),
    addMessage: async () => ({}),
    getConversation: async () => ({})
  }
};
