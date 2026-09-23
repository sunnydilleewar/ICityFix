import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useNotifications } from '../../context/NotificationContext';
import CivicMapPicker from '../map/CivicMapPicker';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import {
  CATEGORY_INFO,
} from '../common/CategoryBadge';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  X,
  MapPin,
  Sparkles,
  Loader2,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Category', description: 'Type of civic issue' },
  { id: 2, name: 'Details', description: 'Describe the problem' },
  { id: 3, name: 'Evidence', description: 'Photos & visual proof' },
  { id: 4, name: 'Location', description: 'Pin on municipal map' },
  { id: 5, name: 'Duplicate Check', description: 'Advisory nearby detection' },
  { id: 6, name: 'Review', description: 'Confirm report data' },
  { id: 7, name: 'Submitted', description: 'Official municipal receipt' },
];

export default function ReportWizard() {
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: 'ROADS_POTHOLES',
    title: '',
    description: '',
    priority: 'MEDIUM',
    images: [],
    coordinates: [77.6412, 12.9716], // [lng, lat]
    address: 'CMH Road, Indiranagar, Bengaluru, Karnataka',
    ward: 'Ward 112 - Domlur',
  });

  // State for AI assistance
  const [isSuggestingAI, setIsSuggestingAI] = useState(false);
  const [aiSuggestionResult, setAiSuggestionResult] = useState(null);

  // State for duplicate detection
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState([]);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto check duplicates when reaching Step 5
  useEffect(() => {
    if (currentStep === 5) {
      checkNearbyDuplicates();
    }
  }, [currentStep]);

  const handleCategorySelect = (catKey) => {
    setFormData((prev) => ({ ...prev, category: catKey }));
  };

  const handleTriggerAI = async () => {
    if (!formData.description && !formData.title) {
      showToast('Please enter a brief description first to use AI classification assistance.', 'info');
      return;
    }

    setIsSuggestingAI(true);
    try {
      const res = await axiosClient.post('/ai/suggest-category', {
        description: `${formData.title} ${formData.description}`,
      });

      if (res.success && res.data.available && res.data.suggestedCategory) {
        setAiSuggestionResult(res.data);
        setFormData((prev) => ({ ...prev, category: res.data.suggestedCategory }));
        showToast(`AI classified as: ${CATEGORY_INFO[res.data.suggestedCategory]?.label}`, 'success');
      } else {
        setAiSuggestionResult(res.data);
      }
    } catch (err) {
      console.warn('AI assistance unavailable:', err.message);
    } finally {
      setIsSuggestingAI(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    setUploadError('');

    const uploadPayload = new FormData();
    files.slice(0, 4).forEach((file) => {
      uploadPayload.append('images', file);
    });

    try {
      const res = await axiosClient.post('/uploads', uploadPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data].slice(0, 4),
        }));
        showToast('Evidence photos uploaded successfully.', 'success');
      }
    } catch (err) {
      setUploadError(err.message || 'Image upload failed. Allowed: JPG, PNG, WEBP max 5MB.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const checkNearbyDuplicates = async () => {
    setIsCheckingDuplicates(true);
    try {
      const [lng, lat] = formData.coordinates;
      const res = await axiosClient.get('/reports/duplicates', {
        params: {
          lng,
          lat,
          category: formData.category,
          maxDistance: 600, // 600m radius
        },
      });

      if (res.success) {
        setPotentialDuplicates(res.data || []);
      }
    } catch (err) {
      console.warn('Duplicate query error:', err.message);
      setPotentialDuplicates([]);
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        coordinates: formData.coordinates,
        address: formData.address,
        ward: formData.ward,
        priority: formData.priority,
        images: formData.images,
      };

      const res = await axiosClient.post('/reports', payload);
      if (res.success && res.data) {
        setCreatedReport(res.data);
        setCurrentStep(7);
        showToast(`Report ${res.data.reportId} registered with Municipal Operations!`, 'success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed. Please check form details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!formData.category;
    if (currentStep === 2) return formData.title.trim().length >= 5 && formData.description.trim().length >= 10;
    if (currentStep === 3) return true; // Evidence is optional but encouraged
    if (currentStep === 4) return formData.coordinates && formData.coordinates.length === 2;
    if (currentStep === 5) return true; // Duplicate detection is advisory and non-blocking!
    if (currentStep === 6) return true;
    return false;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Wizard Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-4 pt-2">
          {STEPS.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div
                key={step.id}
                className="flex items-center gap-2 flex-shrink-0 cursor-default px-2"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-civic-600 text-white ring-4 ring-civic-100 shadow'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-civic-700' : isDone ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {step.id < STEPS.length && (
                  <div className="hidden md:block h-0.5 w-6 bg-slate-200 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        {/* STEP 1: CATEGORY SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Select Civic Issue Category
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose the primary classification for accurate routing to the responsible municipal department.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const IconComp = info.icon;
                const isSelected = formData.category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCategorySelect(key)}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-civic-600 bg-civic-50/60 ring-2 ring-civic-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm"
                      style={{ color: info.color }}
                    >
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="mt-3 font-semibold text-xs text-slate-900">
                      {info.label}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Municipal department ticket
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Report Description & Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Provide concise, actionable details so municipal field engineers can locate and address the issue.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Severe crater pothole near metro station exit"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-civic-600 focus:outline-none focus:ring-2 focus:ring-civic-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Comprehensive Description <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleTriggerAI}
                    disabled={isSuggestingAI}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-civic-600 hover:text-civic-800 disabled:opacity-50"
                  >
                    {isSuggestingAI ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 text-amber-500" />
                    )}
                    AI Category Assist
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the hazard, exact street landmark, potential public risk, and how long it has been observed..."
                  className="mt-1.5 w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-civic-600 focus:outline-none focus:ring-2 focus:ring-civic-100"
                />
                {aiSuggestionResult && (
                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    {aiSuggestionResult.note || aiSuggestionResult.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Assessed Urgency Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-civic-600 focus:outline-none"
                  >
                    <option value="LOW">Low (Minor cosmetic issue)</option>
                    <option value="MEDIUM">Medium (Standard civic maintenance)</option>
                    <option value="HIGH">High (Active disruption / hazard)</option>
                    <option value="URGENT">Urgent (Severe public safety risk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Municipal Ward / Zone
                  </label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="e.g. Ward 112 - Domlur"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-civic-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: EVIDENCE PHOTOS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Upload Photo Evidence
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Visual proof substantially increases resolution speed by allowing field teams to bring appropriate equipment.
              </p>
            </div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-civic-400 transition bg-slate-50/50">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
              <div className="mt-3">
                <label className="cursor-pointer font-semibold text-sm text-civic-600 hover:text-civic-700">
                  <span>Select photos from device</span>
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileUpload}
                    className="sr-only"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP up to 5MB (max 4 images)</p>
              </div>
              {isUploading && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-civic-600" />
                  Uploading and processing evidence...
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {uploadError}
              </p>
            )}

            {formData.images.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Uploaded Evidence ({formData.images.length}/4)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="group relative h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={imgUrl}
                        alt={`Evidence ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white transition opacity-0 group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: GEOLOCATION / MAP PIN */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Pin Location on Municipal Map
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Accurate geospatial coordinates ensure the report is mapped to the correct administrative ward and field crew.
              </p>
            </div>

            <CivicMapPicker
              initialCoordinates={formData.coordinates}
              onLocationSelect={({ coordinates, address }) => {
                setFormData((prev) => ({
                  ...prev,
                  coordinates,
                  address: address || prev.address,
                }));
              }}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Location / Landmark Reference
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 5: DUPLICATE DETECTION CHECK (ADVISORY & NON-BLOCKING) */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Advisory Duplicate Detection
                </h2>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  Spatial Intelligence
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                iCityFix scans existing municipal records within a 600-meter radius to prevent duplicate effort.
              </p>
            </div>

            {isCheckingDuplicates ? (
              <div className="py-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-civic-600" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  Scanning MongoDB 2dsphere index for nearby reports...
                </p>
              </div>
            ) : potentialDuplicates.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">
                        {potentialDuplicates.length} Potentially Matching Issue(s) Found Nearby
                      </h4>
                      <p className="mt-1 text-xs text-amber-800">
                        A citizen or field officer has already reported a similar civic issue in this vicinity. 
                        Duplicate detection is <strong>advisory</strong>. If your issue is distinct or a different hazard, you may proceed anyway.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {potentialDuplicates.map((dup) => (
                    <div
                      key={dup.reportId}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-civic-700">
                              {dup.reportId}
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              ~{dup.distanceMeters ?? 'Nearby'}m away
                            </span>
                            <StatusBadge status={dup.status} size="xs" />
                          </div>
                          <h4 className="mt-1.5 text-sm font-semibold text-slate-900">
                            {dup.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {dup.description}
                          </p>
                        </div>
                        {dup.images && dup.images[0] && (
                          <img
                            src={dup.images[0]}
                            alt="Nearby issue"
                            className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <h4 className="mt-2 text-sm font-bold text-emerald-900">
                  No Overlapping Issues Detected
                </h4>
                <p className="mt-1 text-xs text-emerald-700">
                  No active reports in this category were found within 600m. This appears to be a new civic report.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: REVIEW SUMMARY */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Review & Confirm Submission
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Please verify the report details before registering it on the municipal network.
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/40 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Category & Priority
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">
                      {CATEGORY_INFO[formData.category]?.label}
                    </span>
                    <PriorityBadge priority={formData.priority} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ward
                  </span>
                  <p className="mt-1 text-xs font-semibold text-slate-800">{formData.ward}</p>
                </div>
              </div>

              <div className="pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Title
                </span>
                <p className="mt-0.5 text-sm font-bold text-slate-900">{formData.title}</p>
              </div>

              <div className="pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Description
                </span>
                <p className="mt-0.5 text-xs text-slate-700 whitespace-pre-line">
                  {formData.description}
                </p>
              </div>

              <div className="pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Location & Coordinates
                </span>
                <p className="mt-0.5 text-xs font-medium text-slate-800">{formData.address}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  [{formData.coordinates[0].toFixed(5)}, {formData.coordinates[1].toFixed(5)}]
                </p>
              </div>

              {formData.images.length > 0 && (
                <div className="pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Attached Evidence ({formData.images.length})
                  </span>
                  <div className="mt-2 flex gap-2">
                    {formData.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Evidence preview"
                        className="h-14 w-14 rounded-lg object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 7: OFFICIAL RECEIPT / SUCCESS */}
        {currentStep === 7 && createdReport && (
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                Official Municipal Receipt
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                Civic Report Successfully Lodged
              </h2>
              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                Your report has been entered into the municipal operations queue and assigned a tracking identifier.
              </p>
            </div>

            <div className="mx-auto max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Report Tracking ID:</span>
                <span className="font-mono text-base font-bold text-civic-700">
                  {createdReport.reportId}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500">Status:</span>
                <StatusBadge status={createdReport.status} size="xs" />
              </div>
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500">Category:</span>
                <span className="font-medium text-slate-800">
                  {CATEGORY_INFO[createdReport.category]?.label}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={`/reports/${createdReport.reportId}`}
                className="w-full sm:w-auto rounded-xl bg-civic-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-civic-700 transition"
              >
                Track Status Timeline
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        {currentStep < 7 && (
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-civic-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-civic-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 5 && potentialDuplicates.length > 0 ? (
                  <>Proceed & Submit Anyway</>
                ) : (
                  <>Next Step</>
                )}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Lodging Report...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Submit Civic Report
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
