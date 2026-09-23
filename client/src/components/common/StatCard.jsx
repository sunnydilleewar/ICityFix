import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  className = '',
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const iconStyles = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-subtle transition-all duration-200 hover:shadow-card ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg border p-2.5 ${iconStyles}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {typeof value === 'number' ? value.toLocaleString() : value ?? 0}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{subtitle}</p>
      )}
    </div>
  );
}
