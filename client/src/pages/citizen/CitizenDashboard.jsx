import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import EmptyState from '../../components/common/EmptyState';
import { StatCardSkeleton, TableSkeleton } from '../../components/common/SkeletonLoader';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  MapPin,
  FileText,
  ArrowRight,
  TrendingUp,
  Activity,
  ExternalLink,
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myReports, setMyReports] = useState([]);
  const [nearbyReports, setNearbyReports] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    resolved: 0,
    total: 0,
    nearbyCount: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchCitizenData = async () => {
      setLoading(true);
      try {
        const [myRes, nearbyRes] = await Promise.all([
          axiosClient.get('/reports/my'),
          axiosClient.get('/reports/nearby', {
            params: {
              lng: 77.6412,
              lat: 12.9716,
              radius: 5000,
            },
          }),
        ]);

        const reports = myRes.data || [];
        setMyReports(reports);

        const activeCount = reports.filter((r) => r.status !== 'RESOLVED').length;
        const resolvedCount = reports.filter((r) => r.status === 'RESOLVED').length;

        setStats({
          active: activeCount,
          resolved: resolvedCount,
          total: reports.length,
          nearbyCount: nearbyRes.data ? nearbyRes.data.length : 0,
        });

        setNearbyReports(nearbyRes.data || []);
      } catch (err) {
        console.warn('Error loading citizen dashboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCitizenData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Citizen'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here’s what’s happening with your civic reports and municipal actions.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-civic-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-civic-600/20 hover:bg-civic-700 transition active:scale-95 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Report an Issue
        </Link>
      </div>

      {/* Real Statistics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Active Reports"
              value={stats.active}
              subtitle="Under review & in progress"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Resolved Reports"
              value={stats.resolved}
              subtitle="Completed & field verified"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Total Submitted"
              value={stats.total}
              subtitle="Lifetime citizen reports"
              icon={FileText}
              color="blue"
            />
            <StatCard
              title="Nearby Issues"
              value={stats.nearbyCount}
              subtitle="Within your municipal zone"
              icon={MapPin}
              color="purple"
            />
          </>
        )}
      </div>

      {/* Main Grid: Recent Reports & Activity/Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Reports */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
            <Link
              to="/my-reports"
              className="text-xs font-semibold text-civic-600 hover:text-civic-800"
            >
              View all ({myReports.length})
            </Link>
          </div>

          {loading ? (
            <TableSkeleton rows={4} />
          ) : myReports.length === 0 ? (
            <EmptyState
              title="No civic reports yet"
              description="Once you report an issue in your neighbourhood, it will appear here with live tracking updates."
              actionText="+ Report Your First Issue"
              actionLink="/report"
            />
          ) : (
            <div className="space-y-3">
              {myReports.slice(0, 5).map((report) => (
                <Link
                  key={report.reportId}
                  to={`/reports/${report.reportId}`}
                  className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-subtle hover:border-civic-300 hover:shadow-card transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {report.images && report.images[0] ? (
                        <img
                          src={report.images[0]}
                          alt={report.title}
                          className="h-14 w-14 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400 flex-shrink-0">
                          <AlertOctagon className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-civic-700">
                            {report.reportId}
                          </span>
                          <CategoryBadge category={report.category} short={true} />
                          <PriorityBadge priority={report.priority} />
                        </div>
                        <h3 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-civic-600 transition">
                          {report.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{report.address || report.ward}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 gap-1.5 flex-shrink-0">
                      <StatusBadge status={report.status} />
                      <span className="text-[10px] text-slate-400">
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Status Overview & Nearby Issues Quick View */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Pipeline Overview */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-civic-600" />
              Municipal Workflow Stages
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'Reported', key: 'REPORTED', color: 'bg-blue-500' },
                { label: 'Under Review', key: 'UNDER_REVIEW', color: 'bg-amber-500' },
                { label: 'Assigned', key: 'ASSIGNED', color: 'bg-purple-500' },
                { label: 'In Progress', key: 'IN_PROGRESS', color: 'bg-sky-500' },
                { label: 'Resolved', key: 'RESOLVED', color: 'bg-emerald-500' },
              ].map((stage) => {
                const count = myReports.filter((r) => r.status === stage.key).length;
                return (
                  <div key={stage.key} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                      <span className="text-slate-700 font-medium">{stage.label}</span>
                    </div>
                    <span className="font-semibold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nearby Issues Snippet */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                In Your Locality
              </h3>
              <Link to="/nearby" className="text-xs font-semibold text-civic-600 hover:underline">
                View Map
              </Link>
            </div>

            <div className="space-y-2.5">
              {nearbyReports.slice(0, 3).map((rep) => (
                <Link
                  key={rep.reportId}
                  to={`/reports/${rep.reportId}`}
                  className="block rounded-lg border border-slate-100 p-2.5 transition hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-mono font-bold text-slate-600 truncate">
                      {rep.reportId}
                    </span>
                    <StatusBadge status={rep.status} size="xs" />
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-800 line-clamp-1">
                    {rep.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
