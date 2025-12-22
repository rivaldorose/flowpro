import React from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function UpcomingShootCard({ shoot, project }) {
  return (
    <div className="bg-[#2a2f35] rounded-xl p-4 hover:bg-[#2f3439] transition-all duration-200 border border-gray-800/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-lg">🎬</span>
          </div>
          <div>
            <p className="font-medium text-white text-sm">{project?.title || 'Project'}</p>
            <p className="text-xs text-gray-500">{shoot.location}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-emerald-400">
            {format(new Date(shoot.shoot_date), 'd MMM', { locale: nl })}
          </p>
          <p className="text-xs text-gray-500">
            {shoot.start_time} - {shoot.end_time}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[100px]">{shoot.address || shoot.location}</span>
        </div>
        {shoot.crew_ids?.length > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{shoot.crew_ids.length} crew</span>
          </div>
        )}
      </div>
    </div>
  );
}