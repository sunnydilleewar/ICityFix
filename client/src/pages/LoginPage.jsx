import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/dashboard' : from);
      }
    } else {
      setError(result.message || 'Invalid email or password');
    }
  };

  const handleQuickFill = async (role) => {
    setError('');
    setLoading(true);
    const result = await quickDemoLogin(role);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message || 'Quick demo login failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-civic-600 text-white shadow-md shadow-civic-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 pt-2">
            Sign In to iCityFix
          </h2>
          <p className="text-xs text-slate-500">
            Access citizen reporting or municipal operations management
          </p>
        </div>

        {/* Demo Quick-Fill Buttons for Hackathon Judges */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
              Evaluator / Judge Quick Access
            </span>
            <span className="rounded bg-blue-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">
              Instant Fill
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('CITIZEN')}
              disabled={loading}
              className="flex flex-col items-start rounded-xl border border-blue-200 bg-white p-2.5 text-left transition hover:border-blue-400 hover:shadow-sm"
            >
              <span className="text-xs font-bold text-slate-900">Citizen Demo</span>
              <span className="text-[10px] text-slate-500">citizen@icityfix.local</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ADMIN')}
              disabled={loading}
              className="flex flex-col items-start rounded-xl border border-purple-200 bg-white p-2.5 text-left transition hover:border-purple-400 hover:shadow-sm"
            >
              <span className="text-xs font-bold text-purple-900">Municipal Admin</span>
              <span className="text-[10px] text-slate-500">admin@icityfix.local</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@icityfix.local"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-civic-600 focus:outline-none focus:ring-2 focus:ring-civic-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-civic-600 focus:outline-none focus:ring-2 focus:ring-civic-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-civic-600 py-3 text-sm font-semibold text-white shadow-md shadow-civic-600/20 hover:bg-civic-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-civic-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
