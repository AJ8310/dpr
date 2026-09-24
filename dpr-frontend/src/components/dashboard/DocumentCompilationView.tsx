"use client";

import React, { useState, useEffect } from "react";

interface CompiledDoc {
  document_id: string;
  snapshot_id: string;
  dpr_type: string;
  format: string;
  status: string;
  page_count: number;
  quality_score: number;
  checksum_sha256: string;
  file_size_bytes: number;
  created_at: string;
}

export default function DocumentCompilationView({ projectId, snapshotId }: { projectId: string; snapshotId?: string }) {
  const [documents, setDocuments] = useState<CompiledDoc[]>([]);
  const [compiling, setCompiling] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"PDF" | "DOCX" | "HTML">("PDF");
  const [message, setMessage] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error("Failed to load compiled documents:", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchDocuments();
    }
  }, [projectId]);

  const handleCompile = async () => {
    if (!snapshotId) {
      setMessage("Cannot compile: Project content snapshot not created yet.");
      return;
    }

    setCompiling(true);
    setMessage(`Compiling Document IR into ${selectedFormat} report...`);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/documents/compile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot_id: snapshotId, format: selectedFormat })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Document compiled successfully (${data.page_count} pages, Quality Score: ${data.quality_score}/100)!`);
        fetchDocuments();
      } else {
        setMessage(`Compilation error: ${data.detail || "Validation failed"}`);
      }
    } catch (err) {
      setMessage("Error executing document compiler worker.");
    } finally {
      setCompiling(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Phase 8 Document Compiler Studio</h2>
          <p className="text-sm text-slate-500">
            Compiles read-only DPRContentSnapshot into A4 PDF, native DOCX & HTML reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
          >
            <option value="PDF">PDF Report (Playwright A4)</option>
            <option value="DOCX">Microsoft Word (.docx)</option>
            <option value="HTML">Web Preview (.html)</option>
          </select>

          <button
            onClick={handleCompile}
            disabled={compiling}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition-colors disabled:opacity-50"
          >
            {compiling ? "Compiling..." : "Compile Document"}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
          {message}
        </div>
      )}

      <div>
        <h3 className="text-md font-semibold text-slate-700 mb-3">Compiled Production Artifacts</h3>
        {documents.length === 0 ? (
          <p className="text-sm text-slate-400">No compiled documents generated yet.</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.document_id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{doc.format} Document</span>
                    <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded font-semibold">
                      Quality: {doc.quality_score}/100
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Pages: <strong className="text-slate-700">{doc.page_count}</strong> | Size: {(doc.file_size_bytes / 1024).toFixed(1)} KB | SHA-256: {doc.checksum_sha256?.substring(0, 16)}...
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-emerald-600 uppercase">{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
