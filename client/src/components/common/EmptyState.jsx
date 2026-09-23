import React from 'react';
import { Inbox, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No reports found',
  description = 'There are currently no civic records matching your criteria.',
  icon: Icon = Inbox,
  actionText,
  actionLink,
  onActionClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {(actionText && (actionLink || onActionClick)) && (
        <div className="mt-5">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center justify-center rounded-lg bg-civic-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-civic-700"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center justify-center rounded-lg bg-civic-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-civic-700"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
