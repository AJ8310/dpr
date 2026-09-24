'use client';

import React, { useState } from 'react';

interface ValidationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationData: any;
  submissionPackData?: any;
  onConfirmGeneratePack: () => void;
  isGeneratingPack?: boolean;
}

export default function ValidationReportModal({
  isOpen,
  onClose,
  validationData,
  submissionPackData,
  onConfirmGeneratePack,
  isGeneratingPack = false
}: ValidationReportModalProps) {
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState<Record<string, boolean>>({});

  if (!isOpen || !validationData) return null;

  const hardBlocks = validationData.hard_blocks || [];
  const warnings = validationData.warnings || [];
  const infoHints = validationData.info_hints || [];
  const canGenerate = validationData.can_generate;

  const handleCheckboxChange = (code: string) => {
    setAcknowledgedWarnings((prev) => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const allWarningsAcknowledged = warnings
    .filter((w: any) => w.requires_acknowledgement)
    .every((w: any) => acknowledgedWarnings[w.code]);

  const allowProceed = canGenerate && allWarningsAcknowledged;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              PMMY Credit Assessment & Validation Report
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-1">
              {validationData.category_label || 'MUDRA DPR Readiness Audit'}
            </h3>
            <p className="text-xs text-slate-500">
              Guideline Depth: <span className="font-semibold text-slate-700">{validationData.page_guideline || 'Standard'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-light focus:outline-none"
          >
            &times;
          </button>
        </div>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">

          {/* Hard Blockers Section */}
          {hardBlocks.length > 0 && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
              <h4 className="text-sm font-bold text-red-800 flex items-center gap-2">
                <span>⛔</span> Hard Blockers ({hardBlocks.length}) — Action Required
              </h4>
              <ul className="mt-2 space-y-2 text-xs text-red-700">
                {hardBlocks.map((item: any, idx: number) => (
                  <li key={idx} className="bg-white/80 p-2.5 rounded-lg border border-red-200">
                    <span className="font-semibold">{item.code}:</span> {item.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings Section */}
          {warnings.length > 0 && (
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
              <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                <span>⚠️</span> Warnings & Policy Acknowledgements ({warnings.length})
              </h4>
              <div className="mt-2 space-y-2 text-xs text-amber-900">
                {warnings.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                    <p className="mb-1"><span className="font-semibold">{item.code}:</span> {item.message}</p>
                    {item.requires_acknowledgement && (
                      <label className="flex items-center gap-2 mt-2 cursor-pointer font-medium text-amber-950">
                        <input
                          type="checkbox"
                          checked={!!acknowledgedWarnings[item.code]}
                          onChange={() => handleCheckboxChange(item.code)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        I acknowledge this growth/policy assumption for the DPR.
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Hints Section */}
          {infoHints.length > 0 && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
              <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <span>💡</span> Bank Appraisal Recommendations ({infoHints.length})
              </h4>
              <ul className="mt-2 space-y-1.5 text-xs text-blue-800">
                {infoHints.map((item: any, idx: number) => (
                  <li key={idx} className="bg-white/80 p-2 rounded-lg border border-blue-200">
                    {item.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clean Validation State */}
          {hardBlocks.length === 0 && warnings.length === 0 && (
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl text-emerald-800">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span>✅</span> All Validation Checks Passed!
              </h4>
              <p className="text-xs mt-1 text-emerald-700">
                Project cost reconciles, MUDRA category rules match, and financial ratios meet VKF appraisal benchmarks.
              </p>
            </div>
          )}

          {/* Bank Submission Pack Preview */}
          {submissionPackData && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-blue-400">
                  📦 Bank Submission Pack Ready ({submissionPackData.submission_pack_id})
                </h4>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  11-Part Application Pack
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <p><span className="text-slate-400">Lending Institution:</span> {submissionPackData.bank_name}</p>
                <p><span className="text-slate-400">VKF Readiness Score:</span> <span className="text-emerald-400 font-bold">{submissionPackData.vkf_scorecard?.overall_readiness_score}</span></p>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-lg max-h-32 overflow-y-auto text-[11px] font-mono text-slate-300 whitespace-pre-wrap border border-slate-700">
                {submissionPackData.cover_letter}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close & Edit Details
          </button>

          {!submissionPackData ? (
            <button
              onClick={onConfirmGeneratePack}
              disabled={!allowProceed || isGeneratingPack}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${
                allowProceed && !isGeneratingPack
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isGeneratingPack ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Assembling Bank Pack...
                </>
              ) : (
                <>Generate Bank Submission Pack & DPR &rarr;</>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/25 transition-all"
            >
              Download Submission Pack (PDF)
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
