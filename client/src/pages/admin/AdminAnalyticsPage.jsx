import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { CATEGORY_INFO } from '../../components/common/CategoryBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Layers, CheckCircle2, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  REPORTED: '#3B82F6',
  UNDER_REVIEW: '#F59E0B',
  ASSIGNED: '#8B5CF6',
  IN_PROGRESS: '#0284C7',
  RESOLVED: '#10B981',
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/admin/analytics');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Failed to load analytics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-civic-600" />
      </div>
    );
  }

  const categoryData = data?.categoryStats?.map((c) => ({
    name: CATEGORY_INFO[c.category]?.shortLabel || c.category,
    count: c.count,
    fill: CATEGORY_INFO[c.category]?.color || '#0270C7',
  })) || [];

  const statusData = data?.statusStats?.map((s) => ({
    name: s.status.replace('_', ' '),
    value: s.count,
    color: STATUS_COLORS[s.status] || '#94A3B8',
  })) || [];

  const wardData = data?.wardStats?.map((w) => ({
    ward: w.ward.replace('Ward ', 'W-'),
    total: w.total,
    resolved: w.resolved,
    pending: w.pending,
  })) || [];

  const timelineData = data?.timelineStats || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Municipal Operational Analytics
          </h1>
          <span className="rounded-md bg-civic-100 px-2.5 py-0.5 text-xs font-bold text-civic-800">
            Live MongoDB Aggregations
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Data-driven infrastructure metrics, category volume trends, and administrative resolution metrics.
        </p>
      </div>

      {/* Row 1: Category Bar & Status Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Volume by Civic Category
          </h3>
          <p className="text-xs text-slate-500 mb-4">Total reports grouped by municipal domain</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[5, 5, 0, 0]} fill="#0270C7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Workflow Status Distribution
            </h3>
            <p className="text-xs text-slate-500">Pipeline progression breakdown</p>
          </div>
          <div className="h-60 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 truncate">{s.name}:</span>
                <span className="font-bold text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Ward Comparison */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Ward-Level Resolution Performance
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Total civic reports vs resolved tickets per administrative ward
        </p>
        <div className="h-72 w-full">
          {wardData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ward" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No ward data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
