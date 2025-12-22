// Migrated from base44 to Supabase
// This file maintains backward compatibility with existing code
import * as entities from './entities.js'
import * as functions from './functions.js'
import { User } from './entities.js'

// Create a base44-compatible API structure
export const base44 = {
  entities: entities,
  functions: functions,
  auth: User
};
