import axios from 'axios';
import { DPRFormData } from '@/types/dpr';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dpr-0eje.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3 minutes timeout for heavy document generation & agent calculations
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const sessionStr = sessionStorage.getItem('dpr_session') || localStorage.getItem('dpr_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.token || session.access_token) {
          config.headers.Authorization = `Bearer ${session.token || session.access_token}`;
        }
      } catch (e) {}
    }
  }
  return config;
});

// Authentication
export async function loginUser(email: string, password: string) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
  role?: string;
  service_type?: string;
}) {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
}

// Blueprint & Questions APIs
export async function createBlueprintProject(projectData: {
  business_name: string;
  dpr_type: string;
  sector_id: string;
  activity_id: string;
  project_scale?: string;
  project_type_id?: string;
  geography_id?: string;
}) {
  const response = await api.post('/api/blueprint/projects', projectData);
  return response.data;
}

export async function getMasterSectors() {
  const response = await api.get('/api/dpr/master/sectors');
  return response.data;
}

export async function getMasterActivities(sectorId: string) {
  const response = await api.get(`/api/dpr/master/sectors/${sectorId}/activities`);
  return response.data;
}

export async function getMasterProjectTypes() {
  const response = await api.get('/api/dpr/master/project-types');
  return response.data;
}

export async function resolveMasterBlueprint(params: {
  dpr_type: string;
  sector_id: string;
  activity_id: string;
  project_type_id?: string;
  project_scale?: string;
}) {
  const response = await api.get('/api/dpr/master/blueprints/resolve', { params });
  return response.data;
}

export async function getDynamicQuestions(blueprintId?: string) {
  const url = blueprintId ? `/api/questions?blueprint_id=${blueprintId}` : '/api/questions';
  const response = await api.get(url);
  return response.data;
}

export async function autosaveResponse(projectId: string, questionKey: string, value: any) {
  const response = await api.put(`/api/projects/${projectId}/responses/${questionKey}`, { value });
  return response.data;
}

export async function batchSaveResponses(projectId: string, responses: Record<string, any>) {
  const response = await api.post(`/api/projects/${projectId}/responses`, { responses });
  return response.data;
}

// Financial Intelligence
export async function calculateFinancials(projectId: string) {
  const response = await api.post(`/api/projects/${projectId}/calculate`);
  return response.data;
}

// Research & Intelligence
export async function runResearchEngine(projectId: string) {
  const response = await api.post(`/api/projects/${projectId}/research/run`);
  return response.data;
}

// Content Generation Engine
export async function generateDPRContent(projectId: string) {
  const response = await api.post(`/api/projects/${projectId}/content/generate`);
  return response.data;
}

export async function createContentSnapshot(projectId: string) {
  const response = await api.post(`/api/projects/${projectId}/content/snapshot`);
  return response.data;
}

// Document Compiler Engine
export async function compileDocument(projectId: string, snapshotId: string, format: 'PDF' | 'DOCX' | 'HTML' = 'PDF') {
  const response = await api.post(`/api/projects/${projectId}/documents/compile`, {
    snapshot_id: snapshotId,
    format: format,
  });
  return response.data;
}

export async function getProjectDocuments(projectId: string) {
  const response = await api.get(`/api/projects/${projectId}/documents`);
  return response.data;
}

// Legacy helpers & Chatbot
export async function saveDPRData(dprData: DPRFormData) {
  const response = await api.post('/api/dpr/save', dprData);
  return response.data;
}

export async function getLatestDraft() {
  const response = await api.get('/api/dpr/latest-draft');
  return response.data;
}

export async function getMyDPRs() {
  const response = await api.get('/api/dpr/my-dprs');
  return response.data;
}

export async function generatePDF(dprData: DPRFormData) {
  const response = await api.post('/api/dpr/generate-pdf', dprData, {
    responseType: 'blob',
  });
  return response.data;
}

export async function uploadBalanceSheet(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/dpr/upload-balance-sheet', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/dpr/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function sendChatMessage(message: string, currentSection?: string) {
  const response = await api.post('/api/assistant/chat', {
    message,
    current_section: currentSection,
  });
  return response.data;
}

export async function autofillFromDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/dpr/autofill-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function autofillFromURL(url: string) {
  const response = await api.post('/api/dpr/autofill-url', { url });
  return response.data;
}

// PMMY / MUDRA Engine Helpers
export async function checkMudraCategory(data: {
  requested_loan: number;
  activity_id?: string;
  is_direct_crop?: boolean;
  previous_tarun_repaid?: boolean;
}) {
  const response = await api.post('/api/mudra/category-check', data);
  return response.data;
}

export async function validateMudraDPR(submissionData: any) {
  const response = await api.post('/api/mudra/validate', submissionData);
  return response.data;
}

export async function generateSubmissionPack(submissionData: any) {
  const response = await api.post('/api/mudra/submission-pack', submissionData);
  return response.data;
}

export default api;
