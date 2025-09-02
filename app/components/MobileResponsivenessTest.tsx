'use client';

import React, { useState, useEffect } from 'react';
import { FiSmartphone, FiTablet, FiMonitor, FiCheck, FiX } from 'react-icons/fi';

const MobileResponsivenessTest = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('');
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewportWidth(width);
      setViewportHeight(height);

      // Determine breakpoint
      if (width < 480) {
        setCurrentBreakpoint('Extra Small (Mobile)');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 640) {
        setCurrentBreakpoint('Small (Mobile)');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 768) {
        setCurrentBreakpoint('Medium (Mobile)');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 1024) {
        setCurrentBreakpoint('Large (Tablet)');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setCurrentBreakpoint('Extra Large (Desktop)');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const testFeatures = [
    {
      name: 'Responsive Typography',
      mobile: 'Text scales appropriately on small screens',
      tablet: 'Text is readable on tablet devices',
      desktop: 'Full typography experience'
    },
    {
      name: 'Grid Layouts',
      mobile: 'Single column layout',
      tablet: 'Two column layout',
      desktop: 'Multi-column grid system'
    },
    {
      name: 'Touch Targets',
      mobile: '44px minimum touch targets',
      tablet: 'Optimized for touch interaction',
      desktop: 'Mouse-friendly sizing'
    },
    {
      name: 'Spacing',
      mobile: 'Compact spacing for small screens',
      tablet: 'Balanced spacing for tablets',
      desktop: 'Comfortable desktop spacing'
    },
    {
      name: 'Navigation',
      mobile: 'Hamburger menu with overlay',
      tablet: 'Adaptive sidebar navigation',
      desktop: 'Full sidebar navigation'
    },
    {
      name: 'Charts & Graphs',
      mobile: 'Optimized chart heights',
      tablet: 'Balanced chart sizing',
      desktop: 'Full chart experience'
    }
  ];

  return (
    <div className="liquid-card p-4 sm:p-6 lg:p-8 rounded-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">📱 Mobile Responsiveness Test</h2>
        <p className="text-white/60">Verify responsive design across all devices</p>
      </div>

      {/* Current Device Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="liquid-card p-4 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiSmartphone className={`text-2xl ${isMobile ? 'text-emerald-400' : 'text-white/40'}`} />
            <span className="font-semibold">Mobile</span>
          </div>
          <p className="text-sm text-white/60">
            {isMobile ? 'Active' : 'Inactive'}
          </p>
        </div>

        <div className="liquid-card p-4 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiTablet className={`text-2xl ${isTablet ? 'text-blue-400' : 'text-white/40'}`} />
            <span className="font-semibold">Tablet</span>
          </div>
          <p className="text-sm text-white/60">
            {isTablet ? 'Active' : 'Inactive'}
          </p>
        </div>

        <div className="liquid-card p-4 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiMonitor className={`text-2xl ${isDesktop ? 'text-purple-400' : 'text-white/40'}`} />
            <span className="font-semibold">Desktop</span>
          </div>
          <p className="text-sm text-white/60">
            {isDesktop ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      {/* Viewport Information */}
      <div className="liquid-card p-4 rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-3">Current Viewport</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/60">Breakpoint:</p>
            <p className="font-mono text-lg">{currentBreakpoint}</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Dimensions:</p>
            <p className="font-mono text-lg">{viewportWidth} × {viewportHeight}</p>
          </div>
        </div>
      </div>

      {/* Responsive Features Test */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Responsive Features Status</h3>
        {testFeatures.map((feature, index) => (
          <div key={index} className="liquid-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{feature.name}</h4>
              <div className="flex items-center gap-2">
                {isMobile && (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    Mobile: {feature.mobile}
                  </span>
                )}
                {isTablet && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    Tablet: {feature.tablet}
                  </span>
                )}
                {isDesktop && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    Desktop: {feature.desktop}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-emerald-400" size={16} />
              <span className="text-sm text-white/60">
                {isMobile ? feature.mobile : isTablet ? feature.tablet : feature.desktop}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Grid Test */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Grid System Test</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="liquid-card p-4 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">{item}</span>
              </div>
              <p className="text-sm">Grid Item {item}</p>
              <p className="text-xs text-white/60">Responsive sizing</p>
            </div>
          ))}
        </div>
      </div>

      {/* Touch Target Test */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Touch Target Test</h3>
        <div className="flex flex-wrap gap-4">
          <button className="liquid-button px-4 py-3 rounded-xl min-h-[44px] min-w-[44px]">
            Touch Button
          </button>
          <button className="liquid-button px-4 py-3 rounded-xl min-h-[44px] min-w-[44px]">
            Another
          </button>
          <button className="liquid-button px-4 py-3 rounded-xl min-h-[44px] min-w-[44px]">
            Button
          </button>
        </div>
        <p className="text-sm text-white/60 mt-2">
          All buttons should be at least 44×44px for mobile accessibility
        </p>
      </div>
    </div>
  );
};

export default MobileResponsivenessTest;
