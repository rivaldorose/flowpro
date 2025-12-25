import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Package, 
  Building2,
  Contact,
  ChevronRight 
} from 'lucide-react';
import Profile from './Profile';
import TeamMembers from './TeamMembers';
import Equipment from './Equipment';
import Organizations from './Organizations';
import Contacts from './Contacts';

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Beheer je persoonlijke informatie',
    icon: User,
    path: '/settings',
    component: Profile,
  },
  {
    id: 'organizations',
    title: 'Organisaties',
    description: 'Beheer organisaties en bedrijven',
    icon: Building2,
    path: '/settings/organizations',
    component: Organizations,
  },
  {
    id: 'contacts',
    title: 'Contacten',
    description: 'Beheer contacten en koppel aan organisaties',
    icon: Contact,
    path: '/settings/contacts',
    component: Contacts,
  },
  {
    id: 'team',
    title: 'Team Members',
    description: 'Beheer teamleden en uitnodigingen',
    icon: Users,
    path: '/settings/team',
    component: TeamMembers,
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Beheer productie equipment',
    icon: Package,
    path: '/settings/equipment',
    component: Equipment,
  },
];

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active section from current path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/settings' || path === '/settings/') {
      return 'profile';
    }
    if (path === '/settings/organizations') {
      return 'organizations';
    }
    if (path === '/settings/contacts') {
      return 'contacts';
    }
    if (path === '/settings/team') {
      return 'team';
    }
    if (path === '/settings/equipment') {
      return 'equipment';
    }
    return 'profile';
  };
  
  const activeSection = getActiveSection();

  const handleSectionClick = (section) => {
    navigate(section.path);
  };

  const ActiveComponent = settingsSections.find(s => s.id === activeSection)?.component || Profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Beheer je account en team instellingen</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-gray-200 shadow-sm p-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors
                      ${isActive 
                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                    <div className="flex-1 text-left">
                      <div className={`font-medium ${isActive ? 'text-purple-700' : 'text-gray-900'}`}>
                        {section.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {section.description}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
