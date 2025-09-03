'use client';

import React, { useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import OptimizedDashboard from '@/app/components/OptimizedDashboard';
import { requireAuth } from '@/app/lib/auth';

const DashboardPage = () => {
  // Check authentication on component mount
  useEffect(() => {
    requireAuth();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Main Dashboard Component */}
        <OptimizedDashboard />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
