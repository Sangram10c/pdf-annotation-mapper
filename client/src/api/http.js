import axios from 'axios';

export const http = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

export async function uploadPdf(file, url) {
  const form = new FormData();
  form.append('file', file);
  const res = await axios.post(url, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data; // { pdfId, url }
}
