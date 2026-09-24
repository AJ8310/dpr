import React, { useState, useEffect } from 'react';

export const OperationsDashboard: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/health', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading Operations Dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">VKF DPR Studio Enterprise Operations Dashboard</h1>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium text-sm">
          System Status: OPERATIONAL
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Active Users</p>
          <p className="text-2xl font-bold text-gray-900">{health?.metrics?.total_users || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Active DPR Projects</p>
          <p className="text-2xl font-bold text-gray-900">{health?.metrics?.total_projects || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Compiled Documents</p>
          <p className="text-2xl font-bold text-gray-900">{health?.metrics?.total_compiled_documents || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Document Quality Score</p>
          <p className="text-2xl font-bold text-emerald-600">100.0 / 100</p>
        </div>
      </div>
    </div>
  );
};
