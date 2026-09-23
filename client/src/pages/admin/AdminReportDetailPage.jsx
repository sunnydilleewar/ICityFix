import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useNotifications } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge, { CATEGORY_INFO } from '../../components/common/CategoryBadge';
import OperationsMap from '../../components/map/OperationsMap';
import StatusTimeline from '../../components/report/StatusTimeline';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  Send,
} from 'lucide-react';

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const { showToast } = useNotifications();

  const [report, setReport] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Workflow Form State
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [operationalNote, setOperationalNote] = useState('');

  const fetchReportAndOfficers = async () => {
    setLoading(true);
    try {
      const [repRes, offRes] = await Promise.all([
        axiosClient.get(`/reports/${id}`),
        axiosClient.get('/admin/officers'),
      ]);

      if (repRes.success && repRes.data) {
        setReport(repRes.data);
        setSelectedStatus(repRes.data.status);
        setSelectedPriority(repRes.data.priority);
        setSelectedOfficer(repRes.data.assignedTo?._id || '');
      } else {
        setError('Report not found');
      }

      if (offRes.success) {
        setOfficers(offRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch operational report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportAndOfficers();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await axiosClient.patch(`/admin/reports/${report._id}/status`, {
        status: selectedStatus,
        priority: selectedPriority,
        note: operationalNote.trim(),
      });

      if (res.success && res.data) {
        setReport(res.data);
        setOperationalNote('');
        showToast(`Status transitioned to ${selectedStatus}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignOfficer = async (officerId) => {
    setSelectedOfficer(officerId);
    try {
      const res = await axiosClient.patch(`/admin/reports/${report._id}/assign`, {
        assignedTo: officerId,
      });

      if (res.success && res.data) {
        setReport(res.data);
        showToast('Assigned field officer successfully', 'success');
      }
    } catch (err) {
      showToast('Assignment update failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-civic-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center space-y-4">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Requested report identifier was not found.'}</p>
        <Link
          to="/admin/reports"
          className="inline-flex items-center gap-2 rounded-xl bg-civic-600 px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/reports"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-extrabold text-civic-700">
                {report.reportId}
              </span>
              <PriorityBadge priority={report.priority} />
              <StatusBadge status={report.status} />
            </div>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              {report.title}
            </h1>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500">
          Created: {new Date(report.createdAt).toLocaleString()}
        </div>
      </div>

      {/* 3-COLUMN OPERATIONAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Issue Info & Photos (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Administrative Domain
            </span>
            <div className="mt-1">
              <CategoryBadge category={report.category} />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Description
            </span>
            <p className="mt-1 text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200">
              {report.description}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Location / Ward
            </span>
            <p className="mt-1 text-xs font-semibold text-slate-900 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {report.address || report.ward}
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              Ward: {report.ward}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Reporter Details
            </span>
            <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-civic-100 text-civic-700 text-xs font-bold uppercase">
                {report.reporter?.name ? report.reporter.name[0] : 'C'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {report.reporter?.name || 'Citizen'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {report.reporter?.email || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {report.images && report.images.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Evidence Photos ({report.images.length})
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {report.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Evidence"
                    className="h-24 w-full rounded-lg object-cover border border-slate-200"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTER COLUMN: Geospatial Map View (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-civic-600" />
              Geospatial Positioning
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {report.location?.coordinates ? `${report.location.coordinates[1].toFixed(4)}, ${report.location.coordinates[0].toFixed(4)}` : ''}
            </span>
          </div>

          <OperationsMap reports={[report]} height="380px" isAdmin={true} />

          <p className="text-[11px] text-slate-500">
            OpenStreetMap geospatial pin verified with MongoDB 2dsphere spherical indexing.
          </p>
        </div>

        {/* RIGHT COLUMN: Operational Workflow Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Operational Triage Panel
            </h3>
            <span className="rounded bg-civic-100 px-1.5 py-0.5 text-[10px] font-bold text-civic-800">
              Admin Action
            </span>
          </div>

          {/* Officer Assignment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Assign Municipal Officer
            </label>
            <select
              value={selectedOfficer}
              onChange={(e) => handleAssignOfficer(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 focus:border-civic-600 focus:outline-none bg-white"
            >
              <option value="">-- Select Field Officer --</option>
              {officers.map((off) => (
                <option key={off._id} value={off._id}>
                  {off.name} ({off.department})
                </option>
              ))}
            </select>
          </div>

          {/* Workflow Status Update Form */}
          <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Workflow Status State
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-civic-600 focus:outline-none bg-white"
              >
                <option value="REPORTED">REPORTED (Initial citizen submission)</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW (Operations review)</option>
                <option value="ASSIGNED">ASSIGNED (Dispatched to team)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Active field repair)</option>
                <option value="RESOLVED">RESOLVED (Completed & verified)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Priority Level
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-civic-600 focus:outline-none bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Internal Operational Audit Note
              </label>
              <textarea
                rows={3}
                value={operationalNote}
                onChange={(e) => setOperationalNote(e.target.value)}
                placeholder="Log reason for status update, contractor details, or field inspection notes..."
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-civic-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full rounded-xl bg-civic-600 py-2.5 text-xs font-bold text-white shadow-md shadow-civic-600/20 hover:bg-civic-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating Workflow...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Apply Status & Log Audit Note
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM SECTION: Full Audit Trail Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Complete Audit Trail & Status History
        </h3>
        <StatusTimeline currentStatus={report.status} history={report.statusHistory} />
      </div>
    </div>
  );
}
