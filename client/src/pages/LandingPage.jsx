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
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-civic-300/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-civic-200 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-3.5 py-2 text-xs font-semibold text-civic-800 shadow-[0_12px_30px_rgba(14,141,233,0.10)] backdrop-blur-xl">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.7)]" />
                Next-Gen Civic Intelligence for Indian Cities
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black leading-[1.04] tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
                  Build a smarter city,{' '}
                  <span className="bg-gradient-to-r from-civic-600 via-sky-500 to-violet-500 bg-clip-text text-transparent">
                    one issue at a time.
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Report civic issues, track real-time resolution progress, and equip municipal teams with spatial intelligence for faster, fairer action.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={isAuthenticated ? (isAdmin ? '/admin' : '/report') : '/register'}
                  className="premium-button px-6 py-3.5 text-base"
                >
                  Report an Issue
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#live-feed"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900"
                >
                  Explore Civic Issues
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4">
                {[
                  ['Location-Aware', '2dsphere GIS'],
                  ['Duplicate Check', 'Advisory AI'],
                  ['Live Progress', 'Audit Trail'],
                  ['Municipal Ops', 'Role Workflow'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/70 bg-white/55 p-3.5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="premium-card relative overflow-hidden rounded-[30px] p-4">
                <div className="mb-4 flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Live telemetry
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
                    alt="City GIS Infrastructure"
                    className="h-72 w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" />

                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-2xl border border-white/30 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-md">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Indiranagar: Pothole In Progress
                  </div>

                  <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-2xl border border-white/30 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur-md">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    HAL 2nd Stage: Streetlight Resolved
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3.5 text-xs font-medium text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>Duplicate detection window</span>
                    <span className="rounded-full bg-civic-100 px-2.5 py-1 font-bold text-civic-800">600m geospatial radius</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-civic-600">Workflow architecture</span>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
            From civic report to on-site resolution
          </h2>
          <p className="text-base text-slate-600">
            A transparent four-stage lifecycle connecting citizens with municipal teams.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['01', 'Report', 'Citizens select categories, attach clear photos, and share context in under two minutes.'],
            ['02', 'Locate', 'Interactive mapping captures exact GPS coordinates for automatic ward routing and dispatch.'],
            ['03', 'Track', 'A transparent status timeline shows who is assigned, what stage is active, and what’s next.'],
            ['04', 'Resolve', 'Field teams complete repairs, validate changes, and close the feedback loop with the public.'],
          ].map(([step, title, copy]) => (
            <div key={step} className="premium-card rounded-[26px] p-6">
              <span className="font-mono text-2xl font-black tracking-tight text-civic-600">{step}</span>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-civic-600">Administrative domains</span>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">Civic categories covered</h2>
          <p className="text-base text-slate-600">
            Standardized issue types aligned with municipal operations and engineering teams.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(CATEGORY_INFO).map(([key, info]) => {
            const IconComponent = info.icon;
            return (
              <div
                key={key}
                className="group rounded-[24px] border border-white/70 bg-white/60 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.04)] backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(14,141,233,0.10)]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/80 transition group-hover:scale-105"
                  style={{ color: info.color }}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-base font-bold text-slate-900">{info.label}</h4>
                <p className="mt-1 text-xs font-medium text-slate-400">Field dispatch ready</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950 p-8 text-white shadow-[0_35px_80px_rgba(15,23,42,0.35)] sm:p-10 lg:p-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-civic-400">System capabilities</span>
            <h2 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">Enterprise municipal technology</h2>
            <p className="text-base text-slate-300">
              Engineered to manage dense civic data, fast routing, and transparent operational workflows.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Location-Aware Duplicate Detection',
                copy: 'MongoDB geospatial queries identify reports within 500m without blocking submissions.',
                Icon: Compass,
                colorClass: 'text-civic-400',
              },
              {
                title: 'Municipal Workflow Triage',
                copy: 'Role-based transitions, assignment logic, and internal audit notes keep everything accountable.',
                Icon: Building2,
                colorClass: 'text-emerald-400',
              },
              {
                title: 'GIS Map Visualizer',
                copy: 'Interactive OpenStreetMap views reveal clusters, priorities, and status changes in real time.',
                Icon: Layers,
                colorClass: 'text-amber-400',
              },
              {
                title: 'Democratic Civic Feedback',
                copy: 'Citizen upvotes help elevate urgent neighborhood issues and guide municipal prioritization.',
                Icon: Users,
                colorClass: 'text-violet-400',
              },
            ].map(({ title, copy, Icon, colorClass }) => (
              <div key={title} className="rounded-[22px] border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800">
                  <Icon className={`h-5 w-5 ${colorClass}`} />
                </div>
                <h4 className="mt-4 text-lg font-bold text-white">{title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="live-feed" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-civic-600">Real-time feed</span>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-900">Recent municipal dispatches</h2>
          </div>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-civic-700 hover:text-civic-800"
          >
            View all municipal issues
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sampleReports.map((report) => (
            <div
              key={report.reportId}
              className="premium-card flex min-h-[210px] flex-col justify-between rounded-[26px] p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold tracking-[0.08em] text-civic-700">{report.reportId}</span>
                  <PriorityBadge priority={report.priority} />
                </div>
                <h4 className="mt-3 text-base font-bold text-slate-900">{report.title}</h4>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{report.description}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3">
                <StatusBadge status={report.status} size="xs" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-[32px] border border-civic-200/80 bg-gradient-to-r from-civic-50 via-white to-violet-50 p-8 shadow-[0_25px_60px_rgba(14,141,233,0.12)] sm:p-12">
          <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
            Help improve your neighborhood today.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-600">
            Join citizens and municipal officers working together to make Indian cities cleaner, safer, and more responsive.
          </p>
          <div className="mt-8">
            <Link
              to={isAuthenticated ? '/report' : '/register'}
              className="premium-button px-7 py-3.5 text-base"
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
