"use client";

import React, { useState, useEffect } from "react";

interface Section {
  section_key: string;
  title: string;
  display_order: number;
  status: string;
  approval_status: string;
  warnings?: string[];
}

interface ContentPackage {
  id: string;
  dpr_type: string;
  target_depth: string;
  overall_completeness: number;
  sections: Section[];
}

export default function ContentGenerationView({ projectId }: { projectId: string }) {
  const [pkg, setPkg] = useState<ContentPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://dpr-0eje.onrender.com';

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/api/projects/${projectId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPkg(data.package);
      }
    } catch (err) {
      console.error("Failed to load content package:", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchContent();
    }
  }, [projectId]);

  const handleGenerateAll = async () => {
    setLoading(true);
    setMessage("Generating sections dynamically based on blueprint...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/api/projects/${projectId}/content/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setMessage("All sections generated successfully!");
        fetchContent();
      }
    } catch (err) {
      setMessage("Error generating content package.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sectionKey: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${apiBase}/api/projects/${projectId}/content/${sectionKey}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContent();
    } catch (err) {
      console.error("Failed to approve section:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">DPR Content Package Studio</h2>
          <p className="text-sm text-slate-500">
            Phase 7 Structured Narrative, Tables & Provenance Manager
          </p>
        </div>
        <button
          onClick={handleGenerateAll}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate All Sections"}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
          {message}
        </div>
      )}

      {pkg && (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Target Depth</span>
              <div className="text-lg font-bold text-slate-800">{pkg.target_depth}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Overall Completeness</span>
              <div className="text-lg font-bold text-indigo-600">{pkg.overall_completeness}%</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Sections</span>
              <div className="text-lg font-bold text-slate-800">{pkg.sections.length}</div>
            </div>
          </div>

          <h3 className="text-md font-semibold text-slate-700 mb-3">Section Review & Approval</h3>
          <div className="space-y-3">
            {pkg.sections.map((sec) => (
              <div
                key={sec.section_key}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-slate-800">{sec.title}</h4>
                  <span className="text-xs text-slate-400">Key: {sec.section_key}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      sec.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : sec.status === "NEEDS_REVIEW"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {sec.status}
                  </span>
                  {sec.status !== "APPROVED" && (
                    <button
                      onClick={() => handleApprove(sec.section_key)}
                      className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
