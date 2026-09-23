import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge from '../../components/common/CategoryBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  AlertOctagon,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/reports/my');
        if (res.success) {
          setReports(res.data || []);
        }
      } catch (err) {
        console.warn('Failed to load my reports:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.address && r.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            My Civic Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track real-time status and operational responses for all issues you have registered.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-civic-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-civic-600/20 hover:bg-civic-700 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Report New Issue
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, keyword, or landmark..."
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-civic-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-civic-600 focus:outline-none bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          title="No reports match your filters"
          description="Try adjusting your search criteria or report a new civic issue."
          actionText="+ Report an Issue"
          actionLink="/report"
        />
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <Link
              key={report.reportId}
              to={`/reports/${report.reportId}`}
              className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-subtle hover:border-civic-300 hover:shadow-card transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {report.images && report.images[0] ? (
                    <img
                      src={report.images[0]}
                      alt={report.title}
                      className="h-16 w-16 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400 flex-shrink-0">
                      <AlertOctagon className="h-7 w-7" />
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

                    <h3 className="mt-1.5 text-base font-bold text-slate-900 group-hover:text-civic-600 transition">
                      {report.title}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {report.address || report.ward}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <StatusBadge status={report.status} size="md" />
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-civic-600 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
