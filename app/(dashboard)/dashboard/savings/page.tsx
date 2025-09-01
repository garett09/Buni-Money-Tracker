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
import { SavingsCalculator, DepositHistory } from '@/app/lib/savingsCalculator';

const SavingsPage = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([]);
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
    loadDepositHistory();
  }, []);

  const loadDepositHistory = () => {
    const history = SavingsCalculator.getDepositHistory();
    setDepositHistory(history);
  };

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
        currentAmount: '0',
        id: editingGoal ? editingGoal.id : Date.now().toString()
      };

      if (editingGoal) {
        await ApiClient.updateSavingsGoal(editingGoal.id, goalData);
        setGoals(goals.map(goal => 
          goal.id === editingGoal.id ? goalData : goal
        ));
        toast.success('Savings goal updated successfully!');
      } else {
        await ApiClient.addSavingsGoal(goalData);
        setGoals([...goals, goalData]);
        toast.success('Savings goal added successfully!');
      }

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
      const goalData = {
        ...formData,
        currentAmount: '0',
        id: editingGoal ? editingGoal.id : Date.now().toString()
      };

      let updatedGoals;
      if (editingGoal) {
        updatedGoals = goals.map(goal => 
          goal.id === editingGoal.id ? goalData : goal
        );
        toast.success('Savings goal updated successfully!');
      } else {
        updatedGoals = [...goals, goalData];
        toast.success('Savings goal added successfully!');
      }

      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));

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
      description: goal.description,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
      category: goal.category || 'General'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this savings goal?')) return;

    try {
      await ApiClient.deleteSavingsGoal(parseInt(goalId));
      setGoals(goals.filter(goal => goal.id !== goalId));
      toast.success('Savings goal deleted successfully!');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      toast.success('Savings goal deleted successfully!');
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount) return;
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    try {
      const updatedGoal = {
        ...selectedGoal,
        currentAmount: (parseFloat(selectedGoal.currentAmount) + amount).toString()
      };
      
      await ApiClient.updateSavingsGoal(selectedGoal.id, updatedGoal);
      
      // Update local state
      setGoals(goals.map(goal => 
        goal.id === selectedGoal.id ? updatedGoal : goal
      ));
      
      // Track deposit in history
      SavingsCalculator.addDepositToHistory(amount, selectedGoal.id);
      loadDepositHistory();
      
      toast.success(`₱${amount.toLocaleString()} added to ${selectedGoal.name}!`);
      setShowDepositForm(false);
      setSelectedGoal(null);
      setDepositAmount('');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      const updatedGoal = {
        ...selectedGoal,
        currentAmount: (parseFloat(selectedGoal.currentAmount) + amount).toString()
      };
      
      const updatedGoals = goals.map(goal => 
        goal.id === selectedGoal.id ? updatedGoal : goal
      );
      
      setGoals(updatedGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
      
      // Track deposit in history
      SavingsCalculator.addDepositToHistory(amount, selectedGoal.id);
      loadDepositHistory();
      
      toast.success(`₱${amount.toLocaleString()} added to ${selectedGoal.name}!`);
      setShowDepositForm(false);
      setSelectedGoal(null);
      setDepositAmount('');
    } finally {
      setLoading(false);
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl">
                <FiTarget size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>Savings Goals</h1>
                <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>Plan and track your financial goals</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="liquid-button py-4 px-8 font-bold text-lg flex items-center gap-3 rounded-2xl hover:scale-105 transition-all duration-300"
              style={{ color: 'var(--text-primary)' }}
            >
              <FiPlus size={24} />
              Add Goal
            </button>
          </div>
        </div>

        {/* Create Goal Card */}
        <div className="group relative overflow-hidden mb-8">
          <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FiTarget size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Create New Goal</h3>
                  <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Start saving for your dreams</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Goal Form */}
        {showAddForm && (
          <div className="liquid-card p-8 apple-slide-up">
            <h2 className="text-display text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              {editingGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-body text-sm font-medium mb-3 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  Goal Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                  placeholder="e.g., Emergency Fund, Vacation, House Down Payment"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-body text-sm font-medium mb-3 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                >
                  <option value="General">General</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Vacation">Vacation</option>
                  <option value="House">House</option>
                  <option value="Car">Car</option>
                  <option value="Education">Education</option>
                  <option value="Retirement">Retirement</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-body text-sm font-medium mb-3 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="liquid-input w-full px-6 py-4 focus:outline-none text-lg resize-none"
                  placeholder="Describe your goal and why it's important to you..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                                  <label htmlFor="targetAmount" className="block text-body text-sm font-medium mb-3 tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  Target Amount (₱)
                </label>
                  <input
                    type="number"
                    id="targetAmount"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                    className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
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
                    className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="liquid-button text-white py-4 px-6 font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed apple-shimmer"
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
                  className="liquid-button text-white/60 py-4 px-6 font-medium text-body text-lg hover:text-white transition-colors"
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
            <div className="liquid-card p-12 text-center apple-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
                <FiTarget size={32} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">No Savings Goals Yet</h3>
              <p className="text-white/60 mb-6">Start by creating your first savings goal to track your progress</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="liquid-button text-white py-3 px-6 font-medium text-body apple-shimmer"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = calculateProgress(goal);
              const daysRemaining = getDaysRemaining(goal.targetDate);
              
              return (
                <div key={goal.id} className="liquid-card p-8 apple-fade-in">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-xl">{goal.name}</h3>
                        <span className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full">
                          {goal.category}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-white/60 mb-4">{goal.description}</p>
                      )}
                      
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

                      {/* Quick Deposit Buttons */}
                      <div className="mb-4">
                        <p className="text-white/60 text-sm mb-3">Quick Add:</p>
                        <div className="flex flex-wrap gap-2">
                          {[100, 500, 1000].map((amount) => (
                            <button
                              key={amount}
                              onClick={async () => {
                                try {
                                  const updatedGoal = {
                                    ...goal,
                                    currentAmount: (parseFloat(goal.currentAmount) + amount).toString()
                                  };
                                  
                                  await ApiClient.updateSavingsGoal(goal.id, updatedGoal);
                                  setGoals(goals.map(g => 
                                    g.id === goal.id ? updatedGoal : g
                                  ));
                                  
                                  // Track deposit in history
                                  SavingsCalculator.addDepositToHistory(amount, goal.id);
                                  loadDepositHistory();
                                  
                                  toast.success(`₱${amount.toLocaleString()} added to ${goal.name}!`);
                                } catch (error) {
                                  console.log('API not available, using localStorage fallback');
                                  const updatedGoal = {
                                    ...goal,
                                    currentAmount: (parseFloat(goal.currentAmount) + amount).toString()
                                  };
                                  
                                  const updatedGoals = goals.map(g => 
                                    g.id === goal.id ? updatedGoal : g
                                  );
                                  
                                  setGoals(updatedGoals);
                                  localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
                                  
                                  // Track deposit in history
                                  SavingsCalculator.addDepositToHistory(amount, goal.id);
                                  loadDepositHistory();
                                  
                                  toast.success(`₱${amount.toLocaleString()} added to ${goal.name}!`);
                                }
                              }}
                              className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors"
                            >
                              +₱{amount.toLocaleString()}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              setSelectedGoal(goal);
                              setDepositAmount('');
                              setShowDepositForm(true);
                            }}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            More Options
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="liquid-progress w-full h-3 mb-4">
                        <div 
                          className="liquid-progress-fill h-3 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      {/* Timeline Calculation */}
                      {(() => {
                        const timeline = SavingsCalculator.calculateTimeline(
                          parseFloat(goal.targetAmount),
                          parseFloat(goal.currentAmount),
                          depositHistory,
                          goal.id
                        );
                        
                        return (
                          <div className="bg-white/5 p-4 rounded-xl mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FiCalendar className="text-blue-400" size={16} />
                              <h4 className="text-white font-medium text-sm">Timeline to Goal</h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-white/60">Estimated Time</p>
                                <p className="text-white font-semibold">
                                  {SavingsCalculator.formatTimeline(timeline)}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60">Avg. Daily</p>
                                <p className="text-white font-semibold">
                                  ₱{timeline.averageDailyDeposit.toFixed(0)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className={`text-xs ${
                                timeline.isAchievable ? 'text-green-400' : 'text-orange-400'
                              }`}>
                                {timeline.message}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {goal.targetDate && (
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-white/60" size={16} />
                            <span className="text-white/60">Target Date:</span>
                            <span className="text-white">
                              {new Date(goal.targetDate).toLocaleDateString()}
                              {daysRemaining && (
                                <span className={`ml-2 ${
                                  daysRemaining < 0 ? 'text-red-400' : 
                                  daysRemaining < 30 ? 'text-orange-400' : 'text-green-400'
                                }`}>
                                  ({daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`})
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-white/60" size={16} />
                          <span className="text-white/60">Remaining:</span>
                          <span className="text-white">
                            ₱{(parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedGoal(goal);
                          setShowDepositForm(true);
                        }}
                        className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                        title="Add money to this goal"
                      >
                        <FiCheckCircle size={16} className="text-green-400" />
                      </button>
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        title="Edit this goal"
                      >
                        <FiEdit3 size={16} className="text-white/80" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                        title="Delete this goal"
                      >
                        <FiTrash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Deposit Form Modal */}
        {showDepositForm && selectedGoal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="liquid-card p-8 apple-slide-up">
              <h2 className="text-display text-2xl font-semibold text-white mb-6">
                Add Money to "{selectedGoal.name}"
              </h2>
              
              <form onSubmit={handleDeposit} className="space-y-6">
                {/* Smart Amount Suggestions */}
                <div>
                  <label className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Quick Amounts
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {(() => {
                      const target = parseFloat(selectedGoal.targetAmount);
                      const current = parseFloat(selectedGoal.currentAmount);
                      const remaining = target - current;
                      
                      // Smart suggestions based on remaining amount
                      const suggestions = [];
                      if (remaining > 0) {
                        if (remaining <= 1000) {
                          suggestions.push(remaining);
                        } else {
                          suggestions.push(
                            Math.ceil(remaining / 10), // 10% of remaining
                            Math.ceil(remaining / 4),  // 25% of remaining
                            Math.ceil(remaining / 2),  // 50% of remaining
                            remaining // Full amount
                          );
                        }
                      }
                      
                      // Add common amounts
                      const commonAmounts = [100, 500, 1000, 2000, 5000];
                      suggestions.push(...commonAmounts);
                      
                      // Remove duplicates and sort
                      const uniqueSuggestions = [...new Set(suggestions)].sort((a, b) => a - b).slice(0, 8);
                      
                      return uniqueSuggestions.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setDepositAmount(amount.toString())}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            depositAmount === amount.toString()
                              ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          ₱{amount.toLocaleString()}
                          {amount === remaining && remaining > 0 && (
                            <div className="text-xs text-green-400 mt-1">Complete</div>
                          )}
                        </button>
                      ));
                    })()}
                  </div>
                </div>

                <div>
                  <label htmlFor="depositAmount" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Custom Amount (₱)
                  </label>
                  <input
                    type="number"
                    id="depositAmount"
                    name="depositAmount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                    className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                    placeholder="Enter custom amount..."
                  />
                </div>

                <div className="bg-white/5 p-4 rounded-xl">
                  <h3 className="text-white font-medium mb-2">Goal Progress</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Current</p>
                      <p className="text-white font-semibold">₱{selectedGoal.currentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60">After Deposit</p>
                      <p className="text-white font-semibold">
                        ₱{(parseFloat(selectedGoal.currentAmount) + (parseFloat(depositAmount) || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-white/60 text-sm">New Progress</p>
                    <div className="liquid-progress w-full h-2 mt-1">
                      <div 
                        className="liquid-progress-fill h-2"
                        style={{ 
                          width: `${Math.min(((parseFloat(selectedGoal.currentAmount) + (parseFloat(depositAmount) || 0)) / parseFloat(selectedGoal.targetAmount)) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="liquid-button text-white py-4 px-6 font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed apple-shimmer"
                  >
                    {loading ? "Adding..." : "Add Money"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDepositForm(false);
                      setSelectedGoal(null);
                      setDepositAmount('');
                    }}
                    className="liquid-button text-white/60 py-4 px-6 font-medium text-body text-lg hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavingsPage;