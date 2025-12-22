import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Euro, TrendingUp, TrendingDown, PiggyBank, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import BudgetDonut from '../components/dashboard/BudgetDonut';

const CATEGORIES = ['Crew', 'Equipment', 'Location', 'Props', 'Post-Production', 'Other'];

const categoryColors = {
  'Crew': 'bg-blue-500',
  'Equipment': 'bg-purple-500',
  'Location': 'bg-orange-500',
  'Props': 'bg-pink-500',
  'Post-Production': 'bg-cyan-500',
  'Other': 'bg-gray-500',
};

export default function Budget() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    category: '',
    description: '',
    amount: '',
    is_budget: false,
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const { data: budgetEntries = [], isLoading } = useQuery({
    queryKey: ['budgetEntries'],
    queryFn: () => base44.entities.BudgetEntry.list('-date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => base44.entities.Business.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BudgetEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetEntries'] });
      closeForm();
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      project_id: '',
      category: '',
      description: '',
      amount: '',
      is_budget: false,
      date: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, amount: Number(formData.amount) });
  };

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

  // Calculations
  const totalBudget = budgetEntries.filter(e => e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalSpent = budgetEntries.filter(e => !e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const avgPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Budget by category
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const catEntries = budgetEntries.filter(e => e.category === cat && !e.is_budget);
    acc[cat] = catEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
    return acc;
  }, {});

  // Budget by project
  const byProject = projects.map(p => {
    const projectBudget = budgetEntries.filter(e => e.project_id === p.id && e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
    const projectSpent = budgetEntries.filter(e => e.project_id === p.id && !e.is_budget).reduce((sum, e) => sum + (e.amount || 0), 0);
    return {
      ...p,
      budget: projectBudget,
      spent: projectSpent,
      remaining: projectBudget - projectSpent,
      percentage: projectBudget > 0 ? Math.round((projectSpent / projectBudget) * 100) : 0
    };
  }).filter(p => p.budget > 0 || p.spent > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Budget Overzicht</h1>
          <p className="text-gray-500 mt-1">Alle projecten</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Entry
        </Button>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">€{totalBudget.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Totaal Budget</p>
        </div>

        <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <TrendingDown className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">€{totalSpent.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Totaal Uitgegeven</p>
        </div>

        <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">€{totalRemaining.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Resterend</p>
        </div>

        <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${avgPercentage < 50 ? 'text-emerald-400' : avgPercentage < 80 ? 'text-orange-400' : 'text-red-400'}`}>
            {avgPercentage}%
          </p>
          <p className="text-sm text-gray-500">Gemiddeld Gebruikt</p>
        </div>
      </div>

      {/* Budget Donut */}
      {isLoading ? (
        <Skeleton className="h-64 bg-[#22262b]" />
      ) : (
        <BudgetDonut total={totalBudget} spent={totalSpent} remaining={totalRemaining} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Budget by Category */}
        <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">Per Categorie</h3>
          <div className="space-y-4">
            {CATEGORIES.map(cat => {
              const amount = byCategory[cat];
              const maxAmount = Math.max(...Object.values(byCategory));
              const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
              
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${categoryColors[cat]}`} />
                      <span className="text-gray-400">{cat}</span>
                    </div>
                    <span className="text-white font-medium">€{amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${categoryColors[cat]} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget by Project */}
        <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">Per Project</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {byProject.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nog geen budget data</p>
            ) : (
              byProject.map(project => (
                <div key={project.id} className="p-4 bg-[#1a1d21] rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">{project.title}</p>
                      <p className="text-xs text-gray-500">
                        {businessMap[projectMap[project.id]?.business_id]?.name}
                      </p>
                    </div>
                    <span className={`text-sm font-bold ${
                      project.percentage < 50 ? 'text-emerald-400' : 
                      project.percentage < 80 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {project.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        project.percentage < 50 ? 'bg-emerald-500' : 
                        project.percentage < 80 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(project.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>€{project.spent.toLocaleString()} / €{project.budget.toLocaleString()}</span>
                    <span>Resterend: €{project.remaining.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Recente Transacties</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Project</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Categorie</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Beschrijving</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Bedrag</th>
              </tr>
            </thead>
            <tbody>
              {budgetEntries.slice(0, 10).map(entry => (
                <tr key={entry.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {entry.date ? format(new Date(entry.date), 'd MMM', { locale: nl }) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-white">
                    {projectMap[entry.project_id]?.title || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${categoryColors[entry.category]}`} />
                      <span className="text-sm text-gray-400">{entry.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{entry.description || '-'}</td>
                  <td className={`py-3 px-4 text-sm text-right font-medium ${entry.is_budget ? 'text-emerald-400' : 'text-white'}`}>
                    {entry.is_budget ? '+' : '-'}€{entry.amount?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Nieuwe Budget Entry</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center space-x-2 p-3 bg-[#1a1d21] rounded-lg">
              <Checkbox
                id="is_budget"
                checked={formData.is_budget}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_budget: checked }))}
              />
              <label htmlFor="is_budget" className="text-sm text-gray-300">
                Dit is toegewezen budget (geen uitgave)
              </label>
            </div>

            <div className="space-y-2">
              <Label>Project *</Label>
              <Select 
                value={formData.project_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, project_id: v }))}
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue placeholder="Selecteer project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categorie *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue placeholder="Selecteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bedrag *</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Datum</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Beschrijving</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Korte beschrijving"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Toevoegen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}