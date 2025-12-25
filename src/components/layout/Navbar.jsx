import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/api/entities';
import { Search, Bell, User as UserIcon, Film, FolderKanban, Layers, Menu, X } from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/Dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FolderKanban },
    { path: '/templates', label: 'Templates', icon: Layers },
  ];

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif font-bold text-lg text-gray-900 hidden sm:block">Flow Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${isActive(item.path)
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Center: Search (desktop only) */}
      <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search projects, scripts..."
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => {/* TODO: Open search modal */}}
        >
          <Search className="w-5 h-5 text-gray-600" />
        </Button>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {currentUser?.photo ? (
                  <img src={currentUser.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {currentUser?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {currentUser?.full_name || 'User'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{currentUser?.full_name || 'User'}</span>
                <span className="text-xs text-gray-500 font-normal">{currentUser?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <UserIcon className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 md:hidden z-40">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive(item.path)
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

