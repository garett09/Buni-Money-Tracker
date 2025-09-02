'use client';

import React from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import OptimizedDashboard from '@/app/components/OptimizedDashboard';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <OptimizedDashboard />
    </DashboardLayout>
  );
};

export default DashboardPage;
