import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { 
  ArrowLeft, Coins, TrendingUp, Briefcase, Receipt, Wallet, BarChart3, 
  CheckCircle2, Circle, Clapperboard, Users, Camera, Scissors, Plus, 
  MoreHorizontal, ChevronDown, ChevronUp, Pencil, Trash2, UploadCloud, X,
  LayoutList, ChartLine, ArrowDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createPageUrl } from '../utils';
import { format } from 'date-fns';

const CATEGORIES = [
  { id: 'pre-production', label: 'PRE-PRODUCTION', icon: Clapperboard },
  { id: 'cast', label: 'CAST', icon: Users },
  { id: 'equipment', label: 'EQUIPMENT', icon: Camera },
  { id: 'post-production', label: 'POST-PRODUCTION', icon: Scissors },
];

const STATUSES = ['Est.', 'Inv.', 'Paid'];

export default function Budget() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(['pre-production']);
  const [viewMode, setViewMode] = useState('categories');
  
  const urlParams = new URLSearchParams(location.search);
  const projectId = urlParams.get('project_id');

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  const { data: budgetEntries = [] } = useQuery({
    queryKey: ['budgetEntries', projectId],
    queryFn: () => base44.entities.BudgetEntry.list('-date'),
  });

  const [formData, setFormData] = useState({
    project_id: projectId || '',
    category: 'pre-production',
    description: '',
    estimated_cost: '',
    actual_cost: '',
    status: 'Est.',
    vendor: '',
    is_budget: false,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BudgetEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetEntries'] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      project_id: projectId || '',
      category: 'pre-production',
      description: '',
      estimated_cost: '',
      actual_cost: '',
      status: 'Est.',
      vendor: '',
      is_budget: false,
    });
  };

  // Calculate totals
  const totalBudget = budgetEntries.filter(e => e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalSpent = budgetEntries.filter(e => !e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const projectedTotal = totalSpent + (totalBudget * 0.036); // 3.6% projection

  // Group by category
  const budgetByCategory = CATEGORIES.map(cat => {
    const catEntries = budgetEntries.filter(e => e.category === cat.id);
    const estimated = catEntries.filter(e => e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
    const actual = catEntries.filter(e => !e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
    const remaining = estimated - actual;
    const percentage = estimated > 0 ? Math.round((actual / estimated) * 100) : 0;
    
    return {
      ...cat,
      estimated,
      actual,
      remaining,
      percentage,
      entries: catEntries,
    };
  });

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      project_id: formData.project_id,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.actual_cost) || parseFloat(formData.estimated_cost) || 0,
      is_budget: formData.status === 'Est.',
      vendor: formData.vendor,
    };
    createMutation.mutate(entry);
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 font-sans flex flex-col overflow-hidden">
      {/* TOP BAR */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40 shrink-0 shadow-sm relative">
        {/* Left: Branding & Context */}
        <div className="flex items-center gap-4 w-1/3">
          <button 
            onClick={() => navigate(createPageUrl(`ProductionPlanning?project_id=${projectId}`))}
            className="text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-gray-50 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Production Planning</span>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none mt-0.5">Budget</h1>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-mono font-medium">v3.2</span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
            <Coins className="w-3.5 h-3.5 text-green-600" />
            <span className="font-mono text-sm font-bold text-green-700 tracking-tight">
              ${totalBudget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Center: Budget Health */}
        <div className="flex items-center justify-center gap-4 w-1/3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200 stroke-current" 
                  strokeWidth="8" 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent"
                />
                <circle 
                  className="text-green-600 stroke-current" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * spentPercentage / 100)}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-2.5 h-2.5 text-green-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold font-mono text-gray-900">
                  ${totalSpent.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">of ${totalBudget.toLocaleString()}</span>
              </div>
              <div className="text-[10px] font-semibold text-green-600">
                {spentPercentage}% spent
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          <div className="flex bg-gray-100/50 rounded-lg p-1 border border-gray-200">
            <button 
              onClick={() => setViewMode('categories')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors ${
                viewMode === 'categories'
                  ? 'bg-white shadow-sm text-gray-900 border border-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Categories
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white shadow-sm text-gray-900 border border-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <ChartLine className="w-3.5 h-3.5" />
              Timeline
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors border border-green-700/10"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <MoreHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* MAIN SCROLLABLE AREA */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
          
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total Budget */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide">Total Budget</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 font-mono tracking-tight">
                  ${totalBudget.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 font-medium">
                  Locked {format(new Date(), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            {/* Spent */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide">Spent</span>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                  {spentPercentage}%
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 font-mono tracking-tight">
                  ${totalSpent.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 font-medium">On track</div>
              </div>
            </div>

            {/* Remaining */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide">Remaining</span>
                </div>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                  {100 - spentPercentage}%
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 font-mono tracking-tight">
                  ${totalRemaining.toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 font-medium">Available funds</div>
              </div>
            </div>

            {/* Projected */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between h-32 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide">Projected Total</span>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <ArrowDown className="w-2.5 h-2.5" /> 3.6%
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 font-mono tracking-tight">
                  ${Math.round(projectedTotal).toLocaleString()}
                </div>
                <div className="text-[10px] text-green-600 mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Under budget by ${(totalBudget - projectedTotal).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="space-y-4">
            {budgetByCategory.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);
              const IconComponent = category.icon;
              
              return (
                <div key={category.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group">
                  {/* Header */}
                  <div 
                    onClick={() => toggleCategory(category.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors select-none ${
                      isExpanded ? 'bg-gray-50/50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-500 transition-transform duration-200">
                          {isExpanded ? (
                            <ChevronUp className="w-4.5 h-4.5" />
                          ) : (
                            <ChevronDown className="w-4.5 h-4.5" />
                          )}
                        </button>
                        <div className="p-1.5 bg-white rounded border border-gray-200 shadow-sm text-gray-900">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">{category.label}</h3>
                        {category.percentage >= 90 && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded border border-orange-200">
                            {category.percentage}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-medium text-gray-500 uppercase">Est. Cost</span>
                          <span className="text-xs font-mono font-bold text-gray-900">
                            ${category.estimated.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-medium text-gray-500 uppercase">Actual</span>
                          <span className={`text-xs font-mono font-bold ${
                            category.actual > category.estimated ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            ${category.actual.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-medium text-gray-500 uppercase">Remaining</span>
                          <span className={`text-xs font-mono font-bold ${
                            category.remaining < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            ${category.remaining.toLocaleString()}
                          </span>
                        </div>
                        <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all ml-2">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${
                          category.percentage >= 90 ? 'bg-orange-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Line Items Table */}
                  {isExpanded && (
                    <div className="block">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-white">
                            <th className="px-4 py-3 w-[25%]">Item</th>
                            <th className="px-4 py-3 w-[30%]">Description</th>
                            <th className="px-4 py-3 w-[10%] text-right">Est. Cost</th>
                            <th className="px-4 py-3 w-[10%] text-right">Actual</th>
                            <th className="px-4 py-3 w-[5%] text-center">Paid</th>
                            <th className="px-4 py-3 w-[10%] text-center">Status</th>
                            <th className="px-4 py-3 w-[10%] text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-gray-200">
                          {category.entries.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                                No entries yet. Add your first expense.
                              </td>
                            </tr>
                          ) : (
                            category.entries.map((entry) => {
                              const isOverBudget = !entry.is_budget && entry.amount > (category.estimated / category.entries.length);
                              const isPaid = entry.status === 'Paid';
                              
                              return (
                                <tr 
                                  key={entry.id} 
                                  className={`budget-row transition-colors ${
                                    isOverBudget ? 'bg-red-50/30' : isPaid ? 'bg-green-50/30' : ''
                                  }`}
                                >
                                  <td className="px-4 py-2">
                                    <div className="font-semibold text-gray-900">{entry.description || 'Untitled'}</div>
                                  </td>
                                  <td className="px-4 py-2">
                                    <div className="text-gray-500">{entry.vendor || 'No vendor'}</div>
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    <div className="font-mono text-gray-900">
                                      ${entry.is_budget ? entry.amount.toLocaleString() : '0'}
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    <div className={`font-mono font-medium ${
                                      isOverBudget ? 'text-red-600 font-bold' : 'text-green-600'
                                    }`}>
                                      ${!entry.is_budget ? entry.amount.toLocaleString() : '0'}
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    <button className="text-green-600 hover:scale-110 transition-transform">
                                      {isPaid ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-gray-300 hover:text-green-600 transition-colors" />
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                                      isPaid 
                                        ? 'bg-green-100 text-green-800 border-green-200'
                                        : entry.status === 'Inv.'
                                        ? 'bg-orange-100 text-orange-800 border-orange-200'
                                        : 'bg-gray-100 text-gray-800 border-gray-200'
                                    }`}>
                                      {entry.status || 'Est.'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    <div className="row-actions opacity-0 transition-opacity flex items-center justify-end gap-1 group-hover:opacity-100">
                                      <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-purple-600">
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                          
                          {/* Add Line Item Placeholder */}
                          <tr className="group hover:bg-gray-50/50 transition-colors cursor-text">
                            <td colSpan={7} className="px-4 py-2 text-gray-500 italic text-xs flex items-center gap-2">
                              <Plus className="w-3.5 h-3.5 text-green-600" />
                              Add Line Item
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ADD EXPENSE MODAL */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900">Add Expense</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Item Name & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Item Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Camera Rental"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Costs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estimated Cost</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm font-mono">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.estimated_cost}
                      onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Actual Cost <span className="text-gray-500 font-normal lowercase">(optional)</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm font-mono">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.actual_cost}
                      onChange={(e) => setFormData({ ...formData, actual_cost: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Vendor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</Label>
                  <div className="flex gap-2">
                    {STATUSES.map(status => (
                      <label key={status} className="flex-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status" 
                          className="peer sr-only" 
                          checked={formData.status === status}
                          onChange={() => setFormData({ ...formData, status })}
                        />
                        <div className={`text-center py-2 text-xs font-medium border rounded-lg transition-all ${
                          formData.status === status
                            ? status === 'Paid' 
                              ? 'bg-green-50 text-green-600 border-green-200'
                              : status === 'Inv.'
                              ? 'bg-orange-50 text-orange-600 border-orange-200'
                              : 'bg-gray-100 text-gray-900 border-gray-200'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}>
                          {status}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vendor</Label>
                  <Input
                    type="text"
                    placeholder="Search vendors..."
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                  />
                </div>
              </div>

              {/* Attachments */}
              <div className="pt-2">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-600/50 hover:bg-green-50/30 transition-colors">
                  <UploadCloud className="w-5 h-5 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-900 font-medium">Click to upload receipt</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">PDF, PNG, JPG up to 10MB</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="add-another" />
                <Label htmlFor="add-another" className="text-xs text-gray-900 select-none">
                  Add another item after saving
                </Label>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
