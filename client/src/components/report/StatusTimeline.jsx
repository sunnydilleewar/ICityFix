import React from 'react';
import {
  FileText,
  Search,
  Users,
  Wrench,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { key: 'REPORTED', label: 'Reported', icon: FileText },
  { key: 'UNDER_REVIEW', label: 'Under Review', icon: Search },
  { key: 'ASSIGNED', label: 'Assigned', icon: Users },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Wrench },
  { key: 'RESOLVED', label: 'Resolved', icon: CheckCircle2 },
];

export default function StatusTimeline({ currentStatus, history = [] }) {
  const currentStepIndex = WORKFLOW_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-6">
      {/* Workflow Horizontal Progress Bar */}
      <div className="relative">
        <div className="hidden sm:flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex-1 text-center relative">
                {idx > 0 && (
                  <div
                    className={`absolute top-4 -left-1/2 w-full h-0.5 -z-0 transition-colors ${
                      isCompleted ? 'bg-civic-600' : 'bg-slate-200'
                    }`}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      isCurrent
                        ? 'border-civic-600 bg-civic-600 text-white shadow-md ring-4 ring-civic-100'
                        : isCompleted
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      isCurrent
                        ? 'text-civic-700'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit History Log */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-slate-500" />
          Audit Trail & Operational Log
        </h4>

        {history && history.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {history.map((entry, index) => (
              <div key={index} className="relative group">
                <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-civic-600 shadow-sm" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {entry.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(entry.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {entry.note || 'Status updated.'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Logged by: <strong className="text-slate-700 font-medium">{entry.changedByName || 'System'}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No status changes recorded yet.</p>
        )}
      </div>
    </div>
  );
}
