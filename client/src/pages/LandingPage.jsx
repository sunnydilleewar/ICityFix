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
  Bell,
  Fish,
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
    <div className="space-y-20 pb-20 text-white">
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-10 sm:pb-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(49,179,166,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(84,125,230,0.18),_transparent_20%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#071b1e] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-7">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,21,0.18),rgba(6,18,21,0.45)),url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-80" />
              <div className="relative z-10 flex h-full min-h-[650px] flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0d2428]/60 px-3 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[#4de0a8]" />
                    Live urban intelligence
                  </div>
                  <button className="rounded-full border border-white/10 bg-[#0d2428]/60 p-2 text-slate-200 backdrop-blur">
                    <Bell className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#4de0a8]/20 bg-[#0d2428]/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bfeee0] backdrop-blur">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#4de0a8]" />
                    iCityFix
                  </div>

                  <div className="max-w-lg space-y-4">
                    <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-5xl lg:text-[4rem]">
                      Real Issues.
                      <span className="mt-1 block text-[#d7fff5]">Real People.</span>
                      <span className="mt-1 block text-[#7fe0d2]">Better Cities.</span>
                    </h1>
                    <p className="max-w-md text-base text-slate-200">
                      iCityFix helps residents report problems, track progress, and empower smarter urban action across every neighborhood.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to={isAuthenticated ? (isAdmin ? '/admin' : '/report') : '/register'}
                      className="premium-button px-5 py-3 text-sm"
                    >
                      Report an Issue
                    </Link>
                    <Link
                      to={isAuthenticated ? '/dashboard' : '/login'}
                      className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Explore Map
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-[22px] border border-white/10 bg-[#0b2125]/75 p-3 backdrop-blur">
                  {[
                    ['12,458', 'Total Reports'],
                    ['8,932', 'Resolved'],
                    ['24', 'Active Hotspots'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-3 text-center">
                      <p className="text-xl font-black tracking-[-0.04em] text-white">{value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-300">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[30px] border border-white/10 bg-[#0b2125] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Good morning</p>
                    <h2 className="mt-1 text-2xl font-bold text-white">Aarav</h2>
                  </div>
                  <div className="rounded-full border border-[#4de0a8]/20 bg-[#113537] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9fe7d7]">
                    Online
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Issues</p>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-3xl font-black text-white">420</span>
                      <span className="rounded-full bg-[#1b3a3d] px-2 py-1 text-[10px] font-bold text-[#9fe7d7]">+8.4%</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Resolved</p>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-3xl font-black text-white">3.4K</span>
                      <span className="rounded-full bg-[#1b3a3d] px-2 py-1 text-[10px] font-bold text-[#9fe7d7]">+12%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/8 bg-[#0f1d22] p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>City coverage</span>
                    <span className="font-semibold text-[#9fe7d7]">76%</span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#183337]">
                    <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[#4cc4b0] to-[#5cb3ff]" />
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#e9f1ee] p-4 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Nearby Issue</p>
                    <h3 className="mt-1 text-xl font-black">Pothole</h3>
                  </div>
                  <span className="rounded-full bg-[#d9f5eb] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#116a58]">
                    High
                  </span>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80"
                    alt="Pothole report"
                    className="h-40 w-full object-cover"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="rounded-xl bg-slate-100 p-2">Ward 12</div>
                  <div className="rounded-xl bg-slate-100 p-2">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-[#0b2125] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Explore City</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">Live civic map</h2>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full border border-white/10 bg-[#101e22] px-3 py-2 text-xs font-semibold text-slate-200">Filters</button>
              <button className="rounded-full bg-[#2b8d77] px-3 py-2 text-xs font-semibold text-white">View all</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_1fr]">
            <div className="rounded-[26px] border border-white/10 bg-[#0d272b] p-4 text-slate-200">
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#112a2b] px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value="Search location or area"
                  readOnly
                  className="w-full bg-transparent text-sm text-slate-300 outline-none"
                />
              </div>

              <div className="space-y-3">
                {['Roads', 'Potholes', 'Streetlights', 'Water', 'Sanitation'].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ['#4de0a8', '#fb7185', '#fbbf24', '#60a5fa', '#a78bfa'][index] }} />
                      <span className="text-sm">{item}</span>
                    </div>
                    <span className="text-xs text-slate-400">{[84, 86, 127, 62, 43][index]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#0d272b] p-3">
              <div className="relative h-[420px] overflow-hidden rounded-[20px] bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(9,20,24,0.15),_rgba(9,20,24,0.6))]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#0a2024]/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                  12 active hotspots
                </div>
                {["80%", "62%", "38%", "74%", "52%", "88%", "45%"].map((size, idx) => (
                  <div
                    key={size}
                    className="absolute rounded-full border border-white/30 bg-[#5cc8ad]/35"
                    style={{
                      left: `${10 + idx * 12}%`,
                      top: `${15 + (idx % 3) * 24}%`,
                      width: size,
                      height: size,
                    }}
                  />
                ))}
                {[{x: '22%', y: '32%'}, {x: '48%', y: '48%'}, {x: '60%', y: '22%'}, {x: '72%', y: '64%'}, {x: '34%', y: '72%'}].map((p, idx) => (
                  <div
                    key={idx}
                    className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[8px] font-black text-white shadow-lg"
                    style={{
                      left: p.x,
                      top: p.y,
                      backgroundColor: ['#4de0a8', '#fbbf24', '#fb7185', '#60a5fa', '#a78bfa'][idx],
                    }}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'AI Duplicate Detection',
              copy: 'Find repeated issues automatically using geospatial context and confidence scoring.',
              Icon: Compass,
            },
            {
              title: 'Ward-wise Dispatch',
              copy: 'Route complaints to the right teams with transparent ownership and status updates.',
              Icon: Building2,
            },
            {
              title: 'Real-Time Visibility',
              copy: 'Track each issue from report to resolution with clear accountability.',
              Icon: Layers,
            },
            {
              title: 'Citizen Participation',
              copy: 'Enable residents to validate urgency, collaborate, and improve neighborhood outcomes.',
              Icon: Users,
            },
          ].map(({ title, copy, Icon }) => (
            <div key={title} className="rounded-[26px] border border-white/10 bg-[#0b2125] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123339] text-[#7fe0d2]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="live-feed" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Recent reports</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">Municipal resolution feed</h2>
          </div>
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="text-sm font-semibold text-[#8fe7d7] hover:text-white">
            View all municipal issues
            <ExternalLink className="ml-2 inline h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sampleReports.map((report) => (
            <div key={report.reportId} className="rounded-[26px] border border-white/10 bg-[#0b2125] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.16)]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold tracking-[0.08em] text-[#8fe7d7]">{report.reportId}</span>
                <PriorityBadge priority={report.priority} />
              </div>
              <h4 className="mt-3 text-base font-bold text-white">{report.title}</h4>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{report.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                <StatusBadge status={report.status} size="xs" />
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[#275c62] bg-gradient-to-r from-[#152f32] via-[#0c2227] to-[#102330] p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.28)] sm:p-12">
          <h2 className="text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
            Help improve your neighborhood today.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-300">
            Join residents and municipal teams building safer, cleaner, and more responsive cities.
          </p>
          <div className="mt-8">
            <Link
              to={isAuthenticated ? '/report' : '/register'}
              className="premium-button px-7 py-3.5 text-base"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

