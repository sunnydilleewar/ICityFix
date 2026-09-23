import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CITIZEN',
    ward: 'Ward 112 - Domlur',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-civic-600 text-white shadow-md shadow-civic-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 pt-2">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500">
            Join iCityFix to file reports, track local issues, and assist city crews
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-civic-600 focus:outline-none focus:ring-2 focus:ring-civic-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-civic-600 focus:outline-none focus:ring-2 focus:ring-civic-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-civic-600 focus:outline-none focus:ring-2 focus:ring-civic-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Account Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-civic-600 focus:outline-none"
                >
                  <option value="CITIZEN">Citizen</option>
                  <option value="ADMIN">Municipal Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Ward / Zone
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  placeholder="Ward 112"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-civic-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-civic-600 py-3 text-sm font-semibold text-white shadow-md shadow-civic-600/20 hover:bg-civic-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-civic-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
