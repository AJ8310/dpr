'use client';

import React, { useState } from 'react';

export interface QuestionSchema {
  id?: string;
  key: string;
  label: string;
  description?: string;
  help_text?: string;
  field_type: string;
  data_type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  conditions?: any;
  is_visible?: boolean;
}

interface DynamicQuestionRendererProps {
  questions: QuestionSchema[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  saveState?: 'Saving' | 'Saved' | 'Unsaved Changes' | 'Save Failed';
}

export default function DynamicQuestionRenderer({
  questions,
  values,
  onChange,
  saveState = 'Saved'
}: DynamicQuestionRendererProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const visibleQuestions = questions.filter((q) => q.is_visible !== false);
  const totalQuestions = visibleQuestions.length;

  if (totalQuestions === 0) {
    return null;
  }

  const renderSingleField = (q: QuestionSchema) => {
    const qKey = q.key || q.id || '';
    const val = values[qKey] !== undefined && values[qKey] !== '' ? values[qKey] : ((q as any).default_value ?? '');
    const help = (q as any).help_text || q.description;

    return (
      <div key={qKey} className="field-hover-group">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5 transition-colors duration-200">
          {q.label}
          {q.required && <span className="text-rose-500 ml-1">*</span>}
        </label>

        {help && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{help}</p>
        )}

        {(q.field_type === 'SELECT' || (q as any).type === 'select') ? (
          <select
            value={val}
            onChange={(e) => onChange(qKey, e.target.value)}
            className="input-modern transition-all duration-200 hover:border-teal-500 hover:shadow-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full"
          >
            <option value="">-- Select {q.label} --</option>
            {(q.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (q.field_type === 'TEXTAREA' || (q as any).type === 'textarea') ? (
          <textarea
            rows={3}
            value={val}
            placeholder={q.placeholder || `Enter ${q.label}`}
            onChange={(e) => onChange(qKey, e.target.value)}
            className="input-modern transition-all duration-200 hover:border-teal-500 hover:shadow-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full"
          />
        ) : (q.field_type === 'NUMBER' || q.field_type === 'CURRENCY' || (q as any).type === 'number') ? (
          <input
            type="number"
            value={val}
            placeholder={q.placeholder || '0'}
            onChange={(e) => onChange(qKey, parseFloat(e.target.value) || 0)}
            className="input-modern transition-all duration-200 hover:border-teal-500 hover:shadow-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full"
          />
        ) : (
          <input
            type="text"
            value={val}
            placeholder={q.placeholder || `Enter ${q.label}`}
            onChange={(e) => onChange(qKey, e.target.value)}
            className="input-modern transition-all duration-200 hover:border-teal-500 hover:shadow-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-teal-100 dark:border-gray-800 shadow-sm">
      {/* Header & View Mode Toggle */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-sliders-h text-teal-600"></i> Dynamic Blueprint Questions
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Schema-driven questions resolved dynamically for your sector & project type.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            {showAll ? 'Question-by-Question View' : 'Show All Questions'}
          </button>

          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
            <div
              className={`w-2 h-2 rounded-full ${
                saveState === 'Saving'
                  ? 'bg-amber-500 animate-ping'
                  : saveState === 'Saved'
                  ? 'bg-emerald-500'
                  : saveState === 'Unsaved Changes'
                  ? 'bg-blue-500'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {saveState}
            </span>
          </div>
        </div>
      </div>

      {showAll ? (
        /* SHOW ALL QUESTIONS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {visibleQuestions.map((q) => (
            <div
              key={q.key || q.id}
              className={(q.field_type === 'TEXTAREA' || (q as any).type === 'textarea') ? 'md:col-span-2' : ''}
            >
              {renderSingleField(q)}
            </div>
          ))}
        </div>
      ) : (
        /* PROGRESSIVE SINGLE QUESTION VIEW */
        <div className="space-y-4 pt-2">
          {/* Sub-question progress pills */}
          <div className="flex items-center justify-between text-xs text-gray-600 font-semibold mb-2">
            <span>
              Question {currentIdx + 1} of {totalQuestions}
            </span>
            <span className="text-teal-600 font-bold">
              {Math.round(((currentIdx + 1) / totalQuestions) * 100)}% Completed
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleQuestions.map((q, idx) => {
              const isActive = idx === currentIdx;
              const qKey = q.key || q.id || '';
              const hasVal = values[qKey] !== undefined && values[qKey] !== '';
              return (
                <button
                  key={qKey || idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : hasVal
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {hasVal && !isActive ? <i className="fas fa-check mr-1 text-teal-600"></i> : null}
                  {idx + 1}. {q.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-teal-50/50 dark:bg-gray-800/50 border border-teal-100 dark:border-gray-700 rounded-xl">
            {renderSingleField(visibleQuestions[currentIdx])}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                currentIdx === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                  : 'bg-white text-teal-700 border-teal-300 hover:bg-teal-50'
              }`}
            >
              <i className="fas fa-arrow-left mr-1"></i> Previous Question
            </button>

            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIdx === totalQuestions - 1}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                currentIdx === totalQuestions - 1
                  ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
              }`}
            >
              Next Question <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
