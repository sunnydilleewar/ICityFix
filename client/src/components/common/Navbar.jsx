import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Bell,
  PlusCircle,
  MapPin,
  BarChart3,
  ListFilter,
  User,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleQuickSwitch = async (role) => {
    await quickDemoLogin(role);
    setProfileDropdownOpen(false);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/55 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 rounded-full border border-white/40 bg-white/35 px-2.5 py-1.5 shadow-sm backdrop-blur">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-civic-600 via-civic-500 to-violet-500 shadow-lg shadow-civic-500/25">
            <img src="/logo.svg" alt="iCityFix logo" className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-[-0.04em] text-slate-900">
                iCity<span className="bg-gradient-to-r from-civic-600 to-violet-500 bg-clip-text text-transparent">Fix</span>
              </span>
              {isAdmin && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-700">
                  Ops
                </span>
              )}
            </div>
            <p className="hidden text-[10px] font-medium tracking-[0.12em] text-slate-500 uppercase sm:block">
              Civic Intelligence
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            isAdmin ? (
              // Admin Links
              <>
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive('/admin')
                      ? 'bg-civic-50 text-civic-700 ring-1 ring-civic-100 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Operations
                </Link>
                <Link
                  to="/admin/reports"
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive('/admin/reports')
                      ? 'bg-civic-50 text-civic-700 ring-1 ring-civic-100 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <ListFilter className="h-4 w-4" />
                  Queue
                </Link>
                <Link
                  to="/admin/map"
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive('/admin/map')
                      ? 'bg-civic-50 text-civic-700 ring-1 ring-civic-100 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  GIS Map
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive('/admin/analytics')
                      ? 'bg-civic-50 text-civic-700 ring-1 ring-civic-100 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </>
            ) : (
              // Citizen Links
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'bg-civic-50 text-civic-700 ring-1 ring-civic-100 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to="/my-reports"
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive('/my-reports')
                      ? 'bg-civic-50 text-civic-700 ring-1 ring-civic-100 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <ListFilter className="h-4 w-4" />
                  My Reports
                </Link>
                <Link
                  to="/nearby"
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive('/nearby')
                      ? 'bg-civic-50 text-civic-700 ring-1 ring-civic-100 shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  Nearby Issues
                </Link>
              </>
            )
          ) : (
            // Public Links
            <>
              <a
                href="#features"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Capabilities
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                How It Works
              </a>
              <a
                href="#categories"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Civic Categories
              </a>
            </>
          )}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              {/* Report Issue Button (for Citizens or Admin) */}
              {!isAdmin && (
                <Link
                  to="/report"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-civic-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-civic-700 active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" />
                  Report Issue
                </Link>
              )}

              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-50">
                    <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-medium text-civic-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 py-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              if (!n.read) markAsRead(n._id);
                              if (n.reportId) {
                                setNotificationsOpen(false);
                                navigate(isAdmin ? `/admin/reports/${n.reportId}` : `/reports/${n.reportId}`);
                              }
                            }}
                            className={`cursor-pointer rounded-lg p-2.5 transition-colors ${
                              n.read ? 'hover:bg-slate-50 opacity-75' : 'bg-blue-50/60 hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {new Date(n.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile & Demo Switcher Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-sm transition hover:bg-slate-100"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-civic-600 text-xs font-bold text-white uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium text-slate-800 text-xs max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            isAdmin
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {user?.role}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {isAdmin ? user?.department : user?.ward}
                        </span>
                      </div>
                    </div>

                    {/* Quick Demo Switcher for Hackathon Judges */}
                    <div className="border-b border-slate-100 px-2 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
                        Demo Role Switcher
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleQuickSwitch('CITIZEN')}
                          className={`flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
                            !isAdmin
                              ? 'bg-civic-100 text-civic-800 font-semibold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Citizen
                        </button>
                        <button
                          onClick={() => handleQuickSwitch('ADMIN')}
                          className={`flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition ${
                            isAdmin
                              ? 'bg-purple-100 text-purple-800 font-semibold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Unauthenticated
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-slate-200/80 bg-white/60 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-900"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="premium-button px-4 py-2.5 text-sm"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-2">
          {isAuthenticated ? (
            isAdmin ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LayoutDashboard className="h-4 w-4 text-civic-600" />
                  Operations Overview
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <ListFilter className="h-4 w-4 text-civic-600" />
                  Reports Queue
                </Link>
                <Link
                  to="/admin/map"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <MapPin className="h-4 w-4 text-civic-600" />
                  GIS Map
                </Link>
                <Link
                  to="/admin/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <BarChart3 className="h-4 w-4 text-civic-600" />
                  Analytics
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LayoutDashboard className="h-4 w-4 text-civic-600" />
                  Citizen Dashboard
                </Link>
                <Link
                  to="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <PlusCircle className="h-4 w-4 text-civic-600" />
                  Report New Issue
                </Link>
                <Link
                  to="/my-reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <ListFilter className="h-4 w-4 text-civic-600" />
                  My Reports
                </Link>
                <Link
                  to="/nearby"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <MapPin className="h-4 w-4 text-civic-600" />
                  Nearby Issues
                </Link>
              </>
            )
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-civic-600 hover:bg-slate-100"
              >
                Register Citizen Account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
