'use client';

import React from 'react';
import TutorialButton from './TutorialButton';

const TutorialDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tutorial System Demo
          </h1>
          <p className="text-xl text-gray-300">
            See how the interactive tutorial helps users understand all the modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Top Bar Access</h2>
            <p className="text-gray-300 mb-4">
              The tutorial button is always visible in the top-right corner of any dashboard page.
            </p>
            <div className="flex justify-center">
              <TutorialButton currentPage="demo" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Sidebar Access</h2>
            <p className="text-gray-300 mb-4">
              Users can also access the tutorial from the left sidebar under the "Need Help?" section.
            </p>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-2xl">?</span>
              </div>
              <p className="text-emerald-400 text-sm">Always accessible</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            What the Tutorial Covers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dashboard & Analytics</h3>
              <p className="text-gray-300 text-sm">
                Financial overview, charts, and real-time insights
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Budget & Expenses</h3>
              <p className="text-gray-300 text-sm">
                Spending tracking, budget management, and goal setting
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-300 mb-4">
              Click the tutorial button above to see the full interactive guide!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Interactive and responsive
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialDemo;
