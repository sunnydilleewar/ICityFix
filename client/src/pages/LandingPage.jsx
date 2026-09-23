import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_INFO } from '../components/common/CategoryBadge';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import {
  MapPin,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Layers,
  Compass,
  Building2,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    inProgress: 0,
  });
  const [sampleReports, setSampleReports] = useState([]);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await axiosClient.get('/reports', { params: { limit: 4 } });
        if (res.success) {
          setSampleReports(res.data);
          setStats((prev) => ({
            ...prev,
            total: res.total,
          }));
        }
      } catch (err) {
        console.warn('Failed to load landing data:', err.message);
      }
    };

    fetchPublicData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-civic-200 bg-civic-50 px-3 py-1 text-xs font-semibold text-civic-800">
                <span className="flex h-2 w-2 rounded-full bg-civic-600 animate-pulse" />
                Next-Gen Civic Infrastructure for Indian Municipalities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Make Your City Better,{' '}
                <span className="text-civic-600 underline decoration-civic-300 underline-offset-8">
                  One Report at a Time.
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Report civic issues, track real-time resolution progress, and empower municipal engineering crews to resolve infrastructure bottlenecks faster with spatial intelligence.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={isAuthenticated ? (isAdmin ? '/admin' : '/report') : '/register'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-civic-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-civic-600/25 transition hover:bg-civic-700 active:scale-95"
                >
                  Report an Issue
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#live-feed"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Explore Civic Issues
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Location-Aware</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">2dsphere GIS</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Duplicate Check</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Advisory AI</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Live Progress</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Audit Trail</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Municipal Ops</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Role Workflow</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup / Map Teaser */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 font-mono text-xs font-bold text-slate-500">
                      iCityFix Operations Radar
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Telemetry
                  </span>
                </div>

                <div className="relative h-64 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                    alt="City GIS Infrastructure"
                    className="h-full w-full object-cover opacity-85"
                  />
                  {/* Floating Pin overlays */}
                  <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 shadow-lg backdrop-blur text-xs font-semibold text-slate-800 border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    Indiranagar: Pothole In Progress
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 shadow-lg backdrop-blur text-xs font-semibold text-slate-800 border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    HAL 2nd Stage: Streetlight Resolved
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Duplicate detection window:</span>
                  <span className="font-semibold text-slate-800">600m geospatial radius</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-civic-600">
            Workflow Architecture
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            From Civic Report to On-Site Resolution
          </h2>
          <p className="text-sm text-slate-600">
            A transparent four-stage lifecycle uniting citizens with municipal engineering teams.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle hover:shadow-card transition">
            <span className="font-mono text-2xl font-black text-civic-600">01</span>
            <h3 className="mt-3 text-base font-bold text-slate-900">Report</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Citizens select categories, attach clear photos, and provide contextual details in under 2 minutes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle hover:shadow-card transition">
            <span className="font-mono text-2xl font-black text-civic-600">02</span>
            <h3 className="mt-3 text-base font-bold text-slate-900">Locate</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Interactive map drops exact GPS coordinates into MongoDB 2dsphere indexes for automatic ward routing.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle hover:shadow-card transition">
            <span className="font-mono text-2xl font-black text-civic-600">03</span>
            <h3 className="mt-3 text-base font-bold text-slate-900">Track</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Transparent live status audit log shows which municipal officer is assigned and what actions are underway.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle hover:shadow-card transition">
            <span className="font-mono text-2xl font-black text-civic-600">04</span>
            <h3 className="mt-3 text-base font-bold text-slate-900">Resolve</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Field crews complete repairs, upload verification confirmation, and update the community record.
            </p>
          </div>
        </div>
      </section>

      {/* CIVIC CATEGORIES GRID */}
      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-civic-600">
            Administrative Domains
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Civic Categories Covered
          </h2>
          <p className="text-sm text-slate-600">
            Standardized issue classifications aligned with municipal bylaws and engineering departments.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(CATEGORY_INFO).map(([key, info]) => {
            const IconComponent = info.icon;
            return (
              <div
                key={key}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-subtle hover:border-civic-300 hover:shadow-card transition"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 group-hover:scale-105 transition"
                  style={{ color: info.color }}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <h4 className="mt-3 font-semibold text-sm text-slate-900">{info.label}</h4>
                <p className="text-xs text-slate-400 mt-1">Field dispatch ready</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PLATFORM INTELLIGENCE FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-8 sm:p-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-civic-400">
              System Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Enterprise Municipal Technology
            </h2>
            <p className="text-sm text-slate-300">
              Engineered to handle high-density civic reporting with spatial indexes and non-blocking duplicate management.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-5">
              <Compass className="h-6 w-6 text-civic-400" />
              <h4 className="mt-3 text-sm font-bold">Location-Aware Duplicate Detection</h4>
              <p className="mt-1 text-xs text-slate-400">
                MongoDB $geoNear queries identify reports within 500m to consolidate citizen reports without blocking submissions.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-5">
              <Building2 className="h-6 w-6 text-emerald-400" />
              <h4 className="mt-3 text-sm font-bold">Municipal Workflow Triage</h4>
              <p className="mt-1 text-xs text-slate-400">
                Administrative state machine with role enforcement, department assignment, and internal audit notes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-5">
              <Layers className="h-6 w-6 text-amber-400" />
              <h4 className="mt-3 text-sm font-bold">GIS Map Visualizer</h4>
              <p className="mt-1 text-xs text-slate-400">
                Interactive OpenStreetMap integration displaying real-time issue clusters, priority indicators, and statuses.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-5">
              <Users className="h-6 w-6 text-purple-400" />
              <h4 className="mt-3 text-sm font-bold">Democratic Civic Feedback</h4>
              <p className="mt-1 text-xs text-slate-400">
                Citizens upvote urgent neighborhood issues to elevate public attention and assist municipal prioritization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE REPORTS PREVIEW */}
      <section id="live-feed" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-civic-600">
              Real-Time Feed
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Recent Municipal Dispatches
            </h2>
          </div>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="inline-flex items-center gap-1 text-xs font-semibold text-civic-600 hover:text-civic-800"
          >
            View all municipal issues
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleReports.map((report) => (
            <div
              key={report.reportId}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-civic-700">
                    {report.reportId}
                  </span>
                  <PriorityBadge priority={report.priority} />
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-900 line-clamp-2">
                  {report.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {report.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={report.status} size="xs" />
                <span className="text-[10px] text-slate-400">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-civic-200 bg-civic-50/70 p-8 sm:p-12 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Help improve your neighbourhood today.
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Join citizens and municipal officers working together to make Indian cities cleaner, safer, and better maintained.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/report' : '/register'}
              className="inline-flex items-center gap-2 rounded-xl bg-civic-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-civic-600/20 hover:bg-civic-700 transition"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
