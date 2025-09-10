import React, { useState } from 'react';
import UploadPdf from './components/PdfUploader.jsx';
import PdfMapper from './components/PdfMapper.jsx';
import PdfPreview from './components/PdfPreview.jsx';

export default function App() {
  const [upload, setUpload] = useState(null); // { pdfId, url }
  const [processId, setProcessId] = useState(49);
  const [formId, setFormId] = useState(20);

  return (
    <div className="container">
      <h1>PDF Field Mapping & Annotations</h1>

      {!upload && <UploadPdf onUploaded={setUpload} />}

      {upload && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="flex" style={{ alignItems: 'center' }}>
            <div>
              <div className="label">Context</div>
              <div className="flex">
                <input className="input" type="number" value={processId} onChange={(e) => setProcessId(Number(e.target.value))} />
                <input className="input" type="number" value={formId} onChange={(e) => setFormId(Number(e.target.value))} />
              </div>
              <div className="small">process_id · form_id</div>
            </div>
          </div>
        </div>
      )}

      {upload && (
        <>
          <PdfMapper pdfId={upload.pdfId} url={upload.url} processId={processId} formId={formId} />
          <div style={{ height: 24 }} />
          <PdfPreview pdfUrl={upload.url} processId={processId} formId={formId} />
        </>
      )}
    </div>
  );
}
