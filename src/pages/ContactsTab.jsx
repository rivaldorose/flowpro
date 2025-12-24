import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ArrowLeft, Search, Filter, LayoutGrid, List, Plus, MoreVertical,
  Mail, Phone, Film, Camera, X, CheckCircle2, Star, MapPin, Globe,
  Instagram, Linkedin, Copy, ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const ROLE_TYPES = {
  'cast': { label: 'Cast', color: 'bg-purple-100 text-purple-700', iconColor: 'text-secondary' },
  'crew': { label: 'Crew', color: 'bg-blue-100 text-blue-700', iconColor: 'text-primary' },
  'vendor': { label: 'Vendor', color: 'bg-orange-100 text-orange-700', iconColor: 'text-accent' },
  'client': { label: 'Client', color: 'bg-teal-100 text-teal-700', iconColor: 'text-teal-600' },
};

const STATUS_COLORS = {
  'available': 'bg-green-500',
  'busy': 'bg-yellow-500',
  'unavailable': 'bg-red-500',
};

export default function ContactsTab({ projectId }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  const { data: crew = [] } = useQuery({
    queryKey: ['crew'],
    queryFn: () => base44.entities.CrewMember.list('name'),
  });

  const [formData, setFormData] = useState({
    name: '',
    role_type: 'crew',
    job_title: '',
    department: '',
    email: '',
    phone: '',
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CrewMember.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew'] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role_type: 'crew',
      job_title: '',
      department: '',
      email: '',
      phone: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      name: formData.name,
      role: formData.job_title,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
    });
  };

  const filteredContacts = crew.filter(contact => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!contact.name?.toLowerCase().includes(query) &&
          !contact.role?.toLowerCase().includes(query) &&
          !contact.email?.toLowerCase().includes(query) &&
          !contact.phone?.includes(query)) {
        return false;
      }
    }
    if (filterType !== 'all') {
      // You might need to add a role_type field to CrewMember
      return true; // For now, show all
    }
    return true;
  });

  const openContactDetail = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-gray-900">Contacts</h2>
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-mono font-medium">
            {filteredContacts.length} people
          </span>
        </div>
        
        <div className="flex items-center gap-3 flex-1 justify-center max-w-md">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, role, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all"
            />
            <div className="absolute right-2 top-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-gray-200 rounded text-[10px] font-mono text-gray-500 bg-white">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
            <Filter className="w-3.5 h-3.5" />
            <span>All People</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          <div className="flex bg-gray-100/50 rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-blue-600 border border-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-blue-600 border border-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors border border-blue-700/10 ml-2"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>

          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Add New Card */}
            <button
              onClick={() => setShowAddModal(true)}
              className="h-full min-h-[340px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-4 text-gray-500 hover:border-blue-600 hover:bg-blue-50/30 hover:text-blue-600 transition-all group cursor-pointer bg-white/50"
            >
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Add New Contact</h3>
                <p className="text-xs mt-1 opacity-70">Cast, crew, or vendors</p>
              </div>
            </button>

            {/* Contact Cards */}
            {filteredContacts.map((contact) => {
              const roleType = contact.role_type || 'crew';
              const roleInfo = ROLE_TYPES[roleType] || ROLE_TYPES.crew;
              const status = contact.status || 'available';
              
              return (
                <div
                  key={contact.id}
                  onClick={() => openContactDetail(contact)}
                  className="contact-card bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="p-6 flex flex-col items-center flex-1">
                    <div className="relative mb-4">
                      {contact.avatar ? (
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-md ${
                          roleType === 'vendor' ? 'bg-orange-100' :
                          roleType === 'cast' ? 'bg-purple-100' :
                          roleType === 'client' ? 'bg-teal-100' :
                          'bg-blue-100'
                        }`}>
                          <span className={`text-2xl font-bold ${
                            roleType === 'vendor' ? 'text-orange-600' :
                            roleType === 'cast' ? 'text-purple-600' :
                            roleType === 'client' ? 'text-teal-600' :
                            'text-blue-600'
                          }`}>
                            {getInitials(contact.name)}
                          </span>
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-1 w-5 h-5 ${STATUS_COLORS[status] || STATUS_COLORS.available} border-2 border-white rounded-full`}
                        title={status}
                      />
                    </div>

                    <div className="text-center mb-4 w-full">
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight">{contact.name}</h3>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{contact.role || 'No role'}</p>
                      <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full ${roleInfo.color} text-[10px] font-bold tracking-wide uppercase`}>
                        {roleInfo.label}
                      </span>
                    </div>

                    <div className="w-full space-y-2 mt-2">
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-xs text-gray-500 hover:text-blue-600 transition-colors group"
                        >
                          <Mail className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
                          <span className="truncate">{contact.email}</span>
                        </a>
                      )}
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-xs text-gray-500 hover:text-blue-600 transition-colors group"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
                          <span className="font-mono tracking-tight">{contact.phone}</span>
                        </a>
                      )}
                      <div className="flex items-center gap-3 p-2 text-xs text-gray-500">
                        <Film className="w-3.5 h-3.5 text-gray-400" />
                        <span>Used in projects</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-3 grid grid-cols-3 gap-2 bg-gray-50/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (contact.phone) window.location.href = `tel:${contact.phone}`;
                      }}
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-blue-600 transition-all text-xs font-medium border border-transparent hover:border-gray-200"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (contact.email) window.location.href = `mailto:${contact.email}`;
                      }}
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-blue-600 transition-all text-xs font-medium border border-transparent hover:border-gray-200"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all text-xs font-medium border border-transparent hover:border-gray-200"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Detail Modal */}
      {showDetailModal && selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-4 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50/50 relative">
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 hover:bg-gray-50"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-start gap-6">
                <div className="relative shrink-0">
                  {selectedContact.avatar ? (
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-4xl font-bold text-blue-600">{getInitials(selectedContact.name)}</span>
                    </div>
                  )}
                  <button className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow border border-gray-200 text-gray-500 hover:text-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{selectedContact.name}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-lg text-gray-500 font-medium">{selectedContact.role || 'No role'}</span>
                        <span className={`px-2.5 py-0.5 rounded-full ${ROLE_TYPES[selectedContact.role_type || 'crew'].color} text-xs font-bold tracking-wide uppercase`}>
                          {ROLE_TYPES[selectedContact.role_type || 'crew'].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          Available Now
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>Used in projects</span>
                      </div>
                    </div>
                    <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      Call Mobile
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button className="p-2 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors ml-auto">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 mt-8 border-b border-gray-200">
                {['Info', 'Availability', 'Projects', 'Files', 'Notes'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-1 pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab.toLowerCase()
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="grid grid-cols-5 gap-8">
                <div className="col-span-3 space-y-8">
                  {/* Contact Info */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Information</h3>
                      <button className="text-xs text-blue-600 font-medium hover:underline">Edit</button>
                    </div>
                    <div className="space-y-4">
                      {selectedContact.email && (
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Email (Primary)</label>
                            <div className="flex items-center justify-between group cursor-pointer">
                              <p className="text-sm font-medium text-gray-900">{selectedContact.email}</p>
                              <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedContact.phone && (
                        <div className="flex items-start gap-4">
                          <div className="mt-1 p-2 bg-green-50 text-green-600 rounded-lg">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Mobile</label>
                            <div className="flex items-center justify-between group cursor-pointer">
                              <p className="text-sm font-mono font-medium text-gray-900 tracking-tight">{selectedContact.phone}</p>
                              <Copy className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-8">
                  {/* Availability */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Availability</h3>
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3 mb-4">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-bold text-green-800">Available for Booking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center">
              <button className="text-xs text-red-600 font-medium hover:text-red-700 px-3 py-2 rounded hover:bg-red-50 transition-colors">
                Delete Contact
              </button>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
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
              <h2 className="text-sm font-bold text-gray-900">Add New Contact</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-600 hover:text-blue-600 text-gray-500 transition-all">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Full Name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Role Type</Label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(ROLE_TYPES).map(([key, role]) => (
                    <label key={key} className="cursor-pointer">
                      <input
                        type="radio"
                        name="role_type"
                        className="peer sr-only"
                        checked={formData.role_type === key}
                        onChange={() => setFormData({ ...formData, role_type: key })}
                      />
                      <div className={`text-center py-2 px-1 text-xs font-medium bg-white border border-gray-200 rounded-lg transition-all hover:bg-gray-50 ${
                        formData.role_type === key
                          ? `${role.color} border-current`
                          : 'text-gray-500'
                      }`}>
                        {role.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Job Title</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Key Grip"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(v) => setFormData({ ...formData, department: v })}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      <SelectValue placeholder="Select dept..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="sound">Sound</SelectItem>
                      <SelectItem value="grip">Grip & Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox id="add-another" />
                <span className="text-xs text-gray-900 select-none">Add another</span>
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Save Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

