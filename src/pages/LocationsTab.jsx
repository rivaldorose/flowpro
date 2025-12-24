import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ArrowLeft, Search, Filter, LayoutGrid, Map, List, Plus, MoreHorizontal,
  MapPin, DollarSign, FileText, Car, Wifi, Sun, Users, Camera, Zap, Truck,
  Coffee, Waves, Home, Lock, Eye, Navigation, Heart, Film, ChevronDown,
  ArrowDownUp, X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const LOCATION_TYPES = {
  'INT': { label: 'INT', color: 'bg-emerald-400', glow: 'rgba(52,211,153,0.8)' },
  'EXT': { label: 'EXT', color: 'bg-blue-400', glow: 'rgba(96,165,250,0.8)' },
  'STUDIO': { label: 'STUDIO', color: 'bg-purple-400', glow: 'rgba(107,70,193,0.8)' },
  'RESID': { label: 'RESID', color: 'bg-orange-400', glow: 'rgba(251,146,60,0.8)' },
};

export default function LocationsTab({ projectId }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('a-z');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { data: locations = [] } = useQuery({
    queryKey: ['locations', projectId],
    queryFn: () => base44.entities.Location.list('name'),
  });

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    location_type: 'INT',
    daily_rate: '',
    permit_required: false,
    description: '',
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Location.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      location_type: 'INT',
      daily_rate: '',
      permit_required: false,
      description: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      location_type: formData.location_type,
      daily_rate: parseFloat(formData.daily_rate) || 0,
      permit_required: formData.permit_required,
      description: formData.description,
      project_id: projectId,
    });
  };

  const filteredLocations = locations.filter(location => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!location.name?.toLowerCase().includes(query) &&
          !location.address?.toLowerCase().includes(query) &&
          !location.city?.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filterType !== 'all' && location.location_type !== filterType) {
      return false;
    }
    return true;
  });

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    if (sortBy === 'a-z') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'z-a') {
      return (b.name || '').localeCompare(a.name || '');
    }
    if (sortBy === 'price-low') {
      return (a.daily_rate || 0) - (b.daily_rate || 0);
    }
    if (sortBy === 'price-high') {
      return (b.daily_rate || 0) - (a.daily_rate || 0);
    }
    return 0;
  });

  const getLocationTypeInfo = (type) => {
    return LOCATION_TYPES[type] || LOCATION_TYPES.INT;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-gray-900">Locations</h2>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-mono font-medium">
            {filteredLocations.length}
          </span>
        </div>

        <div className="flex items-center justify-center flex-1 max-w-md">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/50 transition-all placeholder:text-gray-400"
            />
            <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] text-gray-400 font-mono hidden group-focus-within:block">
              CMD+K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <Filter className="w-4 h-4 text-gray-500" />
              <span>All Types</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
            </button>

            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <ArrowDownUp className="w-4 h-4 text-gray-500" />
              <span>Sort: A-Z</span>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block" />

          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white pl-3 pr-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg ml-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span className="text-sm font-medium">Add Location</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
              {sortedLocations.map((location) => {
                const typeInfo = getLocationTypeInfo(location.location_type);
                
                return (
                  <div
                    key={location.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-teal-600/30 transition-all duration-300 group cursor-pointer flex flex-col overflow-hidden relative hover:-translate-y-1"
                  >
                    {/* Hero Image */}
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                      {location.image_url ? (
                        <img
                          src={location.image_url}
                          alt={location.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-teal-300" />
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gray-900/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${typeInfo.color}`}
                          style={{ boxShadow: `0 0 8px ${typeInfo.glow}` }}
                        />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                          {typeInfo.label}
                        </span>
                      </div>

                      {/* Top Right Actions */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                        <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-900 flex items-center justify-center hover:bg-white hover:text-teal-600 transition-colors shadow-sm">
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight group-hover:text-teal-600 transition-colors">
                            {location.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium mt-1">{location.city || 'Location'}</p>
                        </div>
                        {location.rating && (
                          <span className="px-2 py-0.5 bg-teal-600/5 text-teal-600 text-[10px] font-mono font-medium rounded border border-teal-600/10 tracking-tight">
                            {location.rating} ★
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 mb-4">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">
                          {location.address || 'Address TBD'}
                        </span>
                      </div>

                      <div className="h-px bg-gray-100 w-full mb-4" />

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5">
                        {location.daily_rate && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                            <span className="text-sm font-mono font-medium text-gray-900">
                              ${location.daily_rate}
                              <span className="text-gray-500 text-xs font-sans font-normal">/day</span>
                            </span>
                          </div>
                        )}
                        {location.permit_required && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-xs text-gray-500">Permit Req.</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Car className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">Parking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-500">Wifi</span>
                        </div>
                      </div>

                      {/* Gallery Thumbs */}
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="w-10 h-10 rounded-md overflow-hidden ring-1 ring-black/5 bg-gray-100" />
                        <div className="w-10 h-10 rounded-md overflow-hidden ring-1 ring-black/5 bg-gray-100" />
                        <div className="w-10 h-10 rounded-md overflow-hidden ring-1 ring-black/5 bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-medium hover:bg-gray-100 transition-colors">
                          +3
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 opacity-60">
                          <Film className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] font-medium text-gray-500">Used</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar (Hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center gap-2 shadow-lg">
                      <button className="flex-1 bg-white border border-teal-600 text-teal-600 text-xs font-medium py-2 rounded-lg hover:bg-teal-600 hover:text-white transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                      <button className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors" title="Get Directions">
                        <Navigation className="w-3.5 h-3.5" />
                      </button>
                      <button className="px-3 py-2 bg-white border border-gray-200 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Location Card */}
              <button
                onClick={() => setShowAddModal(true)}
                className="group relative flex flex-col items-center justify-center h-full min-h-[380px] border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 hover:bg-teal-600/5 hover:border-teal-600/50 transition-all duration-300 cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-gray-100">
                  <MapPin className="w-8 h-8 text-teal-600/60 group-hover:text-teal-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  Add New Location
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-[200px] text-center leading-relaxed">
                  Save your scouting finds, studio spaces, and hidden gems.
                </p>
              </button>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-4 pb-12">
              {sortedLocations.map((location) => (
                <div
                  key={location.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-teal-600/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{location.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{location.city}</span>
                        {location.daily_rate && (
                          <span className="font-mono">${location.daily_rate}/day</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase ${
                        location.location_type === 'INT' ? 'bg-emerald-400' :
                        location.location_type === 'EXT' ? 'bg-blue-400' :
                        location.location_type === 'STUDIO' ? 'bg-purple-400' :
                        'bg-orange-400'
                      }`}>
                        {location.location_type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'map' && (
            <div className="h-[600px] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Map view coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900">Add New Location</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Location Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. The Daily Grind"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Type</Label>
                  <Select
                    value={formData.location_type}
                    onValueChange={(v) => setFormData({ ...formData, location_type: v })}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(LOCATION_TYPES).map((type) => (
                        <SelectItem key={type} value={type}>{LOCATION_TYPES[type].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Daily Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.daily_rate}
                      onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Address</Label>
                <Input
                  type="text"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City</Label>
                <Input
                  type="text"
                  placeholder="City, State"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</Label>
                <textarea
                  placeholder="Additional notes about this location..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 min-h-[100px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permit_required"
                  checked={formData.permit_required}
                  onChange={(e) => setFormData({ ...formData, permit_required: e.target.checked })}
                  className="rounded border-gray-200 text-teal-600 focus:ring-teal-600"
                />
                <Label htmlFor="permit_required" className="text-xs text-gray-900 select-none">
                  Permit Required
                </Label>
              </div>
            </form>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 transition-colors"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

