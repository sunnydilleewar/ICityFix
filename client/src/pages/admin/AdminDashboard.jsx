import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge, { CATEGORY_INFO } from '../../components/common/CategoryBadge';
import { StatCardSkeleton, CardSkeleton } from '../../components/common/SkeletonLoader';
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
} from 'recharts';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  ListFilter,
  UserCheck,
} from 'lucide-react';

const STATUS_COLORS = {
  REPORTED: '#3B82F6',
  UNDER_REVIEW: '#F59E0B',
  ASSIGNED: '#8B5CF6',
  IN_PROGRESS: '#0284C7',
  RESOLVED: '#10B981',
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalReports: 0,
    pendingReview: 0,
    inProgress: 0,
    resolved: 0,
    highUrgentPriority: 0,
    resolutionRate: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [dashRes, anaRes] = await Promise.all([
          axiosClient.get('/admin/dashboard'),
          axiosClient.get('/admin/analytics'),
        ]);

        if (dashRes.success) {
          setMetrics(dashRes.data.metrics);
          setRecentReports(dashRes.data.recentReports || []);
          setPriorityQueue(dashRes.data.priorityQueue || []);
        }

        if (anaRes.success) {
          setAnalytics(anaRes.data);
        }
      } catch (err) {
        console.warn('Failed to load admin dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Format category data for chart
  const categoryChartData = analytics?.categoryStats?.map((item) => ({
    name: CATEGORY_INFO[item.category]?.shortLabel || item.category,
    count: item.count,
    fill: CATEGORY_INFO[item.category]?.color || '#0270C7',
  })) || [];

  const statusChartData = analytics?.statusStats?.map((item) => ({
    name: item.status.replace('_', ' '),
    value: item.count,
    color: STATUS_COLORS[item.status] || '#94A3B8',
  })) || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Municipal Operations Command
            </h1>
            <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 uppercase tracking-wide">
              Directorate View
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Monitor, assign and resolve civic issues across the city.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <ListFilter className="h-4 w-4" />
            Manage Queue
          </Link>
          <Link
            to="/admin/map"
            className="inline-flex items-center gap-1.5 rounded-xl bg-civic-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-civic-600/20 hover:bg-civic-700 transition"
          >
            <MapPin className="h-4 w-4" />
            Open GIS Map
          </Link>
        </div>
      </div>

      {/* Top 5 Metrics from Real MongoDB aggregations */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Reports"
              value={metrics.totalReports}
              subtitle="Registered citywide"
              icon={FileText}
              color="blue"
            />
            <StatCard
              title="Pending Review"
              value={metrics.pendingReview}
              subtitle="Awaiting triage / review"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="In Progress"
              value={metrics.inProgress}
              subtitle="Active field work"
              icon={Wrench}
              color="sky"
            />
            <StatCard
              title="Resolved"
              value={metrics.resolved}
              subtitle={`${metrics.resolutionRate}% resolution rate`}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="High / Urgent"
              value={metrics.highUrgentPriority}
              subtitle="Requires priority dispatch"
              icon={AlertTriangle}
              color="red"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Civic Reports by Category
              </h3>
              <p className="text-xs text-slate-500">Distribution across municipal departments</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">Real DB Aggregation</span>
          </div>

          <div className="h-64 w-full">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#0270C7" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution Donut Chart */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Status Distribution</h3>
            <p className="text-xs text-slate-500">Pipeline progression breakdown</p>
          </div>

          <div className="h-52 w-full my-auto">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
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
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                No status data available
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 pt-3">
            {statusChartData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 truncate">{s.name}:</span>
                <span className="font-bold text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Feed & Priority Queue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Urgent Priority Dispatch Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Urgent Priority Queue ({priorityQueue.length})
            </h3>
            <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Immediate Action
            </span>
          </div>

          <div className="space-y-3">
            {priorityQueue.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
                No pending high/urgent issues at this time.
              </div>
            ) : (
              priorityQueue.map((rep) => (
                <Link
                  key={rep.reportId}
                  to={`/admin/reports/${rep.reportId}`}
                  className="block rounded-xl border border-red-200 bg-red-50/30 p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-civic-700">
                      {rep.reportId}
                    </span>
                    <PriorityBadge priority={rep.priority} />
                  </div>
                  <h4 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">
                    {rep.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2">{rep.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-red-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {rep.address || rep.ward}
                    </span>
                    <StatusBadge status={rep.status} size="xs" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Operational Inflow Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Recent Incoming Reports
            </h3>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-civic-600 hover:text-civic-800 flex items-center gap-1"
            >
              Full operational queue
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <Link
                key={report.reportId}
                to={`/admin/reports/${report.reportId}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-subtle hover:border-civic-300 hover:shadow-card transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-civic-600 font-bold text-xs flex-shrink-0">
                    {report.reportId.slice(-3)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {report.reportId}
                      </span>
                      <CategoryBadge category={report.category} short={true} />
                      <PriorityBadge priority={report.priority} />
                    </div>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-civic-600 transition">
                      {report.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {report.address || report.ward}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 gap-1.5 flex-shrink-0">
                  <StatusBadge status={report.status} size="xs" />
                  <span className="text-[10px] text-slate-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
