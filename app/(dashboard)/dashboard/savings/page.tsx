'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { toast } from 'react-hot-toast';
import { 
  FiTarget, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiTrendingUp, 
  FiCalendar,
  FiDollarSign,
  FiCheckCircle
} from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';

const SavingsPage = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: 'General'
  });

  // Load goals from API
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const response = await ApiClient.getSavingsGoals();
        setGoals(response.goals || []);
      } catch (error) {
        console.log('API not available, using localStorage fallback');
        // Fallback to localStorage for development
        const savedGoals = localStorage.getItem('savingsGoals');
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }
      }
    };

    loadGoals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0
      };

      if (editingGoal) {
        // Update existing goal
        await ApiClient.updateSavingsGoal(editingGoal.id, goalData);
        setGoals(goals.map(goal => 
          goal.id === editingGoal.id ? { ...goal, ...goalData } : goal
        ));
        toast.success('Savings goal updated successfully!');
      } else {
        // Add new goal
        const response = await ApiClient.addSavingsGoal(goalData);
        setGoals([response.goal, ...goals]);
        toast.success('Savings goal added successfully!');
      }

      // Also update localStorage as backup
      localStorage.setItem('savingsGoals', JSON.stringify(goals));
      
      setFormData({
        name: '',
        description: '',
        targetAmount: '',
        targetDate: '',
        category: 'General'
      });
      setShowAddForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      // Fallback to localStorage for development
      const newGoal = {
        id: Date.now(),
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: 0,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      const updatedGoals = editingGoal 
        ? goals.map(goal => goal.id === editingGoal.id ? { ...goal, ...newGoal } : goal)
        : [newGoal, ...goals];
      
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      
      toast.success(editingGoal ? 'Savings goal updated successfully!' : 'Savings goal added successfully!');
      
      setFormData({
        name: '',
        description: '',
        targetAmount: '',
        targetDate: '',
        category: 'General'
      });
      setShowAddForm(false);
      setEditingGoal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      targetAmount: goal.targetAmount.toString(),
      targetDate: goal.targetDate || '',
      category: goal.category || 'General'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (goalId: number) => {
    if (!confirm('Are you sure you want to delete this savings goal?')) return;

    try {
      await ApiClient.deleteSavingsGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
      localStorage.setItem('savingsGoals', JSON.stringify(goals.filter(goal => goal.id !== goalId)));
      toast.success('Savings goal deleted successfully!');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      toast.success('Savings goal deleted successfully!');
    }
  };

  const calculateProgress = (goal: any) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthlyContribution = (goal: any) => {
    const daysRemaining = getDaysRemaining(goal.targetDate);
    if (!daysRemaining || daysRemaining <= 0) return 0;
    
    const monthsRemaining = daysRemaining / 30;
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    return Math.ceil(remainingAmount / monthsRemaining);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="apple-fade-in">
          <h1 className="text-display text-4xl font-semibold text-white mb-2 tracking-tight">
            Savings Goals
          </h1>
          <p className="text-body text-white/60 text-lg">
            Set and track your financial goals to achieve your dreams.
          </p>
        </div>

        {/* Add Goal Button */}
        <div className="flex justify-between items-center">
          <div className="glass-card p-6 rounded-2xl apple-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <FiTarget size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-2xl font-semibold text-white">
                  {goals.length} Active Goals
                </h3>
                <p className="text-white/60 text-sm">Keep working towards your dreams!</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="glass-button text-white py-4 px-6 rounded-2xl font-medium text-body text-lg apple-shimmer flex items-center gap-2"
          >
            <FiPlus size={20} />
            Add Goal
          </button>
        </div>

        {/* Add/Edit Goal Form */}
        {showAddForm && (
          <div className="glass-card p-8 rounded-2xl apple-slide-up">
            <h2 className="text-display text-2xl font-semibold text-white mb-6">
              {editingGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg"
                    placeholder="e.g., Emergency Fund, Vacation, House Down Payment"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg"
                  >
                    <option value="General">General</option>
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Vacation">Vacation</option>
                    <option value="House">House</option>
                    <option value="Car">Car</option>
                    <option value="Education">Education</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg resize-none"
                  placeholder="Describe your goal and why it's important to you..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="targetAmount" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Target Amount (₱)
                  </label>
                  <input
                    type="number"
                    id="targetAmount"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                    className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="targetDate" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="targetDate"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button text-white py-4 px-6 rounded-2xl font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed apple-shimmer"
                >
                  {loading ? "Saving..." : (editingGoal ? "Update Goal" : "Add Goal")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingGoal(null);
                    setFormData({
                      name: '',
                      description: '',
                      targetAmount: '',
                      targetDate: '',
                      category: 'General'
                    });
                  }}
                  className="glass-button text-white/60 py-4 px-6 rounded-2xl font-medium text-body text-lg hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-6">
          {goals.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl apple-fade-in text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
                <FiTarget size={32} className="text-white" />
              </div>
              <h3 className="text-display text-xl font-semibold text-white mb-2">No Savings Goals Yet</h3>
              <p className="text-white/60 mb-6">Start by creating your first savings goal to track your progress.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="glass-button text-white py-3 px-6 rounded-xl font-medium"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = calculateProgress(goal);
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const monthlyContribution = getMonthlyContribution(goal);
              
              return (
                <div key={goal.id} className="glass-card p-6 rounded-2xl apple-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-display text-xl font-semibold text-white">{goal.name}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                          {goal.category}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-white/70 text-sm mb-3">{goal.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <FiEdit3 size={16} className="text-white/80" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      >
                        <FiTrash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Target Amount</p>
                      <p className="text-white font-semibold text-lg">₱{goal.targetAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Current Amount</p>
                      <p className="text-white font-semibold text-lg">₱{goal.currentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Progress</p>
                      <p className="text-white font-semibold text-lg">{progress.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {goal.targetDate && (
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} className="text-white/60" />
                        <span className="text-white/60">Target Date:</span>
                        <span className="text-white">{new Date(goal.targetDate).toLocaleDateString()}</span>
                        {daysRemaining !== null && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            daysRemaining > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {monthlyContribution > 0 && (
                      <div className="flex items-center gap-2">
                        <FiTrendingUp size={16} className="text-white/60" />
                        <span className="text-white/60">Monthly needed:</span>
                        <span className="text-white font-medium">₱{monthlyContribution.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavingsPage;
