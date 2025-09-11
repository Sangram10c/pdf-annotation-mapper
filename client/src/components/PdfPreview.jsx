import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { denormalizeBBox } from '../utils/coords.js';
import { http } from '../api/http.js';
import { ENDPOINTS } from '../api/endpoints.js';

// The definitive fix for Vite projects
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

function Highlight({ box }) {
  return (
    <div style={{
      position: 'absolute',
      left: box.x,
      top: box.y,
      width: box.width,
      height: box.height,
      outline: '3px solid #22d3ee',
      background: 'rgba(34, 211, 238, 0.15)'
    }} />
  );
}

export default function PdfPreview({ pdfUrl, processId, formId }) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [pageDims, setPageDims] = useState({});
  const [items, setItems] = useState([]); // API response
  const [active, setActive] = useState(null); // an item to highlight

  useEffect(() => {
    (async () => {
      const { data } = await http.post(ENDPOINTS.FETCH_CREATE_TABLE, { process_id: Number(processId), form_id: Number(formId) });
      setItems(data);
    })();
  }, [processId, formId]);

  function onLoadSuccess({ numPages }) { setNumPages(numPages); }
  function onRenderSuccess(pageNumber, { width, height }) {
    setPageDims((d) => ({ ...d, [pageNumber]: { width, height } }));
  }

  useEffect(() => {
    if (!active) return;
    const el = document.getElementById(`p${active.annotation.page}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [active]);

  return (
    <div className="grid">
      <div className="card">
        <div className="label">PDF Preview</div>
        <div className="scroll" ref={containerRef} style={{ position: 'relative' }}>
          <Document file={pdfUrl} onLoadSuccess={onLoadSuccess}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
              <div key={p} id={`p${p}`} style={{ position: 'relative', marginBottom: 24 }}>
                <Page pageNumber={p} onRenderSuccess={(page) => onRenderSuccess(p, { width: page.width, height: page.height })} renderTextLayer={false} renderAnnotationLayer={false} />
                {pageDims[p] && active?.annotation?.page === p && (
                  <Highlight box={denormalizeBBox(active.annotation.bbox, pageDims[p].width, pageDims[p].height)} />
                )}
              </div>
            ))}
          </Document>
        </div>
      </div>

      <div className="card scroll">
        <div className="label">Fields</div>
        {items.map((it) => (
          <div key={it.id} className="box" style={{ cursor: 'pointer' }} onClick={() => setActive(it)}>
            <div><strong>{it.field_name}</strong> <span className="small">(#{it.annotation.field_id})</span></div>
            <div className="small">{it.field_header} · {it.field_type} · page {it.annotation.page}</div>
          </div>
        ))}
      </div>
    </div>
  );
}