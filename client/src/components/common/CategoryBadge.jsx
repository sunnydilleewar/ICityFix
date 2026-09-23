import React from 'react';
import {
  AlertOctagon,
  Lightbulb,
  Trash2,
  Droplets,
  Building2,
  Sparkles,
  Navigation,
  HelpCircle,
} from 'lucide-react';

export const CATEGORY_INFO = {
  ROADS_POTHOLES: {
    label: 'Roads & Potholes',
    shortLabel: 'Roads',
    icon: AlertOctagon,
    color: '#D97706', // amber-600
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    dotBg: 'bg-amber-500',
  },
  STREETLIGHTS: {
    label: 'Streetlights & Electrical',
    shortLabel: 'Streetlights',
    icon: Lightbulb,
    color: '#EAB308', // yellow-500
    badgeBg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    dotBg: 'bg-yellow-500',
  },
  WASTE_MANAGEMENT: {
    label: 'Waste Management',
    shortLabel: 'Waste',
    icon: Trash2,
    color: '#059669', // emerald-600
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotBg: 'bg-emerald-500',
  },
  WATER_DRAINAGE: {
    label: 'Water & Drainage',
    shortLabel: 'Water',
    icon: Droplets,
    color: '#0284C7', // sky-600
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    dotBg: 'bg-sky-500',
  },
  PUBLIC_INFRASTRUCTURE: {
    label: 'Public Infrastructure',
    shortLabel: 'Infrastructure',
    icon: Building2,
    color: '#6366F1', // indigo-500
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    dotBg: 'bg-indigo-500',
  },
  SANITATION: {
    label: 'Public Sanitation',
    shortLabel: 'Sanitation',
    icon: Sparkles,
    color: '#0D9488', // teal-600
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    dotBg: 'bg-teal-500',
  },
  TRAFFIC_SIGNALS: {
    label: 'Traffic & Signals',
    shortLabel: 'Traffic',
    icon: Navigation,
    color: '#EF4444', // red-500
    badgeBg: 'bg-red-50 text-red-800 border-red-200',
    dotBg: 'bg-red-500',
  },
  OTHER: {
    label: 'Other Civic Issue',
    shortLabel: 'Other',
    icon: HelpCircle,
    color: '#64748B', // slate-500
    badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
    dotBg: 'bg-slate-500',
  },
};

export default function CategoryBadge({ category, short = false }) {
  const info = CATEGORY_INFO[category] || CATEGORY_INFO.OTHER;
  const IconComponent = info.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium ${info.badgeBg}`}
    >
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{short ? info.shortLabel : info.label}</span>
    </span>
  );
}
