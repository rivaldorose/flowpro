
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Euro, 
  Users, 
  Calendar, 
  Briefcase,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  Film,
  Video,
  MapPin,
  CheckSquare,
  Mic
} from 'lucide-react';
import NotificationBell from '../components/notifications/NotificationBell';
import TaskAssistant from '../components/ai/TaskAssistant';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { Business, BusinessAccess, User } from '@/api/entities';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'Projecten', icon: FolderKanban, page: 'Projects' },
  { name: 'Podcasts', icon: Mic, page: 'Podcasts' },
  { name: 'Taken', icon: CheckSquare, page: 'Tasks' },
  { name: 'Scripts', icon: FileText, page: 'Scripts' },
  { name: 'Shots', icon: Film, page: 'Shots' },
  { name: 'Post-Productie', icon: Video, page: 'PostProduction' },
  { name: 'Locaties', icon: MapPin, page: 'Locations' },
  { name: 'Budget', icon: Euro, page: 'Budget' },
  { name: 'Crew', icon: Users, page: 'Crew' },
  { name: 'Planning', icon: Calendar, page: 'Schedule' },
  { name: 'Organisaties', icon: Briefcase, page: 'Settings', subPage: 'organizations' },
  { name: 'Team', icon: Users, page: 'Team' },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(() => {
    return localStorage.getItem('selectedBusiness') || 'all';
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list(),
  });

  const { data: businessAccess = [] } = useQuery({
    queryKey: ['businessAccess', currentUser?.email],
    queryFn: () => BusinessAccess.filter({ user_email: currentUser?.email }),
    enabled: !!currentUser?.email && currentUser?.role !== 'admin',
  });

  const accessibleBusinesses = React.useMemo(() => {
    if (currentUser?.role === 'admin') {
      return businesses;
    }
    const accessibleIds = businessAccess.map(a => a.business_id);
    return businesses.filter(b => accessibleIds.includes(b.id));
  }, [currentUser, businesses, businessAccess]);

  React.useEffect(() => {
    if (selectedBusiness !== 'all') {
      localStorage.setItem('selectedBusiness', selectedBusiness);
    } else {
      localStorage.removeItem('selectedBusiness');
    }
    window.dispatchEvent(new CustomEvent('businessChanged', { detail: selectedBusiness }));
  }, [selectedBusiness]);

  // Hide sidebar and header for Dashboard, ScriptDetail, Budget, and ProductionPlanning pages
  if (currentPageName === 'Dashboard' || currentPageName === 'ScriptDetail' || currentPageName === 'Budget' || currentPageName === 'ProductionPlanning') {
    return (
      <div className="min-h-screen">
        {children}
        {/* AI Assistant */}
        <TaskAssistant />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#1a1d21] text-white flex overflow-hidden">
      <style>{`
        :root {
          --bg-dark: #1a1d21;
          --bg-card: #22262b;
          --bg-card-hover: #2a2f35;
          --accent-green: #4ade80;
          --accent-blue: #60a5fa;
          --accent-purple: #a78bfa;
          --accent-orange: #fb923c;
          --accent-red: #f87171;
          --text-primary: #ffffff;
          --text-secondary: #9ca3af;
          --border-color: #374151;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: #374151 transparent;
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 3px;
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-[#22262b] border-r border-gray-800
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64
        flex flex-col
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className={`font-semibold text-lg tracking-tight ${sidebarCollapsed ? 'lg:hidden' : ''}`}>FlowPro</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                  ${sidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}
                `}
                title={sidebarCollapsed ? item.name : ''}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : ''} flex-shrink-0`} />
                <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                {isActive && !sidebarCollapsed && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Business Selector */}
        {accessibleBusinesses.length > 0 && (
          <div className="p-4 border-t border-gray-800">
            <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
              <SelectTrigger className={`bg-[#1a1d21] border-gray-700 text-white ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                <SelectValue placeholder="Business" />
              </SelectTrigger>
              <SelectContent>
                {currentUser?.role === 'admin' && (
                  <SelectItem value="all">Alle Businesses</SelectItem>
                )}
                {accessibleBusinesses.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Toggle button (desktop only) */}
        <div className="hidden lg:block p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full text-gray-400 hover:text-white hover:bg-white/5 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''} ${sidebarCollapsed ? '' : 'mr-2'}`} />
            {!sidebarCollapsed && <span>Inklappen</span>}
          </Button>
        </div>


      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-[#22262b] border-b border-gray-800 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-400"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2 bg-[#1a1d21] rounded-xl px-4 py-2 w-80">
              <Search className="w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Zoeken..." 
                className="border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link to={createPageUrl('Profile')}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden">
                {currentUser?.photo ? (
                  <img src={currentUser.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {currentUser?.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
          </main>
          </div>

          {/* AI Assistant */}
          <TaskAssistant />
          </div>
          );
          }
