import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import OperationsMap from '../../components/map/OperationsMap';
import { CATEGORY_INFO } from '../../components/common/CategoryBadge';
import { Filter, Layers, MapPin, RefreshCw } from 'lucide-react';

export default function AdminMapPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [priority, setPriority] = useState('ALL');

  const fetchMapReports = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/reports', {
        params: {
          category,
          status,
          priority,
          limit: 100,
        },
      });

      if (res.success) {
        setReports(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load GIS map reports:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapReports();
  }, [category, status, priority]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Citywide GIS Operations Map
            </h1>
            <span className="rounded-full bg-civic-100 px-2.5 py-0.5 text-xs font-bold text-civic-800">
              {reports.length} Mapped Pins
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time geospatial intelligence, category cluster visualization, and field dispatch tracking.
          </p>
        </div>

        <button
          onClick={fetchMapReports}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Coordinates
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-subtle">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="h-3.5 w-3.5" />
          GIS Filters:
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
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
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
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
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Full GIS Map Canvas */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
        <OperationsMap reports={reports} height="650px" isAdmin={true} />
      </div>
    </div>
  );
}
