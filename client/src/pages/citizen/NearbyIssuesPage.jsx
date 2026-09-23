import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import OperationsMap from '../../components/map/OperationsMap';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge, { CATEGORY_INFO } from '../../components/common/CategoryBadge';
import EmptyState from '../../components/common/EmptyState';
import { MapPin, Filter, Calendar } from 'lucide-react';

export default function NearbyIssuesPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    const fetchNearby = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get('/reports/nearby', {
          params: {
            lng: 77.6412,
            lat: 12.9716,
            radius: 8000,
            category: selectedCategory,
            status: selectedStatus,
          },
        });
        if (res.success) {
          setReports(res.data || []);
        }
      } catch (err) {
        console.warn('Failed to load nearby reports:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [selectedCategory, selectedStatus]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Nearby Civic Issues
          </h1>
          <span className="rounded-full bg-civic-100 px-2.5 py-0.5 text-xs font-bold text-civic-800">
            {reports.length} within 8km
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Geographic visibility of neighborhood maintenance, road hazards, and sanitation tickets.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 bg-white focus:border-civic-600 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {Object.entries(CATEGORY_INFO).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 bg-white focus:border-civic-600 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Map */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
        <OperationsMap reports={reports} height="480px" />
      </div>

      {/* List below map */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-slate-900">
          Issues Feed ({reports.length})
        </h3>

        {reports.length === 0 ? (
          <EmptyState
            title="No nearby issues found"
            description="Your neighbourhood currently has no active reports matching the selected filters."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <Link
                key={report.reportId}
                to={`/reports/${report.reportId}`}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-subtle hover:border-civic-300 hover:shadow-card transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-civic-700">
                      {report.reportId}
                    </span>
                    <PriorityBadge priority={report.priority} />
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-civic-600 transition line-clamp-2">
                    {report.title}
                  </h4>

                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{report.address || report.ward}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <StatusBadge status={report.status} size="xs" />
                  <CategoryBadge category={report.category} short={true} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
