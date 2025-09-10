import React, { useState } from 'react';
import { ENDPOINTS } from '../api/endpoints';
import { uploadPdf } from '../api/http';

export default function UploadPdf({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const result = await uploadPdf(file, ENDPOINTS.UPLOAD_PDF);
      onUploaded(result); // { pdfId, url }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="label">Upload PDF</div>
      <div className="flex">
        <input className="input" type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="btn" disabled={!file || busy} onClick={handleUpload}>Upload</button>
      </div>
      <div className="small">Server responds with pdfId & a public URL.</div>
    </div>
  );
}
