import React from 'react';
import { Settings } from 'lucide-react';

/**
 * Settings Mode - Project settings view
 * TODO: Migrate project settings from ProjectDetail
 */
export default function SettingsMode({ project }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Settings</h2>
        <p className="text-gray-600 mb-4">
          Settings for project: <strong>{project?.title}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Coming soon: Project configuration, team management, and preferences.
        </p>
      </div>
    </div>
  );
}

