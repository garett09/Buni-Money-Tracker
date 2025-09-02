'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiX, 
  FiZap, 
  FiTrendingUp, 
  FiShield, 
  FiTarget,
  FiDollarSign,
  FiInfo,
  FiSave,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi';
import { IntelligentBudget, BudgetSettings as IBudgetSettings } from '@/app/lib/intelligentBudget';
import { toast } from 'react-hot-toast';
import { getDefaultMonthlyBudget, getUserMonthlyBudget, setUserMonthlyBudget } from '@/app/lib/currency';

interface BudgetSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  incomeTransactions: any[];
  expenseTransactions: any[];
}

const BudgetSettings: React.FC<BudgetSettingsProps> = ({
  isOpen,
  onClose,
  incomeTransactions,
  expenseTransactions
}) => {
  const [settings, setSettings] = useState<IBudgetSettings>({
    monthlyBudget: getUserMonthlyBudget(), // User's saved budget or default
    categoryBudgets: {},
    autoAdjust: true,
    learningEnabled: true,
    emergencyBuffer: 10,
    savingsTarget: 20
  });

  const [intelligentBudget, setIntelligentBudget] = useState<IntelligentBudget | null>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [optimizations, setOptimizations] = useState<any>(null);

  // Initialize intelligent budget system
  useEffect(() => {
    if (incomeTransactions.length > 0 || expenseTransactions.length > 0) {
      const allTransactions = [
        ...incomeTransactions.map(t => ({ ...t, type: 'income' as const })),
        ...expenseTransactions.map(t => ({ ...t, type: 'expense' as const }))
      ];

      const savedSettings = localStorage.getItem('budgetSettings');
      let initialSettings = settings;
      if (savedSettings) {
        try {
          initialSettings = JSON.parse(savedSettings);
        } catch (error) {
          // Invalid settings, using defaults
        }
      }

      const ib = new IntelligentBudget(allTransactions, initialSettings);
      setIntelligentBudget(ib);
      setSettings(ib.getSettings());

      // Generate forecast and insights
      const newForecast = ib.generateForecast();
      const newInsights = ib.getSpendingInsights();
      const newOptimizations = ib.suggestOptimizations();

      setForecast(newForecast);
      setInsights(newInsights);
      setOptimizations(newOptimizations);
    }
  }, [incomeTransactions, expenseTransactions]);

  const handleSettingChange = (key: keyof IBudgetSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (intelligentBudget) {
      intelligentBudget.updateSettings(newSettings);
      const newForecast = intelligentBudget.generateForecast();
      setForecast(newForecast);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('budgetSettings', JSON.stringify(settings));
    // Also save the monthly budget to the currency utility
    setUserMonthlyBudget(settings.monthlyBudget);
    toast.success('Budget settings saved successfully');
  };

  const resetToAIRecommendation = () => {
    if (forecast) {
      const newSettings = { ...settings, monthlyBudget: forecast.recommendedBudget };
      setSettings(newSettings);
      
      if (intelligentBudget) {
        intelligentBudget.updateSettings(newSettings);
      }
      
      toast.success('Budget reset to AI recommendation');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="liquid-card p-8 rounded-3xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiSettings size={24} style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Intelligent Budget Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <FiX size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Budget Configuration
            </h4>

            {/* Monthly Budget */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Monthly Budget
              </label>
              
              {/* Quick Budget Presets */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[15000, 25000, 35000, 50000, 75000, 100000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleSettingChange('monthlyBudget', preset)}
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 ${
                      settings.monthlyBudget === preset
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                    }`}
                  >
                    ₱{preset.toLocaleString()}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={settings.monthlyBudget}
                  onChange={(e) => handleSettingChange('monthlyBudget', parseInt(e.target.value) || 0)}
                  className="flex-1 p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="Enter your monthly budget"
                />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>₱</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Set your monthly spending limit. You can adjust this anytime.
              </p>
            </div>

            {/* Emergency Buffer */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Emergency Buffer
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={settings.emergencyBuffer}
                  onChange={(e) => handleSettingChange('emergencyBuffer', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {settings.emergencyBuffer}%
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Extra buffer added to your budget for unexpected expenses
              </p>
            </div>

            {/* Savings Target */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Savings Target
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.savingsTarget}
                  onChange={(e) => handleSettingChange('savingsTarget', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {settings.savingsTarget}%
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Target percentage of income to save each month
              </p>
            </div>

            {/* AI Learning Settings */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                AI Learning Settings
              </h5>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                                      <FiZap size={16} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Enable AI Learning
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.learningEnabled}
                  onChange={(e) => handleSettingChange('learningEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <FiRefreshCw size={16} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Auto-adjust Budget
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoAdjust}
                  onChange={(e) => handleSettingChange('autoAdjust', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={saveSettings}
                className="flex-1 py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiSave size={16} />
                Save Settings
              </button>
              <button
                onClick={resetToAIRecommendation}
                className="py-2 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              >
                <FiTarget size={16} />
                Use AI Recommendation
              </button>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              AI Insights & Recommendations
            </h4>

            {/* Forecast Summary */}
            {forecast && (
              <div className="liquid-card p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiTrendingUp size={16} className="text-blue-400" />
                  <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    AI Budget Forecast
                  </h5>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Recommended Budget:</span>
                    <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                      ₱{forecast.recommendedBudget.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Confidence:</span>
                    <span className={`font-medium ${getConfidenceColor(forecast.confidence)}`}>
                      {getConfidenceLabel(forecast.confidence)} ({forecast.confidence}%)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Next Month Prediction:</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      ₱{forecast.nextMonthPrediction.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Reasoning */}
            {forecast && forecast.reasoning.length > 0 && (
              <div className="liquid-card p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiInfo size={16} className="text-blue-400" />
                  <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    How AI Calculated This
                  </h5>
                </div>
                
                <div className="space-y-2">
                  {forecast.reasoning.map((reason: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {forecast && forecast.riskFactors.length > 0 && (
              <div className="liquid-card p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiAlertTriangle size={16} className="text-red-400" />
                  <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Risk Factors
                  </h5>
                </div>
                
                <div className="space-y-2">
                  {forecast.riskFactors.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {risk}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {forecast && forecast.opportunities.length > 0 && (
              <div className="liquid-card p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle size={16} className="text-green-400" />
                  <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Positive Trends
                  </h5>
                </div>
                
                <div className="space-y-2">
                  {forecast.opportunities.map((opportunity: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {opportunity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimization Suggestions */}
            {optimizations && optimizations.recommendations.length > 0 && (
              <div className="liquid-card p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <FiTarget size={16} className="text-purple-400" />
                  <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Optimization Suggestions
                  </h5>
                </div>
                
                <div className="space-y-2">
                  {optimizations.recommendations.slice(0, 3).map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
                
                {optimizations.potentialSavings > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-green-500/10">
                    <p className="text-sm font-medium text-green-400">
                      Potential savings: ₱{optimizations.potentialSavings.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSettings;
