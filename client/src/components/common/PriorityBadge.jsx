import React from 'react';
import { AlertTriangle } from 'lucide-react';

const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  HIGH: {
    label: 'High',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  URGENT: {
    label: 'Urgent',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    isUrgent: true,
  },
};

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}
    >
      {config.isUrgent && <AlertTriangle className="h-3 w-3 text-red-600 animate-pulse" />}
      {config.label}
    </span>
  );
}
