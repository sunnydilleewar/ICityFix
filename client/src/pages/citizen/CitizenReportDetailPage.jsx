import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import CategoryBadge, { CATEGORY_INFO } from '../../components/common/CategoryBadge';
import StatusTimeline from '../../components/report/StatusTimeline';
import OperationsMap from '../../components/map/OperationsMap';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ThumbsUp,
  Share2,
  Building2,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';

export default function CitizenReportDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useNotifications();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/reports/${id}`);
        if (res.success && res.data) {
          setReport(res.data);
          setUpvotes(res.data.upvotes || 0);
        } else {
          setError('Report not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve report details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to upvote civic issues', 'info');
      return;
    }

    try {
      const res = await axiosClient.post(`/reports/${report._id}/upvote`);
      if (res.success) {
        setUpvotes(res.upvotes);
        setHasUpvoted(res.hasUpvoted);
        showToast(
          res.hasUpvoted ? 'Upvoted this civic issue' : 'Upvote removed',
          'success'
        );
      }
    } catch (err) {
      showToast('Failed to register upvote', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Report URL copied to clipboard!', 'info');
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
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-slate-900">Report Unavailable</h2>
        <p className="text-sm text-slate-500">{error || 'This report does not exist or has been removed.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-civic-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Nav Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button
            onClick={handleUpvote}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
              hasUpvoted
                ? 'border-civic-600 bg-civic-50 text-civic-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5 text-civic-600" />
            Upvote ({upvotes})
          </button>
        </div>
      </div>

      {/* Main Report Card Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-base font-extrabold text-civic-700">
                {report.reportId}
              </span>
              <CategoryBadge category={report.category} />
              <PriorityBadge priority={report.priority} />
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {report.title}
            </h1>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
            <span className="text-xs text-slate-400">Current Status:</span>
            <StatusBadge status={report.status} size="md" />
          </div>
        </div>

        {/* Metadata Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl bg-slate-50/80 p-4 border border-slate-200 text-xs">
          <div>
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Location & Ward
            </span>
            <p className="mt-1 font-medium text-slate-800 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {report.address || report.ward}
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Assigned Department
            </span>
            <p className="mt-1 font-medium text-slate-800 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {report.assignedDepartment || 'Municipal Operations Review'}
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Date Reported
            </span>
            <p className="mt-1 font-medium text-slate-800 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {new Date(report.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Citizen Description
          </h3>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Attached Photos / Evidence */}
        {report.images && report.images.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Evidence Photos ({report.images.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {report.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 hover:opacity-90 transition"
                >
                  <img
                    src={img}
                    alt={`Evidence ${i + 1}`}
                    className="h-32 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Geospatial Map View */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-civic-600" />
          Geospatial Map Coordinates
        </h3>
        <OperationsMap reports={[report]} height="320px" />
      </div>

      {/* Status Timeline & Audit Trail */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Resolution Workflow & Progress
        </h3>
        <StatusTimeline currentStatus={report.status} history={report.statusHistory} />
      </div>

      {/* Modal for Full Image View */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-white p-2">
            <img
              src={selectedImage}
              alt="Expanded Evidence"
              className="max-h-[80vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
