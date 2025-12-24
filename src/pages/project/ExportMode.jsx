import React from 'react';
import { Upload } from 'lucide-react';

/**
 * Export Mode - Export & share view
 * TODO: Create export functionality
 */
export default function ExportMode({ project }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export & Share</h2>
        <p className="text-gray-600 mb-4">
          Export and share project: <strong>{project?.title}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Coming soon: Export project data, generate reports, and share with team members.
        </p>
      </div>
    </div>
  );
}

