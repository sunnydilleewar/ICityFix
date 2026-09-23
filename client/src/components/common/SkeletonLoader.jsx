import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
      <div className="flex justify-between items-center">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-9 w-9 rounded-lg bg-slate-200" />
      </div>
      <div className="mt-4 h-8 w-16 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50/75 px-6 py-3.5">
        <div className="h-4 w-48 rounded bg-slate-200" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-4 w-48 flex-1 rounded bg-slate-200" />
            <div className="h-5 w-24 rounded-full bg-slate-200" />
            <div className="h-5 w-16 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex gap-2">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-full rounded bg-slate-100" />
      <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />
      <div className="mt-4 flex justify-between">
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="h-3 w-16 rounded bg-slate-200" />
      </div>
    </div>
  );
}
