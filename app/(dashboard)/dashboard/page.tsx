'use client';

import React from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import OptimizedDashboard from '@/app/components/OptimizedDashboard';

const DashboardPage = () => {
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
