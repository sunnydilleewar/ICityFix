import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge, { CATEGORY_INFO } from '../../components/common/CategoryBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  Building2,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/reports', {
        params: {
          search,
          category,
          status,
          priority,
          page,
          limit: 10,
          sort: '-createdAt',
        },
      });

      if (res.success) {
        setReports(res.data || []);
        setTotalPages(res.pages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.warn('Failed to load admin reports:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [category, status, priority, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Municipal Reports Management
            </h1>
            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-800">
              {totalCount} Total Issues
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, assign and advance civic issues through the municipal resolution lifecycle.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Report ID, title, keyword, address, or ward..."
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-civic-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-civic-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-civic-700 transition"
          >
            Search Queue
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-civic-600 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {Object.entries(CATEGORY_INFO).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-civic-600 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-civic-600 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {(category !== 'ALL' || status !== 'ALL' || priority !== 'ALL' || search) && (
            <button
              onClick={() => {
                setCategory('ALL');
                setStatus('ALL');
                setPriority('ALL');
                setSearch('');
                setPage(1);
              }}
              className="text-xs font-semibold text-civic-600 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Reports Table (Desktop) / Cards (Mobile) */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports found"
          description="There are no municipal issues matching the applied query parameters."
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Issue Details</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Ward / Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Assigned To</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4 font-mono font-bold text-civic-700 whitespace-nowrap">
                      {report.reportId}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <Link
                        to={`/admin/reports/${report.reportId}`}
                        className="font-bold text-slate-900 hover:text-civic-600 transition line-clamp-1"
                      >
                        {report.title}
                      </Link>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {report.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <CategoryBadge category={report.category} short={true} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600 text-[11px]">
                      {report.ward}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={report.status} size="xs" />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <PriorityBadge priority={report.priority} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-700 text-xs">
                      {report.assignedTo?.name ? (
                        <span className="font-medium text-slate-900 truncate max-w-[120px] block">
                          {report.assignedTo.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/reports/${report.reportId}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-civic-50 hover:text-civic-700 transition"
                      >
                        Manage
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden space-y-3">
            {reports.map((report) => (
              <Link
                key={report.reportId}
                to={`/admin/reports/${report.reportId}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-subtle hover:border-civic-300 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-civic-700">
                    {report.reportId}
                  </span>
                  <PriorityBadge priority={report.priority} />
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-900">
                  {report.title}
                </h4>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={report.status} size="xs" />
                  <CategoryBadge category={report.category} short={true} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="truncate">{report.ward}</span>
                  <span className="font-semibold text-civic-600">Open &rarr;</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
            <span className="text-slate-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
