import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Notification } from '@/api/entities';
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', currentUser?.email],
    queryFn: () => Notification.filter({ user_email: currentUser?.email }),
    enabled: !!currentUser?.email,
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: ({ id, data }) => Notification.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsRead = () => {
    notifications.filter(n => !n.read).forEach(n => {
      markAsReadMutation.mutate({ id: n.id, data: { ...n, read: true } });
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );

  const getTypeIcon = (type) => {
    const icons = {
      task_assigned: '📋',
      deadline_approaching: '⏰',
      status_update: '🔄',
    };
    return icons[type] || '📌';
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-gray-400 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-96 bg-[#22262b] border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Notificaties</h3>
                <p className="text-xs text-gray-500">{unreadCount} ongelezen</p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Alles gelezen
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-96">
              {sortedNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Geen notificaties</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {sortedNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#1a1d21] transition-colors ${
                        !notification.read ? 'bg-[#1a1d21]/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-white text-sm">{notification.title}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              {format(new Date(notification.created_date), 'd MMM HH:mm', { locale: nl })}
                            </span>
                            <div className="flex gap-1">
                              {notification.link && (
                                <Link to={notification.link} onClick={() => setIsOpen(false)}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-emerald-400 hover:text-emerald-300"
                                  >
                                    Bekijk
                                  </Button>
                                </Link>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMutation.mutate(notification.id)}
                                className="h-7 w-7 text-gray-400 hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}