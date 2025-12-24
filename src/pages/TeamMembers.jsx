import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  UserPlus, 
  MoreVertical, 
  Crown, 
  Lock, 
  Link as LinkIcon, 
  Globe, 
  Copy, 
  QrCode, 
  RefreshCw, 
  Key, 
  Timer, 
  Check, 
  X, 
  Send, 
  Mail, 
  ChevronDown, 
  Circle, 
  CheckCircle2,
  Minus,
  Loader2
} from 'lucide-react'

export default function TeamMembers() {
  const navigate = useNavigate()
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [matrixOpen, setMatrixOpen] = useState(false)
  const [visibility, setVisibility] = useState('private')
  const [linkSettingsVisible, setLinkSettingsVisible] = useState(false)
  const [defaultRole, setDefaultRole] = useState('editor')
  const [editorsCanInvite, setEditorsCanInvite] = useState(true)
  const [membersCanSeeList, setMembersCanSeeList] = useState(false)
  const [passwordProtect, setPasswordProtect] = useState(false)
  const [expirationDate, setExpirationDate] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [inviteMessage, setInviteMessage] = useState('')
  const [sendNotification, setSendNotification] = useState(true)
  const [emailTags, setEmailTags] = useState(['designer@studio.com'])

  const toggleModal = () => {
    setInviteModalOpen(!inviteModalOpen)
    document.body.style.overflow = inviteModalOpen ? 'auto' : 'hidden'
  }

  const toggleMatrix = () => {
    setMatrixOpen(!matrixOpen)
  }

  const handleVisibilityChange = (value) => {
    setVisibility(value)
    setLinkSettingsVisible(value === 'link' || value === 'public')
  }

  const removeEmailTag = (email) => {
    setEmailTags(emailTags.filter(e => e !== email))
  }

  const addEmailTag = (email) => {
    if (email && !emailTags.includes(email)) {
      setEmailTags([...emailTags, email])
      setInviteEmail('')
    }
  }

  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter' && inviteEmail) {
      e.preventDefault()
      addEmailTag(inviteEmail)
    }
  }

  return (
    <div className="bg-[#FAF8F5] text-[#1F2937] font-sans h-screen flex flex-col overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* TOP BAR */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 z-40 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#6B7280] hover:text-[#1F2937] transition-colors p-1.5 hover:bg-[#FAF8F5] rounded-md group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="h-4 w-px bg-[#E5E7EB]"></div>
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-[#6B7280] hover:text-[#1F2937] cursor-pointer transition-colors">Settings</span>
            <span className="text-[#E5E7EB]">/</span>
            <span className="font-semibold text-[#1F2937]">Team & Sharing</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] font-medium hidden sm:inline-block">Auto-save on</span>
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[900px] mx-auto px-6 py-8 pb-32 space-y-10">
          {/* SECTION 1: TEAM MEMBERS */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937] tracking-tight">Team Members</h2>
                <p className="text-sm text-[#6B7280] mt-1">Manage who has access to this project.</p>
              </div>
              <button 
                onClick={toggleModal}
                className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OWNER CARD */}
              <div className="bg-white border border-[#6B46C1]/30 rounded-xl p-5 shadow-sm relative group hover:shadow-md transition-all ring-1 ring-[#6B46C1]/10">
                <div className="absolute top-4 right-4 text-[#6B7280] hover:text-[#1F2937] cursor-pointer">
                  <MoreVertical className="w-4.5 h-4.5" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#6B46C1]/20" 
                      alt="Sarah"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#6B46C1] text-white rounded-full p-0.5 border-2 border-white" title="Owner">
                      <Crown className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1F2937] truncate">Sarah Johnson</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#6B46C1]/10 text-[#6B46C1] border border-[#6B46C1]/20 uppercase tracking-wide">Owner</span>
                    </div>
                    <p className="text-sm text-[#6B7280] truncate">sarah@example.com (You)</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Online</span>
                      <span>•</span>
                      <span>Full access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* EDITOR CARD */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm relative group hover:shadow-md transition-all">
                <div className="absolute top-4 right-4 text-[#6B7280] hover:text-[#1F2937] cursor-pointer">
                  <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical className="w-4.5 h-4.5" /></button>
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop" 
                      className="w-14 h-14 rounded-full object-cover border border-[#E5E7EB]" 
                      alt="John"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1F2937] truncate">John Smith</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 uppercase tracking-wide">Editor</span>
                    </div>
                    <p className="text-sm text-[#6B7280] truncate">john@example.com</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[#6B7280]">Active 2h ago</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs font-medium text-[#6B7280] hover:text-[#3B82F6] transition-colors">Change Role</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* VIEWER CARD */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm relative group hover:shadow-md transition-all">
                <div className="absolute top-4 right-4 text-[#6B7280] hover:text-[#1F2937] cursor-pointer">
                  <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical className="w-4.5 h-4.5" /></button>
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-[#6B7280] border border-[#E5E7EB] text-lg font-medium">EK</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1F2937] truncate">Elena Kovacs</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-[#6B7280] border border-gray-200 uppercase tracking-wide">Viewer</span>
                    </div>
                    <p className="text-sm text-[#6B7280] truncate">elena.k@agency.com</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[#6B7280]">Joined yesterday</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs font-medium text-[#6B7280] hover:text-[#3B82F6] transition-colors">Change Role</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Invites */}
            <div className="mt-6 border-t border-[#E5E7EB] pt-6">
              <h3 className="text-sm font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                Pending Invitations
                <span className="px-1.5 py-0.5 bg-gray-100 text-[#6B7280] rounded-full text-xs font-normal">1</span>
              </h3>
              <div className="bg-white border border-[#E5E7EB] rounded-lg divide-y divide-[#E5E7EB]">
                <div className="p-3 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1F2937]">alex@production.co</p>
                      <p className="text-xs text-[#6B7280]">Invited as <span className="text-[#3B82F6] font-medium">Editor</span> • Sent Mar 20</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded transition-colors" title="Resend">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors" title="Cancel">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: TEAM SETTINGS */}
          <section>
            <h2 className="text-xl font-bold text-[#1F2937] tracking-tight mb-4">Team Settings</h2>
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Default Role */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#1F2937]">Default Role for New Members</label>
                  <div className="relative">
                    <select 
                      value={defaultRole}
                      onChange={(e) => setDefaultRole(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#1F2937] appearance-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] shadow-sm cursor-pointer hover:border-[#6B7280]/40 transition-colors"
                    >
                      <option value="editor">Editor</option>
                      <option value="commenter">Commenter</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none text-[#6B7280]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-[#6B7280]">This role will be applied automatically when inviting multiple people via link.</p>
                </div>

                {/* Permissions Toggles */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-[#1F2937]">Member Permissions</label>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="perm-invite" 
                        checked={editorsCanInvite}
                        onChange={(e) => setEditorsCanInvite(e.target.checked)}
                        className="mt-0.5 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="perm-invite" className="text-sm text-[#1F2937] font-medium cursor-pointer">Editors can invite others</label>
                        <p className="text-xs text-[#6B7280]">Allow members with Editor role to send invitations.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="perm-list" 
                        checked={membersCanSeeList}
                        onChange={(e) => setMembersCanSeeList(e.target.checked)}
                        className="mt-0.5 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="perm-list" className="text-sm text-[#1F2937] font-medium cursor-pointer">Members can see full team list</label>
                        <p className="text-xs text-[#6B7280]">If unchecked, members only see admins and themselves.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matrix Toggle */}
              <div className="border-t border-[#E5E7EB] bg-gray-50/50 p-2">
                <button 
                  onClick={toggleMatrix}
                  className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#6B7280] hover:text-[#3B82F6] py-2 transition-colors"
                >
                  <span>{matrixOpen ? 'Hide Permission Details' : 'View Permission Details'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${matrixOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Permission Matrix (Collapsible) */}
              <div className={`overflow-hidden transition-all duration-300 ${matrixOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} border-t border-[#E5E7EB] bg-white`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#6B7280] uppercase bg-gray-50/50 font-semibold tracking-wider">
                      <tr>
                        <th className="px-6 py-3 border-b border-[#E5E7EB]">Action</th>
                        <th className="px-6 py-3 border-b border-[#E5E7EB] text-center text-[#6B46C1]">Owner</th>
                        <th className="px-6 py-3 border-b border-[#E5E7EB] text-center text-[#3B82F6]">Editor</th>
                        <th className="px-6 py-3 border-b border-[#E5E7EB] text-center text-orange-500">Commenter</th>
                        <th className="px-6 py-3 border-b border-[#E5E7EB] text-center text-gray-500">Viewer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
                      <tr>
                        <td className="px-6 py-3 font-medium">View content</td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3 font-medium">Edit content</td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-gray-300"><X className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-gray-300"><X className="w-4 h-4 inline" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3 font-medium">Invite members</td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-[#6B7280]"><Minus className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-gray-300"><X className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-gray-300"><X className="w-4 h-4 inline" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-3 font-medium">Delete project</td>
                        <td className="px-6 py-3 text-center text-[#10B981]"><Check className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-gray-300"><X className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-gray-300"><X className="w-4 h-4 inline" /></td>
                        <td className="px-6 py-3 text-center text-gray-300"><X className="w-4 h-4 inline" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: SHARING & PRIVACY */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-[#1F2937] tracking-tight">Sharing & Privacy</h2>
              <p className="text-sm text-[#6B7280] mt-1">Control visibility and external access.</p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] p-6 space-y-8">
              {/* Visibility Radios */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-[#1F2937]">Project Visibility</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Private */}
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="private" 
                      className="peer sr-only" 
                      checked={visibility === 'private'}
                      onChange={() => handleVisibilityChange('private')}
                    />
                    <div className={`p-4 rounded-xl border bg-white transition-all hover:border-[#6B46C1]/50 h-full ${
                      visibility === 'private' 
                        ? 'border-[#6B46C1] ring-1 ring-[#6B46C1]/50 bg-[#6B46C1]/5' 
                        : 'border-[#E5E7EB]'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          visibility === 'private' 
                            ? 'bg-[#6B46C1] text-white' 
                            : 'bg-gray-100 text-[#6B7280]'
                        }`}>
                          <Lock className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[#1F2937] text-sm">Private</span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed">Only invited team members can access this project. Best for strict security.</p>
                    </div>
                  </label>

                  {/* Link Sharing */}
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="link" 
                      className="peer sr-only" 
                      checked={visibility === 'link'}
                      onChange={() => handleVisibilityChange('link')}
                    />
                    <div className={`p-4 rounded-xl border bg-white transition-all hover:border-[#3B82F6]/50 h-full ${
                      visibility === 'link' 
                        ? 'border-[#3B82F6] ring-1 ring-[#3B82F6]/50 bg-[#3B82F6]/5' 
                        : 'border-[#E5E7EB]'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          visibility === 'link' 
                            ? 'bg-[#3B82F6] text-white' 
                            : 'bg-gray-100 text-[#6B7280]'
                        }`}>
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[#1F2937] text-sm">Link Sharing</span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed">Anyone with the link can view. You can set passwords or expiration dates.</p>
                    </div>
                  </label>

                  {/* Public */}
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="public" 
                      className="peer sr-only" 
                      checked={visibility === 'public'}
                      onChange={() => handleVisibilityChange('public')}
                    />
                    <div className={`p-4 rounded-xl border bg-white transition-all hover:border-[#10B981]/50 h-full ${
                      visibility === 'public' 
                        ? 'border-[#10B981] ring-1 ring-[#10B981]/50 bg-[#10B981]/5' 
                        : 'border-[#E5E7EB]'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          visibility === 'public' 
                            ? 'bg-[#10B981] text-white' 
                            : 'bg-gray-100 text-[#6B7280]'
                        }`}>
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[#1F2937] text-sm">Public</span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-relaxed">Visible to everyone on the web. Great for portfolios and showcases.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Link Settings (Conditional) */}
              {linkSettingsVisible && (
                <div className="border-t border-[#E5E7EB] pt-6 animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-[#1F2937]">Share Link</label>
                        <span className="text-xs text-[#10B981] flex items-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Active
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#6B7280] font-mono truncate select-all">
                          flowpro.app/p/x8j9-2kmd-zn4q
                        </div>
                        <button className="px-3 py-2 bg-white border border-[#E5E7EB] hover:border-[#3B82F6] hover:text-[#3B82F6] text-[#6B7280] rounded-lg transition-colors shadow-sm" title="Copy">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 bg-white border border-[#E5E7EB] hover:border-[#1F2937] text-[#6B7280] rounded-lg transition-colors shadow-sm" title="QR Code">
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-4 pt-1">
                        <button className="text-xs text-[#EF4444] hover:text-red-700 font-medium flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          Revoke & Generate New
                        </button>
                      </div>
                    </div>

                    <div className="w-px bg-[#E5E7EB] hidden md:block"></div>

                    <div className="flex-1 space-y-4">
                      <label className="text-sm font-medium text-[#1F2937]">Access Controls</label>
                      
                      {/* Password */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-white border border-[#E5E7EB] rounded text-[#6B7280]">
                            <Key className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-sm text-[#1F2937]">Password protect</span>
                        </div>
                        <div className="pt-1">
                          <label className="relative inline-block w-9 h-5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={passwordProtect}
                              onChange={(e) => setPasswordProtect(e.target.checked)}
                            />
                            <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                              passwordProtect ? 'bg-[#3B82F6]' : 'bg-gray-200'
                            }`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-all duration-200 ${
                              passwordProtect ? 'translate-x-4' : 'translate-x-0'
                            }`}></div>
                          </label>
                        </div>
                      </div>

                      {/* Expiration */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-white border border-[#E5E7EB] rounded text-[#6B7280]">
                            <Timer className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-sm text-[#1F2937]">Expiration date</span>
                        </div>
                        <div className="pt-1">
                          <label className="relative inline-block w-9 h-5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={expirationDate}
                              onChange={(e) => setExpirationDate(e.target.checked)}
                            />
                            <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                              expirationDate ? 'bg-[#3B82F6]' : 'bg-gray-200'
                            }`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-all duration-200 ${
                              expirationDate ? 'translate-x-4' : 'translate-x-0'
                            }`}></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 4: ACTIVITY LOG */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1F2937] tracking-tight">Activity & Access Log</h2>
              <button className="text-sm text-[#3B82F6] hover:underline font-medium">View Full Log</button>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs text-[#6B7280] font-medium uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 border-b border-[#E5E7EB]">User</th>
                      <th className="px-6 py-3 border-b border-[#E5E7EB]">Action</th>
                      <th className="px-6 py-3 border-b border-[#E5E7EB]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    <tr className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-[#1F2937] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] text-[10px] flex items-center justify-center font-bold">SJ</div>
                        Sarah Johnson
                      </td>
                      <td className="px-6 py-3 text-[#6B7280]">Changed project settings</td>
                      <td className="px-6 py-3 text-[#6B7280] text-xs">Mar 20, 2:15 PM</td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-[#1F2937] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] flex items-center justify-center font-bold">JS</div>
                        John Smith
                      </td>
                      <td className="px-6 py-3 text-[#6B7280]">Edited <span className="text-[#1F2937] font-medium">Screenplay v2</span></td>
                      <td className="px-6 py-3 text-[#6B7280] text-xs">Mar 20, 10:42 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* STICKY BOTTOM BAR */}
      <div className="border-t border-[#E5E7EB] bg-white px-6 py-4 flex items-center justify-between sticky bottom-0 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-medium text-[#1F2937] bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#6B7280] hidden sm:inline">Last saved 3 mins ago</span>
          <button className="px-6 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 group">
            <Loader2 className="w-4 h-4 hidden group-hover:inline-block animate-spin" />
            Save Changes
          </button>
        </div>
      </div>

      {/* INVITE MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={toggleModal}
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-[#E5E7EB]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                  <h3 className="text-lg font-semibold text-[#1F2937]" id="modal-title">Invite Team Members</h3>
                  <button 
                    onClick={toggleModal}
                    className="text-[#6B7280] hover:text-[#1F2937] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1F2937]">Email Addresses <span className="text-[#EF4444]">*</span></label>
                    <div className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-[#3B82F6]/20 focus-within:border-[#3B82F6] transition-all shadow-sm flex flex-wrap gap-2 items-center min-h-[46px]">
                      {/* Tags */}
                      {emailTags.map((email, idx) => (
                        <div key={idx} className="bg-gray-100 border border-gray-200 rounded flex items-center pl-2 pr-1 py-0.5 gap-1">
                          <span className="text-xs font-medium text-[#1F2937]">{email}</span>
                          <button 
                            onClick={() => removeEmailTag(email)}
                            className="hover:bg-gray-200 rounded p-0.5"
                          >
                            <X className="w-3 h-3 text-[#6B7280]" />
                          </button>
                        </div>
                      ))}
                      <input 
                        type="text" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyPress={handleEmailKeyPress}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[#1F2937] placeholder:text-[#6B7280]/50 p-0 min-w-[200px]" 
                        placeholder="Type email and press Enter"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1F2937]">Role</label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`relative flex cursor-pointer rounded-lg border p-3 shadow-sm focus:outline-none ${
                        inviteRole === 'editor' 
                          ? 'border-[#3B82F6] bg-[#3B82F6]/5' 
                          : 'border-[#E5E7EB] bg-white hover:border-[#6B7280]/30'
                      }`}>
                        <input 
                          type="radio" 
                          name="invite-role" 
                          value="editor" 
                          className="sr-only" 
                          checked={inviteRole === 'editor'}
                          onChange={(e) => setInviteRole(e.target.value)}
                        />
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                            <span className="block text-sm font-medium text-[#3B82F6]">Editor</span>
                            <span className="mt-1 flex items-center text-xs text-[#6B7280]">Can view, edit content, and manage tasks.</span>
                          </span>
                        </span>
                        {inviteRole === 'editor' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#3B82F6]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#E5E7EB]" />
                        )}
                      </label>
                      
                      <label className={`relative flex cursor-pointer rounded-lg border p-3 shadow-sm focus:outline-none ${
                        inviteRole === 'viewer' 
                          ? 'border-[#3B82F6] bg-[#3B82F6]/5' 
                          : 'border-[#E5E7EB] bg-white hover:border-[#6B7280]/30'
                      }`}>
                        <input 
                          type="radio" 
                          name="invite-role" 
                          value="viewer" 
                          className="sr-only"
                          checked={inviteRole === 'viewer'}
                          onChange={(e) => setInviteRole(e.target.value)}
                        />
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                            <span className="block text-sm font-medium text-[#1F2937]">Viewer</span>
                            <span className="mt-1 flex items-center text-xs text-[#6B7280]">Read-only access to approved files.</span>
                          </span>
                        </span>
                        {inviteRole === 'viewer' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#3B82F6]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#E5E7EB]" />
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1F2937]">
                      Personal Message <span className="text-[#6B7280] text-xs font-normal">(Optional)</span>
                    </label>
                    <textarea 
                      rows="3" 
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] resize-none" 
                      placeholder="Hey! Join me on this project..."
                    ></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-[#E5E7EB] rounded-b-xl">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="notify" 
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      className="rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="notify" className="text-xs text-[#6B7280] cursor-pointer select-none">Send email notification</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={toggleModal}
                      className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#1F2937] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={toggleModal}
                      className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                    >
                      Send Invites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

