import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toast, clearToast } = useNotifications();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800',
    error: 'bg-white border-red-200 text-slate-800',
    info: 'bg-white border-blue-200 text-slate-800',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-md animate-slide-up items-center gap-3 rounded-xl border p-4 shadow-xl shadow-slate-900/10">
      <div className="flex-shrink-0">{icons[toast.type] || icons.info}</div>
      <div className="text-sm font-medium text-slate-800 flex-1">
        {toast.message}
      </div>
      <button
        onClick={clearToast}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
