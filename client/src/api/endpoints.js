export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
export const ENDPOINTS = {
  UPLOAD_PDF: `${API_BASE}/api/upload/pdf`,
  SAVE_MAPPINGS: `${API_BASE}/api/pdf-annotation-mappings/bulk`,
  FETCH_CREATE_TABLE: `${API_BASE}/app_admin/api/fetch-create-table`,
};
