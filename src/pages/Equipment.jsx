import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckSquare, 
  Table2, 
  Download, 
  Plus, 
  ChevronDown, 
  Package, 
  CheckCircle2, 
  Banknote, 
  AlertCircle, 
  Camera, 
  Lightbulb, 
  Mic2, 
  MoreVertical, 
  MoreHorizontal, 
  Check, 
  Clock, 
  AlertTriangle, 
  Copy, 
  X, 
  Library
} from 'lucide-react'

export default function Equipment() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('checklist')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({
    camera: true,
    lighting: false,
    audio: false
  })

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const toggleModal = (modalType) => {
    if (modalType === 'add') {
      setAddModalOpen(!addModalOpen)
    } else if (modalType === 'detail') {
      setDetailModalOpen(!detailModalOpen)
    }
    document.body.style.overflow = (addModalOpen || detailModalOpen) ? 'auto' : 'hidden'
  }

  return (
    <div className="bg-[#FAF8F5] text-[#1F2937] font-sans h-screen flex flex-col overflow-hidden selection:bg-[#6B46C1]/20 selection:text-[#6B46C1]">
      {/* TOP BAR */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 z-40 shrink-0 shadow-sm">
        {/* Left: Context */}
        <div className="flex items-center gap-4 w-1/3">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#6B7280] hover:text-[#1F2937] transition-colors p-1 hover:bg-[#FAF8F5] rounded-md group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Production Planning</span>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#1F2937] tracking-tight leading-none mt-0.5">Equipment</h1>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280] border border-[#E5E7EB] text-[10px] font-mono font-medium">32 items</span>
            </div>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex items-center justify-center w-1/3">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-[#6B7280] group-focus-within:text-[#6B46C1] transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment, specs, or vendors..." 
              className="w-full bg-gray-50 border border-[#E5E7EB] rounded-lg pl-10 pr-4 py-2 text-sm text-[#1F2937] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1] focus:bg-white transition-all"
            />
            <div className="absolute right-2 top-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-[#E5E7EB] rounded text-[10px] font-mono text-[#6B7280] bg-white">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          {/* Filter */}
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-md text-xs font-medium text-[#6B7280] hover:text-[#1F2937] hover:border-gray-300 transition-all shadow-sm">
            <Filter className="w-3.5 h-3.5" />
            <span>All Equipment</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* View Toggle */}
          <div className="flex bg-gray-100/50 rounded-lg p-1 border border-[#E5E7EB]">
            <button 
              onClick={() => setViewMode('checklist')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-all ${
                viewMode === 'checklist' 
                  ? 'bg-white shadow-sm text-[#6B46C1] border border-[#E5E7EB]/50' 
                  : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-white/50'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-all ${
                viewMode === 'table' 
                  ? 'bg-white shadow-sm text-[#6B46C1] border border-[#E5E7EB]/50' 
                  : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-white/50'
              }`}
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>

          {/* Export */}
          <button className="p-2 text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-[#E5E7EB]">
            <Download className="w-4.5 h-4.5" />
          </button>

          {/* Add Button */}
          <button 
            onClick={() => toggleModal('add')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#6B46C1] rounded-lg shadow-sm hover:bg-[#553C9A] transition-colors border border-[#553C9A]/10 ml-2"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </button>
        </div>
      </header>

      {/* MAIN SCROLLABLE AREA */}
      <main className="flex-1 overflow-y-auto bg-[#FAF8F5] p-6">
        <div className="max-w-[1400px] mx-auto pb-20 space-y-6">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total */}
            <button className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col items-start hover:border-[#6B46C1]/30 transition-colors text-left group">
              <div className="flex items-center gap-2 text-[#6B7280] mb-3">
                <Package className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Total Items</span>
              </div>
              <span className="text-2xl font-bold text-[#1F2937] tracking-tight group-hover:text-[#6B46C1] transition-colors">32</span>
              <span className="text-xs text-[#6B7280] mt-1">All categories</span>
            </button>

            {/* Owned */}
            <button className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col items-start hover:border-[#10B981]/30 transition-colors text-left group">
              <div className="flex items-center gap-2 text-[#6B7280] mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Owned</span>
              </div>
              <span className="text-2xl font-bold text-[#10B981] tracking-tight">18</span>
              <span className="text-xs text-[#6B7280] mt-1">From inventory</span>
            </button>

            {/* Rented */}
            <button className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col items-start hover:border-[#3B82F6]/30 transition-colors text-left group">
              <div className="flex items-center gap-2 text-[#6B7280] mb-3">
                <Banknote className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Rented</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#3B82F6] tracking-tight">12</span>
                <span className="text-sm font-mono text-[#6B7280] bg-gray-100 px-1.5 rounded">$3,450</span>
              </div>
              <span className="text-xs text-[#6B7280] mt-1">Total rental cost</span>
            </button>

            {/* Needed */}
            <button className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col items-start hover:border-[#EF4444]/30 transition-colors text-left group">
              <div className="flex items-center gap-2 text-[#6B7280] mb-3">
                <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Still Needed</span>
              </div>
              <span className="text-2xl font-bold text-[#EF4444] tracking-tight">2</span>
              <span className="text-xs text-[#6B7280] mt-1">Not yet sourced</span>
            </button>
          </div>

          {/* CATEGORY: CAMERA (EXPANDED) */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Header */}
            <button 
              onClick={() => toggleCategory('camera')}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-[#E5E7EB] group"
            >
              <div className="flex items-center gap-4">
                <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform duration-200 ${expandedCategories.camera ? '' : '-rotate-90'}`} />
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-white rounded-md border border-[#E5E7EB] shadow-sm text-[#6B46C1]">
                    <Camera className="w-4.5 h-4.5" />
                  </span>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wide">Camera</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-[#6B7280] text-[10px] font-mono font-medium">8 items</span>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                {/* Progress */}
                <div className="flex flex-col w-48 gap-1.5">
                  <div className="flex justify-between text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">
                    <span>80% Secured</span>
                    <span>6/8</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] w-[80%] rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]/50">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleModal('add')
                    }}
                    className="text-xs font-semibold text-[#6B46C1] hover:text-[#553C9A] hover:bg-[#6B46C1]/5 px-2 py-1 rounded transition-colors"
                  >
                    + Add Item
                  </button>
                  <button className="text-[#6B7280] hover:text-[#1F2937] p-1 rounded hover:bg-gray-200 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </button>

            {/* Content */}
            {expandedCategories.camera && (
              <div className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-gray-50/30 text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold">
                      <th className="py-3 pl-4 pr-2 w-10">
                        <div className="cursor-pointer">
                          <input type="checkbox" className="hidden" />
                          <div className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center transition-all hover:border-gray-400">
                            <Check className="w-3 h-3 text-white hidden" />
                          </div>
                        </div>
                      </th>
                      <th className="py-3 px-2 w-1/4">Item Name</th>
                      <th className="py-3 px-2 w-1/5">Specs</th>
                      <th className="py-3 px-2">Source</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Days</th>
                      <th className="py-3 px-2 text-right">Cost</th>
                      <th className="py-3 pl-2 pr-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {/* Row 1: Owned & Confirmed */}
                    <tr 
                      className="border-b border-[#E5E7EB] last:border-0 group cursor-pointer hover:bg-[#6B46C1]/5 transition-colors" 
                      onClick={() => toggleModal('detail')}
                    >
                      <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                        <label className="cursor-pointer">
                          <input type="checkbox" checked className="hidden" />
                          <div className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center transition-all">
                            <Check className="w-3 h-3 text-white hidden" />
                          </div>
                        </label>
                      </td>
                      <td className="py-3 px-2 font-semibold text-[#1F2937]">Canon R5 Body</td>
                      <td className="py-3 px-2 font-mono text-xs text-[#6B7280]">45MP, 8K, RF Mount</td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#10B981] border border-[#10B981]/20 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Owned
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs font-medium text-[#10B981] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Reserved
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-[#6B7280]">Day 1-5</td>
                      <td className="py-3 px-2 text-right font-mono text-xs text-[#6B7280]">-</td>
                      <td className="py-3 pl-2 pr-4 text-right">
                        <button 
                          className="text-gray-400 hover:text-[#1F2937] opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Row 2: Rented & Pending */}
                    <tr 
                      className="border-b border-[#E5E7EB] last:border-0 group cursor-pointer hover:bg-[#6B46C1]/5 transition-colors" 
                      onClick={() => toggleModal('detail')}
                    >
                      <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                        <label className="cursor-pointer">
                          <input type="checkbox" className="hidden" />
                          <div className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center transition-all hover:border-gray-400">
                            <Check className="w-3 h-3 text-white hidden" />
                          </div>
                        </label>
                      </td>
                      <td className="py-3 px-2 font-semibold text-[#1F2937]">Canon 24-70mm f/2.8</td>
                      <td className="py-3 px-2 font-mono text-xs text-[#6B7280]">RF Mount, L-Series</td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#3B82F6] border border-[#3B82F6]/20 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span> Rent: ABC
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs font-medium text-[#3B82F6] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Confirmed
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-[#6B7280]">Day 1-5</td>
                      <td className="py-3 px-2 text-right font-mono text-xs text-[#1F2937]">$150/d</td>
                      <td className="py-3 pl-2 pr-4 text-right">
                        <button 
                          className="text-gray-400 hover:text-[#1F2937] opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Row 3: Needed & Warning */}
                    <tr 
                      className="border-b border-[#E5E7EB] last:border-0 bg-red-50/10 group cursor-pointer hover:bg-red-50/20 transition-colors" 
                      onClick={() => toggleModal('detail')}
                    >
                      <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                        <label className="cursor-pointer">
                          <input type="checkbox" className="hidden" />
                          <div className="w-4 h-4 border border-[#EF4444] rounded bg-white flex items-center justify-center transition-all hover:bg-red-50">
                            <Check className="w-3 h-3 text-white hidden" />
                          </div>
                        </label>
                      </td>
                      <td className="py-3 px-2 font-semibold text-[#1F2937]">ND Filter Set</td>
                      <td className="py-3 px-2 font-mono text-xs text-[#6B7280]">Variable ND, 82mm</td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-[#EF4444] border border-[#EF4444]/20 uppercase tracking-wide">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Source
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs font-medium text-[#EF4444] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Needed
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-[#6B7280]">Day 2, 4</td>
                      <td className="py-3 px-2 text-right font-mono text-xs text-[#6B7280]">TBD</td>
                      <td className="py-3 pl-2 pr-4 text-right">
                        <button 
                          className="text-gray-400 hover:text-[#1F2937] opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50/50 border-t border-[#E5E7EB]">
                    <tr>
                      <td colSpan={6} className="py-2 px-4 text-xs font-medium text-[#6B7280] text-right uppercase tracking-wider">Category Rental Total</td>
                      <td className="py-2 px-2 text-right font-mono text-xs font-bold text-[#1F2937]">$750</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* CATEGORY: LIGHTING (COLLAPSED) */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] overflow-hidden">
            <button 
              onClick={() => toggleCategory('lighting')}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-transparent hover:border-[#E5E7EB] group"
            >
              <div className="flex items-center gap-4">
                <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform duration-200 ${expandedCategories.lighting ? '' : '-rotate-90'}`} />
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-white rounded-md border border-[#E5E7EB] shadow-sm text-[#F97316]">
                    <Lightbulb className="w-4.5 h-4.5" />
                  </span>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wide">Lighting</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-[#6B7280] text-[10px] font-mono font-medium">12 items</span>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex flex-col w-48 gap-1.5">
                  <div className="flex justify-between text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">
                    <span>100% Secured</span>
                    <span>12/12</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] w-full rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]/50">
                  <div className="text-xs font-semibold text-[#6B46C1] hover:text-[#553C9A] px-2 py-1 transition-colors opacity-0 group-hover:opacity-100">+ Add Item</div>
                </div>
              </div>
            </button>
            {expandedCategories.lighting && (
              <div className="p-4 text-center text-sm text-[#6B7280]">Lighting checklist content...</div>
            )}
          </div>

          {/* CATEGORY: AUDIO (COLLAPSED) */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] overflow-hidden">
            <button 
              onClick={() => toggleCategory('audio')}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-transparent hover:border-[#E5E7EB] group"
            >
              <div className="flex items-center gap-4">
                <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform duration-200 ${expandedCategories.audio ? '' : '-rotate-90'}`} />
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-white rounded-md border border-[#E5E7EB] shadow-sm text-[#14B8A6]">
                    <Mic2 className="w-4.5 h-4.5" />
                  </span>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wide">Audio</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-[#6B7280] text-[10px] font-mono font-medium">5 items</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col w-48 gap-1.5">
                  <div className="flex justify-between text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">
                    <span>40% Secured</span>
                    <span>2/5</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] w-[40%] rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]/50">
                  <div className="text-xs font-semibold text-[#6B46C1] hover:text-[#553C9A] px-2 py-1 transition-colors opacity-0 group-hover:opacity-100">+ Add Item</div>
                </div>
              </div>
            </button>
            {expandedCategories.audio && (
              <div className="p-4 text-center text-sm text-[#6B7280]">Audio checklist content...</div>
            )}
          </div>
        </div>
      </main>

      {/* EQUIPMENT DETAIL MODAL */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/20 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex flex-col overflow-hidden transform scale-100 transition-transform duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-gray-50/30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Camera</span>
                  <span className="text-[#6B7280]">•</span>
                  <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Owned</span>
                </div>
                <h2 className="text-lg font-bold text-[#1F2937]">Canon R5 Body</h2>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-[#6B7280] hover:text-[#6B46C1] transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toggleModal('detail')}
                  className="text-[#6B7280] hover:text-[#1F2937] transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Top Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Item Name</label>
                    <input 
                      type="text" 
                      defaultValue="Canon R5 Body" 
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm font-semibold text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Category</label>
                    <div className="relative">
                      <select className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1F2937] appearance-none focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1]">
                        <option>Camera</option>
                        <option>Lenses</option>
                        <option>Lighting</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 pointer-events-none text-[#6B7280]" />
                    </div>
                  </div>
                </div>

                {/* Source & Status */}
                <div className="bg-gray-50 rounded-xl border border-[#E5E7EB] p-4 grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Source</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="source" defaultChecked className="text-[#6B46C1] focus:ring-[#6B46C1]" />
                        <span className="text-xs font-medium text-[#1F2937]">Own (Inventory)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="source" className="text-[#6B46C1] focus:ring-[#6B46C1]" />
                        <span className="text-xs font-medium text-[#1F2937]">Rent</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="source" className="text-[#6B46C1] focus:ring-[#6B46C1]" />
                        <span className="text-xs font-medium text-[#1F2937]">Borrow</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Current Status</label>
                    <div className="relative">
                      <select className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1F2937] appearance-none focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1]">
                        <option>Reserved</option>
                        <option>Confirmed</option>
                        <option>Picked Up</option>
                        <option>Returned</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 pointer-events-none text-[#6B7280]" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <span className="text-xs text-[#6B7280]">Item is available in Library</span>
                    </div>
                  </div>
                </div>

                {/* Specs & Notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Specifications</label>
                  <textarea 
                    rows={2} 
                    defaultValue="45MP Full-Frame CMOS Sensor, DIGIC X Image Processor, 8K30 Raw and 4K120 10-Bit Internal Video"
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm font-mono text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1]"
                  ></textarea>
                </div>

                {/* Usage */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Days Needed</label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map(day => (
                      <button 
                        key={day}
                        className="px-3 py-1 bg-[#6B46C1] text-white text-xs font-semibold rounded border border-[#6B46C1]"
                      >
                        Day {day}
                      </button>
                    ))}
                    <button className="px-3 py-1 bg-white text-[#6B7280] hover:text-[#6B46C1] hover:border-[#6B46C1] text-xs font-medium rounded border border-[#E5E7EB] transition-colors">
                      + Add Day
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-[#E5E7EB] flex justify-between items-center">
              <button className="text-xs text-[#EF4444] font-medium hover:text-red-700 px-3 py-2 rounded hover:bg-red-50 transition-colors">Delete Item</button>
              <div className="flex gap-3">
                <button 
                  onClick={() => toggleModal('detail')}
                  className="px-4 py-2 text-xs font-medium text-[#1F2937] bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => toggleModal('detail')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6B46C1] rounded-lg shadow-sm hover:bg-[#553C9A] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD EQUIPMENT MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/20 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex flex-col overflow-hidden transform scale-100 transition-transform duration-200">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-[#1F2937]">Add New Equipment</h2>
              <button 
                onClick={() => toggleModal('add')}
                className="text-[#6B7280] hover:text-[#1F2937]"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Category</label>
                <div className="relative">
                  <select className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1F2937] appearance-none focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1]">
                    <option>Select category...</option>
                    <option>Camera</option>
                    <option>Lenses</option>
                    <option>Lighting</option>
                    <option>Audio</option>
                    <option>Grip</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 pointer-events-none text-[#6B7280]" />
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Arri Skypanel S60-C" 
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#6B46C1] focus:border-[#6B46C1]"
                />
              </div>

              {/* Source */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Source</label>
                <div className="grid grid-cols-4 gap-2">
                  <label className="cursor-pointer">
                    <input type="radio" name="add_source" className="peer sr-only" />
                    <div className="text-center py-2 px-1 text-xs font-medium bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg peer-checked:bg-green-50 peer-checked:text-[#10B981] peer-checked:border-[#10B981] transition-all hover:bg-gray-50">Own</div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="add_source" className="peer sr-only" />
                    <div className="text-center py-2 px-1 text-xs font-medium bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg peer-checked:bg-blue-50 peer-checked:text-[#3B82F6] peer-checked:border-[#3B82F6] transition-all hover:bg-gray-50">Rent</div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="add_source" className="peer sr-only" />
                    <div className="text-center py-2 px-1 text-xs font-medium bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg peer-checked:bg-orange-50 peer-checked:text-[#F97316] peer-checked:border-[#F97316] transition-all hover:bg-gray-50">Borrow</div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="add_source" defaultChecked className="peer sr-only" />
                    <div className="text-center py-2 px-1 text-xs font-medium bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg peer-checked:bg-red-50 peer-checked:text-[#EF4444] peer-checked:border-[#EF4444] transition-all hover:bg-gray-50">Need</div>
                  </label>
                </div>
              </div>

              {/* Quick Buttons */}
              <div className="pt-2">
                <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#E5E7EB] rounded-lg text-[#6B7280] hover:text-[#6B46C1] hover:border-[#6B46C1] hover:bg-purple-50 transition-all text-xs font-medium">
                  <Library className="w-3.5 h-3.5" />
                  Browse Library
                </button>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-[#E5E7EB] flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#E5E7EB] text-[#6B46C1] focus:ring-[#6B46C1] w-4 h-4" />
                <span className="text-xs text-[#1F2937] select-none">Add another</span>
              </label>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-xs font-medium text-[#1F2937] bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors">Add Detailed</button>
                <button 
                  onClick={() => toggleModal('add')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6B46C1] rounded-lg shadow-sm hover:bg-[#553C9A] transition-colors"
                >
                  Quick Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

