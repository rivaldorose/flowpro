import React from 'react';
import Navbar from './Navbar';
import TaskAssistant from '../ai/TaskAssistant';

/**
 * New App Layout with Horizontal Navbar
 * This replaces the old sidebar-based Layout for v2.0 structure
 */
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <TaskAssistant />
    </div>
  );
}

